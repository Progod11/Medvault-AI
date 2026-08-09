import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import fs from "fs";
import path from "path";

const configPath = path.join(process.cwd(), "firebase-applet-config.json");
const configData = JSON.parse(fs.readFileSync(configPath, "utf-8"));

const firebaseConfig = {
  apiKey: configData.apiKey,
  authDomain: configData.authDomain,
  projectId: configData.projectId,
  storageBucket: configData.storageBucket,
  messagingSenderId: configData.messagingSenderId,
  appId: configData.appId,
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const databaseId = configData.firestoreDatabaseId || "(default)";
const db = getFirestore(app, databaseId);
const auth = getAuth(app);

const premiumData = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "premium_user_data.json"), "utf-8"));
const freeData = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "free_user_data.json"), "utf-8"));

async function getOrCreateUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user.uid;
  } catch (error) {
    if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user.uid;
      } catch (createError) {
        console.error(`Failed to create user ${email}:`, createError.message);
        throw createError;
      }
    }
    console.error(`Failed to sign in as ${email}:`, error.message);
    throw error;
  }
}

async function seed() {
  console.log("Seeding Firestore with MedVault AI demo accounts...");

  try {
    // 1. Seed Premium Demo
    const premiumUid = await getOrCreateUser("premium@medvault.ai", "demo123");
    await setDoc(doc(db, "user_profiles_v2", premiumUid), {
      ...premiumData,
      lastSyncedAt: new Date().toISOString()
    }, { merge: true });
    console.log(`Successfully written user_profiles_v2/${premiumUid} (premium@medvault.ai) to Firestore`);

    // 2. Seed Free Demo
    const freeUid = await getOrCreateUser("free@medvault.ai", "demo123");
    await setDoc(doc(db, "user_profiles_v2", freeUid), {
      ...freeData,
      lastSyncedAt: new Date().toISOString()
    }, { merge: true });
    console.log(`Successfully written user_profiles_v2/${freeUid} (free@medvault.ai) to Firestore`);

    console.log("Firestore seeding complete!");
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
  
  process.exit(0);
}

seed();
