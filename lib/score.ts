// lib/score.ts

type Profile = {
  score?: number;
  lastActiveAt?: any; // Firestore timestamp or Date
};

export const applyScoreDecay = (profile: Profile) => {
  // 🟢 BASE SCORE
  const baseScore = profile?.score ?? 60;

  const lastActive = profile?.lastActiveAt;

  // If no activity tracked yet → no decay
  if (!lastActive) {
    return {
      score: baseScore,
      isDecaying: false,
      daysUntilDecay: 60,
    };
  }

  // 🔄 Convert Firestore timestamp → JS Date
  const lastDate =
    typeof lastActive.toDate === "function"
      ? lastActive.toDate()
      : new Date(lastActive);

  const now = new Date();

  const diffMs = now.getTime() - lastDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // 🔥 DECAY STARTS AFTER 60 DAYS
  const decayStart = 60;

  if (diffDays <= decayStart) {
    return {
      score: baseScore,
      isDecaying: false,
      daysUntilDecay: decayStart - diffDays,
    };
  }

  // 🔻 DECAY LOGIC
  const daysPast = diffDays - decayStart;
  const weeksInactive = Math.floor(daysPast / 7);

  const decayAmount = weeksInactive * 2;

  // 🔒 FLOOR AT 50
  const finalScore = Math.max(50, baseScore - decayAmount);

  return {
    score: finalScore,
    isDecaying: true,
    daysUntilDecay: 0,
  };
};
