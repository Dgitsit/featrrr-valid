import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const { userId, photoURL } = await req.json();

    if (!userId || !photoURL) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    await adminDb.collection("valid_profiles").doc(userId).update({
      photoURL,
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Photo update error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
