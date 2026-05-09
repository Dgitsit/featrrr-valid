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

  const [contextDisclosures, setContextDisclosures] = useState<string[]>([]);

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

    const storageRef = ref(
      storage,
      `profiles/${user.uid}/profile_${Date.now()}.jpg`
    );

    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    await fetch("/api/update-profile-photo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: user.uid, photoURL: url }),
    });

    setProfile((prev: any) => ({ ...prev, photoURL: url }));
    setPreview(url);
    setFeedback("Photo uploaded");
  };

  // SHARE
  const handleCopyLink = async () => {
    const url = `${window.location.origin}/verify?q=${profile.badgeNumber}`;
    await navigator.clipboard.writeText(url);
    setFeedback("Link copied");
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/verify?q=${profile.badgeNumber}`;

    if (navigator.share) {
      await navigator.share({
        title: "Verify me",
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
      setFeedback("Link copied");
    }
  };

  // DOWNLOAD CARD
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

  // SAVE SOCIALS
  const saveSocials = async () => {
    const user = auth.currentUser;

    await updateDoc(doc(db, "valid_profiles", user!.uid), {
      socials: { instagram, tiktok, youtube },
    });

    setFeedback("Socials saved");
  };

  // ADD POST
  const addPost = async () => {
    const user = auth.currentUser;

    const newPost = {
      text: postText,
      link: postLink,
      createdAt: new Date(),
    };

    const updated = [...(profile.postDisclosures || []), newPost];

    await updateDoc(doc(db, "valid_profiles", user!.uid), {
      postDisclosures: updated,
    });

    setProfile((prev: any) => ({
      ...prev,
      postDisclosures: updated,
    }));

    setPostText("");
    setPostLink("");
  };

  // DELETE POST
  const deletePost = async (i: number) => {
    const user = auth.currentUser;

    const updated = [...profile.postDisclosures];
    updated.splice(i, 1);

    await updateDoc(doc(db, "valid_profiles", user!.uid), {
      postDisclosures: updated,
    });

    setProfile((prev: any) => ({
      ...prev,
      postDisclosures: updated,
    }));
  };

  // SAVE CONTEXT
  const saveContext = async () => {
    const user = auth.currentUser;

    await updateDoc(doc(db, "valid_profiles", user!.uid), {
      contextDisclosures,
    });

    setFeedback("Context saved");
  };

  if (loading || !profile)
    return <div className="h-screen flex items-center justify-center">Loading...</div>;

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
    <div className="min-h-screen bg-black text-white flex justify-center px-4 py-10">

      <div className="w-full max-w-5xl space-y-10">

        {/* HEADER */}
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
              onChange={(e) => e.target.files && handleUpload(e.target.files[0])}
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

        {/* SOCIALS */}
        <div className="bg-[#111] p-6 rounded-xl space-y-3">
          <h3 className="text-sm text-gray-400">Socials (+2 each)</h3>

          <input value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="Instagram" className="w-full p-2 bg-black border border-gray-700 rounded"/>
          <input value={tiktok} onChange={(e) => setTiktok(e.target.value)} placeholder="TikTok" className="w-full p-2 bg-black border border-gray-700 rounded"/>
          <input value={youtube} onChange={(e) => setYoutube(e.target.value)} placeholder="YouTube" className="w-full p-2 bg-black border border-gray-700 rounded"/>

          <button onClick={saveSocials} className="w-full bg-purple-500 p-2 rounded">
            Save Socials
          </button>
        </div>

        {/* POSTS */}
        <div className="bg-[#111] p-6 rounded-xl space-y-3">
          <h3 className="text-sm text-gray-400">Disclosures (+2 pts)</h3>

          <textarea value={postText} onChange={(e) => setPostText(e.target.value)} className="w-full p-2 bg-black border border-gray-700 rounded"/>
          <input value={postLink} onChange={(e) => setPostLink(e.target.value)} className="w-full p-2 bg-black border border-gray-700 rounded"/>

          <button onClick={addPost} className="w-full bg-purple-500 p-2 rounded">
            Add
          </button>

          {profile.postDisclosures?.map((p: any, i: number) => (
            <div key={i} className="bg-black p-2 rounded">
              <p>{p.text}</p>
              <button onClick={() => deletePost(i)} className="text-red-400 text-xs">
                Delete
              </button>
            </div>
          ))}
        </div>

        {/* CONTEXT */}
        <div className="bg-[#111] p-6 rounded-xl space-y-3">
          <h3 className="text-sm text-gray-400">Context (+2 pts)</h3>

          {["researchBacked", "sourcesCited", "originalContent"].map((type) => (
            <button
              key={type}
              onClick={() =>
                setContextDisclosures((prev) =>
                  prev.includes(type)
                    ? prev.filter((t) => t !== type)
                    : [...prev, type]
                )
              }
              className={`p-2 rounded border ${
                contextDisclosures.includes(type)
                  ? "border-green-500"
                  : "border-gray-700"
              }`}
            >
              {type}
            </button>
          ))}

          <button onClick={saveContext} className="w-full bg-purple-500 p-2 rounded">
            Save Context
          </button>
        </div>

        {feedback && <p className="text-green-400 text-center">{feedback}</p>}

      </div>
    </div>
  );
}
