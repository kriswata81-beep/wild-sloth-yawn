"use client";

import { useState } from "react";
import {
  DEFAULT_ADMIN_STATE,
  SEAT_CAPS,
  getSeatInfo,
  STRIPE_LINKS,
  TIER_CONFIG,
  type AdminState,
  type Tier,
  type CounterMode,
} from "@/lib/makoa";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.35)";
const BLUE = "#58a6ff";
const GREEN = "#3fb950";
const RED = "#f85149";
const BG = "#04060a";

const TIERS: Tier[] = ["alii", "mana", "nakoa"];

function StatCard({ label, value, sub, color = GOLD }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div style={{ background: "#060810", border: "0.5px solid rgba(176,142,80,0.1)", borderRadius: 10, padding: "14px 14px" }}>
      <p style={{ color: "rgba(176,142,80,0.35)", fontSize: "0.5rem", letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 6px" }}>{label}</p>
      <p style={{ color, fontSize: "1.6rem", fontWeight: 700, fontFamily: "var(--font-jetbrains)", margin: "0 0 2px", lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ color: "rgba(176,142,80,0.25)", fontSize: "0.52rem", margin: 0 }}>{sub}</p>}
    </div>
  );
}

function SeatMeter({ tier, remaining, total, color }: { tier: string; remaining: number; total: number; color: string }) {
  const pct = Math.max(0, (remaining / total) * 100);
  const info = getSeatInfo(tier as Tier, remaining);
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ color: GOLD, fontSize: "0.62rem", fontFamily: "var(--font-jetbrains)" }}>{tier.charAt(0).toUpperCase() + tier.slice(1)}</span>
        <span style={{ color: info.urgencyColor, fontSize: "0.6rem", fontFamily: "var(--font-jetbrains)" }}>{info.label}</span>
      </div>
      <div style={{ height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${100 - pct}%`, background: color,
          borderRadius: 3, transition: "width 0.5s",
        }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
        <span style={{ color: "rgba(176,142,80,0.25)", fontSize: "0.48rem" }}>{total - remaining} claimed</span>
        <span style={{ color: "rgba(176,142,80,0.25)", fontSize: "0.48rem" }}>{remaining} remaining of {total}</span>
      </div>
    </div>
  );
}

interface AdminPageProps {
  onExit: () => void;
}

export default function AdminPage({ onExit }: AdminPageProps) {
  const [state, setState] = useState<AdminState>(DEFAULT_ADMIN_STATE);
  const [activeTab, setActiveTab] = useState<"overview" | "seats" | "stripe" | "telegram">("overview");

  const updateSeats = (tier: Tier, delta: number) => {
    setState((s) => ({
      ...s,
      deposits: { ...s.deposits, [tier]: Math.max(0, Math.min(SEAT_CAPS[tier], s.deposits[tier] + delta)) },
    }));
  };

  const toggleMode = (mode: CounterMode) => setState((s) => ({ ...s, counterMode: mode }));

  const remaining = {
    alii: SEAT_CAPS.alii - state.deposits.alii,
    mana: SEAT_CAPS.mana - state.deposits.mana,
    nakoa: SEAT_CAPS.nakoa - state.deposits.nakoa,
  };

  const tabs = ["overview", "seats", "stripe", "telegram"] as const;

  return (
    <div style={{ background: BG, minHeight: "100dvh", fontFamily: "var(--font-jetbrains)", overflowX: "hidden" }}>

      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at 50% 10%, rgba(83,74,183,0.06) 0%, transparent 60%)",
      }} />

      {/* Header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 40,
        background: "rgba(4,6,10,0.97)", backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(83,74,183,0.2)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 16px", height: 48,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#534AB7", boxShadow: "0 0 8px #534AB7" }} />
          <span style={{ color: "#534AB7", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>XI Admin · Mākoa</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            display: "flex", gap: 4, background: "#060810",
            border: "0.5px solid rgba(176,142,80,0.1)", borderRadius: 6, padding: "3px",
          }}>
            {(["real", "simulated"] as CounterMode[]).map((m) => (
              <button
                key={m}
                onClick={() => toggleMode(m)}
                style={{
                  background: state.counterMode === m ? (m === "real" ? GREEN : "#534AB7") : "transparent",
                  color: state.counterMode === m ? "#000" : "rgba(176,142,80,0.3)",
                  border: "none", padding: "4px 10px", borderRadius: 4, cursor: "pointer",
                  fontFamily: "var(--font-jetbrains)", fontSize: "0.48rem",
                  letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700,
                  transition: "all 0.2s",
                }}
              >
                {m}
              </button>
            ))}
          </div>
          <button onClick={onExit} style={{ background: "none", border: "none", color: GOLD_DIM, cursor: "pointer", fontSize: "0.58rem", letterSpacing: "0.1em" }}>
            EXIT →
          </button>
        </div>
      </div>

      {/* Tab nav */}
      <div style={{ display: "flex", borderBottom: "1px solid rgba(176,142,80,0.08)", padding: "0 16px" }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: activeTab === tab ? GOLD : "rgba(176,142,80,0.3)",
              fontFamily: "var(--font-jetbrains)", fontSize: "0.52rem",
              letterSpacing: "0.12em", textTransform: "uppercase",
              padding: "12px 12px 10px",
              borderBottom: activeTab === tab ? `2px solid ${GOLD}` : "2px solid transparent",
              transition: "color 0.2s",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px 16px 40px", position: "relative", zIndex: 1 }}>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === "overview" && (
          <div>
            <p style={{ color: GOLD_DIM, fontSize: "0.52rem", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 14px" }}>
              Formation Overview · {state.counterMode === "real" ? "Real Mode" : "Simulated Mode"}
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              <StatCard label="Total Pledges" value={state.pledgeCount} sub="$9.99 processed" color={GOLD} />
              <StatCard label="Accepted" value={state.acceptedCount} sub="by XI committee" color={GREEN} />
              <StatCard label="Deposits Paid" value={state.deposits.alii + state.deposits.mana + state.deposits.nakoa} sub="across all tiers" color={BLUE} />
              <StatCard label="Telegram Queue" value={state.telegramQueue} sub="pending verification" color="#f0a030" />
            </div>

            {/* Deposits by tier */}
            <div style={{ background: "#060810", border: "0.5px solid rgba(176,142,80,0.1)", borderRadius: 10, padding: "16px", marginBottom: 16 }}>
              <p style={{ color: GOLD_DIM, fontSize: "0.52rem", letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 14px" }}>Deposits by Tier</p>
              {TIERS.map((t) => {
                const cfg = TIER_CONFIG[t];
                return (
                  <div key={t} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: "0.8rem" }}>{cfg.icon}</span>
                      <span style={{ color: cfg.color, fontSize: "0.62rem" }}>{cfg.label}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ color: GOLD, fontSize: "0.65rem", fontWeight: 700 }}>{state.deposits[t]}</span>
                      <span style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.55rem" }}>
                        ${(state.deposits[t] * cfg.deposit).toLocaleString()} collected
                      </span>
                    </div>
                  </div>
                );
              })}
              <div style={{ height: 1, background: "rgba(176,142,80,0.08)", margin: "10px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: GOLD_DIM, fontSize: "0.6rem" }}>Total deposit revenue</span>
                <span style={{ color: GOLD, fontSize: "0.65rem", fontWeight: 700 }}>
                  ${(
                    state.deposits.alii * TIER_CONFIG.alii.deposit +
                    state.deposits.mana * TIER_CONFIG.mana.deposit +
                    state.deposits.nakoa * TIER_CONFIG.nakoa.deposit
                  ).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Waitlist */}
            <div style={{ background: "#060810", border: "0.5px solid rgba(176,142,80,0.1)", borderRadius: 10, padding: "16px", marginBottom: 16 }}>
              <p style={{ color: GOLD_DIM, fontSize: "0.52rem", letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 12px" }}>Waitlist</p>
              {(["alii", "mana"] as const).map((t) => (
                <div key={t} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ color: TIER_CONFIG[t].color, fontSize: "0.62rem" }}>{TIER_CONFIG[t].label} Priority Waitlist</span>
                  <span style={{ color: GOLD, fontSize: "0.62rem", fontWeight: 700 }}>{state.waitlist[t]} reserved</span>
                </div>
              ))}
            </div>

            {/* Region breakdown */}
            <div style={{ background: "#060810", border: "0.5px solid rgba(176,142,80,0.1)", borderRadius: 10, padding: "16px" }}>
              <p style={{ color: GOLD_DIM, fontSize: "0.52rem", letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 12px" }}>Region Breakdown</p>
              {Object.entries(state.regions).map(([region, count]) => (
                <div key={region} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ color: "rgba(176,142,80,0.55)", fontSize: "0.6rem" }}>{region}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 60, height: 3, background: "rgba(176,142,80,0.08)", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${(count / Math.max(...Object.values(state.regions))) * 100}%`, background: GOLD, borderRadius: 2 }} />
                    </div>
                    <span style={{ color: GOLD, fontSize: "0.6rem", fontWeight: 700, minWidth: 16, textAlign: "right" }}>{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SEATS TAB ── */}
        {activeTab === "seats" && (
          <div>
            <p style={{ color: GOLD_DIM, fontSize: "0.52rem", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 14px" }}>
              Seat Counter Management · {state.counterMode === "simulated" ? "Simulated" : "Real"} Mode
            </p>

            {state.counterMode === "simulated" && (
              <div style={{ background: "rgba(83,74,183,0.06)", border: "1px solid rgba(83,74,183,0.2)", borderRadius: 10, padding: "12px 14px", marginBottom: 16 }}>
                <p style={{ color: "#534AB7", fontSize: "0.58rem", margin: "0 0 4px" }}>Simulated Mode Active</p>
                <p style={{ color: "rgba(176,142,80,0.35)", fontSize: "0.55rem", margin: 0, lineHeight: 1.6 }}>
                  Adjust counters manually below. Switch to Real Mode to pull live data from Stripe deposit payments.
                </p>
              </div>
            )}

            {state.counterMode === "real" && (
              <div style={{ background: "rgba(63,185,80,0.04)", border: "1px solid rgba(63,185,80,0.2)", borderRadius: 10, padding: "12px 14px", marginBottom: 16 }}>
                <p style={{ color: GREEN, fontSize: "0.58rem", margin: "0 0 4px" }}>Real Mode Active</p>
                <p style={{ color: "rgba(176,142,80,0.35)", fontSize: "0.55rem", margin: 0, lineHeight: 1.6 }}>
                  Seat counts reflect actual Stripe deposit payments. Connect Stripe webhook to auto-sync.
                </p>
              </div>
            )}

            {TIERS.map((t) => {
              const cfg = TIER_CONFIG[t];
              const rem = remaining[t];
              const info = getSeatInfo(t, rem);
              return (
                <div key={t} style={{ background: "#060810", border: `1px solid ${cfg.color}18`, borderRadius: 10, padding: "16px", marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: "1rem" }}>{cfg.icon}</span>
                      <span className="font-cormorant" style={{ fontStyle: "italic", color: cfg.color, fontSize: "1.2rem" }}>{cfg.label}</span>
                    </div>
                    <span style={{ color: info.urgencyColor, fontSize: "0.58rem", letterSpacing: "0.08em" }}>{info.label}</span>
                  </div>

                  <SeatMeter tier={t} remaining={rem} total={SEAT_CAPS[t]} color={cfg.color} />

                  {state.counterMode === "simulated" && (
                    <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                      <button
                        onClick={() => updateSeats(t, -1)}
                        style={{ flex: 1, background: "rgba(248,81,73,0.1)", border: "1px solid rgba(248,81,73,0.2)", color: RED, padding: "8px", borderRadius: 6, cursor: "pointer", fontFamily: "var(--font-jetbrains)", fontSize: "0.6rem" }}
                      >
                        − Claim Seat
                      </button>
                      <button
                        onClick={() => updateSeats(t, 1)}
                        style={{ flex: 1, background: "rgba(63,185,80,0.08)", border: "1px solid rgba(63,185,80,0.2)", color: GREEN, padding: "8px", borderRadius: 6, cursor: "pointer", fontFamily: "var(--font-jetbrains)", fontSize: "0.6rem" }}
                      >
                        + Release Seat
                      </button>
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

        {/* ── STRIPE TAB ── */}
        {activeTab === "stripe" && (
          <div>
            <p style={{ color: GOLD_DIM, fontSize: "0.52rem", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 14px" }}>
              Stripe Payment Links
            </p>

            {Object.entries(STRIPE_LINKS).map(([key, link]) => (
              <div key={key} style={{ background: "#060810", border: "0.5px solid rgba(176,142,80,0.08)", borderRadius: 10, padding: "14px", marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <div>
                    <p style={{ color: GOLD, fontSize: "0.65rem", margin: "0 0 2px", fontWeight: 600 }}>{link.displayTitle}</p>
                    <p style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.5rem", margin: 0, fontFamily: "var(--font-jetbrains)" }}>{link.internalName}</p>
                  </div>
                  <span style={{ color: GOLD, fontSize: "0.7rem", fontWeight: 700, fontFamily: "var(--font-jetbrains)" }}>
                    ${("amount" in link) ? link.amount : "—"}
                    {"interval" in link && link.interval ? `/mo` : ""}
                  </span>
                </div>
                {"redirectAfter" in link && link.redirectAfter && (
                  <p style={{ color: "rgba(176,142,80,0.25)", fontSize: "0.5rem", margin: "4px 0 0" }}>
                    Redirect → {link.redirectAfter}
                  </p>
                )}
                {"note" in link && link.note && (
                  <p style={{ color: "rgba(176,142,80,0.2)", fontSize: "0.5rem", margin: "4px 0 0", lineHeight: 1.5 }}>
                    {link.note}
                  </p>
                )}
                <div style={{ marginTop: 8, background: "rgba(176,142,80,0.03)", borderRadius: 4, padding: "6px 8px" }}>
                  <p style={{ color: "rgba(176,142,80,0.2)", fontSize: "0.48rem", margin: 0, wordBreak: "break-all" }}>
                    {link.url}
                  </p>
                </div>
              </div>
            ))}

            <div style={{ background: "rgba(83,74,183,0.06)", border: "1px solid rgba(83,74,183,0.2)", borderRadius: 10, padding: "14px", marginTop: 8 }}>
              <p style={{ color: "#534AB7", fontSize: "0.58rem", margin: "0 0 6px" }}>To activate real Stripe links:</p>
              <p style={{ color: "rgba(176,142,80,0.35)", fontSize: "0.55rem", margin: 0, lineHeight: 1.7 }}>
                1. Create payment links in your Stripe dashboard<br />
                2. Replace placeholder URLs in <code style={{ color: GOLD }}>src/lib/makoa.ts</code><br />
                3. Set redirect URLs in Stripe to match the redirectAfter values<br />
                4. Add metadata fields to each payment link<br />
                5. Connect Stripe webhook for real-time seat counter updates
              </p>
            </div>
          </div>
        )}

        {/* ── TELEGRAM TAB ── */}
        {activeTab === "telegram" && (
          <div>
            <p style={{ color: GOLD_DIM, fontSize: "0.52rem", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 14px" }}>
              Telegram System
            </p>

            {/* Verification queue */}
            <div style={{ background: "#060810", border: "1px solid rgba(240,160,48,0.2)", borderRadius: 10, padding: "16px", marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <p style={{ color: "#f0a030", fontSize: "0.58rem", margin: 0, letterSpacing: "0.1em" }}>Verification Queue</p>
                <span style={{ color: "#f0a030", fontSize: "1rem", fontWeight: 700 }}>{state.telegramQueue}</span>
              </div>
              <p style={{ color: "rgba(176,142,80,0.35)", fontSize: "0.55rem", margin: "0 0 10px", lineHeight: 1.6 }}>
                Members who joined Telegram but could not be auto-verified. Requires manual admin review.
              </p>
              <button
                onClick={() => setState(s => ({ ...s, telegramQueue: Math.max(0, s.telegramQueue - 1) }))}
                style={{ background: "rgba(240,160,48,0.1)", border: "1px solid rgba(240,160,48,0.2)", color: "#f0a030", padding: "8px 14px", borderRadius: 6, cursor: "pointer", fontFamily: "var(--font-jetbrains)", fontSize: "0.58rem", letterSpacing: "0.1em" }}
              >
                MARK ONE RESOLVED
              </button>
            </div>

            {/* Bot flow reference */}
            <div style={{ background: "#060810", border: "0.5px solid rgba(176,142,80,0.08)", borderRadius: 10, padding: "16px", marginBottom: 14 }}>
              <p style={{ color: GOLD_DIM, fontSize: "0.52rem", letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 12px" }}>Bot Entry Flow</p>
              {[
                { step: "1", text: "Welcome message sent on join" },
                { step: "2", text: "Bot asks: Enter email used during payment" },
                { step: "3", text: "Bot matches against deposit record" },
                { step: "4", text: "If match: reads tier, zip, name, application_id" },
                { step: "5", text: "Bot sends placement: tier + region assignment" },
                { step: "6", text: "Routes to tier group + regional cluster" },
                { step: "7", text: "Final: formation channel open message" },
              ].map(({ step, text }) => (
                <div key={step} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(176,142,80,0.08)", border: "0.5px solid rgba(176,142,80,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ color: GOLD_DIM, fontSize: "0.48rem" }}>{step}</span>
                  </div>
                  <span style={{ color: "rgba(176,142,80,0.5)", fontSize: "0.6rem", lineHeight: 1.5 }}>{text}</span>
                </div>
              ))}
            </div>

            {/* Admin tagging fields */}
            <div style={{ background: "#060810", border: "0.5px solid rgba(176,142,80,0.08)", borderRadius: 10, padding: "16px" }}>
              <p style={{ color: GOLD_DIM, fontSize: "0.52rem", letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 12px" }}>Admin Tagging Fields</p>
              {[
                "telegram_handle", "full_name", "email", "tier", "zip_code",
                "region", "payment_verified", "routed_group", "onboarding_complete",
              ].map((field) => (
                <div key={field} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ color: "rgba(176,142,80,0.4)", fontSize: "0.58rem", fontFamily: "var(--font-jetbrains)" }}>{field}</span>
                  <span style={{ color: "rgba(176,142,80,0.2)", fontSize: "0.52rem" }}>string</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
