// app/page.tsx
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main className="bg-black text-white">

      <Hero />

      {/* HOW IT WORKS */}
      <section className="px-6 py-20 max-w-6xl">
        <h2 className="text-2xl font-semibold mb-10">
          How Featrrr Valid Works
        </h2>

        <div className="grid md:grid-cols-3 gap-10 text-left">
          <div>
            <h3 className="font-semibold mb-2">1. Show Transparency</h3>
            <p className="text-gray-400 text-sm">
              Creators choose to disclose and operate with accountability.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">2. Build Trust Score</h3>
            <p className="text-gray-400 text-sm">
              Your activity and consistency translate into a visible score.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">3. Get Chosen</h3>
            <p className="text-gray-400 text-sm">
              Brands and audiences use your score to decide who to trust.
            </p>
          </div>
        </div>
      </section>

      {/* VALUE SECTION */}
      <section className="px-6 py-20 max-w-6xl">
        <h2 className="text-2xl font-semibold mb-10">
          Why It Matters
        </h2>

        <div className="grid md:grid-cols-2 gap-12">

          <div>
            <h3 className="font-semibold mb-2">
              Stand out instantly
            </h3>
            <p className="text-gray-400 text-sm">
              Your profile communicates credibility before you even speak.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">
              Turn trust into growth
            </h3>
            <p className="text-gray-400 text-sm">
              Higher trust leads to more engagement and stronger followings.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">
              Close deals faster
            </h3>
            <p className="text-gray-400 text-sm">
              Brands skip uncertainty and move straight to working with you.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">
              Build long-term credibility
            </h3>
            <p className="text-gray-400 text-sm">
              Your score compounds over time as you stay consistent.
            </p>
          </div>

        </div>
      </section>

      {/* TRUST FLOW (your messaging refined) */}
      <section className="px-6 py-20 max-w-5xl">
        <h2 className="text-2xl font-semibold mb-6">
          The Real Growth Loop
        </h2>

        <p className="text-gray-400 text-lg max-w-xl">
          Audiences follow people they trust.  
          Brands discover you, evaluate your score, and sponsor with confidence.  
          Your credibility becomes your growth engine.
        </p>
      </section>

      {/* PRICING */}
      <section className="px-6 py-20 max-w-6xl">
        <h2 className="text-2xl font-semibold mb-10">
          Get Verified
        </h2>

        <div className="grid md:grid-cols-2 gap-8">

          {/* MONTHLY */}
          <div className="border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-2">
              Monthly
            </h3>

            <p className="text-3xl font-bold mb-4">
              $39.99
              <span className="text-sm text-gray-400"> / month</span>
            </p>

            <ul className="text-sm text-gray-400 space-y-2 mb-6">
              <li>✔ Featrrr Valid score</li>
              <li>✔ Verified badge</li>
              <li>✔ Transparency tracking</li>
            </ul>

            <a href="/login">
              <button className="w-full py-2 rounded bg-gradient-to-r from-purple-500 to-orange-400">
                Get Started
              </button>
            </a>
          </div>

          {/* YEARLY */}
          <div className="border border-purple-500 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-2">
              Yearly
            </h3>

            <p className="text-3xl font-bold mb-4">
              $285
              <span className="text-sm text-gray-400"> / year</span>
            </p>

            <p className="text-green-400 text-sm mb-4">
              Save over $180 annually
            </p>

            <ul className="text-sm text-gray-400 space-y-2 mb-6">
              <li>✔ Everything in monthly</li>
              <li>✔ Priority credibility boost</li>
              <li>✔ Best value</li>
            </ul>

            <a href="/login">
              <button className="w-full py-2 rounded bg-gradient-to-r from-purple-500 to-orange-400">
                Go Yearly
              </button>
            </a>
          </div>

        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-6 py-20 max-w-5xl">
        <h2 className="text-2xl font-semibold mb-4">
          Start building trust today
        </h2>

        <p className="text-gray-400 mb-6">
          The creators who win long term are the ones people believe.
        </p>

        <a href="/login">
          <button className="px-8 py-3 rounded bg-gradient-to-r from-purple-500 to-orange-400">
            Create Your Valid Profile
          </button>
        </a>
      </section>

    </main>
  );
}
