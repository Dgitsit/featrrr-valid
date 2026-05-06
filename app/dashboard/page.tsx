"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db, storage } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import html2canvas from "html2canvas";

import { createOrUpdateUserProfile } from "@/lib/createUserProfile";
import { applyScoreDecay } from "@/lib/score";
import Badge from "@/components/Badge";

export default function Dashboard() {
  const router = useRouter();

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");

  const cardRef = useRef<HTMLDivElement>(null);

  // 🔥 LOAD PROFILE
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.replace("/login");
        return;
      }

      try {
        const refDoc = doc(db, "valid_profiles", user.uid);
        let snap = await getDoc(refDoc);

        // Create profile if missing
        if (!snap.exists()) {
          await createOrUpdateUserProfile(user.uid, {
            email: user.email,
            subscriptionStatus: "free",
          });
          snap = await getDoc(refDoc);
        }

        const data = snap.data();

        // 🔥 ROUTE BASED ON ONBOARDING
        if (!data?.onboardingComplete) {
          router.replace("/onboarding");
          return;
        }

        setProfile(data);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  // 🔥 LOADING STATE
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

  // 🔥 SCORE
  const scoreData = applyScoreDecay(profile);
  const score = scoreData.score;

  const username =
    profile.displayName ||
    profile.email?.split("@")[0] ||
    "user";

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

  // 🔥 SHARE FUNCTION
  const handleGenerateImage = async () => {
    if (!cardRef.current) return;

    const canvas = await html2canvas(cardRef.current);
    const dataUrl = canvas.toDataURL("image/png");

    const res = await fetch(dataUrl);
    const blob = await res.blob();

    const file = new File([blob], "featrrr-card.png", {
      type: "image/png",
    });

    const shareText = `Just got verified on Featrrr Valid 🔥

Check your score:
${window.location.origin}/profile/${auth.currentUser?.uid}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Featrrr Valid",
          text: shareText,
          files: [file],
        });
      } catch {}
    } else {
      await navigator.clipboard.writeText(shareText);
      alert("Caption copied — paste it with your post");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-10">

      {/* 🔥 CARD */}
      <div
        ref={cardRef}
        className="w-[320px] bg-[#0f0f0f] rounded-xl overflow-hidden shadow-xl p-5 text-center border border-gray-800"
      >
        <div className="w-full h-[200px] bg-gray-800 rounded-md mb-4 overflow-hidden flex items-center justify-center">
          {profile.photoURL ? (
            <img
              src={profile.photoURL}
              className="w-full h-full object-cover"
            />
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

        <div className="mt-4 text-2xl font-bold">
          {score}
          <span className="text-sm text-gray-400">/100</span>
        </div>

        <div className="w-full bg-gray-700 h-2 rounded mt-2">
          <div
            className="h-2 rounded bg-gradient-to-r from-purple-500 to-orange-400"
            style={{ width: `${score}%` }}
          />
        </div>

        <p className="text-xs text-gray-400 mt-4">
          Verified on Featrrr Valid
        </p>
      </div>

      {feedback && (
        <p className="text-green-400 text-sm mt-4">{feedback}</p>
      )}

      {/* 📸 Upload */}
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="mt-4 text-sm"
      />

      {/* 🔥 Share */}
      <button
        onClick={handleGenerateImage}
        className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-orange-400 font-semibold"
      >
        Share Your Verified Card 🔥
      </button>

      {/* 🔥 Upgrade CTA */}
      {profile.subscriptionStatus !== "active" && (
        <button
          onClick={() => router.push("/upgrade")}
          className="mt-6 px-6 py-2 rounded bg-gradient-to-r from-purple-500 to-orange-400"
        >
          Upgrade to Featrrr Valid
        </button>
      )}
    </div>
  );
}
