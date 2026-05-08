"use client";

import { useEffect, useRef, useState } from "react";
import { auth, db, storage } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import html2canvas from "html2canvas";
import { calculateScore } from "@/utils/calculateScore";
import CreatorCard from "@/components/CreatorCard";

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
      if (!user) {
        window.location.href = "/login";
        return;
      }

      const snap = await getDoc(doc(db, "valid_profiles", user.uid));

      if (!snap.exists()) {
        window.location.href = "/onboarding";
        return;
      }

      const data = snap.data();

      setProfile(data);
      setInstagram(data?.socials?.instagram || "");
      setTiktok(data?.socials?.tiktok || "");
      setYoutube(data?.socials?.youtube || "");
      setContextDisclosures(data?.contextDisclosures || []);

      setLoading(false);
    });

    return () => unsub();
  }, []);

  const score = calculateScore({
    ...profile,
    contextDisclosures,
  });

  // IMAGE UPLOAD
  const handleUpload = async (file: File) => {
    const user = auth.currentUser;
    if (!file || !user) return;

    const storageRef = ref(storage, `profiles/${user.uid}/profile.jpg`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    await updateDoc(doc(db, "valid_profiles", user.uid), {
      photoURL: url,
      "activity.lastUpdated": new Date(),
    });

    setProfile((prev: any) => ({ ...prev, photoURL: url }));
    setPreview(url);
    setFeedback("Photo updated");
  };

  // SHARE LINK
  const handleCopyLink = async () => {
    const url = `${window.location.origin}/verify/${profile.badgeNumber}`;
    await navigator.clipboard.writeText(url);
    setFeedback("Link copied");
    setTimeout(() => setFeedback(""), 2000);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/verify/${profile.badgeNumber}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Verify me on Featrrr Valid",
          text: "Check out my transparency profile",
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setFeedback("Link copied");
      }
    } catch {
      await navigator.clipboard.writeText(url);
      setFeedback("Link copied");
    }

    setTimeout(() => setFeedback(""), 2000);
  };

  // SHARE CARD (FIXED)
  const handleGenerateImage = async () => {
    if (!cardRef.current) return;

    // wait for images
    const images = cardRef.current.querySelectorAll("img");

    await Promise.all(
      Array.from(images).map(
        (img) =>
          new Promise((resolve) => {
            if (img.complete) resolve(true);
            else img.onload = resolve;
          })
      )
    );

    const canvas = await html2canvas(cardRef.current, {
      useCORS: true,
      backgroundColor: "#000",
      scale: 2,
    });

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "featrrr-valid-card.png";
    link.click();
  };

  if (loading || !profile) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const creatorData = {
    id: auth.currentUser?.uid,
    displayName: profile.displayName,
    score,
    status: profile.status || "active",
    subscriptionStatus: profile.subscriptionStatus,
    profilePhoto: preview || profile.photoURL,
    badgeNumber: profile.badgeNumber,
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center px-4 py-8 gap-6">

      {/* 🔥 IG READY CARD */}
      <div
        ref={cardRef}
        className="w-[1080px] h-[1080px] bg-black flex items-center justify-center"
      >
        <div className="scale-[2.2]">
          <CreatorCard creator={creatorData} />
        </div>
      </div>

      {/* UPLOAD */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;

          const localUrl = URL.createObjectURL(file);
          setPreview(localUrl);
          handleUpload(file);
        }}
      />

      {/* SHARE BUTTONS */}
      <button onClick={handleGenerateImage} className="px-6 py-2 bg-purple-500 rounded">
        Download Card
      </button>

      <div className="flex gap-3">
        <button onClick={handleShare} className="px-4 py-2 bg-gradient-to-r from-purple-500 to-orange-400 rounded">
          Share Profile
        </button>

        <button onClick={handleCopyLink} className="px-4 py-2 bg-gray-800 rounded">
          Copy Link
        </button>
      </div>

      {/* BADGE DISPLAY */}
      <p className="text-sm text-gray-400">
        Badge #{profile.badgeNumber}
      </p>

      {feedback && <p className="text-green-400">{feedback}</p>}
    </div>
  );
}
