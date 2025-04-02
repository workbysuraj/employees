// Import necessary Firebase modules
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyDHKAvu9VCz83LHimlpl3FyR1pzsOc-URE",
  authDomain: "suraj-35feb.firebaseapp.com",
  projectId: "suraj-35feb",
  storageBucket: "suraj-35feb.appspot.com",  // Fixed storage bucket URL
  messagingSenderId: "96209477818",
  appId: "1:96209477818:web:f831dfe2ec96634ab02283",
  measurementId: "G-PHGBFSZWT9",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const db = getFirestore(app); // Firestore (Database)
const auth = getAuth(app); // Firebase Authentication

// Export Firebase services
export { app, db, auth };