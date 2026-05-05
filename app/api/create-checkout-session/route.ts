import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { plan, userId, email } = body;

    // 🚨 VALIDATION
    if (!plan || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 🔥 PRICE SELECTION
    const priceId =
      plan === "monthly"
        ? process.env.STRIPE_MONTHLY_PRICE_ID
        : process.env.STRIPE_YEARLY_PRICE_ID;

    if (!priceId) {
      return NextResponse.json(
        { error: "Missing Stripe price ID" },
        { status: 400 }
      );
    }

    // 🚀 CREATE SESSION
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",

      payment_method_types: ["card"],

      customer_email: email || undefined,

      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],

      // 🔥 CRITICAL FOR WEBHOOK USER MATCH
      metadata: {
        userId,
      },

      // 🔥 BACKUP IDENTIFIER
      client_reference_id: userId,

      // 🔥 UPDATED FLOW (NO APPLY PAGE)
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/onboarding`,

      // 🔥 IMPROVES UX
      allow_promotion_codes: true,
    });

    return NextResponse.json({
      url: session.url,
    });

  } catch (err: any) {
    console.error("❌ Checkout session error:", err);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
