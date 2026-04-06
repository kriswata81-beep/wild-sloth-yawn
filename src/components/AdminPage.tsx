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

const TABS = ["Members", "Pledges", "Houses", "Events", "Ranks", "Log", "Newsletter", "Compliance", "Revenue"] as const;
type Tab = typeof TABS[number];

const TIER_COLOR: Record<string, string> = { alii: GOLD, mana: BLUE, nakoa: STEEL };
const STATUS_COLOR: Record<string, string> = {
  active: "#3fb950", invited: "#58a6ff", pending: GOLD_DIM,
  suspended: "#e05c5c", delinquent: "#f0883e", under_review: "#d29922",
};

// DiceBear avatar URL from handle/name
function dicebearUrl(seed: string) {
  return `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(seed || "makoa")}`;
}

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

            {/* NEWSLETTER TAB */}
            {tab === "Newsletter" && (
              <NewsletterTab applicants={applicants} />
            )}

            {/* COMPLIANCE TAB */}
            {tab === "Compliance" && (
              <ComplianceTab />
            )}

            {/* REVENUE TAB */}
            {tab === "Revenue" && (
              <RevenueTab applicants={applicants} />
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
  const avatarSeed = app.telegram_handle || app.full_name;
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
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <img
          src={dicebearUrl(avatarSeed)}
          alt={app.full_name}
          style={{ width: "32px", height: "32px", borderRadius: "50%", border: `1px solid ${tierColor}40`, background: "#0a0d12", flexShrink: 0 }}
        />
        <div>
          <p style={{ color: "#e8e0d0", fontSize: "0.6rem", marginBottom: "2px" }}>{app.full_name}</p>
          <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.45rem" }}>{app.application_id} · {app.region}</p>
        </div>
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
  const avatarSeed = app.telegram_handle || app.full_name;

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
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <img
              src={dicebearUrl(avatarSeed)}
              alt={app.full_name}
              style={{ width: "48px", height: "48px", borderRadius: "50%", border: `1px solid ${tierColor}40`, background: "#0a0d12" }}
            />
            <div>
              <p style={{ color: "#e8e0d0", fontSize: "0.75rem" }}>{app.full_name}</p>
              <p style={{ color: tierColor, fontSize: "0.5rem", marginTop: "2px" }}>{app.current_rank}</p>
            </div>
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

type BriefTier = "alii" | "mana" | "nakoa";

const BRIEF_CONFIG: Record<BriefTier, { label: string; color: string; colorFaint: string; emoji: string }> = {
  alii: { label: "Aliʻi Brief", color: GOLD, colorFaint: GOLD_FAINT, emoji: "👑" },
  mana: { label: "Mana Brief", color: BLUE, colorFaint: "rgba(88,166,255,0.06)", emoji: "🌀" },
  nakoa: { label: "Nā Koa Alert", color: "#3fb950", colorFaint: "rgba(63,185,80,0.06)", emoji: "⚔" },
};

function NewsletterTab({ applicants }: { applicants: Applicant[] }) {
  const [generating, setGenerating] = useState<BriefTier | null>(null);
  const [briefs, setBriefs] = useState<Partial<Record<BriefTier, string>>>({});
  const [toastMsg, setToastMsg] = useState("");

  function showToast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  }

  async function generateBrief(tier: BriefTier) {
    const apiKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;
    setGenerating(tier);

    const tierMembers = applicants.filter(a => a.tier === tier && (a.membership_status === "active" || a.membership_status === "invited"));
    const newPledges = applicants.filter(a => a.tier === tier && a.membership_status === "pending");
    const tierLabels: Record<BriefTier, string> = { alii: "Aliʻi", mana: "Mana", nakoa: "Nā Koa" };

    const contextData = `Tier: ${tierLabels[tier]}
Active members: ${tierMembers.length}
New pledges this week: ${newPledges.length}
Total deposits paid: ${tierMembers.filter(a => a.deposit_paid).length}
Upcoming event: Mākoa 1st Roundup — May 1–4, 2026 · Kapolei · West Oahu
Service route updates: Route assignments reviewed every full moon
Wednesday training: Every Wednesday 4am — Ko Olina Beach`;

    if (!apiKey) {
      // Fallback brief
      const fallback = `# ${tierLabels[tier]} Weekly Brief — XI\n\n## Standing\n${tierMembers.length} brothers active. ${newPledges.length} new pledges under review.\n\n## Events\nMākoa 1st Roundup — May 1–4, 2026. Kapolei, West Oahu. All ${tierLabels[tier]} brothers confirmed.\n\n## Service Route\nRoute assignments reviewed every full moon. Brothers on active routes — maintain your standing.\n\n## Wednesday Training\nEvery Wednesday 4am — Ko Olina Beach. Show up. Ice bath is free.\n\n## Closing\nThe order holds because you hold. Stand firm. — XI`;
      setBriefs(prev => ({ ...prev, [tier]: fallback }));
      setGenerating(null);
      return;
    }

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 512,
          system: `You are XI generating the weekly brief for ${tierLabels[tier]} brothers. Include: upcoming events, member count, new pledges this week, service route updates, and one motivational closing line in the voice of the Makoa Order. Keep it under 200 words. Format with sections using markdown headers (##). Write in the voice of the order — direct, purposeful, no fluff.`,
          messages: [{ role: "user", content: `Generate the weekly brief using this data:\n\n${contextData}` }],
        }),
      });

      if (!response.ok) throw new Error(`API error ${response.status}`);
      const data = await response.json();
      const text = data?.content?.[0]?.text || "";
      setBriefs(prev => ({ ...prev, [tier]: text }));
    } catch (err) {
      console.error("[newsletter] Brief generation error:", err);
      setBriefs(prev => ({ ...prev, [tier]: `Error generating brief. Check API key and try again.` }));
    }

    setGenerating(null);
  }

  function copyBrief(tier: BriefTier) {
    const text = briefs[tier];
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      showToast("Brief copied to clipboard ✓");
    }).catch(() => {
      showToast("Copy failed — select text manually");
    });
  }

  function sendToTelegram(tier: BriefTier) {
    const cfg = BRIEF_CONFIG[tier];
    showToast(`${cfg.emoji} Sending ${cfg.label} to Telegram channel...`);
  }

  return (
    <div>
      {/* Toast */}
      {toastMsg && (
        <div style={{
          position: "fixed", bottom: "24px", left: "50%", transform: "translateX(-50%)",
          background: "#0a0d12", border: `1px solid ${GOLD}40`,
          color: GOLD, fontSize: "0.5rem", padding: "10px 20px",
          borderRadius: "6px", zIndex: 200, letterSpacing: "0.1em",
          animation: "fadeUp 0.3s ease forwards",
          whiteSpace: "nowrap",
        }}>
          {toastMsg}
        </div>
      )}

      <p style={{ color: GOLD_DIM, fontSize: "0.48rem", letterSpacing: "0.15em", marginBottom: "20px" }}>
        XI NEWSLETTER GENERATOR — Weekly briefs for each tier
      </p>

      <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.48rem", lineHeight: 1.7, marginBottom: "24px" }}>
        Generate weekly briefs powered by XI. Each brief pulls live member data and formats a message ready to send to your Telegram channels.
        {!process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY && (
          <span style={{ color: "#f0883e", display: "block", marginTop: "8px" }}>
            ⚠ NEXT_PUBLIC_ANTHROPIC_API_KEY not set — fallback briefs will be used.
          </span>
        )}
      </p>

      {/* Generate buttons */}
      <div style={{ display: "grid", gap: "10px", marginBottom: "28px" }}>
        {(["alii", "mana", "nakoa"] as BriefTier[]).map(tier => {
          const cfg = BRIEF_CONFIG[tier];
          const isGenerating = generating === tier;
          return (
            <button
              key={tier}
              onClick={() => generateBrief(tier)}
              disabled={!!generating}
              style={{
                background: "transparent",
                border: `1px solid ${cfg.color}40`,
                color: cfg.color,
                fontSize: "0.5rem",
                letterSpacing: "0.2em",
                padding: "13px 20px",
                cursor: generating ? "not-allowed" : "pointer",
                borderRadius: "6px",
                fontFamily: "'JetBrains Mono', monospace",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                opacity: generating && generating !== tier ? 0.4 : 1,
                transition: "all 0.2s",
              }}
            >
              {isGenerating ? (
                <>
                  <div style={{ width: "12px", height: "12px", border: `1px solid ${cfg.color}`, borderTop: "1px solid transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", flexShrink: 0 }} />
                  Generating {cfg.label}...
                </>
              ) : (
                <>
                  <span>{cfg.emoji}</span>
                  Generate {cfg.label}
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Generated briefs */}
      <div style={{ display: "grid", gap: "20px" }}>
        {(["alii", "mana", "nakoa"] as BriefTier[]).map(tier => {
          const brief = briefs[tier];
          if (!brief) return null;
          const cfg = BRIEF_CONFIG[tier];

          // Render markdown-ish headers
          const lines = brief.split("\n");
          return (
            <div key={tier} style={{
              background: cfg.colorFaint,
              border: `1px solid ${cfg.color}30`,
              borderRadius: "10px",
              padding: "20px",
              animation: "fadeUp 0.5s ease forwards",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "1rem" }}>{cfg.emoji}</span>
                  <p style={{ color: cfg.color, fontSize: "0.52rem", letterSpacing: "0.15em" }}>{cfg.label.toUpperCase()}</p>
                </div>
                <span style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.4rem" }}>
                  {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>

              {/* Brief content */}
              <div style={{ marginBottom: "16px" }}>
                {lines.map((line, i) => {
                  if (line.startsWith("## ")) {
                    return <p key={i} style={{ color: cfg.color, fontSize: "0.48rem", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: "14px", marginBottom: "6px", opacity: 0.8 }}>{line.replace("## ", "")}</p>;
                  }
                  if (line.startsWith("# ")) {
                    return <p key={i} style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "#e8e0d0", fontSize: "1rem", marginBottom: "10px" }}>{line.replace("# ", "")}</p>;
                  }
                  if (line.trim() === "") return <div key={i} style={{ height: "6px" }} />;
                  return <p key={i} style={{ color: "rgba(232,224,208,0.65)", fontSize: "0.5rem", lineHeight: 1.8 }}>{line}</p>;
                })}
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <button
                  onClick={() => copyBrief(tier)}
                  style={{
                    background: cfg.color,
                    border: "none",
                    color: "#000",
                    fontSize: "0.45rem",
                    letterSpacing: "0.15em",
                    padding: "9px 16px",
                    cursor: "pointer",
                    borderRadius: "4px",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 700,
                  }}
                >
                  APPROVE + COPY
                </button>
                <button
                  onClick={() => sendToTelegram(tier)}
                  style={{
                    background: "transparent",
                    border: `1px solid rgba(88,166,255,0.4)`,
                    color: "#58a6ff",
                    fontSize: "0.45rem",
                    letterSpacing: "0.15em",
                    padding: "9px 16px",
                    cursor: "pointer",
                    borderRadius: "4px",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  SEND TO TELEGRAM
                </button>
                <button
                  onClick={() => generateBrief(tier)}
                  style={{
                    background: "transparent",
                    border: `1px solid rgba(255,255,255,0.1)`,
                    color: "rgba(232,224,208,0.3)",
                    fontSize: "0.45rem",
                    letterSpacing: "0.1em",
                    padding: "9px 16px",
                    cursor: "pointer",
                    borderRadius: "4px",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  REGENERATE
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── COMPLIANCE TAB ──────────────────────────────────────────────────────────

type ComplianceStatus = "active" | "pending" | "uploaded" | "missing" | "current" | "expired" | "signed" | "published" | "draft" | "inactive" | "required";

interface SOPItem {
  id: string;
  label: string;
  description: string;
  statusOptions: [ComplianceStatus, ComplianceStatus];
  defaultStatus: ComplianceStatus;
  positiveStatus: ComplianceStatus;
  note?: string;
}

const SOP_ITEMS: SOPItem[] = [
  {
    id: "ein",
    label: "EIN Status",
    description: "Federal Employer Identification Number — required for all financial operations.",
    statusOptions: ["active", "pending"],
    defaultStatus: "pending",
    positiveStatus: "active",
  },
  {
    id: "ge_tax",
    label: "GE Tax License",
    description: "Hawaii General Excise Tax license — required before collecting any revenue.",
    statusOptions: ["uploaded", "missing"],
    defaultStatus: "missing",
    positiveStatus: "uploaded",
  },
  {
    id: "event_insurance",
    label: "Event Insurance",
    description: "Liability coverage for all gatherings including Ke Ala, Pō Māhina, and Ka Hoʻike.",
    statusOptions: ["current", "expired"],
    defaultStatus: "expired",
    positiveStatus: "current",
  },
  {
    id: "waiver_collection",
    label: "Waiver Collection",
    description: "Digital liability waivers collected from all members before participation.",
    statusOptions: ["active", "inactive"],
    defaultStatus: "inactive",
    positiveStatus: "active",
  },
  {
    id: "coop_agreements",
    label: "Cooperative Membership Agreements",
    description: "Signed cooperative membership agreements for all active members.",
    statusOptions: ["signed", "pending"],
    defaultStatus: "pending",
    positiveStatus: "signed",
  },
  {
    id: "house_rules",
    label: "House Rules",
    description: "Published house rules and code of conduct for all Mākoa members.",
    statusOptions: ["published", "draft"],
    defaultStatus: "draft",
    positiveStatus: "published",
  },
  {
    id: "ice_bath_waiver",
    label: "Ice Bath Waiver",
    description: "Required before first Pō Māhina. Digital collection via portal.",
    statusOptions: ["active", "required"],
    defaultStatus: "required",
    positiveStatus: "active",
    note: "Required before first Pō Māhina — digital collection via member portal",
  },
];

const STATUS_DISPLAY: Record<ComplianceStatus, { label: string; color: string; icon: string }> = {
  active:    { label: "Active",    color: "#3fb950", icon: "✓" },
  pending:   { label: "Pending",   color: "#d29922", icon: "⏳" },
  uploaded:  { label: "Uploaded",  color: "#3fb950", icon: "✓" },
  missing:   { label: "Missing",   color: "#e05c5c", icon: "✗" },
  current:   { label: "Current",   color: "#3fb950", icon: "✓" },
  expired:   { label: "Expired",   color: "#e05c5c", icon: "✗" },
  signed:    { label: "Signed",    color: "#3fb950", icon: "✓" },
  published: { label: "Published", color: "#3fb950", icon: "✓" },
  draft:     { label: "Draft",     color: "#d29922", icon: "⏳" },
  inactive:  { label: "Inactive",  color: "#e05c5c", icon: "✗" },
  required:  { label: "Required",  color: "#f0883e", icon: "!" },
};

function ComplianceTab() {
  const [statuses, setStatuses] = useState<Record<string, ComplianceStatus>>(
    Object.fromEntries(SOP_ITEMS.map(item => [item.id, item.defaultStatus])) as Record<string, ComplianceStatus>
  );

  // Mock revenue for GE tax calculation
  const mockMonthlyRevenue = 24800;
  const mockQuarterlyRevenue = mockMonthlyRevenue * 3;
  const geTaxRate = 0.04;
  const geTaxDue = Math.round(mockQuarterlyRevenue * geTaxRate);

  function toggleStatus(item: SOPItem) {
    setStatuses(prev => ({
      ...prev,
      [item.id]: prev[item.id] === item.positiveStatus ? item.statusOptions[1] : item.positiveStatus,
    }));
  }

  const completeCount = SOP_ITEMS.filter(item => statuses[item.id] === item.positiveStatus).length;
  const totalCount = SOP_ITEMS.length;
  const compliancePct = Math.round((completeCount / totalCount) * 100);

  return (
    <div>
      <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>

      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <p style={{ color: GOLD_DIM, fontSize: "0.48rem", letterSpacing: "0.15em", marginBottom: "8px" }}>
          LEGAL COMPLIANCE DASHBOARD
        </p>
        <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.48rem", lineHeight: 1.7, marginBottom: "16px" }}>
          Track SOP compliance status. Toggle items as they are completed. All items required before full operations.
        </p>

        {/* Compliance score */}
        <div style={{
          background: GOLD_FAINT,
          border: `1px solid ${GOLD}20`,
          borderRadius: "10px",
          padding: "16px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <div>
            <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.42rem", letterSpacing: "0.15em", marginBottom: "4px" }}>COMPLIANCE SCORE</p>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              color: compliancePct === 100 ? "#3fb950" : compliancePct >= 70 ? GOLD : "#e05c5c",
              fontSize: "1.8rem",
              lineHeight: 1,
            }}>{compliancePct}%</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ color: "#e8e0d0", fontSize: "0.65rem" }}>{completeCount}/{totalCount}</p>
            <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.42rem" }}>items complete</p>
          </div>
        </div>
      </div>

      {/* SOP Checklist */}
      <div style={{
        border: `1px solid ${GOLD}20`,
        borderRadius: "10px",
        overflow: "hidden",
        marginBottom: "24px",
      }}>
        <div style={{ padding: "12px 16px", borderBottom: `1px solid ${GOLD}15`, background: GOLD_FAINT }}>
          <p style={{ color: GOLD, fontSize: "0.45rem", letterSpacing: "0.2em" }}>SOP CHECKLIST</p>
        </div>
        {SOP_ITEMS.map((item, i) => {
          const currentStatus = statuses[item.id] as ComplianceStatus;
          const statusInfo = STATUS_DISPLAY[currentStatus];
          const isPositive = currentStatus === item.positiveStatus;

          return (
            <div
              key={item.id}
              style={{
                padding: "14px 16px",
                borderBottom: i < SOP_ITEMS.length - 1 ? `1px solid rgba(176,142,80,0.06)` : "none",
                background: isPositive ? "rgba(63,185,80,0.03)" : "transparent",
                transition: "background 0.3s",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <div style={{
                      width: "20px", height: "20px", borderRadius: "50%",
                      border: `1px solid ${statusInfo.color}50`,
                      background: `${statusInfo.color}10`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <span style={{ color: statusInfo.color, fontSize: "0.5rem" }}>{statusInfo.icon}</span>
                    </div>
                    <p style={{ color: "#e8e0d0", fontSize: "0.55rem" }}>{item.label}</p>
                  </div>
                  <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.45rem", lineHeight: 1.6, paddingLeft: "28px" }}>
                    {item.description}
                  </p>
                  {item.note && (
                    <p style={{ color: "rgba(176,142,80,0.5)", fontSize: "0.42rem", paddingLeft: "28px", marginTop: "4px", fontStyle: "italic" }}>
                      📋 {item.note}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => toggleStatus(item)}
                  style={{
                    background: isPositive ? `${statusInfo.color}15` : "transparent",
                    border: `1px solid ${statusInfo.color}40`,
                    color: statusInfo.color,
                    fontSize: "0.42rem",
                    padding: "5px 10px",
                    cursor: "pointer",
                    borderRadius: "4px",
                    fontFamily: "'JetBrains Mono', monospace",
                    letterSpacing: "0.08em",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                    transition: "all 0.2s",
                  }}
                >
                  {statusInfo.label}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* GE Tax Reminder */}
      <div style={{
        background: "rgba(176,142,80,0.05)",
        border: `1px solid ${GOLD}25`,
        borderRadius: "10px",
        padding: "18px 20px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
          <span style={{ color: GOLD, fontSize: "0.9rem" }}>📊</span>
          <p style={{ color: GOLD, fontSize: "0.48rem", letterSpacing: "0.15em" }}>GE TAX REMINDER</p>
        </div>
        <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.48rem", lineHeight: 1.7, marginBottom: "16px" }}>
          4% of all service revenue is flagged quarterly for Hawaii General Excise Tax. File with DOTAX by the 20th of the month following each quarter.
        </p>
        <div style={{ display: "grid", gap: "8px" }}>
          {[
            { label: "Mock Monthly Revenue", value: `$${mockMonthlyRevenue.toLocaleString()}`, color: "#e8e0d0" },
            { label: "Quarterly Revenue (×3)", value: `$${mockQuarterlyRevenue.toLocaleString()}`, color: "#e8e0d0" },
            { label: "GE Tax Rate", value: "4.00%", color: GOLD },
            { label: "Quarterly GE Tax Due", value: `$${geTaxDue.toLocaleString()}`, color: "#f0883e" },
          ].map(row => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${GOLD}08` }}>
              <span style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.48rem" }}>{row.label}</span>
              <span style={{ color: row.color, fontSize: "0.52rem", fontFamily: "'JetBrains Mono', monospace" }}>{row.value}</span>
            </div>
          ))}
        </div>
        <p style={{ color: "rgba(176,142,80,0.4)", fontSize: "0.42rem", marginTop: "12px", lineHeight: 1.6 }}>
          ⚠ This is a mock estimate. Connect your actual revenue data for accurate calculations. Consult a Hawaii CPA for GE tax filing.
        </p>
      </div>
    </div>
  );
}

// ─── REVENUE TAB ─────────────────────────────────────────────────────────────

const PURPLE = "#534AB7";

function RevenueTab({ applicants }: { applicants: Applicant[] }) {
  // Mock plan data
  const MOCK_PLANS = {
    alii: { count: 2, mrr: 9999 * 2 },
    kamaaina: { count: 5, mrr: 4999 * 5 },
  };

  const totalMRR = MOCK_PLANS.alii.mrr + MOCK_PLANS.kamaaina.mrr;
  const totalPlans = MOCK_PLANS.alii.count + MOCK_PLANS.kamaaina.count;
  const quarterlyRevenue = totalMRR * 3;
  const geTaxQuarterly = Math.round(quarterlyRevenue * 0.04);

  // Revenue split
  const nakoa80 = Math.round(totalMRR * 0.80);
  const mana10 = Math.round(totalMRR * 0.10);
  const alii10 = Math.round(totalMRR * 0.10);

  const activeMembers = applicants.filter(a => a.membership_status === "active" || a.membership_status === "invited");

  return (
    <div>
      {/* Header */}
      <p style={{ color: GOLD_DIM, fontSize: "0.48rem", letterSpacing: "0.15em", marginBottom: "8px" }}>
        OHANA SERVICE PLANS — REVENUE DASHBOARD
      </p>
      <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.48rem", lineHeight: 1.7, marginBottom: "24px" }}>
        Service plan pricing, revenue splits, and B2B contract tiers. All revenue flows through the 80/10/10 cooperative model.
      </p>

      {/* MRR Summary */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "10px",
        marginBottom: "24px",
      }}>
        {[
          { label: "Total MRR", value: `$${totalMRR.toLocaleString()}`, color: GOLD, sub: "monthly recurring" },
          { label: "Active Plans", value: String(totalPlans), color: BLUE, sub: "service contracts" },
          { label: "Quarterly Rev", value: `$${quarterlyRevenue.toLocaleString()}`, color: "#3fb950", sub: "3-month total" },
          { label: "GE Tax Due", value: `$${geTaxQuarterly.toLocaleString()}`, color: "#f0883e", sub: "4% quarterly" },
        ].map(s => (
          <div key={s.label} style={{
            background: "rgba(0,0,0,0.35)",
            border: `1px solid ${s.color}20`,
            borderRadius: "8px",
            padding: "14px 16px",
          }}>
            <p style={{ color: s.color, fontSize: "1.1rem", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1, marginBottom: "4px" }}>{s.value}</p>
            <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.42rem", letterSpacing: "0.08em" }}>{s.label}</p>
            <p style={{ color: "rgba(232,224,208,0.2)", fontSize: "0.38rem", marginTop: "2px" }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Revenue Split Visualization */}
      <div style={{
        background: GOLD_FAINT,
        border: `1px solid ${GOLD}20`,
        borderRadius: "10px",
        padding: "18px 20px",
        marginBottom: "20px",
      }}>
        <p style={{ color: GOLD, fontSize: "0.45rem", letterSpacing: "0.2em", marginBottom: "16px" }}>
          80/10/10 COOPERATIVE SPLIT
        </p>
        <div style={{ display: "grid", gap: "10px", marginBottom: "14px" }}>
          {[
            { label: "Nā Koa Workers", pct: 80, amount: nakoa80, color: "#3fb950" },
            { label: "Mana Council", pct: 10, amount: mana10, color: BLUE },
            { label: "Aliʻi Hale Fund", pct: 10, amount: alii10, color: GOLD },
          ].map(split => (
            <div key={split.label}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                <span style={{ color: "rgba(232,224,208,0.55)", fontSize: "0.48rem" }}>{split.label}</span>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <span style={{ color: split.color, fontSize: "0.48rem", fontFamily: "'JetBrains Mono', monospace" }}>
                    ${split.amount.toLocaleString()}/mo
                  </span>
                  <span style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.42rem" }}>{split.pct}%</span>
                </div>
              </div>
              <div style={{ height: "5px", background: "rgba(255,255,255,0.05)", borderRadius: "3px" }}>
                <div style={{
                  height: "100%",
                  width: `${split.pct}%`,
                  background: split.color,
                  borderRadius: "3px",
                  transition: "width 1s ease",
                }} />
              </div>
            </div>
          ))}
        </div>
        <p style={{ color: "rgba(232,224,208,0.25)", fontSize: "0.42rem", lineHeight: 1.6 }}>
          Split applied to all service revenue after GE tax deduction. Nā Koa workers receive 80% of each job completed.
        </p>
      </div>

      {/* Aliʻi Plan */}
      <div style={{
        background: "rgba(176,142,80,0.06)",
        border: `1px solid ${GOLD}35`,
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "14px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
          <div>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              color: GOLD,
              fontSize: "1.3rem",
              lineHeight: 1.1,
              marginBottom: "4px",
            }}>Aliʻi Plan</p>
            <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.12em" }}>PREMIUM RESIDENTIAL SERVICE</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ color: GOLD, fontSize: "1.2rem", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>$9,999</p>
            <p style={{ color: GOLD_DIM, fontSize: "0.42rem" }}>/month</p>
          </div>
        </div>
        <div style={{ display: "grid", gap: "6px", marginBottom: "14px" }}>
          {[
            { label: "Service visits", value: "4/month (1 per week)" },
            { label: "Visit duration", value: "Full day service" },
            { label: "Team size", value: "2–4 Nā Koa workers" },
            { label: "Active contracts", value: String(MOCK_PLANS.alii.count) },
            { label: "Monthly revenue", value: `$${MOCK_PLANS.alii.mrr.toLocaleString()}` },
          ].map(row => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: `1px solid ${GOLD}08` }}>
              <span style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.48rem" }}>{row.label}</span>
              <span style={{ color: "#e8e0d0", fontSize: "0.5rem" }}>{row.value}</span>
            </div>
          ))}
        </div>
        <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: "6px", padding: "10px 12px" }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.45rem", lineHeight: 1.6 }}>
            Split: <span style={{ color: "#3fb950" }}>${Math.round(9999 * 0.8).toLocaleString()} Nā Koa</span> · <span style={{ color: BLUE }}>${Math.round(9999 * 0.1).toLocaleString()} Mana</span> · <span style={{ color: GOLD }}>${Math.round(9999 * 0.1).toLocaleString()} Hale</span>
          </p>
        </div>
      </div>

      {/* Kamaaina Plan */}
      <div style={{
        background: "rgba(88,166,255,0.05)",
        border: `1px solid ${BLUE}30`,
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "24px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
          <div>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              color: BLUE,
              fontSize: "1.3rem",
              lineHeight: 1.1,
              marginBottom: "4px",
            }}>Kama&lsquo;āina Plan</p>
            <p style={{ color: "rgba(88,166,255,0.5)", fontSize: "0.42rem", letterSpacing: "0.12em" }}>STANDARD RESIDENTIAL SERVICE</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ color: BLUE, fontSize: "1.2rem", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>$4,999</p>
            <p style={{ color: "rgba(88,166,255,0.5)", fontSize: "0.42rem" }}>/month</p>
          </div>
        </div>
        <div style={{ display: "grid", gap: "6px", marginBottom: "14px" }}>
          {[
            { label: "Service visits", value: "2/month (bi-weekly)" },
            { label: "Visit duration", value: "Half day service" },
            { label: "Team size", value: "2 Nā Koa workers" },
            { label: "Active contracts", value: String(MOCK_PLANS.kamaaina.count) },
            { label: "Monthly revenue", value: `$${MOCK_PLANS.kamaaina.mrr.toLocaleString()}` },
          ].map(row => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: `1px solid ${BLUE}08` }}>
              <span style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.48rem" }}>{row.label}</span>
              <span style={{ color: "#e8e0d0", fontSize: "0.5rem" }}>{row.value}</span>
            </div>
          ))}
        </div>
        <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: "6px", padding: "10px 12px" }}>
          <p style={{ color: "rgba(88,166,255,0.5)", fontSize: "0.45rem", lineHeight: 1.6 }}>
            Split: <span style={{ color: "#3fb950" }}>${Math.round(4999 * 0.8).toLocaleString()} Nā Koa</span> · <span style={{ color: BLUE }}>${Math.round(4999 * 0.1).toLocaleString()} Mana</span> · <span style={{ color: GOLD }}>${Math.round(4999 * 0.1).toLocaleString()} Hale</span>
          </p>
        </div>
      </div>

      {/* B2B Hawaii-Owned Contracts */}
      <div style={{
        background: `rgba(83,74,183,0.05)`,
        border: `1px solid ${PURPLE}30`,
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "20px",
      }}>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          color: PURPLE,
          fontSize: "1.1rem",
          marginBottom: "4px",
        }}>B2B Hawaii-Owned Contracts</p>
        <p style={{ color: `rgba(83,74,183,0.6)`, fontSize: "0.42rem", letterSpacing: "0.12em", marginBottom: "16px" }}>
          COMMERCIAL SERVICE AGREEMENTS
        </p>

        <div style={{ display: "grid", gap: "10px" }}>
          {[
            {
              term: "Month-to-Month",
              discount: "Full Rate",
              discountPct: 0,
              alii: 9999,
              kamaaina: 4999,
              color: "#e8e0d0",
              note: "No commitment required",
            },
            {
              term: "6-Month Contract",
              discount: "20% Off",
              discountPct: 20,
              alii: Math.round(9999 * 0.8),
              kamaaina: Math.round(4999 * 0.8),
              color: "#3fb950",
              note: "Paid monthly, 6-month minimum",
            },
            {
              term: "12-Month Contract",
              discount: "40% Off",
              discountPct: 40,
              alii: Math.round(9999 * 0.6),
              kamaaina: Math.round(4999 * 0.6),
              color: GOLD,
              note: "Best value — annual commitment",
            },
          ].map((tier, i) => (
            <div key={tier.term} style={{
              background: i === 2 ? `rgba(176,142,80,0.05)` : "rgba(0,0,0,0.25)",
              border: `1px solid ${tier.color}20`,
              borderRadius: "8px",
              padding: "14px 16px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <div>
                  <p style={{ color: "#e8e0d0", fontSize: "0.55rem", marginBottom: "2px" }}>{tier.term}</p>
                  <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.42rem" }}>{tier.note}</p>
                </div>
                <span style={{
                  background: `${tier.color}15`,
                  border: `1px solid ${tier.color}40`,
                  color: tier.color,
                  fontSize: "0.42rem",
                  padding: "3px 8px",
                  borderRadius: "3px",
                  letterSpacing: "0.1em",
                }}>{tier.discount}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: "4px", padding: "8px 10px" }}>
                  <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.38rem", letterSpacing: "0.1em", marginBottom: "3px" }}>ALIʻI PLAN</p>
                  <p style={{ color: tier.color, fontSize: "0.65rem", fontFamily: "'JetBrains Mono', monospace" }}>${tier.alii.toLocaleString()}</p>
                  <p style={{ color: "rgba(232,224,208,0.2)", fontSize: "0.38rem" }}>/month</p>
                </div>
                <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: "4px", padding: "8px 10px" }}>
                  <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.38rem", letterSpacing: "0.1em", marginBottom: "3px" }}>KAMAʻĀINA PLAN</p>
                  <p style={{ color: tier.color, fontSize: "0.65rem", fontFamily: "'JetBrains Mono', monospace" }}>${tier.kamaaina.toLocaleString()}</p>
                  <p style={{ color: "rgba(232,224,208,0.2)", fontSize: "0.38rem" }}>/month</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active member count note */}
      <div style={{
        background: "rgba(0,0,0,0.2)",
        border: "1px solid rgba(255,255,255,0.05)",
        borderRadius: "8px",
        padding: "14px 16px",
      }}>
        <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.45rem", lineHeight: 1.7 }}>
          Active members available for service routes: <span style={{ color: "#3fb950" }}>{activeMembers.length}</span><br />
          Nā Koa on active route: <span style={{ color: "#3fb950" }}>{activeMembers.filter(a => a.tier === "nakoa").length}</span> ·
          Mana supervisors: <span style={{ color: BLUE }}> {activeMembers.filter(a => a.tier === "mana").length}</span><br />
          Revenue data is mock. Connect Stripe or payment processor for live MRR.
        </p>
      </div>
    </div>
  );
}