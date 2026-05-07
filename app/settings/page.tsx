"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    const load = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const snap = await getDoc(doc(db, "valid_profiles", user.uid));
      if (snap.exists()) {
        const data = snap.data();
        setProfile(data);
        setDisplayName(data.displayName || "");
      }

      setLoading(false);
    };

    load();
  }, []);

  const handleSaveProfile = async () => {
    const user = auth.currentUser;
    if (!user) return;

    await updateDoc(doc(db, "valid_profiles", user.uid), {
      displayName,
    });

    alert("Profile updated");
  };

  // 🔥 CANCEL SUBSCRIPTION (soft cancel)
  const handleCancelSubscription = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const confirm = window.confirm(
      "Cancel your subscription? You will lose premium status."
    );

    if (!confirm) return;

    await updateDoc(doc(db, "valid_profiles", user.uid), {
      subscriptionStatus: "canceled",
    });

    alert("Subscription canceled");
    window.location.reload();
  };

  // 🔥 OPT OUT
  const handleOptOut = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const confirm = window.confirm(
      "Opt out of Featrrr Valid? Your profile will no longer be publicly trusted."
    );

    if (!confirm) return;

    await updateDoc(doc(db, "valid_profiles", user.uid), {
      status: "opted_out",
    });

    alert("You have opted out");
    window.location.reload();
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 max-w-2xl mx-auto space-y-10">

      <h1 className="text-2xl font-bold">Settings</h1>

      {/* 🔹 PROFILE */}
      <section className="bg-[#111] p-5 rounded-xl">
        <h2 className="font-semibold mb-4">Profile</h2>

        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Display Name"
          className="w-full p-3 rounded bg-zinc-800 border border-zinc-700 mb-4"
        />

        <Button onClick={handleSaveProfile}>
          Save Profile
        </Button>
      </section>

      {/* 🔹 SOCIALS */}
      <section className="bg-[#111] p-5 rounded-xl">
        <h2 className="font-semibold mb-4">Social Verification</h2>

        <p className="text-sm text-gray-400 mb-4">
          Verify your accounts to increase trust score
        </p>

        <Link href="/dashboard">
          <Button variant="secondary">
            Manage Socials
          </Button>
        </Link>
      </section>

      {/* 🔹 SUBSCRIPTION */}
      <section className="bg-[#111] p-5 rounded-xl">
        <h2 className="font-semibold mb-4">Subscription</h2>

        <p className="text-sm text-gray-400 mb-4">
          Status:{" "}
          <span className="text-white">
            {profile?.subscriptionStatus || "free"}
          </span>
        </p>

        {profile?.subscriptionStatus === "active" && (
          <Button variant="danger" onClick={handleCancelSubscription}>
            Cancel Subscription
          </Button>
        )}

        {profile?.subscriptionStatus !== "active" && (
          <Link href="/upgrade">
            <Button>
              Upgrade to Valid
            </Button>
          </Link>
        )}
      </section>

      {/* 🔹 ACCOUNT CONTROL */}
      <section className="bg-[#111] p-5 rounded-xl">
        <h2 className="font-semibold mb-4 text-red-400">
          Account Control
        </h2>

        <p className="text-sm text-gray-400 mb-4">
          Opting out removes your trust status and visibility.
        </p>

        <Button variant="danger" onClick={handleOptOut}>
          Opt Out of Featrrr Valid
        </Button>
      </section>

    </div>
  );
}
