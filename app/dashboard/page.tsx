"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { calculateScore } from "@/utils/calculateScore";
import CreatorCard from "@/components/CreatorCard";
import { uploadProfileImage } from "@/lib/upload";

export const dynamic = "force-dynamic";

export default function Dashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");

  const [preview, setPreview] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [activePost, setActivePost] = useState<any>(null);
  const [activePostIndex, setActivePostIndex] = useState<number | null>(null);

  const [newText, setNewText] = useState("");
  const [newLink, setNewLink] = useState("");

  const [ogData, setOgData] = useState<any>(null);
  const [ogLoading, setOgLoading] = useState(false);

  const [showContextModal, setShowContextModal] = useState(false);
  const [contextDisclosures, setContextDisclosures] = useState<string[]>([]);
  const [contextNotes, setContextNotes] = useState("");

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) return (window.location.href = "/login");

      const snap = await getDoc(doc(db, "valid_profiles", user.uid));
      const data = snap.data();
      if (!data) return;

      setProfile(data);
      setContextDisclosures(data.contextDisclosures || []);
      setContextNotes(data.contextNotes || "");
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const score = calculateScore(profile || {});

  // ================= COPY / SHARE =================
  const handleCopyLink = async () => {
    try {
      const url = `${window.location.origin}/profile/${auth.currentUser?.uid}`;
      await navigator.clipboard.writeText(url);
      setFeedback("Link copied");
    } catch {
      setFeedback("Copy failed");
    }
  };

  const handleShare = async () => {
    try {
      const url = `${window.location.origin}/profile/${auth.currentUser?.uid}`;

      if (navigator.share) {
        await navigator.share({ title: "My Featrrr Profile", url });
      } else {
        await navigator.clipboard.writeText(url);
        setFeedback("Link copied");
      }
    } catch {
      setFeedback("Share failed");
    }
  };

  // ================= UPLOAD =================
  const handleUpload = async (file: File) => {
    const user = auth.currentUser;
    if (!file || !user) return;

    const url = await uploadProfileImage(file, user.uid);

    await fetch("/api/update-profile-photo", {
      method: "POST",
      body: JSON.stringify({ userId: user.uid, photoURL: url }),
    });

    const snap = await getDoc(doc(db, "valid_profiles", user.uid));
    setProfile(snap.data());
    setPreview(url);
  };

  // ================= OG FETCH =================
  const fetchOG = async (url: string) => {
    if (!url) return;

    try {
      setOgLoading(true);

      const res = await fetch("/api/og", {
        method: "POST",
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      setOgData(data);
    } catch {
      setOgData(null);
    } finally {
      setOgLoading(false);
    }
  };

  useEffect(() => {
    if (newLink) {
      const delay = setTimeout(() => fetchOG(newLink), 500);
      return () => clearTimeout(delay);
    } else {
      setOgData(null);
    }
  }, [newLink]);

  // ================= POSTS =================
  const handleAddPost = async () => {
    if (!newText || !newLink) return;

    const now = new Date();

    const newPost = {
      text: newText,
      link: newLink,
      previewImage: ogData?.image || "",
      title: ogData?.title || "",
      description: ogData?.description || "",
      createdAt: now,
      updatedAt: now,
    };

    const updated = [...(profile.postDisclosures || []), newPost];

    await updateDoc(doc(db, "valid_profiles", auth.currentUser!.uid), {
      postDisclosures: updated,
    });

    setProfile((prev: any) => ({
      ...prev,
      postDisclosures: updated,
    }));

    setNewText("");
    setNewLink("");
    setOgData(null);
    setShowModal(false);
  };

  const handleEditPost = async () => {
    if (activePostIndex === null) return;

    const updated = [...(profile.postDisclosures || [])];

    updated[activePostIndex] = {
      ...updated[activePostIndex],
      text: newText,
      link: newLink,
      previewImage: ogData?.image || activePost.previewImage,
      title: ogData?.title || activePost.title,
      description: ogData?.description || activePost.description,
      updatedAt: new Date(),
    };

    await updateDoc(doc(db, "valid_profiles", auth.currentUser!.uid), {
      postDisclosures: updated,
    });

    setProfile((prev: any) => ({
      ...prev,
      postDisclosures: updated,
    }));

    setActivePost(null);
  };

  const handleDeletePost = async () => {
    if (activePostIndex === null) return;

    const updated = [...(profile.postDisclosures || [])];
    updated.splice(activePostIndex, 1);

    await updateDoc(doc(db, "valid_profiles", auth.currentUser!.uid), {
      postDisclosures: updated,
    });

    setProfile((prev: any) => ({
      ...prev,
      postDisclosures: updated,
    }));

    setActivePost(null);
  };

  // ================= CORE DISCLOSURES =================
  const disclosureOptions = [
    { key: "performanceDrugs", label: "Uses performance enhancement drugs" },
    { key: "cosmeticSurgery", label: "Cosmetic surgery" },
    { key: "notOriginalContent", label: "Not original content" },
    { key: "dueDiligence", label: "Due diligence on sponsored content" },
    { key: "sourcesCited", label: "Sources cited" },
    { key: "notOwnedResults", label: "Not all owned results" },
    { key: "notAccredited", label: "Not accredited" },
  ];

  const saveContext = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const payload = {
      contextDisclosures,
      contextNotes,
      contextUpdatedAt: new Date(),
    };

    await updateDoc(doc(db, "valid_profiles", user.uid), payload);

    setProfile((prev: any) => ({ ...prev, ...payload }));
    setShowContextModal(false);
  };

  if (loading || !profile) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  const creatorData = {
    id: auth.currentUser?.uid || "",
    displayName: profile.displayName || "",
    score,
    subscriptionStatus: profile.subscriptionStatus || "free",
    profilePhoto: preview || profile.photoURL || "",
    badgeNumber: profile.badgeNumber || "",
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 pt-4 pb-10">
      <div className="w-full max-w-md mx-auto space-y-5">

        <div className="flex justify-center">
          <CreatorCard creator={creatorData} />
        </div>

        {/* ACTIONS */}
        <div className="bg-[#111] p-4 rounded-xl space-y-3">
          <label className="block cursor-pointer bg-gray-800 p-3 rounded text-sm">
            Upload Photo +3 pts
            <input type="file" hidden onChange={(e) => e.target.files && handleUpload(e.target.files[0])} />
          </label>

          <button onClick={handleShare} className="w-full bg-purple-500 p-3 rounded text-sm">
            Share Profile
          </button>

          <button onClick={handleCopyLink} className="w-full bg-gray-700 p-3 rounded text-sm">
            Copy Link
          </button>

          <button onClick={() => setShowContextModal(true)} className="w-full bg-gray-800 p-3 rounded text-sm">
            Core Disclosure +2 pts
          </button>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-3 gap-2">
          <div onClick={() => setShowModal(true)} className="aspect-square flex flex-col items-center justify-center border border-gray-700 rounded cursor-pointer">
            <span className="text-2xl">➕</span>
            <span className="text-green-400 text-xs mt-1">+1 pt</span>
          </div>

          {(profile.postDisclosures || []).map((post: any, i: number) => (
            <div key={i} onClick={() => {
              setActivePost(post);
              setActivePostIndex(i);
              setNewText(post.text);
              setNewLink(post.link);
              setOgData(post);
            }} className="aspect-square rounded overflow-hidden cursor-pointer">
              <img src={post.previewImage || `https://image.thum.io/get/${post.link}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        {feedback && <p className="text-green-400 text-center text-sm">{feedback}</p>}
      </div>
    </div>
  );
}
