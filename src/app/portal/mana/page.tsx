"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";

const BLUE = "#58a6ff";
const BLUE_DIM = "rgba(88,166,255,0.5)";
const BLUE_FAINT = "rgba(88,166,255,0.07)";
const BLUE_20 = "rgba(88,166,255,0.2)";
const BLUE_40 = "rgba(88,166,255,0.4)";
const GOLD = "#b08e50";
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
  current_rank: string;
  region: string;
  service_actions_count: number;
  weekly_training_attendance_count: number;
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
  },
];

const WEDNESDAY_SCHOOL = [
  { date: "Wed Apr 16", topic: "B2B Prospecting — Cold to Warm", instructor: "XI" },
  { date: "Wed Apr 23", topic: "Service Route Operations 101", instructor: "Mana Circle Lead" },
  { date: "Wed Apr 30", topic: "Pricing Your Trade — Market Rate", instructor: "XI" },
  { date: "Wed May 7", topic: "Client Retention & Referral Systems", instructor: "Aliʻi Council" },
  { date: "Wed May 14", topic: "Building Your B2B Stack", instructor: "XI" },
];

const JOB_QUEUE = [
  { client: "Client #A-04", service: "Pressure Washing", zip: "96707", status: "open", urgency: "standard" },
  { client: "Client #B-11", service: "Landscaping", zip: "96792", status: "open", urgency: "urgent" },
  { client: "Client #C-07", service: "Moving & Hauling", zip: "96706", status: "assigned", urgency: "standard" },
];

const BENEFITS = [
  "Mastermind access — 72hr reset",
  "Brotherhood council seat",
  "Sworn in at founding fire",
  "Hampton Inn — May 1 event",
  "Ice bath 4am — Flower Moon",
  "Wednesday School — weekly",
  "Job queue — B2B referrals",
  "Aliʻi War Room with 5k stone",
];

const SERVICE_CATEGORIES = [
  "Pressure Washing", "Landscaping", "Moving & Hauling",
  "Cleaning Services", "Handyman", "Painting", "Pest Control",
];

