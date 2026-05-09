import { adminDb } from "@/lib/firebase-admin";
import { calculateScore } from "@/utils/calculateScore";
import { calculateStatus } from "@/utils/calculateStatus";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const raw = (searchParams.get("q") || "").trim().toLowerCase();

    if (!raw) {
      return new Response(JSON.stringify([]), { status: 200 });
    }

    const snapshot = await adminDb.collection("valid_profiles").get();

    const results = snapshot.docs
      .map((doc) => {
        const data = doc.data();
        const score = calculateScore(data);

        return {
          id: doc.id,
          displayName: data.displayName || "",
          subscriptionStatus: data.subscriptionStatus || "inactive",
          badgeNumber: data.badgeNumber ?? "",
          socials: data.socials || {},
          score,
          status: calculateStatus(score, data),
        };
      })
      .filter((creator) => {
        const name = creator.displayName.toLowerCase();
        const badge = String(creator.badgeNumber || "");
        const ig = creator.socials?.instagram?.toLowerCase?.() || "";
        const tt = creator.socials?.tiktok?.toLowerCase?.() || "";
        const yt = creator.socials?.youtube?.toLowerCase?.() || "";

        return (
          name.includes(raw) ||
          badge.includes(raw) ||
          ig.includes(raw) ||
          tt.includes(raw) ||
          yt.includes(raw)
        );
      })
      .slice(0, 10);

    return new Response(JSON.stringify(results), { status: 200 });

  } catch (err) {
    console.error("SEARCH ERROR:", err);
    return new Response("Error searching", { status: 500 });
  }
}
