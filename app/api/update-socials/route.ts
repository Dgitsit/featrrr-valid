import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { verifyRequestAuth } from "@/lib/verifyAuth";

export async function POST(req: Request) {
  try {
    const auth = await verifyRequestAuth(req);

    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { socials } = await req.json();

    if (!socials) {
      return NextResponse.json({ error: "Missing socials" }, { status: 400 });
    }

    await adminDb.collection("valid_profiles").doc(auth.uid).set(
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
