"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.5)";
const GOLD_FAINT = "rgba(176,142,80,0.08)";
const GOLD_20 = "rgba(176,142,80,0.2)";
const GOLD_40 = "rgba(176,142,80,0.4)";
const BG = "#04060a";

function dicebearUrl(seed: string) {
  return `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(seed || "makoa")}`;
}

type Member = {
  id: string;
  application_id: string;
  full_name: string;
  telegram_handle: string | null;
  tier: string;
  membership_status: string;
  current_rank: string;
  referral_code: string | null;
  referrals_count: number;
  successful_referrals_count: number;
  deposit_paid: boolean;
};

type Downline = {
  id: string;
  full_name: string;
  telegram_handle: string | null;
  tier: string;
  membership_status: string;
  deposit_paid: boolean;
};

const STONES = [
  {
    id: "army",
    name: "Army Stone",
    amount: 1000,
    badge: "ENTRY",
    down: 250,
    monthly: 62.5,
    months: 12,
    desc: "25% down · $62.50/mo × 12",
    filled: false,
  },
  {
    id: "warrior",
    name: "Warrior Stone",
    amount: 5000,
    badge: "STANDARD",
    down: 1250,
    monthly: 312.5,
    months: 12,
    desc: "25% down · $312.50/mo × 12",
    filled: false,
  },
  {
    id: "hale",
    name: "Hale Stone",
    amount: 10000,
    badge: "EQUITY",
    down: null,
    monthly: null,
    months: null,
    desc: "Malu Trust equity share",
    filled: true,
  },
];

const BENEFITS = [
  "Council seat — 12 seats max",
  "Founding gear at every 72",
  "Embassy Suites access — May 1",
  "Ice bath 4am — Flower Moon",
  "War Room access — full 72hrs",
  "Net-to-net B2B referral pool",
  "Zello 808 Command channel",
  "Aliʻi Chapter authority",
  "Hale Fund: 10% of all house MRR",
  "One house at capacity = $12,244/mo to Hale",
];

