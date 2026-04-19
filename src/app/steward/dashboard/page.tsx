"use client";
import { useState, useEffect, useCallback } from "react";

const BG = "#04060a";
const GOLD = "#b08e50";
const GOLD_40 = "rgba(176,142,80,0.4)";
const GOLD_20 = "rgba(176,142,80,0.2)";
const GOLD_10 = "rgba(176,142,80,0.1)";
const GREEN = "#3fb950";
const GREEN_20 = "rgba(63,185,80,0.2)";
const RED = "#f85149";
const RED_20 = "rgba(248,81,73,0.2)";
const BLUE = "#58a6ff";
const BLUE_20 = "rgba(88,166,255,0.2)";
const PURPLE = "#7c6fd0";
const PURPLE_20 = "rgba(124,111,208,0.2)";

type Tab = "overview" | "applications" | "news" | "911" | "checkins";

type Application = {
  id: string; zip_cluster: string; handle: string; essay: string;
  word_count: number; xi_score: number; xi_tier: string;
  xi_recommendation: string; xi_signals: string[];
  status: string; seat_type: string | null;
  created_at: string;
};

type NewsItem = {
  id: string; zip_cluster: string; headline: string; body: string;
  source_name: string; category: string; is_approved: boolean;
  published_at: string | null; created_at: string;
};

type Alert911 = {
  id: string; zip_cluster: string; brother_handle: string;
  emergency_type: string; message: string; severity: string;
  steward_notified: boolean; resolved: boolean; created_at: string;
};

type CheckinStat = { check_in_date: string; count: number };

async function stewardAction(table: string, id: string, data: object) {
  await fetch("/api/steward/action", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ table, id, data }),
  });
}

function tierColor(tier: string) {
  if (tier === "alii") return GOLD;
  if (tier === "mana") return PURPLE;
  return GREEN;
}

function scoreBar(score: number) {
  const pct = `${score}%`;
  const color = score >= 70 ? GOLD : score >= 40 ? PURPLE : GREEN;
  return (
    <div style={{ height: 4, background: "#1a1a2e", borderRadius: 2, marginTop: 6 }}>
      <div style={{ width: pct, height: "100%", background: color, borderRadius: 2, transition: "width 0.5s" }} />
    </div>
  );
}

