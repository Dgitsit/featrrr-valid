"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth } from "@/lib/firebase";
import { generateVerificationCode } from "@/lib/generateCode";

type Platform = "instagram" | "tiktok" | "youtube";

export default function SocialsForm({ userId }: { userId: string }) {
  const [platform, setPlatform] = useState<Platform>("instagram");

  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const [verified, setVerified] = useState(false);
  const [pending, setPending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // 🔥 LOAD EXISTING DATA
  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, "valid_profiles", userId));
        if (!snap.exists()) return;

        const data = snap.data();
        const social = data?.socials?.[platform];

        setUsername(social?.username || "");
        setCode(social?.verificationCode || "");
        setVerified(social?.verified || false);
        setPending(!social?.verified && !!social?.verificationCode);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, [platform, userId]);

  // 🔥 GENERATE CODE
  const handleGenerate = async () => {
    if (!username.trim()) {
      alert("Enter your username first");
      return;
    }

    const newCode = generateVerificationCode();

    try {
      await updateDoc(doc(db, "valid_profiles", userId), {
        [`socials.${platform}`]: {
          username: username.trim(),
          verified: false,
          verificationCode: newCode,
        },
      });

      setCode(newCode);
      setPending(true);
      setVerified(false);
    } catch (err) {
      console.error(err);
      alert("Error generating code");
    }
  };

  // 🔥 COPY CODE
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 🔥 VERIFY + SCORE
  const handleVerify = async () => {
    const user = auth.currentUser;
    if (!user || user.uid !== userId) {
      alert("Please log in to verify");
      return;
    }

    if (!username.trim() || !code) {
      alert("Generate a code and add it to your bio first");
      return;
    }

    setLoading(true);

    try {
      const idToken = await user.getIdToken();

      const res = await fetch("/api/verify-social", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          username: username.trim(),
          code,
          platform,
        }),
      });

      if (res.status === 401) {
        alert("Session expired. Please log in again.");
        return;
      }

      const data = await res.json();

      if (!data.success) {
        alert("Verification failed");
        return;
      }

      setVerified(true);
      setPending(false);

      if (data.scoreAdded > 0) {
        alert(`+${data.scoreAdded} score`);
      }

      window.dispatchEvent(new Event("featrrr:verified"));
    } catch (err) {
      console.error(err);
      alert("Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#111] p-5 rounded-xl w-full max-w-md">

      {/* PLATFORM SWITCH */}
      <div className="flex gap-2 mb-5">
        {["instagram", "tiktok", "youtube"].map((p) => (
          <button
            key={p}
            onClick={() => setPlatform(p as Platform)}
            className={`flex-1 py-2 rounded text-sm ${
              platform === p
                ? "bg-white text-black"
                : "bg-black border border-gray-700 text-gray-300"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <h2 className="text-lg font-semibold mb-4 capitalize">
        Verify {platform}
      </h2>

      {/* STEP 1 */}
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="@username"
        className="w-full px-3 py-2 rounded bg-black border border-gray-700 mb-4"
      />

      {!code && (
        <button
          onClick={handleGenerate}
          className="w-full py-2 bg-gradient-to-r from-purple-500 to-orange-400 rounded"
        >
          Generate Verification Code
        </button>
      )}

      {code && !verified && (
        <div className="mt-4">

          <div className="flex justify-between items-center bg-black border border-gray-700 px-3 py-2 rounded">
            <span className="text-sm">{code}</span>

            <button
              onClick={handleCopy}
              className="text-xs text-purple-400"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <button
            onClick={handleVerify}
            disabled={loading}
            className="w-full mt-4 py-2 bg-green-600 rounded"
          >
            {loading ? "Verifying..." : "Verify Now"}
          </button>
        </div>
      )}

      {pending && !verified && (
        <p className="text-yellow-400 text-xs mt-3">
          Verification pending...
        </p>
      )}

      {verified && (
        <p className="text-green-400 mt-3 text-sm">
          ✔ {platform} verified
        </p>
      )}
    </div>
  );
}
