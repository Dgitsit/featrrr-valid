"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    return () => unsub();
  }, []);

  return (
    <nav className="w-full border-b bg-white/90 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="font-bold text-lg flex items-center">
          <span className="bg-gradient-to-r from-purple-500 to-orange-400 bg-clip-text text-transparent">
            Featrrr
          </span>
          <span className="ml-1 text-black">Valid</span>
        </Link>

        {/* NAV LINKS */}
        <div className="hidden md:flex items-center gap-6 text-sm text-gray-700">
          <Link href="/search" className="hover:text-black transition">
            Search
          </Link>
          <Link href="/verify" className="hover:text-black transition">
            Verify
          </Link>
          <Link href ="how-it-works" className="text-sm text-gray-300 hover:text-white">
          How It Works
          </Link>
          <Link href="/for-creators" className="hover:text-black transition">
            Creators
          </Link>
          <Link href="/for-brands" className="hover:text-black transition">
            Brands
          </Link>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">

          {user ? (
            <Link
              href="/dashboard"
              className="text-sm px-4 py-1.5 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-gray-700 hover:text-black transition"
              >
                Log in
              </Link>

              <Link href="/onboarding">
                <button className="px-4 py-1.5 text-xs rounded-full text-white bg-gradient-to-r from-purple-500 to-orange-400 hover:opacity-90 transition">
                  Start Your Valid Profile
                </button>
              </Link>
            </>
          )}

        </div>

      </div>
    </nav>
  );
}
