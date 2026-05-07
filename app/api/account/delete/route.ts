import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    // 🔥 Delete user profile
    await adminDb.collection("valid_profiles").doc(userId).delete();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete account error:", err);

    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}
