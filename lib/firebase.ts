// lib/firebase.ts

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// 🔥 Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB7VKlGllvulop2FZsB4n0cATu9Wys7bLU",
  authDomain: "featrrr-web.firebaseapp.com",
  projectId: "featrrr-web",
  storageBucket: "featrrr-web.appspot.com", // ✅ FIXED (.com not .app)
  messagingSenderId: "409990044829",
  appId: "1:409990044829:web:c913040503a3db939f4874",
  measurementId: "G-62Y53NLKJ4",
};

// ✅ Prevent multiple Firebase instances (VERY IMPORTANT for Next.js)
export const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

// ✅ Only run analytics in browser
let analytics: ReturnType<typeof getAnalytics> | undefined;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

// ✅ Core services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// (optional export if you want it elsewhere)
export { analytics };
