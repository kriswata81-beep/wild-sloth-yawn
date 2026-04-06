"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import GatheringsCalendar from "@/components/GatheringsCalendar";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.5)";
const GOLD_FAINT = "rgba(176,142,80,0.08)";
const BLUE = "#58a6ff";
const STEEL = "#8b9aaa";

const TIER_CFG = {
  alii: { label: "Aliʻi", color: GOLD, colorDim: GOLD_DIM, colorFaint: GOLD_FAINT },
  mana: { label: "Mana", color: BLUE, colorDim: "rgba(88,166,255,0.5)", colorFaint: "rgba(88,166,255,0.06)" },
  nakoa: { label: "Nā Koa", color: STEEL, colorDim: "rgba(139,154,170,0.5)", colorFaint: "rgba(139,154,170,0.06)" },
};

const RANKS_BY_TIER: Record<string, string[]> = {
  nakoa: ["Nā Koa Candidate", "Nā Koa Active", "Nā Koa Sentinel", "Nā Koa Field Lead"],
  mana: ["Mana Builder", "Mana Operator", "Mana Strategist", "Mana Circle Lead"],
  alii: ["Aliʻi Seated", "Aliʻi Council", "Aliʻi Steward", "Aliʻi Chapter Anchor"],
};

const RANK_THRESHOLDS: Record<string, number> = {
  "Nā Koa Candidate": 0, "Nā Koa Active": 30, "Nā Koa Sentinel": 50, "Nā Koa Field Lead": 120,
  "Mana Builder": 0, "Mana Operator": 75, "Mana Strategist": 150, "Mana Circle Lead": 250,
  "Aliʻi Seated": 0, "Aliʻi Council": 100, "Aliʻi Steward": 200, "Aliʻi Chapter Anchor": 350,
};

const STANDING_COLOR: Record<string, string> = {
  good: "#3fb950", under_review: "#d29922", delinquent: "#f0883e", suspended: "#e05c5c",
};

const TABS = ["Home", "Events", "Path", "Referrals", "House", "Standing", "Profile"] as const;
type Tab = typeof TABS[number];

// DiceBear avatar URL from handle
function dicebearUrl(seed: string) {
  return `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(seed || "makoa")}`;
}

type Member = {
  id: string;
  application_id: string;
  full_name: string;
  email: string;
  phone: string;
  zip?: string;
  region: string;
  tier: string;
  membership_status: string;
  deposit_paid: boolean;
  standing: string;
  formation_start_date: string | null;
  formation_end_date: string | null;
  current_rank: string;
  rank_points_total: number;
  weekly_training_attendance_count: number;
  monthly_full_moon_attendance_count: number;
  quarterly_event_attendance_count: number;
  quarterly_hotel_events_used: number;
  service_actions_count: number;
  volunteer_hours: number;
  leadership_flags_count: number;
  eligible_for_review: boolean;
  telegram_handle: string | null;
  telegram_verified: boolean;
  telegram_group: string | null;
  referral_code: string | null;
  referrals_count: number;
  successful_referrals_count: number;
  ambassador_status: string;
  house_builder_status: boolean;
  chapter_anchor_status: boolean;
  house_id: string | null;
  monthly_plan_status: string;
  last_payment_date: string | null;
  next_due_date: string | null;
};

type MEvent = {
  id: string;
  event_name: string;
  event_type: string;
  event_date: string;
  event_end_date: string | null;
  location: string;
  description: string | null;
  tier_access: string[];
  capacity: number | null;
  seats_filled: number;
  status: string;
};

type House = {
  id: string;
  house_name: string;
  region: string;
  status: string;
  active_member_count: number;
  alii_count: number;
  mana_count: number;
  nakoa_count: number;
  house_health_status: string;
  payment_health_score: number;
  training_attendance_score: number;
  member_retention_rate: number;
};

interface MemberPortalProps {
  applicationId: string;
  onExit: () => void;
}

