import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  const { userId, photoURL } = await req.json();

  if (!userId || !photoURL) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  await adminDb.collection("valid_profiles").doc(userId).update({
    photoURL,
  });

  return NextResponse.json({ success: true });
}
