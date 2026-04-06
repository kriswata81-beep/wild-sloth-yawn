"use client";

import { useStore } from "@/lib/store";
import { TIER_CONFIG, TELEGRAM } from "@/lib/makoa";
import MemberTimeline from "./MemberTimeline";
import { type Membership } from "@/lib/db";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.35)";
const GREEN = "#3fb950";
const RED = "#f85149";
const BG = "#04060a";

function Badge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span style={{
      color, background: bg, border: `1px solid ${color}33`,
      fontSize: "0.48rem", letterSpacing: "0.12em", textTransform: "uppercase",
      padding: "3px 8px", borderRadius: 4, fontFamily: "var(--font-jetbrains)", fontWeight: 700,
    }}>
      {label}
    </span>
  );
}

function standingBadge(standing: string) {
  if (standing === "good") return <Badge label="Good Standing" color={GREEN} bg={`${GREEN}10`} />;
  if (standing === "review") return <Badge label="Under Review" color="#f0a030" bg="rgba(240,160,48,0.1)" />;
  return <Badge label="Suspended" color={RED} bg={`${RED}10`} />;
}

function statusBadge(status: string) {
  const map: Record<string, { color: string; bg: string }> = {
    active: { color: GREEN, bg: `${GREEN}10` },
    paused: { color: "#f0a030", bg: "rgba(240,160,48,0.1)" },
    delinquent: { color: RED, bg: `${RED}10` },
    canceled: { color: "#4a4a4a", bg: "rgba(74,74,74,0.1)" },
    completed: { color: GOLD, bg: `${GOLD}10` },
    invited: { color: "#58a6ff", bg: "rgba(88,166,255,0.1)" },
  };
  const s = map[status] || { color: GOLD_DIM, bg: "rgba(176,142,80,0.05)" };
  return <Badge label={status.charAt(0).toUpperCase() + status.slice(1)} color={s.color} bg={s.bg} />;
}

interface MemberPortalProps {
  applicationId: string;
  onBack: () => void;
}

