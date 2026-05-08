export function calculateScore(profile: any) {
  const isPaid = profile?.subscriptionStatus === "active";

  // 🔥 BASE
  let score = isPaid ? 75 : 60;

  const now = Date.now();

  const toMs = (d: any) => {
    if (!d) return 0;
    if (typeof d?.toMillis === "function") return d.toMillis();
    const t = new Date(d).getTime();
    return Number.isFinite(t) ? t : 0;
  };

  const lastActivity =
    toMs(profile?.activity?.lastUpdated) ||
    toMs(profile?.lastDisclosureUpdate) ||
    toMs(profile?.lastPostDisclosure);

  // =========================
  // 📸 PROFILE PHOTO
  // =========================
  if (profile?.photoURL) {
    score += 3;
  }

  // =========================
  // 🔗 SOCIALS
  // =========================
  const socials = profile?.socials || {};

  if (socials.instagram) score += 3;
  if (socials.tiktok) score += 3;
  if (socials.youtube) score += 3;

  // =========================
  // 🧾 PERSISTENT DISCLOSURES
  // =========================
  const persistent = profile?.persistentDisclosures || {};

  const persistentCount = Object.values(persistent).filter(
    (v) => v === true
  ).length;

  score += Math.min(persistentCount * 2, 10);

  // =========================
  // 🧾 CONTEXT DISCLOSURES (NEW)
  // =========================
  const context = profile?.contextDisclosures || [];

  const activeContext = context.filter((d: any) => d.enabled === true);

  score += Math.min(activeContext.length * 2, 12);

  // =========================
  // 🧾 POST DISCLOSURES
  // =========================
  const posts = profile?.postDisclosures || [];

  score += Math.min(posts.length * 2, 10);

  // =========================
  // 🧠 ACTIVITY BONUS
  // =========================
  if (lastActivity) {
    const days = (now - lastActivity) / (1000 * 60 * 60 * 24);

    if (days <= (isPaid ? 60 : 30)) {
      score += isPaid ? 3 : 2;
    }
  }

  // =========================
  // 🔻 DECAY
  // =========================
  const decayStart = isPaid ? 60 : 30;

  if (lastActivity) {
    const daysInactive = (now - lastActivity) / (1000 * 60 * 60 * 24);

    if (daysInactive > decayStart) {
      const weeks = Math.floor((daysInactive - decayStart) / 7);
      score -= weeks * 2;
    }
  }

  // =========================
  // 🚨 FLAGS
  // =========================
  const flags = profile?.flags || 0;

  if (flags === 1) score -= 10;
  if (flags === 2) score -= 18;
  if (flags >= 3) score -= 25;

  // =========================
  // 🔒 CAPS
  // =========================
  if (!isPaid) {
    score = Math.min(score, 80);
  } else {
    score = Math.min(score, 100);
  }

  // =========================
  // 🛑 FLOOR
  // =========================
  score = Math.max(score, 50);

  return Math.round(score);
}
