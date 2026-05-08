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

    // ✅ Validation
    if (!plan || !userId || !email) {
      console.error("❌ Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Pick correct price
    const priceId =
      plan === "yearly"
        ? process.env.STRIPE_YEARLY_PRICE_ID
        : process.env.STRIPE_MONTHLY_PRICE_ID;

    if (!priceId) {
      console.error("❌ Price ID not found in env");
      return NextResponse.json(
        { error: "Missing Stripe price ID" },
        { status: 500 }
      );
    }

    console.log("PRICE ID:", priceId);

    // ✅ Force correct base URL (don’t rely on env blindly)
    const BASE_URL =
      process.env.NEXT_PUBLIC_BASE_URL || "https://featrrrvalid.com";

    console.log("BASE URL:", BASE_URL);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: email,

      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],

      // ✅ YOUR UPDATED DOMAIN
      success_url: `${BASE_URL}/dashboard`,
      cancel_url: `${BASE_URL}/upgrade`,

      // ✅ IMPORTANT (used later in webhook)
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
