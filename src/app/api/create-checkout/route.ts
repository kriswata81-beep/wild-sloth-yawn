import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-04-30.basil",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { priceId, customerEmail, metadata, mode } = body;

    if (!priceId) {
      return NextResponse.json({ error: "Missing priceId" }, { status: 400 });
    }

    // Determine mode from price (recurring = subscription, one-time = payment)
    let sessionMode: "payment" | "subscription" = mode || "payment";
    try {
      const price = await stripe.prices.retrieve(priceId);
      if (price.recurring) {
        sessionMode = "subscription";
      }
    } catch {
      // If we can't fetch the price, use the provided mode
    }

    const session = await stripe.checkout.sessions.create({
      mode: sessionMode,
      line_items: [{ price: priceId, quantity: 1 }],
      ...(customerEmail ? { customer_email: customerEmail } : {}),
      ...(metadata ? { metadata } : {}),
      success_url: `${req.nextUrl.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.nextUrl.origin}/circle`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
