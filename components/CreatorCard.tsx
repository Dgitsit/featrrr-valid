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

  return (
    <Link href={creator.id ? `/profile/${creator.id}` : "#"}>
      <div className="w-full max-w-3xl cursor-pointer">

        {/* OUTER GRADIENT */}
        <div className="rounded-2xl p-[1px] bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400">

          <div className="bg-[#0b0b0f] rounded-2xl p-4 md:p-6 flex flex-col md:flex-row gap-5">

            {/* LEFT IMAGE */}
            <div className="w-full md:w-48 h-48 rounded-xl overflow-hidden bg-gray-900">
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

            {/* RIGHT CONTENT */}
            <div className="flex-1 flex flex-col justify-between">

              {/* TOP */}
              <div>
                <div className="flex items-center justify-between">

                  <h2 className="text-xl md:text-2xl font-semibold">
                    @{creator.displayName || "user"}
                  </h2>

                  <div className="text-xs text-gray-400">
                    ID: {creator.badgeNumber || "—"}
                  </div>
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  Verified by Featrrr Valid
                </p>
              </div>

              {/* SCORE BLOCK */}
              <div className="mt-4 bg-[#111] rounded-xl p-4">

                <p className="text-xs text-gray-400">TRUST SCORE</p>

                <div className="flex items-end justify-between mt-2">

                  <div className="flex items-end gap-2">
                    <span className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-orange-400 text-transparent bg-clip-text">
                      {score}
                    </span>
                    <span className="text-sm text-gray-500 mb-1">/100</span>
                  </div>

                  <div className="text-green-400 text-sm">
                    {score >= 80 ? "High" : score >= 65 ? "Medium" : "Low"}
                  </div>
                </div>

                {/* PROGRESS BAR */}
                <div className="w-full h-2 bg-gray-800 rounded-full mt-4 overflow-hidden">
                  <div
                    className="h-2 bg-gradient-to-r from-purple-500 to-orange-400"
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>

              {/* METRICS ROW */}
              <div className="grid grid-cols-4 gap-3 mt-4 text-center">

                {[
                  { label: "Authenticity", value: 96 },
                  { label: "Engagement", value: 89 },
                  { label: "Consistency", value: 91 },
                  { label: "Audience", value: 94 },
                ].map((m, i) => (
                  <div key={i}>
                    <p className="text-[10px] text-gray-500 uppercase">
                      {m.label}
                    </p>
                    <p className="text-sm font-semibold text-white">
                      {m.value}%
                    </p>
                    <p className="text-green-400 text-[10px]">High</p>
                  </div>
                ))}

              </div>

            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}