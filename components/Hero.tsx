"use client";

import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="w-full px-6 md:px-12 py-12 md:py-20 flex flex-col md:flex-row items-center gap-12">

      {/* LEFT SIDE */}
      <div className="w-full md:w-1/2 text-left">

        <h1 className="text-3xl md:text-5xl font-bold leading-tight">
          Build trust. <br />
          <span className="bg-gradient-to-r from-purple-500 to-orange-400 bg-clip-text text-transparent">
            Grow faster.
          </span>
        </h1>

        <p className="mt-4 text-gray-400 text-sm md:text-base max-w-md">
          Audiences follow people they trust. Featrrr Valid helps you prove it — so brands can confidently sponsor you.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">

          <Link href="/login">
            <button className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-orange-400 text-white font-medium">
              Start Your Profile
            </button>
          </Link>

          <Link href="/verify">
            <button className="w-full sm:w-auto px-6 py-3 rounded-full border border-white/20 text-white">
              Search Creators
            </button>
          </Link>

        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full md:w-1/2 flex flex-col items-center">

        {/* CARD IMAGE */}
        <div className="w-full max-w-[380px] md:max-w-[480px]">
          <img
            src="/images/valid-card.png"
            alt="Featrrr Valid card"
            className="w-full rounded-xl shadow-2xl border border-white/10"
          />
        </div>

        {/* CHECKS */}
        <div className="mt-5 w-full max-w-[380px] md:max-w-[480px] flex flex-col gap-3">

          <div className="flex items-center gap-3 text-sm text-gray-300">
            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-[11px] text-black font-bold">
              ✓
            </div>
            Audience trust & engagement scale
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-300">
            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-[11px] text-black font-bold">
              ✓
            </div>
            Followers grow faster
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-300">
            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-[11px] text-black font-bold">
              ✓
            </div>
            Brands sponsor confidently
          </div>

        </div>

        {/* LOGO */}
        <div className="mt-6 opacity-80">
          <Image
            src="/images/logo.jpeg"
            alt="Featrrr logo"
            width={90}
            height={90}
          />
        </div>

      </div>
    </section>
  );
}
