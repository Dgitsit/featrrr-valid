"use client";

type BadgeType = "verified" | "premium";

export default function Badge({ type }: { type: BadgeType }) {
  if (type === "verified") {
    return (
      <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs font-medium">
        ✔ Verified
      </span>
    );
  }

  if (type === "premium") {
    return (
      <span className="px-2 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r from-purple-500 to-orange-400">
        ★ Premium
      </span>
    );
  }

  return null;
} 
