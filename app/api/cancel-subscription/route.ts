import { NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDb } from "@/lib/firebase-admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    // 🔥 Get user from Firestore
    const userRef = adminDb.collection("valid_profiles").doc(userId);
    const snap = await userRef.get();

    if (!snap.exists) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const data = snap.data();
    const customerId = data?.stripeCustomerId;

    if (!customerId) {
      return NextResponse.json(
        { error: "No Stripe customer found" },
        { status: 400 }
      );
    }

    // 🔥 Get active subscription
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    if (!subscriptions.data.length) {
      return NextResponse.json(
        { error: "No active subscription" },
        { status: 400 }
      );
    }

    const subscription = subscriptions.data[0];

    // 🔥 Cancel at period end (RECOMMENDED)
    await stripe.subscriptions.update(subscription.id, {
      cancel_at_period_end: true,
    });

    // 🔥 Update Firestore (grace period still active)
    await userRef.update({
      subscriptionStatus: "canceling", // still active until billing ends
      cancelAtPeriodEnd: true,
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Subscription will cancel at end of billing period",
    });

  } catch (err) {
    console.error("❌ Cancel subscription error:", err);

    return NextResponse.json(
      { error: "Failed to cancel subscription" },
      { status: 500 }
    );
  }
}