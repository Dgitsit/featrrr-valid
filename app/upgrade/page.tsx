"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

export default function UpgradePage() {
  const [plan, setPlan] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    try {
      setLoading(true);

      // 🔥 CALL STRIPE API
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();

      // 🔥 REDIRECT TO STRIPE
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Stripe not configured yet (test mode)");
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-16 flex flex-col items-center">

      {/* 🔥 HERO */}
      <h1 className="text-3xl font-bold text-center max-w-xl">
        Become a Creator Brands Trust
      </h1>

      <p className="text-gray-400 text-center mt-4 max-w-md">
        Audiences follow trust. Brands discover you, evaluate your 
        score and sponsor with confidence - powered by Featrrr Valid.  
      </p>

      {/* 🔥 PRICING TOGGLE */}
      <div className="flex gap-2 mt-10 bg-[#111] p-1 rounded-lg">
        <button
          onClick={() => setPlan("monthly")}
          className={`px-4 py-2 rounded ${
            plan === "monthly"
              ? "bg-white text-black"
              : "text-gray-400"
          }`}
        >
          Monthly
        </button>

        <button
          onClick={() => setPlan("yearly")}
          className={`px-4 py-2 rounded ${
            plan === "yearly"
              ? "bg-white text-black"
              : "text-gray-400"
          }`}
        >
          Yearly
        </button>
      </div>

      {/* 🔥 PRICE */}
      <div className="mt-6 text-center">
        <p className="text-4xl font-bold">
          {plan === "monthly" ? "$39.99/mo" : "$285/yr"}
        </p>

        {plan === "yearly" && (
          <p className="text-green-400 text-sm mt-1">
            Save ~40% yearly
          </p>
        )}
      </div>

      {/* 🔥 BENEFITS */}
      <div className="mt-10 grid gap-4 max-w-md w-full">

        <div className="bg-[#111] p-4 rounded-xl">
          <h2 className="font-semibold">
            ✔ Brands trust validated creators
          </h2>
          <p className="text-gray-400 text-sm">
            Your profile signals credibility instantly
          </p>
        </div>

        <div className="bg-[#111] p-4 rounded-xl">
          <h2 className="font-semibold">
            ✔ Higher visibility
          </h2>
          <p className="text-gray-400 text-sm">
            Valid profiles are surfaced more often
          </p>
        </div>

        <div className="bg-[#111] p-4 rounded-xl">
          <h2 className="font-semibold">
            ✔ Stand out instantly
          </h2>
          <p className="text-gray-400 text-sm">
            Separate yourself from unverified creators
          </p>
        </div>

        <div className="bg-[#111] p-4 rounded-xl">
          <h2 className="font-semibold">
            ✔ Build long-term credibility
          </h2>
          <p className="text-gray-400 text-sm">
            Trust compounds with activity and transparency
          </p>
        </div>

      </div>

      {/* 🔥 SCORE PSYCHOLOGY */}
      <div className="mt-10 text-center">
        <p className="text-sm text-gray-400">
          Most creators stay at 60–70
        </p>

        <p className="text-xl font-semibold mt-2">
          Valid creators push 80+
        </p>
      </div>

      {/* 🔥 CTA */}
      <div className="mt-10 w-full max-w-md">
        <Button onClick={handleUpgrade} full>
          {loading
            ? "Redirecting..."
            : `Upgrade (${plan === "monthly" ? "$39.99/mo" : "$285/yr"})`}
        </Button>

        <p className="text-xs text-gray-500 text-center mt-3">
          Secure checkout powered by Stripe
        </p>
      </div>

    </div>
  );
}
