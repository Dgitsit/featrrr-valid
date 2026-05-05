"use client";

import { useEffect } from "react";

export default function SuccessPage() {

  useEffect(() => {
    localStorage.setItem("verified", "true");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-bold mb-4">
          You’re Verified 🎉
        </h1>

        <p className="text-gray-600 mb-6">
          Your Featrrr profile just leveled up. You now have priority placement and increased trust.
        </p>

        <a
          href="/profile"
          className="inline-block px-6 py-3 rounded-full bg-black text-white font-semibold"
        >
          View Your Profile
        </a>
      </div>
    </div>
  );
}