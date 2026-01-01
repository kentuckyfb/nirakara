import { auth, db, storage } from './firebase';
import {
    collection,
    getDocs,
    getDoc,
    doc,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

export const getProducts = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Firestore fetch failed', error);
        return [];
    }
};

export const getProduct = async (slug: string) => {
    try {
        // Try finding by slug first
        const q = query(collection(db, "products"), where("slug", "==", slug));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            return { id: doc.id, ...doc.data() };
        }

        // Try by ID
        const docRef = doc(db, "products", slug);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        }

        return null;
    } catch (error) {
        console.error('Firestore fetch failed', error);
        return null;
    }
};

export const getConfig = async () => {
    try {
        const docRef = doc(db, "config", "main");
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
        console.error('Firestore fetch failed', error);
        return null;
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

export const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Logout error", error);
    }
};

// Admin functions
export const createProduct = async (formData: FormData, token: string) => {
    try {
        const productData: any = {};
        let imageFile: File | null = null;

        formData.forEach((value, key) => {
            if (key === 'image' && value instanceof File) imageFile = value;
            else productData[key] = value;
        });

        if (imageFile) {
            const storageRef = ref(storage, `products/${Date.now()}-${(imageFile as File).name}`);
            const snapshot = await uploadBytes(storageRef, imageFile);
            productData.image = await getDownloadURL(snapshot.ref);
        }

        // Process fields to ensure correct types for Firebase
        if (productData.priceLKR) productData.priceLKR = Number(productData.priceLKR);
        productData.isFeatured = productData.isFeatured === 'true' || productData.isFeatured === true;
        productData.isVisible = productData.isVisible === 'true' || productData.isVisible === true;

        if (typeof productData.images === 'string') {
            productData.images = productData.images.split(',').map((s: string) => s.trim()).filter(Boolean);
        }
        if (typeof productData.highlights === 'string') {
            productData.highlights = productData.highlights.split(',').map((s: string) => s.trim()).filter(Boolean);
        }

        const docId = productData.slug || `product-${Date.now()}`;
        const docRef = doc(db, "products", docId);
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
        const productData: any = {};
        let imageFile: File | null = null;

        formData.forEach((value, key) => {
            if (key === 'image' && value instanceof File) imageFile = value;
            else productData[key] = value;
        });

        if (imageFile) {
            const storageRef = ref(storage, `products/${Date.now()}-${(imageFile as File).name}`);
            const snapshot = await uploadBytes(storageRef, imageFile);
            productData.image = await getDownloadURL(snapshot.ref);
        }

        if (productData.priceLKR) productData.priceLKR = Number(productData.priceLKR);
        if (productData.isFeatured !== undefined) {
            productData.isFeatured = productData.isFeatured === 'true' || productData.isFeatured === true;
        }
        if (productData.isVisible !== undefined) {
            productData.isVisible = productData.isVisible === 'true' || productData.isVisible === true;
        }

        if (typeof productData.images === 'string') {
            productData.images = productData.images.split(',').map((s: string) => s.trim()).filter(Boolean);
        }
        if (typeof productData.highlights === 'string') {
            productData.highlights = productData.highlights.split(',').map((s: string) => s.trim()).filter(Boolean);
        }

        const docRef = doc(db, "products", id);
        await updateDoc(docRef, productData);
        return { id, ...productData };
    } catch (error) {
        console.error("Error updating product:", error);
        throw error;
    }
};

export const deleteProduct = async (id: string, token: string) => {
    try {
        await deleteDoc(doc(db, "products", id));
        return { success: true };
    } catch (error) {
        console.error("Error deleting product:", error);
        throw error;
    }
};
