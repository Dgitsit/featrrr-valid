"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Dashboard() {
  const [userEmail, setUserEmail] = useState("");
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      console.log("🔥 Auth state changed:", user);

      if (!user) {
        console.log("❌ No user logged in");
        setLoading(false);
        return;
      }

      setUserEmail(user.email || "");

      try {
        console.log("📡 Fetching profile...");

        const refDoc = doc(db, "valid_profiles", user.uid);
        const snap = await getDoc(refDoc);

        console.log("📄 Doc exists:", snap.exists());

        if (!snap.exists()) {
          console.log("🚨 No profile found");
          setProfile(null);
          setLoading(false);
          return;
        }

        const data = snap.data();
        console.log("👤 Profile data:", data);

        setProfile(data);

      } catch (err) {
        console.error("🔥 Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // 🔄 Loading state
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-xl font-bold mb-4">Dashboard</h1>

      <p>Email: {userEmail}</p>

      <p className="mt-2">
        Status:{" "}
        {profile ? "Profile loaded ✅" : "No profile ❌"}
      </p>

      {/* DEBUG DATA */}
      <div className="mt-6 text-xs bg-zinc-900 p-4 rounded">
        <pre>
          {JSON.stringify(profile, null, 2)}
        </pre>
      </div>
    </div>
  );
}
