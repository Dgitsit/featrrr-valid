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
  const [showContextModal, setShowContextModal] = useState(false);

  const [activePost, setActivePost] = useState<any>(null);
  const [activePostIndex, setActivePostIndex] = useState<number | null>(null);

  const [newText, setNewText] = useState("");
  const [newLink, setNewLink] = useState("");

  const [ogData, setOgData] = useState<any>(null);
  const [ogLoading, setOgLoading] = useState(false);

  const [contextDisclosures, setContextDisclosures] = useState<any[]>([]);

  const disclosureOptions = [
    { key: "performanceDrugs", label: "Uses performance enhancement drugs" },
    { key: "cosmeticSurgery", label: "Cosmetic surgery" },
    { key: "notOriginalContent", label: "Not original content" },
    { key: "dueDiligence", label: "Due diligence on sponsored content" },
    { key: "sourcesCited", label: "Sources cited" },
    { key: "notOwnedResults", label: "Not all owned results" },
    { key: "notAccredited", label: "Not accredited" },
  ];

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) return (window.location.href = "/login");

      const snap = await getDoc(doc(db, "valid_profiles", user.uid));
      const data = snap.data();
      if (!data) return;

      setProfile(data);
      setContextDisclosures(data.contextDisclosures || []);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const score = calculateScore({
    ...profile,
    contextDisclosures,
  });

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
      const t = setTimeout(() => fetchOG(newLink), 500);
      return () => clearTimeout(t);
    } else {
      setOgData(null);
    }
  }, [newLink]);

  // ================= POST ACTIONS =================
  const handleAddPost = async () => {
    if (!newText || !newLink) return;

    const newPost = {
      text: newText,
      link: newLink,
      previewImage: ogData?.image || "",
      title: ogData?.title || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updated = [...(profile.postDisclosures || []), newPost];

    await updateDoc(doc(db, "valid_profiles", auth.currentUser!.uid), {
      postDisclosures: updated,
    });

    setProfile((prev: any) => ({ ...prev, postDisclosures: updated }));

    setNewText("");
    setNewLink("");
    setOgData(null);
    setShowModal(false);
  };

  const handleEditPost = async () => {
    if (activePostIndex === null) return;

    const updated = [...profile.postDisclosures];

    updated[activePostIndex] = {
      ...updated[activePostIndex],
      text: newText,
      link: newLink,
      previewImage: ogData?.image || activePost.previewImage,
      updatedAt: new Date(),
    };

    await updateDoc(doc(db, "valid_profiles", auth.currentUser!.uid), {
      postDisclosures: updated,
    });

    setProfile((prev: any) => ({ ...prev, postDisclosures: updated }));
    setActivePost(null);
  };

  const handleDeletePost = async () => {
    if (activePostIndex === null) return;

    const updated = [...profile.postDisclosures];
    updated.splice(activePostIndex, 1);

    await updateDoc(doc(db, "valid_profiles", auth.currentUser!.uid), {
      postDisclosures: updated,
    });

    setProfile((prev: any) => ({ ...prev, postDisclosures: updated }));
    setActivePost(null);
  };

  // ================= CORE =================
  const handleAddDisclosure = (item: any) => {
    if (contextDisclosures.some((d) => d.key === item.key)) return;

    setContextDisclosures((prev) => [
      ...prev,
      { key: item.key, label: item.label, note: "" },
    ]);
  };

  const handleDeleteDisclosure = (key: string) => {
    setContextDisclosures((prev) => prev.filter((d) => d.key !== key));
  };

  const saveContext = async () => {
    await updateDoc(doc(db, "valid_profiles", auth.currentUser!.uid), {
      contextDisclosures,
      contextUpdatedAt: new Date(),
    });

    setProfile((prev: any) => ({ ...prev, contextDisclosures }));
    setShowContextModal(false);
  };

  // ================= UPLOAD =================
  const handleUpload = async (file: File) => {
    const url = await uploadProfileImage(file, auth.currentUser!.uid);
    setPreview(url);
  };

  if (loading || !profile) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  const creatorData = {
    id: auth.currentUser?.uid,
    displayName: profile.displayName,
    score,
    subscriptionStatus: profile.subscriptionStatus,
    profilePhoto: preview || profile.photoURL,
    badgeNumber: profile.badgeNumber,
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6">
      <div className="max-w-md mx-auto space-y-6">

        <CreatorCard creator={creatorData} />

        {/* ACTIONS */}
        <div className="space-y-2">
          <label className="block bg-gray-800 p-3 rounded text-sm cursor-pointer">
            Upload Photo (+3 pts)
            <input hidden type="file" onChange={(e) => e.target.files && handleUpload(e.target.files[0])} />
          </label>

          <button onClick={() => setShowContextModal(true)} className="w-full bg-gray-800 p-2 rounded text-sm">
            Core Disclosure (+2 pts each)
          </button>
        </div>

        {/* POST GRID (🔥 FIXED — THIS WAS MISSING) */}
        <div className="grid grid-cols-3 gap-2">
          <div
            onClick={() => setShowModal(true)}
            className="aspect-square flex flex-col items-center justify-center border border-gray-700 rounded"
          >
            ➕
            <span className="text-xs text-green-400">+1</span>
          </div>

          {(profile.postDisclosures || []).map((post: any, i: number) => (
            <div
              key={i}
              onClick={() => {
                setActivePost(post);
                setActivePostIndex(i);
                setNewText(post.text);
                setNewLink(post.link);
                setOgData(post);
              }}
              className="aspect-square rounded overflow-hidden"
            >
              <img
                src={post.previewImage || `https://image.thum.io/get/${post.link}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* ADD POST MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
            <div className="bg-[#111] p-4 rounded w-full max-w-sm space-y-3">

              <textarea
                placeholder="Disclosure..."
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                className="w-full p-2 bg-black border border-gray-700 rounded"
              />

              <input
                placeholder="Paste link (required)"
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                className="w-full p-2 bg-black border border-gray-700 rounded"
              />

              {ogLoading && <p className="text-xs">Loading preview...</p>}

              {ogData && (
                <img src={ogData.image} className="w-full h-24 object-cover rounded" />
              )}

              <button
                disabled={!newLink}
                onClick={handleAddPost}
                className={`w-full p-2 rounded ${newLink ? "bg-purple-500" : "bg-gray-700"}`}
              >
                Post
              </button>

              <button onClick={() => setShowModal(false)} className="w-full bg-gray-700 p-2 rounded">
                Cancel
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
