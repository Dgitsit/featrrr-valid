"use client";

import { auth } from "@/lib/firebase";

export default function PricingPage() {

  const handleUpgrade = async () => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      alert("Please log in");
      return;
    }

    const idToken = await currentUser.getIdToken();

    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ plan: "yearly" }),
    });

    if (res.status === 401) {
      alert("Session expired. Please log in again.");
      return;
    }

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    }
  };

  const handleFreeTier = () => {
  window.location.href = "/onboarding";
};

  return (
    <main className="min-h-screen flex items-center justify-center bg-white p-6">

      <div className="w-full max-w-md space-y-6">

        <h1 className="text-2xl font-bold text-center">
          Choose Your Tier
        </h1>

        {/* FREE */}
        <div className="border rounded-xl p-5">
          <p className="text-lg font-semibold">Free Tier</p>

          <p className="text-sm text-gray-500 mt-1">
            Show accountability without audits
          </p>

          <ul className="text-xs text-gray-500 mt-3 space-y-1">
            <li>• Score capped at 80</li>
            <li>• No persistent disclosures</li>
            <li>• Community monitored</li>
          </ul>

          <button
            onClick={handleFreeTier}
            className="mt-4 w-full border rounded-lg py-2 text-sm hover:bg-gray-50 transition"
          >
            Continue Free
          </button>
        </div>

        {/* PAID */}
        <div className="border rounded-xl p-5">

          <p className="text-lg font-semibold">
            Featrrr Valid
          </p>

          <p className="text-sm text-gray-500 mt-1">
            Full transparency & verification
          </p>

          <div className="flex gap-2 mt-3">
            <span className="px-3 py-1 rounded-full border text-sm">
              $39.99/mo
            </span>
            <span className="px-3 py-1 rounded-full bg-black text-white text-sm">
              $285/year
            </span>
          </div>

          <ul className="text-xs text-gray-500 mt-3 space-y-1">
            <li>• Full score range (0–100)</li>
            <li>• Persistent disclosures</li>
            <li>• Verified badge</li>
          </ul>

          <button
            onClick={handleUpgrade}
            className="mt-4 w-full bg-gradient-to-r from-purple-500 to-orange-400 text-white py-2 rounded-lg font-medium hover:opacity-90 transition"
          >
            Get Verified
          </button>

          <p className="text-xs text-gray-400 mt-2 text-center">
            Secure checkout powered by Stripe
          </p>

        </div>

      </div>
    </main>
  );
}
