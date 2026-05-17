"use client";

import { CoreDisclosure, disclosureGroups } from "@/components/CoreDisclosurePanel";

type ProgressItem = {
  label: string;
  complete: boolean;
  helper: string;
};

export default function TransparencyProgress({
  profile,
  contextDisclosures,
}: {
  profile: any;
  contextDisclosures: CoreDisclosure[];
}) {
  const selectedKeys = new Set(contextDisclosures.map((item) => item.key));
  const postCount = Array.isArray(profile?.postDisclosures)
    ? profile.postDisclosures.length
    : 0;
  const socials = profile?.socials || {};
  const linkedSocialCount = ["instagram", "tiktok", "youtube"].filter(
    (platform) => !!socials[platform]
  ).length;

  const items: ProgressItem[] = [
    {
      label: "Credential photo",
      complete: !!profile?.photoURL,
      helper: "Add a clear profile image.",
    },
    {
      label: "Creator bio",
      complete: !!profile?.bio?.trim(),
      helper: "Tell people what you create.",
    },
    {
      label: "Core disclosures",
      complete: contextDisclosures.length >= 3,
      helper: "Select at least 3 transparency signals.",
    },
    {
      label: "Transparency post",
      complete: postCount > 0,
      helper: "Add one proof or context post.",
    },
    {
      label: "Social context",
      complete: linkedSocialCount > 0,
      helper: "Connect or verify a social account.",
    },
  ];

  const completeCount = items.filter((item) => item.complete).length;
  const completion = Math.round((completeCount / items.length) * 100);
  const recommended = disclosureGroups
    .flatMap((group) => group.options.map((option) => ({ ...option, group: group.title })))
    .filter((option) => !selectedKeys.has(option.key))
    .slice(0, 3);

  const encouragement =
    completion >= 100
      ? "Excellent. Your profile has a strong trust foundation."
      : completion >= 60
      ? "Strong momentum. A few more signals can make your profile feel even more complete."
      : "Nice start. Every transparency signal makes your profile easier to trust.";

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
            Transparency Progress
          </p>
          <h2 className="mt-1 text-base font-semibold text-white">
            Profile trust completion
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-zinc-500">
            Build a profile that feels complete, credible, and easy to verify.
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-3xl font-black text-white">{completion}%</p>
          <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
            complete
          </p>
        </div>
      </div>

      <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-orange-400 transition-all duration-700"
          style={{ width: `${completion}%` }}
        />
      </div>

      <p className="mt-3 rounded-xl border border-emerald-300/15 bg-emerald-300/10 px-3 py-2 text-xs text-emerald-100">
        {encouragement}
      </p>

      <div className="mt-4 grid gap-2">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-3 py-2"
          >
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                item.complete
                  ? "bg-emerald-300 text-black"
                  : "bg-white/10 text-zinc-500"
              }`}
            >
              {item.complete ? "✓" : "•"}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-white">
                {item.label}
              </span>
              <span className="block truncate text-xs text-zinc-500">
                {item.complete ? "Complete" : item.helper}
              </span>
            </span>
          </div>
        ))}
      </div>

      {recommended.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Recommended disclosures
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {recommended.map((item) => (
              <span
                key={item.key}
                className="rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1.5 text-xs text-sky-100"
              >
                {item.label}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
