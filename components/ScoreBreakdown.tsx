"use client";

export default function ScoreBreakdown({ profile }: { profile: any }) {
  if (!profile) return null;

  const socials = profile.socials || {};
  const linkedSocialCount = ["instagram", "tiktok", "youtube"].filter(
    (platform) => !!socials[platform]
  ).length;
  const verifiedSocialCount = ["instagram", "tiktok", "youtube"].filter(
    (platform) => !!socials[platform]?.verified
  ).length;
  const coreDisclosureCount = Array.isArray(profile.contextDisclosures)
    ? profile.contextDisclosures.length
    : 0;
  const postDisclosureCount = Array.isArray(profile.postDisclosures)
    ? profile.postDisclosures.length
    : 0;
  const hasRecentActivity =
    !!profile.activity?.lastUpdated ||
    !!profile.contextUpdatedAt ||
    !!profile.lastPostDisclosure ||
    postDisclosureCount > 0;

  const breakdown = [
    {
      label: "Transparency Activity",
      value:
        postDisclosureCount > 0
          ? `${postDisclosureCount} post disclosure${postDisclosureCount === 1 ? "" : "s"}`
          : "No post disclosures yet",
      earned: postDisclosureCount > 0,
    },
    {
      label: "Profile Completion",
      value: profile.photoURL ? "Profile photo added" : "Photo missing",
      earned: !!profile.photoURL,
    },
    {
      label: "Verification Status",
      value:
        verifiedSocialCount > 0
          ? `${verifiedSocialCount} verified social${verifiedSocialCount === 1 ? "" : "s"}`
          : `${linkedSocialCount} linked social${linkedSocialCount === 1 ? "" : "s"}`,
      earned: verifiedSocialCount > 0 || linkedSocialCount > 0,
    },
    {
      label: "Disclosure Consistency",
      value:
        coreDisclosureCount > 0
          ? `${coreDisclosureCount} core disclosure${coreDisclosureCount === 1 ? "" : "s"}`
          : "No core disclosures yet",
      earned: coreDisclosureCount > 0,
    },
    {
      label: "Account Activity",
      value: hasRecentActivity ? "Recent signal available" : "No recent signal",
      earned: hasRecentActivity,
    },
  ];

  const nextStep = breakdown.find((b) => !b.earned);

  return (
    <section className="w-full rounded-2xl border border-white/10 bg-white/[0.045] p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-white">Trust Signals</h2>
        <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
          Live
        </span>
      </div>

      <div className="grid gap-3">
        {breakdown.map((item) => (
          <div key={item.label} className="flex min-w-0 items-center gap-3">
            <span
              className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                item.earned ? "bg-sky-300 shadow-lg shadow-sky-950/50" : "bg-zinc-700"
              }`}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-zinc-200">
                {item.label}
              </p>
              <p className="truncate text-xs text-zinc-500">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {nextStep && (
        <div className="mt-4 rounded-xl border border-amber-300/20 bg-amber-300/10 px-3 py-2 text-xs text-amber-100">
          Next trust signal: {nextStep.label}
        </div>
      )}
    </section>
  );
}