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

  const [contextDisclosures, setContextDisclosures] = useState<string[]>([]);
  const [contextNotes, setContextNotes] = useState("");

  const [ogData, setOgData] = useState<any>(null);
  const [ogLoading, setOgLoading] = useState(false);

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

  // ✅ SAFE SCORE
  const score =
    profile &&
    calculateScore({
      ...profile,
      contextDisclosures,
    });

  // ================= SHARE =================
  const handleCopyLink = async () => {
    const url = `${window.location.origin}/profile/${auth.currentUser?.uid}`;
    await navigator.clipboard.writeText(url);
    setFeedback("Link copied");
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/profile/${auth.currentUser?.uid}`;

    if (navigator.share) {
      await navigator.share({ title: "My Featrrr Profile", url });
    } else {
      await navigator.clipboard.writeText(url);
      setFeedback("Link copied");
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

  // ================= ADD =================
  const handleAddPost = async () => {
    if (!newText || !newLink) return;

    const newPost = {
      text: newText,
      link: newLink,
      previewImage: ogData?.image || "",
      title: ogData?.title || "",
      description: ogData?.description || "",
      createdAt: new Date(),
      updatedAt: new Date(),
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
    <div className="min-h-screen bg-black text-white flex justify-center px-4 py-6">
      <div className="w-full max-w-md space-y-6">

        {/* CARD */}
        <CreatorCard creator={creatorData} />

        {/* ACTIONS */}
        <div className="space-y-2">
          <label className="block bg-gray-800 p-3 rounded text-sm cursor-pointer">
            Upload Photo <span className="text-green-400">+3 pts</span>
            <input type="file" hidden onChange={(e) => e.target.files && handleUpload(e.target.files[0])} />
          </label>

          <button onClick={handleShare} className="w-full bg-purple-500 p-2 rounded text-sm">
            Share Profile
          </button>

          <button onClick={handleCopyLink} className="w-full bg-gray-700 p-2 rounded text-sm">
            Copy Link
          </button>

          <button onClick={() => setShowContextModal(true)} className="w-full bg-gray-800 p-2 rounded text-sm">
            Core Disclosure <span className="text-green-400">+2 pts</span>
          </button>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-3 gap-2">

          <div
            onClick={() => setShowModal(true)}
            className="aspect-square flex flex-col items-center justify-center border border-gray-700 rounded cursor-pointer"
          >
            <span>➕</span>
            <span className="text-green-400 text-xs">+1</span>
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

              <button
                disabled={!newLink}
                onClick={handleAddPost}
                className={`w-full p-2 rounded ${
                  newLink ? "bg-purple-500" : "bg-gray-700"
                }`}
              >
                Post
              </button>

              <button onClick={() => setShowModal(false)} className="w-full bg-gray-700 p-2 rounded">
                Cancel
              </button>

            </div>
          </div>
        )}

        {/* CORE MODAL */}
        {showContextModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
            <div className="bg-[#111] p-4 rounded w-full max-w-sm space-y-2">

              {disclosureOptions.map((item) => (
                <button
                  key={item.key}
                  onClick={() =>
                    setContextDisclosures((prev) =>
                      prev.includes(item.key)
                        ? prev.filter((t) => t !== item.key)
                        : [...prev, item.key]
                    )
                  }
                  className="p-2 border border-gray-700 rounded text-left text-sm"
                >
                  {item.label}
                </button>
              ))}

              <button onClick={saveContext} className="w-full bg-purple-500 p-2 rounded">
                Save
              </button>

              <button onClick={() => setShowContextModal(false)} className="w-full bg-gray-700 p-2 rounded">
                Cancel
              </button>

            </div>
          </div>
        )}

        {feedback && <p className="text-green-400 text-center text-sm">{feedback}</p>}

      </div>
    </div>
  );
}
