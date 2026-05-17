"use client";

import { useEffect, useState } from "react";
import CreatorCard from "@/components/CreatorCard";

type Creator = {
  id: string;
  displayName: string;
  score: number;
  status: string;
  subscriptionStatus?: string;
  badgeNumber?: number | string;
  profilePhoto?: string; // 🔥 IMPORTANT
};

export const dynamic = "force-dynamic";
export default function VerifyPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(false);

  // AUTO SEARCH FROM URL (?q=)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");

    if (q) {
      setQuery(q);
      handleSearch(q);
    }
  }, []);

  const handleSearch = async (customQuery?: string) => {
    const q = (customQuery || query).trim();

    if (!q) {
      alert("Enter name or badge number");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();

      setResults(data || []);
    } catch (err) {
      console.error(err);
      alert("Search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center px-6 py-12 overflow-x-hidden">

      <h1 className="text-2xl font-semibold mb-6">
        Verify Creator
      </h1>

      {/* SEARCH */}
      <div className="flex w-full max-w-md min-w-0 flex-col gap-3 mb-8 sm:flex-row sm:gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          placeholder="Enter name or badge #"
          className="w-full min-w-0 flex-1 bg-[#111] border border-gray-700 px-3 py-3 sm:py-2 rounded text-white"
        />

        <button
          onClick={() => handleSearch()}
          className="w-full shrink-0 bg-purple-500 px-4 py-3 sm:w-auto sm:py-2 rounded"
        >
          Search
        </button>
      </div>

      {/* LOADING */}
      {loading && <p className="text-gray-400">Searching...</p>}

      {/* RESULTS */}
      {!loading && results.length > 0 && (
        <div className="w-full max-w-5xl min-w-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

          {results.map((creator) => (
            <CreatorCard
              key={creator.id}
              creator={{
                id: creator.id,
                displayName: creator.displayName,
                score: creator.score,
                status: creator.status,
                subscriptionStatus: creator.subscriptionStatus,
                profilePhoto: creator.profilePhoto || "", // 🔥 REQUIRED
                badgeNumber: creator.badgeNumber,
              }}
            />
          ))}

        </div>
      )}

      {/* EMPTY */}
      {!loading && results.length === 0 && query && (
        <p className="text-gray-500 mt-6">
          No creator found
        </p>
      )}

    </main>
  );
}
