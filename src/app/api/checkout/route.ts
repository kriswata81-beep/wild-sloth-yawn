import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { PRODUCTS, ProductId } from "@/lib/stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { product_id, handle } = body as { product_id: string; handle?: string };

    if (!product_id || !(product_id in PRODUCTS)) {
      return NextResponse.json({ error: "Invalid product_id" }, { status: 400 });
    }

    const product = PRODUCTS[product_id as ProductId];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: product.amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${BASE_URL}/payment-success?product_id=${product_id}&handle=${encodeURIComponent(handle || "Brother")}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/founding48${handle ? `?h=${encodeURIComponent(handle)}` : ""}`,
      metadata: {
        product_id,
        handle: handle || "",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