export default function StewardDashboard() {
  const [tab, setTab] = useState<Tab>("overview");
  const [apps, setApps] = useState<Application[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [alerts, setAlerts] = useState<Alert911[]>([]);
  const [checkins, setCheckins] = useState<CheckinStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/steward/cluster-data");
      const data = await res.json();
      setApps(Array.isArray(data.apps) ? data.apps : []);
      setNews(Array.isArray(data.news) ? data.news : []);
      setAlerts(Array.isArray(data.alerts) ? data.alerts : []);
      // Aggregate checkins by date
      const byDate: Record<string, number> = {};
      if (Array.isArray(data.checkins)) {
        data.checkins.forEach((c: { check_in_date: string }) => {
          byDate[c.check_in_date] = (byDate[c.check_in_date] || 0) + 1;
        });
      }
      setCheckins(
        Object.entries(byDate)
          .map(([d, c]) => ({ check_in_date: d, count: c }))
          .sort((a, b) => b.check_in_date.localeCompare(a.check_in_date))
      );
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function approveApp(id: string, seat: string) {
    await stewardAction("steward_applications", id, {
      status: seat === "primary" ? "approved" : "co-steward",
      seat_type: seat,
      approved_by: "steward_0001",
      approved_at: new Date().toISOString(),
    });
    setActionMsg(`✓ Approved as ${seat}`);
    setTimeout(() => setActionMsg(""), 2500);
    load();
  }

  async function denyApp(id: string) {
    await stewardAction("steward_applications", id, { status: "denied" });
    setActionMsg("✗ Application denied");
    setTimeout(() => setActionMsg(""), 2500);
    load();
  }

  async function approveNews(id: string) {
    await stewardAction("cluster_news", id, {
      is_approved: true,
      approved_by: "steward_0001",
      published_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 7 * 86400000).toISOString(),
    });
    setActionMsg("✓ News published to 411 feed");
    setTimeout(() => setActionMsg(""), 2500);
    load();
  }

  async function resolve911(id: string) {
    await stewardAction("cluster_911", id, {
      resolved: true,
      resolved_at: new Date().toISOString(),
    });
    setActionMsg("✓ Alert resolved");
    setTimeout(() => setActionMsg(""), 2500);
    load();
  }

  const pendingApps = apps.filter(a => a.status === "pending");
  const approvedApps = apps.filter(a => ["approved", "co-steward"].includes(a.status));
  const pendingNews = news.filter(n => !n.is_approved);
  const openAlerts = alerts.filter(a => !a.resolved);
  const todayCheckins = checkins[0]?.count || 0;
  const totalCheckins = checkins.reduce((s, c) => s + c.count, 0);

  const TABS: { key: Tab; label: string; badge?: number; color?: string }[] = [
    { key: "overview", label: "OVERVIEW" },
    { key: "applications", label: "APPLICATIONS", badge: pendingApps.length, color: GOLD },
    { key: "news", label: "411 QUEUE", badge: pendingNews.length, color: BLUE },
    { key: "911", label: "911 ALERTS", badge: openAlerts.length, color: RED },
    { key: "checkins", label: "CHECK-INS" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: BG, color: "#e8dfc8", fontFamily: "'JetBrains Mono', monospace" }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #0a0c10; } ::-webkit-scrollbar-thumb { background: #2a2a3a; }
      `}</style>

      {/* Header */}
      <div style={{ padding: "20px 24px 0", borderBottom: `1px solid ${GOLD_20}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: "0.3em", color: GOLD_40, marginBottom: 4 }}>7G NET · STEWARD 0001</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: GOLD, letterSpacing: "0.05em" }}>CLUSTER DASHBOARD</div>
            <div style={{ fontSize: 11, color: GOLD_40, marginTop: 2 }}>ZIP 96792 · Waianae, Oʻahu · West Oahu Founding Cluster</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {actionMsg && (
              <div style={{ fontSize: 11, color: GREEN, background: GREEN_20, padding: "6px 12px", borderRadius: 4, animation: "fadeUp 0.3s ease" }}>
                {actionMsg}
              </div>
            )}
            <button onClick={load} style={{ background: GOLD_10, border: `1px solid ${GOLD_40}`, color: GOLD, fontSize: 10, padding: "6px 12px", borderRadius: 4, cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em" }}>
              ↻ REFRESH
            </button>
            <a href="/steward" style={{ background: "none", border: `1px solid ${GOLD_20}`, color: GOLD_40, fontSize: 10, padding: "6px 12px", borderRadius: 4, textDecoration: "none", letterSpacing: "0.1em" }}>
              ← COMMAND
            </a>
          </div>
        </div>

        {/* Tab nav */}
        <div style={{ display: "flex", gap: 0, overflowX: "auto" }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              background: "none", border: "none", borderBottom: `2px solid ${tab === t.key ? GOLD : "transparent"}`,
              color: tab === t.key ? GOLD : GOLD_40, padding: "8px 16px", cursor: "pointer",
              fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.15em",
              whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6,
            }}>
              {t.label}
              {t.badge ? (
                <span style={{ background: t.color || GOLD, color: "#000", fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 8, minWidth: 16, textAlign: "center" }}>
                  {t.badge}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "24px", maxWidth: 960, margin: "0 auto" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: GOLD_40, fontSize: 12, letterSpacing: "0.2em" }}>
            XI LOADING DATA...
          </div>
        ) : (

          <>
            {/* ── OVERVIEW ── */}
            {tab === "overview" && (
              <div style={{ animation: "fadeUp 0.3s ease" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 24 }}>
                  {[
                    { label: "PENDING APPS", value: pendingApps.length, color: GOLD, bg: GOLD_10, border: GOLD_20 },
                    { label: "SEATED STEWARDS", value: approvedApps.length, color: GREEN, bg: GREEN_20, border: GREEN_20 },
                    { label: "411 IN QUEUE", value: pendingNews.length, color: BLUE, bg: BLUE_20, border: BLUE_20 },
                    { label: "OPEN 911 ALERTS", value: openAlerts.length, color: RED, bg: RED_20, border: RED_20 },
                    { label: "CHECK-INS TODAY", value: todayCheckins, color: PURPLE, bg: PURPLE_20, border: PURPLE_20 },
                    { label: "TOTAL CHECK-INS", value: totalCheckins, color: GOLD_40, bg: GOLD_10, border: GOLD_20 },
                  ].map(s => (
                    <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 8, padding: "16px 20px" }}>
                      <div style={{ fontSize: 28, fontWeight: 700, color: s.color, fontFamily: "'Georgia', serif" }}>{s.value}</div>
                      <div style={{ fontSize: 9, color: s.color, letterSpacing: "0.15em", marginTop: 4, opacity: 0.7 }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Recent applications preview */}
                {pendingApps.length > 0 && (
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 10, color: GOLD, letterSpacing: "0.2em", marginBottom: 10 }}>AWAITING YOUR REVIEW</div>
                    {pendingApps.slice(0, 3).map(a => (
                      <div key={a.id} style={{ background: GOLD_10, border: `1px solid ${GOLD_20}`, borderRadius: 8, padding: "14px 16px", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                          <span style={{ color: GOLD, fontSize: 13, fontWeight: 700 }}>{a.handle}</span>
                          <span style={{ color: GOLD_40, fontSize: 11, marginLeft: 12 }}>ZIP {a.zip_cluster}</span>
                          <span style={{ color: tierColor(a.xi_tier), fontSize: 10, marginLeft: 8, letterSpacing: "0.1em" }}>{a.xi_tier?.toUpperCase()}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 18, fontWeight: 700, color: tierColor(a.xi_tier) }}>{a.xi_score}</span>
                          <button onClick={() => setTab("applications")} style={{ background: GOLD, border: "none", color: "#000", fontSize: 9, padding: "5px 10px", borderRadius: 4, cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", fontWeight: 700 }}>
                            REVIEW →
                          </button>
                        </div>
                      </div>
                    ))}
                    {pendingApps.length > 3 && (
                      <button onClick={() => setTab("applications")} style={{ background: "none", border: `1px solid ${GOLD_20}`, color: GOLD_40, fontSize: 10, padding: "8px 16px", borderRadius: 4, cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", width: "100%" }}>
                        + {pendingApps.length - 3} more applications
                      </button>
                    )}
                  </div>
                )}

                {/* Open 911s */}
                {openAlerts.length > 0 && (
                  <div>
                    <div style={{ fontSize: 10, color: RED, letterSpacing: "0.2em", marginBottom: 10 }}>OPEN 911 ALERTS</div>
                    {openAlerts.slice(0, 3).map(a => (
                      <div key={a.id} style={{ background: RED_20, border: `1px solid ${RED}44`, borderRadius: 8, padding: "12px 16px", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                          <span style={{ color: RED, fontSize: 11, letterSpacing: "0.1em", fontWeight: 700 }}>{a.emergency_type.toUpperCase()}</span>
                          <span style={{ color: "rgba(232,223,200,0.5)", fontSize: 11, marginLeft: 12 }}>{a.message.slice(0, 60)}{a.message.length > 60 ? "..." : ""}</span>
                        </div>
                        <button onClick={() => setTab("911")} style={{ background: RED, border: "none", color: "#fff", fontSize: 9, padding: "5px 10px", borderRadius: 4, cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em" }}>
                          RESPOND →
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {pendingApps.length === 0 && openAlerts.length === 0 && (
                  <div style={{ textAlign: "center", padding: "40px 0", color: GOLD_40, fontSize: 12 }}>
                    All clear. No pending actions.
                  </div>
                )}
              </div>
            )}

            {/* ── APPLICATIONS ── */}
            {tab === "applications" && (
              <div style={{ animation: "fadeUp 0.3s ease" }}>
                <div style={{ fontSize: 10, color: GOLD_40, letterSpacing: "0.2em", marginBottom: 16 }}>
                  {apps.length} TOTAL · {pendingApps.length} PENDING · {approvedApps.length} SEATED
                </div>
                {apps.length === 0 && (
                  <div style={{ textAlign: "center", padding: 60, color: GOLD_40 }}>No applications yet. Share makoa.live/steward/apply.</div>
                )}
                {apps.map(a => {
                  const isOpen = expanded === a.id;
                  const statusColor = a.status === "approved" ? GREEN : a.status === "co-steward" ? BLUE : a.status === "denied" ? RED : GOLD;
                  return (
                    <div key={a.id} style={{ background: GOLD_10, border: `1px solid ${GOLD_20}`, borderRadius: 8, marginBottom: 10, overflow: "hidden" }}>
                      {/* Row */}
                      <div
                        onClick={() => setExpanded(isOpen ? null : a.id)}
                        style={{ padding: "14px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}
                      >
                        {/* Score */}
                        <div style={{ minWidth: 44, textAlign: "center" }}>
                          <div style={{ fontSize: 20, fontWeight: 700, color: tierColor(a.xi_tier), fontFamily: "'Georgia', serif" }}>{a.xi_score}</div>
                          <div style={{ fontSize: 8, color: tierColor(a.xi_tier), letterSpacing: "0.1em" }}>{a.xi_tier?.toUpperCase()}</div>
                        </div>
                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                            <span style={{ color: "#e8dfc8", fontWeight: 700, fontSize: 13 }}>{a.handle}</span>
                            <span style={{ color: GOLD_40, fontSize: 11 }}>ZIP {a.zip_cluster}</span>
                            <span style={{ color: statusColor, fontSize: 9, letterSpacing: "0.1em", background: `${statusColor}22`, padding: "2px 6px", borderRadius: 3 }}>
                              {a.status.toUpperCase()}
                            </span>
                          </div>
                          <div style={{ fontSize: 10, color: GOLD_40, marginTop: 3 }}>{a.xi_recommendation}</div>
                          {scoreBar(a.xi_score)}
                        </div>
                        <div style={{ color: GOLD_40, fontSize: 12 }}>{isOpen ? "▲" : "▼"}</div>
                      </div>

                      {/* Expanded */}
                      {isOpen && (
                        <div style={{ padding: "0 16px 16px", borderTop: `1px solid ${GOLD_20}` }}>
                          <div style={{ fontSize: 10, color: GOLD_40, letterSpacing: "0.15em", margin: "12px 0 8px" }}>ESSAY · {a.word_count} WORDS</div>
                          <div style={{ fontSize: 12, color: "rgba(232,223,200,0.7)", lineHeight: 1.7, background: "#080b10", padding: "12px 14px", borderRadius: 6, marginBottom: 12 }}>
                            {a.essay}
                          </div>
                          {a.xi_signals?.length > 0 && (
                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                              {a.xi_signals.map((s, i) => (
                                <span key={i} style={{ fontSize: 9, color: GOLD_40, background: GOLD_10, padding: "3px 8px", borderRadius: 3 }}>{s}</span>
                              ))}
                            </div>
                          )}
                          {a.status === "pending" && (
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                              <button onClick={() => approveApp(a.id, "primary")} style={{ background: GOLD, border: "none", color: "#000", fontSize: 10, padding: "8px 14px", borderRadius: 4, cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, letterSpacing: "0.08em" }}>
                                ✓ PRIMARY STEWARD
                              </button>
                              <button onClick={() => approveApp(a.id, "co_steward_1")} style={{ background: BLUE_20, border: `1px solid ${BLUE}44`, color: BLUE, fontSize: 10, padding: "8px 14px", borderRadius: 4, cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em" }}>
                                ✓ CO-STEWARD
                              </button>
                              <button onClick={() => denyApp(a.id)} style={{ background: "none", border: `1px solid ${RED}44`, color: RED, fontSize: 10, padding: "8px 14px", borderRadius: 4, cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em" }}>
                                ✗ DENY
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── 411 NEWS QUEUE ── */}
            {tab === "news" && (
              <div style={{ animation: "fadeUp 0.3s ease" }}>
                <div style={{ fontSize: 10, color: GOLD_40, letterSpacing: "0.2em", marginBottom: 16 }}>
                  {pendingNews.length} PENDING APPROVAL · {news.filter(n => n.is_approved).length} PUBLISHED
                </div>
                {news.length === 0 && (
                  <div style={{ textAlign: "center", padding: 60, color: GOLD_40 }}>No news submissions yet.</div>
                )}
                {news.map(n => (
                  <div key={n.id} style={{ background: n.is_approved ? "#080b10" : BLUE_20, border: `1px solid ${n.is_approved ? "#1a1a2e" : `${BLUE}33`}`, borderRadius: 8, padding: "14px 16px", marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 9, color: n.is_approved ? GREEN : BLUE, letterSpacing: "0.1em", background: n.is_approved ? GREEN_20 : BLUE_20, padding: "2px 6px", borderRadius: 3 }}>
                            {n.is_approved ? "◉ LIVE" : "◌ PENDING"}
                          </span>
                          <span style={{ fontSize: 9, color: GOLD_40 }}>ZIP {n.zip_cluster}</span>
                          <span style={{ fontSize: 9, color: GOLD_40 }}>{n.source_name}</span>
                          <span style={{ fontSize: 9, color: GOLD_40 }}>{n.category}</span>
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#e8dfc8", marginBottom: 4 }}>{n.headline}</div>
                        {n.body && <div style={{ fontSize: 12, color: "rgba(232,223,200,0.5)", lineHeight: 1.6 }}>{n.body}</div>}
                      </div>
                      {!n.is_approved && (
                        <button onClick={() => approveNews(n.id)} style={{ background: BLUE, border: "none", color: "#fff", fontSize: 10, padding: "7px 12px", borderRadius: 4, cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", flexShrink: 0 }}>
                          PUBLISH →
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── 911 ALERTS ── */}
            {tab === "911" && (
              <div style={{ animation: "fadeUp 0.3s ease" }}>
                <div style={{ fontSize: 10, color: GOLD_40, letterSpacing: "0.2em", marginBottom: 16 }}>
                  {openAlerts.length} OPEN · {alerts.filter(a => a.resolved).length} RESOLVED
                </div>
                {alerts.length === 0 && (
                  <div style={{ textAlign: "center", padding: 60, color: GOLD_40 }}>No alerts. Brotherhood is good.</div>
                )}
                {alerts.map(a => {
                  const sevColor = a.severity === "critical" ? RED : a.severity === "high" ? "#ff9f43" : a.severity === "medium" ? GOLD : GOLD_40;
                  return (
                    <div key={a.id} style={{ background: a.resolved ? "#080b10" : RED_20, border: `1px solid ${a.resolved ? "#1a1a2e" : `${RED}44`}`, borderRadius: 8, padding: "14px 16px", marginBottom: 10 }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6, flexWrap: "wrap" }}>
                            <span style={{ fontSize: 9, color: sevColor, letterSpacing: "0.1em", background: `${sevColor}22`, padding: "2px 6px", borderRadius: 3 }}>
                              {a.severity.toUpperCase()}
                            </span>
                            <span style={{ fontSize: 9, color: a.resolved ? GOLD_40 : RED, letterSpacing: "0.08em" }}>
                              {a.emergency_type.toUpperCase()}
                            </span>
                            <span style={{ fontSize: 9, color: GOLD_40 }}>ZIP {a.zip_cluster}</span>
                            <span style={{ fontSize: 9, color: GOLD_40 }}>{a.brother_handle}</span>
                          </div>
                          <div style={{ fontSize: 13, color: "#e8dfc8", lineHeight: 1.6 }}>{a.message}</div>
                          <div style={{ fontSize: 10, color: GOLD_40, marginTop: 6 }}>
                            {new Date(a.created_at).toLocaleString()}
                            {a.resolved && <span style={{ color: GREEN, marginLeft: 12 }}>◉ RESOLVED</span>}
                          </div>
                        </div>
                        {!a.resolved && (
                          <button onClick={() => resolve911(a.id)} style={{ background: GREEN_20, border: `1px solid ${GREEN}44`, color: GREEN, fontSize: 10, padding: "7px 12px", borderRadius: 4, cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", flexShrink: 0 }}>
                            RESOLVE ✓
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── CHECK-INS ── */}
            {tab === "checkins" && (
              <div style={{ animation: "fadeUp 0.3s ease" }}>
                <div style={{ fontSize: 10, color: GOLD_40, letterSpacing: "0.2em", marginBottom: 16 }}>
                  {totalCheckins} TOTAL CHECK-INS · {todayCheckins} TODAY
                </div>
                {checkins.length === 0 && (
                  <div style={{ textAlign: "center", padding: 60, color: GOLD_40 }}>No check-ins yet. Brothers need to open the app.</div>
                )}
                <div style={{ display: "grid", gap: 8 }}>
                  {checkins.map(c => (
                    <div key={c.check_in_date} style={{ background: GOLD_10, border: `1px solid ${GOLD_20}`, borderRadius: 8, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ fontSize: 12, color: "#e8dfc8" }}>{c.check_in_date}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ height: 4, width: `${Math.min(c.count * 20, 120)}px`, background: GOLD, borderRadius: 2 }} />
                        <div style={{ fontSize: 18, fontWeight: 700, color: GOLD, fontFamily: "'Georgia', serif", minWidth: 28, textAlign: "right" }}>{c.count}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
