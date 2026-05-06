"use client";

import { useEffect, useRef, useState } from "react";
import { auth, db, storage } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import html2canvas from "html2canvas";

import { createOrUpdateUserProfile } from "@/lib/createUserProfile";
import { applyScoreDecay } from "@/lib/score";
import Badge from "@/components/Badge";

export default function Dashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");

  const cardRef = useRef<HTMLDivElement>(null);

  // 🔥 LOAD USER + PROFILE (NO ROUTING HERE)
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const refDoc = doc(db, "valid_profiles", user.uid);
        let snap = await getDoc(refDoc);

        // AUTO CREATE PROFILE
        if (!snap.exists()) {
          await createOrUpdateUserProfile(user.uid, {
            email: user.email,
          });
          snap = await getDoc(refDoc);
        }

        setProfile(snap.data());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // 🔥 SCORE
  const scoreData = applyScoreDecay(profile || {});
  const score = scoreData?.score ?? 75;

  // 🔥 PHOTO UPLOAD
  const handleUpload = async (e: any) => {
    const file = e.target.files?.[0];
    const user = auth.currentUser;

    if (!file || !user) return;

    try {
      const storageRef = ref(storage, `profiles/${user.uid}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      const result = await createOrUpdateUserProfile(user.uid, {
        photoURL: url,
      });

      setProfile((prev: any) => ({
        ...prev,
        photoURL: url,
        score: (prev.score || 75) + (result?.scoreAdded || 0),
      }));

      if (result?.scoreAdded > 0) {
        setFeedback(`+${result.scoreAdded} score for adding a profile photo`);
        setTimeout(() => setFeedback(""), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 SHARE
  const handleGenerateImage = async () => {
    if (!cardRef.current) return;

    const canvas = await html2canvas(cardRef.current);
    const dataUrl = canvas.toDataURL("image/png");

    const res = await fetch(dataUrl);
    const blob = await res.blob();

    const file = new File([blob], "featrrr-card.png", {
      type: "image/png",
    });

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Featrrr Valid",
          files: [file],
        });
      } catch {}
    } else {
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "featrrr-valid-card.png";
      link.click();
    }
  };

  // 🔄 LOADING
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-400">
        Loading profile...
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

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-10">

      {/* CARD */}
      <div
        ref={cardRef}
        className="w-[320px] bg-[#111] rounded-xl overflow-hidden shadow-lg p-4 text-center"
      >
        <div className="w-full h-[200px] bg-gray-800 rounded-md mb-4 overflow-hidden flex items-center justify-center">
          {profile.photoURL ? (
            <img src={profile.photoURL} className="w-full h-full object-cover" />
          ) : (
            "No Photo"
          )}
        </div>

        <h2 className="text-lg font-semibold">@{username}</h2>

        <div className="flex justify-center gap-2 mt-2">
          {profile.subscriptionStatus === "active" && (
            <Badge type="premium" />
          )}
          {profile?.socials?.instagram?.verified && (
            <Badge type="verified" />
          )}
        </div>

        <div className="mt-2 text-sm text-gray-400">
          {profile.subscriptionStatus === "active" ? "Premium" : "Free"}
        </div>

        <div className="mt-3 text-sm">{score}/100</div>

        <div className="w-full bg-gray-700 h-2 rounded mt-1">
          <div
            className="h-2 rounded bg-gradient-to-r from-purple-500 to-orange-400"
            style={{ width: `${score}%` }}
          />
        </div>

        {profile?.socials?.instagram?.username && (
          <div className="mt-3 text-sm text-pink-400">
            @{profile.socials.instagram.username}
          </div>
        )}
      </div>

      {feedback && (
        <p className="text-green-400 text-sm mt-4">{feedback}</p>
      )}

      {scoreData?.daysUntilDecay <= 5 &&
        scoreData?.daysUntilDecay > 0 && (
          <p className="text-yellow-400 text-xs mt-2 text-center">
            Your score will start decreasing in {scoreData.daysUntilDecay} days
          </p>
        )}

      {scoreData?.isDecaying && (
        <p className="text-red-400 text-xs mt-2 text-center">
          Your score is decreasing due to inactivity
        </p>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="mt-4 text-sm"
      />

      <button
        onClick={handleGenerateImage}
        className="mt-6 px-6 py-2 rounded bg-gradient-to-r from-purple-500 to-orange-400"
      >
        Share Your Valid Card
      </button>

      {profile.subscriptionStatus !== "active" && (
        <>
          <div className="mt-6 text-sm text-gray-400 text-center max-w-sm">
            Verified creators stand out more, build trust faster, and unlock higher visibility.
          </div>

          <button
            onClick={() => (window.location.href = "/upgrade")}
            className="mt-4 px-6 py-2 rounded bg-gradient-to-r from-purple-500 to-orange-400"
          >
            Upgrade to Featrrr Valid
          </button>
        </>
      )}
    </div>
  );
}
