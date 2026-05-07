"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);

  // 🔥 CANCEL SUBSCRIPTION
  const handleCancel = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const confirmCancel = confirm(
      "Are you sure you want to cancel your subscription?"
    );

    if (!confirmCancel) return;

    try {
      setLoading(true);

      const res = await fetch("/api/cancel-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.uid,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Subscription will cancel at end of billing period");
      } else {
        alert("Failed to cancel subscription");
      }

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 DELETE ACCOUNT
  const handleDelete = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const confirmDelete = confirm(
      "This will permanently delete your account. Continue?"
    );

    if (!confirmDelete) return;

    try {
      setLoading(true);

      const res = await fetch("/api/account/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.uid,
        }),
      });

      const data = await res.json();

      if (data.success) {
        await auth.signOut();
        window.location.href = "/";
      } else {
        alert("Failed to delete account");
      }

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center py-16 px-6">

      <h1 className="text-3xl font-bold mb-10">
        Settings
      </h1>

      <div className="w-full max-w-md space-y-6">

        {/* CANCEL SUB */}
        <div className="bg-[#111] p-5 rounded-xl">
          <h2 className="text-lg font-semibold mb-2">
            Subscription
          </h2>

          <p className="text-sm text-gray-400 mb-4">
            Manage or cancel your Featrrr Valid subscription
          </p>

          <button
            onClick={handleCancel}
            disabled={loading}
            className="w-full py-2 rounded bg-yellow-500 text-black"
          >
            {loading ? "Processing..." : "Cancel Subscription"}
          </button>
        </div>

        {/* DELETE ACCOUNT */}
        <div className="bg-[#111] p-5 rounded-xl border border-red-500/30">
          <h2 className="text-lg font-semibold mb-2 text-red-400">
            Danger Zone
          </h2>

          <p className="text-sm text-gray-400 mb-4">
            Permanently delete your account and all associated data
          </p>

          <button
            onClick={handleDelete}
            disabled={loading}
            className="w-full py-2 rounded bg-red-600"
          >
            {loading ? "Deleting..." : "Delete Account"}
          </button>
        </div>

      </div>

    </main>
  );
}
