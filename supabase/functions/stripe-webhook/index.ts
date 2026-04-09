import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

// Product → event name mapping for seat counter
const PRODUCT_TO_EVENT: Record<string, string> = {
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

// Product → tier mapping
const PRODUCT_TO_TIER: Record<string, string> = {
  MAYDAY_DAY_PASS_EARLY: "nakoa",
  MAYDAY_DAY_PASS_LAST: "nakoa",
  MAYDAY_MASTERMIND_EARLY: "mana",
  MAYDAY_MASTERMIND_LAST: "mana",
  MAYDAY_WAR_ROOM_EARLY: "alii",
  MAYDAY_WAR_ROOM_LAST: "alii",
  MAYDAY_WAR_VAN_EARLY: "alii",
  MAYDAY_WAR_VAN_LAST: "alii",
  TEAM_WAR_PARTY_2: "alii",
  TEAM_WAR_PARTY_3: "alii",
  TEAM_WAR_PARTY_4: "alii",
  TEAM_WAR_ROOM_3: "alii",
  TEAM_MASTERMIND_3: "mana",
  DUES_DOWN: "member",
};

// Product display names for email
const PRODUCT_DISPLAY: Record<string, string> = {
  DUES_DOWN: "Annual Dues — 25% Down",
  MAYDAY_DAY_PASS_EARLY: "12HR Nā Koa Day Pass — Early Bird",
  MAYDAY_DAY_PASS_LAST: "12HR Nā Koa Day Pass — Last Call",
  MAYDAY_MASTERMIND_EARLY: "24HR Mana Mastermind — Early Bird",
  MAYDAY_MASTERMIND_LAST: "24HR Mana Mastermind — Last Call",
  MAYDAY_WAR_ROOM_EARLY: "48HR Aliʻi War Room — Early Bird",
  MAYDAY_WAR_ROOM_LAST: "48HR Aliʻi War Room — Last Call",
  MAYDAY_WAR_VAN_EARLY: "72HR War Party VIP — Early Bird",
  MAYDAY_WAR_VAN_LAST: "72HR War Party VIP — Last Call",
  TEAM_WAR_PARTY_2: "Aliʻi War Party — Fly-In Party of 2",
  TEAM_WAR_PARTY_3: "Aliʻi War Party — Fly-In Party of 3",
  TEAM_WAR_PARTY_4: "Aliʻi War Party — Fly-In Party of 4",
  TEAM_WAR_ROOM_3: "Aliʻi War Party — Drive-Up Team of 3",
  TEAM_MASTERMIND_3: "Mana War Party — Drive-Up Team of 3",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  if (!stripeKey || !webhookSecret) {
    console.error("[stripe-webhook] Missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET");
    return new Response("Webhook not configured", { status: 500 });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2025-04-30.basil" });
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    console.error("[stripe-webhook] No stripe-signature header");
    return new Response("No signature", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, sig, webhookSecret);
    console.log("[stripe-webhook] Event received:", event.type, event.id);
  } catch (err) {
    console.error("[stripe-webhook] Signature verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  // ── HANDLE: checkout.session.completed ───────────────────────────────────
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const productId = session.metadata?.product_id || "";
    const handle = session.metadata?.handle || "";
    const daySelection = session.metadata?.day_selection || "";
    const amountPaid = session.amount_total || 0;
    const sessionId = session.id;
    const customerEmail = session.customer_details?.email || "";

    console.log("[stripe-webhook] Payment confirmed:", { productId, handle, amountPaid, sessionId, customerEmail });

    // 1. Write to payments table
    const { error: paymentError } = await supabase.from("payments").insert({
      payment_id: `stripe_${sessionId}`,
      application_id: handle || "unknown",
      payment_type: productId.startsWith("DUES") ? "dues_down" : "event_ticket",
      tier: PRODUCT_TO_TIER[productId] || "unknown",
      amount: amountPaid / 100,
      currency: "usd",
      payment_status: "paid",
      paid_at: new Date().toISOString(),
      stripe_session_id: sessionId,
      external_payment_method: "stripe",
      notes_internal: `Product: ${productId}${daySelection ? ` | Day: ${daySelection}` : ""} | Handle: ${handle}`,
    });

    if (paymentError) {
      console.error("[stripe-webhook] Failed to write payment:", paymentError);
    } else {
      console.log("[stripe-webhook] Payment recorded in Supabase");
    }

    // 2. Update gate_submission + portal tier
    if (handle) {
      if (productId === "DUES_DOWN") {
        const { error: duesError } = await supabase
          .from("gate_submissions")
          .update({
            dues_paid: true,
            committed_at: new Date().toISOString(),
            status: "committed",
          })
          .eq("handle", handle);

        if (duesError) {
          console.error("[stripe-webhook] Failed to update gate_submission dues:", duesError);
        } else {
          console.log("[stripe-webhook] gate_submission dues_paid = true for:", handle);
        }

        // Update memberships table tier to "member" after dues paid
        const { error: memberError } = await supabase
          .from("memberships")
          .upsert({
            handle,
            tier: "member",
            dues_paid: true,
            dues_paid_at: new Date().toISOString(),
            founding_rate: 497,
            updated_at: new Date().toISOString(),
          }, { onConflict: "handle" });

        if (memberError) {
          console.error("[stripe-webhook] Failed to update memberships tier:", memberError);
        } else {
          console.log("[stripe-webhook] memberships tier updated to member for:", handle);
        }
      } else {
        // Event ticket — update gate_submission and portal tier
        const tier = PRODUCT_TO_TIER[productId] || "nakoa";

        const { error: ticketError } = await supabase
          .from("gate_submissions")
          .update({
            event_ticket: productId,
            accepted_at: new Date().toISOString(),
          })
          .eq("handle", handle);

        if (ticketError) {
          console.error("[stripe-webhook] Failed to update gate_submission event_ticket:", ticketError);
        } else {
          console.log("[stripe-webhook] gate_submission event_ticket set:", productId, "for:", handle);
        }

        // Update memberships table with event tier
        const { error: tierError } = await supabase
          .from("memberships")
          .upsert({
            handle,
            tier,
            event_ticket: productId,
            event_day: daySelection || null,
            updated_at: new Date().toISOString(),
          }, { onConflict: "handle" });

        if (tierError) {
          console.error("[stripe-webhook] Failed to update memberships event tier:", tierError);
        } else {
          console.log("[stripe-webhook] memberships tier updated to", tier, "for:", handle);
        }
      }
    }

    // 3. Increment seat counter in events table
    const eventName = PRODUCT_TO_EVENT[productId];
    if (eventName) {
      const { data: eventData, error: fetchError } = await supabase
        .from("events")
        .select("id, seats_filled, capacity")
        .eq("event_name", eventName)
        .single();

      if (fetchError || !eventData) {
        console.error("[stripe-webhook] Could not find event:", eventName, fetchError);
      } else {
        const newFilled = (eventData.seats_filled || 0) + 1;
        const { error: seatError } = await supabase
          .from("events")
          .update({ seats_filled: newFilled })
          .eq("id", eventData.id);

        if (seatError) {
          console.error("[stripe-webhook] Failed to increment seat counter:", seatError);
        } else {
          console.log("[stripe-webhook] Seat counter updated:", eventName, newFilled, "/", eventData.capacity);
          if (newFilled >= eventData.capacity) {
            console.log("[stripe-webhook] ⚠️ EVENT SOLD OUT:", eventName);
          }
        }
      }
    }

    // 4. Send email confirmation via send-confirmation edge function
    if (customerEmail) {
      try {
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const emailRes = await fetch(
          `${supabaseUrl}/functions/v1/send-confirmation`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
            },
            body: JSON.stringify({
              to_email: customerEmail,
              handle: handle || "Brother",
              product_name: PRODUCT_DISPLAY[productId] || productId,
              product_id: productId,
              amount: `$${(amountPaid / 100).toFixed(2)}`,
              day_selection: daySelection || undefined,
              session_id: sessionId,
            }),
          }
        );
        const emailData = await emailRes.json();
        if (!emailRes.ok) {
          console.error("[stripe-webhook] Email send failed:", emailData);
        } else {
          console.log("[stripe-webhook] Confirmation email sent:", emailData.email_id);
        }
      } catch (emailErr) {
        console.error("[stripe-webhook] Email send error:", emailErr);
      }
    } else {
      console.warn("[stripe-webhook] No customer email — skipping confirmation email");
    }

    // 5. Log to admin_activity_log
    await supabase.from("admin_activity_log").insert({
      action_type: "payment_confirmed",
      application_id: handle || "unknown",
      target_table: "payments",
      action_summary: `Payment confirmed: ${productId} · $${(amountPaid / 100).toFixed(2)} · ${handle}${daySelection ? ` · ${daySelection}` : ""}`,
      details: { product_id: productId, session_id: sessionId, amount: amountPaid, day_selection: daySelection },
      performed_by: "stripe-webhook",
    });

    console.log("[stripe-webhook] Admin log written");
  }

  // ── HANDLE: payment_intent.payment_failed ────────────────────────────────
  if (event.type === "payment_intent.payment_failed") {
    const pi = event.data.object as Stripe.PaymentIntent;
    console.warn("[stripe-webhook] Payment FAILED:", pi.id, pi.last_payment_error?.message);

    await supabase.from("admin_activity_log").insert({
      action_type: "payment_failed",
      application_id: "unknown",
      target_table: "payments",
      action_summary: `Payment failed: ${pi.id} — ${pi.last_payment_error?.message || "unknown error"}`,
      details: { payment_intent_id: pi.id },
      performed_by: "stripe-webhook",
    });
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
});