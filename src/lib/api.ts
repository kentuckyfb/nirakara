import { auth, db, storage } from './firebase';
import {
    collection,
    getDocs,
    getDoc,
    doc,
    setDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import configData from '@/content/config.json';



export const getProducts = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        return products;
    } catch (error) {
        console.error('Firestore connection failed', error);
        return [];
    }
};

export const getProduct = async (slug: string) => {
    try {
        // First try to find by slug
        const q = query(collection(db, "products"), where("slug", "==", slug));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            return { id: doc.id, ...doc.data() };
        }

        // If not found by slug, try by ID (if slug is actually an ID)
        const docRef = doc(db, "products", slug);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        }

        return null;
    } catch (error) {
        console.error('Firestore connection failed', error);
        return null;
    }
};

export const getConfig = async () => {
    try {
        const docRef = doc(db, "config", "main");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data();
        }
        // Return static config as fallback (config is static data)
        return configData;
    } catch (error) {
        console.warn('Firestore connection failed, using static config', error);
        return configData;
    }
};

export const login = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const token = await user.getIdToken();
        return { token, user: { email: user.email, uid: user.uid } };
    } catch (error) {
        console.error("Login error", error);
        throw error;
    }
};

// Admin functions
export const createProduct = async (formData: FormData, token: string) => {
    try {
        // 1. Extract data from FormData
        const productData: any = {};
        let imageFile: File | null = null;

        formData.forEach((value, key) => {
            if (key === 'image' && value instanceof File) {
                imageFile = value;
            } else {
                productData[key] = value;
            }
        });

        // 2. Upload Image to Storage
        if (imageFile) {
            const storageRef = ref(storage, `products/${Date.now()}-${(imageFile as File).name}`);
            const snapshot = await uploadBytes(storageRef, imageFile);
            const downloadURL = await getDownloadURL(snapshot.ref);
            productData.image = downloadURL;
        }

        // 3. Process other fields
        if (productData.priceLKR) productData.priceLKR = Number(productData.priceLKR);

        // Handle checkboxes - if not present in FormData, it means unchecked
        productData.isFeatured = productData.isFeatured === 'true' || productData.isFeatured === true;
        productData.isVisible = productData.isVisible === 'true' || productData.isVisible === true;

        // Process array fields if they're strings
        if (typeof productData.images === 'string') {
            productData.images = productData.images.split(',').map((s: string) => s.trim()).filter(Boolean);
        } else if (!productData.images) {
            productData.images = [];
        }

        if (typeof productData.highlights === 'string') {
            productData.highlights = productData.highlights.split(',').map((s: string) => s.trim()).filter(Boolean);
        } else if (!productData.highlights) {
            productData.highlights = [];
        }

        // 4. Save to Firestore
        // Use slug as ID if available, otherwise auto-ID
        const docId = productData.slug || `product-${Date.now()}`;
        const docRef = doc(db, "products", docId);

        // Ensure id field is set
        productData.id = docId;

        await setDoc(docRef, productData);
        return { id: docId, ...productData };
    } catch (error) {
        console.error("Error creating product:", error);
        throw error;
    }
};

export const updateProduct = async (id: string, formData: FormData, token: string) => {
    try {
        // 1. Extract data
        const productData: any = {};
        let imageFile: File | null = null;

        formData.forEach((value, key) => {
            if (key === 'image' && value instanceof File) {
                imageFile = value;
            } else {
                productData[key] = value;
            }
        });

        // 2. Upload New Image if provided
        if (imageFile) {
            const storageRef = ref(storage, `products/${Date.now()}-${(imageFile as File).name}`);
            const snapshot = await uploadBytes(storageRef, imageFile);
            const downloadURL = await getDownloadURL(snapshot.ref);
            productData.image = downloadURL;
        }

        // 3. Process fields
        if (productData.priceLKR) productData.priceLKR = Number(productData.priceLKR);

        // Handle checkboxes - if not present in FormData, it means unchecked
        productData.isFeatured = productData.isFeatured === 'true' || productData.isFeatured === true;
        productData.isVisible = productData.isVisible === 'true' || productData.isVisible === true;

        // Process array fields if they're strings
        if (typeof productData.images === 'string') {
            productData.images = productData.images.split(',').map((s: string) => s.trim()).filter(Boolean);
        } else if (productData.images === '') {
            productData.images = [];
        }

        if (typeof productData.highlights === 'string') {
            productData.highlights = productData.highlights.split(',').map((s: string) => s.trim()).filter(Boolean);
        } else if (productData.highlights === '') {
            productData.highlights = [];
        }

        // 4. Update Firestore
        // We need to find the document reference. ID passed might be slug or doc ID.
        // Ideally we should use doc ID, but let's try to handle both or assume ID is passed correctly.
        // In Admin.tsx, we are passing product.id.

        // Check if doc exists with this ID
        let docRef = doc(db, "products", id);
        let docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            // Try finding by slug if ID didn't work (legacy support)
            const q = query(collection(db, "products"), where("slug", "==", id));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                docRef = querySnapshot.docs[0].ref;
            } else {
                throw new Error("Product not found");
            }
        }

        await updateDoc(docRef, productData);
        return { id, ...productData };

    } catch (error) {
        console.error("Error updating product:", error);
        throw error;
    }
};

export const deleteProduct = async (id: string, token: string) => {
    try {
        let docRef = doc(db, "products", id);
        let docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            // Try finding by slug
            const q = query(collection(db, "products"), where("slug", "==", id));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                docRef = querySnapshot.docs[0].ref;
                docSnap = querySnapshot.docs[0];
            } else {
                throw new Error("Product not found");
            }
        }

        // Optional: Delete image from storage if needed
        // const data = docSnap.data();
        // if (data?.image && data.image.includes('firebasestorage')) { ... }

        await deleteDoc(docRef);
        return { success: true };
    } catch (error) {
        console.error("Error deleting product:", error);
        throw error;
    }
};
