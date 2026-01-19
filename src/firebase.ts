// Firebase Configuration
// Replace these values with your Firebase project credentials

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// TODO: Replace with your Firebase config
// Get these values from Firebase Console > Project Settings > General > Your apps
const firebaseConfig = {
    apiKey: "AIzaSyBareCtRZNXJOy4-ECc_vj2QJ23g0x28Ek",
    authDomain: "loginfirebase-d3778.firebaseapp.com",
    projectId: "loginfirebase-d3778",
    storageBucket: "loginfirebase-d3778.firebasestorage.app",
    messagingSenderId: "1079561541988",
    appId: "1:1079561541988:web:8d96aa1d45fe0572b58271",
    measurementId: "G-99XTQ4JXGN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

export default app;
