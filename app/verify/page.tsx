"use client";

import { useState } from "react";

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

  const handleSearch = async () => {
    if (!query.trim()) {
      alert("Enter something to search");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
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

  return (
    <main className="min-h-screen bg-white px-6 py-12 flex flex-col items-center">

      {/* HEADER */}
      <h1 className="text-3xl font-bold text-black mb-6">
        Verify a Creator
      </h1>

      {/* SEARCH */}
      <div className="flex gap-2 mb-8 w-full max-w-md">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by @name, badge, or socials"
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />

        <button
          onClick={handleSearch}
          className="bg-black text-white px-4 py-2 rounded-lg text-sm"
        >
          Search
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-sm text-gray-500">Searching...</p>
      )}

      {/* NO RESULT */}
      {!loading && creator === null && query && (
        <p className="text-sm text-gray-400">
          No creator found. Try name, badge number, or socials.
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

            <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">
              #{creator.badgeNumber ?? "—"}
            </span>
          </div>

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

          {/* UNDER REVIEW */}
          {creator.status === "under_review" && (
            <p className="text-xs text-red-500 mb-2">
              This account is currently under review
            </p>
          )}

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
          <p className="text-sm text-gray-600 mb-1">
            Transparency Score: {creator.score}
          </p>

          {/* SCORE CAP */}
          <p className="text-xs text-gray-400 mb-4">
            {isPaid
              ? "Full transparency range unlocked"
              : "Score capped at 80 on free tier"}
          </p>

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
                {
                  label: "AI Usage",
                  value: creator.persistentDisclosures?.usesAIInContent ?? false,
                },
                {
                  label: "Team Involvement",
                  value: creator.persistentDisclosures?.teamInvolvement ?? false,
                },
                {
                  label: "Results Ownership",
                  value: creator.persistentDisclosures?.notAllResultsOwn ?? false,
                },
              ].map((item, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    {item.label}
                  </span>
                  <span
                    className={`text-xs font-medium ${
                      item.value ? "text-yellow-600" : "text-green-600"
                    }`}
                  >
                    {item.value ? "Disclosed" : "None reported"}
                  </span>
                </div>
              ))}

            </div>
          ) : (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border text-sm text-gray-600">
              This creator is on the free tier and is not audited by Featrrr.
            </div>
          )}

          {/* DISCLAIMER */}
          <p className="text-xs text-gray-400 mt-6">
            Featrrr transparency scores are generated based on user-provided disclosures, activity signals, and platform data. Featrrr does not guarantee full accuracy.
          </p>

        </div>
      )}
    </main>
  );
}
