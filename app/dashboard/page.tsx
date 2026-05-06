"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Dashboard() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [status, setStatus] = useState("Loading...");
  const router = useRouter();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.replace("/login");
        return;
      }

      setUserEmail(user.email);

      try {
        const ref = doc(db, "valid_profiles", user.uid);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          router.replace("/onboarding");
          return;
        }

        const data = snap.data();

        // 🔥 SAFE REDIRECT (NO window.location)
        if (!data?.onboardingComplete) {
          router.replace("/onboarding");
          return;
        }

        setStatus("Profile loaded ✅");
      } catch (err) {
        console.error(err);
        setStatus("Error loading profile ❌");
      }
    });

    return () => unsub();
  }, [router]);

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Email: {userEmail}</p>
      <p>Status: {status}</p>
    </div>
  );
}
