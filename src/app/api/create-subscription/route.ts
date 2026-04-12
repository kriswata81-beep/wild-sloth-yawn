import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-04-30.basil",
});

const supabase = createClient(
  "https://flzivjhxtbolcfaniskv.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZseml2amh4dGJvbGNmYW5pc2t2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NDcwNDMsImV4cCI6MjA5MTAyMzA0M30.sLLEl0hmMCbo-Ud18HdleJKrjTZ-mIiLdkwY7cfwGps"
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { handle, email, price_id } = body as {
      handle: string;
      email: string;
      price_id?: string;
    };

    if (!handle || !email) {
      return NextResponse.json(
        { error: "Missing required fields: handle, email" },
        { status: 400 }
      );
    }

    const priceId =
      price_id ||
      process.env.STRIPE_MONTHLY_PRICE_ID ||
      "price_monthly_3106";

    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://wild-sloth-yawn.vercel.app";

    // Find existing Stripe customer by email, or create a new one
    let customerId: string;
    try {
      const existing = await stripe.customers.list({
        email,
        limit: 1,
      });

      if (existing.data.length > 0) {
        customerId = existing.data[0].id;
        console.log(
          `[create-subscription] Found existing customer: ${customerId}`
        );
      } else {
        const newCustomer = await stripe.customers.create({
          email,
          name: handle,
          metadata: { handle },
        });
        customerId = newCustomer.id;
        console.log(
          `[create-subscription] Created new customer: ${customerId}`
        );
      }
    } catch (stripeErr) {
      console.error(
        "[create-subscription] Stripe customer lookup/create failed:",
        stripeErr
      );
      return NextResponse.json(
        { error: "Failed to set up customer" },
        { status: 500 }
      );
    }

    // Create Stripe Checkout Session in subscription mode
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/payment-success?product_id=MONTHLY_SUB&handle=${encodeURIComponent(handle)}`,
      cancel_url: `${baseUrl}/portal/dashboard`,
      metadata: {
        handle,
        product_id: "MONTHLY_SUB",
      },
    });

    console.log(
      `[create-subscription] Session created: ${session.id} | Handle: ${handle}`
    );

    // Insert pending payment record in Supabase
    try {
      const { error: insertError } = await supabase.from("payments").insert({
        handle,
        amount: 3106,
        payment_type: "subscription",
        payment_status: "pending",
        stripe_session_id: session.id,
      });

      if (insertError) {
        console.error(
          "[create-subscription] Failed to insert pending payment:",
          insertError
        );
      }
    } catch (dbErr) {
      // Non-fatal — the Stripe session was already created
      console.warn(
        "[create-subscription] Supabase insert failed (non-fatal):",
        dbErr
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[create-subscription] Unhandled error:", error);
    return NextResponse.json(
      { error: "Failed to create subscription session" },
      { status: 500 }
    );
  }
}
