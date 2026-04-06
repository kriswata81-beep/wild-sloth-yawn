"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.5)";
const GOLD_FAINT = "rgba(176,142,80,0.08)";
const BLUE = "#58a6ff";
const STEEL = "#8b9aaa";

type Applicant = {
  id: string;
  application_id: string;
  full_name: string;
  email: string;
  phone: string;
  region: string;
  tier: string;
  membership_status: string;
  deposit_paid: boolean;
  pledge_paid: boolean;
  standing: string;
  current_rank: string;
  rank_points_total: number;
  referral_code: string;
  referrals_count: number;
  successful_referrals_count: number;
  weekly_training_attendance_count: number;
  monthly_full_moon_attendance_count: number;
  quarterly_event_attendance_count: number;
  telegram_handle: string;
  telegram_verified: boolean;
  house_id: string;
  admin_rank_override?: boolean;
  formation_start_date?: string;
  deposit_paid_at?: string;
  created_at: string;
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
  monthly_recurring_revenue: number;
  deposits_collected_total: number;
  total_revenue: number;
  house_health_status: string;
  payment_health_score: number;
  training_attendance_score: number;
};

const TABS = ["Members", "Pledges", "Houses", "Events", "Ranks", "Log"] as const;
type Tab = typeof TABS[number];

const TIER_COLOR: Record<string, string> = { alii: GOLD, mana: BLUE, nakoa: STEEL };
const STATUS_COLOR: Record<string, string> = {
  active: "#3fb950", invited: "#58a6ff", pending: GOLD_DIM,
  suspended: "#e05c5c", delinquent: "#f0883e", under_review: "#d29922",
};

const RANKS_BY_TIER: Record<string, string[]> = {
  nakoa: ["Nā Koa Candidate", "Nā Koa Active", "Nā Koa Sentinel", "Nā Koa Field Lead"],
  mana: ["Mana Builder", "Mana Operator", "Mana Strategist", "Mana Circle Lead"],
  alii: ["Aliʻi Seated", "Aliʻi Council", "Aliʻi Steward", "Aliʻi Chapter Anchor"],
};

interface AdminPageProps {
  onExit: () => void;
}

