export function calculateScore(profile: any) {
  const isPaid = profile?.subscriptionStatus === "active";

  // ✅ BASELINE
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
    toMs(profile?.contextUpdatedAt) ||
    toMs(profile?.lastPostDisclosure);

  // =========================
  // 📸 PROFILE PHOTO (+3)
  // =========================
  if (profile?.photoURL) {
    score += 3;
  }

  // =========================
  // 🔗 SOCIALS (+3 each)
  // =========================
  const socials = profile?.socials || {};

  if (socials.instagram) score += 3;
  if (socials.tiktok) score += 3;
  if (socials.youtube) score += 3;

  // =========================
  // 🧾 CORE DISCLOSURES (+2 each, capped)
  // ✅ FIXED FOR NEW STRUCTURE
  // =========================
  const context = profile?.contextDisclosures || [];

  if (Array.isArray(context)) {
    score += Math.min(context.length * 2, 20); // max +20
  }

  // =========================
  // 🧾 POST DISCLOSURES (+1 each, max 10)
  // =========================
  const posts = profile?.postDisclosures || [];

  if (Array.isArray(posts)) {
    score += Math.min(posts.length, 10);
  }

  // =========================
  // 🔗 PROFILE SHARES (+1 each, max 3)
  // =========================
  score += Math.min(Number(profile?.shareBoostPoints) || 0, 3);

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
  score = Math.max(score, isPaid ? 65 : 60);

  return Math.round(score);
}