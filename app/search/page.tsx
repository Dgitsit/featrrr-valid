"use client";

import { useEffect, useState } from "react";
import CreatorCard from "@/components/CreatorCard";

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
      <div className="grid min-w-0 grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((user) => {
          const score = user.score ?? 0;

          return (
            <div key={user.id} className="min-w-0 space-y-2">
              <CreatorCard
                creator={{
                  id: user.id,
                  displayName: user.displayName || "user",
                  score,
                  status: user.status,
                  subscriptionStatus: user.subscriptionStatus,
                  profilePhoto: user.profilePhoto || "",
                  badgeNumber: user.badgeNumber,
                }}
              />

              {user.badgeNumber && (
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(String(user.badgeNumber))
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-zinc-500 transition hover:text-white"
                >
                  Badge #{user.badgeNumber} (tap to copy)
                </button>
              )}
            </div>
          );
        })}
      </div>

    </main>
  );
}
