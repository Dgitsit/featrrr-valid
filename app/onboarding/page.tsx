"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();

  const [displayName, setDisplayName] = useState("");
  const [instagram, setInstagram] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔒 BACK BUTTON PROTECTION
  useEffect(() => {
    const handleBack = () => {
      window.history.pushState(null, "", window.location.href);
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handleBack);

    return () => {
      window.removeEventListener("popstate", handleBack);
    };
  }, []);

  const handleFinish = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert("User not found");
      return;
    }

    if (!displayName) {
      alert("Display name required");
      return;
    }

    try {
      setLoading(true);

      await updateDoc(doc(db, "valid_profiles", user.uid), {
        displayName,
        onboardingComplete: true,
        socials: {
          instagram: {
            username: instagram || "",
            verified: false,
          },
        },
      });

      // 🚀 IMPORTANT: replace (NOT push)
      router.replace("/dashboard");

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md space-y-6">

        <h1 className="text-2xl font-bold text-center">
          Complete Your Profile
        </h1>

        {/* DISPLAY NAME */}
        <input
          type="text"
          placeholder="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full p-3 rounded bg-zinc-800 border border-zinc-700"
        />

        {/* INSTAGRAM */}
        <input
          type="text"
          placeholder="Instagram (optional)"
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
          className="w-full p-3 rounded bg-zinc-800 border border-zinc-700"
        />

        {/* BUTTON */}
        <button
          onClick={handleFinish}
          disabled={loading}
          className="w-full p-3 rounded bg-gradient-to-r from-purple-500 to-orange-400 font-semibold"
        >
          {loading ? "Finishing..." : "Finish Onboarding"}
        </button>

      </div>
    </div>
  );
}
