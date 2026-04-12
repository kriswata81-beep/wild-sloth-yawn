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

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

// Event-to-seat mapping for auto-incrementing seats_filled
const SEAT_MAP: Record<string, string> = {
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

// How many seats each product consumes
const SEAT_COUNT: Record<string, number> = {
  TEAM_WAR_PARTY_2: 2,
  TEAM_WAR_PARTY_3: 3,
  TEAM_WAR_PARTY_4: 4,
  TEAM_WAR_ROOM_3: 3,
  TEAM_MASTERMIND_3: 3,
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const sig = req.headers.get("stripe-signature") || "";

    let event: Stripe.Event;

    // Verify webhook signature if secret is configured
    if (WEBHOOK_SECRET) {
      try {
        event = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET);
      } catch (err) {
        console.error("[webhook] Signature verification failed:", err);
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      }
    } else {
      // Dev mode — parse without verification
      event = JSON.parse(body) as Stripe.Event;
      console.warn("[webhook] No STRIPE_WEBHOOK_SECRET — running unverified (dev mode)");
    }

    // ── CHECKOUT COMPLETED ────────────────────────────────────────────────
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const productId = session.metadata?.product_id || "";
      const handle = session.metadata?.handle || "";
      const daySelection = session.metadata?.day_selection || "";

      console.log(`[webhook] Payment completed: ${productId} | Handle: ${handle} | Session: ${session.id}`);

      // 1. Update payment record from pending → paid
      const { error: updateError } = await supabase
        .from("payments")
        .update({
          payment_status: "paid",
          notes_internal: `Confirmed via webhook | Product: ${productId} | Handle: ${handle}${daySelection ? ` | Day: ${daySelection}` : ""} | Stripe: ${session.payment_intent}`,
        })
        .eq("stripe_session_id", session.id);

      if (updateError) {
        console.error("[webhook] Failed to update payment:", updateError);
      }

      // 2. Increment seat count if this is an event ticket
      const eventName = SEAT_MAP[productId];
      if (eventName) {
        const seatCount = SEAT_COUNT[productId] || 1;

        const { error: seatError } = await supabase.rpc("increment_seats", {
          p_event_name: eventName,
          p_count: seatCount,
        });

        if (seatError) {
          // Fallback: manual increment if RPC doesn't exist
          console.warn("[webhook] RPC increment_seats failed, trying manual:", seatError);
          const { data: current } = await supabase
            .from("events")
            .select("seats_filled")
            .eq("event_name", eventName)
            .single();

          if (current) {
            await supabase
              .from("events")
              .update({ seats_filled: (current.seats_filled || 0) + seatCount })
              .eq("event_name", eventName);
          }
        }

        console.log(`[webhook] Seats incremented: ${eventName} +${seatCount}`);
      }

      // 3. If this is a $9.99 gate entry, update gate_submissions
      if (productId === "GATE_ENTRY") {
        const { error: gateError } = await supabase
          .from("gate_submissions")
          .update({ pledge_paid: true })
          .eq("handle", handle)
          .order("created_at", { ascending: false })
          .limit(1);

        if (gateError) {
          console.error("[webhook] Failed to update gate entry:", gateError);
        }
        console.log(`[webhook] Gate entry confirmed for: ${handle}`);
      }

      // 4. Send welcome email via XI Post Office
      if (productId === "DUES_DOWN" || productId === "GATE_ENTRY") {
        const templateId = productId === "GATE_ENTRY" ? "welcome_pledge" : "welcome_pledge";
        try {
          const mailPayload = {
            template_id: templateId,
            to_name: handle || "Brother",
            to_email: "", // Will be populated from applicants table if available
            variables: { handle: handle || "Brother", product: productId },
          };

          // Try to find brother's email from applicants table
          const { data: applicant } = await supabase
            .from("applicants")
            .select("email, full_name")
            .or(`full_name.ilike.%${handle}%`)
            .limit(1)
            .single();

          if (applicant?.email) {
            mailPayload.to_email = applicant.email;
            mailPayload.to_name = applicant.full_name || handle;

            const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wild-sloth-yawn.vercel.app";
            await fetch(`${baseUrl}/api/xi-mail`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(mailPayload),
            });
            console.log(`[webhook] Welcome email sent to: ${applicant.email}`);
          } else {
            console.log(`[webhook] No email found for handle: ${handle} — skipping welcome email`);
          }
        } catch (mailErr) {
          // Non-fatal — payment is still confirmed
          console.warn("[webhook] Email send failed (non-fatal):", mailErr);
        }
      }

      // 4b. Send MAYDAY confirmation email
      if (eventName) {
        try {
          const { data: applicant } = await supabase
            .from("applicants")
            .select("email, full_name")
            .or(`full_name.ilike.%${handle}%`)
            .limit(1)
            .single();

          if (applicant?.email) {
            const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wild-sloth-yawn.vercel.app";
            await fetch(`${baseUrl}/api/xi-mail`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                template_id: "mayday_confirm",
                to_name: applicant.full_name || handle,
                to_email: applicant.email,
                variables: { handle: handle || "Brother", event: eventName, product: productId },
              }),
            });
            console.log(`[webhook] MAYDAY confirmation email sent to: ${applicant.email}`);
          }
        } catch (mailErr) {
          console.warn("[webhook] MAYDAY email failed (non-fatal):", mailErr);
        }
      }

      // 5. Log to webhook_events for audit trail
      const { error: auditError } = await supabase.from("webhook_events").insert({
        event_id: event.id,
        event_type: event.type,
        product_id: productId,
        handle,
        stripe_session_id: session.id,
        amount: session.amount_total,
        status: "processed",
      });
      if (auditError) {
        // webhook_events table may not exist yet — non-fatal
        console.warn("[webhook] Audit log insert failed (table may not exist):", auditError.message);
      }
    }

    // ── PAYMENT FAILED ────────────────────────────────────────────────────
    if (event.type === "checkout.session.expired" || event.type === "payment_intent.payment_failed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const failHandle = session.metadata?.handle || "";
      console.warn(`[webhook] Payment failed/expired: ${session.id} | Handle: ${failHandle}`);

      await supabase
        .from("payments")
        .update({
          payment_status: "failed",
          notes_internal: `Payment failed/expired | Handle: ${failHandle} | Session: ${session.id}`,
        })
        .eq("stripe_session_id", session.id);

      // Log failed payment for Steward review
      try {
        await supabase.from("webhook_events").insert({
          event_id: event.id,
          event_type: event.type,
          product_id: session.metadata?.product_id || "unknown",
          handle: failHandle,
          stripe_session_id: session.id,
          amount: session.amount_total,
          status: "failed",
        });
      } catch {
        // non-fatal
      }
    }

    // ── INVOICE PAID (recurring subscription payment succeeded) ──────────
    if (event.type === "invoice.paid") {
      const invoice = event.data.object as Stripe.Invoice;
      const customerEmail = typeof invoice.customer_email === "string" ? invoice.customer_email : "";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rawSub = (invoice as any).subscription;
      const subscriptionId = typeof rawSub === "string" ? rawSub : "";
      const amountPaid = invoice.amount_paid || 0;

      // Try to resolve handle from subscription metadata
      let handle = "";
      if (subscriptionId) {
        try {
          const sub = await stripe.subscriptions.retrieve(subscriptionId);
          handle = sub.metadata?.handle || "";
        } catch {
          // non-fatal
        }
      }

      console.log(`[webhook] Invoice paid: ${invoice.id} | ${customerEmail} | Handle: ${handle} | Amount: ${amountPaid}`);

      // Upsert payment record as paid
      try {
        const { error: upsertError } = await supabase.from("payments").insert({
          handle: handle || customerEmail,
          amount: amountPaid,
          payment_type: "subscription",
          payment_status: "paid",
          stripe_session_id: invoice.id,
          notes_internal: `Invoice paid | Subscription: ${subscriptionId} | Email: ${customerEmail}`,
        });

        if (upsertError) {
          console.error("[webhook] Failed to insert invoice payment:", upsertError);
        }
      } catch (dbErr) {
        console.warn("[webhook] Supabase invoice insert failed (non-fatal):", dbErr);
      }

      // Audit log
      try {
        await supabase.from("webhook_events").insert({
          event_id: event.id,
          event_type: event.type,
          product_id: "MONTHLY_SUB",
          handle: handle || customerEmail,
          stripe_session_id: invoice.id,
          amount: amountPaid,
          status: "processed",
        });
      } catch {
        // non-fatal
      }
    }

    // ── INVOICE PAYMENT FAILED (recurring subscription payment failed) ───
    if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object as Stripe.Invoice;
      const customerEmail = typeof invoice.customer_email === "string" ? invoice.customer_email : "";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rawSub = (invoice as any).subscription;
      const subscriptionId = typeof rawSub === "string" ? rawSub : "";
      const amountDue = invoice.amount_due || 0;

      let handle = "";
      if (subscriptionId) {
        try {
          const sub = await stripe.subscriptions.retrieve(subscriptionId);
          handle = sub.metadata?.handle || "";
        } catch {
          // non-fatal
        }
      }

      console.warn(`[webhook] Invoice payment failed: ${invoice.id} | ${customerEmail} | Handle: ${handle}`);

      // Update payment record to failed
      try {
        const { error: updateError } = await supabase.from("payments").insert({
          handle: handle || customerEmail,
          amount: amountDue,
          payment_type: "subscription",
          payment_status: "failed",
          stripe_session_id: invoice.id,
          notes_internal: `Invoice payment failed | Subscription: ${subscriptionId} | Email: ${customerEmail}`,
        });

        if (updateError) {
          console.error("[webhook] Failed to insert failed invoice payment:", updateError);
        }
      } catch (dbErr) {
        console.warn("[webhook] Supabase failed invoice insert (non-fatal):", dbErr);
      }

      // Send recovery email
      if (customerEmail) {
        try {
          const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wild-sloth-yawn.vercel.app";
          const retryLink = `${baseUrl}/api/create-subscription?handle=${encodeURIComponent(handle || customerEmail)}`;
          await fetch(`${baseUrl}/api/xi-mail`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              template_id: "payment_recovery",
              to_name: handle || "Brother",
              to_email: customerEmail,
              variables: {
                handle: handle || "Brother",
                retry_link: retryLink,
                amount: (amountDue / 100).toFixed(2),
              },
            }),
          });
          console.log(`[webhook] Payment recovery email sent to: ${customerEmail}`);
        } catch (mailErr) {
          console.warn("[webhook] Recovery email failed (non-fatal):", mailErr);
        }
      }

      // Audit log
      try {
        await supabase.from("webhook_events").insert({
          event_id: event.id,
          event_type: event.type,
          product_id: "MONTHLY_SUB",
          handle: handle || customerEmail,
          stripe_session_id: invoice.id,
          amount: amountDue,
          status: "failed",
        });
      } catch {
        // non-fatal
      }
    }

    // ── SUBSCRIPTION CANCELLED ───────────────────────────────────────────
    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;
      const handle = subscription.metadata?.handle || "";
      const customerId = typeof subscription.customer === "string" ? subscription.customer : "";

      console.warn(`[webhook] Subscription cancelled: ${subscription.id} | Handle: ${handle}`);

      // Try to find customer email for notification
      let customerEmail = "";
      if (customerId) {
        try {
          const customer = await stripe.customers.retrieve(customerId);
          if (!customer.deleted && customer.email) {
            customerEmail = customer.email;
          }
        } catch {
          // non-fatal
        }
      }

      // Audit log
      try {
        await supabase.from("webhook_events").insert({
          event_id: event.id,
          event_type: event.type,
          product_id: "MONTHLY_SUB",
          handle: handle || customerEmail,
          stripe_session_id: subscription.id,
          amount: 0,
          status: "cancelled",
        });
      } catch {
        // non-fatal
      }

      // Send cancellation email
      if (customerEmail) {
        try {
          const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wild-sloth-yawn.vercel.app";
          await fetch(`${baseUrl}/api/xi-mail`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              template_id: "subscription_cancelled",
              to_name: handle || "Brother",
              to_email: customerEmail,
              variables: {
                handle: handle || "Brother",
              },
            }),
          });
          console.log(`[webhook] Subscription cancelled email sent to: ${customerEmail}`);
        } catch (mailErr) {
          console.warn("[webhook] Cancellation email failed (non-fatal):", mailErr);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[webhook] Unhandled error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
