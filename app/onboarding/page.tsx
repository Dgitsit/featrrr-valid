"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { createOrUpdateUserProfile } from "@/lib/createUserProfile";

export default function OnboardingPage() {
  const [displayName, setDisplayName] = useState("");
  const [instagram, setInstagram] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFinish = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert("User not found");
      return;
    }

    if (!displayName) {
      alert("Please enter a display name");
      return;
    }

    try {
      setLoading(true);

      await createOrUpdateUserProfile(user.uid, {
        displayName,
        onboardingComplete: true,

        // 👇 prepare for future features
        socials: {
          instagram: {
            username: instagram || "",
            verified: false,
          },
        },
      });

      // 🚀 go to dashboard
      window.location.href = "/dashboard";

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
          {loading ? "Saving..." : "Finish Onboarding"}
        </button>

      </div>
    </div>
  );
}
