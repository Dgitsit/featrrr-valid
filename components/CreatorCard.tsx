"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Badge, { getBadgeTier } from "@/components/Badge";
import TransparencyScore from "@/components/TransparencyScore";

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

  const tier = getBadgeTier(score);
  const credentialLabel = isPaid ? "Verified Creator" : "Creator Credential";
  const scoreTone = {
    green: "text-emerald-300",
    blue: "text-sky-300",
    gold: "text-amber-200",
    gradient:
      "bg-gradient-to-r from-purple-300 via-fuchsia-300 to-orange-300 bg-clip-text text-transparent",
  }[tier];

  return (
    <Link href={safeId ? `/profile/${safeId}` : "#"} className="block w-full min-w-0">
      <article className="group mx-auto w-full max-w-md min-w-0 cursor-pointer rounded-[1.6rem] bg-gradient-to-br from-purple-500/80 via-fuchsia-500/40 to-orange-400/80 p-[1px] shadow-2xl shadow-purple-950/30 transition duration-300 md:hover:-translate-y-1 md:hover:shadow-orange-950/30">
        <div className="relative overflow-hidden rounded-[1.55rem] border border-white/10 bg-[#07070d]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.22),transparent_18rem),radial-gradient(circle_at_bottom_right,rgba(251,146,60,0.16),transparent_16rem)]" />

          <div className="relative grid min-w-0 gap-4 p-4 sm:grid-cols-[9.5rem_minmax(0,1fr)]">
            <div className="relative h-52 min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 sm:h-full">
              {photo && !imageError ? (
                <img
                  src={photo}
                  alt={`${name} profile`}
                  className="h-full w-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-900 to-black text-5xl font-black text-zinc-700">
                  FV
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute bottom-3 left-3 rounded-full border border-white/10 bg-black/55 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-200 backdrop-blur">
                {isPaid ? "Valid" : "Creator"}
              </div>
            </div>

            <div className="flex min-w-0 flex-col gap-4">
              <div className="min-w-0">
                <div className="flex min-w-0 items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
                      {credentialLabel}
                    </p>
                    <div className="mt-2 flex min-w-0 items-center gap-2">
                      <h2 className="min-w-0 truncate text-3xl font-black tracking-tight text-white">
                        @{name}
                      </h2>
                      <Badge score={score} label="Creator score shield" />
                    </div>
                    <p className="mt-1 truncate text-sm text-zinc-400">
                      {isPaid ? "Transparency verified creator" : "Creator trust profile"}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                      Badge ID
                    </p>
                    <p className="mt-1 text-xs font-semibold text-purple-200">
                      FV-{badge}
                    </p>
                  </div>
                </div>
              </div>

              <TransparencyScore score={score} compact />
            </div>
          </div>

          <div className="relative grid grid-cols-3 border-t border-white/10 bg-white/[0.025]">
            <div className="min-w-0 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                Shield
              </p>
              <p className={`mt-1 text-sm font-bold ${scoreTone}`}>
                {tier === "gradient" ? "Premium" : tier}
              </p>
            </div>
            <div className="min-w-0 border-x border-white/10 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                Status
              </p>
              <p className="mt-1 truncate text-sm font-bold text-white">
                {isPaid ? "Verified" : "Active"}
              </p>
            </div>
            <div className="min-w-0 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                Score
              </p>
              <p className="mt-1 text-sm font-bold text-white">{score}/100</p>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
