import { adminDb } from "@/lib/firebase-admin";
import { calculateScore } from "@/utils/calculateScore";
import { calculateStatus } from "@/utils/calculateStatus";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const badge = searchParams.get("badge");
    const query = (searchParams.get("q") || "").toLowerCase();

    let results: any[] = [];

    // =========================
    // 🔥 1. BADGE SEARCH (PRIORITY)
    // =========================
    if (badge) {
      const badgeNumber = Number(badge);

      if (!isNaN(badgeNumber)) {
        const snapshot = await adminDb
          .collection("valid_profiles")
          .where("badgeNumber", "==", badgeNumber)
          .limit(1)
          .get();

        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          const data = doc.data();

          const score = calculateScore(data);

          return new Response(
            JSON.stringify([
              {
                id: doc.id,
                displayName: data.displayName || "",
                subscriptionStatus: data.subscriptionStatus || "inactive",
                badgeNumber: data.badgeNumber || null,
                socials: data.socials || {},
                score,
                status: calculateStatus(score, data),
              },
            ]),
            { status: 200 }
          );
        }

        // no badge match
        return new Response(JSON.stringify([]), { status: 200 });
      }
    }

    // =========================
    // 🔥 2. GENERAL SEARCH (fallback)
    // =========================
    const snapshot = await adminDb.collection("valid_profiles").get();

    results = snapshot.docs
      .map((doc) => {
        const data = doc.data();
        const score = calculateScore(data);

        return {
          id: doc.id,
          displayName: data.displayName || "",
          subscriptionStatus: data.subscriptionStatus || "inactive",
          badgeNumber: data.badgeNumber || null,
          socials: data.socials || {},
          score,
          status: calculateStatus(score, data),
        };
      })
      .filter((creator) => {
        if (!query) return true;

        return (
          creator.displayName.toLowerCase().includes(query) ||
          String(creator.badgeNumber || "").includes(query) ||
          creator.socials?.instagram?.toLowerCase()?.includes(query) ||
          creator.socials?.tiktok?.toLowerCase()?.includes(query) ||
          creator.socials?.youtube?.toLowerCase()?.includes(query)
        );
      })
      .slice(0, 10); // 🔥 limit results

    return new Response(JSON.stringify(results), { status: 200 });

  } catch (err) {
    console.error("SEARCH ERROR:", err);
    return new Response("Error searching", { status: 500 });
  }
}
