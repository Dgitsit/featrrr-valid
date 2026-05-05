import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    const ref = adminDb.collection("valid_profiles").doc(userId);

    const doc = await ref.get();

    if (!doc.exists) {
      return new Response("Profile not found", { status: 404 });
    }

    const data = doc.data();

    await ref.update({
      status: "inactive",
      lastOptOutAt: new Date(),
      optOutCount: (data?.optOutCount || 0) + 1,
    });

    return new Response("Opted out", { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Error", { status: 500 });
  }
}
