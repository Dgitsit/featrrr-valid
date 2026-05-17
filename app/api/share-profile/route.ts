import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import { verifyRequestAuth } from "@/lib/verifyAuth";

const MAX_SHARE_BOOST = 3;

export async function POST(req: Request) {
  const auth = await verifyRequestAuth(req);

  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const ref = adminDb.collection("valid_profiles").doc(auth.uid);

    const result = await adminDb.runTransaction(async (tx) => {
      const snap = await tx.get(ref);

      if (!snap.exists) {
        throw new Error("Profile not found");
      }

      const data = snap.data() || {};
      const currentCount = Math.max(
        Number(data.shareBoostCount) || 0,
        Number(data.shareBoostPoints) || 0
      );
      const shareBoostCount = Math.min(currentCount + 1, MAX_SHARE_BOOST);
      const shareBoostPoints = Math.min(shareBoostCount, MAX_SHARE_BOOST);
      const maxed = currentCount >= MAX_SHARE_BOOST;

      tx.set(
        ref,
        {
          shareBoostCount,
          shareBoostPoints,
          lastSharedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

      return {
        shareBoostCount,
        shareBoostPoints,
        maxed,
        lastSharedAt: new Date().toISOString(),
      };
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("Share profile error:", err);
    return NextResponse.json({ error: "Unable to record share" }, { status: 500 });
  }
}
