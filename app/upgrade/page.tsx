"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { createOrUpdateUserProfile } from "@/lib/createUserProfile";

export default function UpgradePage() {
  const [plan, setPlan] = useState<"monthly" | "yearly">("yearly");
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert("You must be logged in");
      return;
    }

    try {
      setLoading(true);

      // 🔥 SET STATUS TO PENDING (SAFE WAY)
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
    <main className="min-h-screen flex items-center justify-center bg-black text-white px-6">
      <div className="bg-gray-900 p-8 rounded-2xl w-full max-w-md border border-gray-800">

        <h1 className="text-2xl font-semibold mb-2 text-center">
          Upgrade to Featrrr Valid
        </h1>

        <p className="text-sm text-gray-400 text-center mb-6">
          Unlock full transparency & higher trust score
        </p>

        {/* PLAN TOGGLE */}
        <div className="flex gap-2 mb-6">

          <button
            onClick={() => setPlan("monthly")}
            className={`flex-1 py-2 rounded-full border text-sm ${
              plan === "monthly"
                ? "bg-white text-black"
                : "bg-black text-gray-300 border-gray-700"
            }`}
          >
            $39.99/mo
          </button>

          <button
            onClick={() => setPlan("yearly")}
            className={`flex-1 py-2 rounded-full border text-sm ${
              plan === "yearly"
                ? "bg-white text-black"
                : "bg-black text-gray-300 border-gray-700"
            }`}
          >
            $285/year
          </button>

        </div>

        {/* CTA */}
        <button
          onClick={handleUpgrade}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-500 to-orange-400 text-white py-3 rounded-lg"
        >
          {loading ? "Redirecting..." : "Upgrade Subscription"}
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          Secure checkout powered by Stripe
        </p>

      </div>
    </main>
  );
}
