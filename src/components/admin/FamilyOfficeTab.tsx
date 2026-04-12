"use client";
import { useState } from "react";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.5)";
const GOLD_FAINT = "rgba(176,142,80,0.07)";
const GREEN = "#3fb950";
const BLUE = "#58a6ff";
const RED = "#e05c5c";
const AMBER = "#f0883e";
const PURPLE = "#bc8cff";

/* ─── Types ─────────────────────────────────────────────────────── */

interface TreasuryLine {
  label: string;
  amount: number;
  color: string;
  icon: string;
}

interface GovernanceItem {
  id: string;
  title: string;
  category: string;
  submittedBy: string;
  status: "draft" | "voting" | "approved" | "rejected" | "building" | "deployed";
  votesFor: number;
  votesAgainst: number;
  quorum: number;
  date: string;
}

interface LegalDoc {
  name: string;
  type: string;
  status: "active" | "pending" | "expired" | "draft";
  lastUpdated: string;
}

/* ─── Mock Data (wired to Supabase when live) ───────────────────── */

const TREASURY: TreasuryLine[] = [
  { label: "Gate Entry Fees", amount: 0, color: GOLD, icon: "🚪" },
  { label: "Founding Dues ($497)", amount: 0, color: GOLD, icon: "🛡" },
  { label: "MAYDAY Tickets", amount: 0, color: GREEN, icon: "🎟" },
  { label: "Circle Partners", amount: 0, color: BLUE, icon: "🤝" },
  { label: "Route Revenue (10%)", amount: 0, color: PURPLE, icon: "🚛" },
  { label: "Sponsor a Brother", amount: 0, color: AMBER, icon: "🎁" },
];

const FUND_ALLOCATIONS = [
  { label: "Chapter Expansion Reserve", pct: 30, color: GREEN },
  { label: "Brother Scholarships", pct: 15, color: BLUE },
  { label: "Equipment & Assets", pct: 20, color: AMBER },
  { label: "Emergency Fund", pct: 15, color: RED },
  { label: "Summit Operations", pct: 10, color: PURPLE },
  { label: "Unallocated", pct: 10, color: GOLD_DIM },
];

const GOVERNANCE_ITEMS: GovernanceItem[] = [
  {
    id: "SOP-001",
    title: "MAYDAY Summit Schedule — 72-Hour Formation",
    category: "SOP Update",
    submittedBy: "Steward 0001",
    status: "approved",
    votesFor: 1,
    votesAgainst: 0,
    quorum: 1,
    date: "2026-04-10",
  },
];

const LEGAL_DOCS: LegalDoc[] = [
  { name: "Mākoa Order LLC — Articles of Organization", type: "Entity", status: "pending", lastUpdated: "2026-04-11" },
  { name: "Brotherhood Membership Agreement", type: "Contract", status: "draft", lastUpdated: "2026-04-11" },
  { name: "Event Liability Waiver — MAYDAY 2026", type: "Waiver", status: "draft", lastUpdated: "2026-04-11" },
  { name: "NDA — Ali'i Council Members", type: "NDA", status: "draft", lastUpdated: "2026-04-11" },
  { name: "D&O Insurance — Directors", type: "Insurance", status: "pending", lastUpdated: "—" },
  { name: "General Liability — Events & Training", type: "Insurance", status: "pending", lastUpdated: "—" },
  { name: "Ice Bath / Cold Exposure Waiver", type: "Waiver", status: "draft", lastUpdated: "2026-04-11" },
];

const SUCCESSION_SEATS = [
  { seat: "Steward 0001", holder: "Kris Watanabe", backup: "First Ali'i Director", status: "active" },
  { seat: "Ali'i Seat 2", holder: "TBD — MAYDAY Selection", backup: "—", status: "open" },
  { seat: "Ali'i Seat 3", holder: "TBD — MAYDAY Selection", backup: "—", status: "open" },
  { seat: "Ali'i Seat 4", holder: "TBD — MAYDAY Selection", backup: "—", status: "open" },
  { seat: "Ali'i Seat 5–12", holder: "TBD — Founding Dinner", backup: "—", status: "open" },
];

/* ─── Status Colors ─────────────────────────────────────────────── */

const STATUS_COLORS: Record<string, string> = {
  active: GREEN,
  approved: GREEN,
  deployed: GREEN,
  voting: BLUE,
  building: AMBER,
  pending: AMBER,
  draft: GOLD_DIM,
  rejected: RED,
  expired: RED,
  open: GOLD_DIM,
};

