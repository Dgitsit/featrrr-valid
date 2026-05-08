import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const { userId, photoURL } = await req.json();

    if (!userId || !photoURL) {
      return NextResponse.json(
        { error: "Missing data" },
        { status: 400 }
      );
    }

    const ref = adminDb.collection("valid_profiles").doc(userId);

    await ref.set(
      {
        photoURL,
        uid: userId, // ✅ important
        activity: {
          lastUpdated: new Date(), // ✅ used in scoring
        },
        updatedAt: new Date(),
      },
      { merge: true } // ✅ prevents overwriting
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
