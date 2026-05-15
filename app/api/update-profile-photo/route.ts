import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { verifyRequestAuth } from "@/lib/verifyAuth";

export async function POST(req: Request) {
  try {
    const auth = await verifyRequestAuth(req);

    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { photoURL } = await req.json();

    if (!photoURL) {
      return NextResponse.json(
        { error: "Missing data" },
        { status: 400 }
      );
    }

    const ref = adminDb.collection("valid_profiles").doc(auth.uid);

    await ref.set(
      {
        photoURL,
        uid: auth.uid,
        activity: {
          lastUpdated: new Date(),
        },
        updatedAt: new Date(),
      },
      { merge: true }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Photo update error:", err);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
