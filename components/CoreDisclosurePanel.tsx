"use client";

import { useState } from "react";

export type CoreDisclosure = {
  key: string;
  label: string;
  note?: string;
};

type DisclosureGroup = {
  title: string;
  helper: string;
  options: CoreDisclosure[];
};

export const disclosureGroups: DisclosureGroup[] = [
  {
    title: "Results & Proof",
    helper: "Clarify what proof and outcomes are real, simulated, or verified.",
    options: [
      { key: "allOwnedResults", label: "All owned results" },
      { key: "myRealClientTransformations", label: "My real client transformations" },
      { key: "myRealBusinessMetrics", label: "My real business metrics" },
      { key: "verifiedBeforeAfterResults", label: "Verified before/after results" },
      { key: "simulatedDemoResults", label: "Simulated/demo results" },
      { key: "hypotheticalEarningsClaims", label: "Hypothetical earnings claims" },
      { key: "notOwnedResults", label: "Not all owned results" },
    ],
  },
  {
    title: "Testimonials & Case Studies",
    helper: "Separate authentic proof from purchased or illustrative claims.",
    options: [
      { key: "authenticTestimonials", label: "Authentic testimonials" },
      { key: "purchasedTestimonials", label: "Purchased testimonials" },
      { key: "provenCaseStudies", label: "Proven case studies" },
      { key: "dueDiligence", label: "Due diligence on sponsored content" },
      { key: "sourcesCited", label: "Sources cited" },
    ],
  },
  {
    title: "Monetization & Sales",
    helper: "Explain whether content is connected to products, services, or monetization.",
    options: [
      { key: "monetized", label: "I'm monetized" },
      { key: "notMonetized", label: "I'm not monetized" },
      { key: "sellingProductService", label: "I'm selling a product/service" },
      { key: "notSellingProductService", label: "Not selling a product/service" },
    ],
  },
  {
    title: "Appearance & Editing",
    helper: "Disclose editing, physique, enhancement, or medical assistance context.",
    options: [
      { key: "allNaturalPhysique", label: "All natural physique" },
      { key: "usesFiltersEditingEnhancementsFrequently", label: "Uses filters/editing enhancements frequently" },
      { key: "medicalWeightLossGainAssistance", label: "Medical weight loss/gain assistance" },
      { key: "performanceDrugs", label: "Uses performance enhancement drugs" },
      { key: "cosmeticSurgery", label: "Cosmetic surgery" },
    ],
  },
  {
    title: "Audience & Growth",
    helper: "Give brands and followers more context about content and audience growth.",
    options: [
      { key: "realAudienceGrowth", label: "Real audience growth" },
      { key: "notOriginalContent", label: "Not original content" },
      { key: "notAccredited", label: "Not accredited" },
    ],
  },
];

export default function CoreDisclosurePanel({
  selected,
  onToggle,
  onRemove,
  onSave,
}: {
  selected: CoreDisclosure[];
  onToggle: (item: CoreDisclosure) => void;
  onRemove: (key: string) => void;
  onSave: () => void;
}) {
  const [openGroup, setOpenGroup] = useState(disclosureGroups[0]?.title || "");
  const selectedKeys = new Set(selected.map((item) => item.key));

  return (
    <section className="w-full rounded-2xl border border-white/10 bg-white/[0.045] p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
            Core Disclosures
          </p>
          <h2 className="mt-1 text-base font-semibold text-white">
            Transparency signals
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-zinc-500">
            These are context signals, not penalties. Select what helps people
            understand your content clearly.
          </p>
        </div>
        <button
          onClick={onSave}
          className="shrink-0 rounded-xl bg-purple-500 px-4 py-2 text-sm font-semibold text-white"
        >
          Save
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {selected.length > 0 ? (
          selected.map((item) => (
            <button
              key={item.key}
              onClick={() => onRemove(item.key)}
              className="rounded-full border border-purple-300/25 bg-purple-400/10 px-3 py-1.5 text-xs font-medium text-purple-100"
            >
              {item.label} x
            </button>
          ))
        ) : (
          <p className="text-xs text-zinc-500">
            No core disclosures selected yet.
          </p>
        )}
      </div>

      <div className="mt-5 space-y-2">
        {disclosureGroups.map((group) => {
          const isOpen = openGroup === group.title;

          return (
            <div
              key={group.title}
              className="overflow-hidden rounded-2xl border border-white/10 bg-black/20"
            >
              <button
                onClick={() => setOpenGroup(isOpen ? "" : group.title)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
              >
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-white">
                    {group.title}
                  </span>
                  <span className="block truncate text-xs text-zinc-500">
                    {group.helper}
                  </span>
                </span>
                <span className="text-zinc-500">{isOpen ? "-" : "+"}</span>
              </button>

              {isOpen && (
                <div className="flex flex-wrap gap-2 border-t border-white/10 px-4 py-3">
                  {group.options.map((item) => {
                    const active = selectedKeys.has(item.key);

                    return (
                      <button
                        key={item.key}
                        onClick={() => onToggle(item)}
                        className={`rounded-full border px-3 py-2 text-xs font-medium transition ${
                          active
                            ? "border-orange-300/40 bg-orange-400/15 text-orange-100"
                            : "border-white/10 bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08]"
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
