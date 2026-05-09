"use client";

import Link from "next/link";

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
  const score = creator.score ?? 0;
  const badge = creator.badgeNumber || "—";

  // ✅ FIX: safe image handling
  const photo =
    creator.profilePhoto && creator.profilePhoto !== ""
      ? creator.profilePhoto
      : null;

  return (
    <Link href={safeId ? `/profile/${safeId}` : "#"}>
      <div className="w-full max-w-xs cursor-pointer transition duration-300 hover:scale-[1.02]">

        <div className="rounded-2xl p-[1px] bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400">

          <div className="bg-[#0b0b0f] rounded-2xl overflow-hidden shadow-xl">

            {/* IMAGE */}
            <div className="relative h-52 w-full bg-gray-900 flex items-center justify-center">

              {photo ? (
                <img
                  src={photo}
                  alt="profile"
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    // ✅ FIX: fallback if Firebase fails
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : null}

              {/* ✅ ALWAYS SHOW FALLBACK IF NO IMAGE OR ERROR */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 pointer-events-none">
                <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-2xl">
                  👤
                </div>
                <p className="text-xs mt-2">No Photo</p>
              </div>

              {/* STATUS BADGE */}
              <div className="absolute top-3 right-3">
                {isPaid ? (
                  <div className="px-3 py-1 text-[10px] rounded-full bg-gradient-to-r from-purple-500 to-orange-400 text-white font-semibold shadow">
                    VALID
                  </div>
                ) : (
                  <div className="px-3 py-1 text-[10px] rounded-full bg-gray-800 text-gray-300 font-medium">
                    FREE
                  </div>
                )}
              </div>

              {/* BADGE NUMBER */}
              <div className="absolute top-3 left-3 px-2 py-1 text-[10px] rounded bg-black/70 text-gray-300">
                #{badge}
              </div>

            </div>

            {/* CONTENT */}
            <div className="p-5 text-white">

              <h2 className="text-lg font-semibold truncate">
                @{name}
              </h2>

              <p className="text-[10px] text-gray-500 mt-1">
                Badge #{badge}
              </p>

              <p
                className={`text-xs mt-1 ${
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

              {/* SCORE */}
              <div className="mt-5">

                <p className="text-[10px] text-gray-400 mb-1">
                  TRANSPARENCY SCORE
                </p>

                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-orange-400 text-transparent bg-clip-text">
                    {score}
                  </span>
                  <span className="text-xs text-gray-500 mb-1">/100</span>
                </div>

                <div className="w-full h-2 bg-gray-800 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-orange-400 transition-all"
                    style={{
                      width: `${Math.max(0, Math.min(score, 100))}%`,
                    }}
                  />
                </div>

              </div>

              <p className="text-[10px] text-gray-500 mt-3">
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
