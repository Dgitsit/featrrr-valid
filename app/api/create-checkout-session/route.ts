import { NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDb } from "@/lib/firebase-admin";
import { verifyRequestAuth } from "@/lib/verifyAuth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  try {
    const auth = await verifyRequestAuth(req);

    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { plan } = body;

    if (!plan || (plan !== "monthly" && plan !== "yearly")) {
      return NextResponse.json(
        { error: "Missing or invalid plan" },
        { status: 400 }
      );
    }

    let email = auth.email;
    if (!email) {
      const profile = await adminDb
        .collection("valid_profiles")
        .doc(auth.uid)
        .get();
      email = profile.data()?.email;
    }

    if (!email) {
      return NextResponse.json(
        { error: "Email required for checkout" },
        { status: 400 }
      );
    }

    const priceId =
      plan === "yearly"
        ? process.env.STRIPE_YEARLY_PRICE_ID
        : process.env.STRIPE_MONTHLY_PRICE_ID;

    if (!priceId) {
      return NextResponse.json(
        { error: "Missing Stripe price ID" },
        { status: 500 }
      );
    }

    const BASE_URL =
      process.env.NEXT_PUBLIC_BASE_URL || "https://featrrrvalid.com";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${BASE_URL}/dashboard`,
      cancel_url: `${BASE_URL}/upgrade`,
      metadata: {
        userId: auth.uid,
        plan,
        app: "featrrr-valid",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    console.error("Stripe checkout error:", err);

    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Stripe session failed",
      },
      { status: 500 }
    );
  }
}
