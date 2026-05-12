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
  contextDisclosures?: string[];
};

export default function CreatorCard({ creator }: { creator: Creator }) {
  const isPaid = creator.subscriptionStatus === "active";

  // ✅ SAFE SCORE
  const scoreRaw = Number(creator.score);
  const score = isNaN(scoreRaw) ? 0 : Math.max(0, Math.min(scoreRaw, 100));

  const [imageError, setImageError] = useState(false);

  const photo =
    creator.profilePhoto && creator.profilePhoto !== ""
      ? `${creator.profilePhoto}?t=${Date.now()}`
      : null;

  useEffect(() => {
    setImageError(false);
  }, [creator.profilePhoto]);

  const disclosures = creator.contextDisclosures || [];

  // 🔥 BADGE SYSTEM
  const getBadgeStyle = (score: number) => {
    if (score <= 74) return "bg-green-500 text-black";
    if (score <= 85) return "bg-blue-500 text-white";
    if (score <= 92) return "bg-yellow-400 text-black";
    return "bg-gradient-to-r from-purple-500 to-orange-400 text-white";
  };

  // 🔥 LABEL UNDER SCORE
  const getScoreLabel = (score: number) => {
    if (score <= 74) return "Low credibility";
    if (score <= 85) return "Growing trust";
    if (score <= 92) return "High credibility";
    return "Elite verified";
  };

  return (
    <Link href={creator.id ? `/profile/${creator.id}` : "#"}>
      <div className="w-full max-w-2xl mx-auto cursor-pointer">

        {/* BORDER */}
        <div className="rounded-2xl p-[1px] bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400">

          <div className="bg-[#0b0b0f] rounded-2xl p-4 space-y-4">

            {/* TOP ROW */}
            <div className="flex gap-4 items-center">

              {/* IMAGE (FIXED SIZE) */}
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-900 shrink-0">
                {photo && !imageError ? (
                  <img
                    src={photo}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    👤
                  </div>
                )}
              </div>

              {/* NAME + BADGE */}
              <div className="flex-1">

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">

                    <h2 className="text-lg font-semibold truncate">
                      @{creator.displayName || "user"}
                    </h2>

                    {/* 🔥 BADGE */}
                    <div
                      className={`px-2 py-1 rounded-full text-[10px] font-semibold ${getBadgeStyle(score)}`}
                    >
                      ✔
                    </div>

                  </div>

                  <span className="text-xs text-gray-500">
                    #{creator.badgeNumber || "—"}
                  </span>
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  {isPaid
                    ? "Verified by Featrrr Valid"
                    : "Free profile"}
                </p>

              </div>
            </div>

            {/* SCORE BLOCK */}
            <div className="bg-[#111] rounded-xl p-4">

              <p className="text-xs text-gray-400">TRUST SCORE</p>

              <div className="flex items-end gap-2 mt-1">
                <span className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-orange-400 text-transparent bg-clip-text">
                  {score}
                </span>
                <span className="text-sm text-gray-500 mb-1">/100</span>
              </div>

              {/* 🔥 LABEL */}
              <p className="text-xs text-gray-400 mt-1">
                {getScoreLabel(score)}
              </p>

              {/* PROGRESS BAR */}
              <div className="w-full h-2 bg-gray-800 rounded-full mt-3 overflow-hidden">
                <div
                  className="h-2 bg-gradient-to-r from-purple-500 to-orange-400"
                  style={{ width: `${score}%` }}
                />
              </div>

            </div>

            {/* CORE DISCLOSURES */}
            <div>

              <p className="text-xs text-gray-400 mb-2">
                CORE DISCLOSURES
              </p>

              <div className="flex flex-wrap gap-2">

                {disclosures.length > 0 ? (
                  disclosures.map((d, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-1 rounded bg-gray-800 text-gray-300"
                    >
                      {d}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-500">
                    No disclosures yet
                  </span>
                )}

              </div>

            </div>

          </div>
        </div>
      </div>
    </Link>
  );
}
