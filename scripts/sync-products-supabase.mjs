import fs from "fs";
import path from "path";
import process from "process";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const getArg = (flag) => {
  const idx = args.findIndex((arg) => arg === flag);
  return idx >= 0 ? args[idx + 1] : null;
};

const supabaseUrl = getArg("--supabase-url") || process.env.SUPABASE_URL;
const supabaseKey = getArg("--supabase-key") || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const bucket = getArg("--bucket") || "products";

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials. Provide --supabase-url and --supabase-key or set env vars.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

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

const uploadImage = async (imagePath) => {
  if (!imagePath) return null;
  const normalized = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;
  const localPath = path.join(repoRoot, "public", normalized);
  if (!fs.existsSync(localPath)) {
    console.warn(`Image not found, skipping upload: ${localPath}`);
    return imagePath;
  }

  const fileName = path.basename(normalized);
  const storagePath = `products/${fileName}`;
  const buffer = fs.readFileSync(localPath);

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(storagePath, buffer, {
      upsert: true,
      contentType: "image/png",
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath);
  return data.publicUrl;
};

const mapToDb = (product) => ({
  id: product.slug || product.id,
  slug: product.slug,
  name: product.name,
  unit_code: product.unitCode ?? null,
  category: product.category ?? null,
  price_lkr: product.priceLKR ?? null,
  image: product.image ?? null,
  short_description: product.shortDescription ?? null,
  description: product.description ?? null,
  images: product.images ?? [],
  highlights: product.highlights ?? [],
  is_featured: product.isFeatured ?? false,
  is_visible: product.isVisible ?? true,
  finish: product.finish ?? null,
  weight: product.weight ?? null,
});

const run = async () => {
  console.log("Uploading images and seeding products...");
  const payload = [];

  for (const product of products) {
    const imageUrl = await uploadImage(product.image);
    const images = Array.isArray(product.images) ? product.images : [];
    const uploadedImages = [];
    for (const img of images) {
      const url = await uploadImage(img);
      if (url) uploadedImages.push(url);
    }

    payload.push(
      mapToDb({
        ...product,
        id: product.slug || product.id,
        image: imageUrl,
        images: uploadedImages.length ? uploadedImages : imageUrl ? [imageUrl] : [],
        isVisible: product.isVisible ?? true,
      })
    );
  }

  const { error } = await supabase.from("products").upsert(payload, { onConflict: "id" });
  if (error) {
    throw error;
  }

  console.log(`Uploaded ${payload.length} products.`);
};

run().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
