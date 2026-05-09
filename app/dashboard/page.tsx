"use client";

import { useEffect, useRef, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import html2canvas from "html2canvas";
import { calculateScore } from "@/utils/calculateScore";
import CreatorCard from "@/components/CreatorCard";
import { uploadProfileImage } from "@/lib/upload";

export default function Dashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  const [instagram, setInstagram] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [youtube, setYoutube] = useState("");

  const [postText, setPostText] = useState("");
  const [postLink, setPostLink] = useState("");

  const [contextDisclosures, setContextDisclosures] = useState<any[]>([]);

  const cardRef = useRef<HTMLDivElement>(null);

  // LOAD USER
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) return (window.location.href = "/login");

      const snap = await getDoc(doc(db, "valid_profiles", user.uid));
      if (!snap.exists()) return (window.location.href = "/onboarding");

      const data = snap.data();

      setProfile(data);
      setInstagram(data?.socials?.instagram || "");
      setTiktok(data?.socials?.tiktok || "");
      setYoutube(data?.socials?.youtube || "");
      setContextDisclosures(data?.contextDisclosures || []);

      console.log("🔥 DASHBOARD PROFILE:", data);

      setLoading(false);
    });

    return () => unsub();
  }, []);

  const score = calculateScore({
    ...profile,
    contextDisclosures,
  });

  // UPLOAD
  const handleUpload = async (file: File) => {
    const user = auth.currentUser;
    if (!file || !user) return;

    try {
      setFeedback("Uploading...");

      const url = await uploadProfileImage(file, user.uid);

      await fetch("/api/update-profile-photo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.uid,
          photoURL: url,
        }),
      });

      const snap = await getDoc(doc(db, "valid_profiles", user.uid));
      const fresh = snap.data();

      setProfile(fresh);
      setPreview(url);

      console.log("🔥 NEW PHOTO URL:", fresh?.photoURL);

      setFeedback("Photo uploaded ✅");
    } catch (err) {
      console.error(err);
      setFeedback("Upload failed ❌");
    }
  };

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/verify?q=${profile.badgeNumber}`;
    await navigator.clipboard.writeText(url);
    setFeedback("Link copied");
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/verify?q=${profile.badgeNumber}`;

    if (navigator.share) {
      await navigator.share({ title: "Verify me", url });
    } else {
      await navigator.clipboard.writeText(url);
      setFeedback("Link copied");
    }
  };

  const handleGenerateImage = async () => {
    if (!cardRef.current) return;

    const canvas = await html2canvas(cardRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#000",
    });

    const link = document.createElement("a");
    link.href = canvas.toDataURL();
    link.download = "featrrr-card.png";
    link.click();
  };

  const saveSocials = async () => {
    const user = auth.currentUser;
    if (!user) return;

    await updateDoc(doc(db, "valid_profiles", user.uid), {
      socials: { instagram, tiktok, youtube },
    });

    setFeedback("Socials saved (+2 pts)");
  };

  const addPost = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const newPost = {
      text: postText,
      link: postLink,
      createdAt: new Date(),
    };

    const updated = [...(profile.postDisclosures || []), newPost];

    await updateDoc(doc(db, "valid_profiles", user.uid), {
      postDisclosures: updated,
    });

    setProfile((prev: any) => ({
      ...prev,
      postDisclosures: updated,
    }));

    setPostText("");
    setPostLink("");
  };

  const deletePost = async (i: number) => {
    const user = auth.currentUser;
    if (!user) return;

    const updated = [...(profile.postDisclosures || [])];
    updated.splice(i, 1);

    await updateDoc(doc(db, "valid_profiles", user.uid), {
      postDisclosures: updated,
    });

    setProfile((prev: any) => ({
      ...prev,
      postDisclosures: updated,
    }));
  };

  const saveContext = async () => {
    const user = auth.currentUser;
    if (!user) return;

    await updateDoc(doc(db, "valid_profiles", user.uid), {
      contextDisclosures,
    });

    setFeedback("Context saved (+2 pts)");
  };

  if (loading || !profile)
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  // ✅ FIX APPLIED HERE
  const creatorData = {
    id: auth.currentUser?.uid || "",
    displayName: profile.displayName || "",
    score,
    status: profile.status || "active",
    subscriptionStatus: profile.subscriptionStatus || "free",
    profilePhoto: preview || profile.photoURL || "",
    badgeNumber: profile.badgeNumber || "",
  };

  return (
    <div className="min-h-screen bg-black text-white flex justify-center px-4 py-10">
      <div className="w-full max-w-5xl space-y-10">

        <div className="text-center">
          <h1 className="text-2xl font-semibold">Transparency Dashboard</h1>
        </div>

        {/* CARD */}
        <div className="flex justify-center">
          <div className="w-full max-w-sm">
            <CreatorCard creator={creatorData} />
          </div>
        </div>

        {/* EXPORT CARD */}
        <div className="fixed -left-[9999px]">
          <div ref={cardRef} className="w-[1080px] h-[1080px] flex items-center justify-center bg-black">
            <div className="scale-[2.2]">
              <CreatorCard creator={creatorData} />
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="bg-[#111] p-6 rounded-xl space-y-3">
          <h3 className="text-sm text-gray-400">Actions</h3>

          <label className="block cursor-pointer bg-gray-800 p-3 rounded">
            Upload Photo (+3 pts)
            <input
              type="file"
              hidden
              onChange={(e) =>
                e.target.files && handleUpload(e.target.files[0])
              }
            />
          </label>

          <button onClick={handleGenerateImage} className="w-full bg-purple-500 p-3 rounded">
            Download Card
          </button>

          <button onClick={handleShare} className="w-full bg-orange-500 p-3 rounded">
            Share Profile
          </button>

          <button onClick={handleCopyLink} className="w-full bg-gray-700 p-3 rounded">
            Copy Link
          </button>
        </div>

        {feedback && <p className="text-green-400 text-center">{feedback}</p>}
      </div>
    </div>
  );
}
