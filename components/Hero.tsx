"use client";

import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="w-full bg-black text-white">
      <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">

        {/* LEFT SIDE */}
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Build trust. Grow faster.
            <br />
            <span className="bg-gradient-to-r from-purple-500 to-orange-400 bg-clip-text text-transparent">
              Get Verified with Featrrr Valid
            </span>
          </h1>

          <p className="mt-6 text-gray-400 text-lg">
            Audiences follow creators they trust.  
            Brands evaluate your score and sponsor with confidence.
          </p>

          <div className="mt-8 flex gap-4 flex-wrap">
            <Link href="/login">
              <button className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-orange-400 text-white hover:opacity-90 transition">
                Start Your Valid Profile
              </button>
            </Link>

            <Link href="/verify">
              <button className="px-6 py-3 rounded-full border border-gray-600 hover:bg-gray-800 transition">
                Search Creators
              </button>
            </Link>
          </div>
        </div>

        {/* RIGHT SIDE (CARD + BENEFITS) */}
        <div className="flex flex-col items-center">

          {/* CREATOR CARD */}
          <div className="w-[320px] bg-[#111] rounded-xl p-4 shadow-2xl border border-gray-800">

            <div className="w-full h-[200px] rounded bg-gray-800 overflow-hidden mb-3">
              <Image
                src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e"
                alt="creator"
                width={320}
                height={200}
                className="object-cover w-full h-full"
              />
            </div>

            <h3 className="text-center font-semibold">@jesscreates</h3>

            {/* SCORE */}
            <div className="mt-3 text-center">
              <span className="text-sm text-gray-400">Trust Score</span>
              <div className="text-2xl font-bold text-white drop-shadow-[0_0_10px_rgba(168,85,247,0.6)]">
                93/100
              </div>
              <div className="text-xs text-green-400 mt-1">
                +12 this month
              </div>
            </div>

            {/* BAR */}
            <div className="w-full bg-gray-700 h-2 rounded mt-2">
              <div className="h-2 rounded bg-gradient-to-r from-purple-500 to-orange-400 w-[93%]" />
            </div>

            {/* BRAND PROOF */}
            <div className="mt-4 text-xs text-gray-400 text-center">
              Trusted by brands like Nike • Beats • Fashion Nova
            </div>
          </div>

          {/* BENEFITS */}
          <div className="mt-6 space-y-2 text-sm text-gray-300 text-center">
            <p>✅ Your audience trust and engagement scale</p>
            <p>✅ Followers grow</p>
            <p>✅ Brands sponsor confidently</p>
          </div>

        </div>
      </div>
    </section>
  );
}
