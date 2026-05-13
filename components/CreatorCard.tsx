"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

type Creator = {
  id?: string;
  displayName?: string;
  score?: number;
  status?: string;
  subscriptionStatus?: string;
  profilePhoto?: string;
  badgeNumber?: number | string;
};

export default function CreatorCard({ creator }: { creator: Creator }) {
  const isPaid = creator.subscriptionStatus === "active";

  const safeId = creator.id || "";
  const name = creator.displayName || "user";

  // ✅ SAFE SCORE
  const scoreRaw = Number(creator.score);
  const score = isNaN(scoreRaw) ? 0 : Math.max(0, Math.min(scoreRaw, 100));

  const badge = creator.badgeNumber || "—";

  const [imageError, setImageError] = useState(false);

  const photo =
    creator.profilePhoto && creator.profilePhoto !== ""
      ? `${creator.profilePhoto}?t=${Date.now()}`
      : null;

  useEffect(() => {
    setImageError(false);
  }, [creator.profilePhoto]);

  // ================= BADGE COLOR SYSTEM =================
  const getScoreStyle = () => {
    if (score <= 74) {
      return {
        text: "text-green-400",
        bar: "bg-green-500",
      };
    }
    if (score <= 85) {
      return {
        text: "text-blue-400",
        bar: "bg-blue-500",
      };
    }
    if (score <= 92) {
      return {
        text: "text-yellow-400",
        bar: "bg-yellow-500",
      };
    }
    return {
      text: "bg-gradient-to-r from-purple-400 to-orange-400 text-transparent bg-clip-text",
      bar: "bg-gradient-to-r from-purple-500 to-orange-400",
    };
  };

  const scoreStyle = getScoreStyle();

  return (
    <Link href={safeId ? `/profile/${safeId}` : "#"}>
      <div className="w-full max-w-[260px] mx-auto cursor-pointer">

        {/* GRADIENT BORDER */}
        <div className="rounded-xl p-[1px] bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400">

          {/* CARD */}
          <div className="bg-[#0b0b0f] rounded-xl overflow-hidden shadow-lg">

            {/* IMAGE */}
            <div className="relative h-32 w-full bg-gray-900 overflow-hidden">

              {photo && !imageError ? (
                <img
                  src={photo}
                  alt="profile"
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-500">
                  👤
                </div>
              )}

              {/* DARK OVERLAY */}
              <div className="absolute inset-0 bg-black/40" />

              {/* TOP ROW */}
              <div className="absolute top-2 left-2 right-2 flex justify-between items-center text-[10px]">

                <div className="px-2 py-0.5 rounded bg-black/70 text-gray-300">
                  #{badge}
                </div>

                <div
                  className={`px-2 py-0.5 rounded-full text-[9px] ${
                    isPaid
                      ? "bg-gradient-to-r from-purple-500 to-orange-400 text-white"
                      : "bg-gray-800 text-gray-300"
                  }`}
                >
                  {isPaid ? "VALID" : "FREE"}
                </div>

              </div>

              {/* NAME */}
              <div className="absolute bottom-2 left-3 right-3">
                <h2 className="text-sm font-semibold truncate text-white">
                  @{name}
                </h2>
              </div>

            </div>

            {/* SCORE */}
            <div className="px-4 py-3">

              <p className="text-[9px] text-gray-400 tracking-wide">
                SOCIAL CREDIBILITY SCORE
              </p>

              <div className="flex items-end gap-2 mt-1">

                <span className={`text-2xl font-bold ${scoreStyle.text}`}>
                  {score}
                </span>

                <span className="text-[10px] text-gray-500 mb-[2px]">
                  /100
                </span>

              </div>

              {/* PROGRESS BAR */}
              <div className="w-full h-1.5 bg-gray-800 rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-1.5 rounded-full ${scoreStyle.bar}`}
                  style={{ width: `${score}%` }}
                />
              </div>

              {/* LABEL UNDER SCORE */}
              <p className="text-[10px] text-gray-500 mt-2">
                {isPaid
                  ? "Transparency verified"
                  : "Upgrade for full credibility"}
              </p>

            </div>

          </div>
        </div>
      </div>
    </Link>
  );
}
