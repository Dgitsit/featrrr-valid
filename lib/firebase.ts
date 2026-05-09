// lib/firebase.ts

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

// 🔥 Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB7VKlGllvulop2FZsB4n0cATu9Wys7bLU",
  authDomain: "featrrr-web.firebaseapp.com",
  projectId: "featrrr-web",

  // 🚨 IMPORTANT: MUST MATCH FIREBASE STORAGE EXACTLY
  storageBucket: "featrrr-web.firebasestorage.app",

  messagingSenderId: "409990044829",
  appId: "1:409990044829:web:c913040503a3db939f4874",
  measurementId: "G-62Y53NLKJ4",
};

// ✅ Prevent duplicate apps (Next.js safe)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// ✅ Core services
export const auth = getAuth(app);
export const db = getFirestore(app);

// 🔥 IMPORTANT: explicitly bind storage to bucket
export const storage = getStorage(app, "gs://featrrr-web.firebasestorage.app");

// ✅ Analytics (safe for Next.js)
export let analytics: ReturnType<typeof getAnalytics> | null = null;

if (typeof window !== "undefined") {
  isSupported().then((yes) => {
    if (yes) {
      analytics = getAnalytics(app);
    }
  });
}

export default app;
