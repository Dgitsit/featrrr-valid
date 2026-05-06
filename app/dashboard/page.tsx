"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Dashboard() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) return;

      const ref = doc(db, "valid_profiles", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setProfile(snap.data());
      } else {
        setProfile({});
      }
    });

    return () => unsubscribe();
  }, []);

  if (!profile) {
    return <div className="text-white p-10">Loading...</div>;
  }

  return (
    <div className="text-white p-10">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <p>Email: {profile.email || "No email"}</p>
      <p>Status: {profile.subscriptionStatus || "none"}</p>
    </div>
  );
}
