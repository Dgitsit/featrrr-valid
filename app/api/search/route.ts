import { adminDb } from "@/lib/firebase-admin";
import { calculateScore } from "@/utils/calculateScore";
import { calculateStatus } from "@/utils/calculateStatus";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get("q") || "").toLowerCase();

    const snapshot = await adminDb.collection("valid_profiles").get();

    const results = snapshot.docs
      .map((doc) => {
        const data = doc.data();

        const score = calculateScore(data);

        return {
          id: doc.id,
          displayName: data.displayName || "",
          
          // 🔥 ADD THIS
          subscriptionStatus: data.subscriptionStatus || "inactive",

          // 🔥 FIX THIS
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
      });

    return new Response(JSON.stringify(results), { status: 200 });

  } catch (err) {
    console.error(err);
    return new Response("Error searching", { status: 500 });
  }
}
