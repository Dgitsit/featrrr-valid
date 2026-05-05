export function applyScoreDecay(profile: any) {
  const now = Date.now();

  const lastActive = profile?.lastActiveAt
    ? new Date(profile.lastActiveAt).getTime()
    : now;

  const daysInactive = Math.floor(
    (now - lastActive) / (1000 * 60 * 60 * 24)
  );

  const decayStart = 60; // days
  const decayRate = 2; // per week

  let score = profile?.score ?? 75;

  let isDecaying = false;
  let daysUntilDecay = Math.max(0, decayStart - daysInactive);

  if (daysInactive > decayStart) {
    isDecaying = true;

    const weeksDecaying = Math.floor(
      (daysInactive - decayStart) / 7
    );

    score = Math.max(0, score - weeksDecaying * decayRate);
  }

  return {
    score,
    isDecaying,
    daysUntilDecay,
  };
}
