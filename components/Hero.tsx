"use client";

import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="grid md:grid-cols-2 gap-12 items-center px-10 py-16">

      {/* LEFT */}
      <div>
        <h1 className="text-5xl font-bold leading-[1.1] tracking-tight">
          When creators choose{" "}
          <span className="text-purple-500">
            transparency & accountability
          </span>,
          <br /> they choose Featrrr Valid.
        </h1>

        <p className="mt-6 text-gray-400">
          We don’t tell people how to live their lives.  
          They come here to show it with integrity.
        </p>

        <p className="mt-4 text-gray-500">
          Featrrr Valid is the verification standard for creators.
        </p>

        <div className="mt-8 flex gap-4">

          <Link href="/login">
            <div className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-orange-400 text-white hover:opacity-90 transition cursor-pointer">
              Start Your Valid Profile
            </div>
          </Link>

          <Link href="/verify">
            <div className="px-6 py-3 rounded-full border border-white/20 hover:bg-white/5 transition cursor-pointer">
              Search Verified Creators
            </div>
          </Link>

        </div>
      </div>

      {/* RIGHT */}
      <div className="flex flex-col items-start md:items-end w-full">

        {/* LOGO (kept from old design but cleaner) */}
        <div className="mb-6">
          <Image 
            src="/images/logo.jpeg"
            alt="Featrrr logo"
            width={120}
            height={120}
            className="object-contain opacity-90"
          />
        </div>

        {/* VALID CARD IMAGE */}
        <div className="w-full max-w-[520px]">
          <img
            src="/images/valid-card.png"
            alt="Featrrr Valid card"
            className="rounded-xl shadow-2xl border border-white/10"
          />
        </div>

        {/* SMALL GREEN CHECKS */}
        <div className="mt-4 flex flex-col gap-2 text-sm text-gray-300">

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-[10px] text-black font-bold">
              ✓
            </div>
            <span>Audience trust & engagement scales</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-[10px] text-black font-bold">
              ✓
            </div>
            <span>Followers grow</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-[10px] text-black font-bold">
              ✓
            </div>
            <span>Brands sponsor confidently</span>
          </div>

        </div>

      </div>

    </section>
  );
}