export default function AliiPortal() {
  const router = useRouter();
  const [member, setMember] = useState<Member | null>(null);
  const [downline, setDownline] = useState<Downline[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStone, setSelectedStone] = useState<string | null>(null);
  const [stoneConfirmed, setStoneConfirmed] = useState<string | null>(null);

  const loadData = useCallback(async (appId: string) => {
    const { data: m } = await supabase
      .from("applicants")
      .select("*")
      .eq("application_id", appId)
      .single();

    if (!m) { setLoading(false); return; }
    setMember(m as Member);

    if (m.referral_code) {
      const { data: dl } = await supabase
        .from("applicants")
        .select("id, full_name, telegram_handle, tier, membership_status, deposit_paid")
        .eq("referred_by_code", m.referral_code);
      setDownline((dl as Downline[]) || []);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const id = sessionStorage.getItem("makoa_app_id");
    if (!id) { router.replace("/portal/login"); return; }
    loadData(id);
  }, [router, loadData]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "28px", height: "28px", border: `1px solid ${GOLD}`, borderTop: "1px solid transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const handle = member?.telegram_handle || member?.full_name?.split(" ")[0] || "Brother";
  const avatarSeed = member?.telegram_handle || member?.full_name || "alii";

  return (
    <div style={{ minHeight: "100vh", background: BG, color: "#e8e0d0", fontFamily: "'JetBrains Mono', monospace", paddingBottom: 80 }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer {
          0% { box-shadow: 0 0 0px 0px rgba(176,142,80,0); }
          50% { box-shadow: 0 0 20px 4px rgba(176,142,80,0.15); }
          100% { box-shadow: 0 0 0px 0px rgba(176,142,80,0); }
        }
      `}</style>

      {/* Header */}
      <div style={{
        borderBottom: `1px solid ${GOLD_20}`,
        padding: "16px 20px",
        background: BG,
        position: "sticky", top: 0, zIndex: 10,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img src={dicebearUrl(avatarSeed)} alt={handle} style={{ width: "38px", height: "38px", borderRadius: "50%", border: `1px solid ${GOLD_40}`, background: "#0a0d12" }} />
          <div>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: GOLD, fontSize: "1.1rem", lineHeight: 1 }}>Net2Net</p>
            <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.2em", marginTop: "2px" }}>{handle} · Aliʻi</p>
          </div>
        </div>
        <span style={{ background: GOLD_FAINT, border: `1px solid ${GOLD_40}`, color: GOLD, fontSize: "0.4rem", padding: "3px 8px", borderRadius: "3px", letterSpacing: "0.15em" }}>
          👑 ALIʻI
        </span>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "24px 16px 40px" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: "32px", animation: "fadeUp 0.6s ease forwards" }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: GOLD, fontSize: "2rem", lineHeight: 1.2, marginBottom: "8px" }}>
            You lead.<br />This is the room<br />that matches you.
          </p>
          <p style={{ color: GOLD_DIM, fontSize: "0.48rem", letterSpacing: "0.15em" }}>
            Aliʻi · Council Seat · Founding Circle
          </p>
        </div>

        {/* Stone Investment Cards */}
        <Section title="Stone Investment" accent={GOLD}>
          <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.5rem", lineHeight: 1.7, marginBottom: "16px" }}>
            Your stone is your seat at the founding table. Choose your level of commitment to the Malu Trust.
          </p>
          <div style={{ display: "grid", gap: "12px" }}>
            {STONES.map((stone, i) => {
              const isSelected = selectedStone === stone.id;
              const isConfirmed = stoneConfirmed === stone.id;
              return (
                <div
                  key={stone.id}
                  onClick={() => setSelectedStone(isSelected ? null : stone.id)}
                  style={{
                    border: `1px solid ${stone.filled ? GOLD : isSelected ? GOLD : GOLD_40}`,
                    borderRadius: "10px",
                    padding: "18px",
                    background: stone.filled
                      ? `linear-gradient(135deg, rgba(176,142,80,0.12) 0%, rgba(176,142,80,0.06) 100%)`
                      : isSelected ? GOLD_FAINT : "rgba(10,13,18,0.8)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    animation: `fadeUp 0.6s ease ${0.1 + i * 0.1}s both`,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {stone.filled && (
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "linear-gradient(135deg, rgba(176,142,80,0.05) 0%, transparent 60%)",
                      pointerEvents: "none",
                      animation: "shimmer 3s ease-in-out infinite",
                    }} />
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: GOLD, fontSize: "1.2rem" }}>{stone.name}</p>
                        <span style={{ background: GOLD_FAINT, border: `1px solid ${GOLD_40}`, color: GOLD, fontSize: "0.38rem", padding: "2px 6px", borderRadius: "2px", letterSpacing: "0.15em" }}>{stone.badge}</span>
                      </div>
                      <p style={{ color: GOLD_DIM, fontSize: "0.48rem" }}>{stone.desc}</p>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0, marginLeft: "12px" }}>
                      <p style={{ color: GOLD, fontSize: "1rem", fontWeight: 600 }}>${stone.amount.toLocaleString()}</p>
                    </div>
                  </div>

                  {stone.down !== null && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "12px" }}>
                      <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: "6px", padding: "8px", textAlign: "center" }}>
                        <p style={{ color: GOLD, fontSize: "0.75rem", fontWeight: 600 }}>${stone.down.toLocaleString()}</p>
                        <p style={{ color: GOLD_DIM, fontSize: "0.4rem", letterSpacing: "0.1em", marginTop: "2px" }}>DOWN</p>
                      </div>
                      <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: "6px", padding: "8px", textAlign: "center" }}>
                        <p style={{ color: GOLD, fontSize: "0.75rem", fontWeight: 600 }}>${stone.monthly}/mo</p>
                        <p style={{ color: GOLD_DIM, fontSize: "0.4rem", letterSpacing: "0.1em", marginTop: "2px" }}>× {stone.months} MO</p>
                      </div>
                    </div>
                  )}

                  {stone.filled && (
                    <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: "6px", padding: "10px", marginBottom: "12px", textAlign: "center" }}>
                      <p style={{ color: GOLD, fontSize: "0.52rem", lineHeight: 1.7 }}>
                        Malu Trust equity share · Full council authority<br />
                        <span style={{ color: GOLD_DIM, fontSize: "0.45rem" }}>Contact XI directly to structure your Hale Stone</span>
                      </p>
                    </div>
                  )}

                  {isConfirmed ? (
                    <div style={{ textAlign: "center", padding: "10px", background: "rgba(176,142,80,0.1)", borderRadius: "6px", border: `1px solid ${GOLD_40}` }}>
                      <p style={{ color: GOLD, fontSize: "0.5rem", letterSpacing: "0.15em" }}>✦ STONE SELECTED — XI WILL CONTACT YOU</p>
                    </div>
                  ) : (
                    <button
                      onClick={e => { e.stopPropagation(); setStoneConfirmed(stone.id); setSelectedStone(null); }}
                      style={{
                        width: "100%",
                        background: stone.filled ? GOLD : "transparent",
                        border: `1px solid ${GOLD}`,
                        color: stone.filled ? "#000" : GOLD,
                        fontSize: "0.5rem",
                        letterSpacing: "0.2em",
                        padding: "11px",
                        cursor: "pointer",
                        borderRadius: "6px",
                        fontFamily: "'JetBrains Mono', monospace",
                        fontWeight: stone.filled ? 700 : 400,
                        transition: "all 0.2s",
                      }}
                    >
                      SELECT STONE
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </Section>

        {/* House Revenue Overview */}
        <Section title="House Revenue Model" accent={GOLD}>
          <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.48rem", lineHeight: 1.7, marginBottom: "8px" }}>
            One Mākoa House at capacity — 100 accounts. Below-market pricing drives volume.
          </p>
          <div style={{ background: "rgba(176,142,80,0.06)", border: "1px solid rgba(176,142,80,0.15)", borderRadius: "6px", padding: "10px 14px", marginBottom: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.4rem", letterSpacing: "0.15em", marginBottom: "2px" }}>MEMBERSHIP DUES</p>
              <p style={{ color: GOLD, fontSize: "0.52rem" }}>$97/mo per brother — waived when active on service route</p>
            </div>
            <p style={{ color: GOLD, fontSize: "0.75rem", fontFamily: "'JetBrains Mono', monospace", flexShrink: 0, marginLeft: "12px" }}>$97</p>
          </div>
          <div style={{ display: "grid", gap: "6px", marginBottom: "14px" }}>
            {[
              { label: "30× Aliʻi Plan ($1,497/mo)", value: "$44,910/mo", color: GOLD },
              { label: "50× Kamaʻāina Plan ($749/mo)", value: "$37,450/mo", color: GOLD_DIM },
              { label: "12× B2B Small ($1,299/mo)", value: "$15,588/mo", color: "#534AB7" },
              { label: "5× B2B Mid ($2,499/mo)", value: "$12,495/mo", color: "#534AB7" },
              { label: "3× B2B Large ($3,999/mo)", value: "$11,997/mo", color: "#534AB7" },
            ].map(row => (
              <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: `1px solid ${GOLD}08` }}>
                <span style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.44rem" }}>{row.label}</span>
                <span style={{ color: row.color, fontSize: "0.48rem", fontFamily: "'JetBrains Mono', monospace" }}>{row.value}</span>
              </div>
            ))}
          </div>
          <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: "8px", padding: "12px 14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <span style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.42rem" }}>Service revenue MRR</span>
              <span style={{ color: "rgba(232,224,208,0.6)", fontSize: "0.45rem", fontFamily: "'JetBrains Mono', monospace" }}>$122,440/mo</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.42rem" }}>Membership MRR (100 × $97)</span>
              <span style={{ color: "rgba(232,224,208,0.6)", fontSize: "0.45rem", fontFamily: "'JetBrains Mono', monospace" }}>$9,700/mo</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", paddingTop: "8px", borderTop: `1px solid ${GOLD}15` }}>
              <span style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.45rem" }}>Total House MRR</span>
              <span style={{ color: GOLD, fontSize: "0.75rem", fontFamily: "'JetBrains Mono', monospace" }}>$132,140/mo</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <span style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.42rem" }}>Nā Koa workers (80%)</span>
              <span style={{ color: "#3fb950", fontSize: "0.48rem", fontFamily: "'JetBrains Mono', monospace" }}>$105,712/mo</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <span style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.42rem" }}>Mana council (10%)</span>
              <span style={{ color: "#58a6ff", fontSize: "0.48rem", fontFamily: "'JetBrains Mono', monospace" }}>$13,214/mo</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.42rem" }}>Aliʻi Hale fund (10%)</span>
              <span style={{ color: GOLD, fontSize: "0.48rem", fontFamily: "'JetBrains Mono', monospace" }}>$13,214/mo</span>
            </div>
            <div style={{ borderTop: `1px solid ${GOLD}15`, paddingTop: "8px", display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.4rem" }}>GE Tax (4% quarterly)</span>
              <span style={{ color: "#f0883e", fontSize: "0.42rem", fontFamily: "'JetBrains Mono', monospace" }}>$15,857/qtr</span>
            </div>
          </div>
        </Section>

        {/* Downline */}
        <Section title="Your Downline" accent={GOLD}>
          <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.48rem", marginBottom: "14px" }}>
            Brothers you brought through the gate.
          </p>
          {downline.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <p style={{ color: GOLD_DIM, fontSize: "0.52rem", marginBottom: "6px" }}>No downline yet.</p>
              <p style={{ color: "rgba(232,224,208,0.25)", fontSize: "0.45rem", lineHeight: 1.7 }}>
                Share your referral code to build your network.<br />
                Each brother you bring earns you formation points.
              </p>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "8px" }}>
              {downline.map(d => {
                const dHandle = d.telegram_handle || d.full_name.split(" ")[0];
                const statusColor = d.membership_status === "active" ? "#3fb950" : d.membership_status === "invited" ? "#58a6ff" : GOLD_DIM;
                const tierColors: Record<string, string> = { alii: GOLD, mana: "#58a6ff", nakoa: "#8b9aaa" };
                return (
                  <div key={d.id} style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "10px 12px", background: "rgba(0,0,0,0.3)",
                    borderRadius: "8px", border: "1px solid rgba(176,142,80,0.08)",
                  }}>
                    <img src={dicebearUrl(d.telegram_handle || d.full_name)} alt={dHandle} style={{ width: "32px", height: "32px", borderRadius: "50%", border: `1px solid ${tierColors[d.tier] || GOLD_DIM}40`, background: "#0a0d12", flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ color: "#e8e0d0", fontSize: "0.55rem" }}>{dHandle}</p>
                      <p style={{ color: tierColors[d.tier] || GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.08em" }}>{d.tier?.toUpperCase()}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ color: statusColor, fontSize: "0.42rem", letterSpacing: "0.08em" }}>{d.membership_status}</p>
                      {d.deposit_paid && <p style={{ color: "#3fb950", fontSize: "0.38rem", marginTop: "2px" }}>✓ DEP</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Section>

        {/* Zello 808 Command */}
        <Section title="Zello 808 Command" accent={GOLD}>
          <div style={{ background: "rgba(176,142,80,0.06)", border: `1px solid ${GOLD_40}`, borderRadius: "10px", padding: "18px", marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: GOLD_FAINT, border: `1px solid ${GOLD_40}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: "1.1rem" }}>📡</span>
              </div>
              <div>
                <p style={{ color: GOLD, fontSize: "0.62rem", fontWeight: 600 }}>808 Command Channel</p>
                <p style={{ color: GOLD_DIM, fontSize: "0.45rem" }}>Aliʻi-only encrypted voice</p>
              </div>
            </div>
            <div style={{ display: "grid", gap: "8px", marginBottom: "14px" }}>
              {[
                { step: "1", text: "Download Zello on your device" },
                { step: "2", text: "Search channel: MAKOA-808-COMMAND" },
                { step: "3", text: "Request access — XI approves within 24hrs" },
                { step: "4", text: "Use your handle as your Zello username" },
              ].map(s => (
                <div key={s.step} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <span style={{ color: GOLD, fontSize: "0.45rem", width: "16px", flexShrink: 0, marginTop: "1px" }}>{s.step}.</span>
                  <p style={{ color: "rgba(232,224,208,0.6)", fontSize: "0.5rem", lineHeight: 1.6 }}>{s.text}</p>
                </div>
              ))}
            </div>
            <a
              href="https://zello.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block", textAlign: "center",
                border: `1px solid ${GOLD}`, color: GOLD,
                fontSize: "0.48rem", letterSpacing: "0.2em",
                padding: "10px", borderRadius: "6px",
                textDecoration: "none", fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              DOWNLOAD ZELLO →
            </a>
          </div>
          <p style={{ color: "rgba(232,224,208,0.25)", fontSize: "0.45rem", lineHeight: 1.7 }}>
            The 808 Command channel is for Aliʻi coordination only. Net-to-net referrals, B2B deals, and council decisions flow through this channel.
          </p>
        </Section>

        {/* Benefits */}
        <Section title="Your Aliʻi Benefits" accent={GOLD}>
          <div style={{ display: "grid", gap: "8px" }}>
            {BENEFITS.map((b, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 0", borderBottom: i < BENEFITS.length - 1 ? "1px solid rgba(176,142,80,0.06)" : "none" }}>
                <span style={{ color: GOLD, fontSize: "0.55rem", flexShrink: 0 }}>✦</span>
                <p style={{ color: "rgba(232,224,208,0.7)", fontSize: "0.52rem" }}>{b}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Oath reminder */}
        <div style={{ textAlign: "center", padding: "24px 16px", borderTop: `1px solid ${GOLD_20}`, marginTop: "8px" }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: GOLD_DIM, fontSize: "0.95rem", lineHeight: 2 }}>
            &ldquo;You already lead.<br />This is the room that matches you.&rdquo;
          </p>
        </div>

        {/* Back link */}
        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <button
            onClick={() => router.push("/portal/dashboard")}
            style={{
              background: "transparent", border: "none",
              color: "rgba(176,142,80,0.3)", fontSize: "0.45rem",
              cursor: "pointer", fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.15em",
            }}
          >
            ← BACK TO DASHBOARD
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "24px", animation: "fadeUp 0.6s ease both" }}>
      <p style={{ color: accent, fontSize: "0.42rem", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "14px", opacity: 0.7 }}>{title}</p>
      <div style={{ background: GOLD_FAINT, border: "1px solid rgba(176,142,80,0.1)", borderRadius: "10px", padding: "18px" }}>
        {children}
      </div>
    </div>
  );
}