/* ─── Component ─────────────────────────────────────────────────── */

interface FamilyOfficeTabProps {
  totalRevenue: number;
  activeBrothers: number;
  aliiCount: number;
}

export default function FamilyOfficeTab({ totalRevenue, activeBrothers, aliiCount }: FamilyOfficeTabProps) {
  const [section, setSection] = useState<"treasury" | "governance" | "legal" | "fund" | "succession" | "reports">("treasury");

  const sections = [
    { key: "treasury" as const, label: "TREASURY", icon: "💰" },
    { key: "governance" as const, label: "GOVERNANCE", icon: "🏛" },
    { key: "legal" as const, label: "LEGAL", icon: "📜" },
    { key: "fund" as const, label: "INVESTMENT", icon: "📈" },
    { key: "succession" as const, label: "SUCCESSION", icon: "👑" },
    { key: "reports" as const, label: "XI REPORTS", icon: "📊" },
  ];

  return (
    <div style={{ animation: "fadeUp 0.4s ease forwards" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <p style={{ color: GOLD, fontSize: "0.7rem", letterSpacing: "0.15em" }}>MĀKOA FAMILY OFFICE</p>
          <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.2em", marginTop: "4px" }}>
            ALI'I COUNCIL · RESTRICTED · EST. MAY 2026
          </p>
        </div>
        <div style={{
          background: "rgba(176,142,80,0.06)",
          border: "1px solid rgba(176,142,80,0.15)",
          borderRadius: "8px",
          padding: "8px 14px",
          textAlign: "center",
        }}>
          <p style={{ color: GOLD, fontSize: "0.7rem" }}>{aliiCount}</p>
          <p style={{ color: GOLD_DIM, fontSize: "0.36rem", letterSpacing: "0.1em" }}>ALI'I SEATED</p>
        </div>
      </div>

      {/* Section nav */}
      <div style={{
        display: "flex",
        gap: "4px",
        marginBottom: "20px",
        overflowX: "auto",
        paddingBottom: "4px",
        scrollbarWidth: "none",
      }}>
        {sections.map(s => (
          <button
            key={s.key}
            onClick={() => setSection(s.key)}
            style={{
              background: section === s.key ? "rgba(176,142,80,0.12)" : "transparent",
              border: `1px solid ${section === s.key ? "rgba(176,142,80,0.3)" : "rgba(176,142,80,0.08)"}`,
              color: section === s.key ? GOLD : GOLD_DIM,
              fontSize: "0.4rem",
              letterSpacing: "0.1em",
              padding: "8px 12px",
              borderRadius: "6px",
              cursor: "pointer",
              fontFamily: "'JetBrains Mono', monospace",
              whiteSpace: "nowrap",
              transition: "all 0.2s",
            }}
          >
            {s.icon} {s.label}
          </button>
        ))}
      </div>

      {/* ─── TREASURY ──────────────────────────────────────────── */}
      {section === "treasury" && (
        <div>
          {/* Summary cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "20px" }}>
            {[
              { label: "TOTAL REVENUE", value: `$${totalRevenue.toLocaleString()}`, color: GREEN },
              { label: "ORDER FUND (10%)", value: `$${Math.round(totalRevenue * 0.1).toLocaleString()}`, color: GOLD },
              { label: "BROTHERS", value: activeBrothers.toString(), color: BLUE },
            ].map(card => (
              <div key={card.label} style={{
                background: "rgba(0,0,0,0.3)",
                border: "1px solid rgba(176,142,80,0.1)",
                borderRadius: "8px",
                padding: "14px 12px",
                textAlign: "center",
              }}>
                <p style={{ color: card.color, fontSize: "0.85rem", fontWeight: 500, marginBottom: "4px" }}>{card.value}</p>
                <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.36rem", letterSpacing: "0.12em" }}>{card.label}</p>
              </div>
            ))}
          </div>

          {/* Revenue lines */}
          <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.15em", marginBottom: "12px" }}>REVENUE STREAMS</p>
          <div style={{ display: "grid", gap: "6px" }}>
            {TREASURY.map(line => (
              <div key={line.label} style={{
                background: GOLD_FAINT,
                border: "1px solid rgba(176,142,80,0.08)",
                borderRadius: "8px",
                padding: "12px 14px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "0.7rem" }}>{line.icon}</span>
                  <span style={{ color: "#e8e0d0", fontSize: "0.52rem" }}>{line.label}</span>
                </div>
                <span style={{ color: line.color, fontSize: "0.6rem", fontWeight: 500 }}>
                  ${line.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {/* 80/10/10 split */}
          <div style={{
            marginTop: "20px",
            background: "rgba(0,0,0,0.3)",
            border: "1px solid rgba(176,142,80,0.1)",
            borderRadius: "8px",
            padding: "16px",
          }}>
            <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.15em", marginBottom: "12px" }}>REVENUE SPLIT — 80 / 10 / 10</p>
            <div style={{ display: "flex", gap: "4px", height: "8px", borderRadius: "4px", overflow: "hidden", marginBottom: "10px" }}>
              <div style={{ width: "80%", background: GREEN, borderRadius: "4px 0 0 4px" }} />
              <div style={{ width: "10%", background: BLUE }} />
              <div style={{ width: "10%", background: GOLD, borderRadius: "0 4px 4px 0" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: GREEN, fontSize: "0.42rem" }}>80% Brother</span>
              <span style={{ color: BLUE, fontSize: "0.42rem" }}>10% House</span>
              <span style={{ color: GOLD, fontSize: "0.42rem" }}>10% Order</span>
            </div>
          </div>
        </div>
      )}

      {/* ─── GOVERNANCE ────────────────────────────────────────── */}
      {section === "governance" && (
        <div>
          <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.15em", marginBottom: "16px" }}>
            SOP PROPOSALS — {GOVERNANCE_ITEMS.length} total
          </p>
          <div style={{ display: "grid", gap: "8px" }}>
            {GOVERNANCE_ITEMS.map(item => (
              <div key={item.id} style={{
                background: GOLD_FAINT,
                border: "1px solid rgba(176,142,80,0.1)",
                borderRadius: "8px",
                padding: "14px 16px",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <span style={{ color: GOLD, fontSize: "0.48rem", fontWeight: 500 }}>{item.id}</span>
                      <span style={{
                        color: STATUS_COLORS[item.status] || GOLD_DIM,
                        fontSize: "0.38rem",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        background: `${STATUS_COLORS[item.status] || GOLD_DIM}15`,
                        border: `1px solid ${STATUS_COLORS[item.status] || GOLD_DIM}30`,
                        padding: "2px 8px",
                        borderRadius: "3px",
                      }}>
                        {item.status}
                      </span>
                    </div>
                    <p style={{ color: "#e8e0d0", fontSize: "0.55rem", marginBottom: "4px" }}>{item.title}</p>
                    <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.42rem" }}>
                      {item.category} · {item.submittedBy} · {item.date}
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ color: GREEN, fontSize: "0.5rem" }}>▲ {item.votesFor}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ color: RED, fontSize: "0.5rem" }}>▼ {item.votesAgainst}</span>
                  </div>
                  <span style={{ color: "rgba(232,224,208,0.25)", fontSize: "0.4rem" }}>
                    Quorum: {item.votesFor + item.votesAgainst}/{item.quorum} needed
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Proposal submission guide */}
          <div style={{
            marginTop: "20px",
            background: "rgba(0,0,0,0.3)",
            border: "1px solid rgba(176,142,80,0.1)",
            borderRadius: "8px",
            padding: "16px",
          }}>
            <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.15em", marginBottom: "10px" }}>HOW TO SUBMIT A PROPOSAL</p>
            {[
              "Ali'i or Mana Director submits proposal to Mākoa 808 channel",
              "XI receives, audits for conflicts, estimates scope",
              "Directors vote — 2/3 majority required to approve",
              "XI builds approved proposals → build check → deploy → verify",
              "XI posts completion report to Mākoa 808",
            ].map((step, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "6px" }}>
                <span style={{ color: GOLD, fontSize: "0.48rem", minWidth: "16px" }}>{i + 1}.</span>
                <span style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.45rem", lineHeight: 1.5 }}>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── LEGAL & COMPLIANCE ────────────────────────────────── */}
      {section === "legal" && (
        <div>
          <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.15em", marginBottom: "16px" }}>
            LEGAL DOCUMENTS & COMPLIANCE — {LEGAL_DOCS.length} items
          </p>
          <div style={{ display: "grid", gap: "6px" }}>
            {LEGAL_DOCS.map(doc => (
              <div key={doc.name} style={{
                background: GOLD_FAINT,
                border: "1px solid rgba(176,142,80,0.08)",
                borderRadius: "8px",
                padding: "12px 14px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
                <div>
                  <p style={{ color: "#e8e0d0", fontSize: "0.52rem", marginBottom: "3px" }}>{doc.name}</p>
                  <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.4rem" }}>{doc.type} · Updated {doc.lastUpdated}</p>
                </div>
                <span style={{
                  color: STATUS_COLORS[doc.status] || GOLD_DIM,
                  fontSize: "0.38rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  background: `${STATUS_COLORS[doc.status] || GOLD_DIM}15`,
                  border: `1px solid ${STATUS_COLORS[doc.status] || GOLD_DIM}30`,
                  padding: "2px 8px",
                  borderRadius: "3px",
                }}>
                  {doc.status}
                </span>
              </div>
            ))}
          </div>

          {/* Tax write-off calendar */}
          <div style={{
            marginTop: "20px",
            background: "rgba(0,0,0,0.3)",
            border: "1px solid rgba(176,142,80,0.1)",
            borderRadius: "8px",
            padding: "16px",
          }}>
            <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.15em", marginBottom: "10px" }}>TAX WRITE-OFF CALENDAR</p>
            {[
              { item: "Fraternal order dues", timing: "Annual (Jan)", note: "501(c)(8) deductible" },
              { item: "Event expenses (MAYDAY, Makahiki)", timing: "Per event", note: "Venue, food, travel" },
              { item: "Training equipment (ice baths, gear)", timing: "Ongoing", note: "Chapter ops expense" },
              { item: "Community service hours", timing: "Quarterly log", note: "Charitable contribution" },
              { item: "Technology & platform costs", timing: "Monthly", note: "Vercel, Supabase, domains" },
            ].map((row, i) => (
              <div key={i} style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 0",
                borderBottom: i < 4 ? "1px solid rgba(176,142,80,0.06)" : "none",
              }}>
                <span style={{ color: "#e8e0d0", fontSize: "0.45rem", flex: 1 }}>{row.item}</span>
                <span style={{ color: GOLD_DIM, fontSize: "0.42rem", flex: 0.5, textAlign: "center" }}>{row.timing}</span>
                <span style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.4rem", flex: 0.5, textAlign: "right" }}>{row.note}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── INVESTMENT FUND ───────────────────────────────────── */}
      {section === "fund" && (
        <div>
          <div style={{
            background: "rgba(0,0,0,0.3)",
            border: "1px solid rgba(176,142,80,0.15)",
            borderRadius: "8px",
            padding: "20px",
            textAlign: "center",
            marginBottom: "20px",
          }}>
            <p style={{ color: GOLD, fontSize: "1.2rem", fontWeight: 500, marginBottom: "4px" }}>
              ${Math.round(totalRevenue * 0.1).toLocaleString()}
            </p>
            <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.15em" }}>ORDER FUND BALANCE (10% OF REVENUE)</p>
          </div>

          <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.15em", marginBottom: "12px" }}>ALLOCATION TARGETS</p>
          {/* Allocation bar */}
          <div style={{ display: "flex", gap: "2px", height: "10px", borderRadius: "5px", overflow: "hidden", marginBottom: "16px" }}>
            {FUND_ALLOCATIONS.map(a => (
              <div key={a.label} style={{ width: `${a.pct}%`, background: a.color, transition: "width 0.3s" }} />
            ))}
          </div>

          <div style={{ display: "grid", gap: "6px" }}>
            {FUND_ALLOCATIONS.map(a => (
              <div key={a.label} style={{
                background: GOLD_FAINT,
                border: "1px solid rgba(176,142,80,0.08)",
                borderRadius: "8px",
                padding: "12px 14px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: a.color }} />
                  <span style={{ color: "#e8e0d0", fontSize: "0.5rem" }}>{a.label}</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ color: a.color, fontSize: "0.55rem", fontWeight: 500 }}>{a.pct}%</span>
                  <p style={{ color: "rgba(232,224,208,0.25)", fontSize: "0.38rem" }}>
                    ${Math.round(totalRevenue * 0.1 * a.pct / 100).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: "20px",
            background: "rgba(88,166,255,0.06)",
            border: "1px solid rgba(88,166,255,0.15)",
            borderRadius: "8px",
            padding: "14px",
          }}>
            <p style={{ color: BLUE, fontSize: "0.45rem", marginBottom: "6px" }}>INVESTMENT DEPLOYMENTS</p>
            <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.42rem", lineHeight: 1.6 }}>
              Fund deployments require Ali'i council vote (2/3 majority). XI audits each proposal
              for ROI, risk, and alignment with the 100-year vision before presenting to council.
            </p>
          </div>
        </div>
      )}

      {/* ─── SUCCESSION ────────────────────────────────────────── */}
      {section === "succession" && (
        <div>
          <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.15em", marginBottom: "16px" }}>
            ESTATE & SUCCESSION — SEAT CONTINUITY PROTOCOL
          </p>
          <div style={{ display: "grid", gap: "8px" }}>
            {SUCCESSION_SEATS.map(seat => (
              <div key={seat.seat} style={{
                background: GOLD_FAINT,
                border: `1px solid ${seat.status === "active" ? "rgba(63,185,80,0.2)" : "rgba(176,142,80,0.08)"}`,
                borderRadius: "8px",
                padding: "14px 16px",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                  <div>
                    <p style={{ color: GOLD, fontSize: "0.55rem", marginBottom: "3px" }}>{seat.seat}</p>
                    <p style={{ color: "#e8e0d0", fontSize: "0.5rem" }}>{seat.holder}</p>
                  </div>
                  <span style={{
                    color: seat.status === "active" ? GREEN : GOLD_DIM,
                    fontSize: "0.38rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}>
                    {seat.status}
                  </span>
                </div>
                <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.42rem" }}>
                  Succession: {seat.backup}
                </p>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: "20px",
            background: "rgba(0,0,0,0.3)",
            border: "1px solid rgba(176,142,80,0.1)",
            borderRadius: "8px",
            padding: "16px",
          }}>
            <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.15em", marginBottom: "10px" }}>SUCCESSION RULES</p>
            {[
              "If a co-founder steps down, their seat opens for council vote",
              "If a co-founder passes, their seat transfers to designated successor or council vote",
              "No seat is permanent — annual reaffirmation at Makahiki",
              "XI maintains the Warbook — the Order's intelligence survives any one person",
              "The mission outlives every individual. That's the 100-year design.",
            ].map((rule, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "6px" }}>
                <span style={{ color: GOLD, fontSize: "0.42rem" }}>§{i + 1}</span>
                <span style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.43rem", lineHeight: 1.5 }}>{rule}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── XI REPORTS ────────────────────────────────────────── */}
      {section === "reports" && (
        <div>
          <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.15em", marginBottom: "16px" }}>
            XI WEEKLY INTELLIGENCE BRIEF
          </p>

          {/* Report card */}
          <div style={{
            background: "rgba(0,0,0,0.3)",
            border: "1px solid rgba(176,142,80,0.15)",
            borderRadius: "10px",
            padding: "20px",
            marginBottom: "16px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
              <div>
                <p style={{ color: GOLD, fontSize: "0.6rem", marginBottom: "3px" }}>XI BRIEF — Week of April 7, 2026</p>
                <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.4rem" }}>Auto-generated · Classification: ALI'I EYES ONLY</p>
              </div>
              <span style={{ color: GREEN, fontSize: "0.38rem", letterSpacing: "0.15em" }}>CURRENT</span>
            </div>

            {[
              { section: "PLATFORM STATUS", content: "27 pages deployed. 4 API routes operational. 13 email templates active. Gate scoring live. Command Center: 20 tabs operational.", color: GREEN },
              { section: "REVENUE", content: `$${totalRevenue.toLocaleString()} total collected. ${activeBrothers} brothers active. Gate applications processing.`, color: GOLD },
              { section: "RISK FLAGS", content: "Stripe still in test mode — switch to live before MAYDAY. Telegram group needs creation. Vercel env vars need verification.", color: AMBER },
              { section: "MAYDAY COUNTDOWN", content: "20 days to MAYDAY. Venue: Kapolei. Hotels: Embassy Suites (Ali'i) + Hampton Inn (Mana). Dinner: Moani Island Bistro. 48 seat target.", color: BLUE },
              { section: "NEXT ACTIONS", content: "1) Switch Stripe to live mode. 2) Create Telegram group. 3) Set Vercel env vars. 4) Begin brother onboarding. 5) Finalize Ali'i prospect shortlist.", color: PURPLE },
            ].map(item => (
              <div key={item.section} style={{ marginBottom: "14px" }}>
                <p style={{ color: item.color, fontSize: "0.42rem", letterSpacing: "0.12em", marginBottom: "4px" }}>{item.section}</p>
                <p style={{ color: "rgba(232,224,208,0.55)", fontSize: "0.45rem", lineHeight: 1.6 }}>{item.content}</p>
              </div>
            ))}
          </div>

          <p style={{ color: "rgba(232,224,208,0.2)", fontSize: "0.38rem", textAlign: "center", fontStyle: "italic" }}>
            XI generates a fresh brief every Monday at 06:00 HST. Next brief: April 14, 2026.
          </p>
        </div>
      )}
    </div>
  );
}