export default function AdminPage({ onExit }: AdminPageProps) {
  const [tab, setTab] = useState<Tab>("Members");
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Applicant | null>(null);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    const [{ data: apps }, { data: hs }] = await Promise.all([
      supabase.from("applicants").select("*").order("created_at", { ascending: false }),
      supabase.from("makoa_houses").select("*").order("house_name"),
    ]);
    setApplicants((apps as Applicant[]) || []);
    setHouses((hs as House[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  async function logAction(action: string, targetId: string, details: Record<string, unknown>) {
    await supabase.from("admin_activity_log").insert({
      action,
      target_application_id: targetId,
      target_type: "applicant",
      details,
      performed_by: "admin",
    });
  }

  async function updateApplicant(appId: string, updates: Partial<Applicant>) {
    setSaving(true);
    await supabase.from("applicants").update(updates).eq("application_id", appId);
    await logAction("admin_update", appId, updates as Record<string, unknown>);
    await loadData();
    setSaving(false);
    setSelected(null);
  }

  async function addRankPoints(app: Applicant, points: number) {
    const newTotal = (app.rank_points_total || 0) + points;
    await updateApplicant(app.application_id, { rank_points_total: newTotal });
  }

  const filtered = applicants.filter(a =>
    !searchTerm ||
    a.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.application_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeMembers = applicants.filter(a => a.membership_status === "active" || a.membership_status === "invited");
  const pendingPledges = applicants.filter(a => a.membership_status === "pending");
  const totalRevenue = applicants.filter(a => a.deposit_paid).length;

  const tierCount = (t: string) => activeMembers.filter(a => a.tier === t).length;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#050709",
      color: "#e8e0d0",
      fontFamily: "'JetBrains Mono', monospace",
    }}>
      {/* Header */}
      <div style={{
        borderBottom: "1px solid rgba(176,142,80,0.12)",
        padding: "14px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        background: "#050709",
        zIndex: 10,
      }}>
        <div>
          <p className="font-cormorant" style={{ color: GOLD, fontSize: "1rem", letterSpacing: "0.15em" }}>MĀKOA · COMMAND</p>
          <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.2em" }}>ADMIN ACCESS · RESTRICTED</p>
        </div>
        <button onClick={onExit} style={{ background: "none", border: "1px solid rgba(176,142,80,0.2)", color: GOLD_DIM, cursor: "pointer", fontSize: "0.45rem", padding: "6px 12px", borderRadius: "4px", letterSpacing: "0.1em" }}>
          EXIT
        </button>
      </div>

      {/* Stats bar */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        borderBottom: "1px solid rgba(176,142,80,0.08)",
        padding: "0",
      }}>
        {[
          { label: "Active", value: activeMembers.length, color: "#3fb950" },
          { label: "Pending", value: pendingPledges.length, color: GOLD },
          { label: "Deposits", value: totalRevenue, color: BLUE },
          { label: "Total", value: applicants.length, color: STEEL },
        ].map(s => (
          <div key={s.label} style={{ padding: "12px 16px", borderRight: "1px solid rgba(176,142,80,0.06)" }}>
            <p style={{ color: s.color, fontSize: "1.1rem", fontWeight: 500, lineHeight: 1 }}>{s.value}</p>
            <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.42rem", letterSpacing: "0.1em", marginTop: "3px" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex",
        borderBottom: "1px solid rgba(176,142,80,0.08)",
        overflowX: "auto",
        padding: "0 16px",
      }}>
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              background: "none",
              border: "none",
              borderBottom: `2px solid ${tab === t ? GOLD : "transparent"}`,
              color: tab === t ? GOLD : "rgba(232,224,208,0.35)",
              cursor: "pointer",
              fontSize: "0.48rem",
              letterSpacing: "0.15em",
              padding: "12px 14px",
              whiteSpace: "nowrap",
              fontFamily: "'JetBrains Mono', monospace",
              transition: "color 0.2s",
            }}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
        {loading ? (
          <p style={{ color: GOLD_DIM, fontSize: "0.52rem", textAlign: "center", padding: "40px" }}>Loading...</p>
        ) : (
          <>
            {/* MEMBERS TAB */}
            {tab === "Members" && (
              <div>
                <div style={{ marginBottom: "16px" }}>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search by name, email, or ID..."
                    style={{ maxWidth: "320px" }}
                  />
                </div>
                <div style={{ display: "grid", gap: "8px" }}>
                  {filtered.filter(a => a.membership_status === "active" || a.membership_status === "invited").map(app => (
                    <MemberRow key={app.id} app={app} onSelect={setSelected} />
                  ))}
                  {filtered.filter(a => a.membership_status === "active" || a.membership_status === "invited").length === 0 && (
                    <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.52rem", padding: "20px 0" }}>No active members yet.</p>
                  )}
                </div>
              </div>
            )}

            {/* PLEDGES TAB */}
            {tab === "Pledges" && (
              <div>
                <p style={{ color: GOLD_DIM, fontSize: "0.48rem", letterSpacing: "0.15em", marginBottom: "16px" }}>
                  PENDING REVIEW — {pendingPledges.length} applications
                </p>
                <div style={{ display: "grid", gap: "8px" }}>
                  {filtered.filter(a => a.membership_status === "pending").map(app => (
                    <div key={app.id} style={{
                      background: GOLD_FAINT,
                      border: "1px solid rgba(176,142,80,0.12)",
                      borderRadius: "8px",
                      padding: "14px 16px",
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                        <div>
                          <p style={{ color: "#e8e0d0", fontSize: "0.65rem", marginBottom: "2px" }}>{app.full_name}</p>
                          <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.48rem" }}>{app.email} · {app.phone}</p>
                          <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.45rem", marginTop: "2px" }}>{app.application_id} · {app.region}</p>
                        </div>
                        <span style={{
                          background: `rgba(${app.tier === "alii" ? "176,142,80" : app.tier === "mana" ? "88,166,255" : "139,154,170"},0.1)`,
                          color: TIER_COLOR[app.tier] || STEEL,
                          border: `1px solid ${TIER_COLOR[app.tier] || STEEL}40`,
                          fontSize: "0.42rem",
                          padding: "3px 8px",
                          borderRadius: "3px",
                          letterSpacing: "0.1em",
                        }}>
                          {app.tier?.toUpperCase()}
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        <ActionBtn label="Accept → Invited" color="#3fb950" onClick={() => updateApplicant(app.application_id, { membership_status: "invited" })} />
                        <ActionBtn label="Accept → Active" color={BLUE} onClick={() => updateApplicant(app.application_id, { membership_status: "active", formation_start_date: new Date().toISOString().split("T")[0] } as Partial<Applicant>)} />
                        <ActionBtn label="Mark Deposit Paid" color={GOLD} onClick={() => updateApplicant(app.application_id, { deposit_paid: true, deposit_paid_at: new Date().toISOString() } as Partial<Applicant>)} />
                      </div>
                    </div>
                  ))}
                  {filtered.filter(a => a.membership_status === "pending").length === 0 && (
                    <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.52rem", padding: "20px 0" }}>No pending pledges.</p>
                  )}
                </div>
              </div>
            )}

            {/* HOUSES TAB */}
            {tab === "Houses" && (
              <div>
                <div style={{ display: "grid", gap: "12px" }}>
                  {houses.map(h => (
                    <div key={h.id} style={{
                      background: GOLD_FAINT,
                      border: "1px solid rgba(176,142,80,0.1)",
                      borderRadius: "8px",
                      padding: "16px",
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                        <div>
                          <p style={{ color: "#e8e0d0", fontSize: "0.65rem", marginBottom: "2px" }}>{h.house_name}</p>
                          <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.48rem" }}>{h.region} · {h.status.toUpperCase()}</p>
                        </div>
                        <span style={{
                          color: h.house_health_status === "strong" ? "#3fb950" : h.house_health_status === "stable" ? BLUE : h.house_health_status === "at_risk" ? "#e05c5c" : GOLD_DIM,
                          fontSize: "0.45rem",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                        }}>{h.house_health_status}</span>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                        {[
                          { label: "Members", value: h.active_member_count },
                          { label: "Aliʻi", value: h.alii_count, color: GOLD },
                          { label: "Mana", value: h.mana_count, color: BLUE },
                          { label: "Nā Koa", value: h.nakoa_count, color: STEEL },
                          { label: "MRR", value: `$${h.monthly_recurring_revenue}` },
                          { label: "Total Rev", value: `$${h.total_revenue}` },
                        ].map(s => (
                          <div key={s.label} style={{ background: "rgba(0,0,0,0.3)", borderRadius: "4px", padding: "8px" }}>
                            <p style={{ color: (s as { color?: string }).color || "#e8e0d0", fontSize: "0.7rem", fontWeight: 500 }}>{s.value}</p>
                            <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.4rem", letterSpacing: "0.08em" }}>{s.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* RANKS TAB */}
            {tab === "Ranks" && (
              <div>
                <p style={{ color: GOLD_DIM, fontSize: "0.48rem", letterSpacing: "0.15em", marginBottom: "16px" }}>
                  RANK MANAGEMENT — {activeMembers.length} active members
                </p>
                <div style={{ display: "grid", gap: "8px" }}>
                  {activeMembers.map(app => {
                    const tierRanks = RANKS_BY_TIER[app.tier] || RANKS_BY_TIER.nakoa;
                    const rankIdx = tierRanks.indexOf(app.current_rank);
                    const pct = Math.min(100, Math.round((app.rank_points_total / 350) * 100));
                    return (
                      <div key={app.id} style={{
                        background: GOLD_FAINT,
                        border: "1px solid rgba(176,142,80,0.1)",
                        borderRadius: "8px",
                        padding: "14px 16px",
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                          <div>
                            <p style={{ color: "#e8e0d0", fontSize: "0.6rem" }}>{app.full_name}</p>
                            <p style={{ color: TIER_COLOR[app.tier] || STEEL, fontSize: "0.5rem", marginTop: "2px" }}>{app.current_rank}</p>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <p style={{ color: GOLD, fontSize: "0.65rem" }}>{app.rank_points_total} pts</p>
                            <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.42rem" }}>{pct}% path</p>
                          </div>
                        </div>
                        <div style={{ height: "2px", background: "rgba(255,255,255,0.06)", borderRadius: "1px", marginBottom: "10px" }}>
                          <div style={{ height: "100%", width: `${pct}%`, background: TIER_COLOR[app.tier] || STEEL, borderRadius: "1px" }} />
                        </div>
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                          <ActionBtn label="+5 pts" color={GOLD} onClick={() => addRankPoints(app, 5)} />
                          <ActionBtn label="+15 pts" color={GOLD} onClick={() => addRankPoints(app, 15)} />
                          <ActionBtn label="+25 pts" color={GOLD} onClick={() => addRankPoints(app, 25)} />
                          {rankIdx < tierRanks.length - 1 && (
                            <ActionBtn
                              label={`→ ${tierRanks[rankIdx + 1]}`}
                              color={BLUE}
                              onClick={() => updateApplicant(app.application_id, { current_rank: tierRanks[rankIdx + 1], admin_rank_override: true })}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* EVENTS TAB */}
            {tab === "Events" && (
              <EventsTab />
            )}

            {/* LOG TAB */}
            {tab === "Log" && (
              <ActivityLog />
            )}
          </>
        )}
      </div>

      {/* Member detail modal */}
      {selected && (
        <MemberModal
          app={selected}
          saving={saving}
          onClose={() => setSelected(null)}
          onUpdate={updateApplicant}
          onAddPoints={addRankPoints}
        />
      )}
    </div>
  );
}

function MemberRow({ app, onSelect }: { app: Applicant; onSelect: (a: Applicant) => void }) {
  const tierColor = TIER_COLOR[app.tier] || STEEL;
  const statusColor = STATUS_COLOR[app.membership_status] || GOLD_DIM;
  return (
    <div
      onClick={() => onSelect(app)}
      style={{
        background: GOLD_FAINT,
        border: "1px solid rgba(176,142,80,0.1)",
        borderRadius: "8px",
        padding: "12px 16px",
        cursor: "pointer",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        transition: "border-color 0.2s",
      }}
    >
      <div>
        <p style={{ color: "#e8e0d0", fontSize: "0.6rem", marginBottom: "2px" }}>{app.full_name}</p>
        <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.45rem" }}>{app.application_id} · {app.region}</p>
      </div>
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <span style={{ color: tierColor, fontSize: "0.45rem", letterSpacing: "0.1em" }}>{app.tier?.toUpperCase()}</span>
        <span style={{ color: statusColor, fontSize: "0.42rem", letterSpacing: "0.08em" }}>{app.membership_status}</span>
        {app.deposit_paid && <span style={{ color: "#3fb950", fontSize: "0.4rem" }}>✓ DEP</span>}
      </div>
    </div>
  );
}

function ActionBtn({ label, color, onClick }: { label: string; color: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "transparent",
        border: `1px solid ${color}40`,
        color,
        fontSize: "0.42rem",
        padding: "5px 10px",
        borderRadius: "4px",
        cursor: "pointer",
        fontFamily: "'JetBrains Mono', monospace",
        letterSpacing: "0.08em",
        transition: "background 0.15s",
      }}
    >
      {label}
    </button>
  );
}

function MemberModal({ app, saving, onClose, onUpdate, onAddPoints }: {
  app: Applicant;
  saving: boolean;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Applicant>) => void;
  onAddPoints: (app: Applicant, pts: number) => void;
}) {
  const tierColor = TIER_COLOR[app.tier] || STEEL;
  const tierRanks = RANKS_BY_TIER[app.tier] || RANKS_BY_TIER.nakoa;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.85)",
      zIndex: 100,
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "center",
    }} onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#080b0f",
          border: "1px solid rgba(176,142,80,0.15)",
          borderRadius: "12px 12px 0 0",
          padding: "24px 20px",
          width: "100%",
          maxWidth: "480px",
          maxHeight: "85vh",
          overflowY: "auto",
          animation: "fadeUp 0.3s ease forwards",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
          <div>
            <p style={{ color: "#e8e0d0", fontSize: "0.75rem" }}>{app.full_name}</p>
            <p style={{ color: tierColor, fontSize: "0.5rem", marginTop: "2px" }}>{app.current_rank}</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: GOLD_DIM, cursor: "pointer", fontSize: "0.8rem" }}>×</button>
        </div>

        <div style={{ display: "grid", gap: "6px", marginBottom: "16px" }}>
          {[
            { label: "App ID", value: app.application_id },
            { label: "Email", value: app.email },
            { label: "Phone", value: app.phone },
            { label: "Region", value: app.region },
            { label: "Tier", value: app.tier?.toUpperCase() },
            { label: "Status", value: app.membership_status },
            { label: "Standing", value: app.standing },
            { label: "Deposit", value: app.deposit_paid ? "PAID" : "NOT PAID" },
            { label: "Referral Code", value: app.referral_code },
            { label: "Referrals", value: `${app.referrals_count} total / ${app.successful_referrals_count} converted` },
            { label: "Formation Score", value: `${app.rank_points_total} pts` },
          ].map(row => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid rgba(176,142,80,0.06)" }}>
              <span style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.48rem" }}>{row.label}</span>
              <span style={{ color: "#e8e0d0", fontSize: "0.5rem" }}>{row.value || "—"}</span>
            </div>
          ))}
        </div>

        {saving && <p style={{ color: GOLD_DIM, fontSize: "0.5rem", marginBottom: "12px" }}>Saving...</p>}

        <div style={{ display: "grid", gap: "8px" }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.45rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>Actions</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            <ActionBtn label="Mark Active" color="#3fb950" onClick={() => onUpdate(app.application_id, { membership_status: "active" })} />
            <ActionBtn label="Mark Invited" color={BLUE} onClick={() => onUpdate(app.application_id, { membership_status: "invited" })} />
            <ActionBtn label="Deposit Paid" color={GOLD} onClick={() => onUpdate(app.application_id, { deposit_paid: true })} />
            <ActionBtn label="Suspend" color="#e05c5c" onClick={() => onUpdate(app.application_id, { membership_status: "suspended", standing: "suspended" })} />
            <ActionBtn label="+20 pts" color={GOLD} onClick={() => onAddPoints(app, 20)} />
            <ActionBtn label="-15 pts" color="#e05c5c" onClick={() => onAddPoints(app, -15)} />
            <ActionBtn label="Telegram ✓" color={BLUE} onClick={() => onUpdate(app.application_id, { telegram_verified: true })} />
          </div>

          <p style={{ color: GOLD_DIM, fontSize: "0.45rem", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: "8px" }}>Promote Rank</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {tierRanks.map(rank => (
              <ActionBtn
                key={rank}
                label={rank}
                color={rank === app.current_rank ? GOLD : "rgba(232,224,208,0.3)"}
                onClick={() => onUpdate(app.application_id, { current_rank: rank, admin_rank_override: true })}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function EventsTab() {
  const [events, setEvents] = useState<Array<{
    id: string; event_name: string; event_type: string; event_date: string;
    location: string; capacity: number | null; seats_filled: number; status: string;
  }>>([]);

  useEffect(() => {
    supabase.from("events").select("*").order("event_date").then(({ data }) => {
      if (data) setEvents(data);
    });
  }, []);

  return (
    <div>
      <p style={{ color: GOLD_DIM, fontSize: "0.48rem", letterSpacing: "0.15em", marginBottom: "16px" }}>
        UPCOMING EVENTS — {events.length} scheduled
      </p>
      <div style={{ display: "grid", gap: "8px" }}>
        {events.map(ev => (
          <div key={ev.id} style={{
            background: GOLD_FAINT,
            border: "1px solid rgba(176,142,80,0.1)",
            borderRadius: "8px",
            padding: "14px 16px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <p style={{ color: "#e8e0d0", fontSize: "0.6rem" }}>{ev.event_name}</p>
              <span style={{ color: GOLD_DIM, fontSize: "0.42rem" }}>{ev.event_date}</span>
            </div>
            <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.48rem" }}>{ev.location}</p>
            <div style={{ display: "flex", gap: "12px", marginTop: "6px" }}>
              <span style={{ color: GOLD_DIM, fontSize: "0.42rem" }}>{ev.event_type.replace("_", " ").toUpperCase()}</span>
              {ev.capacity && (
                <span style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.42rem" }}>
                  {ev.seats_filled}/{ev.capacity} filled
                </span>
              )}
              <span style={{ color: ev.status === "upcoming" ? "#3fb950" : GOLD_DIM, fontSize: "0.42rem" }}>{ev.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActivityLog() {
  const [logs, setLogs] = useState<Array<{
    id: string; action: string; target_application_id: string; details: Record<string, unknown>; performed_by: string; created_at: string;
  }>>([]);

  useEffect(() => {
    supabase.from("admin_activity_log").select("*").order("created_at", { ascending: false }).limit(50).then(({ data }) => {
      if (data) setLogs(data as typeof logs);
    });
  }, []);

  return (
    <div>
      <p style={{ color: GOLD_DIM, fontSize: "0.48rem", letterSpacing: "0.15em", marginBottom: "16px" }}>
        ACTIVITY LOG — last 50 actions
      </p>
      <div style={{ display: "grid", gap: "6px" }}>
        {logs.map(log => (
          <div key={log.id} style={{
            background: GOLD_FAINT,
            border: "1px solid rgba(176,142,80,0.08)",
            borderRadius: "6px",
            padding: "10px 14px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
              <span style={{ color: GOLD, fontSize: "0.5rem" }}>{log.action}</span>
              <span style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.42rem" }}>
                {new Date(log.created_at).toLocaleString()}
              </span>
            </div>
            <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.45rem" }}>
              {log.target_application_id} · {log.performed_by}
            </p>
          </div>
        ))}
        {logs.length === 0 && (
          <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.52rem", padding: "20px 0" }}>No activity logged yet.</p>
        )}
      </div>
    </div>
  );
}
