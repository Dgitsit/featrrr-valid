import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ uid: string }> }
) {
  try {
    const { uid } = await params;

    if (!uid) {
      return NextResponse.json({ error: "Missing uid" }, { status: 400 });
    }

    const snap = await adminDb.collection("valid_profiles").doc(uid).get();

    if (!snap.exists) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const data = snap.data() || {};

    return NextResponse.json({
      displayName: data.displayName || "",
      status: data.status || "active",
      subscriptionStatus: data.subscriptionStatus || "free",
      photoURL: data.photoURL || "",
      bio: data.bio || "",
      badgeNumber: data.badgeNumber || "",
      postDisclosures: data.postDisclosures || [],
      contextDisclosures: data.contextDisclosures || [],
      contextNotes: data.contextNotes || "",
      contextUpdatedAt: data.contextUpdatedAt || null,
      socials: data.socials || {},
      shareBoostCount: data.shareBoostCount || 0,
      shareBoostPoints: data.shareBoostPoints || 0,
      lastSharedAt: data.lastSharedAt || null,
    });
  } catch (err) {
    console.error("Profile API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
