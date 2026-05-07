"use client";

import { useEffect, useRef, useState } from "react";
import { auth, db, storage } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import html2canvas from "html2canvas";
import { applyScoreDecay } from "@/lib/score";
import Badge from "@/components/Badge";

export default function Dashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [upgrading, setUpgrading] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  // 🔐 AUTH + LOAD PROFILE
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        window.location.href = "/login";
        return;
      }

      try {
        const snap = await getDoc(doc(db, "valid_profiles", user.uid));

        if (!snap.exists()) {
          window.location.href = "/onboarding";
          return;
        }

        const data = snap.data();

        if (!data?.onboardingComplete) {
          window.location.href = "/onboarding";
          return;
        }

        setProfile(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  const scoreData = applyScoreDecay(profile || {});
  const score = scoreData?.score ?? 60;

  // 📸 UPLOAD PHOTO
  const handleUpload = async (e: any) => {
    const file = e.target.files?.[0];
    const user = auth.currentUser;
    if (!file || !user) return;

    try {
      const storageRef = ref(storage, `profiles/${user.uid}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      setProfile((prev: any) => ({
        ...prev,
        photoURL: url,
      }));

      setFeedback("Profile photo updated");
      setTimeout(() => setFeedback(""), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  // 🖼️ EXPORT CARD
  const handleGenerateImage = async () => {
    if (!cardRef.current) return;

    const canvas = await html2canvas(cardRef.current);
    const dataUrl = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "featrrr-valid-card.png";
    link.click();
  };

  // 📋 COPY BADGE
  const handleCopyBadge = () => {
    if (!profile?.badgeNumber) return;

    navigator.clipboard.writeText(String(profile.badgeNumber));
    setFeedback("Badge copied");
    setTimeout(() => setFeedback(""), 2000);
  };

  // 🔗 SHARE LINK
  const handleShareLink = async () => {
    if (!profile?.badgeNumber) return;

    const url = `${window.location.origin}/verify/${profile.badgeNumber}`;

    try {
      await navigator.share({
        title: "Verify me on Featrrr Valid",
        url,
      });
    } catch {
      navigator.clipboard.writeText(url);
      setFeedback("Link copied");
      setTimeout(() => setFeedback(""), 2000);
    }
  };

  // 💳 STRIPE UPGRADE
  const handleUpgrade = async () => {
    try {
      setUpgrading(true);

      const user = auth.currentUser;
      if (!user) return;

      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: "monthly",
          userId: user.uid,
          email: user.email,
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error(data);
        alert("Failed to start checkout");
        setUpgrading(false);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
      setUpgrading(false);
    }
  };

  // ==========================

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        Error loading profile
      </div>
    );
  }

  const username =
    profile.displayName ||
    profile.email?.split("@")[0] ||
    "user";

  const isActive = profile.subscriptionStatus === "active";

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-10 px-4">

      {/* ✅ VERIFIED */}
      {isActive && (
        <div className="mb-4 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded text-green-400 text-sm">
          ✔ Verified Featrrr Valid Creator
        </div>
      )}

      {/* 🧾 CARD */}
      <div
        ref={cardRef}
        className="w-[320px] bg-[#111] rounded-xl p-4 text-center"
      >
        <div className="w-full h-[200px] bg-gray-800 rounded mb-4 flex items-center justify-center overflow-hidden">
          {profile.photoURL ? (
            <img src={profile.photoURL} className="w-full h-full object-cover" />
          ) : (
            "No Photo"
          )}
        </div>

        <h2 className="text-lg font-semibold">@{username}</h2>

        {/* BADGE */}
        <div className="mt-2 flex flex-col items-center gap-2">
          <span className="text-xs text-gray-500">
            Badge #{profile.badgeNumber || "—"}
          </span>

          <div className="flex gap-2">
            <button
              onClick={handleCopyBadge}
              className="text-xs px-2 py-1 rounded bg-gray-800"
            >
              Copy Badge
            </button>

            <button
              onClick={handleShareLink}
              className="text-xs px-2 py-1 rounded bg-gradient-to-r from-purple-500 to-orange-400"
            >
              Share
            </button>
          </div>
        </div>

        {/* BADGES */}
        <div className="flex justify-center gap-2 mt-3">
          {isActive && <Badge type="premium" />}
          {profile?.socials?.instagram?.verified && (
            <Badge type="verified" />
          )}
        </div>

        {/* SCORE */}
        <div className="mt-3 text-sm">{score}/100</div>

        <div className="w-full bg-gray-700 h-2 rounded mt-1">
          <div
            className="h-2 rounded bg-gradient-to-r from-purple-500 to-orange-400"
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* FEEDBACK */}
      {feedback && (
        <p className="text-green-400 text-sm mt-4">{feedback}</p>
      )}

      {/* ACTIONS */}
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="mt-4 text-sm"
      />

      <button
        onClick={handleGenerateImage}
        className="mt-4 px-6 py-2 rounded bg-gradient-to-r from-purple-500 to-orange-400"
      >
        Share Your Card
      </button>

      {/* 💳 SUBSCRIPTION */}
      <div className="mt-8 w-full max-w-md bg-[#111] rounded-xl p-5">
        <h2 className="text-sm text-gray-400 mb-3">Subscription</h2>

        <div className="flex justify-between mb-2">
          <span className="text-gray-400 text-sm">Plan</span>
          <span>{isActive ? "Pro" : "Free"}</span>
        </div>

        <div className="flex justify-between mb-4">
          <span className="text-gray-400 text-sm">Status</span>
          <span className={isActive ? "text-green-400" : "text-gray-400"}>
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>

        {!isActive ? (
          <button
            onClick={handleUpgrade}
            disabled={upgrading}
            className="w-full py-2 rounded bg-gradient-to-r from-purple-500 to-orange-400"
          >
            {upgrading ? "Redirecting..." : "Upgrade to Featrrr Valid"}
          </button>
        ) : (
          <button
            onClick={() => (window.location.href = "/settings")}
            className="w-full py-2 rounded bg-white text-black"
          >
            Manage Subscription
          </button>
        )}
      </div>

    </div>
  );
}
