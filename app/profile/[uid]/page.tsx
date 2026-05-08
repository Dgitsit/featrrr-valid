"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "next/navigation";
import Badge from "@/components/Badge";
import { calculateScore } from "@/utils/calculateScore";

export default function ProfilePage() {
  const params = useParams();
  const uid = params.uid as string;

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const ref = doc(db, "valid_profiles", uid);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          setProfile(null);
          return;
        }

        setProfile(snap.data());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (uid) loadProfile();
  }, [uid]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 text-center px-6">
        This creator isn’t on Featrrr Valid.
      </div>
    );
  }

  const username =
    profile.displayName ||
    profile.email?.split("@")[0] ||
    "user";

  const score = calculateScore(profile);

  const persistent = profile?.persistentDisclosures || {};
  const context = profile?.contextDisclosures || [];
  const posts = profile?.postDisclosures || [];

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center py-10 px-6 gap-6">

      {/* ================= PROFILE CARD ================= */}
      <div className="w-full max-w-md bg-[#111] rounded-xl p-6 text-center border border-gray-800 shadow-lg">

        {/* IMAGE */}
        <div className="w-full h-[220px] bg-gray-800 rounded-md mb-4 overflow-hidden">
          {profile.photoURL ? (
            <img
              src={profile.photoURL}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              No Photo
            </div>
          )}
        </div>

        {/* NAME */}
        <h1 className="text-xl font-semibold">@{username}</h1>

        {/* BADGES */}
        <div className="flex justify-center gap-2 mt-2">
          {profile.subscriptionStatus === "active" && (
            <Badge type="premium" />
          )}
        </div>

        {/* STATUS */}
        <div className="mt-2 text-sm text-gray-400">
          {profile.subscriptionStatus === "active"
            ? "Verified Transparency Profile"
            : "Basic Profile"}
        </div>

        {/* SCORE */}
        <div className="mt-4 text-sm">
          Transparency Score: {score}/100
        </div>

        <div className="w-full bg-gray-700 h-2 rounded mt-1">
          <div
            className="h-2 rounded bg-gradient-to-r from-purple-500 to-orange-400"
            style={{ width: `${score}%` }}
          />
        </div>

      </div>

      {/* ================= PERSISTENT DISCLOSURES ================= */}
      <div className="w-full max-w-md bg-[#111] p-5 rounded-xl">
        <h3 className="text-sm text-gray-400 mb-3">
          Core Disclosures
        </h3>

        {Object.entries(persistent)
          .filter(([_, val]) => val === true)
          .map(([key]) => (
            <div key={key} className="text-sm text-green-400 mb-1">
              ✔ {key}
            </div>
          ))}

        {Object.values(persistent).every((v) => !v) && (
          <p className="text-gray-500 text-sm">
            No core disclosures provided
          </p>
        )}
      </div>

      {/* ================= CONTEXT DISCLOSURES ================= */}
      <div className="w-full max-w-md bg-[#111] p-5 rounded-xl">
        <h3 className="text-sm text-gray-400 mb-3">
          Transparency Context
        </h3>

        {context
          .filter((d: any) => d.enabled)
          .map((d: any, i: number) => (
            <div key={i} className="mb-3">
              <p className="text-green-400 text-sm">
                ✔ {d.type}
              </p>

              {d.note && (
                <p className="text-gray-400 text-xs mt-1">
                  {d.note}
                </p>
              )}
            </div>
          ))}

        {context.filter((d: any) => d.enabled).length === 0 && (
          <p className="text-gray-500 text-sm">
            No additional context provided
          </p>
        )}
      </div>

      {/* ================= POST DISCLOSURES ================= */}
      <div className="w-full max-w-md bg-[#111] p-5 rounded-xl">
        <h3 className="text-sm text-gray-400 mb-3">
          Transparency Activity
        </h3>

        {posts.map((p: any, i: number) => (
          <div key={i} className="mb-4 border-b border-gray-800 pb-3">
            <p className="text-sm">{p.text}</p>

            {p.link && (
              <a
                href={p.link}
                target="_blank"
                className="text-blue-400 text-xs"
              >
                View Post
              </a>
            )}
          </div>
        ))}

        {posts.length === 0 && (
          <p className="text-gray-500 text-sm">
            No activity yet
          </p>
        )}
      </div>

      {/* CTA */}
      <div className="text-center max-w-sm text-gray-400 text-sm">
        Join Featrrr Valid to build trust through transparency.
      </div>

    </main>
  );
}
