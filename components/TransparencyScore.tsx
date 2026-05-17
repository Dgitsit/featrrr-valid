type Props = {
  score: number;
  compact?: boolean;
};

function getScoreClasses(score: number) {
  if (score <= 74) {
    return {
      text: "text-emerald-300",
      bar: "bg-emerald-400",
      glow: "shadow-emerald-950/30",
    };
  }
  if (score <= 85) {
    return {
      text: "text-sky-300",
      bar: "bg-sky-400",
      glow: "shadow-sky-950/30",
    };
  }
  if (score <= 92) {
    return {
      text: "text-amber-200",
      bar: "bg-amber-300",
      glow: "shadow-amber-950/30",
    };
  }
  return {
    text: "bg-gradient-to-r from-purple-300 via-fuchsia-300 to-orange-300 bg-clip-text text-transparent",
    bar: "bg-gradient-to-r from-purple-500 via-fuchsia-500 to-orange-400",
    glow: "shadow-purple-950/40",
  };
}

export default function TransparencyScore({ score, compact = false }: Props) {
  const safeScore = Math.max(0, Math.min(Number(score) || 0, 100));
  const style = getScoreClasses(safeScore);

  return (
    <section
      className={`rounded-2xl border border-white/10 bg-white/[0.045] ${
        compact ? "p-4" : "p-5"
      } shadow-xl ${style.glow}`}
    >
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
            SCS
          </p>
          <h2 className="mt-1 text-sm font-semibold text-white">
            Social Credibility Score
          </h2>
        </div>

        <div className="shrink-0 text-right">
          <span className={`text-5xl font-black leading-none ${style.text}`}>
            {safeScore}
          </span>
          <span className="ml-1 text-sm font-semibold text-zinc-500">/100</span>
        </div>
      </div>

      <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full ${style.bar} transition-all duration-700 ease-out`}
          style={{ width: `${safeScore}%` }}
        />
      </div>

      <p className="mt-3 text-xs leading-relaxed text-zinc-400">
        Built from transparency activity, profile completion, verification, and
        recent account signals.
      </p>
    </section>
  );
}
