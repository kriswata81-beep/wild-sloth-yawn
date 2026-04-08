import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { PRODUCTS, ProductId } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

const supabase = createClient(
  "https://flzivjhxtbolcfaniskv.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZseml2amh4dGJvbGNmYW5pc2t2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NDcwNDMsImV4cCI6MjA5MTAyMzA0M30.sLLEl0hmMCbo-Ud18HdleJKrjTZ-mIiLdkwY7cfwGps"
);

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

// Check seat availability before allowing checkout
async function checkSeatAvailability(productId: string): Promise<{ available: boolean; remaining: number }> {
  const EVENT_MAP: Record<string, string> = {
    MAYDAY_DAY_PASS_EARLY: "MAYDAY Nā Koa Day Pass",
    MAYDAY_DAY_PASS_LAST: "MAYDAY Nā Koa Day Pass",
    MAYDAY_MASTERMIND_EARLY: "MAYDAY Mana Mastermind",
    MAYDAY_MASTERMIND_LAST: "MAYDAY Mana Mastermind",
    MAYDAY_WAR_ROOM_EARLY: "MAYDAY Aliʻi War Room",
    MAYDAY_WAR_ROOM_LAST: "MAYDAY Aliʻi War Room",
    MAYDAY_WAR_VAN_EARLY: "MAYDAY War Party VIP",
    MAYDAY_WAR_VAN_LAST: "MAYDAY War Party VIP",
    TEAM_WAR_PARTY_2: "MAYDAY War Party VIP",
    TEAM_WAR_PARTY_3: "MAYDAY War Party VIP",
    TEAM_WAR_PARTY_4: "MAYDAY War Party VIP",
    TEAM_WAR_ROOM_3: "MAYDAY Aliʻi War Room",
    TEAM_MASTERMIND_3: "MAYDAY Mana Mastermind",
  };

  const eventName = EVENT_MAP[productId];
  if (!eventName) return { available: true, remaining: 999 }; // DUES_DOWN has no seat limit

  const { data, error } = await supabase
    .from("events")
    .select("capacity, seats_filled")
    .eq("event_name", eventName)
    .single();

  if (error || !data) {
    console.error("[checkout] Could not check seat availability:", error);
    return { available: true, remaining: 999 }; // fail open — don't block checkout
  }

  const remaining = (data.capacity || 0) - (data.seats_filled || 0);
  return { available: remaining > 0, remaining };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { product_id, handle } = body as { product_id: string; handle?: string };

    if (!product_id || !(product_id in PRODUCTS)) {
      return NextResponse.json({ error: "Invalid product_id" }, { status: 400 });
    }

    const product = PRODUCTS[product_id as ProductId];

    // ── SEAT AVAILABILITY CHECK ───────────────────────────────────────────
    const { available, remaining } = await checkSeatAvailability(product_id);
    if (!available) {
      console.warn("[checkout] Seat sold out for:", product_id);
      return NextResponse.json(
        { error: "sold_out", message: "This seat is sold out. Contact wakachief@gmail.com.", remaining: 0 },
        { status: 409 }
      );
    }

    // ── CREATE STRIPE SESSION ─────────────────────────────────────────────
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

    // ── RECORD PENDING PAYMENT IN SUPABASE ────────────────────────────────
    // This creates a pending record. The webhook will update it to "paid".
    const { error: insertError } = await supabase.from("payments").insert({
      payment_id: `pending_${session.id}`,
      application_id: handle || "unknown",
      payment_type: product_id.startsWith("DUES") ? "dues_down" : "event_ticket",
      tier: "pending",
      amount: product.amount / 100,
      currency: "usd",
      payment_status: "pending",
      stripe_session_id: session.id,
      external_payment_method: "stripe",
      notes_internal: `Checkout initiated: ${product_id} | Handle: ${handle} | Remaining seats: ${remaining}`,
    });

    if (insertError) {
      // Non-fatal — log but don't block checkout
      console.error("[checkout] Failed to record pending payment:", insertError);
    } else {
      console.log("[checkout] Pending payment recorded for session:", session.id);
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[checkout] Stripe checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

// ── GET: Live seat counts for founding48 page ─────────────────────────────
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("event_name, capacity, seats_filled")
      .eq("event_type", "founding_48");

    if (error) {
      console.error("[checkout] Failed to fetch seat counts:", error);
      return NextResponse.json({ error: "Failed to fetch seats" }, { status: 500 });
    }

    // Map to product-friendly keys
    const seats: Record<string, { filled: number; total: number; remaining: number }> = {};
    for (const row of data || []) {
      const filled = row.seats_filled || 0;
      const total = row.capacity || 0;
      seats[row.event_name] = { filled, total, remaining: total - filled };
    }

    return NextResponse.json({ seats });
  } catch (err) {
    console.error("[checkout] GET seat counts error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
