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

  const [preview, setPreview] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [activePost, setActivePost] = useState<any>(null);
  const [activePostIndex, setActivePostIndex] = useState<number | null>(null);

  const [newText, setNewText] = useState("");
  const [newLink, setNewLink] = useState("");

  const [ogData, setOgData] = useState<any>(null);
  const [ogLoading, setOgLoading] = useState(false);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) return (window.location.href = "/login");

      const snap = await getDoc(doc(db, "valid_profiles", user.uid));
      const data = snap.data();
      if (!data) return;

      setProfile(data);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const score = calculateScore(profile || {});

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

  // ================= ADD POST =================
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

  // ================= EDIT =================
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

  // ================= DELETE =================
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
    <div className="min-h-screen bg-black text-white flex justify-center px-4 py-10">
      <div className="w-full max-w-5xl space-y-10">

        {/* CARD */}
        <div className="flex justify-center">
          <CreatorCard creator={creatorData} />
        </div>

        {/* GRID */}
        <div className="grid grid-cols-3 gap-2">

          {/* ADD */}
          <div
            onClick={() => setShowModal(true)}
            className="aspect-square flex flex-col items-center justify-center border border-gray-700 rounded cursor-pointer"
          >
            <span className="text-3xl">➕</span>
            <span className="text-green-400 text-xs mt-1">+1 pt</span>
          </div>

          {/* POSTS */}
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
              className="aspect-square rounded overflow-hidden cursor-pointer"
            >
              <img
                src={post.previewImage || `https://image.thum.io/get/${post.link}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* ADD MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
            <div className="bg-[#0b0b0f] p-5 rounded-xl w-full max-w-md space-y-4">

              <textarea
                placeholder="Disclosure..."
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                className="w-full p-3 bg-black border border-gray-800 rounded"
              />

              <input
                placeholder="Paste link..."
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                className="w-full p-3 bg-black border border-gray-800 rounded"
              />

              {/* OG PREVIEW */}
              {ogLoading && <p className="text-xs text-gray-500">Loading preview...</p>}

              {ogData && (
                <div className="bg-[#111] rounded-lg overflow-hidden border border-gray-800">
                  {ogData.image && (
                    <img src={ogData.image} className="w-full h-32 object-cover" />
                  )}
                  <div className="p-3">
                    <p className="text-sm font-semibold">{ogData.title}</p>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                      {ogData.description}
                    </p>
                  </div>
                </div>
              )}

              <button
                disabled={!newLink}
                onClick={handleAddPost}
                className={`w-full p-3 rounded ${
                  newLink ? "bg-purple-500" : "bg-gray-700"
                }`}
              >
                Post (+1 pt)
              </button>

              <button onClick={() => setShowModal(false)} className="w-full bg-gray-700 p-2 rounded">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* EDIT MODAL */}
        {activePost && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
            <div className="bg-[#0b0b0f] p-5 rounded-xl w-full max-w-md space-y-4">

              <textarea
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                className="w-full p-3 bg-black border border-gray-800 rounded"
              />

              <input
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                className="w-full p-3 bg-black border border-gray-800 rounded"
              />

              {/* OG PREVIEW */}
              {ogData && (
                <div className="bg-[#111] rounded-lg overflow-hidden border border-gray-800">
                  {ogData.image && (
                    <img src={ogData.image} className="w-full h-32 object-cover" />
                  )}
                  <div className="p-3">
                    <p className="text-sm font-semibold">{ogData.title}</p>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                      {ogData.description}
                    </p>
                  </div>
                </div>
              )}

              <button onClick={handleEditPost} className="w-full bg-purple-500 p-3 rounded">
                Save Changes
              </button>

              <button onClick={handleDeletePost} className="w-full bg-red-500 p-3 rounded">
                Delete
              </button>

              <button onClick={() => setActivePost(null)} className="w-full bg-gray-700 p-2 rounded">
                Close
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
