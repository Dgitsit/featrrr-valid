"use client";

export default function ScoreBreakdown({ profile }: { profile: any }) {
  if (!profile) return null;

  const breakdown = [
    {
      label: "Base Score",
      points: 60,
      earned: true,
    },
    {
      label: "Onboarding Complete",
      points: 3,
      earned: profile.onboardingComplete,
    },
    {
      label: "Profile Photo",
      points: 2,
      earned: !!profile.photoURL,
    },
    {
      label: "Instagram Verified",
      points: 5,
      earned: profile?.socials?.instagram?.verified,
    },
  ];

  const total = breakdown.reduce(
    (acc, item) => acc + (item.earned ? item.points : 0),
    0
  );

  const nextStep = breakdown.find((b) => !b.earned);

  return (
    <div className="mt-6 w-full max-w-md bg-[#111] p-5 rounded-xl">

      <h2 className="text-lg font-semibold mb-4">
        Score Breakdown
      </h2>

      {/* LIST */}
      <div className="space-y-3">
        {breakdown.map((item, i) => (
          <div
            key={i}
            className="flex justify-between items-center text-sm"
          >
            <span className="text-gray-300">
              {item.label}
            </span>

            <span
              className={
                item.earned
                  ? "text-green-400"
                  : "text-gray-500"
              }
            >
              {item.earned ? `+${item.points}` : `+${item.points}`}
            </span>
          </div>
        ))}
      </div>

      {/* TOTAL */}
      <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between text-sm">
        <span className="text-gray-400">Total Earned</span>
        <span className="text-white font-semibold">{total}</span>
      </div>

      {/* NEXT STEP */}
      {nextStep && (
        <div className="mt-4 text-xs text-yellow-400">
          👉 Next: {nextStep.label} (+{nextStep.points})
        </div>
      )}
    </div>
  );
}