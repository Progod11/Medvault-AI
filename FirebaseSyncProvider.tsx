"use client";

import React, { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { getUserData, UserData } from "@/lib/dataStore";

export const SyncContext = React.createContext<{ 
  isSynced: boolean;
  uid: string | null;
  isAnonymous: boolean;
}>({ 
  isSynced: false,
  uid: null,
  isAnonymous: false
});

export function FirebaseSyncProvider({ children }: { children: React.ReactNode }) {
  const [isSynced, setIsSynced] = React.useState(false);
  const [uid, setUid] = React.useState<string | null>(null);
  const [isAnonymous, setIsAnonymous] = React.useState(false);

  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | null = null;

    // Reset logic: Clear old local data to start fresh as requested
    const performReset = () => {
      if (typeof window !== "undefined" && !localStorage.getItem("medvault_v2_reset")) {
        console.log("MedVault AI: Resetting local persistence for clean cloud-first state...");
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.startsWith("medvault_") || key.includes("store"))) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));
        localStorage.setItem("medvault_v2_reset", "true");
        window.location.reload();
      }
    };

    performReset();

    const setupSyncForUidAndEmail = async (authUid: string | null, email: string) => {
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
        unsubscribeSnapshot = null;
      }

      setUid(authUid);

      if (!authUid) {
        console.log("No authenticated cloud session. Login required for cloud sync.");
        setIsSynced(true);
        return;
      }

      // New collection for clean start as requested
      const userRef = doc(db, "user_profiles_v2", authUid);

      // Handle Migration and Listeners
      try {
        const uidSnap = await getDoc(userRef);
        
        if (!uidSnap.exists()) {
          console.log("Creating clean cloud profile for UID:", authUid);
          const cleanData = getUserData(email);
          await setDoc(userRef, {
            ...cleanData,
            email,
            createdAt: new Date().toISOString()
          }, { merge: true });
        }
      } catch (err) {
        console.warn("Pre-sync check error:", err);
      }

      // Listen to Firestore
      unsubscribeSnapshot = onSnapshot(
        userRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const firestoreData = snapshot.data() as UserData;
            
            // Sync to local storage strictly as a cache
            const uidKey = `medvault_user_store_${authUid}`;
            const dataString = JSON.stringify(firestoreData);
            localStorage.setItem(uidKey, dataString);
            localStorage.setItem("medvault_user_uid", authUid);
            localStorage.setItem("medvault_user_email", firestoreData.email || email);

            window.sessionStorage.setItem(`medvault_sync_complete_${authUid}`, "true");
            window.dispatchEvent(new CustomEvent("medvault_data_updated", { detail: { email, uid: authUid } }));
            setIsSynced(true);
          } else {
            // New user case: document doesn't exist yet
            console.log("No existing cloud data found for UID:", authUid);
            window.sessionStorage.setItem(`medvault_sync_complete_${authUid}`, "true");
            setIsSynced(true);
          }
        },
        (error) => {
          console.error("Firestore sync error:", error);
          // Still mark as synced to prevent blocking the UI, but it might fail writes
          window.sessionStorage.setItem(`medvault_sync_complete_${authUid}`, "true");
          setIsSynced(true); 
        }
      );
    };

    // Listen to Auth State
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAnonymous(user.isAnonymous);
        setupSyncForUidAndEmail(user.uid, user.email || `anon_${user.uid}@medvault.ai`);
      } else {
        setIsAnonymous(false);
        setUid(null);
        setIsSynced(true);
        if (unsubscribeSnapshot) {
          unsubscribeSnapshot();
          unsubscribeSnapshot = null;
        }
      }
    });

    return () => {
      if (unsubscribeSnapshot) unsubscribeSnapshot();
      unsubscribeAuth();
    };
  }, []);

  return (
    <SyncContext.Provider value={{ isSynced, uid, isAnonymous }}>
      {children}
    </SyncContext.Provider>
  );
}
