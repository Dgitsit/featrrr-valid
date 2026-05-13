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

  // ✅ NEW STRUCTURE
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

      setContextDisclosures(
        Array.isArray(data.contextDisclosures)
          ? data.contextDisclosures
          : []
      );

      setLoading(false);
    });

    return () => unsub();
  }, []);

  const score = calculateScore({
    ...profile,
    contextDisclosures,
  });

  // ================= CORE ACTIONS =================

  const handleAddDisclosure = (item: any) => {
    const exists = contextDisclosures.some((d) => d.key === item.key);
    if (exists) return;

    setContextDisclosures((prev) => [
      ...prev,
      { key: item.key, label: item.label, note: "" },
    ]);
  };

  const handleEditDisclosureNote = (key: string, value: string) => {
    setContextDisclosures((prev) =>
      prev.map((d) => (d.key === key ? { ...d, note: value } : d))
    );
  };

  const handleDeleteDisclosure = (key: string) => {
    setContextDisclosures((prev) => prev.filter((d) => d.key !== key));
  };

  const saveContext = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const payload = {
      contextDisclosures,
      contextUpdatedAt: new Date(),
    };

    await updateDoc(doc(db, "valid_profiles", user.uid), payload);

    setProfile((prev: any) => ({
      ...prev,
      ...payload,
    }));

    setShowContextModal(false);
  };

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
    const user = auth.currentUser;
    if (!file || !user) return;

    const url = await uploadProfileImage(file, user.uid);

    await fetch("/api/update-profile-photo", {
      method: "POST",
      body: JSON.stringify({ userId: user.uid, photoURL: url }),
    });

    setPreview(url);
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

        <CreatorCard creator={creatorData} />

        {/* ACTIONS */}
        <div className="space-y-2">
          <label className="block bg-gray-800 p-3 rounded text-sm cursor-pointer">
            Upload Photo +3 pts
            <input type="file" hidden onChange={(e) => e.target.files && handleUpload(e.target.files[0])} />
          </label>

          <button onClick={handleShare} className="w-full bg-purple-500 p-2 rounded text-sm">
            Share Profile
          </button>

          <button onClick={handleCopyLink} className="w-full bg-gray-700 p-2 rounded text-sm">
            Copy Link
          </button>

          <button onClick={() => setShowContextModal(true)} className="w-full bg-gray-800 p-2 rounded text-sm">
            Core Disclosure +2 pts each
          </button>
        </div>

        {/* CORE MODAL */}
        {showContextModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-[#111] p-4 rounded w-full max-w-sm space-y-4 max-h-[80vh] overflow-y-auto">

              <p className="text-xs text-gray-400">Add Disclosure</p>

              {disclosureOptions.map((item) => {
                const exists = contextDisclosures.some((d) => d.key === item.key);

                return (
                  <button
                    key={item.key}
                    disabled={exists}
                    onClick={() => handleAddDisclosure(item)}
                    className={`w-full p-2 text-left text-sm border rounded ${
                      exists
                        ? "border-gray-800 text-gray-600"
                        : "border-gray-700 text-gray-300"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}

              <p className="text-xs text-gray-400">Your Disclosures</p>

              {contextDisclosures.map((d) => (
                <div key={d.key} className="border border-gray-800 rounded p-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">{d.label}</span>
                    <button onClick={() => handleDeleteDisclosure(d.key)} className="text-red-400 text-xs">
                      Remove
                    </button>
                  </div>

                  <textarea
                    placeholder="Optional note..."
                    value={d.note || ""}
                    onChange={(e) => handleEditDisclosureNote(d.key, e.target.value)}
                    className="w-full p-2 bg-black border border-gray-700 rounded text-xs"
                  />
                </div>
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
