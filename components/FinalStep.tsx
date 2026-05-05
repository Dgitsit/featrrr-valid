"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { createOrUpdateUserProfile } from "@/lib/createUserProfile";

export default function FinalStep() {
  const [plan, setPlan] = useState<"monthly" | "yearly">("yearly");
  const [loading, setLoading] = useState(false);

  const user = auth.currentUser;

  // 🟢 FREE FLOW
  const handleFree = async () => {
    if (!user) return;

    try {
      setLoading(true);

      await createOrUpdateUserProfile(user.uid, {
        subscriptionStatus: "inactive",
        onboardingComplete: true,
      });

      window.location.replace("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Error continuing");
    } finally {
      setLoading(false);
    }
  };

  // 💳 UPGRADE FLOW
  const handleUpgrade = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // 🔥 SET PENDING BEFORE STRIPE
      await createOrUpdateUserProfile(user.uid, {
        subscriptionStatus: "pending",
      });

      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan,
          userId: user.uid,
          email: user.email,
        }),
      });

      const data = await res.json();

      if (!data.url) throw new Error("No checkout URL");

      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      alert("Upgrade failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-6">
      <div className="bg-gray-900 p-8 rounded-2xl w-full max-w-md border border-gray-800">

        <h1 className="text-2xl font-semibold mb-2 text-center">
          Finish Setup
        </h1>

        <p className="text-sm text-gray-400 text-center mb-6">
          Choose how you want to start your Featrrr Valid profile
        </p>

        {/* FREE */}
        <div className="border border-gray-700 rounded-xl p-4 mb-6">
          <p className="font-semibold mb-2">Start Free</p>

          <p className="text-xs text-gray-400 mb-4">
            Build your transparency profile and upgrade anytime
          </p>

          <button
            onClick={handleFree}
            disabled={loading}
            className="w-full bg-white text-black py-3 rounded-lg"
          >
            {loading ? "Loading..." : "Continue Free"}
          </button>
        </div>

        {/* UPGRADE */}
        <div className="border border-gray-700 rounded-xl p-4">

          <p className="font-semibold mb-3">
            Get Verified (Featrrr Valid)
          </p>

          {/* PLAN TOGGLE */}
          <div className="flex gap-2 mb-4">

            <button
              onClick={() => setPlan("monthly")}
              className={`flex-1 py-2 rounded-full text-sm ${
                plan === "monthly"
                  ? "bg-white text-black"
                  : "bg-black text-gray-300 border border-gray-700"
              }`}
            >
              $39.99/mo
            </button>

            <button
              onClick={() => setPlan("yearly")}
              className={`flex-1 py-2 rounded-full text-sm ${
                plan === "yearly"
                  ? "bg-white text-black"
                  : "bg-black text-gray-300 border border-gray-700"
              }`}
            >
              $285/year
            </button>

          </div>

          <p className="text-xs text-gray-400 mb-4">
            Higher starting score + verified trust badge
          </p>

          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-orange-400 py-3 rounded-lg"
          >
            {loading ? "Redirecting..." : "Upgrade & Get Verified"}
          </button>

          <p className="text-xs text-gray-500 mt-3 text-center">
            Secure checkout powered by Stripe
          </p>

        </div>

      </div>
    </div>
  );
}
