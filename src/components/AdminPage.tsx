"use client";

import { useState } from "react";
import { useStore } from "@/lib/store-context";
import { TIER_CONFIG, SEAT_CAPS, getSeatInfo, STRIPE_LINKS, type Tier } from "@/lib/makoa";
import { type Applicant, type ReviewStatus } from "@/lib/db";
import MemberTimeline from "./MemberTimeline";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.35)";
const BLUE = "#58a6ff";
const GREEN = "#3fb950";
const RED = "#f85149";
const PURPLE = "#534AB7";
const BG = "#04060a";
const TIERS: Tier[] = ["alii", "mana", "nakoa"];

// ── BADGE COMPONENTS ──────────────────────────────────────────

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      color, background: `${color}15`, border: `1px solid ${color}33`,
      fontSize: "0.44rem", letterSpacing: "0.1em", textTransform: "uppercase",
      padding: "2px 7px", borderRadius: 3, fontFamily: "var(--font-jetbrains)", fontWeight: 700,
    }}>
      {label}
    </span>
  );
}

function reviewBadge(status: ReviewStatus) {
  const map = { pending: { label: "Pending Review", color: "#f0a030" }, accepted: { label: "Accepted", color: GREEN }, declined: { label: "Declined", color: RED }, waitlisted: { label: "Waitlisted", color: BLUE } };
  const s = map[status];
  return <Badge label={s.label} color={s.color} />;
}

// ── STAT CARD ─────────────────────────────────────────────────

function StatCard({ label, value, sub, color = GOLD }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div style={{ background: "#060810", border: "0.5px solid rgba(176,142,80,0.1)", borderRadius: 10, padding: "14px" }}>
      <p style={{ color: "rgba(176,142,80,0.35)", fontSize: "0.48rem", letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 5px" }}>{label}</p>
      <p style={{ color, fontSize: "1.5rem", fontWeight: 700, fontFamily: "var(--font-jetbrains)", margin: "0 0 2px", lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ color: "rgba(176,142,80,0.25)", fontSize: "0.5rem", margin: 0 }}>{sub}</p>}
    </div>
  );
}

// ── SEAT METER ────────────────────────────────────────────────

