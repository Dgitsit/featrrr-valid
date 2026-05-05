"use client";

import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="grid md:grid-cols-2 gap-10 items-center px-10 py-16">

      {/* LEFT */}
      <div>
        <h1 className="text-5xl font-bold leading-[1.1] tracking-tight">
          When creators choose{" "}
          <span className="text-purple-600">
            transparency & accountability
          </span>,
          <br /> they choose Featrrr Valid.
        </h1>

        <p className="mt-6 text-gray-600">
          We don’t tell people how to live their lives.  
          They come here to show it with integrity.
        </p>

        <p className="mt-4 text-gray-700">
          Featrrr Valid is the verification standard for creators.
        </p>

        <div className="mt-8 flex gap-4">

          {/* APPLY → GOES TO PRICING */}
          <Link href="/login">
            <div className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-orange-400 text-white hover:opacity-90 transition cursor-pointer">
              Start Your Valid Profile
            </div>
          </Link>

          {/* SEARCH */}
          <Link href="/verify">
            <div className="px-6 py-3 rounded-full border hover:bg-gray-50 transition cursor-pointer">
              Search Verified Creators
            </div>
          </Link>

        </div>
      </div>

      {/* RIGHT */}
      <div className="flex justify-center">
        <div className="w-80 h-80 rounded-full bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 flex items-center justify-center shadow-2xl">
          <div className="w-60 h-60 bg-white rounded-full flex items-center justify-center shadow-inner ring-4 ring-purple-100">
            <Image 
              src="/images/logo.jpeg"
              alt="Featrrr logo"
              width={140}
              height={140}
              className="object-contain"
            />
          </div>
        </div>
      </div>

    </section>
  );
}
