"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // 🔥 LOAD USER + PROFILE
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (u) => {
      if (!u) {
        router.replace("/login");
        return;
      }

      setUser(u);

      try {
        const refDoc = doc(db, "valid_profiles", u.uid);
        const snap = await getDoc(refDoc);

        if (snap.exists()) {
          setProfile(snap.data());
        } else {
          console.log("No profile found");
        }
      } catch (err) {
        console.error("Firestore error:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  // 🔥 SAFE REDIRECT (AFTER DATA IS READY)
  useEffect(() => {
    if (!loading && profile) {
      if (profile.onboardingComplete === false) {
        router.replace("/onboarding");
      }
    }
  }, [loading, profile, router]);

  if (loading) {
    return <div style={{ padding: 40 }}>Loading...</div>;
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>DASHBOARD ✅</h1>

      <p>User: {user?.email}</p>

      <p>
        Profile status: {profile ? "Loaded ✅" : "Not found ❌"}
      </p>
    </div>
  );
}
