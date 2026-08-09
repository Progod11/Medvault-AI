import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import firebaseConfigJson from "../firebase-applet-config.json" with { type: "json" };

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || (firebaseConfigJson as any).apiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || (firebaseConfigJson as any).authDomain,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || (firebaseConfigJson as any).projectId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || (firebaseConfigJson as any).storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || (firebaseConfigJson as any).messagingSenderId,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || (firebaseConfigJson as any).appId,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || (firebaseConfigJson as any).measurementId,
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

// Use the specific database ID from config if present
const databaseId = (firebaseConfigJson as Record<string, string>).firestoreDatabaseId || "(default)";
export const db = getFirestore(app, databaseId);
export const storage = getStorage(app);

export default app;
