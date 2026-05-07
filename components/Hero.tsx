"use client";

import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="w-full flex justify-center px-6 py-20">

      {/* CONTAINER */}
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">

        {/* LEFT */}
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
            When creators choose{" "}
            <span className="text-purple-500">
              transparency & accountability
            </span>,
            <br /> they choose Featrrr Valid.
          </h1>

          <p className="mt-6 text-gray-500">
            We don’t tell people how to live their lives.  
            They come here to show it with integrity.
          </p>

          <p className="mt-3 text-gray-700">
            Featrrr Valid is the verification standard for creators.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link href="/login">
              <div className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-orange-400 text-white hover:opacity-90 transition cursor-pointer text-center">
                Start Your Valid Profile
              </div>
            </Link>

            <Link href="/verify">
              <div className="px-6 py-3 rounded-full border hover:bg-gray-100 transition cursor-pointer text-center">
                Search Verified Creators
              </div>
            </Link>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col items-center">

          {/* CARD */}
          <div className="w-[320px] bg-[#111] text-white rounded-xl p-4 shadow-2xl">

            {/* IMAGE */}
            <div className="w-full h-[200px] rounded-lg overflow-hidden mb-4">
              <Image
                src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e"
                alt="creator"
                width={320}
                height={200}
                className="object-cover w-full h-full"
              />
            </div>

            <h2 className="text-lg font-semibold text-center">
              @jordancreates
            </h2>

            <p className="text-xs text-gray-400 text-center mt-1">
              Badge #93842
            </p>

            <div className="mt-4 text-center">
              <div className="text-lg font-bold bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">
                93 / 100
              </div>

              <p className="text-xs text-green-400 mt-1">
                +12 this month
              </p>
            </div>

            <div className="w-full bg-gray-700 h-2 rounded mt-2">
              <div
                className="h-2 rounded bg-gradient-to-r from-purple-500 to-orange-400"
                style={{ width: "93%" }}
              />
            </div>

            <p className="text-center text-pink-400 text-sm mt-3">
              @jordancreates
            </p>

            {/* BRANDS */}
            <div className="mt-5 border-t border-gray-800 pt-3">
              <p className="text-xs text-gray-500 text-center mb-2">
                Brands worked with
              </p>

              <div className="flex justify-center gap-4 opacity-70 text-xs">
                <span>Nike</span>
                <span>Adidas</span>
                <span>Apple</span>
              </div>
            </div>
          </div>

          {/* BENEFITS */}
          <div className="mt-6 space-y-2 text-sm text-gray-600 text-center">
            <p>✅ Your audience trust and engagement scale</p>
            <p>✅ Followers grow</p>
            <p>✅ Brands sponsor confidently</p>
          </div>

        </div>

      </div>
    </section>
  );
}
