"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { calculateScore } from "@/utils/calculateScore";
import CreatorCard from "@/components/CreatorCard";
import ProfileImageUpload from "@/components/ProfileImageUpload";
import ScoreBreakdown from "@/components/ScoreBreakdown";
import CoreDisclosurePanel, {
  CoreDisclosure,
} from "@/components/CoreDisclosurePanel";
import TransparencyProgress from "@/components/TransparencyProgress";
import { uploadProfileImage } from "@/lib/upload";

export const dynamic = "force-dynamic";

export default function Dashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");

  const [preview, setPreview] = useState<string | null>(null);

  const [showPostModal, setShowPostModal] = useState(false);

  const [activePostIndex, setActivePostIndex] = useState<number | null>(null);

  const [newText, setNewText] = useState("");
  const [newLink, setNewLink] = useState("");
  const [bio, setBio] = useState("");
  const [bioSaving, setBioSaving] = useState(false);

  const [ogData, setOgData] = useState<any>(null);
  const [ogLoading, setOgLoading] = useState(false);

  const [contextDisclosures, setContextDisclosures] = useState<
    CoreDisclosure[]
  >([]);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) return (window.location.href = "/login");

      const snap = await getDoc(doc(db, "valid_profiles", user.uid));
      const data = snap.data();
      if (!data) return;

      setProfile(data);
      setContextDisclosures(data.contextDisclosures || []);
      setBio(data.bio || "");
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const score = calculateScore({
    ...profile,
    contextDisclosures,
  });

  // ================= SHARE =================
  const recordShareBoost = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const idToken = await user.getIdToken();
    const res = await fetch("/api/share-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
    });

    if (res.status === 401) {
      setFeedback("Session expired. Please log in again.");
      return;
    }

    if (!res.ok) {
      setFeedback("Profile shared, but boost was not recorded.");
      return;
    }

    const data = await res.json();
    setProfile((prev: any) => ({
      ...prev,
      shareBoostCount: data.shareBoostCount,
      shareBoostPoints: data.shareBoostPoints,
      lastSharedAt: data.lastSharedAt,
    }));
    setFeedback(data.maxed ? "Share boost maxed." : "+1 share trust point added.");
  };

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/profile/${auth.currentUser?.uid}`;
    try {
      await navigator.clipboard.writeText(url);
      setFeedback("Link copied");
    } catch {
      setFeedback("Copy unavailable. You can copy the URL from your browser.");
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/profile/${auth.currentUser?.uid}`;
    let shared = false;

    try {
      if (navigator.share) {
        await navigator.share({ title: "My Profile", url });
        shared = true;
      } else {
        await navigator.clipboard.writeText(url);
        shared = true;
      }
    } catch (err: any) {
      if (err?.name === "AbortError") {
        setFeedback("Share canceled");
        return;
      }

      try {
        await navigator.clipboard.writeText(url);
        shared = true;
      } catch {
        setFeedback("Share unavailable. You can copy the URL from your browser.");
        return;
      }
    }

    if (shared) {
      await recordShareBoost();
    }
  };

  // ================= UPLOAD =================
  const handleUpload = async (file: File) => {
    const user = auth.currentUser;
    if (!user) return;

    const url = await uploadProfileImage(file, user.uid);

    const idToken = await user.getIdToken();
    const res = await fetch("/api/update-profile-photo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ photoURL: url }),
    });

    if (res.status === 401) {
      alert("Session expired. Please log in again.");
      return;
    }

    if (!res.ok) {
      console.error("Failed to save profile photo");
      return;
    }

    setPreview(url);
  };

  const saveBio = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const cleanBio = bio.trim().slice(0, 220);
    setBioSaving(true);

    try {
      await updateDoc(doc(db, "valid_profiles", user.uid), {
        bio: cleanBio,
      });

      setBio(cleanBio);
      setProfile((prev: any) => ({ ...prev, bio: cleanBio }));
      setFeedback("Bio saved");
    } finally {
      setBioSaving(false);
    }
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
  const handleToggleDisclosure = (item: CoreDisclosure) => {
    if (contextDisclosures.some((d) => d.key === item.key)) {
      handleDeleteDisclosure(item.key);
      return;
    }

    setContextDisclosures([
      ...contextDisclosures,
      { key: item.key, label: item.label, note: "" },
    ]);
  };

  const handleDeleteDisclosure = (key: string) => {
    setContextDisclosures(contextDisclosures.filter((d) => d.key !== key));
  };

  const saveCore = async () => {
    await updateDoc(doc(db, "valid_profiles", auth.currentUser!.uid), {
      contextDisclosures,
      contextUpdatedAt: new Date(),
    });

    setProfile((prev: any) => ({ ...prev, contextDisclosures }));
    setFeedback("Core disclosures saved");
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
    bio: profile.bio,
  };
  const shareBoostPoints = Math.min(Number(profile.shareBoostPoints) || 0, 3);
  const shareBoostMaxed = shareBoostPoints >= 3;

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-black text-white px-4 py-6">
      <div className="mx-auto max-w-md space-y-6">

        <CreatorCard creator={creatorData} />

        {/* ACTIONS */}
        <div className="space-y-3">
          <div className="flex gap-2">
          <ProfileImageUpload
            currentImage={preview || profile.photoURL}
            onUpload={handleUpload}
            variant="action"
          />

          <button
            onClick={handleShare}
            className="flex min-h-16 flex-1 flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.055] px-3 py-2 text-center text-xs transition hover:bg-white/[0.09]"
          >
            <span className="text-lg leading-none">↗</span>
            <span className="mt-1 font-semibold text-white">Share</span>
            <span className="text-[10px] font-semibold text-emerald-300">
              {shareBoostMaxed ? "max" : "+1"}
            </span>
          </button>

          <button
            onClick={handleCopyLink}
            className="flex min-h-16 flex-1 flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.055] px-3 py-2 text-center text-xs transition hover:bg-white/[0.09]"
          >
            <span className="text-lg leading-none">⛓</span>
            <span className="mt-1 font-semibold text-white">Copy</span>
            <span className="text-[10px] font-semibold text-zinc-500">link</span>
          </button>
          </div>

          <p className="text-center text-xs text-zinc-500">
            {shareBoostMaxed
              ? "Share boost maxed."
              : "Earn up to 3 trust points by sharing your Valid profile."}
          </p>
        </div>

        <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                Creator Bio
              </p>
              <h2 className="mt-1 text-base font-semibold text-white">
                Add your public summary
              </h2>
            </div>
            <span className="text-xs text-zinc-500">{bio.length}/220</span>
          </div>
          <textarea
            value={bio}
            maxLength={220}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell brands and followers what you create, who you help, and what you stand for."
            className="mt-3 min-h-24 w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-purple-300/50"
          />
          <button
            onClick={saveBio}
            disabled={bioSaving}
            className="mt-3 w-full rounded-xl bg-purple-500 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {bioSaving ? "Saving..." : "Save Bio"}
          </button>
        </section>

        <CoreDisclosurePanel
          selected={contextDisclosures}
          onToggle={handleToggleDisclosure}
          onRemove={handleDeleteDisclosure}
          onSave={saveCore}
        />

        <TransparencyProgress
          profile={{
            ...profile,
            bio,
            photoURL: preview || profile.photoURL,
            postDisclosures: profile.postDisclosures || [],
          }}
          contextDisclosures={contextDisclosures}
        />

        <ScoreBreakdown
          profile={{
            ...profile,
            bio,
            photoURL: preview || profile.photoURL,
            postDisclosures: profile.postDisclosures || [],
            contextDisclosures,
          }}
        />

        {/* POSTS */}
        <div className="grid grid-cols-3 gap-2">
          <div
            onClick={() => {
              resetPostModal();
              setShowPostModal(true);
            }}
            className="aspect-square flex flex-col items-center justify-center border border-gray-700 rounded"
          >
            <span className="text-2xl">➕</span>
            <span className="text-xs text-green-400 mt-1">+1</span>
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
              <img
                src={post.previewImage || `https://image.thum.io/get/${post.link}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* POST MODAL */}
        {showPostModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
            <div className="bg-[#111] p-4 rounded w-full max-w-sm space-y-3">

              <textarea
                placeholder="disclosure"
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                className="w-full p-2 bg-black border border-gray-700 rounded"
              />

              <input
                placeholder="mandatory link"
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                className="w-full p-2 bg-black border border-gray-700 rounded"
              />

              {ogLoading && <p className="text-xs">Loading preview...</p>}

              {ogData && (
                <img src={ogData.image} className="w-full h-24 object-cover rounded" />
              )}

              <button
                disabled={!newText || !newLink}
                onClick={handleSavePost}
                className={`w-full p-2 rounded ${
                  newText && newLink ? "bg-purple-500" : "bg-gray-700"
                }`}
              >
                Save (+1 pt)
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

        {feedback && <p className="text-green-400 text-center text-sm">{feedback}</p>}

      </div>
    </div>
  );
}
