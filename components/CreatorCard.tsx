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

  // ✅ HARD FIX SCORE (prevents NaN / undefined bugs)
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

  return (
    <Link href={safeId ? `/profile/${safeId}` : "#"}>
      <div className="w-full max-w-xs cursor-pointer transition duration-300 hover:scale-[1.02]">

        {/* GRADIENT BORDER */}
        <div className="rounded-2xl p-[1px] bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400">

          {/* CARD */}
          <div className="bg-[#0b0b0f] rounded-2xl overflow-hidden shadow-xl">

            {/* IMAGE */}
            <div className="relative h-56 w-full bg-gray-900 overflow-hidden">

              {photo && !imageError ? (
                <img
                  src={photo}
                  alt="profile"
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-500">
                  <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-2xl">
                    👤
                  </div>
                </div>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

              {/* Top Row */}
              <div className="absolute top-3 left-3 right-3 flex justify-between items-center">

                <div className="px-2 py-1 text-[10px] rounded bg-black/70 text-gray-300">
                  #{badge}
                </div>

                <div>
                  {isPaid ? (
                    <div className="px-3 py-1 text-[10px] rounded-full bg-gradient-to-r from-purple-500 to-orange-400 text-white font-semibold">
                      VALID
                    </div>
                  ) : (
                    <div className="px-3 py-1 text-[10px] rounded-full bg-gray-800 text-gray-300">
                      FREE
                    </div>
                  )}
                </div>
              </div>

              {/* Name */}
              <div className="absolute bottom-3 left-4 right-4">
                <h2 className="text-lg font-semibold truncate text-white">
                  @{name}
                </h2>
              </div>

            </div>

            {/* SCORE SECTION */}
            <div className="px-5 pt-5 pb-4">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-[10px] text-gray-400 tracking-wide">
                    SOCIAL CREDIBILITY SCORE
                  </p>

                  <div className="flex items-end gap-2 mt-1">
                    <span className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-orange-400 text-transparent bg-clip-text">
                      {score}
                    </span>
                    <span className="text-xs text-gray-500 mb-1">/100</span>
                  </div>
                </div>

                {/* STATUS */}
                <div>
                  <p
                    className={`text-xs ${
                      creator.status === "active"
                        ? "text-green-400"
                        : creator.status === "under_review"
                        ? "text-red-400"
                        : creator.status === "watch"
                        ? "text-yellow-400"
                        : "text-gray-500"
                    }`}
                  >
                    {creator.status === "active"
                      ? "Active"
                      : creator.status === "under_review"
                      ? "Under Review"
                      : creator.status === "watch"
                      ? "Watch"
                      : "Unknown"}
                  </p>
                </div>

              </div>

              {/* PROGRESS BAR */}
              <div className="w-full h-2 bg-gray-800 rounded-full mt-4 overflow-hidden">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-orange-400 transition-all"
                  style={{
                    width: `${score}%`,
                  }}
                />
              </div>

              {/* TRUST MESSAGE */}
              <p className="text-[11px] text-gray-500 mt-4">
                {isPaid
                  ? "Transparency verified & actively maintained"
                  : "Limited transparency — upgrade for full visibility"}
              </p>

            </div>

          </div>
        </div>
      </div>
    </Link>
  );
} 