export default function MemberPortal({ applicationId, onExit }: MemberPortalProps) {
  const [member, setMember] = useState<Member | null>(null);
  const [events, setEvents] = useState<MEvent[]>([]);
  const [house, setHouse] = useState<House | null>(null);
  const [reservations, setReservations] = useState<string[]>([]);
  const [leaderboard, setLeaderboard] = useState<Member[]>([]);
  const [tab, setTab] = useState<Tab>("Home");
  const [loading, setLoading] = useState(true);
  const [notEligible, setNotEligible] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    const { data: m } = await supabase
      .from("applicants")
      .select("*")
      .eq("application_id", applicationId)
      .single();

    if (!m || !m.deposit_paid || !["active", "invited"].includes(m.membership_status)) {
      setNotEligible(true);
      setLoading(false);
      return;
    }

    setMember(m as Member);

    const [{ data: evs }, { data: res }, { data: lb }] = await Promise.all([
      supabase.from("events").select("*").eq("status", "upcoming").order("event_date"),
      supabase.from("event_reservations").select("event_id").eq("application_id", applicationId),
      supabase.from("applicants").select("*").in("membership_status", ["active", "invited"]).order("rank_points_total", { ascending: false }).limit(20),
    ]);

    setEvents((evs as MEvent[]) || []);
    setReservations((res || []).map((r: { event_id: string }) => r.event_id));
    setLeaderboard((lb as Member[]) || []);

    if (m.house_id) {
      const { data: h } = await supabase.from("makoa_houses").select("*").eq("id", m.house_id).single();
      if (h) setHouse(h as House);
    }

    setLoading(false);
  }, [applicationId]);

  useEffect(() => { loadData(); }, [loadData]);

  async function reserveEvent(ev: MEvent) {
    if (!member) return;
    await supabase.from("event_reservations").insert({
      application_id: applicationId,
      event_id: ev.id,
      status: "reserved",
    });
    await supabase.from("events").update({ seats_filled: ev.seats_filled + 1 }).eq("id", ev.id);
    if (ev.event_type === "quarterly_summit") {
      await supabase.from("applicants").update({
        quarterly_hotel_events_used: (member.quarterly_hotel_events_used || 0) + 1,
      }).eq("application_id", applicationId);
    }
    await loadData();
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#050709", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "32px", height: "32px", border: `1px solid ${GOLD}`, borderTop: "1px solid transparent", borderRadius: "50%", margin: "0 auto 12px", animation: "spin 1s linear infinite" }} />
          <p style={{ color: GOLD_DIM, fontSize: "0.5rem", letterSpacing: "0.2em" }}>Loading your standing...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (notEligible || !member) {
    return (
      <div style={{ minHeight: "100vh", background: "#050709", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px", textAlign: "center", fontFamily: "'JetBrains Mono', monospace" }}>
        <p className="font-cormorant" style={{ color: GOLD, fontSize: "1.8rem", fontWeight: 300, marginBottom: "16px" }}>Formation Incomplete</p>
        <p style={{ color: "rgba(232,224,208,0.45)", fontSize: "0.58rem", lineHeight: 1.9, maxWidth: "280px", marginBottom: "24px" }}>
          Complete your formation to access this portal. Your deposit must be confirmed and membership activated.
        </p>
        <button onClick={onExit} style={{ background: "transparent", border: `1px solid ${GOLD_DIM}`, color: GOLD_DIM, fontSize: "0.5rem", padding: "10px 20px", borderRadius: "4px", cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.15em" }}>
          Return to Gate
        </button>
      </div>
    );
  }

  const cfg = TIER_CFG[member.tier as keyof typeof TIER_CFG] || TIER_CFG.nakoa;
  const tierRanks = RANKS_BY_TIER[member.tier] || RANKS_BY_TIER.nakoa;
  const rankIdx = tierRanks.indexOf(member.current_rank);
  const nextRank = rankIdx < tierRanks.length - 1 ? tierRanks[rankIdx + 1] : null;
  const currentThreshold = RANK_THRESHOLDS[member.current_rank] || 0;
  const nextThreshold = nextRank ? RANK_THRESHOLDS[nextRank] || 0 : currentThreshold;
  const rankPct = nextRank
    ? Math.min(100, Math.round(((member.rank_points_total - currentThreshold) / (nextThreshold - currentThreshold)) * 100))
    : 100;

  // Formation progress
  const formStart = member.formation_start_date ? new Date(member.formation_start_date) : null;
  const formEnd = member.formation_end_date
    ? new Date(member.formation_end_date)
    : formStart ? new Date(formStart.getTime() + 18 * 30 * 24 * 60 * 60 * 1000) : null;
  const now = new Date();
  const monthsCompleted = formStart ? Math.max(0, Math.floor((now.getTime() - formStart.getTime()) / (30 * 24 * 60 * 60 * 1000))) : 0;
  const formPct = formStart && formEnd ? Math.min(100, Math.round((monthsCompleted / 18) * 100)) : 0;

  // Quarterly limit
  const quarterlyLimit = member.tier === "alii" ? 4 : member.tier === "mana" ? 2 : 0;
  const quarterlyUsed = member.quarterly_hotel_events_used || 0;
  const quarterlyRemaining = Math.max(0, quarterlyLimit - quarterlyUsed);

  // Referral badges
  const refBadges = [
    { label: "Signal Carrier", threshold: 1, desc: "1 successful referral" },
    { label: "Gate Opener", threshold: 3, desc: "3 successful referrals" },
    { label: "House Builder", threshold: 10, desc: "10 active converted members" },
    { label: "Chapter Anchor", threshold: 999, desc: "Admin-assigned" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#050709", color: "#e8e0d0", fontFamily: "'JetBrains Mono', monospace" }}>
      {/* Header */}
      <div style={{
        borderBottom: "1px solid rgba(176,142,80,0.1)",
        padding: "14px 20px",
        position: "sticky",
        top: 0,
        background: "#050709",
        zIndex: 10,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
          <p className="font-cormorant" style={{ color: GOLD, fontSize: "1rem", letterSpacing: "0.15em" }}>MĀKOA</p>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <span style={{
              background: cfg.colorFaint,
              border: `1px solid ${cfg.colorDim}`,
              color: cfg.color,
              fontSize: "0.42rem",
              padding: "3px 8px",
              borderRadius: "3px",
              letterSpacing: "0.1em",
            }}>{cfg.label}</span>
            <span style={{
              color: STANDING_COLOR[member.standing] || GOLD_DIM,
              fontSize: "0.42rem",
              letterSpacing: "0.08em",
            }}>{member.standing === "good" ? "Good Standing" : member.standing.replace("_", " ").toUpperCase()}</span>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img
              src={dicebearUrl(member.telegram_handle || member.full_name)}
              alt="avatar"
              style={{ width: "36px", height: "36px", borderRadius: "50%", border: `1px solid ${cfg.colorDim}`, background: "#0a0d12" }}
            />
            <div>
              <p style={{ color: "#e8e0d0", fontSize: "0.65rem" }}>{member.telegram_handle || member.full_name.split(" ")[0]}</p>
              <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.45rem" }}>{member.current_rank} · {member.region}</p>
            </div>
          </div>
          <button onClick={onExit} style={{ background: "none", border: "none", color: "rgba(232,224,208,0.2)", cursor: "pointer", fontSize: "0.45rem" }}>Exit</button>
        </div>
      </div>

      {/* Tab nav */}
      <div style={{ display: "flex", overflowX: "auto", borderBottom: "1px solid rgba(176,142,80,0.08)", padding: "0 16px" }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            background: "none",
            border: "none",
            borderBottom: `2px solid ${tab === t ? cfg.color : "transparent"}`,
            color: tab === t ? cfg.color : "rgba(232,224,208,0.3)",
            cursor: "pointer",
            fontSize: "0.45rem",
            letterSpacing: "0.12em",
            padding: "10px 12px",
            whiteSpace: "nowrap",
            fontFamily: "'JetBrains Mono', monospace",
            transition: "color 0.2s",
          }}>{t.toUpperCase()}</button>
        ))}
      </div>

      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "20px 16px 80px" }}>

        {/* HOME TAB */}
        {tab === "Home" && (
          <div style={{ display: "grid", gap: "12px", animation: "fadeUp 0.5s ease forwards" }}>

            {/* Formation progress */}
            <Panel title="Formation Status" accent={cfg.color}>
              {formStart ? (
                <>
                  <Row label="Started" value={formStart.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} />
                  <Row label="Completes" value={formEnd ? formEnd.toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "—"} />
                  <Row label="Months Completed" value={`${monthsCompleted} of 18`} />
                  <div style={{ marginTop: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.45rem" }}>Formation Progress</span>
                      <span style={{ color: cfg.color, fontSize: "0.5rem" }}>{formPct}%</span>
                    </div>
                    <ProgressBar pct={formPct} color={cfg.color} />
                  </div>
                </>
              ) : (
                <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.52rem" }}>Formation begins upon deposit confirmation.</p>
              )}
            </Panel>

            {/* Payment status */}
            <Panel title="Payment Status" accent={cfg.color}>
              <Row label="Deposit" value={member.deposit_paid ? "Paid" : "Not Paid"} valueColor={member.deposit_paid ? "#3fb950" : "#e05c5c"} />
              <Row label="Monthly Plan" value={member.monthly_plan_status || "—"} valueColor={member.monthly_plan_status === "active" ? "#3fb950" : member.monthly_plan_status === "failed" ? "#e05c5c" : GOLD_DIM} />
              {member.last_payment_date && <Row label="Last Payment" value={member.last_payment_date} />}
              {member.next_due_date && <Row label="Next Due" value={member.next_due_date} />}
            </Panel>

            {/* Event access */}
            <Panel title="Event Access" accent={cfg.color}>
              <Row label="Founding 72 — May 1" value="Included" valueColor="#3fb950" />
              <Row label="Monthly Full Moon" value="Unlimited" valueColor="#3fb950" />
              <Row label="Weekly Training" value="Unlimited" valueColor="#3fb950" />
              {member.tier !== "nakoa" ? (
                <Row
                  label="Quarterly Summits"
                  value={`${quarterlyRemaining} remaining of ${quarterlyLimit}`}
                  valueColor={quarterlyRemaining > 0 ? "#3fb950" : "#f0883e"}
                />
              ) : (
                <Row label="Quarterly Summits" value="Upgrade Required" valueColor={GOLD_DIM} />
              )}
            </Panel>

            {/* Telegram */}
            <Panel title="Telegram Status" accent={cfg.color}>
              <Row label="Verified" value={member.telegram_verified ? "Yes" : "No"} valueColor={member.telegram_verified ? "#3fb950" : "#e05c5c"} />
              {member.telegram_handle && <Row label="Handle" value={member.telegram_handle} />}
              {member.telegram_group && <Row label="Group" value={member.telegram_group} />}
              {!member.telegram_verified && (
                <a
                  href="https://t.me/makoa_order"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "block",
                    marginTop: "10px",
                    padding: "9px",
                    border: `1px solid ${cfg.colorDim}`,
                    color: cfg.color,
                    fontSize: "0.48rem",
                    letterSpacing: "0.15em",
                    textAlign: "center",
                    borderRadius: "4px",
                    textDecoration: "none",
                  }}
                >
                  Join / Reconnect Telegram
                </a>
              )}
            </Panel>

            {/* Timeline */}
            <Panel title="Your Timeline" accent={cfg.color}>
              {[
                { label: "Pledge Submitted", done: true },
                { label: "Accepted", done: member.membership_status === "active" || member.membership_status === "invited" },
                { label: "Deposit Paid", done: member.deposit_paid },
                { label: "Entered Formation", done: !!formStart },
                { label: "First 72 Attended", done: member.quarterly_event_attendance_count > 0 || member.monthly_full_moon_attendance_count > 0 },
                { label: "Monthly Participation", done: member.monthly_full_moon_attendance_count >= 3 },
                { label: "Quarterly Summit", done: member.quarterly_event_attendance_count > 0 },
                { label: "Formation Complete (18 mo)", done: formPct >= 100 },
              ].map((step, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                  <div style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    border: `1px solid ${step.done ? cfg.color : "rgba(255,255,255,0.1)"}`,
                    background: step.done ? cfg.colorFaint : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    {step.done && <span style={{ color: cfg.color, fontSize: "0.5rem" }}>✓</span>}
                  </div>
                  <span style={{ color: step.done ? "#e8e0d0" : "rgba(232,224,208,0.3)", fontSize: "0.52rem" }}>{step.label}</span>
                </div>
              ))}
            </Panel>
          </div>
        )}

        {/* EVENTS TAB */}
        {tab === "Events" && (
          <div style={{ animation: "fadeUp 0.5s ease forwards" }}>
            {/* Gatherings Calendar — 4 gathering types */}
            <GatheringsCalendar memberTier={member.tier} />

            {/* Supabase-scheduled events (if any) */}
            {events.length > 0 && (
              <div style={{ marginTop: "28px" }}>
                <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.2em", marginBottom: "14px" }}>
                  SCHEDULED EVENTS
                </p>
                <div style={{ display: "grid", gap: "10px" }}>
                  {events.map(ev => {
                    const isReserved = reservations.includes(ev.id);
                    const tierIncluded = ev.tier_access?.includes(member.tier);
                    const isQuarterly = ev.event_type === "quarterly_summit";
                    const quarterlyFull = isQuarterly && quarterlyRemaining <= 0;
                    const capacityFull = ev.capacity !== null && ev.seats_filled >= ev.capacity;

                    let ctaLabel = "Reserve Spot";
                    let ctaColor = cfg.color;
                    let ctaDisabled = false;

                    if (isReserved) { ctaLabel = "Reserved ✓"; ctaColor = "#3fb950"; ctaDisabled = true; }
                    else if (!tierIncluded) { ctaLabel = "Unlock Access"; ctaColor = GOLD_DIM; ctaDisabled = true; }
                    else if (quarterlyFull) { ctaLabel = "Upgrade Required"; ctaColor = "#f0883e"; ctaDisabled = true; }
                    else if (capacityFull) { ctaLabel = "At Capacity"; ctaColor = "#e05c5c"; ctaDisabled = true; }

                    return (
                      <div key={ev.id} style={{
                        background: GOLD_FAINT,
                        border: `1px solid ${isReserved ? cfg.colorDim : "rgba(176,142,80,0.1)"}`,
                        borderRadius: "8px",
                        padding: "16px",
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                          <p style={{ color: "#e8e0d0", fontSize: "0.62rem" }}>{ev.event_name}</p>
                          <span style={{ color: cfg.color, fontSize: "0.42rem", letterSpacing: "0.08em" }}>
                            {ev.event_type.replace(/_/g, " ").toUpperCase()}
                          </span>
                        </div>
                        <p style={{ color: GOLD_DIM, fontSize: "0.5rem", marginBottom: "2px" }}>{ev.event_date}{ev.event_end_date ? ` – ${ev.event_end_date}` : ""}</p>
                        <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.48rem", marginBottom: "8px" }}>{ev.location}</p>
                        {ev.capacity && (
                          <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.45rem", marginBottom: "8px" }}>
                            {ev.capacity - ev.seats_filled} of {ev.capacity} seats open
                          </p>
                        )}
                        <button
                          disabled={ctaDisabled}
                          onClick={() => !ctaDisabled && reserveEvent(ev)}
                          style={{
                            width: "100%",
                            padding: "9px",
                            background: "transparent",
                            border: `1px solid ${ctaColor}40`,
                            color: ctaColor,
                            fontSize: "0.48rem",
                            letterSpacing: "0.15em",
                            cursor: ctaDisabled ? "default" : "pointer",
                            borderRadius: "4px",
                            fontFamily: "'JetBrains Mono', monospace",
                          }}
                        >
                          {ctaLabel}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* PATH TAB */}
        {tab === "Path" && (
          <div style={{ animation: "fadeUp 0.5s ease forwards" }}>
            <Panel title="Your Path" accent={cfg.color}>
              <div style={{ textAlign: "center", padding: "8px 0 16px" }}>
                <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.45rem", letterSpacing: "0.15em", marginBottom: "6px" }}>CURRENT RANK</p>
                <p className="font-cormorant" style={{ color: cfg.color, fontSize: "1.5rem", fontStyle: "italic", marginBottom: "4px" }}>{member.current_rank}</p>
                <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.48rem" }}>{cfg.label} · {member.region}</p>
              </div>

              {nextRank && (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.45rem" }}>Path to {nextRank}</span>
                    <span style={{ color: cfg.color, fontSize: "0.5rem" }}>{rankPct}%</span>
                  </div>
                  <ProgressBar pct={rankPct} color={cfg.color} />
                  <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.45rem", marginTop: "6px" }}>
                    {Math.max(0, nextThreshold - member.rank_points_total)} formation score points remaining
                  </p>
                </>
              )}
            </Panel>

            <Panel title="Formation Score" accent={cfg.color}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.52rem" }}>Total Score</span>
                <span style={{ color: cfg.color, fontSize: "1.2rem", fontWeight: 500 }}>{member.rank_points_total}</span>
              </div>
              {[
                { label: "Weekly trainings", value: member.weekly_training_attendance_count, pts: "5 pts each" },
                { label: "Full moon gatherings", value: member.monthly_full_moon_attendance_count, pts: "15 pts each" },
                { label: "Quarterly summits", value: member.quarterly_event_attendance_count, pts: "25 pts each" },
                { label: "Successful referrals", value: member.successful_referrals_count, pts: "20 pts each" },
                { label: "Service actions", value: member.service_actions_count, pts: "10 pts each" },
                { label: "Volunteer hours", value: member.volunteer_hours, pts: "tracked" },
                { label: "Leadership flags", value: member.leadership_flags_count, pts: "15 pts each" },
              ].map(s => (
                <div key={s.label} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid rgba(176,142,80,0.06)" }}>
                  <span style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.48rem" }}>{s.label}</span>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ color: "#e8e0d0", fontSize: "0.5rem" }}>{s.value}</span>
                    <span style={{ color: "rgba(232,224,208,0.25)", fontSize: "0.42rem", marginLeft: "6px" }}>{s.pts}</span>
                  </div>
                </div>
              ))}
            </Panel>

            {/* Rank ladder */}
            <Panel title="Rank Ladder" accent={cfg.color}>
              {tierRanks.map((rank, i) => {
                const isCurrentRank = rank === member.current_rank;
                const isPast = i < rankIdx;
                return (
                  <div key={rank} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 0",
                    borderBottom: i < tierRanks.length - 1 ? "1px solid rgba(176,142,80,0.06)" : "none",
                  }}>
                    <div style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      border: `1px solid ${isCurrentRank ? cfg.color : isPast ? cfg.colorDim : "rgba(255,255,255,0.08)"}`,
                      background: isCurrentRank ? cfg.colorFaint : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      {isPast && <span style={{ color: cfg.colorDim, fontSize: "0.5rem" }}>✓</span>}
                      {isCurrentRank && <span style={{ color: cfg.color, fontSize: "0.5rem" }}>◆</span>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ color: isCurrentRank ? "#e8e0d0" : isPast ? "rgba(232,224,208,0.4)" : "rgba(232,224,208,0.2)", fontSize: "0.52rem" }}>{rank}</p>
                      <p style={{ color: "rgba(232,224,208,0.2)", fontSize: "0.42rem" }}>{RANK_THRESHOLDS[rank]} pts required</p>
                    </div>
                    {isCurrentRank && <span style={{ color: cfg.color, fontSize: "0.42rem", letterSpacing: "0.1em" }}>CURRENT</span>}
                  </div>
                );
              })}
            </Panel>

            <div style={{ padding: "16px", textAlign: "center" }}>
              <p style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.5rem", fontStyle: "italic", lineHeight: 1.8 }}>
                &ldquo;Advancement is earned through standing, service, and repetition.&rdquo;
              </p>
            </div>
          </div>
        )}

        {/* REFERRALS TAB */}
        {tab === "Referrals" && (
          <div style={{ animation: "fadeUp 0.5s ease forwards" }}>
            <Panel title="Your Signal" accent={cfg.color}>
              <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.5rem", lineHeight: 1.7, marginBottom: "14px" }}>
                Carry the signal. Open the gate. Build the house.
              </p>
              <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: "6px", padding: "14px", marginBottom: "12px", textAlign: "center" }}>
                <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.45rem", letterSpacing: "0.15em", marginBottom: "6px" }}>YOUR REFERRAL CODE</p>
                <p style={{ color: cfg.color, fontSize: "1.1rem", letterSpacing: "0.2em", fontWeight: 500 }}>{member.referral_code || "—"}</p>
              </div>
              {member.referral_code && (
                <button
                  onClick={() => {
                    const link = `${window.location.origin}?ref=${member.referral_code}`;
                    navigator.clipboard.writeText(link).catch(() => {});
                  }}
                  style={{
                    width: "100%",
                    padding: "9px",
                    background: "transparent",
                    border: `1px solid ${cfg.colorDim}`,
                    color: cfg.color,
                    fontSize: "0.48rem",
                    letterSpacing: "0.15em",
                    cursor: "pointer",
                    borderRadius: "4px",
                    fontFamily: "'JetBrains Mono', monospace",
                    marginBottom: "14px",
                  }}
                >
                  Copy Referral Link
                </button>
              )}
              <Row label="Total Referred" value={String(member.referrals_count)} />
              <Row label="Converted Members" value={String(member.successful_referrals_count)} valueColor={member.successful_referrals_count > 0 ? "#3fb950" : undefined} />
              <Row label="Ambassador Status" value={member.ambassador_status === "active" ? "Active Ambassador" : member.ambassador_status === "none" ? "Not Yet" : member.ambassador_status} valueColor={member.ambassador_status === "active" ? "#3fb950" : undefined} />
            </Panel>

            <Panel title="Recognition" accent={cfg.color}>
              <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.48rem", marginBottom: "14px" }}>Recognition follows action.</p>
              {refBadges.map(badge => {
                const earned = badge.label === "Chapter Anchor"
                  ? member.chapter_anchor_status
                  : badge.label === "House Builder"
                  ? member.house_builder_status
                  : member.successful_referrals_count >= badge.threshold;
                return (
                  <div key={badge.label} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px 0",
                    borderBottom: "1px solid rgba(176,142,80,0.06)",
                    opacity: earned ? 1 : 0.4,
                  }}>
                    <div style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      border: `1px solid ${earned ? cfg.color : "rgba(255,255,255,0.1)"}`,
                      background: earned ? cfg.colorFaint : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <span style={{ color: earned ? cfg.color : "rgba(255,255,255,0.2)", fontSize: "0.7rem" }}>
                        {earned ? "✦" : "○"}
                      </span>
                    </div>
                    <div>
                      <p style={{ color: earned ? "#e8e0d0" : "rgba(232,224,208,0.4)", fontSize: "0.55rem" }}>{badge.label}</p>
                      <p style={{ color: "rgba(232,224,208,0.25)", fontSize: "0.42rem" }}>{badge.desc}</p>
                    </div>
                    {earned && <span style={{ color: cfg.color, fontSize: "0.42rem", marginLeft: "auto" }}>EARNED</span>}
                  </div>
                );
              })}
            </Panel>
          </div>
        )}

        {/* HOUSE TAB */}
        {tab === "House" && (
          <div style={{ animation: "fadeUp 0.5s ease forwards" }}>
            {house ? (
              <>
                <Panel title="Your House" accent={cfg.color}>
                  <p className="font-cormorant" style={{ color: cfg.color, fontSize: "1.3rem", fontStyle: "italic", marginBottom: "4px" }}>{house.house_name}</p>
                  <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.5rem", marginBottom: "14px" }}>{house.region} · {house.status.toUpperCase()}</p>
                  <Row label="Active Members" value={String(house.active_member_count)} />
                  <Row label="Aliʻi" value={String(house.alii_count)} valueColor={GOLD} />
                  <Row label="Mana" value={String(house.mana_count)} valueColor={BLUE} />
                  <Row label="Nā Koa" value={String(house.nakoa_count)} valueColor={STEEL} />
                  <div style={{ marginTop: "12px" }}>
                    <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.45rem", marginBottom: "8px" }}>House Health</p>
                    {[
                      { label: "Payment Health", value: house.payment_health_score },
                      { label: "Training Attendance", value: house.training_attendance_score },
                      { label: "Member Retention", value: house.member_retention_rate },
                    ].map(s => (
                      <div key={s.label} style={{ marginBottom: "8px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                          <span style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.45rem" }}>{s.label}</span>
                          <span style={{ color: cfg.color, fontSize: "0.48rem" }}>{s.value}%</span>
                        </div>
                        <ProgressBar pct={s.value} color={cfg.color} />
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: "12px", padding: "10px", background: "rgba(0,0,0,0.2)", borderRadius: "4px", textAlign: "center" }}>
                    <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.45rem", letterSpacing: "0.1em" }}>HOUSE STATUS</p>
                    <p style={{
                      color: house.house_health_status === "strong" ? "#3fb950" : house.house_health_status === "stable" ? BLUE : house.house_health_status === "at_risk" ? "#e05c5c" : GOLD_DIM,
                      fontSize: "0.7rem",
                      marginTop: "4px",
                      letterSpacing: "0.1em",
                    }}>{house.house_health_status.toUpperCase()}</p>
                  </div>
                </Panel>
                <div style={{ padding: "16px", textAlign: "center" }}>
                  <p style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.5rem", fontStyle: "italic", lineHeight: 1.8 }}>
                    &ldquo;A strong house holds its line.&rdquo;
                  </p>
                </div>
              </>
            ) : (
              <Panel title="Your House" accent={cfg.color}>
                <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.52rem", lineHeight: 1.7 }}>
                  You have not been assigned to a house yet. XI will place you in the nearest active zone based on your region.
                </p>
                <p style={{ color: "rgba(232,224,208,0.25)", fontSize: "0.48rem", marginTop: "10px" }}>Region: {member.region}</p>
              </Panel>
            )}
          </div>
        )}

        {/* STANDING / LEADERBOARD TAB */}
        {tab === "Standing" && (
          <div style={{ animation: "fadeUp 0.5s ease forwards" }}>
            <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.5rem", lineHeight: 1.7, marginBottom: "16px" }}>
              The Order watches consistency. Your path is measured by presence.
            </p>

            <Panel title="Formation Score — Top Members" accent={cfg.color}>
              {leaderboard.slice(0, 10).map((m, i) => {
                const isMe = m.application_id === applicationId;
                const mCfg = TIER_CFG[m.tier as keyof typeof TIER_CFG] || TIER_CFG.nakoa;
                const displayHandle = m.telegram_handle || m.full_name.split(" ")[0];
                return (
                  <div key={m.id} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 0",
                    borderBottom: i < 9 ? "1px solid rgba(176,142,80,0.06)" : "none",
                    background: isMe ? "rgba(176,142,80,0.04)" : "transparent",
                    borderRadius: isMe ? "4px" : "0",
                    paddingLeft: isMe ? "6px" : "0",
                  }}>
                    <span style={{ color: i < 3 ? GOLD : "rgba(232,224,208,0.25)", fontSize: "0.55rem", width: "20px", textAlign: "center" }}>
                      {i + 1}
                    </span>
                    <img
                      src={dicebearUrl(m.telegram_handle || m.full_name)}
                      alt={displayHandle}
                      style={{ width: "28px", height: "28px", borderRadius: "50%", border: `1px solid ${mCfg.colorDim}`, background: "#0a0d12", flexShrink: 0 }}
                    />
                    <div style={{ flex: 1 }}>
                      <p style={{ color: isMe ? "#e8e0d0" : "rgba(232,224,208,0.6)", fontSize: "0.52rem" }}>
                        {displayHandle}
                        {isMe && <span style={{ color: cfg.color, fontSize: "0.4rem", marginLeft: "6px" }}>YOU</span>}
                      </p>
                      <p style={{ color: mCfg.colorDim, fontSize: "0.42rem" }}>{m.current_rank}</p>
                    </div>
                    <span style={{ color: mCfg.color, fontSize: "0.55rem", fontWeight: 500 }}>{m.rank_points_total}</span>
                  </div>
                );
              })}
            </Panel>

            <Panel title="Top Referrers" accent={cfg.color}>
              {[...leaderboard].sort((a, b) => b.successful_referrals_count - a.successful_referrals_count).slice(0, 5).map((m, i) => {
                const isMe = m.application_id === applicationId;
                const displayHandle = m.telegram_handle || m.full_name.split(" ")[0];
                return (
                  <div key={m.id} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: i < 4 ? "1px solid rgba(176,142,80,0.06)" : "none" }}>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <span style={{ color: "rgba(232,224,208,0.25)", fontSize: "0.5rem", width: "16px" }}>{i + 1}</span>
                      <img
                        src={dicebearUrl(m.telegram_handle || m.full_name)}
                        alt={displayHandle}
                        style={{ width: "24px", height: "24px", borderRadius: "50%", border: "1px solid rgba(176,142,80,0.2)", background: "#0a0d12" }}
                      />
                      <p style={{ color: isMe ? "#e8e0d0" : "rgba(232,224,208,0.55)", fontSize: "0.5rem" }}>
                        {displayHandle}
                        {isMe && <span style={{ color: cfg.color, fontSize: "0.4rem", marginLeft: "6px" }}>YOU</span>}
                      </p>
                    </div>
                    <span style={{ color: "#3fb950", fontSize: "0.5rem" }}>{m.successful_referrals_count} converted</span>
                  </div>
                );
              })}
            </Panel>
          </div>
        )}

        {/* PROFILE TAB */}
        {tab === "Profile" && (
          <div style={{ animation: "fadeUp 0.5s ease forwards" }}>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <img
                src={dicebearUrl(member.telegram_handle || member.full_name)}
                alt="Your avatar"
                style={{
                  width: "80px", height: "80px", borderRadius: "50%",
                  border: `2px solid ${cfg.colorDim}`, background: "#0a0d12",
                  margin: "0 auto 12px", display: "block",
                }}
              />
              <p style={{ color: cfg.color, fontSize: "0.55rem", letterSpacing: "0.15em" }}>
                {member.telegram_handle || member.full_name.split(" ")[0]}
              </p>
              <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.45rem", marginTop: "4px" }}>{member.current_rank}</p>
            </div>
            <Panel title="Identity" accent={cfg.color}>
              {[
                { label: "Handle", value: member.telegram_handle || member.full_name.split(" ")[0] },
                { label: "Application ID", value: member.application_id },
                { label: "Email", value: member.email },
                { label: "Phone", value: member.phone },
                { label: "ZIP", value: member.zip || "—" },
                { label: "Region", value: member.region },
                { label: "Tier", value: cfg.label, color: cfg.color },
                { label: "Rank", value: member.current_rank, color: cfg.color },
                { label: "Referral Code", value: member.referral_code || "—" },
              ].map(row => (
                <Row key={row.label} label={row.label} value={row.value} valueColor={(row as { color?: string }).color} />
              ))}
            </Panel>

            <Panel title="Telegram" accent={cfg.color}>
              <Row label="Handle" value={member.telegram_handle || "Not set"} />
              <Row label="Verified" value={member.telegram_verified ? "Yes" : "No"} valueColor={member.telegram_verified ? "#3fb950" : "#e05c5c"} />
              {!member.telegram_verified && (
                <a
                  href="https://t.me/makoa_order"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "block",
                    marginTop: "10px",
                    padding: "9px",
                    border: `1px solid ${cfg.colorDim}`,
                    color: cfg.color,
                    fontSize: "0.48rem",
                    letterSpacing: "0.15em",
                    textAlign: "center",
                    borderRadius: "4px",
                    textDecoration: "none",
                  }}
                >
                  Join Telegram Channel
                </a>
              )}
            </Panel>

            <div style={{ padding: "12px", background: "rgba(176,142,80,0.04)", border: "1px solid rgba(176,142,80,0.08)", borderRadius: "6px", marginTop: "4px" }}>
              <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.45rem", lineHeight: 1.7 }}>
                Tier, formation dates, and rank are locked. Contact XI to request changes to your record.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Reusable components
function Panel({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: GOLD_FAINT,
      border: "1px solid rgba(176,142,80,0.1)",
      borderRadius: "8px",
      padding: "16px",
      marginBottom: "12px",
    }}>
      <p style={{ color: accent, fontSize: "0.45rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "12px" }}>{title}</p>
      {children}
    </div>
  );
}

function Row({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid rgba(176,142,80,0.05)" }}>
      <span style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.48rem" }}>{label}</span>
      <span style={{ color: valueColor || "#e8e0d0", fontSize: "0.5rem" }}>{value}</span>
    </div>
  );
}

function ProgressBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div style={{ height: "3px", background: "rgba(255,255,255,0.06)", borderRadius: "2px" }}>
      <div style={{
        height: "100%",
        width: `${Math.min(100, pct)}%`,
        background: color,
        borderRadius: "2px",
        transition: "width 1s ease",
      }} />
    </div>
  );
}