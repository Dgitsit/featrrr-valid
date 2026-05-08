"use client";

import { useEffect, useRef, useState } from "react";
import { auth, db, storage } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import html2canvas from "html2canvas";
import { applyScoreDecay } from "@/lib/score";
import CreatorCard from "@/components/CreatorCard";

export default function Dashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [upgrading, setUpgrading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);

  // 🔐 LOAD USER
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

  // 📸 FILE SELECT + PREVIEW
  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    handleUpload(file);
  };

  // 🔥 UPLOAD + SAVE TO FIREBASE + FIRESTORE
  const handleUpload = async (file: File) => {
    const user = auth.currentUser;
    if (!file || !user) return;

    try {
      const storageRef = ref(storage, `profiles/${user.uid}`);
      await uploadBytes(storageRef, file);

      const url = await getDownloadURL(storageRef);

      // 🔥 SAVE TO FIRESTORE (THIS IS KEY)
      await updateDoc(doc(db, "valid_profiles", user.uid), {
        photoURL: url,
      });

      // Update UI instantly
      setProfile((prev: any) => ({
        ...prev,
        photoURL: url,
      }));

      setFeedback("Profile photo saved");
      setTimeout(() => setFeedback(""), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  // 🖼️ EXPORT CARD
  const handleGenerateImage = async () => {
    if (!cardRef.current) return;

    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: null,
      scale: 2, // higher quality
    });

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "featrrr-valid-card.png";
    link.click();
  };

  // 💳 STRIPE
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
        setUpgrading(false);
      }
    } catch (err) {
      console.error(err);
      setUpgrading(false);
    }
  };

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

  const isActive = profile.subscriptionStatus === "active";

  const creatorData = {
    id: profile.uid || "me",
    displayName: profile.displayName,
    score,
    status: profile.status || "active",
    subscriptionStatus: profile.subscriptionStatus,
    profilePhoto: preview || profile.photoURL,
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center px-4 py-8">

      {/* CARD */}
      <div ref={cardRef}>
        <CreatorCard creator={creatorData} />
      </div>

      {/* FEEDBACK */}
      {feedback && (
        <p className="text-green-400 text-sm mt-4">{feedback}</p>
      )}

      {/* UPLOAD */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mt-4 text-sm"
      />

      {/* SHARE */}
      <button
        onClick={handleGenerateImage}
        className="mt-4 px-6 py-2 rounded bg-gradient-to-r from-purple-500 to-orange-400"
      >
        Share Your Card
      </button>

      {/* SUBSCRIPTION */}
      <div className="mt-8 w-full max-w-sm bg-[#111] rounded-xl p-5">
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
