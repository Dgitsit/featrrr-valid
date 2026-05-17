"use client";

import clsx from "clsx";

type BadgeType = "verified" | "premium";
type BadgeTier = "green" | "blue" | "gold" | "gradient";
type BadgeSize = "sm" | "md";

export function getBadgeTier(score = 0): BadgeTier {
  if (score <= 74) return "green";
  if (score <= 85) return "blue";
  if (score <= 92) return "gold";
  return "gradient";
}

function getTierClasses(tier: BadgeTier) {
  const tiers = {
    green: "border-emerald-400/35 bg-emerald-400/12 text-emerald-300 shadow-emerald-950/30",
    blue: "border-sky-400/35 bg-sky-400/12 text-sky-300 shadow-sky-950/30",
    gold: "border-amber-300/40 bg-amber-300/12 text-amber-200 shadow-amber-950/30",
    gradient:
      "border-orange-300/40 bg-gradient-to-br from-purple-500 via-fuchsia-500 to-orange-400 text-white shadow-purple-950/40",
  };

  return tiers[tier];
}

export default function Badge({
  type,
  score,
  size = "sm",
  label,
  className,
}: {
  type?: BadgeType;
  score?: number;
  size?: BadgeSize;
  label?: string;
  className?: string;
}) {
  if (type === "verified" && score === undefined) {
    return (
      <span
        className={clsx(
          "inline-flex items-center gap-1 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2 py-1 text-xs font-semibold text-emerald-300",
          className
        )}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
        Verified
      </span>
    );
  }

  if (type === "premium" && score === undefined) {
    return (
      <span
        className={clsx(
          "inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-purple-500 to-orange-400 px-2 py-1 text-xs font-semibold text-white shadow-lg shadow-purple-950/30",
          className
        )}
      >
        Premium
      </span>
    );
  }

  const tier = getBadgeTier(score || 0);
  const sizeClasses =
    size === "md" ? "h-10 w-10 text-[11px]" : "h-8 w-8 text-[9px]";

  return (
    <span
      title={label || "Featrrr Valid shield"}
      className={clsx(
        "inline-flex shrink-0 items-center justify-center rounded-xl border font-black tracking-tight shadow-lg",
        sizeClasses,
        getTierClasses(tier),
        className
      )}
    >
      FV
    </span>
  );
}
