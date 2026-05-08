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

  // ✅ CONTEXT STATE
  const [contextDisclosures, setContextDisclosures] = useState<any[]>([]);

  const cardRef = useRef<HTMLDivElement>(null);

  // LOAD USER
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        window.location.href = "/login";
        return;
      }

      const snap = await getDoc(doc(db, "valid_profiles", user.uid));

      if (!snap.exists()) {
        window.location.href = "/onboarding";
        return;
      }

      const data = snap.data();

      setProfile(data);

      setInstagram(data?.socials?.instagram || "");
      setTiktok(data?.socials?.tiktok || "");
      setYoutube(data?.socials?.youtube || "");

      // ✅ LOAD CONTEXT
      setContextDisclosures(data?.contextDisclosures || []);

      setLoading(false);
    });

    return () => unsub();
  }, []);

  const score = calculateScore({
    ...profile,
    contextDisclosures,
  });

  // IMAGE UPLOAD
  const handleUpload = async (file: File) => {
    const user = auth.currentUser;
    if (!file || !user) return;

    const storageRef = ref(storage, `profiles/${user.uid}/profile.jpg`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    await updateDoc(doc(db, "valid_profiles", user.uid), {
      photoURL: url,
      "activity.lastUpdated": new Date(),
    });

    setProfile((prev: any) => ({ ...prev, photoURL: url }));
    setPreview(url);
    setFeedback("Photo updated");
  };

  // SAVE SOCIALS
  const saveSocials = async () => {
    const user = auth.currentUser;
    if (!user) return;

    await updateDoc(doc(db, "valid_profiles", user.uid), {
      socials: { instagram, tiktok, youtube },
      "activity.lastUpdated": new Date(),
    });

    setProfile((prev: any) => ({
      ...prev,
      socials: { instagram, tiktok, youtube },
    }));

    setFeedback("Socials saved");
  };

  // ADD POST
  const addPost = async () => {
    const user = auth.currentUser;
    if (!user || !postText) return;

    const newPost = {
      text: postText,
      link: postLink,
      createdAt: new Date(),
    };

    const updated = [...(profile.postDisclosures || []), newPost];

    await updateDoc(doc(db, "valid_profiles", user.uid), {
      postDisclosures: updated,
      "activity.lastUpdated": new Date(),
    });

    setProfile((prev: any) => ({
      ...prev,
      postDisclosures: updated,
    }));

    setPostText("");
    setPostLink("");
  };

  // DELETE POST
  const deletePost = async (index: number) => {
    const user = auth.currentUser;
    if (!user) return;

    const updated = [...(profile.postDisclosures || [])];
    updated.splice(index, 1);

    await updateDoc(doc(db, "valid_profiles", user.uid), {
      postDisclosures: updated,
      "activity.lastUpdated": new Date(),
    });

    setProfile((prev: any) => ({
      ...prev,
      postDisclosures: updated,
    }));
  };

  // SHARE CARD
  const handleGenerateImage = async () => {
    if (!cardRef.current) return;

    const canvas = await html2canvas(cardRef.current, {
      useCORS: true,
      scale: 2,
    });

    const link = document.createElement("a");
    link.href = canvas.toDataURL();
    link.download = "featrrr-card.png";
    link.click();
  };

  if (loading || !profile) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const creatorData = {
    id: auth.currentUser?.uid,
    displayName: profile.displayName,
    score,
    status: profile.status || "active",
    subscriptionStatus: profile.subscriptionStatus,
    profilePhoto: preview || profile.photoURL,
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center px-4 py-8 gap-6">

      {/* CARD */}
      <div ref={cardRef}>
        <CreatorCard creator={creatorData} />
      </div>

      {/* UPLOAD */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;

          const localUrl = URL.createObjectURL(file);
          setPreview(localUrl);

          handleUpload(file);
        }}
      />

      <button onClick={handleGenerateImage} className="px-6 py-2 bg-purple-500 rounded">
        Share Card
      </button>

      {/* SOCIALS */}
      <div className="w-full max-w-sm bg-[#111] p-4 rounded">
        <h3>Social Links</h3>
        <input value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="Instagram" className="w-full mb-2 p-2 bg-black" />
        <input value={tiktok} onChange={(e) => setTiktok(e.target.value)} placeholder="TikTok" className="w-full mb-2 p-2 bg-black" />
        <input value={youtube} onChange={(e) => setYoutube(e.target.value)} placeholder="YouTube" className="w-full mb-2 p-2 bg-black" />
        <button onClick={saveSocials} className="w-full py-2 bg-purple-500 rounded">
          Save Socials
        </button>
      </div>

      {/* POST DISCLOSURES */}
      <div className="w-full max-w-sm bg-[#111] p-4 rounded">
        <h3>Transparency Posts</h3>

        <textarea
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          placeholder="What are you disclosing?"
          className="w-full p-2 bg-black mb-2"
        />

        <input
          value={postLink}
          onChange={(e) => setPostLink(e.target.value)}
          placeholder="Link to post"
          className="w-full p-2 bg-black mb-2"
        />

        <button onClick={addPost} className="w-full py-2 bg-purple-500 rounded">
          Add Post
        </button>

        <div className="mt-4 space-y-2">
          {(profile.postDisclosures || []).map((p: any, i: number) => (
            <div key={i} className="bg-black p-2 rounded">
              <p>{p.text}</p>
              {p.link && (
                <a href={p.link} target="_blank" className="text-blue-400 text-xs">
                  View Post
                </a>
              )}
              <button onClick={() => deletePost(i)} className="text-red-400 text-xs">
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ================= CONTEXT DISCLOSURES ================= */}
      <div className="w-full max-w-sm bg-[#111] p-5 rounded-xl">
        <h3 className="text-sm text-gray-400 mb-4">
          Transparency Context
        </h3>

        {[
          { type: "researchBacked", label: "Content backed by research" },
          { type: "notProfessionalAdvice", label: "Not professional advice" },
          { type: "mayNotReflectLatest", label: "May not reflect latest research" },
          { type: "dueDiligence", label: "Due diligence on promotions" },
          { type: "sourcesCited", label: "Sources are cited" },
          { type: "originalContent", label: "Content is original" },
        ].map((item) => {
          const current = contextDisclosures.find(
            (d) => d.type === item.type
          );

          const enabled = current?.enabled || false;
          const note = current?.note || "";

          return (
            <div key={item.type} className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">{item.label}</span>

                <button
                  onClick={() => {
                    setContextDisclosures((prev) => {
                      const exists = prev.find((d) => d.type === item.type);

                      if (exists) {
                        return prev.map((d) =>
                          d.type === item.type
                            ? { ...d, enabled: !d.enabled }
                            : d
                        );
                      }

                      return [...prev, { type: item.type, enabled: true, note: "" }];
                    });
                  }}
                  className={`w-12 h-6 flex items-center rounded-full p-1 ${
                    enabled ? "bg-green-500" : "bg-gray-700"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full ${
                      enabled ? "translate-x-6" : ""
                    }`}
                  />
                </button>
              </div>

              {enabled && (
                <textarea
                  value={note}
                  onChange={(e) => {
                    const val = e.target.value;

                    setContextDisclosures((prev) =>
                      prev.map((d) =>
                        d.type === item.type ? { ...d, note: val } : d
                      )
                    );
                  }}
                  className="w-full p-2 bg-black border border-gray-700 rounded text-sm"
                  placeholder="Optional context..."
                />
              )}
            </div>
          );
        })}

        <button
          onClick={async () => {
            const user = auth.currentUser;
            if (!user) return;

            await updateDoc(doc(db, "valid_profiles", user.uid), {
              contextDisclosures,
              "activity.lastUpdated": new Date(),
            });

            setProfile((prev: any) => ({
              ...prev,
              contextDisclosures,
            }));

            setFeedback("Context saved");
          }}
          className="w-full py-2 mt-3 bg-gradient-to-r from-purple-500 to-orange-400 rounded"
        >
          Save Context
        </button>
      </div>

      {feedback && <p className="text-green-400">{feedback}</p>}
    </div>
  );
}
