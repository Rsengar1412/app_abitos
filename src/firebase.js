import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB-Edy9B_TXOrZZKKXOJ9gLct08Xt6OIRY",
    authDomain: "app-habitos-a607c.firebaseapp.com",
    projectId: "app-habitos-a607c",
    storageBucket: "app-habitos-a607c.firebasestorage.app",
    messagingSenderId: "950063794643",
    appId: "1:950063794643:web:3383eded3bec014dae0726"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
