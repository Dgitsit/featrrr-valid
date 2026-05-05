"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "next/navigation";
import Badge from "@/components/Badge";

export default function ProfilePage() {
  const params = useParams();
  const uid = params.uid as string;

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 🔥 LOAD PROFILE
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const ref = doc(db, "valid_profiles", uid);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          setProfile(null);
          return;
        }

        setProfile(snap.data());
      } catch (err) {
        console.error("Profile load error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (uid) loadProfile();
  }, [uid]);

  // 🔄 LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading profile...
      </div>
    );
  }

  // ❌ NOT FOUND
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 text-center px-6">
        This creator isn’t on Featrrr Valid. Creators who choose transparency stand out.
      </div>
    );
  }

  const username =
    profile.displayName ||
    profile.email?.split("@")[0] ||
    "user";

  const score = profile.score ?? 0;

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center py-10 px-6">

      {/* 🔥 PROFILE CARD */}
      <div className="w-full max-w-md bg-[#111] rounded-xl p-6 text-center border border-gray-800 shadow-lg">

        {/* IMAGE */}
        <div className="w-full h-[220px] bg-gray-800 rounded-md flex items-center justify-center mb-4">
          No Photo
        </div>

        {/* NAME */}
        <h1 className="text-xl font-semibold">@{username}</h1>

        {/* 🔥 BADGES */}
        <div className="flex justify-center gap-2 mt-2">
          {profile.subscriptionStatus === "active" && (
            <Badge type="premium" />
          )}

          {profile?.socials?.instagram?.verified && (
            <Badge type="verified" />
          )}
        </div>

        {/* STATUS */}
        <div className="mt-2 text-sm text-gray-400">
          {profile.subscriptionStatus === "active" ? "Premium Creator" : "Free Creator"}
        </div>

        {/* SCORE */}
        <div className="mt-4 text-sm">
          Transparency Score: {score}/100
        </div>

        {/* PROGRESS */}
        <div className="w-full bg-gray-700 h-2 rounded mt-1">
          <div
            className="h-2 rounded bg-gradient-to-r from-purple-500 to-orange-400"
            style={{ width: `${score}%` }}
          />
        </div>

        {/* SOCIAL */}
        {profile?.socials?.instagram?.username && (
          <div className="mt-4 text-sm text-pink-400">
            @{profile.socials.instagram.username}
          </div>
        )}

      </div>

      {/* 🔥 CTA (IMPORTANT FOR GROWTH) */}
      <div className="mt-8 text-center max-w-sm text-gray-400 text-sm">
        Want a profile like this? Join Featrrr Valid and stand out with transparency.
      </div>

    </main>
  );
}