function SeatMeter({ tier, remaining, total, color }: { tier: Tier; remaining: number; total: number; color: string }) {
  const pct = Math.max(0, (remaining / total) * 100);
  const info = getSeatInfo(tier, remaining);
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ color: GOLD, fontSize: "0.62rem" }}>{TIER_CONFIG[tier].label}</span>
        <span style={{ color: info.urgencyColor, fontSize: "0.6rem" }}>{info.label}</span>
      </div>
      <div style={{ height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${100 - pct}%`, background: color, borderRadius: 3, transition: "width 0.5s" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
        <span style={{ color: "rgba(176,142,80,0.25)", fontSize: "0.48rem" }}>{total - remaining} claimed</span>
        <span style={{ color: "rgba(176,142,80,0.25)", fontSize: "0.48rem" }}>{remaining} of {total} remaining</span>
      </div>
    </div>
  );
}

// ── MEMBER ROW ────────────────────────────────────────────────

function MemberRow({ applicant, onSelect }: { applicant: Applicant; onSelect: () => void }) {
  const cfg = ["alii", "mana", "nakoa"].includes(applicant.tier_interest) ? TIER_CONFIG[applicant.tier_interest as Tier] : null;
  return (
    <button
      onClick={onSelect}
      style={{
        width: "100%", background: "#060810", border: "0.5px solid rgba(176,142,80,0.08)",
        borderRadius: 8, padding: "12px 14px", cursor: "pointer", textAlign: "left",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 8, transition: "border-color 0.2s",
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(176,142,80,0.25)")}
      onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(176,142,80,0.08)")}
    >
      <div>
        <p style={{ color: GOLD, fontSize: "0.65rem", margin: "0 0 3px", fontWeight: 600 }}>{applicant.full_name}</p>
        <p style={{ color: "rgba(176,142,80,0.35)", fontSize: "0.52rem", margin: "0 0 4px" }}>{applicant.email} · {applicant.region}</p>
        <div style={{ display: "flex", gap: 5 }}>
          {reviewBadge(applicant.review_status)}
          {cfg && <Badge label={cfg.label} color={cfg.color} />}
        </div>
      </div>
      <span style={{ color: GOLD_DIM, fontSize: "0.8rem" }}>›</span>
    </button>
  );
}

// ── MEMBER DETAIL PANEL ───────────────────────────────────────

function MemberDetail({ applicant, onClose }: { applicant: Applicant; onClose: () => void }) {
  const { db, acceptApplicant, declineApplicant, waitlistApplicant, getMemberTimeline } = useStore();
  const membership = db.memberships.find(m => m.application_id === applicant.application_id);
  const payments = db.payments.filter(p => p.application_id === applicant.application_id);
  const tgProfile = db.telegram_profiles.find(t => t.application_id === applicant.application_id);
  const timeline = getMemberTimeline(applicant.application_id);
  const [tierSelect, setTierSelect] = useState<Tier>(applicant.tier_interest as Tier || "nakoa");

  return (
    <div style={{ background: "#030508", border: "1px solid rgba(176,142,80,0.12)", borderRadius: 12, padding: "18px 16px", marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div>
          <h3 className="font-cormorant" style={{ fontStyle: "italic", color: GOLD, fontSize: "1.3rem", margin: "0 0 4px" }}>{applicant.full_name}</h3>
          <p style={{ color: GOLD_DIM, fontSize: "0.55rem", margin: "0 0 2px" }}>{applicant.email} · {applicant.phone}</p>
          <p style={{ color: "rgba(176,142,80,0.25)", fontSize: "0.5rem", margin: 0 }}>ID: {applicant.application_id}</p>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: GOLD_DIM, cursor: "pointer", fontSize: "1rem" }}>✕</button>
      </div>

      {/* Quick stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
        {[
          { label: "Region", value: applicant.region },
          { label: "ZIP", value: applicant.zip_code },
          { label: "Tier Interest", value: applicant.tier_interest },
        ].map(({ label, value }) => (
          <div key={label} style={{ background: "#060810", borderRadius: 6, padding: "8px 10px" }}>
            <p style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.46rem", margin: "0 0 3px", textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</p>
            <p style={{ color: GOLD, fontSize: "0.6rem", margin: 0 }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Answers */}
      <div style={{ background: "#060810", borderRadius: 8, padding: "10px 12px", marginBottom: 12 }}>
        <p style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.48rem", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>Application Answers</p>
        <p style={{ color: "rgba(176,142,80,0.55)", fontSize: "0.58rem", margin: "0 0 4px" }}>Brings: {applicant.value_brought}</p>
        <p style={{ color: "rgba(176,142,80,0.55)", fontSize: "0.58rem", margin: 0 }}>Challenge: {applicant.challenge_selected}</p>
      </div>

      {/* Payments */}
      {payments.length > 0 && (
        <div style={{ background: "#060810", borderRadius: 8, padding: "10px 12px", marginBottom: 12 }}>
          <p style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.48rem", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 8px" }}>Payments</p>
          {payments.map(p => (
            <div key={p.payment_id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ color: "rgba(176,142,80,0.5)", fontSize: "0.58rem" }}>{p.payment_type} · {p.stripe_payment_link_name}</span>
              <span style={{ color: p.payment_status === "paid" ? GREEN : RED, fontSize: "0.58rem", fontWeight: 600 }}>${p.amount} · {p.payment_status}</span>
            </div>
          ))}
        </div>
      )}

      {/* Membership */}
      {membership && (
        <div style={{ background: "#060810", borderRadius: 8, padding: "10px 12px", marginBottom: 12 }}>
          <p style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.48rem", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 8px" }}>Membership</p>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ color: "rgba(176,142,80,0.5)", fontSize: "0.58rem" }}>Status</span>
            <span style={{ color: GOLD, fontSize: "0.58rem" }}>{membership.membership_status}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ color: "rgba(176,142,80,0.5)", fontSize: "0.58rem" }}>Standing</span>
            <span style={{ color: membership.standing === "good" ? GREEN : RED, fontSize: "0.58rem" }}>{membership.standing}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "rgba(176,142,80,0.5)", fontSize: "0.58rem" }}>Quarterly events</span>
            <span style={{ color: GOLD, fontSize: "0.58rem" }}>{membership.quarterly_hotel_events_used}/{membership.quarterly_hotel_events_included_total} used</span>
          </div>
        </div>
      )}

      {/* Telegram */}
      {tgProfile && (
        <div style={{ background: "#060810", borderRadius: 8, padding: "10px 12px", marginBottom: 12 }}>
          <p style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.48rem", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 8px" }}>Telegram</p>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ color: "rgba(176,142,80,0.5)", fontSize: "0.58rem" }}>Handle</span>
            <span style={{ color: BLUE, fontSize: "0.58rem" }}>{tgProfile.telegram_handle}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ color: "rgba(176,142,80,0.5)", fontSize: "0.58rem" }}>Verified</span>
            <span style={{ color: tgProfile.payment_verified ? GREEN : RED, fontSize: "0.58rem" }}>{tgProfile.payment_verified ? "Yes" : "No"}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "rgba(176,142,80,0.5)", fontSize: "0.58rem" }}>Routed to</span>
            <span style={{ color: GOLD_DIM, fontSize: "0.55rem" }}>{tgProfile.routed_tier_group}</span>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div style={{ background: "#060810", borderRadius: 8, padding: "12px", marginBottom: 14 }}>
        <p style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.48rem", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 12px" }}>Formation Timeline</p>
        <MemberTimeline events={timeline} compact />
      </div>

      {/* Admin actions */}
      {applicant.review_status === "pending" && (
        <div>
          <p style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.48rem", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 8px" }}>Admin Actions</p>
          <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
            {TIERS.map(t => (
              <button key={t} onClick={() => setTierSelect(t)} style={{ flex: 1, background: tierSelect === t ? `${TIER_CONFIG[t].color}18` : "#060810", border: `1px solid ${tierSelect === t ? TIER_CONFIG[t].color : "rgba(176,142,80,0.1)"}`, color: tierSelect === t ? TIER_CONFIG[t].color : GOLD_DIM, padding: "7px 4px", borderRadius: 6, cursor: "pointer", fontFamily: "var(--font-jetbrains)", fontSize: "0.52rem" }}>
                {TIER_CONFIG[t].label}
              </button>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
            <button onClick={() => acceptApplicant(applicant.application_id, tierSelect)} style={{ background: `${GREEN}15`, border: `1px solid ${GREEN}33`, color: GREEN, padding: "9px", borderRadius: 6, cursor: "pointer", fontFamily: "var(--font-jetbrains)", fontSize: "0.52rem", letterSpacing: "0.08em" }}>
              ACCEPT
            </button>
            <button onClick={() => waitlistApplicant(applicant.application_id)} style={{ background: "rgba(88,166,255,0.08)", border: "1px solid rgba(88,166,255,0.2)", color: BLUE, padding: "9px", borderRadius: 6, cursor: "pointer", fontFamily: "var(--font-jetbrains)", fontSize: "0.52rem", letterSpacing: "0.08em" }}>
              WAITLIST
            </button>
            <button onClick={() => declineApplicant(applicant.application_id)} style={{ background: `${RED}08`, border: `1px solid ${RED}22`, color: RED, padding: "9px", borderRadius: 6, cursor: "pointer", fontFamily: "var(--font-jetbrains)", fontSize: "0.52rem", letterSpacing: "0.08em" }}>
              DECLINE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── MAIN ADMIN PAGE ───────────────────────────────────────────

interface AdminPageProps {
  onExit: () => void;
}

type AdminTab = "funnel" | "tiers" | "seats" | "payments" | "telegram" | "regions" | "events" | "members";

export default function AdminPage({ onExit }: AdminPageProps) {
  const { db, stats, seatsRemaining, setCounterMode, adjustSimulatedSeat } = useStore();
  const [activeTab, setActiveTab] = useState<AdminTab>("funnel");
  const [selectedMember, setSelectedMember] = useState<Applicant | null>(null);
  const [memberSearch, setMemberSearch] = useState("");

  const tabs: { key: AdminTab; label: string }[] = [
    { key: "funnel", label: "Funnel" },
    { key: "tiers", label: "Tiers" },
    { key: "seats", label: "Seats" },
    { key: "payments", label: "Payments" },
    { key: "telegram", label: "Telegram" },
    { key: "regions", label: "Regions" },
    { key: "events", label: "Events" },
    { key: "members", label: "Members" },
  ];

  const filteredMembers = db.applicants.filter(a =>
    !memberSearch || a.full_name.toLowerCase().includes(memberSearch.toLowerCase()) || a.email.toLowerCase().includes(memberSearch.toLowerCase())
  );

  return (
    <div style={{ background: BG, minHeight: "100dvh", fontFamily: "var(--font-jetbrains)", overflowX: "hidden" }}>

      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse at 50% 10%, rgba(83,74,183,0.06) 0%, transparent 60%)" }} />

      {/* Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 40, background: "rgba(4,6,10,0.97)", backdropFilter: "blur(14px)", borderBottom: "1px solid rgba(83,74,183,0.2)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", height: 48 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: PURPLE, boxShadow: `0 0 8px ${PURPLE}` }} />
          <span style={{ color: PURPLE, fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>XI Admin · Mākoa</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", gap: 4, background: "#060810", border: "0.5px solid rgba(176,142,80,0.1)", borderRadius: 6, padding: "3px" }}>
            {(["real", "simulated"] as const).map(m => (
              <button key={m} onClick={() => setCounterMode(m)} style={{ background: db.counterMode === m ? (m === "real" ? GREEN : PURPLE) : "transparent", color: db.counterMode === m ? "#000" : "rgba(176,142,80,0.3)", border: "none", padding: "4px 10px", borderRadius: 4, cursor: "pointer", fontFamily: "var(--font-jetbrains)", fontSize: "0.48rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, transition: "all 0.2s" }}>
                {m}
              </button>
            ))}
          </div>
          <button onClick={onExit} style={{ background: "none", border: "none", color: GOLD_DIM, cursor: "pointer", fontSize: "0.58rem", letterSpacing: "0.1em" }}>EXIT →</button>
        </div>
      </div>

      {/* Tab nav — scrollable */}
      <div style={{ display: "flex", borderBottom: "1px solid rgba(176,142,80,0.08)", padding: "0 16px", overflowX: "auto" }}>
        {tabs.map(({ key, label }) => (
          <button key={key} onClick={() => { setActiveTab(key); setSelectedMember(null); }} style={{ background: "none", border: "none", cursor: "pointer", color: activeTab === key ? GOLD : "rgba(176,142,80,0.3)", fontFamily: "var(--font-jetbrains)", fontSize: "0.52rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "12px 10px 10px", borderBottom: activeTab === key ? `2px solid ${GOLD}` : "2px solid transparent", transition: "color 0.2s", whiteSpace: "nowrap" }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px 16px 40px", position: "relative", zIndex: 1 }}>

        {/* ── FUNNEL TAB ── */}
        {activeTab === "funnel" && (
          <div>
            <p style={{ color: GOLD_DIM, fontSize: "0.52rem", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 14px" }}>Funnel Overview · {db.counterMode === "real" ? "Real Mode" : "Simulated Mode"}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              <StatCard label="Total Pledges" value={stats.totalPledges} sub="$9.99 processed" />
              <StatCard label="Pending Review" value={stats.pendingReview} sub="awaiting XI" color="#f0a030" />
              <StatCard label="Accepted" value={stats.accepted} sub="seat offer sent" color={GREEN} />
              <StatCard label="Deposits Paid" value={stats.depositsTotal} sub="seats secured" color={BLUE} />
              <StatCard label="Active Members" value={stats.activeMemberships} sub="in formation" color={GREEN} />
              <StatCard label="Delinquent" value={stats.delinquentMemberships} sub="payment issue" color={RED} />
            </div>

            {/* Revenue */}
            <div style={{ background: "#060810", border: "0.5px solid rgba(176,142,80,0.1)", borderRadius: 10, padding: "16px", marginBottom: 16 }}>
              <p style={{ color: GOLD_DIM, fontSize: "0.52rem", letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 12px" }}>Revenue</p>
              {[
                { label: "Pledge revenue", value: `$${(stats.totalPledges * 9.99).toFixed(2)}` },
                { label: "Deposit revenue", value: `$${stats.depositRevenue.toLocaleString()}` },
                { label: "Subscription revenue", value: `$${stats.subscriptionRevenue.toLocaleString()}` },
                { label: "Total collected", value: `$${(stats.totalPledges * 9.99 + stats.depositRevenue + stats.subscriptionRevenue).toLocaleString()}` },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ color: "rgba(176,142,80,0.5)", fontSize: "0.6rem" }}>{label}</span>
                  <span style={{ color: GOLD, fontSize: "0.6rem", fontWeight: 700 }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Activity log */}
            <div style={{ background: "#060810", border: "0.5px solid rgba(176,142,80,0.08)", borderRadius: 10, padding: "16px" }}>
              <p style={{ color: GOLD_DIM, fontSize: "0.52rem", letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 12px" }}>Recent Activity</p>
              {db.admin_activity_log.slice(-6).reverse().map(log => (
                <div key={log.log_id} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: "0.5px solid rgba(176,142,80,0.06)" }}>
                  <p style={{ color: GOLD, fontSize: "0.58rem", margin: "0 0 2px" }}>{log.action_summary}</p>
                  <p style={{ color: "rgba(176,142,80,0.25)", fontSize: "0.5rem", margin: 0 }}>{new Date(log.created_at).toLocaleString()}</p>
                </div>
              ))}
              {db.admin_activity_log.length === 0 && <p style={{ color: "rgba(176,142,80,0.2)", fontSize: "0.58rem" }}>No activity yet</p>}
            </div>
          </div>
        )}

        {/* ── TIERS TAB ── */}
        {activeTab === "tiers" && (
          <div>
            <p style={{ color: GOLD_DIM, fontSize: "0.52rem", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 14px" }}>Tier Breakdown</p>
            {TIERS.map(t => {
              const cfg = TIER_CONFIG[t];
              const b = stats.tierBreakdown[t];
              return (
                <div key={t} style={{ background: "#060810", border: `1px solid ${cfg.color}18`, borderRadius: 10, padding: "16px", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <span style={{ fontSize: "1rem" }}>{cfg.icon}</span>
                    <span className="font-cormorant" style={{ fontStyle: "italic", color: cfg.color, fontSize: "1.2rem" }}>{cfg.label}</span>
                    <span style={{ color: `${cfg.color}55`, fontSize: "0.52rem" }}>· {cfg.sub}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                    {[
                      { label: "Pending", value: b.pending, color: "#f0a030" },
                      { label: "Accepted", value: b.accepted, color: GREEN },
                      { label: "Deposit Paid", value: b.paid, color: cfg.color },
                    ].map(({ label, value, color }) => (
                      <div key={label} style={{ background: "#030508", borderRadius: 6, padding: "10px 8px", textAlign: "center" }}>
                        <p style={{ color, fontSize: "1.2rem", fontWeight: 700, margin: "0 0 3px", lineHeight: 1 }}>{value}</p>
                        <p style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.48rem", margin: 0, textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.52rem" }}>Deposit: ${cfg.deposit} · Monthly: ${cfg.monthly}/mo × {cfg.months}</span>
                    <span style={{ color: GOLD_DIM, fontSize: "0.52rem" }}>Total: ${cfg.total}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── SEATS TAB ── */}
        {activeTab === "seats" && (
          <div>
            <p style={{ color: GOLD_DIM, fontSize: "0.52rem", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 14px" }}>Seat Counter · {db.counterMode === "simulated" ? "Simulated" : "Real"} Mode</p>
            <div style={{ background: db.counterMode === "simulated" ? "rgba(83,74,183,0.06)" : "rgba(63,185,80,0.04)", border: `1px solid ${db.counterMode === "simulated" ? "rgba(83,74,183,0.2)" : "rgba(63,185,80,0.2)"}`, borderRadius: 10, padding: "12px 14px", marginBottom: 16 }}>
              <p style={{ color: db.counterMode === "simulated" ? PURPLE : GREEN, fontSize: "0.58rem", margin: "0 0 4px" }}>{db.counterMode === "simulated" ? "Simulated Mode" : "Real Mode"}</p>
              <p style={{ color: "rgba(176,142,80,0.35)", fontSize: "0.55rem", margin: 0, lineHeight: 1.6 }}>
                {db.counterMode === "real" ? "Seat counts reflect paid deposit payments only. Pledges do not decrement seats." : "Adjust counters manually. Switch to Real Mode to use live deposit data."}
              </p>
            </div>
            {TIERS.map(t => {
              const cfg = TIER_CONFIG[t];
              const rem = seatsRemaining[t];
              return (
                <div key={t} style={{ background: "#060810", border: `1px solid ${cfg.color}18`, borderRadius: 10, padding: "16px", marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: "1rem" }}>{cfg.icon}</span>
                      <span className="font-cormorant" style={{ fontStyle: "italic", color: cfg.color, fontSize: "1.2rem" }}>{cfg.label}</span>
                    </div>
                    <span style={{ color: getSeatInfo(t, rem).urgencyColor, fontSize: "0.58rem" }}>{getSeatInfo(t, rem).label}</span>
                  </div>
                  <SeatMeter tier={t} remaining={rem} total={SEAT_CAPS[t]} color={cfg.color} />
                  {db.counterMode === "simulated" && (
                    <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                      <button onClick={() => adjustSimulatedSeat(t, -1)} style={{ flex: 1, background: `${RED}10`, border: `1px solid ${RED}22`, color: RED, padding: "8px", borderRadius: 6, cursor: "pointer", fontFamily: "var(--font-jetbrains)", fontSize: "0.6rem" }}>− Claim</button>
                      <button onClick={() => adjustSimulatedSeat(t, 1)} style={{ flex: 1, background: `${GREEN}08`, border: `1px solid ${GREEN}22`, color: GREEN, padding: "8px", borderRadius: 6, cursor: "pointer", fontFamily: "var(--font-jetbrains)", fontSize: "0.6rem" }}>+ Release</button>
                    </div>
                  )}
                  <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "rgba(176,142,80,0.25)", fontSize: "0.5rem" }}>Deposit link</span>
                    <span style={{ color: "rgba(176,142,80,0.35)", fontSize: "0.5rem" }}>{cfg.depositLink.internalName}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── PAYMENTS TAB ── */}
        {activeTab === "payments" && (
          <div>
            <p style={{ color: GOLD_DIM, fontSize: "0.52rem", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 14px" }}>Payment Health</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              <StatCard label="Active Subscriptions" value={stats.activeSubscriptions} color={GREEN} />
              <StatCard label="Failed Payments" value={stats.failedPayments} color={RED} />
              <StatCard label="Delinquent Members" value={stats.delinquentMemberships} color={RED} />
              <StatCard label="Refunded" value={stats.refundedPayments} color="#f0a030" />
            </div>

            <div style={{ background: "#060810", border: "0.5px solid rgba(176,142,80,0.1)", borderRadius: 10, padding: "16px", marginBottom: 16 }}>
              <p style={{ color: GOLD_DIM, fontSize: "0.52rem", letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 12px" }}>Stripe Payment Links</p>
              {Object.entries(STRIPE_LINKS).map(([key, link]) => (
                <div key={key} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: "0.5px solid rgba(176,142,80,0.06)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ color: GOLD, fontSize: "0.6rem", fontWeight: 600 }}>{link.displayTitle}</span>
                    <span style={{ color: GOLD, fontSize: "0.6rem", fontWeight: 700 }}>${("amount" in link) ? link.amount : "—"}{"interval" in link && link.interval ? "/mo" : ""}</span>
                  </div>
                  <span style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.48rem" }}>{link.internalName}</span>
                </div>
              ))}
            </div>

            <div style={{ background: "rgba(83,74,183,0.06)", border: "1px solid rgba(83,74,183,0.2)", borderRadius: 10, padding: "14px" }}>
              <p style={{ color: PURPLE, fontSize: "0.58rem", margin: "0 0 6px" }}>To activate Stripe:</p>
              <p style={{ color: "rgba(176,142,80,0.35)", fontSize: "0.55rem", margin: 0, lineHeight: 1.7 }}>
                1. Create payment links in Stripe dashboard<br />
                2. Replace URLs in <code style={{ color: GOLD }}>src/lib/makoa.ts</code><br />
                3. Set redirect URLs to match redirectAfter values<br />
                4. Connect Stripe webhook → auto-sync seat counters
              </p>
            </div>
          </div>
        )}

        {/* ── TELEGRAM TAB ── */}
        {activeTab === "telegram" && (
          <div>
            <p style={{ color: GOLD_DIM, fontSize: "0.52rem", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 14px" }}>Telegram System</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
              <StatCard label="Unverified" value={stats.telegramUnverified} color={RED} />
              <StatCard label="Verified, Not Routed" value={stats.telegramVerifiedNotRouted} color="#f0a030" />
              <StatCard label="Incomplete Onboarding" value={stats.telegramRoutedIncomplete} color={BLUE} />
            </div>

            <div style={{ background: "#060810", border: "0.5px solid rgba(176,142,80,0.08)", borderRadius: 10, padding: "16px", marginBottom: 14 }}>
              <p style={{ color: GOLD_DIM, fontSize: "0.52rem", letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 12px" }}>Bot Entry Flow</p>
              {["Welcome message sent on join", "Bot asks: Enter email used during payment", "Bot matches against deposit record", "If match: reads tier, zip, name, application_id", "Bot sends placement: tier + region assignment", "Routes to tier group + regional cluster", "Final: formation channel open message"].map((text, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(176,142,80,0.08)", border: "0.5px solid rgba(176,142,80,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ color: GOLD_DIM, fontSize: "0.46rem" }}>{i + 1}</span>
                  </div>
                  <span style={{ color: "rgba(176,142,80,0.5)", fontSize: "0.6rem", lineHeight: 1.5 }}>{text}</span>
                </div>
              ))}
            </div>

            <div style={{ background: "#060810", border: "0.5px solid rgba(176,142,80,0.08)", borderRadius: 10, padding: "16px" }}>
              <p style={{ color: GOLD_DIM, fontSize: "0.52rem", letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 12px" }}>Admin Tagging Fields</p>
              {["telegram_handle", "full_name", "email", "tier", "zip_code", "region", "payment_verified", "routed_group", "onboarding_complete"].map(f => (
                <div key={f} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ color: "rgba(176,142,80,0.4)", fontSize: "0.58rem" }}>{f}</span>
                  <span style={{ color: "rgba(176,142,80,0.2)", fontSize: "0.52rem" }}>string</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── REGIONS TAB ── */}
        {activeTab === "regions" && (
          <div>
            <p style={{ color: GOLD_DIM, fontSize: "0.52rem", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 14px" }}>Regional Breakdown</p>
            {Object.entries(stats.regionBreakdown).map(([region, count]) => (
              <div key={region} style={{ background: "#060810", border: "0.5px solid rgba(176,142,80,0.08)", borderRadius: 8, padding: "12px 14px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ color: GOLD, fontSize: "0.65rem", margin: "0 0 2px" }}>{region}</p>
                  <p style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.52rem", margin: 0 }}>
                    {db.applicants.filter(a => a.region === region && a.review_status === "accepted").length} accepted · {db.memberships.filter(m => m.region === region).length} active
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 80, height: 4, background: "rgba(176,142,80,0.08)", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${count > 0 ? (count / Math.max(...Object.values(stats.regionBreakdown))) * 100 : 0}%`, background: GOLD, borderRadius: 2 }} />
                  </div>
                  <span style={{ color: GOLD, fontSize: "0.65rem", fontWeight: 700, minWidth: 20, textAlign: "right" }}>{count}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── EVENTS TAB ── */}
        {activeTab === "events" && (
          <div>
            <p style={{ color: GOLD_DIM, fontSize: "0.52rem", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 14px" }}>Event Usage</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              <StatCard label="Quarterly Used" value={`${stats.eventUsage.quarterlyUsed}/${stats.eventUsage.quarterlyIncluded}`} sub="included slots" color={GOLD} />
              <StatCard label="Active Members" value={stats.activeMemberships} sub="unlimited access" color={GREEN} />
            </div>
            {db.events.map(ev => (
              <div key={ev.event_id} style={{ background: "#060810", border: "0.5px solid rgba(176,142,80,0.08)", borderRadius: 10, padding: "14px", marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <div>
                    <p style={{ color: GOLD, fontSize: "0.65rem", margin: "0 0 2px", fontWeight: 600 }}>{ev.event_name}</p>
                    <p style={{ color: "rgba(176,142,80,0.35)", fontSize: "0.52rem", margin: 0 }}>{ev.start_date} · {ev.location_name}</p>
                  </div>
                  <Badge label={ev.status} color={ev.status === "open" ? GREEN : ev.status === "full" ? RED : GOLD_DIM} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                  <span style={{ color: "rgba(176,142,80,0.35)", fontSize: "0.55rem" }}>Capacity: {ev.capacity_remaining}/{ev.capacity_total}</span>
                  <span style={{ color: "rgba(176,142,80,0.35)", fontSize: "0.55rem" }}>Access: {ev.tier_access}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── MEMBERS TAB ── */}
        {activeTab === "members" && (
          <div>
            <p style={{ color: GOLD_DIM, fontSize: "0.52rem", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 10px" }}>
              Members · {db.applicants.length} total
            </p>

            {selectedMember ? (
              <MemberDetail applicant={selectedMember} onClose={() => setSelectedMember(null)} />
            ) : (
              <>
                <input
                  value={memberSearch}
                  onChange={e => setMemberSearch(e.target.value)}
                  placeholder="Search by name or email..."
                  style={{ width: "100%", background: "#060810", border: "0.5px solid rgba(176,142,80,0.15)", borderRadius: 8, padding: "10px 14px", fontSize: "0.62rem", color: GOLD, fontFamily: "var(--font-jetbrains)", outline: "none", boxSizing: "border-box", marginBottom: 14 }}
                />
                {filteredMembers.map(a => (
                  <MemberRow key={a.application_id} applicant={a} onSelect={() => setSelectedMember(a)} />
                ))}
                {filteredMembers.length === 0 && (
                  <p style={{ color: "rgba(176,142,80,0.25)", fontSize: "0.6rem", textAlign: "center", marginTop: 20 }}>No members found</p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
