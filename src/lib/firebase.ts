import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBHGLtc2181fKw1S308HFa3lxyyIHmERTI",
    authDomain: "nirakara-fe982.firebaseapp.com",
    projectId: "nirakara-fe982",
    storageBucket: "nirakara-fe982.firebasestorage.app",
    messagingSenderId: "619193606874",
    appId: "1:619193606874:web:cabe84dbd79b9372b8bbe3",
    measurementId: "G-SNXS5M0JXR"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
