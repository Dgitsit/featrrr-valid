export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDb } from "@/lib/firebase-admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  // 🔴 MUST have signature
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    console.error("❌ Signature verification failed:", err.message);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }

  try {
    // ================================
    // ✅ CHECKOUT COMPLETED
    // ================================
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      console.log("🔥 Checkout session:", session);

      const userId = session.metadata?.userId;
      const customerId = session.customer as string;

      if (!userId) {
        console.error("❌ Missing userId in metadata");
        return NextResponse.json({ error: "Missing userId" }, { status: 400 });
      }

      await adminDb.collection("valid_profiles").doc(userId).set(
        {
          // 🔥 subscription info
          subscriptionStatus: "active",
          stripeCustomerId: customerId,
          plan: "pro",

          // 🔥 base structure (prevents broken docs)
          score: 75,
          onboardingComplete: false,
          joinedAt: new Date(),

          socials: {},
          persistentDisclosures: {},
          custom: {},

          flags: 0,
          updatedAt: new Date(),
        },
        { merge: true }
      );

      console.log("✅ User upgraded:", userId);
    }

    // ================================
    // 🔄 SUBSCRIPTION UPDATED
    // ================================
    if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object as Stripe.Subscription;

      const customerId = subscription.customer as string;
      const status = subscription.status;

      const snapshot = await adminDb
        .collection("valid_profiles")
        .where("stripeCustomerId", "==", customerId)
        .get();

      if (!snapshot.empty) {
        const doc = snapshot.docs[0];

        await doc.ref.update({
          subscriptionStatus: status === "active" ? "active" : "inactive",
          updatedAt: new Date(),
        });

        console.log("🔄 Subscription updated:", customerId, status);
      }
    }

    // ================================
    // ❌ SUBSCRIPTION CANCELLED
    // ================================
    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;

      const customerId = subscription.customer as string;

      const snapshot = await adminDb
        .collection("valid_profiles")
        .where("stripeCustomerId", "==", customerId)
        .get();

      if (!snapshot.empty) {
        const doc = snapshot.docs[0];

        await doc.ref.update({
          subscriptionStatus: "inactive",
          plan: "free",
          updatedAt: new Date(),
        });

        console.log("❌ Subscription cancelled:", customerId);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("❌ Webhook handler error:", err);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
