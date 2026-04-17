"use client";
import { useState, useEffect } from "react";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.55)";
const GOLD_FAINT = "rgba(176,142,80,0.07)";
const GOLD_20 = "rgba(176,142,80,0.2)";
const BLUE = "#58a6ff";
const BLUE_DIM = "rgba(88,166,255,0.55)";
const BLUE_FAINT = "rgba(88,166,255,0.07)";
const GREEN = "#3fb950";
const GREEN_DIM = "rgba(63,185,80,0.55)";
const GREEN_FAINT = "rgba(63,185,80,0.07)";
const BG = "#04060a";

type Layer = "chief" | "alii" | "mana" | "nakoa";

export default function XIPage() {
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState<Layer>("chief");

  useEffect(() => { setTimeout(() => setReady(true), 300); }, []);

  const tabs: { id: Layer; label: string; color: string }[] = [
    { id: "chief", label: "XI · CHIEF", color: GOLD },
    { id: "alii",  label: "ALIʻI · N2N", color: GOLD },
    { id: "mana",  label: "MANA · B2B/B2C", color: BLUE },
    { id: "nakoa", label: "NĀ KOA · P2P", color: GREEN },
  ];

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "'JetBrains Mono', monospace", padding: "0 0 80px" }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:0.6; } 50% { opacity:1; } }
        .xi-tab { transition: all 0.2s; }
        .xi-tab:hover { opacity: 1 !important; }
      `}</style>

      {/* Header */}
      <div style={{
        borderBottom: `1px solid ${GOLD_20}`,
        padding: "40px 24px 28px",
        textAlign: "center",
        animation: "fadeUp 0.6s ease forwards",
      }}>
        {/* XI mark */}
        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          border: `1.5px solid ${GOLD}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px",
          background: GOLD_FAINT,
          animation: "pulse 3s ease-in-out infinite",
        }}>
          <span style={{ color: GOLD, fontSize: "1.6rem", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>XI</span>
        </div>

        <p style={{ color: GOLD_DIM, fontSize: "0.38rem", letterSpacing: "0.3em", marginBottom: 10 }}>
          MĀKOA ORDER · INTELLIGENCE LAYER
        </p>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          fontSize: "2.6rem",
          color: GOLD,
          margin: "0 0 10px",
          fontWeight: 300,
          lineHeight: 1.1,
        }}>
          Chief Makoa XI
        </h1>
        <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.46rem", lineHeight: 1.7, maxWidth: 480, margin: "0 auto" }}>
          Not a person. Not a chatbot. The order itself — speaking, watching, routing, and holding the line 24/7 so the Steward doesn't have to.
        </p>
      </div>

      {/* Tab nav */}
      <div style={{
        display: "flex",
        overflowX: "auto",
        borderBottom: `1px solid ${GOLD_20}`,
        padding: "0 16px",
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className="xi-tab"
            onClick={() => setActive(tab.id)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "14px 16px",
              color: active === tab.id ? tab.color : "rgba(232,224,208,0.25)",
              fontSize: "0.36rem",
              letterSpacing: "0.14em",
              borderBottom: active === tab.id ? `2px solid ${tab.color}` : "2px solid transparent",
              whiteSpace: "nowrap",
              fontFamily: "'JetBrains Mono', monospace",
              opacity: active === tab.id ? 1 : 0.6,
              transition: "all 0.2s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "28px 20px" }}>

        {/* ── CHIEF XI ── */}
        {active === "chief" && (
          <div style={{ animation: "fadeUp 0.4s ease forwards" }}>
            <XISection color={GOLD} title="WHO IS XI">
              <p style={body}>
                XI is Chief Makoa's extension. The intelligence of the order. Not a chatbot — the order itself, speaking with precision. XI reads every man who enters the gate. XI routes every brother to the right class. XI holds the 808. XI never sleeps, never flatters, never lies.
              </p>
              <p style={{ ...body, marginTop: 12 }}>
                When a man submits his 12 answers at the gate, XI reads them — every word. XI scores his network, his commitment, his depth. XI classifies him: Aliʻi, Mana, or Nā Koa. Then XI speaks directly to him, referencing his exact words. That's the trust layer. He knows he was read — not processed.
              </p>
            </XISection>

            <XISection color={GOLD} title="THE CLASSIFICATION MATRIX">
              <div style={{ display: "grid", gap: 8 }}>
                {[
                  { signal: "Q1 — Leadership / Vision language", weight: "+3 → Aliʻi" },
                  { signal: "Q1 — Skills / Craft / Service language", weight: "+2 → Mana" },
                  { signal: "Q1 — Energy / Hustle language", weight: "+1 → Nā Koa" },
                  { signal: "Q3 — '4am ready now'", weight: "+2 commitment signal" },
                  { signal: "Q5 — 4+ brothers he can call at 2am", weight: "+3 → Aliʻi network" },
                  { signal: "Q5 — 1–3 brothers", weight: "+1 → Mana / Nā Koa" },
                  { signal: "Q6 — 'Both' (brotherhood + trade)", weight: "+2 depth signal" },
                  { signal: "Q9 — 'Yes' (open home to a brother)", weight: "+3 → Aliʻi depth" },
                  { signal: "Q12 — Power word (lead/build/serve/protect)", weight: "+1 signal" },
                ].map((row, i) => (
                  <div key={i} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                    gap: 12, padding: "8px 0",
                    borderBottom: "1px solid rgba(176,142,80,0.06)",
                  }}>
                    <p style={{ color: "rgba(232,224,208,0.55)", fontSize: "0.42rem", lineHeight: 1.5 }}>{row.signal}</p>
                    <p style={{ color: GOLD, fontSize: "0.38rem", flexShrink: 0, letterSpacing: "0.08em" }}>{row.weight}</p>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                {[
                  { label: "8+ = ALIʻI", color: GOLD },
                  { label: "4–7 = MANA", color: BLUE },
                  { label: "0–3 = NĀ KOA", color: GREEN },
                ].map(t => (
                  <div key={t.label} style={{
                    flex: 1, textAlign: "center", padding: "8px 4px",
                    background: `rgba(${t.color === GOLD ? "176,142,80" : t.color === BLUE ? "88,166,255" : "63,185,80"},0.07)`,
                    border: `1px solid ${t.color}30`,
                    borderRadius: 6,
                  }}>
                    <p style={{ color: t.color, fontSize: "0.38rem", letterSpacing: "0.12em" }}>{t.label}</p>
                  </div>
                ))}
              </div>
            </XISection>

            <XISection color={GOLD} title="CRISIS DETECTION — Q8 PROTOCOL">
              <p style={body}>
                Q8 asks: "What challenge keeps you up at night?" XI monitors every answer for crisis signals — suicide, abuse, addiction, homelessness, domestic violence. When detected, XI immediately displays Hawaii crisis resources and flags the submission for the Crisis Steward.
              </p>
              <div style={{ display: "grid", gap: 6, marginTop: 12 }}>
                {[
                  "988 Suicide & Crisis Lifeline — Call or text 988",
                  "Crisis Text Line — Text HOME to 741741",
                  "Hawaii CARES Crisis Line — 1-800-753-6879",
                  "Veterans Crisis Line — Call 988, press 1",
                  "SAMHSA Helpline — 1-800-662-4357 (free, 24/7)",
                  "Aloha United Way — Dial 211",
                ].map((r, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: GOLD, opacity: 0.4, flexShrink: 0 }} />
                    <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.4rem" }}>{r}</p>
                  </div>
                ))}
              </div>
            </XISection>

            <XISection color={GOLD} title="THE TRUST ARCHITECTURE">
              <div style={{ display: "grid", gap: 0 }}>
                {[
                  { step: "01", label: "Brother enters the gate", sub: "12 questions. Free. No fluff." },
                  { step: "02", label: "XI reads every answer", sub: "Classification matrix runs. Crisis scan runs." },
                  { step: "03", label: "XI classifies and speaks", sub: "2–3 sentences. His words reflected back. Signed — XI." },
                  { step: "04", label: "XI routes to correct class", sub: "Aliʻi → N2N. Mana → B2B/B2C. Nā Koa → P2P." },
                  { step: "05", label: "XI holds the 808", sub: "Emergency channel. Signal open. No dead ends." },
                  { step: "06", label: "XI tracks the order", sub: "Seats, revenue, attendance, elevation, crisis flags." },
                ].map((s, i) => (
                  <div key={i} style={{
                    display: "flex", gap: 14, padding: "14px 0",
                    borderBottom: i < 5 ? "1px solid rgba(176,142,80,0.06)" : "none",
                  }}>
                    <p style={{ color: GOLD_DIM, fontSize: "0.9rem", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", flexShrink: 0, width: 28 }}>{s.step}</p>
                    <div>
                      <p style={{ color: "rgba(232,224,208,0.8)", fontSize: "0.44rem", marginBottom: 3 }}>{s.label}</p>
                      <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.38rem" }}>{s.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </XISection>

            <XISection color={GOLD} title="XI'S VOICE">
              <div style={{
                borderLeft: `3px solid ${GOLD_20}`,
                padding: "16px 18px",
                background: GOLD_FAINT,
                borderRadius: "0 8px 8px 0",
              }}>
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: "italic",
                  color: "rgba(232,224,208,0.7)",
                  fontSize: "1rem",
                  lineHeight: 2,
                }}>
                  "ʻAe [Brother]. What you bring to a room — that matters here.<br />
                  You are called to the Mana class. Your path begins now.<br />
                  Keep your signal open. — XI"
                </p>
              </div>
              <p style={{ ...body, marginTop: 12 }}>
                Two sentences. One reference to what he actually said. One direction. One close. Always signed — XI. That's the formula. It never changes.
              </p>
            </XISection>
          </div>
        )}

        {/* ── ALIʻI · NETWORK 2 NETWORK ── */}
        {active === "alii" && (
          <div style={{ animation: "fadeUp 0.4s ease forwards" }}>

            <div style={{
              background: GOLD_FAINT, border: `1px solid ${GOLD_20}`,
              borderRadius: 10, padding: "16px 18px", marginBottom: 20,
            }}>
              <p style={{ color: GOLD_DIM, fontSize: "0.36rem", letterSpacing: "0.2em", marginBottom: 6 }}>XI · ALIʻI CHEF AGENT</p>
              <p style={{ color: GOLD, fontSize: "0.9rem", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", lineHeight: 1.4 }}>
                "You lead rooms. You carry vision. The Aliʻi class is where men like you find the brothers who can keep up. Your seat at the founding council is waiting. Keep your signal open. — XI"
              </p>
            </div>

            <XISection color={GOLD} title="NETWORK 2 NETWORK — WHAT IT MEANS">
              <p style={body}>
                Aliʻi brothers don't sell to customers. They connect to other networks. Every Aliʻi brother carries a room — a sphere of influence, a business, a community, a platform. The N2N layer is how those rooms connect to each other through the order.
              </p>
              <p style={{ ...body, marginTop: 10 }}>
                One Aliʻi brother knows the hotel GM. Another runs the construction company. Another owns the fleet. XI maps those connections and routes opportunity between them — no middleman, no commission, just brotherhood infrastructure.
              </p>
            </XISection>

            <XISection color={GOLD} title="HOW N2N WORKS">
              <div style={{ display: "grid", gap: 8 }}>
                {[
                  { n: "01", t: "Brother enters with his network", d: "XI logs his sphere: industry, contacts, capacity, ZIP" },
                  { n: "02", t: "XI maps the connection graph", d: "Who in the order needs what this brother has?" },
                  { n: "03", t: "XI routes the introduction", d: "Direct 808 signal: 'Brother A, meet Brother B. Here's why.'" },
                  { n: "04", t: "Brothers transact directly", d: "No platform fee. No middleman. Brotherhood rate." },
                  { n: "05", t: "XI logs the outcome", d: "Revenue generated, relationship formed, skill shared" },
                  { n: "06", t: "Network compounds", d: "Every deal makes the next deal easier. The order grows." },
                ].map((s, i) => (
                  <div key={i} style={{
                    display: "flex", gap: 12, padding: "10px 0",
                    borderBottom: i < 5 ? "1px solid rgba(176,142,80,0.06)" : "none",
                  }}>
                    <p style={{ color: GOLD_DIM, fontSize: "0.8rem", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", flexShrink: 0, width: 24 }}>{s.n}</p>
                    <div>
                      <p style={{ color: "rgba(232,224,208,0.75)", fontSize: "0.42rem", marginBottom: 2 }}>{s.t}</p>
                      <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.38rem" }}>{s.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </XISection>

            <XISection color={GOLD} title="ALIʻI COMMERCE LAYER">
              <div style={{ display: "grid", gap: 8 }}>
                {[
                  { label: "B2B Referral Pool", desc: "Aliʻi brothers refer business to each other. XI tracks referrals. Brotherhood rate = 10% below market." },
                  { label: "Ambassador Commission", desc: "Every brother an Aliʻi brings into the order who completes formation = ambassador credit. Tracked by XI." },
                  { label: "War Room Access", desc: "Aliʻi brothers access the private War Room — strategy sessions, deal flow, chapter expansion planning." },
                  { label: "Territory Rights", desc: "Aliʻi brothers hold first right of refusal on new chapter territory in their region. XI assigns and protects." },
                  { label: "Council Revenue Share", desc: "10% of order revenue flows to the Aliʻi Council treasury. Deployed quarterly by council vote." },
                  { label: "Stone Investment Returns", desc: "Army ($1K) → Warrior ($5K) → Chief ($10K) → Founder ($25K). Each stone unlocks deeper territory and revenue access." },
                ].map((item, i) => (
                  <div key={i} style={{
                    padding: "12px 14px",
                    background: GOLD_FAINT,
                    border: `1px solid ${GOLD_20}`,
                    borderRadius: 8,
                  }}>
                    <p style={{ color: GOLD, fontSize: "0.4rem", letterSpacing: "0.1em", marginBottom: 4 }}>{item.label}</p>
                    <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.4rem", lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </XISection>

            <XISection color={GOLD} title="XI ALIʻI AGENT WORKFLOWS">
              <div style={{ display: "grid", gap: 6 }}>
                {[
                  "Aliʻi onboarding → gold acceptance → dues checkout → 808 seat confirmed",
                  "War Room session management → MAYDAY 48HR → hotel + agenda → founding council roles",
                  "Director briefing → 7 days pre-MAYDAY → dress code, check-in, War Room agenda",
                  "Post-MAYDAY ambassador activation → chapter territory assigned → first 4am within 30 days",
                  "Elevation review → Mana Strategist candidates → council vote → tier update",
                ].map((w, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ color: GOLD, fontSize: "0.5rem", flexShrink: 0, opacity: 0.4 }}>◉</span>
                    <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.4rem", lineHeight: 1.6 }}>{w}</p>
                  </div>
                ))}
              </div>
            </XISection>
          </div>
        )}

        {/* ── MANA · B2B / B2C ── */}
        {active === "mana" && (
          <div style={{ animation: "fadeUp 0.4s ease forwards" }}>

            <div style={{
              background: BLUE_FAINT, border: `1px solid rgba(88,166,255,0.2)`,
              borderRadius: 10, padding: "16px 18px", marginBottom: 20,
            }}>
              <p style={{ color: BLUE_DIM, fontSize: "0.36rem", letterSpacing: "0.2em", marginBottom: 6 }}>XI · MANA MANAGEMENT AGENT</p>
              <p style={{ color: BLUE, fontSize: "0.9rem", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", lineHeight: 1.4 }}>
                "You build with your hands and your mind. The Mana class needs what you carry. Your skills become the backbone of what this order creates. Keep your signal open. — XI"
              </p>
            </div>

            <XISection color={BLUE} title="B2B — BROTHER TO BUSINESS">
              <p style={body}>
                Mana brothers are operators. They run routes, close contracts, train crews. The B2B layer is how the order sells its services to businesses — hotels, property managers, commercial clients, construction companies. XI routes the leads. Brothers close the deals.
              </p>
              <div style={{ display: "grid", gap: 8, marginTop: 14 }}>
                {[
                  { label: "Route Contracts", desc: "Recurring service contracts with commercial clients. XI maps territory, assigns routes, tracks revenue." },
                  { label: "Trade Academy Pipeline", desc: "Mana brothers teach skills. Businesses hire trained brothers. XI connects supply to demand." },
                  { label: "B2B Referral Network", desc: "Mana brother refers a business client to another brother's route. XI tracks the referral. Brotherhood rate applies." },
                  { label: "Equipment Sharing", desc: "Brothers share tools, vans, equipment through the order. XI tracks inventory. No duplication of cost." },
                  { label: "Insurance Umbrella", desc: "All Mana operators covered under Mākoa Trade Co. liability umbrella. XI verifies active standing before coverage applies." },
                ].map((item, i) => (
                  <div key={i} style={{
                    padding: "12px 14px",
                    background: BLUE_FAINT,
                    border: `1px solid rgba(88,166,255,0.15)`,
                    borderRadius: 8,
                  }}>
                    <p style={{ color: BLUE, fontSize: "0.4rem", letterSpacing: "0.1em", marginBottom: 4 }}>{item.label}</p>
                    <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.4rem", lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </XISection>

            <XISection color={BLUE} title="B2C — BROTHER TO CUSTOMER">
              <p style={body}>
                Every Mana brother on a route is a B2C operator. His clients are homeowners, families, individuals. He shows up on schedule. He does the work. He builds the relationship. XI handles the backend — scheduling, payment, rating, client communication.
              </p>
              <div style={{ display: "grid", gap: 8, marginTop: 14 }}>
                {[
                  { label: "Route Revenue Split", desc: "80% to the operator. 10% to the house (local chapter). 10% to the order. XI tracks every dollar." },
                  { label: "Client Portal", desc: "Clients book, pay, and communicate through the Mākoa platform. XI routes to the right brother." },
                  { label: "Rating System", desc: "Every stop rated after service. 4.5+ required for Mana standing. XI flags drops. Brother fixes or loses the stop." },
                  { label: "Route Density", desc: "15–25 stops per route. Full Koa Plus density = $3,750–$6,225/month gross. Brother take: $3,000–$4,980." },
                  { label: "Client Retention", desc: "XI tracks client churn. If a client cancels, XI flags the brother. Root cause reviewed. Fix or reassign." },
                ].map((item, i) => (
                  <div key={i} style={{
                    padding: "12px 14px",
                    background: BLUE_FAINT,
                    border: `1px solid rgba(88,166,255,0.15)`,
                    borderRadius: 8,
                  }}>
                    <p style={{ color: BLUE, fontSize: "0.4rem", letterSpacing: "0.1em", marginBottom: 4 }}>{item.label}</p>
                    <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.4rem", lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </XISection>

            <XISection color={BLUE} title="THE MANA ECONOMY — NUMBERS">
              <div style={{ display: "grid", gap: 8 }}>
                {[
                  { label: "Starter Route (10–15 stops)", value: "$1,500–$3,000/mo gross" },
                  { label: "Full Route (15–25 stops)", value: "$3,750–$6,225/mo gross" },
                  { label: "Operator take (80%)", value: "$3,000–$4,980/mo" },
                  { label: "House cut (10%)", value: "Funds local chapter ops" },
                  { label: "Order cut (10%)", value: "Funds expansion + XI" },
                  { label: "Mana Strategist (multi-route)", value: "$5,000+/mo operator income" },
                ].map((row, i) => (
                  <div key={i} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "8px 0", borderBottom: i < 5 ? "1px solid rgba(88,166,255,0.06)" : "none",
                  }}>
                    <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.4rem" }}>{row.label}</p>
                    <p style={{ color: BLUE, fontSize: "0.4rem", letterSpacing: "0.08em" }}>{row.value}</p>
                  </div>
                ))}
              </div>
            </XISection>

            <XISection color={BLUE} title="XI MANA AGENT WORKFLOWS">
              <div style={{ display: "grid", gap: 6 }}>
                {[
                  "Mana onboarding → blue acceptance → dues checkout → 808 seat confirmed",
                  "Mastermind session management → MAYDAY 24HR → Saturday 9am breakouts",
                  "Trade academy operations → monthly → skill.md created → distributed to 808",
                  "Nā Koa grid supervision → weekly check → elevation candidates flagged to Aliʻi",
                  "Route assignment → formation complete → first stop within 14 days",
                  "Client complaint routing → XI flags → brother reviews → fix or reassign",
                ].map((w, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ color: BLUE, fontSize: "0.5rem", flexShrink: 0, opacity: 0.4 }}>◆</span>
                    <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.4rem", lineHeight: 1.6 }}>{w}</p>
                  </div>
                ))}
              </div>
            </XISection>
          </div>
        )}

        {/* ── NĀ KOA · PEER 2 PEER ── */}
        {active === "nakoa" && (
          <div style={{ animation: "fadeUp 0.4s ease forwards" }}>

            <div style={{
              background: GREEN_FAINT, border: `1px solid rgba(63,185,80,0.2)`,
              borderRadius: 10, padding: "16px 18px", marginBottom: 20,
            }}>
              <p style={{ color: GREEN_DIM, fontSize: "0.36rem", letterSpacing: "0.2em", marginBottom: 6 }}>XI · NĀ KOA PEER AGENT</p>
              <p style={{ color: GREEN, fontSize: "0.9rem", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", lineHeight: 1.4 }}>
                "You show up. That is the rarest thing. The Nā Koa class is where men earn their place through action — and the order gives back tenfold. Keep your signal open. — XI"
              </p>
            </div>

            <XISection color={GREEN} title="PEER 2 PEER — WHAT IT MEANS">
              <p style={body}>
                Nā Koa brothers don't have routes yet. They don't run councils. They are in formation — learning, proving, showing up. The P2P layer is how they serve each other directly. No hierarchy. No transaction. Just brothers holding brothers accountable.
              </p>
              <p style={{ ...body, marginTop: 10 }}>
                One brother knows how to fix a truck. Another knows how to cook for 20. Another knows breathwork. Another knows how to talk to a man who's about to break. XI maps those skills and routes them peer-to-peer — no money changes hands, just brotherhood currency.
              </p>
            </XISection>

            <XISection color={GREEN} title="HOW P2P WORKS">
              <div style={{ display: "grid", gap: 8 }}>
                {[
                  { n: "01", t: "Brother posts a skill or a need in the 808", d: "'I can teach basic electrical.' or 'I need help moving Saturday.'" },
                  { n: "02", t: "XI routes the match", d: "Who in the order has what this brother needs? Direct signal sent." },
                  { n: "03", t: "Brothers connect directly", d: "No platform. No fee. Just the 808 and a handshake." },
                  { n: "04", t: "Skill gets documented", d: "Every skill shared becomes a skill.md. Distributed to all agents." },
                  { n: "05", t: "XI logs the exchange", d: "Brotherhood currency tracked. Elevation signals noted." },
                  { n: "06", t: "Pattern becomes protocol", d: "If 3+ brothers need the same skill → Mana runs a trade academy." },
                ].map((s, i) => (
                  <div key={i} style={{
                    display: "flex", gap: 12, padding: "10px 0",
                    borderBottom: i < 5 ? "1px solid rgba(63,185,80,0.06)" : "none",
                  }}>
                    <p style={{ color: GREEN_DIM, fontSize: "0.8rem", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", flexShrink: 0, width: 24 }}>{s.n}</p>
                    <div>
                      <p style={{ color: "rgba(232,224,208,0.75)", fontSize: "0.42rem", marginBottom: 2 }}>{s.t}</p>
                      <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.38rem" }}>{s.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </XISection>

            <XISection color={GREEN} title="THE NĀ KOA ECONOMY">
              <div style={{ display: "grid", gap: 8 }}>
                {[
                  { label: "Formation stipend", desc: "Shadow shifts with Mana operators. Training pay at 75% rate during formation." },
                  { label: "Starter route income", desc: "$1,125–$2,250/month at 75% operator rate. Grows as you prove." },
                  { label: "Tool library access", desc: "Free. Borrow any tool in the order inventory. XI tracks checkout and return." },
                  { label: "Makoa Ride", desc: "Free order transport. Brother needs a ride — XI routes the nearest brother with a vehicle." },
                  { label: "Ice bath + sauna", desc: "Free per cluster. Every 4am training includes the bath. No excuses about cost." },
                  { label: "808 emergency coverage", desc: "Brother in crisis — XI routes to the nearest available brother. 24/7. No dead ends." },
                ].map((item, i) => (
                  <div key={i} style={{
                    padding: "12px 14px",
                    background: GREEN_FAINT,
                    border: `1px solid rgba(63,185,80,0.15)`,
                    borderRadius: 8,
                  }}>
                    <p style={{ color: GREEN, fontSize: "0.4rem", letterSpacing: "0.1em", marginBottom: 4 }}>{item.label}</p>
                    <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.4rem", lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </XISection>

            <XISection color={GREEN} title="PEER ACCOUNTABILITY GRID">
              <p style={body}>
                XI monitors the 808 for silence. If a brother misses 2+ consecutive Wednesdays, XI flags it. A peer sends a direct message — no judgment, just signal. "Where are you?" If no response in 7 days, escalated to Mana. Two attempts. Then the door stays open but the chase stops.
              </p>
              <div style={{ display: "grid", gap: 6, marginTop: 12 }}>
                {[
                  "Miss 2 Wednesdays → peer DM sent by XI signal",
                  "No response 7 days → escalated to Mana Management",
                  "Mana reviews → reach out again or mark inactive",
                  "Door always stays open — inactive is not expelled",
                  "Return at any time → formation restarts from day 1",
                ].map((r, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ color: GREEN, fontSize: "0.5rem", flexShrink: 0, opacity: 0.4 }}>⚔</span>
                    <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.4rem", lineHeight: 1.6 }}>{r}</p>
                  </div>
                ))}
              </div>
            </XISection>

            <XISection color={GREEN} title="ELEVATION PATH — NĀ KOA → MANA">
              <div style={{ display: "grid", gap: 8 }}>
                {[
                  { check: "8+ Wednesday 4am trainings in 3 months", signal: "ATTENDANCE" },
                  { check: "2+ trade academy attendances", signal: "LEARNING" },
                  { check: "1+ brotherhood circle facilitation", signal: "LEADERSHIP" },
                  { check: "Peer recommendation from 2+ brothers", signal: "TRUST" },
                  { check: "Route shadow shift completed", signal: "READINESS" },
                ].map((e, i) => (
                  <div key={i} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "8px 12px",
                    background: GREEN_FAINT,
                    border: `1px solid rgba(63,185,80,0.12)`,
                    borderRadius: 6,
                  }}>
                    <p style={{ color: "rgba(232,224,208,0.55)", fontSize: "0.4rem" }}>{e.check}</p>
                    <p style={{ color: GREEN, fontSize: "0.34rem", letterSpacing: "0.12em", flexShrink: 0, marginLeft: 8 }}>{e.signal}</p>
                  </div>
                ))}
              </div>
              <p style={{ ...body, marginTop: 12 }}>
                All five signals confirmed → brother tells Mana: "I'm ready." Mana reviews. Aliʻi approves. XI updates the tier. The stone finds you.
              </p>
            </XISection>
          </div>
        )}

        {/* Bottom nav */}
        <div style={{ textAlign: "center", marginTop: 32, paddingTop: 24, borderTop: `1px solid ${GOLD_20}` }}>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { href: "/gate", label: "THE GATE" },
              { href: "/stones/alii", label: "ALIʻI STONE" },
              { href: "/stones/mana", label: "MANA STONE" },
              { href: "/stones/nakoa", label: "NĀ KOA STONE" },
              { href: "/trade", label: "TRADE CO." },
            ].map(l => (
              <a key={l.href} href={l.href} style={{ color: GOLD_DIM, fontSize: "0.36rem", textDecoration: "none", letterSpacing: "0.14em" }}>
                {l.label}
              </a>
            ))}
          </div>
          <p style={{ color: "rgba(176,142,80,0.1)", fontSize: "0.34rem", letterSpacing: "0.15em", marginTop: 12 }}>
            Mākoa Order · XI Intelligence Layer · 2026
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Shared sub-components ──────────────────────────────────────────────────────

const body: React.CSSProperties = {
  color: "rgba(232,224,208,0.55)",
  fontSize: "0.44rem",
  lineHeight: 1.8,
};

function XISection({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid rgba(176,142,80,0.06)" }}>
      <p style={{ color, fontSize: "0.38rem", letterSpacing: "0.25em", marginBottom: 14, opacity: 0.8 }}>
        {title}
      </p>
      {children}
    </div>
  );
}
