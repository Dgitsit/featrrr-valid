export function calculateScore(profile: any) {
  const isPaid = profile?.subscriptionStatus === "active";

  // ✅ BASE SCORE
  let score = isPaid ? 75 : 60;

  const defaultDisclosures = {
    cosmeticSurgery: false,
    performanceEnhancementDrugs: false,
    notAllResultsOwn: false,
    usesAIInContent: false,
    teamInvolvement: false,
  };

  const disclosures = {
    ...defaultDisclosures,
    ...(profile?.persistentDisclosures || {}),
  };

  const toMs = (d: any) => {
    const t = d ? new Date(d).getTime() : 0;
    return Number.isFinite(t) ? t : 0;
  };

  const now = Date.now();
  const lastUpdateMs = toMs(profile?.lastDisclosureUpdate);
  const lastPostMs = toMs(profile?.lastPostDisclosure);
  const flags = profile?.flags || 0;

  const requiredFields = Object.keys(defaultDisclosures);

  // ✅ ONLY PAID USERS GET DISCLOSURE BONUS
  if (isPaid) {
    const hasCompletedDisclosures = requiredFields.every(
      (field) => disclosures[field] !== undefined
    );

    if (hasCompletedDisclosures) score += 15;

    requiredFields.forEach((field) => {
      if (disclosures[field] === true) score += 1;
    });
  }

  // ✅ ACTIVITY BONUS
  if (lastUpdateMs) {
    const days = (now - lastUpdateMs) / (1000 * 60 * 60 * 24);

    if (days <= (isPaid ? 60 : 30)) {
      score += isPaid ? 3 : 2;
    }
  }

  // ✅ POST DISCLOSURE BONUS
  if (lastPostMs) {
    const days = (now - lastPostMs) / (1000 * 60 * 60 * 24);
    if (days <= 30) score += 2;
  }

  // 🔻 DECAY
  const decayStart = isPaid ? 60 : 30;

  if (lastUpdateMs) {
    const daysInactive = (now - lastUpdateMs) / (1000 * 60 * 60 * 24);

    if (daysInactive > decayStart) {
      const weeks = Math.floor((daysInactive - decayStart) / 7);
      score -= weeks * 2;
    }
  }

  // 🚨 FLAGS
  if (flags === 1) score -= 10;
  if (flags === 2) score -= 18;
  if (flags >= 3) score -= 25;

  // 🔒 CAPS
  if (!isPaid) {
    score = Math.min(score, 80);
  } else {
    if (!lastUpdateMs || (now - lastUpdateMs) > 60 * 86400000) {
      score = Math.min(score, 90);
    }
  }

  return Math.max(0, Math.min(score, 100));
}
