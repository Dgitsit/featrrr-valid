"use client";

import { useEffect, useRef, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import html2canvas from "html2canvas";
import { calculateScore } from "@/utils/calculateScore";
import CreatorCard from "@/components/CreatorCard";
import { uploadProfileImage } from "@/lib/upload";

export default function Dashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  const [contextDisclosures, setContextDisclosures] = useState<string[]>([]);
  const [contextNotes, setContextNotes] = useState("");

  const [showContextModal, setShowContextModal] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [activePost, setActivePost] = useState<any>(null);
  const [activePostIndex, setActivePostIndex] = useState<number | null>(null);

  const [newText, setNewText] = useState("");
  const [newLink, setNewLink] = useState("");

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) return (window.location.href = "/login");

      const snap = await getDoc(doc(db, "valid_profiles", user.uid));
      if (!snap.exists()) return (window.location.href = "/onboarding");

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

  // UPLOAD
  const handleUpload = async (file: File) => {
    const user = auth.currentUser;
    if (!file || !user) return;

    const url = await uploadProfileImage(file, user.uid);

    await fetch("/api/update-profile-photo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: user.uid, photoURL: url }),
    });

    const snap = await getDoc(doc(db, "valid_profiles", user.uid));
    setProfile(snap.data());
    setPreview(url);

    setFeedback("Photo uploaded ✅");
  };

  // CORE DISCLOSURE
  const saveContext = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const payload = {
      contextDisclosures,
      contextNotes,
      contextUpdatedAt: new Date(),
    };

    await updateDoc(doc(db, "valid_profiles", user.uid), payload);

    setProfile((prev: any) => ({
      ...prev,
      ...payload,
    }));

    setShowContextModal(false);
    setFeedback("Core disclosure saved");
  };

  const deleteContext = async () => {
    const user = auth.currentUser;
    if (!user) return;

    await updateDoc(doc(db, "valid_profiles", user.uid), {
      contextDisclosures: [],
      contextNotes: "",
      contextUpdatedAt: null,
    });

    setContextDisclosures([]);
    setContextNotes("");
  };

  // ADD POST
  const handleAddPost = async () => {
    const user = auth.currentUser;
    if (!user || !newText) return;

    let previewData = { title: "", description: "", image: "" };

    if (newLink) {
      try {
        const res = await fetch("/api/og", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: newLink }),
        });

        previewData = await res.json();
      } catch {}
    }

    const now = new Date();

    const newPost = {
      text: newText,
      link: newLink,
      previewImage: previewData.image,
      title: previewData.title,
      description: previewData.description,
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

  // DELETE POST
  const handleDeletePost = async () => {
    const user = auth.currentUser;
    if (!user || activePostIndex === null) return;

    const updated = [...(profile.postDisclosures || [])];
    updated.splice(activePostIndex, 1);

    await updateDoc(doc(db, "valid_profiles", user.uid), {
      postDisclosures: updated,
    });

    setProfile((prev: any) => ({
      ...prev,
      postDisclosures: updated,
    }));

    setActivePost(null);
  };

  // EDIT POST
  const handleEditPost = async () => {
    const user = auth.currentUser;
    if (!user || activePostIndex === null) return;

    let previewData = {
      title: activePost.title,
      description: activePost.description,
      image: activePost.previewImage,
    };

    if (newLink !== activePost.link) {
      try {
        const res = await fetch("/api/og", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: newLink }),
        });

        previewData = await res.json();
      } catch {}
    }

    const updated = [...(profile.postDisclosures || [])];

    updated[activePostIndex] = {
      ...updated[activePostIndex],
      text: newText,
      link: newLink,
      previewImage: previewData.image,
      title: previewData.title,
      description: previewData.description,
      updatedAt: new Date(),
    };

    await updateDoc(doc(db, "valid_profiles", user.uid), {
      postDisclosures: updated,
    });

    setProfile((prev: any) => ({
      ...prev,
      postDisclosures: updated,
    }));

    setActivePost(null);
  };

  if (loading || !profile)
    return <div className="h-screen flex items-center justify-center">Loading...</div>;

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

        <div className="flex justify-center">
          <div className="w-full max-w-sm">
            <CreatorCard creator={creatorData} />

            {(contextDisclosures.length > 0 || contextNotes) && (
              <div className="mt-3 text-xs text-gray-400 text-center">
                Disclosure: {contextDisclosures.join(", ")} {contextNotes}
              </div>
            )}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="bg-[#111] p-6 rounded-xl space-y-3">
          <label className="block cursor-pointer bg-gray-800 p-3 rounded">
            Upload Photo
            <input type="file" hidden onChange={(e) => e.target.files && handleUpload(e.target.files[0])} />
          </label>

          <button onClick={() => setShowContextModal(true)} className="w-full bg-gray-800 p-3 rounded">
            Core Disclosure
          </button>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-3 gap-2">
          <div
            onClick={() => setShowModal(true)}
            className="aspect-square bg-black flex items-center justify-center text-3xl cursor-pointer border border-gray-700 rounded"
          >
            ➕
          </div>

          {(profile.postDisclosures || []).map((post: any, i: number) => (
            <div
              key={i}
              onClick={() => {
                setActivePost(post);
                setActivePostIndex(i);
                setNewText(post.text);
                setNewLink(post.link);
              }}
              className="aspect-square cursor-pointer rounded overflow-hidden"
            >
              {post.previewImage ? (
                <img src={post.previewImage} className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 text-xs">
                  Disclosure
                </div>
              )}
            </div>
          ))}
        </div>

        {/* POST MODAL */}
        {activePost && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
            <div className="bg-[#111] p-4 rounded-xl w-full max-w-md space-y-3">

              {activePost.previewImage && (
                <img src={activePost.previewImage} className="w-full h-52 object-cover rounded" />
              )}

              <textarea
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                className="w-full p-2 bg-black border border-gray-700 rounded"
              />

              <input
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                className="w-full p-2 bg-black border border-gray-700 rounded"
              />

              {activePost.updatedAt && (
                <p className="text-xs text-gray-500">
                  Last updated:{" "}
                  {new Date(
                    activePost.updatedAt.seconds
                      ? activePost.updatedAt.seconds * 1000
                      : activePost.updatedAt
                  ).toLocaleDateString()}
                </p>
              )}

              <button onClick={handleEditPost} className="w-full bg-purple-500 p-2 rounded">
                Save Edit
              </button>

              <button onClick={handleDeletePost} className="w-full bg-red-500 p-2 rounded">
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
