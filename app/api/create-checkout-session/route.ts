import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { plan, userId, email } = body;

    console.log("=== STRIPE CHECKOUT DEBUG START ===");
    console.log("PLAN:", plan);
    console.log("USER ID:", userId);
    console.log("EMAIL:", email);

    if (!plan || !userId || !email) {
      console.error("❌ Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const priceId =
      plan === "yearly"
        ? process.env.STRIPE_YEARLY_PRICE_ID
        : process.env.STRIPE_MONTHLY_PRICE_ID;

    console.log("PRICE ID:", priceId);

    if (!priceId) {
      console.error("❌ Price ID not found in env");
      return NextResponse.json(
        { error: "Missing Stripe price ID" },
        { status: 500 }
      );
    }

    console.log("BASE URL:", process.env.NEXT_PUBLIC_BASE_URL);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/upgrade`,
      metadata: {
        userId,
        plan,
        app: "featrrr-valid",
      },
    });

    console.log("✅ SESSION CREATED:", session.id);
    console.log("➡️ REDIRECT URL:", session.url);
    console.log("=== STRIPE CHECKOUT DEBUG END ===");

    return NextResponse.json({ url: session.url });

  } catch (err: any) {
    console.error("🚨 STRIPE ERROR FULL:", err);

    return NextResponse.json(
      {
        error: err?.message || "Stripe session failed",
      },
      { status: 500 }
    );
  }
}
