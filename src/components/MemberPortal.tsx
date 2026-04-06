"use client";

import { useState } from "react";
import { useStore } from "@/lib/store-context";
import { TIER_CONFIG, TELEGRAM, type Tier } from "@/lib/makoa";
import {
  RANK_ORDER, RANK_POINTS_REQUIRED, getNextRank, computeRankProgress,
  type MemberRank, type EventType,
} from "@/lib/db";
import MemberTimeline from "./MemberTimeline";

// ── DESIGN TOKENS ─────────────────────────────────────────────
const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.35)";
const GREEN = "#3fb950";
const RED = "#f85149";
const BLUE = "#58a6ff";
const BG = "#04060a";
const CARD = "#060810";

function tierAccent(tier: Tier) {
  return tier === "alii" ? GOLD : tier === "mana" ? BLUE : "#8b9aaa";
}

function fmtDate(iso: string) {
  if (!iso) return "—";
  try { return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }
  catch { return "—"; }
}

function fmtShort(iso: string) {
  if (!iso) return "—";
  try { return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" }); }
  catch { return "—"; }
}

function monthsBetween(start: string, end: string) {
  if (!start || !end) return { completed: 0, remaining: 18 };
  const s = new Date(start), e = new Date(end), now = new Date();
  const total = Math.round((e.getTime() - s.getTime()) / (30 * 86400000));
  const completed = Math.max(0, Math.min(total, Math.round((now.getTime() - s.getTime()) / (30 * 86400000))));
  return { completed, remaining: Math.max(0, total - completed) };
}

// ── SHARED COMPONENTS ─────────────────────────────────────────

function Badge({ label, color, small }: { label: string; color: string; small?: boolean }) {
  return (
    <span style={{
      color, background: `${color}14`, border: `1px solid ${color}30`,
      fontSize: small ? "0.44rem" : "0.48rem", letterSpacing: "0.1em",
      textTransform: "uppercase", padding: small ? "2px 6px" : "3px 8px",
      borderRadius: 3, fontFamily: "var(--font-jetbrains)", fontWeight: 700, whiteSpace: "nowrap",
    }}>
      {label}
    </span>
  );
}

function Panel({ children, accent }: { children: React.ReactNode; accent?: string }) {
  return (
    <div style={{
      background: CARD, border: `0.5px solid ${accent ? `${accent}20` : "rgba(176,142,80,0.1)"}`,
      borderRadius: 12, padding: "16px", marginBottom: 12,
    }}>
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ color: GOLD_DIM, fontSize: "0.5rem", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 12px", fontFamily: "var(--font-jetbrains)" }}>
      {children}
    </p>
  );
}

function Row({ label, value, valueColor }: { label: string; value: React.ReactNode; valueColor?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
      <span style={{ color: "rgba(176,142,80,0.45)", fontSize: "0.6rem" }}>{label}</span>
      <span style={{ color: valueColor || GOLD, fontSize: "0.6rem", fontWeight: 500 }}>{value}</span>
    </div>
  );
}

function ProgressBar({ pct, color, height = 5 }: { pct: number; color: string; height?: number }) {
  return (
    <div style={{ height, background: "rgba(255,255,255,0.04)", borderRadius: height, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${Math.min(100, Math.max(0, pct))}%`, background: color, borderRadius: height, transition: "width 0.6s ease" }} />
    </div>
  );
}

// ── TAB: HOME ─────────────────────────────────────────────────

function TabHome({ applicationId }: { applicationId: string }) {
  const { db, getMemberTimeline } = useStore();
  const membership = db.memberships.find(m => m.application_id === applicationId);
  const applicant = db.applicants.find(a => a.application_id === applicationId);
  const tgProfile = db.telegram_profiles.find(t => t.application_id === applicationId);
  const payments = db.payments.filter(p => p.application_id === applicationId);
  const timeline = getMemberTimeline(applicationId);

  if (!membership || !applicant) return null;

  const cfg = TIER_CONFIG[membership.tier];
  const accent = tierAccent(membership.tier);
  const { completed, remaining } = monthsBetween(membership.formation_start_date, membership.formation_end_date);
  const formationPct = Math.round((completed / 18) * 100);
  const subPayment = payments.find(p => p.payment_type === "subscription" && p.payment_status === "paid");
  const nextEvent = db.events.find(e => e.status === "open" || e.status === "upcoming");

  return (
    <div>
      {/* Formation Status */}
      <Panel accent={accent}>
        <SectionLabel>Formation Status</SectionLabel>
        <Row label="Formation start" value={fmtDate(membership.formation_start_date)} />
        <Row label="Formation end" value={fmtDate(membership.formation_end_date)} />
        <Row label="Months completed" value={`${completed} of 18`} valueColor={accent} />
        <Row label="Months remaining" value={remaining} />
        <div style={{ marginTop: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ color: "rgba(176,142,80,0.4)", fontSize: "0.52rem" }}>Formation Progress</span>
            <span style={{ color: accent, fontSize: "0.52rem", fontWeight: 700 }}>{formationPct}%</span>
          </div>
          <ProgressBar pct={formationPct} color={accent} height={6} />
        </div>
      </Panel>

      {/* Payment Status */}
      <Panel>
        <SectionLabel>Payment Status</SectionLabel>
        <Row label="Deposit" value={membership.deposit_paid ? "Paid" : "Not Paid"} valueColor={membership.deposit_paid ? GREEN : RED} />
        <Row
          label="Monthly plan"
          value={membership.monthly_plan_active ? `$${cfg.monthly}/mo · Active` : "Not activated"}
          valueColor={membership.monthly_plan_active ? GREEN : GOLD_DIM}
        />
        {subPayment && <Row label="Last payment" value={fmtDate(subPayment.last_payment_date)} />}
        {subPayment && <Row label="Next due" value={fmtDate(subPayment.next_due_date)} />}
        {subPayment && <Row label="Months paid" value={`${subPayment.months_paid_count} of ${cfg.months}`} valueColor={accent} />}
        {!membership.monthly_plan_active && (
          <button style={{ width: "100%", marginTop: 10, background: `${RED}10`, border: `1px solid ${RED}22`, color: RED, padding: "10px", borderRadius: 8, cursor: "pointer", fontFamily: "var(--font-jetbrains)", fontSize: "0.58rem", letterSpacing: "0.12em" }}>
            Update Payment Method
          </button>
        )}
      </Panel>

      {/* Event Access */}
      <Panel>
        <SectionLabel>Event Access</SectionLabel>
        <Row label="May 1–4 Founding 72" value={membership.may_founding_72_included ? "Included" : "Not included"} valueColor={membership.may_founding_72_included ? GREEN : GOLD_DIM} />
        <Row
          label="Quarterly summits"
          value={membership.quarterly_hotel_events_included_total > 0
            ? `${membership.quarterly_hotel_events_included_total - membership.quarterly_hotel_events_used} of ${membership.quarterly_hotel_events_included_total} remaining`
            : "Not included"}
          valueColor={membership.quarterly_hotel_events_included_total > 0 ? accent : GOLD_DIM}
        />
        <Row label="Monthly full moon" value={membership.monthly_full_moon_events_unlimited ? "Unlimited" : "Not included"} valueColor={membership.monthly_full_moon_events_unlimited ? GREEN : GOLD_DIM} />
        <Row label="Weekly training" value={membership.weekly_wed_training_unlimited ? "Unlimited" : "Not included"} valueColor={membership.weekly_wed_training_unlimited ? GREEN : GOLD_DIM} />
      </Panel>

      {/* Next Event */}
      {nextEvent && (
        <Panel accent={accent}>
          <SectionLabel>Next Event</SectionLabel>
          <p className="font-cormorant" style={{ fontStyle: "italic", color: accent, fontSize: "1.1rem", margin: "0 0 4px" }}>{nextEvent.event_name}</p>
          <p style={{ color: GOLD_DIM, fontSize: "0.58rem", margin: "0 0 2px" }}>{fmtDate(nextEvent.start_date)} · {nextEvent.location_name}</p>
          <p style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.52rem", margin: "0 0 12px" }}>Access: {nextEvent.tier_access === "all" ? "All tiers" : nextEvent.tier_access}</p>
          <button style={{ width: "100%", background: `${accent}14`, border: `1px solid ${accent}33`, color: accent, padding: "11px", borderRadius: 8, cursor: "pointer", fontFamily: "var(--font-jetbrains)", fontSize: "0.58rem", letterSpacing: "0.14em", textTransform: "uppercase" }}>
            View Details
          </button>
        </Panel>
      )}

      {/* Telegram */}
      <Panel>
        <SectionLabel>Telegram Status</SectionLabel>
        <Row label="Verified" value={tgProfile?.payment_verified ? "Yes" : "No"} valueColor={tgProfile?.payment_verified ? GREEN : RED} />
        <Row label="Tier group" value={membership.local_group_name} />
        <Row label="Regional group" value={`Mākoa ${membership.region}`} />
        {!tgProfile?.payment_verified && (
          <a href={TELEGRAM.bot.url} target="_blank" rel="noopener noreferrer" style={{ display: "block", marginTop: 10, background: "rgba(88,166,255,0.08)", border: "1px solid rgba(88,166,255,0.2)", color: BLUE, padding: "11px", borderRadius: 8, textAlign: "center", textDecoration: "none", fontFamily: "var(--font-jetbrains)", fontSize: "0.58rem", letterSpacing: "0.12em" }}>
            Join / Reconnect Telegram
          </a>
        )}
      </Panel>

      {/* Timeline */}
      <Panel>
        <SectionLabel>Formation Timeline</SectionLabel>
        <MemberTimeline events={timeline} />
      </Panel>
    </div>
  );
}

// ── TAB: EVENTS ───────────────────────────────────────────────

function TabEvents({ applicationId }: { applicationId: string }) {
  const { db, reserveEvent } = useStore();
  const membership = db.memberships.find(m => m.application_id === applicationId);
  if (!membership) return null;

  const accent = tierAccent(membership.tier);
  const myEntitlements = db.event_entitlements.filter(e => e.application_id === applicationId);
  const m = membership;

  function getEventCTA(event: typeof db.events[0]) {
    const reserved = myEntitlements.find(e => e.event_id === event.event_id && e.entitlement_status === "reserved");
    if (reserved) return { label: "Reserved ✓", color: GREEN, disabled: true, action: null };

    if (event.event_type === "quarterly_hotel") {
      if (m.quarterly_hotel_events_included_total === 0) return { label: "Unlock Access", color: GOLD_DIM, disabled: false, action: null };
      if (m.quarterly_hotel_events_used >= m.quarterly_hotel_events_included_total) return { label: "Upgrade or Waitlist", color: "#f0a030", disabled: false, action: null };
      return { label: "Reserve Spot", color: accent, disabled: false, action: () => reserveEvent(applicationId, event.event_id) };
    }
    if (event.event_type === "monthly_full_moon" || event.event_type === "weekly_training") {
      return { label: "Reserve Spot", color: accent, disabled: false, action: () => reserveEvent(applicationId, event.event_id) };
    }
    if (event.event_type === "founding_72") {
      return m.may_founding_72_included
        ? { label: "Reserve Spot", color: accent, disabled: false, action: () => reserveEvent(applicationId, event.event_id) }
        : { label: "Unlock Access", color: GOLD_DIM, disabled: false, action: null };
    }
    return { label: "View Details", color: GOLD_DIM, disabled: false, action: null };
  }

  const EVENT_TYPE_LABELS: Record<EventType, string> = {
    founding_72: "Founding 72",
    quarterly_hotel: "Quarterly Summit",
    monthly_full_moon: "Full Moon",
    weekly_training: "Weekly Training",
    day_pass: "Day Pass",
  };

  return (
    <div>
      <p style={{ color: "rgba(176,142,80,0.25)", fontSize: "0.55rem", lineHeight: 1.6, marginBottom: 16 }}>
        Advancement is earned through standing, service, and repetition.
      </p>
      {db.events.filter(e => e.status !== "archived").map(event => {
        const cta = getEventCTA(event);
        return (
          <Panel key={event.event_id} accent={accent}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div style={{ flex: 1 }}>
                <p className="font-cormorant" style={{ fontStyle: "italic", color: GOLD, fontSize: "1.05rem", margin: "0 0 3px" }}>{event.event_name}</p>
                <p style={{ color: GOLD_DIM, fontSize: "0.55rem", margin: "0 0 2px" }}>{fmtDate(event.start_date)} · {event.location_name}</p>
              </div>
              <Badge label={EVENT_TYPE_LABELS[event.event_type]} color={accent} small />
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
              <Badge label={event.tier_access === "all" ? "All Tiers" : event.tier_access === "alii_mana" ? "Aliʻi + Mana" : event.tier_access} color={GOLD_DIM} small />
              <Badge label={event.status} color={event.status === "open" ? GREEN : event.status === "full" ? RED : GOLD_DIM} small />
              <Badge label={`${event.capacity_remaining} spots`} color={event.capacity_remaining < 5 ? RED : GOLD_DIM} small />
            </div>
            <p style={{ color: "rgba(176,142,80,0.4)", fontSize: "0.55rem", margin: "0 0 12px", lineHeight: 1.5 }}>{event.notes_public}</p>
            <button
              onClick={() => cta.action?.()}
              disabled={cta.disabled || !cta.action}
              style={{
                width: "100%", background: `${cta.color}12`, border: `1px solid ${cta.color}30`,
                color: cta.color, padding: "11px", borderRadius: 8,
                cursor: cta.disabled || !cta.action ? "default" : "pointer",
                fontFamily: "var(--font-jetbrains)", fontSize: "0.58rem", letterSpacing: "0.14em", textTransform: "uppercase",
                opacity: cta.disabled ? 0.7 : 1,
              }}
            >
              {cta.label}
            </button>
          </Panel>
        );
      })}
    </div>
  );
}

// ── TAB: PATH ─────────────────────────────────────────────────

function TabPath({ applicationId }: { applicationId: string }) {
  const { db } = useStore();
  const membership = db.memberships.find(m => m.application_id === applicationId);
  if (!membership) return null;

  const mp = membership;
  const accent = tierAccent(mp.tier);
  const cfg = TIER_CONFIG[mp.tier];
  const ranks = RANK_ORDER[mp.tier];
  const currentIdx = ranks.indexOf(mp.current_rank as never);
  const nextRank = getNextRank(mp.tier, mp.current_rank);
  const progress = computeRankProgress(mp.rank_points_total, mp.current_rank, mp.tier);
  const nextRequired = nextRank ? RANK_POINTS_REQUIRED[nextRank] : 0;
  const pointsNeeded = nextRank ? Math.max(0, nextRequired - mp.rank_points_total) : 0;

  const TIER_DESCRIPTIONS: Record<Tier, string> = {
    alii: "Aliʻi are the council. Network-to-network operators who carry the Order's vision into business, community, and legacy. Seated by invitation. Elevated by standing.",
    mana: "Mana are the builders. B2B and B2C operators who grow the Order's reach through business and brotherhood. Advancement is earned through consistency and contribution.",
    nakoa: "Nā Koa are the foundation. Warriors in formation who serve, train, and build the base. The path to Mana begins here. Entry is open. Advancement is earned.",
  };

  const NEXT_TIER: Record<Tier, string> = {
    nakoa: "Path to Mana: Complete formation, earn 120+ points, 2 successful referrals, admin review.",
    mana: "Path to Aliʻi: Demonstrate leadership, 250+ points, 3 successful referrals, admin approval.",
    alii: "You are at the highest tier. Advancement within Aliʻi is by standing and service.",
  };

  // Requirements for next rank
  function getRequirements(): string[] {
    if (!nextRank) return ["You have reached the highest rank in your tier."];
    const reqs: string[] = [];
    if (pointsNeeded > 0) reqs.push(`${pointsNeeded} more formation score points`);
    if (mp.tier === "nakoa" && mp.current_rank === "Nā Koa Active" && mp.weekly_training_attendance_count < 2) reqs.push(`${2 - mp.weekly_training_attendance_count} more weekly training sessions`);
    if (mp.tier === "nakoa" && mp.current_rank === "Nā Koa Sentinel" && mp.successful_referrals_count < 2) reqs.push(`${2 - mp.successful_referrals_count} successful referrals`);
    if (mp.tier === "mana" && mp.current_rank === "Mana Strategist" && mp.successful_referrals_count < 3) reqs.push(`${3 - mp.successful_referrals_count} successful referrals`);
    if (mp.eligible_for_review) reqs.push("Admin review — eligible");
    else if (["Nā Koa Field Lead", "Mana Circle Lead", "Aliʻi Council", "Aliʻi Steward", "Aliʻi Chapter Anchor"].includes(nextRank)) reqs.push("Admin review required");
    return reqs.length ? reqs : ["Continue building your standing score"];
  }

  return (
    <div>
      {/* Current position */}
      <Panel accent={accent}>
        <SectionLabel>Your Position</SectionLabel>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <span style={{ fontSize: "1.4rem" }}>{cfg.icon}</span>
          <div>
            <p className="font-cormorant" style={{ fontStyle: "italic", color: accent, fontSize: "1.3rem", margin: "0 0 2px" }}>{mp.current_rank}</p>
            <p style={{ color: GOLD_DIM, fontSize: "0.55rem", margin: 0 }}>{cfg.label} · {mp.region}</p>
          </div>
        </div>
        <p style={{ color: "rgba(176,142,80,0.4)", fontSize: "0.58rem", lineHeight: 1.6, margin: "0 0 14px" }}>{TIER_DESCRIPTIONS[mp.tier]}</p>

        {/* Formation score */}
        <div style={{ background: "#030508", borderRadius: 8, padding: "12px", marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ color: GOLD_DIM, fontSize: "0.52rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>Formation Score</span>
            <span style={{ color: accent, fontSize: "0.7rem", fontWeight: 700, fontFamily: "var(--font-jetbrains)" }}>{mp.rank_points_total}</span>
          </div>
          <ProgressBar pct={progress} color={accent} height={5} />
          {nextRank && (
            <p style={{ color: "rgba(176,142,80,0.25)", fontSize: "0.5rem", margin: "5px 0 0" }}>
              {pointsNeeded} points to {nextRank}
            </p>
          )}
        </div>

        {nextRank && (
          <div>
            <p style={{ color: GOLD_DIM, fontSize: "0.5rem", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 8px" }}>Next Rank: {nextRank}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {getRequirements().map((req, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <span style={{ color: GOLD_DIM, fontSize: "0.55rem", marginTop: 1 }}>—</span>
                  <span style={{ color: "rgba(176,142,80,0.5)", fontSize: "0.58rem", lineHeight: 1.4 }}>{req}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Panel>

      {/* Rank ladder */}
      <Panel>
        <SectionLabel>Rank Ladder · {cfg.label}</SectionLabel>
        {ranks.map((rank, i) => {
          const isDone = i < currentIdx;
          const isCurrent = i === currentIdx;
          return (
            <div key={rank} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", flexShrink: 0, background: isDone ? `${accent}18` : isCurrent ? `${accent}10` : "rgba(176,142,80,0.04)", border: `1.5px solid ${isDone || isCurrent ? accent : "rgba(176,142,80,0.1)"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {isDone ? <span style={{ color: accent, fontSize: "0.5rem" }}>✓</span> : <span style={{ color: isCurrent ? accent : "rgba(176,142,80,0.2)", fontSize: "0.45rem" }}>{i + 1}</span>}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: isDone || isCurrent ? GOLD : "rgba(176,142,80,0.3)", fontSize: "0.62rem", margin: "0 0 1px", fontWeight: isCurrent ? 600 : 400 }}>{rank}</p>
                <p style={{ color: "rgba(176,142,80,0.2)", fontSize: "0.5rem", margin: 0 }}>{RANK_POINTS_REQUIRED[rank]} pts required</p>
              </div>
              {isCurrent && <Badge label="Current" color={accent} small />}
            </div>
          );
        })}
      </Panel>

      {/* Stats */}
      <Panel>
        <SectionLabel>Activity Record</SectionLabel>
        {[
          { label: "Weekly trainings attended", value: mp.weekly_training_attendance_count },
          { label: "Full moon gatherings", value: mp.monthly_full_moon_attendance_count },
          { label: "Quarterly summits", value: mp.quarterly_event_attendance_count },
          { label: "Service actions", value: mp.service_actions_count },
          { label: "Volunteer hours", value: mp.volunteer_hours },
          { label: "Leadership flags", value: mp.leadership_flags_count },
        ].map(({ label, value }) => (
          <Row key={label} label={label} value={value} valueColor={value > 0 ? accent : GOLD_DIM} />
        ))}
      </Panel>

      {/* Next tier path */}
      <Panel>
        <SectionLabel>Tier Advancement</SectionLabel>
        <p style={{ color: "rgba(176,142,80,0.4)", fontSize: "0.58rem", lineHeight: 1.6, margin: 0 }}>{NEXT_TIER[mp.tier]}</p>
      </Panel>
    </div>
  );
}

