import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { verifyRequestAuth } from "@/lib/verifyAuth";

export async function POST(req: Request) {
  try {
    const auth = await verifyRequestAuth(req);

    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await adminDb.collection("valid_profiles").doc(auth.uid).delete();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete account error:", err);

    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}
