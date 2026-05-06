"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Dashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        window.location.replace("/login");
        return;
      }

      try {
        const ref = doc(db, "valid_profiles", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();

          // 🔥 SAFE REDIRECT LOGIC
          if (!data?.onboardingComplete) {
            window.location.replace("/onboarding");
            return;
          }

          setProfile(data);
        } else {
          setProfile({});
        }
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // 🔄 LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 bg-black">
        Loading dashboard...
      </div>
    );
  }

  // ❌ FAIL SAFE
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 bg-black">
        Failed to load profile
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <p>Email: {profile.email || "No email"}</p>
      <p>Status: {profile.subscriptionStatus || "inactive"}</p>

      <div className="mt-6 text-sm text-gray-400">
        ✅ Dashboard loaded successfully
      </div>
    </div>
  );
}
