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
    setFeedback("Photo saved");
  };

  const saveSocials = async () => {
    const user = auth.currentUser;

    await updateDoc(doc(db, "valid_profiles", user!.uid), {
      socials: { instagram, tiktok, youtube },
    });

    setFeedback("Socials saved");
  };

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

  const saveContext = async () => {
    const user = auth.currentUser;

    await updateDoc(doc(db, "valid_profiles", user!.uid), {
      contextDisclosures,
    });

    setFeedback("Context saved");
  };

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/verify?q=${profile.badgeNumber}`;
    await navigator.clipboard.writeText(url);
    setFeedback("Link copied");
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

  if (loading || !profile) return <div className="h-screen flex items-center justify-center text-gray-400">Loading...</div>;

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
          <h1 className="text-2xl font-semibold">Your Transparency Dashboard</h1>
          <p className="text-gray-400 text-sm">Manage your public trust profile</p>
        </div>

        {/* CARD */}
        <div className="flex justify-center">
          <div className="w-full max-w-sm">
            <CreatorCard creator={creatorData} />
          </div>
        </div>

        {/* HIDDEN EXPORT */}
        <div className="fixed -left-[9999px]">
          <div ref={cardRef} className="w-[1080px] h-[1080px] flex items-center justify-center bg-black">
            <div className="scale-[2.2]">
              <CreatorCard creator={creatorData} />
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="panel">
          <h2 className="section-title">Profile Actions</h2>

          <div className="flex flex-wrap gap-3 items-center">

            <label className="btn-muted">
              Upload Photo
              <span className="points">+3 pts</span>
              <input type="file" hidden onChange={(e) => e.target.files && handleUpload(e.target.files[0])} />
            </label>

            <button onClick={handleGenerateImage} className="btn-primary">
              Download Card
            </button>

            <button onClick={handleCopyLink} className="btn-muted">
              Copy Link
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-2">
            Badge #{profile.badgeNumber}
          </p>
        </div>

        {/* SOCIALS */}
        <div className="panel">
          <h2 className="section-title">
            Social Links <span className="points">+2 each</span>
          </h2>

          <input value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="Instagram" className="input"/>
          <input value={tiktok} onChange={(e) => setTiktok(e.target.value)} placeholder="TikTok" className="input"/>
          <input value={youtube} onChange={(e) => setYoutube(e.target.value)} placeholder="YouTube" className="input"/>

          <button onClick={saveSocials} className="btn-primary">
            Save Socials
          </button>
        </div>

        {/* POSTS */}
        <div className="panel">
          <h2 className="section-title">
            Transparency Posts <span className="points">+2 pts</span>
          </h2>

          <textarea value={postText} onChange={(e) => setPostText(e.target.value)} className="input"/>
          <input value={postLink} onChange={(e) => setPostLink(e.target.value)} className="input"/>

          <button onClick={addPost} className="btn-primary">
            Add Disclosure
          </button>
        </div>

        {/* CONTEXT */}
        <div className="panel">
          <h2 className="section-title">
            Transparency Context <span className="points">+2 pts</span>
          </h2>

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
              className={`toggle ${
                contextDisclosures.includes(type) ? "toggle-on" : ""
              }`}
            >
              {type}
            </button>
          ))}

          <button onClick={saveContext} className="btn-primary">
            Save Context
          </button>
        </div>

        {feedback && <p className="text-green-400 text-center">{feedback}</p>}
      </div>
    </div>
  );
}
