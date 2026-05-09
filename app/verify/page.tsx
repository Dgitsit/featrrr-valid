"use client";

import { useEffect, useState } from "react";

type Creator = {
  id: string;
  displayName: string;
  score: number;
  status: string;
  subscriptionStatus?: string;
  badgeNumber?: number | string;
};

export default function VerifyPage() {
  const [query, setQuery] = useState("");
  const [creator, setCreator] = useState<Creator | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ AUTO SEARCH FROM URL (?q=)
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

      setCreator(data?.[0] || null);
    } catch (err) {
      console.error(err);
      alert("Search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white flex flex-col items-center px-6 py-12">

      <h1 className="text-2xl font-bold mb-4 text-black">
        Verify Creator
      </h1>

      {/* SEARCH */}
      <div className="flex gap-2 w-full max-w-md mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          placeholder="Enter name or badge #"
          className="flex-1 border px-3 py-2 rounded text-black"
        />

        <button
          onClick={() => handleSearch()}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {/* LOADING */}
      {loading && <p className="text-gray-500">Searching...</p>}

      {/* RESULT */}
      {creator && (
        <div className="w-full max-w-md border rounded p-4 text-black">

          <h2 className="text-lg font-semibold">
            @{creator.displayName || "user"}
          </h2>

          <p className="text-sm text-gray-600">
            Badge: #{creator.badgeNumber || "—"}
          </p>

          <p className="text-sm mt-2">
            Score: {creator.score || 0}/100
          </p>

          <p className="text-sm mt-1">
            Status: {creator.status || "unknown"}
          </p>

          <p className="text-sm mt-1">
            Plan: {creator.subscriptionStatus || "free"}
          </p>

        </div>
      )}

      {/* EMPTY */}
      {!loading && creator === null && query && (
        <p className="text-gray-400">No creator found</p>
      )}

    </main>
  );
}
