import Link from "next/link";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">

      {/* 🔥 HERO */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-3xl font-bold mb-4">
          Featrrr Valid
        </h1>

        <p className="text-gray-400 text-lg">
          A transparency layer for creators.
        </p>

        <p className="text-gray-500 mt-3">
          Built to help creators build trust and help audiences know what’s real.
        </p>
      </div>

      {/* 🔥 SECTION: WHY */}
      <div className="max-w-3xl mx-auto mb-16">
        <h2 className="text-xl font-semibold mb-4">
          Why Featrrr Valid exists
        </h2>

        <p className="text-gray-400 mb-3">
          Social media is filled with content that looks real—but often isn’t fully transparent.
        </p>

        <p className="text-gray-400">
          Featrrr Valid gives creators a way to stand out by choosing honesty, accountability, and openness.
        </p>
      </div>

      {/* 🔥 SECTION: HOW IT WORKS */}
      <div className="max-w-3xl mx-auto mb-16">
        <h2 className="text-xl font-semibold mb-6">
          How it works
        </h2>

        <div className="space-y-6">

          <div>
            <h3 className="font-medium">1. Create your profile</h3>
            <p className="text-gray-400 text-sm">
              Every creator gets a profile where they can display their identity, content, and presence.
            </p>
          </div>

          <div>
            <h3 className="font-medium">2. Choose transparency</h3>
            <p className="text-gray-400 text-sm">
              Link your socials, share disclosures, and give context behind your content.
            </p>
          </div>

          <div>
            <h3 className="font-medium">3. Earn your score</h3>
            <p className="text-gray-400 text-sm">
              Your transparency score reflects how open and accountable you are with your audience.
            </p>
          </div>

          <div>
            <h3 className="font-medium">4. Build trust</h3>
            <p className="text-gray-400 text-sm">
              Higher transparency leads to stronger trust, better engagement, and more opportunities.
            </p>
          </div>

        </div>
      </div>

      {/* 🔥 SECTION: SCORE */}
      <div className="max-w-3xl mx-auto mb-16">
        <h2 className="text-xl font-semibold mb-4">
          Transparency Score
        </h2>

        <p className="text-gray-400 mb-3">
          Every creator starts with a base score and improves it through activity and openness.
        </p>

        <ul className="text-sm text-gray-400 space-y-2">
          <li>• Linking social accounts increases credibility</li>
          <li>• Consistent activity improves trust</li>
          <li>• Honest disclosures strengthen your profile</li>
        </ul>
      </div>

      {/* 🔥 SECTION: FREE VS VALID */}
      <div className="max-w-3xl mx-auto mb-16">
        <h2 className="text-xl font-semibold mb-4">
          Free vs Valid
        </h2>

        <div className="space-y-4 text-sm text-gray-400">

          <div>
            <strong className="text-white">Free</strong>
            <p>Basic profile with limited score potential.</p>
          </div>

          <div>
            <strong className="text-white">Valid (Paid)</strong>
            <p>
              Unlock full transparency scoring, higher visibility, and stronger trust positioning.
            </p>
          </div>

        </div>
      </div>

      {/* 🔥 SECTION: VALUE */}
      <div className="max-w-3xl mx-auto mb-16">
        <h2 className="text-xl font-semibold mb-4">
          Why it matters
        </h2>

        <p className="text-gray-400 mb-3">
          Audiences trust creators who are open about how their content is made.
        </p>

        <p className="text-gray-400">
          Featrrr Valid helps creators stand out in a crowded space by choosing transparency.
        </p>
      </div>

      {/* 🔥 CTA */}
      <div className="max-w-3xl mx-auto text-center mt-20">
        <Link
          href="/dashboard"
          className="inline-block px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-orange-400"
        >
          Get Started
        </Link>

        <p className="text-xs text-gray-500 mt-3">
          Join creators choosing accountability
        </p>
      </div>

    </div>
  );
}
