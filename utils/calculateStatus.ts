export function calculateStatus(score: number, profile?: any) {
  const flags = profile?.flags || 0;

  // 🚨 Highest priority: integrity issues
  if (flags >= 2) return "under_review";

  // 🟢 Active (good standing)
  if (score >= 75) return "active";

  // 🟡 Moderate
  if (score >= 60) return "watch";

  // ⚫ Low trust
  return "inactive";
}
