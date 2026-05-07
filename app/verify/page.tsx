"use client";

import { useEffect, useState } from "react";

type Creator = {
  id: string;
  displayName: string;
  score: number;
  status: string;
  subscriptionStatus?: string;
  badgeNumber?: number;
  persistentDisclosures?: any;
};

export default function VerifyPage() {
  const [query, setQuery] = useState("");
  const [creator, setCreator] = useState<Creator | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // 🔥 AUTO LOAD IF URL HAS ?q=
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

  const isPaid = creator?.subscriptionStatus === "active";

  // 🔥 COPY BADGE
  const handleCopy = () => {
    if (!creator?.badgeNumber) return;

    navigator.clipboard.writeText(String(creator.badgeNumber));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 🔥 SHARE LINK
  const handleShare = async () => {
    if (!creator?.badgeNumber) return;

    const url = `${window.location.origin}/verify/${creator.badgeNumber}`;

    try {
      await navigator.share({
        title: "Verify Creator on Featrrr Valid",
        url,
      });
    } catch {
      navigator.clipboard.writeText(url);
      alert("Link copied");
    }
  };

  return (
    <main className="min-h-screen bg-white px-6 py-12 flex flex-col items-center">

      {/* HEADER */}
      <h1 className="text-3xl font-bold text-black mb-2">
        Verify a Creator
      </h1>

      <p className="text-gray-500 text-sm mb-6 text-center max-w-sm">
        Search by name or badge number to verify transparency and trust
      </p>

      {/* SEARCH */}
      <div className="flex gap-2 mb-8 w-full max-w-md">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by @name or badge #"
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />

        <button
          onClick={() => handleSearch()}
          className="bg-black text-white px-4 py-2 rounded-lg text-sm"
        >
          Search
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-sm text-gray-500">Searching...</p>
      )}

      {/* EMPTY */}
      {!loading && creator === null && query && (
        <p className="text-sm text-gray-400">
          No creator found
        </p>
      )}

      {/* RESULT */}
      {creator && (
        <div className="w-full max-w-md rounded-2xl border border-gray-200 p-6 shadow-sm">

          {/* NAME + BADGE */}
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-black">
                @{creator.displayName}
              </h2>

              {isPaid ? (
                <span className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-purple-500 to-orange-400 text-white">
                  VALID
                </span>
              ) : (
                <span className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-600">
                  FREE
                </span>
              )}
            </div>

            {/* 🔥 BADGE CLICKABLE */}
            <span
              onClick={handleCopy}
              className="text-xs bg-gray-100 px-3 py-1 rounded-full cursor-pointer hover:bg-gray-200"
            >
              #{creator.badgeNumber}
            </span>
          </div>

          {/* COPY FEEDBACK */}
          {copied && (
            <p className="text-xs text-green-600 mb-2">
              Badge copied
            </p>
          )}

          {/* STATUS */}
          <p
            className={`text-sm font-medium mb-2 ${
              creator.status === "active"
                ? "text-green-600"
                : creator.status === "under_review"
                ? "text-red-600"
                : creator.status === "watch"
                ? "text-yellow-500"
                : "text-gray-400"
            }`}
          >
            {creator.status}
          </p>

          {/* SCORE BAR */}
          <div className="h-2 bg-gray-200 rounded-full mb-2">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-orange-400"
              style={{
                width: `${Math.max(0, Math.min(creator.score, 100))}%`,
              }}
            />
          </div>

          {/* SCORE */}
          <p className="text-sm text-gray-600 mb-3">
            Transparency Score: {creator.score}
          </p>

          {/* 🔥 SHARE BUTTON */}
          <button
            onClick={handleShare}
            className="w-full mt-2 py-2 rounded-lg bg-black text-white text-sm"
          >
            Share Verification Link
          </button>

          {/* DISCLOSURES */}
          {isPaid ? (
            <div className="space-y-2 mt-4">
              <p className="text-sm font-semibold text-black mb-2">
                Transparency Disclosures
              </p>

              {[
                {
                  label: "Cosmetic Procedures",
                  value: creator.persistentDisclosures?.cosmeticSurgery ?? false,
                },
                {
                  label: "Performance Enhancers",
                  value: creator.persistentDisclosures?.performanceEnhancementDrugs ?? false,
                },
              ].map((item, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    {item.label}
                  </span>
                  <span
                    className={`text-xs ${
                      item.value ? "text-yellow-600" : "text-green-600"
                    }`}
                  >
                    {item.value ? "Disclosed" : "None"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border text-sm text-gray-600">
              This creator is not currently verified by Featrrr Valid.
            </div>
          )}

        </div>
      )}
    </main>
  );
}
