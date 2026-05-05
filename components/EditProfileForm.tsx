"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function EditProfileForm({ userId }: { userId: string }) {
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // 🔥 Load existing profile data
  useEffect(() => {
    const loadProfile = async () => {
      const ref = doc(db, "valid_profiles", userId);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setDisplayName(data.displayName || "");
        setBio(data.bio || "");
      }
    };

    loadProfile();
  }, [userId]);

  // 🔥 Save profile
  const handleSave = async () => {
    if (!displayName.trim()) return;

    setLoading(true);
    setSaved(false);

    try {
      const ref = doc(db, "valid_profiles", userId);

      await updateDoc(ref, {
        displayName: displayName.trim(),
        bio: bio.trim(),
        updatedAt: new Date(),
      });

      setSaved(true);

      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("❌ Error updating profile:", err);
    }

    setLoading(false);
  };

  return (
    <div className="mt-8 w-[300px] bg-[#111] p-4 rounded-xl">
      <h2 className="text-lg mb-4">Edit Profile</h2>

      {/* DISPLAY NAME */}
      <input
        placeholder="Display name"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        className="w-full mb-3 p-2 rounded bg-black border border-gray-700"
      />

      {/* BIO */}
      <textarea
        placeholder="Write a short bio..."
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        className="w-full mb-4 p-2 rounded bg-black border border-gray-700 resize-none"
        rows={3}
      />

      {/* SAVE BUTTON */}
      <button
        onClick={handleSave}
        disabled={loading}
        className="w-full py-2 rounded bg-gradient-to-r from-purple-500 to-orange-400"
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>

      {saved && (
        <div className="text-green-500 text-sm mt-2">
          Profile updated ✅
        </div>
      )}
    </div>
  );
}
