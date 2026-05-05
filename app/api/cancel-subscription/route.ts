import Stripe from "stripe";
import { adminDb } from "@/lib/firebase-admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    const doc = await adminDb
      .collection("valid_profiles")
      .doc(userId)
      .get();

    const data = doc.data();

    if (!data?.stripeSubscriptionId) {
      return new Response("No subscription found", { status: 400 });
    }

    // 🔥 cancel at period end (recommended)
    await stripe.subscriptions.update(data.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    return new Response("Subscription will cancel at period end", {
      status: 200,
    });

  } catch (err) {
    console.error(err);
    return new Response("Error canceling subscription", { status: 500 });
  }
} 
