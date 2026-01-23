import fs from "fs";
import path from "path";
import process from "process";
import { fileURLToPath } from "url";
import crypto from "crypto";
import admin from "firebase-admin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const serviceAccountArgIndex = args.findIndex((arg) => arg === "--service-account");
const serviceAccountPath =
  serviceAccountArgIndex >= 0 ? args[serviceAccountArgIndex + 1] : null;

if (!serviceAccountPath) {
  console.error("Missing --service-account <path>");
  process.exit(1);
}

const resolvedServiceAccountPath = path.resolve(process.cwd(), serviceAccountPath);
if (!fs.existsSync(resolvedServiceAccountPath)) {
  console.error(`Service account file not found: ${resolvedServiceAccountPath}`);
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(resolvedServiceAccountPath, "utf8"));
const bucketName =
  process.env.FIREBASE_STORAGE_BUCKET || `${serviceAccount.project_id}.appspot.com`;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: bucketName,
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

const repoRoot = path.resolve(__dirname, "..");
const productsPath = path.join(repoRoot, "public", "products", "products.json");

if (!fs.existsSync(productsPath)) {
  console.error(`Products JSON not found: ${productsPath}`);
  process.exit(1);
}

const products = JSON.parse(fs.readFileSync(productsPath, "utf8"));
if (!Array.isArray(products)) {
  console.error("Products JSON must be an array.");
  process.exit(1);
}

const uploadCache = new Map();

const toStorageUrl = (filePath, token) =>
  `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(
    filePath
  )}?alt=media&token=${token}`;

const uploadImage = async (imagePath) => {
  if (!imagePath) return null;
  if (uploadCache.has(imagePath)) return uploadCache.get(imagePath);

  const normalized = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;
  const localPath = path.join(repoRoot, "public", normalized);
  if (!fs.existsSync(localPath)) {
    console.warn(`Image not found, skipping upload: ${localPath}`);
    uploadCache.set(imagePath, imagePath);
    return imagePath;
  }

  const fileName = path.basename(normalized);
  const storagePath = `products/${fileName}`;
  const token = crypto.randomUUID();

  await bucket.upload(localPath, {
    destination: storagePath,
    metadata: {
      contentType: "image/png",
      metadata: {
        firebaseStorageDownloadTokens: token,
      },
    },
  });

  const url = toStorageUrl(storagePath, token);
  uploadCache.set(imagePath, url);
  return url;
};

const deleteAllProducts = async () => {
  const docs = await db.collection("products").listDocuments();
  if (!docs.length) {
    console.log("No products to delete.");
    return;
  }
  const batch = db.batch();
  docs.forEach((docRef) => batch.delete(docRef));
  await batch.commit();
  console.log(`Deleted ${docs.length} products.`);
};

const uploadProducts = async () => {
  const batch = db.batch();
  let count = 0;

  for (const product of products) {
    const docId = product.slug || product.id;
    if (!docId) {
      console.warn("Skipping product with no slug/id:", product);
      continue;
    }

    const imageUrl = await uploadImage(product.image);
    const images = Array.isArray(product.images) ? product.images : [];
    const uploadedImages = [];
    for (const img of images) {
      const url = await uploadImage(img);
      if (url) uploadedImages.push(url);
    }

    const data = {
      ...product,
      id: docId,
      image: imageUrl,
      images: uploadedImages.length ? uploadedImages : imageUrl ? [imageUrl] : [],
      isVisible: product.isVisible ?? true,
    };

    const docRef = db.collection("products").doc(docId);
    batch.set(docRef, data, { merge: true });
    count += 1;
  }

  if (!count) {
    console.log("No products uploaded.");
    return;
  }

  await batch.commit();
  console.log(`Uploaded ${count} products.`);
};

const run = async () => {
  console.log("Deleting products...");
  await deleteAllProducts();
  console.log("Uploading products and images...");
  await uploadProducts();
  console.log("Done.");
};

run().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