export default function MemberPortal({ applicationId, onBack }: MemberPortalProps) {
  const { db, getMemberTimeline } = useStore();

  const applicant = db.applicants.find(a => a.application_id === applicationId);
  const membership = db.memberships.find(m => m.application_id === applicationId);
  const tgProfile = db.telegram_profiles.find(t => t.application_id === applicationId);
  const payments = db.payments.filter(p => p.application_id === applicationId);
  const timeline = getMemberTimeline(applicationId);

  if (!applicant) {
    return (
      <div style={{ background: BG, minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-jetbrains)" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.65rem" }}>Member record not found</p>
          <button onClick={onBack} style={{ background: "none", border: "none", color: GOLD_DIM, cursor: "pointer", fontSize: "0.6rem", marginTop: 12 }}>← BACK</button>
        </div>
      </div>
    );
  }

  const cfg = membership ? TIER_CONFIG[membership.tier] : null;
  const tierGroup = membership ? TELEGRAM.tiers[membership.tier] : null;
  const nextPayment = payments.find(p => p.payment_type === "subscription" && p.subscription_active);
  const depositPayment = payments.find(p => p.payment_type === "deposit" && p.payment_status === "paid");

  return (
    <div style={{ background: BG, minHeight: "100dvh", fontFamily: "var(--font-jetbrains)", overflowX: "hidden" }}>

      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        background: cfg ? `radial-gradient(ellipse at 50% 15%, ${cfg.color}07 0%, transparent 55%)` : "none",
      }} />

      {/* Header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 40,
        background: "rgba(4,6,10,0.97)", backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(176,142,80,0.1)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 16px", height: 48,
      }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: GOLD_DIM, cursor: "pointer", fontSize: "0.6rem", letterSpacing: "0.1em" }}>
          ← BACK
        </button>
        <span className="font-cormorant" style={{ fontStyle: "italic", color: GOLD, fontSize: "1rem" }}>Member Portal</span>
        <div style={{ width: 48 }} />
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "24px 16px 48px", position: "relative", zIndex: 1 }}>

        {/* Identity card */}
        <div style={{ background: "#060810", border: `1px solid ${cfg?.color || GOLD}22`, borderRadius: 12, padding: "18px 16px", marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div>
              <h2 className="font-cormorant" style={{ fontStyle: "italic", color: cfg?.color || GOLD, fontSize: "1.5rem", margin: "0 0 4px" }}>
                {applicant.full_name}
              </h2>
              <p style={{ color: GOLD_DIM, fontSize: "0.58rem", margin: "0 0 6px" }}>{applicant.email}</p>
              <p style={{ color: "rgba(176,142,80,0.25)", fontSize: "0.52rem", margin: 0 }}>ID: {applicant.application_id}</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5, alignItems: "flex-end" }}>
              {membership && statusBadge(membership.membership_status)}
              {membership && standingBadge(membership.standing)}
            </div>
          </div>

          {membership && cfg && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", background: `${cfg.color}08`, border: `1px solid ${cfg.color}22`, borderRadius: 8 }}>
              <span style={{ fontSize: "1rem" }}>{cfg.icon}</span>
              <div>
                <p style={{ color: cfg.color, fontSize: "0.65rem", margin: "0 0 2px", fontWeight: 600 }}>{cfg.label} · Founding Member</p>
                <p style={{ color: GOLD_DIM, fontSize: "0.52rem", margin: 0 }}>{membership.region} · {membership.chapter_house}</p>
              </div>
            </div>
          )}
        </div>

        {/* Payment status */}
        {membership && cfg && (
          <div style={{ background: "#060810", border: "0.5px solid rgba(176,142,80,0.1)", borderRadius: 12, padding: "16px", marginBottom: 16 }}>
            <p style={{ color: GOLD_DIM, fontSize: "0.52rem", letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 12px" }}>Payment Status</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "rgba(176,142,80,0.5)", fontSize: "0.6rem" }}>Deposit</span>
                <span style={{ color: membership.deposit_paid ? GREEN : RED, fontSize: "0.6rem", fontWeight: 600 }}>
                  {membership.deposit_paid ? `$${cfg.deposit} paid` : "Not paid"}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "rgba(176,142,80,0.5)", fontSize: "0.6rem" }}>Monthly plan</span>
                <span style={{ color: membership.monthly_plan_active ? GREEN : GOLD_DIM, fontSize: "0.6rem" }}>
                  {membership.monthly_plan_active ? `$${cfg.monthly}/mo · active` : "Not activated"}
                </span>
              </div>
              {nextPayment && (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "rgba(176,142,80,0.5)", fontSize: "0.6rem" }}>Months paid</span>
                  <span style={{ color: GOLD, fontSize: "0.6rem" }}>{nextPayment.months_paid_count} of {cfg.months}</span>
                </div>
              )}
              {depositPayment && (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "rgba(176,142,80,0.5)", fontSize: "0.6rem" }}>Deposit ref</span>
                  <span style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.5rem", fontFamily: "var(--font-jetbrains)" }}>{depositPayment.payment_id.slice(0, 16)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Event entitlements */}
        {membership && (
          <div style={{ background: "#060810", border: "0.5px solid rgba(176,142,80,0.1)", borderRadius: 12, padding: "16px", marginBottom: 16 }}>
            <p style={{ color: GOLD_DIM, fontSize: "0.52rem", letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 12px" }}>Event Access</p>
            {[
              {
                label: "May 1–4 Founding 72",
                value: membership.may_founding_72_included ? "INCLUDED" : "Not included",
                color: membership.may_founding_72_included ? GREEN : "rgba(176,142,80,0.25)",
              },
              {
                label: "Quarterly Hotel Summits",
                value: membership.quarterly_hotel_events_included_total > 0
                  ? `${membership.quarterly_hotel_events_included_total - membership.quarterly_hotel_events_used} of ${membership.quarterly_hotel_events_included_total} remaining`
                  : "Not included",
                color: membership.quarterly_hotel_events_included_total > 0 ? GOLD : "rgba(176,142,80,0.25)",
              },
              {
                label: "Monthly Full Moon",
                value: membership.monthly_full_moon_events_unlimited ? "UNLIMITED" : "Not included",
                color: membership.monthly_full_moon_events_unlimited ? GREEN : "rgba(176,142,80,0.25)",
              },
              {
                label: "Weekly Wed Training",
                value: membership.weekly_wed_training_unlimited ? "UNLIMITED" : "Not included",
                color: membership.weekly_wed_training_unlimited ? GREEN : "rgba(176,142,80,0.25)",
              },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: "rgba(176,142,80,0.5)", fontSize: "0.6rem" }}>{label}</span>
                <span style={{ color, fontSize: "0.6rem", fontWeight: 600 }}>{value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Telegram status */}
        <div style={{ background: "#060810", border: "0.5px solid rgba(88,166,255,0.12)", borderRadius: 12, padding: "16px", marginBottom: 16 }}>
          <p style={{ color: "#58a6ff", fontSize: "0.52rem", letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 12px" }}>Telegram Status</p>
          {[
            { label: "Main channel", done: tgProfile?.joined_main_channel || membership?.telegram_joined },
            { label: "Private tier group", done: tgProfile?.joined_private_group },
            { label: "Regional cluster", done: tgProfile?.joined_region_group },
            { label: "Onboarding complete", done: tgProfile?.onboarding_complete || membership?.onboarding_complete },
          ].map(({ label, done }) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ color: "rgba(176,142,80,0.5)", fontSize: "0.6rem" }}>{label}</span>
              <span style={{ color: done ? GREEN : "rgba(176,142,80,0.25)", fontSize: "0.6rem" }}>
                {done ? "✓ Done" : "Pending"}
              </span>
            </div>
          ))}
          {tierGroup && (
            <a href={tierGroup.url} target="_blank" rel="noopener noreferrer" style={{ display: "block", marginTop: 10, color: "#58a6ff", fontSize: "0.58rem", textDecoration: "none" }}>
              → {tierGroup.name}
            </a>
          )}
        </div>

        {/* Formation timeline */}
        <div style={{ background: "#060810", border: "0.5px solid rgba(176,142,80,0.1)", borderRadius: 12, padding: "16px", marginBottom: 16 }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.52rem", letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 16px" }}>Formation Timeline</p>
          <MemberTimeline events={timeline} />
        </div>

        {/* Next event */}
        <div style={{ background: "rgba(176,142,80,0.03)", border: "1px solid rgba(176,142,80,0.1)", borderRadius: 12, padding: "16px" }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.52rem", letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 10px" }}>Next Event</p>
          <p className="font-cormorant" style={{ fontStyle: "italic", color: GOLD, fontSize: "1.1rem", margin: "0 0 4px" }}>
            Mākoa 1st Roundup — The 72
          </p>
          <p style={{ color: "rgba(176,142,80,0.45)", fontSize: "0.6rem", margin: "0 0 4px" }}>May 1–4, 2026 · Kapolei · West Oahu</p>
          <p style={{ color: "rgba(176,142,80,0.25)", fontSize: "0.55rem", margin: 0 }}>Check-in: May 1 · 6:00pm · First formation: May 2 · 4:00am</p>
        </div>
      </div>
    </div>
  );
}
