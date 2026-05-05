import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    const ref = adminDb.collection("valid_profiles").doc(userId);

    await ref.update({
      status: "active",
      lastOptInAt: new Date(),
    });

    return new Response("Opted in", { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Error", { status: 500 });
  }
}
