"use client";

import { useEffect, useState } from "react";
import Badge from "@/components/Badge";

export default function SearchPage() {
  const [filtered, setFiltered] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setFiltered([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setFiltered(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Search load error:", err);
        setFiltered([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">

      {/* 🔍 SEARCH INPUT */}
      <div className="max-w-xl mx-auto mb-8">
        <input
          placeholder="Search by name or badge #..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-900 border border-gray-800 text-white"
        />
      </div>

      {loading && (
        <div className="text-center text-gray-400 mt-20">Searching...</div>
      )}

      {!loading && !query.trim() && (
        <div className="text-center text-gray-400 mt-20">
          Search by name or badge number to find creators.
        </div>
      )}

      {!loading && query.trim() && filtered.length === 0 && (
        <div className="text-center text-gray-400 mt-20">
          No creators found. Try searching by name or badge number.
        </div>
      )}

      {/* 🔥 RESULTS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map((user) => {
          const username =
            user.displayName ||
            "user";

          const score = user.score ?? 0;

          return (
            <div
              key={user.id}
              className="bg-[#111] p-4 rounded-xl border border-gray-800"
            >
              {/* USERNAME */}
              <h3 className="text-lg font-semibold">@{username}</h3>

              {/* 🔥 BADGE NUMBER */}
              {user.badgeNumber && (
                <p
                  onClick={() =>
                    navigator.clipboard.writeText(
                      String(user.badgeNumber)
                    )
                  }
                  className="text-xs text-gray-500 mt-1 cursor-pointer hover:text-white"
                >
                  Badge #{user.badgeNumber} (tap to copy)
                </p>
              )}

              {/* 🔥 BADGES */}
              <div className="flex gap-2 mt-2">
                {user.subscriptionStatus === "active" && (
                  <Badge type="premium" />
                )}

                {user?.socials?.instagram?.verified && (
                  <Badge type="verified" />
                )}
              </div>

              {/* SCORE */}
              <div className="mt-3 text-sm text-gray-400">
                {score}/100
              </div>

              {/* PROGRESS */}
              <div className="w-full bg-gray-800 h-2 rounded mt-1">
                <div
                  className="h-2 rounded bg-gradient-to-r from-purple-500 to-orange-400"
                  style={{ width: `${score}%` }}
                />
              </div>

              {/* PROFILE LINK */}
              <a
                href={`/profile/${user.id}`}
                className="block mt-4 text-sm text-purple-400 hover:underline"
              >
                View Profile →
              </a>
            </div>
          );
        })}
      </div>

    </main>
  );
}
