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

  const [showPostModal, setShowPostModal] = useState(false);
  const [showCoreModal, setShowCoreModal] = useState(false);

  const [activePostIndex, setActivePostIndex] = useState<number | null>(null);

  const [newText, setNewText] = useState("");
  const [newLink, setNewLink] = useState("");

  const [ogData, setOgData] = useState<any>(null);
  const [ogLoading, setOgLoading] = useState(false);

  const [contextDisclosures, setContextDisclosures] = useState<
    { key: string; label: string; note?: string }[]
  >([]);

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

  // ================= SHARE =================
  const handleCopyLink = async () => {
    const url = `${window.location.origin}/profile/${auth.currentUser?.uid}`;
    await navigator.clipboard.writeText(url);
    setFeedback("Link copied");
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/profile/${auth.currentUser?.uid}`;

    if (navigator.share) {
      await navigator.share({ title: "My Profile", url });
    } else {
      await navigator.clipboard.writeText(url);
      setFeedback("Link copied");
    }
  };

  // ================= UPLOAD =================
  const handleUpload = async (file: File) => {
    const url = await uploadProfileImage(file, auth.currentUser!.uid);
    setPreview(url);
  };

  // ================= OG =================
  const fetchOG = async (url: string) => {
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

  // ================= POST =================
  const handleSavePost = async () => {
    if (!newText || !newLink) return;

    const post = {
      text: newText,
      link: newLink,
      previewImage: ogData?.image || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    let updated = [...(profile.postDisclosures || [])];

    if (activePostIndex !== null) {
      updated[activePostIndex] = post;
    } else {
      updated.push(post);
    }

    await updateDoc(doc(db, "valid_profiles", auth.currentUser!.uid), {
      postDisclosures: updated,
    });

    setProfile((prev: any) => ({ ...prev, postDisclosures: updated }));

    resetPostModal();
  };

  const handleDeletePost = async () => {
    if (activePostIndex === null) return;

    const updated = [...profile.postDisclosures];
    updated.splice(activePostIndex, 1);

    await updateDoc(doc(db, "valid_profiles", auth.currentUser!.uid), {
      postDisclosures: updated,
    });

    setProfile((prev: any) => ({ ...prev, postDisclosures: updated }));
    resetPostModal();
  };

  const resetPostModal = () => {
    setShowPostModal(false);
    setActivePostIndex(null);
    setNewText("");
    setNewLink("");
    setOgData(null);
  };

  // ================= CORE =================
  const handleAddDisclosure = (item: any) => {
    if (contextDisclosures.some((d) => d.key === item.key)) return;

    setContextDisclosures([
      ...contextDisclosures,
      { key: item.key, label: item.label, note: "" },
    ]);
  };

  const handleDeleteDisclosure = (key: string) => {
    setContextDisclosures(contextDisclosures.filter((d) => d.key !== key));
  };

  const handleEditNote = (key: string, value: string) => {
    setContextDisclosures((prev) =>
      prev.map((d) => (d.key === key ? { ...d, note: value } : d))
    );
  };

  const saveCore = async () => {
    await updateDoc(doc(db, "valid_profiles", auth.currentUser!.uid), {
      contextDisclosures,
      contextUpdatedAt: new Date(),
    });

    setProfile((prev: any) => ({ ...prev, contextDisclosures }));
    setShowCoreModal(false);
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
          <label className="block bg-gray-800 p-3 rounded cursor-pointer text-sm">
            Upload Photo (+3 pts)
            <input hidden type="file" onChange={(e) => e.target.files && handleUpload(e.target.files[0])} />
          </label>

          <button onClick={handleShare} className="w-full bg-purple-500 p-2 rounded text-sm">
            Share Profile
          </button>

          <button onClick={handleCopyLink} className="w-full bg-gray-700 p-2 rounded text-sm">
            Copy Link
          </button>

          <button onClick={() => setShowCoreModal(true)} className="w-full bg-gray-800 p-2 rounded text-sm">
            Core Disclosures (+2 pts each)
          </button>
        </div>

        {/* POSTS */}
        <div className="grid grid-cols-3 gap-2">
          <div
            onClick={() => {
              resetPostModal();
              setShowPostModal(true);
            }}
            className="aspect-square flex items-center justify-center border border-gray-700 rounded"
          >
            ➕
          </div>

          {(profile.postDisclosures || []).map((post: any, i: number) => (
            <div
              key={i}
              onClick={() => {
                setActivePostIndex(i);
                setNewText(post.text);
                setNewLink(post.link);
                setShowPostModal(true);
              }}
              className="aspect-square overflow-hidden rounded"
            >
              <img src={post.previewImage || `https://image.thum.io/get/${post.link}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        {/* POST MODAL */}
        {showPostModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
            <div className="bg-[#111] p-4 rounded w-full max-w-sm space-y-3">

              <textarea value={newText} onChange={(e) => setNewText(e.target.value)} className="w-full p-2 bg-black border border-gray-700 rounded" />

              <input value={newLink} onChange={(e) => setNewLink(e.target.value)} className="w-full p-2 bg-black border border-gray-700 rounded" />

              {ogLoading && <p className="text-xs">Loading preview...</p>}

              {ogData && <img src={ogData.image} className="w-full h-24 object-cover rounded" />}

              <button disabled={!newLink} onClick={handleSavePost} className={`w-full p-2 rounded ${newLink ? "bg-purple-500" : "bg-gray-700"}`}>
                Save
              </button>

              {activePostIndex !== null && (
                <button onClick={handleDeletePost} className="w-full bg-red-500 p-2 rounded">
                  Delete
                </button>
              )}

              <button onClick={resetPostModal} className="w-full bg-gray-700 p-2 rounded">
                Close
              </button>

            </div>
          </div>
        )}

        {/* CORE MODAL */}
        {showCoreModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
            <div className="bg-[#111] p-4 rounded w-full max-w-sm space-y-3">

              {disclosureOptions.map((item) => {
                const exists = contextDisclosures.some((d) => d.key === item.key);

                return (
                  <button
                    key={item.key}
                    disabled={exists}
                    onClick={() => handleAddDisclosure(item)}
                    className={`w-full p-2 text-left border rounded ${
                      exists ? "border-gray-800 text-gray-600" : "border-gray-700"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}

              {contextDisclosures.map((d) => (
                <div key={d.key} className="border border-gray-800 p-2 rounded space-y-2">
                  <div className="flex justify-between text-sm">
                    {d.label}
                    <button onClick={() => handleDeleteDisclosure(d.key)} className="text-red-400 text-xs">
                      Remove
                    </button>
                  </div>

                  <textarea
                    value={d.note || ""}
                    onChange={(e) => handleEditNote(d.key, e.target.value)}
                    placeholder="Optional note..."
                    className="w-full p-2 bg-black border border-gray-700 rounded text-xs"
                  />
                </div>
              ))}

              <button onClick={saveCore} className="w-full bg-purple-500 p-2 rounded">
                Save
              </button>

              <button onClick={() => setShowCoreModal(false)} className="w-full bg-gray-700 p-2 rounded">
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
