import { adminDb } from "@/lib/firebase-admin";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { reportedUserId, reason, description } = body;

    if (!reportedUserId || !reason || !description) {
      return new Response("Missing fields", { status: 400 });
    }

    // 🔥 Save to Firebase
    await adminDb.collection("reports").add({
      reportedUserId,
      reason,
      description,
      status: "pending",
      createdAt: new Date(),
    });

    // 🔥 Send Email Notification
    await resend.emails.send({
      from: "Featrrr Valid <onboarding@resend.dev>", // default sender (we’ll upgrade later)
      to: ["featrrrvalid@gmail.com"],
      subject: "🚨 New Creator Report Submitted",
      html: `
        <h2>New Report Submitted</h2>
        <p><strong>Reported User:</strong> ${reportedUserId}</p>
        <p><strong>Reason:</strong> ${reason}</p>
        <p><strong>Description:</strong></p>
        <p>${description}</p>
      `,
    });

    return new Response("Report submitted", { status: 200 });

  } catch (err) {
    console.error(err);
    return new Response("Error", { status: 500 });
  }
}