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

  const [contextDisclosures, setContextDisclosures] = useState<string[]>([]);
  const [contextNotes, setContextNotes] = useState("");
  const [showContextModal, setShowContextModal] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [newText, setNewText] = useState("");
  const [newLink, setNewLink] = useState("");

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) return (window.location.href = "/login");

      const snap = await getDoc(doc(db, "valid_profiles", user.uid));
      const data = snap.data();

      setProfile(data);
      setContextDisclosures(data?.contextDisclosures || []);
      setContextNotes(data?.contextNotes || "");
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const score = calculateScore({
    ...profile,
    contextDisclosures,
  });

  // =========================
  // SHARE / COPY
  // =========================
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

  // =========================
  // UPLOAD
  // =========================
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

  // =========================
  // CORE DISCLOSURES
  // =========================
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

  // =========================
  // ADD POST
  // =========================
  const handleAddPost = async () => {
    const user = auth.currentUser;
    if (!user || !newText) return;

    const now = new Date();

    const newPost = {
      text: newText,
      link: newLink,
      createdAt: now,
      updatedAt: now,
    };

    const updated = [...(profile.postDisclosures || []), newPost];

    await updateDoc(doc(db, "valid_profiles", user.uid), {
      postDisclosures: updated,
    });

    setProfile((prev: any) => ({
      ...prev,
      postDisclosures: updated,
    }));

    setNewText("");
    setNewLink("");
    setShowModal(false);
  };

  if (loading || !profile) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

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

        {/* CARD */}
        <div className="flex justify-center">
          <CreatorCard creator={creatorData} />
        </div>

        {/* ACTIONS */}
        <div className="bg-[#111] p-6 rounded-xl space-y-3">

          <label className="block cursor-pointer bg-gray-800 p-3 rounded">
            Upload Photo <span className="text-green-400">+3 pts</span>
            <input
              type="file"
              hidden
              onChange={(e) =>
                e.target.files && handleUpload(e.target.files[0])
              }
            />
          </label>

          <button onClick={handleShare} className="w-full bg-purple-500 p-3 rounded">
            Share Profile
          </button>

          <button onClick={handleCopyLink} className="w-full bg-gray-700 p-3 rounded">
            Copy Link
          </button>

          <button
            onClick={() => setShowContextModal(true)}
            className="w-full bg-gray-800 p-3 rounded"
          >
            Core Disclosure <span className="text-green-400">+2 pts</span>
          </button>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-3 gap-2">

          <div
            onClick={() => setShowModal(true)}
            className="aspect-square flex flex-col items-center justify-center border border-gray-700 rounded cursor-pointer"
          >
            <span className="text-3xl">➕</span>
            <span className="text-green-400 text-xs mt-1">+1 pt</span>
          </div>

          {(profile.postDisclosures || []).map((post: any, i: number) => (
            <div
              key={i}
              className="aspect-square bg-gray-900 rounded"
            />
          ))}

        </div>

        {/* POST MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
            <div className="bg-[#111] p-4 rounded-xl w-full max-w-md space-y-3">

              <textarea
                placeholder="Disclosure..."
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                className="w-full p-2 bg-black border border-gray-700 rounded"
              />

              <input
                placeholder="Link (optional)"
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                className="w-full p-2 bg-black border border-gray-700 rounded"
              />

              <button
                onClick={handleAddPost}
                className="w-full bg-purple-500 p-2 rounded"
              >
                Post (+1 pt)
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-gray-700 p-2 rounded"
              >
                Cancel
              </button>

            </div>
          </div>
        )}

        {/* CORE MODAL */}
        {showContextModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
            <div className="bg-[#111] p-4 rounded-xl w-full max-w-md space-y-3">

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
                  className={`p-2 rounded border text-left ${
                    contextDisclosures.includes(item.key)
                      ? "border-green-500 text-green-400"
                      : "border-gray-700 text-gray-300"
                  }`}
                >
                  {item.label}
                </button>
              ))}

              <textarea
                placeholder="Optional notes"
                value={contextNotes}
                onChange={(e) => setContextNotes(e.target.value)}
                className="w-full p-2 bg-black border border-gray-700 rounded"
              />

              <button
                onClick={saveContext}
                className="w-full bg-purple-500 p-2 rounded"
              >
                Save (+2 pts)
              </button>

              <button
                onClick={() => setShowContextModal(false)}
                className="w-full bg-gray-700 p-2 rounded"
              >
                Cancel
              </button>

            </div>
          </div>
        )}

        {feedback && (
          <p className="text-green-400 text-center">{feedback}</p>
        )}

      </div>
    </div>
  );
}
