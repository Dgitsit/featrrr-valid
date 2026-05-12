import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main className="bg-black text-white">

      {/* 🔥 NAVBAR (NEW - MOBILE FIXED) */}
      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur border-b border-gray-800">
        <div className="flex items-center justify-between px-4 md:px-10 py-3">

          {/* LOGO */}
          <div className="text-sm md:text-base font-semibold tracking-wide">
            Featrrr Valid
          </div>

          {/* LINKS */}
          <div className="flex items-center gap-4 md:gap-6 text-xs md:text-sm text-gray-300">
            <a href="#for-creators" className="hover:text-white whitespace-nowrap">
              Creators
            </a>
            <a href="#for-brands" className="hover:text-white whitespace-nowrap">
              Brands
            </a>
            <a href="/verify" className="hover:text-white whitespace-nowrap">
              Verify
            </a>
            <a href="/login">
              <button className="px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500 to-orange-400 text-white text-xs md:text-sm">
                Login
              </button>
            </a>
          </div>

        </div>
      </nav>

      {/* 🔥 PROMINENT HEADLINE (NEW) */}
      <section className="px-6 md:px-12 pt-16 pb-6">
        <h1 className="text-3xl md:text-5xl font-bold leading-tight max-w-3xl">
          Your social credibility score{" "}
          <span className="bg-gradient-to-r from-purple-400 to-orange-400 text-transparent bg-clip-text">
            by Featrrr Valid
          </span>
        </h1>
      </section>

      {/* HERO */}
      <Hero />

      {/* 🔥 HOW IT WORKS */}
      <section className="px-6 md:px-12 py-20 max-w-6xl">
        <h2 className="text-2xl font-semibold mb-6">
          How it works
        </h2>

        <p className="text-gray-400 max-w-xl mb-10">
          Featrrr Valid turns transparency into a measurable trust score that audiences and brands can evaluate instantly.
        </p>

        <div className="grid md:grid-cols-3 gap-8">

          <div>
            <h3 className="font-semibold mb-2">1. Show transparency</h3>
            <p className="text-gray-400 text-sm">
              Creators choose accountability and disclose honestly.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">2. Build your score</h3>
            <p className="text-gray-400 text-sm">
              Activity and consistency turn into a visible trust score.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">3. Get chosen</h3>
            <p className="text-gray-400 text-sm">
              Brands and audiences use your score to decide who to trust.
            </p>
          </div>

        </div>
      </section>

      {/* 🔥 FOR CREATORS */}
      <section
        id="for-creators"
        className="px-6 md:px-12 py-20 border-t border-gray-800"
      >
        <h2 className="text-2xl font-semibold mb-4">
          For Creators
        </h2>

        <p className="text-gray-400 max-w-xl mb-6">
          Build trust, grow your audience, and turn credibility into real opportunities.
        </p>

        <ul className="space-y-3 text-gray-300 text-sm">
          <li>✔ Stand out instantly with a trust score</li>
          <li>✔ Grow faster with audience confidence</li>
          <li>✔ Get discovered by brands that value transparency</li>
        </ul>
      </section>

      {/* 🔥 FOR BRANDS */}
      <section
        id="for-brands"
        className="px-6 md:px-12 py-20 border-t border-gray-800"
      >
        <h2 className="text-2xl font-semibold mb-4">
          For Brands
        </h2>

        <p className="text-gray-400 max-w-xl mb-6">
          Discover creators you can trust and make smarter partnership decisions.
        </p>

        <ul className="space-y-3 text-gray-300 text-sm">
          <li>✔ Evaluate creators beyond followers</li>
          <li>✔ Reduce risk with transparency insights</li>
          <li>✔ Partner with confidence</li>
        </ul>
      </section>

      {/* 🔥 FINAL CTA */}
      <section className="px-6 md:px-12 py-24 border-t border-gray-800">
        <h2 className="text-2xl font-semibold mb-4">
          Start building trust today
        </h2>

        <p className="text-gray-400 mb-6 max-w-md">
          The creators who win long-term are the ones people believe.
        </p>

        <a href="/login">
          <button className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 to-orange-400">
            Create Your Valid Profile
          </button>
        </a>
      </section>

    </main>
  );
}