export default function ManaPortal() {
  const router = useRouter();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStone, setSelectedStone] = useState<string | null>(null);
  const [stoneConfirmed, setStoneConfirmed] = useState<string | null>(null);
  const [serviceCategory] = useState(SERVICE_CATEGORIES[Math.floor(Math.random() * SERVICE_CATEGORIES.length)]);

  const loadData = useCallback(async (appId: string) => {
    const { data: m } = await supabase
      .from("applicants")
      .select("*")
      .eq("application_id", appId)
      .single();
    if (m) setMember(m as Member);
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
        <div style={{ width: "28px", height: "28px", border: `1px solid ${BLUE}`, borderTop: "1px solid transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const handle = member?.telegram_handle || member?.full_name?.split(" ")[0] || "Brother";
  const avatarSeed = member?.telegram_handle || member?.full_name || "mana";
  const completionRate = Math.min(100, Math.round(((member?.service_actions_count || 0) / Math.max(1, (member?.service_actions_count || 0) + 2)) * 100));
  const activeJobs = JOB_QUEUE.filter(j => j.status === "open").length;

  return (
    <div style={{ minHeight: "100vh", background: BG, color: "#e8e0d0", fontFamily: "'JetBrains Mono', monospace", paddingBottom: 80 }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      {/* Header */}
      <div style={{
        borderBottom: `1px solid ${BLUE_20}`,
        padding: "16px 20px",
        background: BG,
        position: "sticky", top: 0, zIndex: 10,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img src={dicebearUrl(avatarSeed)} alt={handle} style={{ width: "38px", height: "38px", borderRadius: "50%", border: `1px solid ${BLUE_40}`, background: "#0a0d12" }} />
          <div>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: BLUE, fontSize: "1.1rem", lineHeight: 1 }}>B2B + B2C Marketplace</p>
            <p style={{ color: BLUE_DIM, fontSize: "0.42rem", letterSpacing: "0.2em", marginTop: "2px" }}>{handle} · Mana</p>
          </div>
        </div>
        <span style={{ background: BLUE_FAINT, border: `1px solid ${BLUE_40}`, color: BLUE, fontSize: "0.4rem", padding: "3px 8px", borderRadius: "3px", letterSpacing: "0.15em" }}>
          🌀 MANA
        </span>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "24px 16px 40px" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: "32px", animation: "fadeUp 0.6s ease forwards" }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: BLUE, fontSize: "2rem", lineHeight: 1.2, marginBottom: "8px" }}>
            You have the skills.<br />This is the network<br />that needs them.
          </p>
          <p style={{ color: BLUE_DIM, fontSize: "0.48rem", letterSpacing: "0.15em" }}>
            Mana · Builder · B2B Operator
          </p>
        </div>

        {/* Stone Investment Cards */}
        <Section title="Stone Investment" accent={BLUE}>
          <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.5rem", lineHeight: 1.7, marginBottom: "16px" }}>
            Invest in the order. Your stone unlocks Aliʻi War Room access and full council standing.
          </p>
          <div style={{ display: "grid", gap: "12px" }}>
            {STONES.map((stone, i) => {
              const isConfirmed = stoneConfirmed === stone.id;
              return (
                <div
                  key={stone.id}
                  onClick={() => setSelectedStone(selectedStone === stone.id ? null : stone.id)}
                  style={{
                    border: `1px solid ${selectedStone === stone.id ? BLUE : BLUE_20}`,
                    borderRadius: "10px",
                    padding: "18px",
                    background: selectedStone === stone.id ? BLUE_FAINT : "rgba(10,13,18,0.8)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    animation: `fadeUp 0.6s ease ${0.1 + i * 0.1}s both`,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: BLUE, fontSize: "1.2rem" }}>{stone.name}</p>
                        <span style={{ background: BLUE_FAINT, border: `1px solid ${BLUE_40}`, color: BLUE, fontSize: "0.38rem", padding: "2px 6px", borderRadius: "2px", letterSpacing: "0.15em" }}>{stone.badge}</span>
                      </div>
                      <p style={{ color: BLUE_DIM, fontSize: "0.48rem" }}>{stone.desc}</p>
                    </div>
                    <p style={{ color: BLUE, fontSize: "1rem", fontWeight: 600, flexShrink: 0, marginLeft: "12px" }}>${stone.amount.toLocaleString()}</p>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "12px" }}>
                    <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: "6px", padding: "8px", textAlign: "center" }}>
                      <p style={{ color: BLUE, fontSize: "0.75rem", fontWeight: 600 }}>${stone.down.toLocaleString()}</p>
                      <p style={{ color: BLUE_DIM, fontSize: "0.4rem", letterSpacing: "0.1em", marginTop: "2px" }}>DOWN</p>
                    </div>
                    <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: "6px", padding: "8px", textAlign: "center" }}>
                      <p style={{ color: BLUE, fontSize: "0.75rem", fontWeight: 600 }}>${stone.monthly}/mo</p>
                      <p style={{ color: BLUE_DIM, fontSize: "0.4rem", letterSpacing: "0.1em", marginTop: "2px" }}>× {stone.months} MO</p>
                    </div>
                  </div>

                  {isConfirmed ? (
                    <div style={{ textAlign: "center", padding: "10px", background: BLUE_FAINT, borderRadius: "6px", border: `1px solid ${BLUE_40}` }}>
                      <p style={{ color: BLUE, fontSize: "0.5rem", letterSpacing: "0.15em" }}>✦ STONE SELECTED — XI WILL CONTACT YOU</p>
                    </div>
                  ) : (
                    <button
                      onClick={e => { e.stopPropagation(); setStoneConfirmed(stone.id); setSelectedStone(null); }}
                      style={{
                        width: "100%",
                        background: "transparent",
                        border: `1px solid ${BLUE}`,
                        color: BLUE,
                        fontSize: "0.5rem",
                        letterSpacing: "0.2em",
                        padding: "11px",
                        cursor: "pointer",
                        borderRadius: "6px",
                        fontFamily: "'JetBrains Mono', monospace",
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

        {/* Service Route */}
        <Section title="Your Service Route" accent={BLUE}>
          <div style={{ background: "rgba(88,166,255,0.05)", border: `1px solid ${BLUE_20}`, borderRadius: "8px", padding: "16px", marginBottom: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
              <div>
                <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.42rem", letterSpacing: "0.15em", marginBottom: "4px" }}>ASSIGNED CATEGORY</p>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: BLUE, fontSize: "1.1rem" }}>{serviceCategory}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#3fb950", animation: "pulse 2s ease-in-out infinite" }} />
                  <span style={{ color: "#3fb950", fontSize: "0.42rem" }}>ACTIVE</span>
                </div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
              <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: "6px", padding: "10px", textAlign: "center" }}>
                <p style={{ color: BLUE, fontSize: "1.1rem", fontWeight: 600 }}>{activeJobs}</p>
                <p style={{ color: BLUE_DIM, fontSize: "0.4rem", letterSpacing: "0.1em", marginTop: "2px" }}>ACTIVE JOBS</p>
              </div>
              <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: "6px", padding: "10px", textAlign: "center" }}>
                <p style={{ color: BLUE, fontSize: "1.1rem", fontWeight: 600 }}>{completionRate}%</p>
                <p style={{ color: BLUE_DIM, fontSize: "0.4rem", letterSpacing: "0.1em", marginTop: "2px" }}>COMPLETION</p>
              </div>
            </div>
            <div style={{ marginBottom: "4px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.42rem" }}>Route Health</span>
                <span style={{ color: BLUE, fontSize: "0.45rem" }}>{completionRate}%</span>
              </div>
              <div style={{ height: "3px", background: "rgba(255,255,255,0.06)", borderRadius: "2px" }}>
                <div style={{ height: "100%", width: `${completionRate}%`, background: BLUE, borderRadius: "2px", transition: "width 1s ease" }} />
              </div>
            </div>
          </div>
          <p style={{ color: "rgba(232,224,208,0.25)", fontSize: "0.45rem", lineHeight: 1.7 }}>
            Service route income: 80% to you · 10% Mana council · 10% Hale fund. Aliʻi Plan jobs pay $1,197/visit crew share. Kamaʻāina jobs pay $599/visit crew share. XI assigns based on region and category.
          </p>
        </Section>

        {/* Wednesday School */}
        <Section title="Wednesday School" accent={BLUE}>
          <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.48rem", marginBottom: "14px" }}>
            Every Wednesday · 6:00 PM · Kapolei
          </p>
          <div style={{ display: "grid", gap: "0" }}>
            {WEDNESDAY_SCHOOL.map((session, i) => (
              <div key={i} style={{
                display: "flex", gap: "14px",
                padding: "12px 0",
                borderBottom: i < WEDNESDAY_SCHOOL.length - 1 ? "1px solid rgba(88,166,255,0.08)" : "none",
              }}>
                <div style={{ flexShrink: 0, width: "80px" }}>
                  <p style={{ color: BLUE, fontSize: "0.45rem", lineHeight: 1.4 }}>{session.date}</p>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: "#e8e0d0", fontSize: "0.52rem", marginBottom: "2px" }}>{session.topic}</p>
                  <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.42rem" }}>Led by {session.instructor}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Job Queue */}
        <Section title="Job Queue" accent={BLUE}>
          <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.48rem", marginBottom: "14px" }}>
            Available jobs in your region. Claim to lock in.
          </p>
          <div style={{ display: "grid", gap: "10px" }}>
            {JOB_QUEUE.map((job, i) => {
              const urgencyColor = job.urgency === "urgent" ? "#f0883e" : BLUE_DIM;
              const statusColor = job.status === "open" ? "#3fb950" : BLUE_DIM;
              return (
                <div key={i} style={{
                  background: "rgba(88,166,255,0.04)",
                  border: `1px solid ${job.status === "open" ? BLUE_20 : "rgba(255,255,255,0.06)"}`,
                  borderRadius: "8px",
                  padding: "14px",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <div>
                      <p style={{ color: "#e8e0d0", fontSize: "0.58rem", marginBottom: "2px" }}>{job.service}</p>
                      <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.45rem" }}>{job.client} · ZIP {job.zip}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ color: statusColor, fontSize: "0.42rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>{job.status}</p>
                      <p style={{ color: urgencyColor, fontSize: "0.4rem", marginTop: "2px", textTransform: "uppercase" }}>{job.urgency}</p>
                    </div>
                  </div>
                  {job.status === "open" && (
                    <button style={{
                      width: "100%",
                      background: "transparent",
                      border: `1px solid ${BLUE_40}`,
                      color: BLUE,
                      fontSize: "0.45rem",
                      letterSpacing: "0.15em",
                      padding: "8px",
                      cursor: "pointer",
                      borderRadius: "4px",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}>
                      CLAIM JOB
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          <p style={{ color: "rgba(232,224,208,0.2)", fontSize: "0.42rem", marginTop: "12px", lineHeight: 1.7 }}>
            Job queue refreshes every 24hrs. Contact XI on Telegram to unlock full queue access.
          </p>
        </Section>

        {/* Benefits */}
        <Section title="Your Mana Benefits" accent={BLUE}>
          <div style={{ display: "grid", gap: "8px" }}>
            {BENEFITS.map((b, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 0", borderBottom: i < BENEFITS.length - 1 ? "1px solid rgba(88,166,255,0.06)" : "none" }}>
                <span style={{ color: BLUE, fontSize: "0.55rem", flexShrink: 0 }}>—</span>
                <p style={{ color: "rgba(232,224,208,0.7)", fontSize: "0.52rem" }}>{b}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Oath */}
        <div style={{ textAlign: "center", padding: "24px 16px", borderTop: `1px solid ${BLUE_20}`, marginTop: "8px" }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: BLUE_DIM, fontSize: "0.95rem", lineHeight: 2 }}>
            &ldquo;You have the skills.<br />This is the network that needs them.&rdquo;
          </p>
        </div>

        {/* Back link */}
        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <button
            onClick={() => router.push("/portal/dashboard")}
            style={{
              background: "transparent", border: "none",
              color: "rgba(88,166,255,0.3)", fontSize: "0.45rem",
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
      <div style={{ background: "rgba(88,166,255,0.04)", border: "1px solid rgba(88,166,255,0.1)", borderRadius: "10px", padding: "18px" }}>
        {children}
      </div>
    </div>
  );
}
