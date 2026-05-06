"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.replace("/login");
        return;
      }

      try {
        const ref = doc(db, "valid_profiles", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();

          // 🔥 SAFE REDIRECT (CLIENT ONLY)
          if (!data?.onboardingComplete) {
            router.replace("/onboarding");
            return;
          }

          setProfile(data);
        } else {
          setProfile({});
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-red-500">
        Failed to load profile
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <p>Email: {profile.email || "No email"}</p>
      <p>Status: {profile.subscriptionStatus || "inactive"}</p>

      <p className="mt-4 text-green-400">✅ Stable Dashboard</p>
    </div>
  );
}
