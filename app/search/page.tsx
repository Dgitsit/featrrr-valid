"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import Badge from "@/components/Badge";

export default function SearchPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔥 LOAD USERS
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const snap = await getDocs(collection(db, "valid_profiles"));

        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUsers(data);
        setFiltered(data);
      } catch (err) {
        console.error("Search load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  // 🔍 FILTER
  useEffect(() => {
    const q = query.toLowerCase();

    const results = users.filter((user) => {
      const name = user.displayName?.toLowerCase() || "";
      const email = user.email?.toLowerCase() || "";

      return name.includes(q) || email.includes(q);
    });

    setFiltered(results);
  }, [query, users]);

  // 🔄 LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading creators...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">

      {/* 🔍 SEARCH INPUT */}
      <div className="max-w-xl mx-auto mb-8">
        <input
          placeholder="Search creators..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-900 border border-gray-800 text-white"
        />
      </div>

      {/* ❌ EMPTY STATE */}
      {filtered.length === 0 && (
        <div className="text-center text-gray-400 mt-20">
          This creator isn’t on Featrrr Valid. Creators who choose transparency stand out.
        </div>
      )}

      {/* 🔥 RESULTS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map((user) => {
          const username =
            user.displayName ||
            user.email?.split("@")[0] ||
            "user";

          const score = user.score ?? 0;

          return (
            <div
              key={user.id}
              className="bg-[#111] p-4 rounded-xl border border-gray-800"
            >
              {/* USERNAME */}
              <h3 className="text-lg font-semibold">@{username}</h3>

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
