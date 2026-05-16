import { adminDb } from "@/lib/firebase-admin";
import { verifyRequestAuth } from "@/lib/verifyAuth";

const platforms = ["instagram", "tiktok", "youtube"] as const;

export async function POST(req: Request) {
  const auth = await verifyRequestAuth(req);

  if (!auth) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { username, code, platform } = await req.json();

  if (!username || !code || !platforms.includes(platform)) {
    return Response.json({ success: false, error: "Missing data" }, { status: 400 });
  }

  const ref = adminDb.collection("valid_profiles").doc(auth.uid);
  const snap = await ref.get();
  const existing = snap.data() || {};
  const socials = existing.socials || {};
  const wasVerified = existing?.socials?.[platform]?.verified === true;

  socials[platform] = {
    ...(socials[platform] || {}),
    username: String(username).trim(),
    verified: true,
    verificationCode: code,
  };

  const scoreAdded =
    platform === "instagram" && !wasVerified ? 5 : 0;

  await ref.set(
    {
      socials,
      updatedAt: new Date(),
      ...(scoreAdded > 0 && {
        score: (existing.score || 60) + scoreAdded,
      }),
    },
    { merge: true }
  );

  return Response.json({
    success: true,
    verified: true,
    scoreAdded,
  });
}
