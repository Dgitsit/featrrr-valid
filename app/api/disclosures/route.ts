import { adminDb } from "@/lib/firebase-admin";
import { verifyRequestAuth } from "@/lib/verifyAuth";

export async function POST(req: Request) {
  try {
    const auth = await verifyRequestAuth(req);

    if (!auth) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { title, description, category, link } = body;

    if (!title || !description) {
      return new Response("Missing required fields", { status: 400 });
    }

    const userId = auth.uid;

    if (link) {
      const existing = await adminDb
        .collection("disclosures")
        .where("userId", "==", userId)
        .where("link", "==", link)
        .get();

      if (!existing.empty) {
        return new Response("Duplicate disclosure", { status: 400 });
      }
    }

    if (description.length < 15) {
      return new Response("Description too short", { status: 400 });
    }

    await adminDb.collection("disclosures").add({
      userId,
      title,
      description,
      category: category || "general",
      link: link || "",
      createdAt: new Date(),
    });

    return new Response("Success", { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Error creating disclosure", { status: 500 });
  }
}
