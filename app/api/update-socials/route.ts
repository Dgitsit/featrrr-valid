import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const { userId, socials } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    await adminDb.collection("valid_profiles").doc(userId).set(
      {
        socials,
        updatedAt: new Date(),
      },
      { merge: true }
    );

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("❌ Social update error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