// ── TAB: REFERRALS ────────────────────────────────────────────

function TabReferrals({ applicationId }: { applicationId: string }) {
  const { db } = useStore();
  const membership = db.memberships.find(m => m.application_id === applicationId);
  const applicant = db.applicants.find(a => a.application_id === applicationId);
  if (!membership || !applicant) return null;

  const accent = tierAccent(membership.tier);
  const refCode = membership.referral_code || applicant.referral_code;
  const refLink = `https://makoa.order/join?ref=${refCode}`;

  const RECOGNITION_BADGES = [
    { label: "Signal Carrier", threshold: 1, icon: "📡", desc: "1 successful referral" },
    { label: "Gate Opener", threshold: 3, icon: "🚪", desc: "3 successful referrals" },
    { label: "House Builder", threshold: 10, icon: "🏛", desc: "10 active converted members" },
    { label: "Chapter Anchor", threshold: 999, icon: "⚓", desc: "Admin-assigned" },
  ];

  const earned = RECOGNITION_BADGES.filter(b =>
    b.threshold === 999 ? membership.chapter_anchor_status : membership.successful_referrals_count >= b.threshold
  );

  return (
    <div>
      <p style={{ color: "rgba(176,142,80,0.25)", fontSize: "0.55rem", lineHeight: 1.6, marginBottom: 16 }}>
        Carry the signal. Open the gate. Build the house.
      </p>

      {/* Referral code */}
      <Panel accent={accent}>
        <SectionLabel>Your Referral Code</SectionLabel>
        <div style={{ background: "#030508", borderRadius: 8, padding: "14px", marginBottom: 12, textAlign: "center" }}>
          <p style={{ color: accent, fontSize: "1.4rem", fontWeight: 700, fontFamily: "var(--font-jetbrains)", margin: "0 0 4px", letterSpacing: "0.1em" }}>{refCode}</p>
          <p style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.52rem", margin: 0, wordBreak: "break-all" }}>{refLink}</p>
        </div>
        <button
          onClick={() => navigator.clipboard?.writeText(refLink)}
          style={{ width: "100%", background: `${accent}10`, border: `1px solid ${accent}25`, color: accent, padding: "11px", borderRadius: 8, cursor: "pointer", fontFamily: "var(--font-jetbrains)", fontSize: "0.58rem", letterSpacing: "0.14em", textTransform: "uppercase" }}
        >
          Copy Link
        </button>
      </Panel>

      {/* Stats */}
      <Panel>
        <SectionLabel>Referral Standing</SectionLabel>
        <Row label="Total leads referred" value={membership.referrals_count} />
        <Row label="Accepted referrals" value={membership.referrals_count} />
        <Row label="Converted members" value={membership.successful_referrals_count} valueColor={membership.successful_referrals_count > 0 ? GREEN : GOLD_DIM} />
        <Row label="Conversion rate" value={`${membership.referral_conversion_rate}%`} valueColor={accent} />
        <Row label="Ambassador status" value={membership.ambassador_status === "active" ? "Active Ambassador" : "Member Referrer"} valueColor={membership.ambassador_status === "active" ? GOLD : GOLD_DIM} />
        {membership.referral_credit_balance > 0 && (
          <Row label="Formation score earned" value={`+${membership.referral_credit_balance} pts`} valueColor={GREEN} />
        )}
      </Panel>

      {/* Recognition badges */}
      <Panel>
        <SectionLabel>Recognition</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {RECOGNITION_BADGES.map(badge => {
            const isEarned = earned.some(e => e.label === badge.label);
            return (
              <div key={badge.label} style={{ display: "flex", gap: 12, alignItems: "center", opacity: isEarned ? 1 : 0.35 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: isEarned ? `${accent}14` : "rgba(176,142,80,0.04)", border: `1px solid ${isEarned ? accent : "rgba(176,142,80,0.1)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: "0.9rem" }}>{badge.icon}</span>
                </div>
                <div>
                  <p style={{ color: isEarned ? GOLD : "rgba(176,142,80,0.4)", fontSize: "0.62rem", margin: "0 0 2px", fontWeight: isEarned ? 600 : 400 }}>{badge.label}</p>
                  <p style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.52rem", margin: 0 }}>{badge.desc}</p>
                </div>
                {isEarned && <Badge label="Earned" color={accent} small />}
              </div>
            );
          })}
        </div>
      </Panel>

      <p style={{ color: "rgba(176,142,80,0.2)", fontSize: "0.52rem", lineHeight: 1.6, textAlign: "center" }}>
        Recognition follows action.<br />
        20 formation score points per successful referral.
      </p>
    </div>
  );
}

// ── TAB: HOUSE ────────────────────────────────────────────────

function TabHouse({ applicationId }: { applicationId: string }) {
  const { db } = useStore();
  const membership = db.memberships.find(m => m.application_id === applicationId);
  if (!membership) return null;

  const house = db.houses.find(h => h.house_id === membership.house_id) || db.houses[0];
  const accent = tierAccent(membership.tier);

  const healthColor = house.house_health_status === "strong" ? GREEN : house.house_health_status === "stable" ? GOLD : RED;

  const nextEvents = db.events.filter(e => e.status === "open" || e.status === "upcoming").slice(0, 3);

  return (
    <div>
      <p style={{ color: "rgba(176,142,80,0.25)", fontSize: "0.55rem", lineHeight: 1.6, marginBottom: 16 }}>
        A strong house holds its line. House strength reflects the men inside it.
      </p>

      {/* House identity */}
      <Panel accent={accent}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <div>
            <p className="font-cormorant" style={{ fontStyle: "italic", color: GOLD, fontSize: "1.2rem", margin: "0 0 3px" }}>{house.house_name}</p>
            <p style={{ color: GOLD_DIM, fontSize: "0.55rem", margin: "0 0 2px" }}>{house.region} · {house.island}</p>
            <p style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.52rem", margin: 0 }}>Anchor: {house.chapter_anchor_name}</p>
          </div>
          <Badge label={house.house_health_status.replace("_", " ")} color={healthColor} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[
            { label: "Aliʻi", value: house.alii_count, color: GOLD },
            { label: "Mana", value: house.mana_count, color: BLUE },
            { label: "Nā Koa", value: house.nakoa_count, color: "#8b9aaa" },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: "#030508", borderRadius: 6, padding: "10px 8px", textAlign: "center" }}>
              <p style={{ color, fontSize: "1.2rem", fontWeight: 700, margin: "0 0 2px", lineHeight: 1 }}>{value}</p>
              <p style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.48rem", margin: 0, textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</p>
            </div>
          ))}
        </div>
      </Panel>

      {/* Health score */}
      <Panel>
        <SectionLabel>House Health</SectionLabel>
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ color: GOLD_DIM, fontSize: "0.52rem" }}>Payment Health</span>
            <span style={{ color: healthColor, fontSize: "0.52rem" }}>{house.payment_health_score}%</span>
          </div>
          <ProgressBar pct={house.payment_health_score} color={healthColor} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ color: GOLD_DIM, fontSize: "0.52rem" }}>Training Attendance</span>
            <span style={{ color: accent, fontSize: "0.52rem" }}>{house.training_attendance_score}%</span>
          </div>
          <ProgressBar pct={house.training_attendance_score} color={accent} />
        </div>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ color: GOLD_DIM, fontSize: "0.52rem" }}>Member Retention</span>
            <span style={{ color: GREEN, fontSize: "0.52rem" }}>{house.member_retention_rate}%</span>
          </div>
          <ProgressBar pct={house.member_retention_rate} color={GREEN} />
        </div>
      </Panel>

      {/* Revenue snapshot (member-visible summary only) */}
      <Panel>
        <SectionLabel>House Standing</SectionLabel>
        <Row label="Active members" value={house.active_member_count} valueColor={accent} />
        <Row label="Pending review" value={house.pending_count} />
        <Row label="Waitlist" value={house.waitlist_count} />
        <Row label="Top ambassador" value={house.top_ambassador_name} />
        <Row label="Total referrals" value={house.referral_count} valueColor={GREEN} />
      </Panel>

      {/* Upcoming house events */}
      <Panel>
        <SectionLabel>Upcoming Events</SectionLabel>
        {nextEvents.map(ev => (
          <div key={ev.event_id} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: "0.5px solid rgba(176,142,80,0.06)" }}>
            <p style={{ color: GOLD, fontSize: "0.62rem", margin: "0 0 2px" }}>{ev.event_name}</p>
            <p style={{ color: GOLD_DIM, fontSize: "0.52rem", margin: 0 }}>{fmtShort(ev.start_date)} · {ev.location_name}</p>
          </div>
        ))}
      </Panel>
    </div>
  );
}

// ── TAB: LEADERBOARD ──────────────────────────────────────────

function TabLeaderboard({ applicationId }: { applicationId: string }) {
  const { db, leaderboard } = useStore();
  const membership = db.memberships.find(m => m.application_id === applicationId);
  const [view, setView] = useState<"referrals" | "score" | "attendance" | "houses">("referrals");

  const accent = membership ? tierAccent(membership.tier) : GOLD;

  const sorted = [...leaderboard].sort((a, b) => {
    if (view === "referrals") return b.successful_referrals - a.successful_referrals;
    if (view === "score") return b.rank_points - a.rank_points;
    if (view === "attendance") return b.training_attendance - a.training_attendance;
    return 0;
  });

  const TIER_ICONS: Record<Tier, string> = { alii: "👑", mana: "🌀", nakoa: "⚔" };

  return (
    <div>
      <p style={{ color: "rgba(176,142,80,0.25)", fontSize: "0.55rem", lineHeight: 1.6, marginBottom: 16 }}>
        Recognition follows action. The Order watches consistency.
      </p>

      {/* View toggle */}
      <div style={{ display: "flex", gap: 4, background: CARD, border: "0.5px solid rgba(176,142,80,0.1)", borderRadius: 8, padding: 4, marginBottom: 16 }}>
        {(["referrals", "score", "attendance", "houses"] as const).map(v => (
          <button key={v} onClick={() => setView(v)} style={{ flex: 1, background: view === v ? `${accent}18` : "transparent", border: `1px solid ${view === v ? accent : "transparent"}`, color: view === v ? accent : GOLD_DIM, padding: "7px 4px", borderRadius: 5, cursor: "pointer", fontFamily: "var(--font-jetbrains)", fontSize: "0.46rem", letterSpacing: "0.08em", textTransform: "uppercase", transition: "all 0.2s" }}>
            {v === "referrals" ? "Referrals" : v === "score" ? "Score" : v === "attendance" ? "Training" : "Houses"}
          </button>
        ))}
      </div>

      {view !== "houses" ? (
        <div>
          {sorted.map((entry, i) => {
            const isMe = entry.application_id === applicationId;
            const entryAccent = tierAccent(entry.tier);
            const value = view === "referrals" ? entry.successful_referrals : view === "score" ? entry.rank_points : entry.training_attendance;
            const valueLabel = view === "referrals" ? "referrals" : view === "score" ? "pts" : "sessions";
            return (
              <div key={entry.application_id} style={{ background: isMe ? `${accent}08` : CARD, border: `0.5px solid ${isMe ? accent : "rgba(176,142,80,0.08)"}`, borderRadius: 10, padding: "12px 14px", marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ color: i < 3 ? GOLD : GOLD_DIM, fontSize: "0.7rem", fontWeight: 700, fontFamily: "var(--font-jetbrains)", minWidth: 20 }}>
                  {i + 1}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                    <span style={{ fontSize: "0.7rem" }}>{TIER_ICONS[entry.tier]}</span>
                    <span style={{ color: isMe ? accent : GOLD, fontSize: "0.62rem", fontWeight: isMe ? 600 : 400 }}>{entry.display_name}</span>
                    {isMe && <Badge label="You" color={accent} small />}
                    {entry.ambassador_status === "active" && <Badge label="Ambassador" color={GOLD} small />}
                  </div>
                  <p style={{ color: GOLD_DIM, fontSize: "0.5rem", margin: 0 }}>{entry.current_rank} · {entry.region}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ color: entryAccent, fontSize: "0.8rem", fontWeight: 700, fontFamily: "var(--font-jetbrains)", margin: "0 0 1px" }}>{value}</p>
                  <p style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.46rem", margin: 0 }}>{valueLabel}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div>
          {db.houses.map((house, i) => {
            const healthColor = house.house_health_status === "strong" ? GREEN : house.house_health_status === "stable" ? GOLD : RED;
            return (
              <div key={house.house_id} style={{ background: CARD, border: "0.5px solid rgba(176,142,80,0.08)", borderRadius: 10, padding: "12px 14px", marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div>
                    <p style={{ color: GOLD, fontSize: "0.62rem", margin: "0 0 2px", fontWeight: 600 }}>{house.house_name}</p>
                    <p style={{ color: GOLD_DIM, fontSize: "0.52rem", margin: 0 }}>{house.region} · {house.active_member_count} active</p>
                  </div>
                  <Badge label={house.house_health_status.replace("_", " ")} color={healthColor} small />
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <span style={{ color: GOLD_DIM, fontSize: "0.52rem" }}>👑 {house.alii_count}</span>
                  <span style={{ color: GOLD_DIM, fontSize: "0.52rem" }}>🌀 {house.mana_count}</span>
                  <span style={{ color: GOLD_DIM, fontSize: "0.52rem" }}>⚔ {house.nakoa_count}</span>
                  <span style={{ color: GREEN, fontSize: "0.52rem", marginLeft: "auto" }}>{house.referral_count} referrals</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── TAB: PROFILE ──────────────────────────────────────────────

function TabProfile({ applicationId }: { applicationId: string }) {
  const { db, updateMemberPhone, updateMemberTelegram } = useStore();
  const membership = db.memberships.find(m => m.application_id === applicationId);
  const applicant = db.applicants.find(a => a.application_id === applicationId);
  if (!membership || !applicant) return null;

  const accent = tierAccent(membership.tier);
  const [editPhone, setEditPhone] = useState(false);
  const [editTg, setEditTg] = useState(false);
  const [phone, setPhone] = useState(membership.phone);
  const [tgHandle, setTgHandle] = useState(membership.telegram_handle);

  return (
    <div>
      <Panel accent={accent}>
        <SectionLabel>Identity</SectionLabel>
        <Row label="Full name" value={membership.full_name} />
        <Row label="Email" value={membership.email} />
        <Row label="ZIP / Region" value={`${applicant.zip_code} · ${membership.region}`} />
        <Row label="Tier" value={<span style={{ color: accent }}>{TIER_CONFIG[membership.tier].label}</span>} />
        <Row label="Chapter house" value={membership.chapter_house} />
        <Row label="Application ID" value={<span style={{ fontSize: "0.5rem", color: "rgba(176,142,80,0.3)" }}>{applicationId}</span>} />
      </Panel>

      {/* Editable: Phone */}
      <Panel>
        <SectionLabel>Phone</SectionLabel>
        {editPhone ? (
          <div>
            <input value={phone} onChange={e => setPhone(e.target.value)} style={{ width: "100%", background: "#030508", border: "1px solid rgba(176,142,80,0.2)", borderRadius: 6, padding: "10px 12px", fontSize: "0.65rem", color: GOLD, fontFamily: "var(--font-jetbrains)", outline: "none", boxSizing: "border-box", marginBottom: 8 }} />
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { updateMemberPhone(applicationId, phone); setEditPhone(false); }} style={{ flex: 1, background: `${GREEN}10`, border: `1px solid ${GREEN}22`, color: GREEN, padding: "9px", borderRadius: 6, cursor: "pointer", fontFamily: "var(--font-jetbrains)", fontSize: "0.55rem" }}>Save</button>
              <button onClick={() => setEditPhone(false)} style={{ flex: 1, background: "rgba(176,142,80,0.04)", border: "1px solid rgba(176,142,80,0.1)", color: GOLD_DIM, padding: "9px", borderRadius: 6, cursor: "pointer", fontFamily: "var(--font-jetbrains)", fontSize: "0.55rem" }}>Cancel</button>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: GOLD, fontSize: "0.62rem" }}>{membership.phone || "Not set"}</span>
            <button onClick={() => setEditPhone(true)} style={{ background: "none", border: "none", color: GOLD_DIM, cursor: "pointer", fontSize: "0.55rem", fontFamily: "var(--font-jetbrains)" }}>Edit</button>
          </div>
        )}
      </Panel>

      {/* Editable: Telegram */}
      <Panel>
        <SectionLabel>Telegram Handle</SectionLabel>
        {editTg ? (
          <div>
            <input value={tgHandle} onChange={e => setTgHandle(e.target.value)} placeholder="@handle" style={{ width: "100%", background: "#030508", border: "1px solid rgba(176,142,80,0.2)", borderRadius: 6, padding: "10px 12px", fontSize: "0.65rem", color: GOLD, fontFamily: "var(--font-jetbrains)", outline: "none", boxSizing: "border-box", marginBottom: 8 }} />
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { updateMemberTelegram(applicationId, tgHandle); setEditTg(false); }} style={{ flex: 1, background: `${GREEN}10`, border: `1px solid ${GREEN}22`, color: GREEN, padding: "9px", borderRadius: 6, cursor: "pointer", fontFamily: "var(--font-jetbrains)", fontSize: "0.55rem" }}>Save</button>
              <button onClick={() => setEditTg(false)} style={{ flex: 1, background: "rgba(176,142,80,0.04)", border: "1px solid rgba(176,142,80,0.1)", color: GOLD_DIM, padding: "9px", borderRadius: 6, cursor: "pointer", fontFamily: "var(--font-jetbrains)", fontSize: "0.55rem" }}>Cancel</button>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: BLUE, fontSize: "0.62rem" }}>{membership.telegram_handle || "Not set"}</span>
            <button onClick={() => setEditTg(true)} style={{ background: "none", border: "none", color: GOLD_DIM, cursor: "pointer", fontSize: "0.55rem", fontFamily: "var(--font-jetbrains)" }}>Edit</button>
          </div>
        )}
      </Panel>

      {/* Locked fields notice */}
      <p style={{ color: "rgba(176,142,80,0.2)", fontSize: "0.52rem", textAlign: "center", lineHeight: 1.6 }}>
        Tier and formation dates are locked.<br />
        Contact your chapter anchor for changes.
      </p>
    </div>
  );
}

// ── MAIN PORTAL ───────────────────────────────────────────────

type PortalTab = "home" | "events" | "path" | "referrals" | "house" | "leaderboard" | "profile";

interface MemberPortalProps {
  applicationId: string;
  onBack: () => void;
}

export default function MemberPortal({ applicationId, onBack }: MemberPortalProps) {
  const { db } = useStore();
  const [activeTab, setActiveTab] = useState<PortalTab>("home");

  const membership = db.memberships.find(m => m.application_id === applicationId);
  const applicant = db.applicants.find(a => a.application_id === applicationId);

  // Access gate
  if (!membership || !membership.deposit_paid || !["active", "invited"].includes(membership.membership_status)) {
    return (
      <div style={{ background: BG, minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "var(--font-jetbrains)" }}>
        <div style={{ textAlign: "center", maxWidth: 320 }}>
          <span style={{ fontSize: "2rem", display: "block", marginBottom: 16 }}>⚔</span>
          <h2 className="font-cormorant" style={{ fontStyle: "italic", color: GOLD, fontSize: "1.5rem", margin: "0 0 12px" }}>Formation Incomplete</h2>
          <p style={{ color: GOLD_DIM, fontSize: "0.6rem", lineHeight: 1.7, margin: "0 0 24px" }}>
            Complete your formation to access this portal.<br />
            Deposit payment required.
          </p>
          <button onClick={onBack} style={{ background: "none", border: "1px solid rgba(176,142,80,0.2)", color: GOLD_DIM, padding: "10px 20px", borderRadius: 8, cursor: "pointer", fontFamily: "var(--font-jetbrains)", fontSize: "0.58rem", letterSpacing: "0.12em" }}>
            ← Return
          </button>
        </div>
      </div>
    );
  }

  const cfg = TIER_CONFIG[membership.tier];
  const accent = tierAccent(membership.tier);

  const standingColor = membership.standing === "good" ? GREEN : membership.standing === "review" ? "#f0a030" : RED;
  const standingLabel = membership.standing === "good" ? "Good Standing" : membership.standing === "review" ? "Under Review" : "Suspended";

  const TABS: { key: PortalTab; label: string }[] = [
    { key: "home", label: "Home" },
    { key: "events", label: "Events" },
    { key: "path", label: "Path" },
    { key: "referrals", label: "Referrals" },
    { key: "house", label: "House" },
    { key: "leaderboard", label: "Standing" },
    { key: "profile", label: "Profile" },
  ];

  return (
    <div style={{ background: BG, minHeight: "100dvh", fontFamily: "var(--font-jetbrains)", overflowX: "hidden" }}>

      {/* Ambient glow */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", background: `radial-gradient(ellipse at 50% 0%, ${accent}06 0%, transparent 55%)` }} />

      {/* Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 40, background: "rgba(4,6,10,0.97)", backdropFilter: "blur(14px)", borderBottom: `1px solid ${accent}18` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px 0" }}>
          <button onClick={onBack} style={{ background: "none", border: "none", color: GOLD_DIM, cursor: "pointer", fontSize: "0.58rem", letterSpacing: "0.1em" }}>← EXIT</button>
          <div style={{ textAlign: "center" }}>
            <p className="font-cormorant" style={{ fontStyle: "italic", color: accent, fontSize: "1rem", margin: "0 0 1px" }}>{applicant?.full_name || membership.full_name}</p>
            <div style={{ display: "flex", gap: 5, justifyContent: "center", flexWrap: "wrap" }}>
              <Badge label={`${cfg.icon} ${cfg.label}`} color={accent} small />
              <Badge label={membership.region} color={GOLD_DIM} small />
              <Badge label={standingLabel} color={standingColor} small />
            </div>
          </div>
          <div style={{ width: 48 }} />
        </div>

        {/* Rank strip */}
        <div style={{ padding: "6px 16px 0", textAlign: "center" }}>
          <p style={{ color: `${accent}80`, fontSize: "0.48rem", letterSpacing: "0.15em", textTransform: "uppercase", margin: 0 }}>
            {membership.current_rank} · {membership.rank_points_total} pts
          </p>
        </div>

        {/* Tab nav */}
        <div style={{ display: "flex", overflowX: "auto", padding: "0 16px", marginTop: 6, borderTop: "0.5px solid rgba(176,142,80,0.06)" }}>
          {TABS.map(({ key, label }) => (
            <button key={key} onClick={() => setActiveTab(key)} style={{ background: "none", border: "none", cursor: "pointer", color: activeTab === key ? accent : "rgba(176,142,80,0.3)", fontFamily: "var(--font-jetbrains)", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "10px 10px 8px", borderBottom: activeTab === key ? `2px solid ${accent}` : "2px solid transparent", transition: "color 0.2s", whiteSpace: "nowrap" }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px 16px 48px", position: "relative", zIndex: 1 }}>
        {activeTab === "home" && <TabHome applicationId={applicationId} />}
        {activeTab === "events" && <TabEvents applicationId={applicationId} />}
        {activeTab === "path" && <TabPath applicationId={applicationId} />}
        {activeTab === "referrals" && <TabReferrals applicationId={applicationId} />}
        {activeTab === "house" && <TabHouse applicationId={applicationId} />}
        {activeTab === "leaderboard" && <TabLeaderboard applicationId={applicationId} />}
        {activeTab === "profile" && <TabProfile applicationId={applicationId} />}
      </div>
    </div>
  );
}
