"use client";

const GOLD = "#b08e50";
const GOLD_20 = "rgba(176,142,80,0.2)";
const GREEN = "#3fb950";
const BLUE = "#58a6ff";
const RED = "#f85149";

// Where every dollar goes — transparent to brothers
const REVENUE_BREAKDOWN = [
  { label: "Brother (Route Operator)", pct: 80, color: GREEN, desc: "Kept by the brother who runs the route" },
  { label: "The House (Local Chapter)", pct: 10, color: BLUE, desc: "Chapter events, ice, supplies, venue" },
  { label: "The Order (Mākoa HQ)", pct: 10, color: GOLD, desc: "Platform, XI, media, summits, patches" },
];

const DUES_BREAKDOWN = [
  { label: "Weekly circles (ice, venue, supplies)", amount: "$120", pct: 24 },
  { label: "Monthly Mākoa House (meeting space)", amount: "$60", pct: 12 },
  { label: "Quarterly Ka Hoʻike (event subsidy)", amount: "$80", pct: 16 },
  { label: "Platform & XI operations", amount: "$80", pct: 16 },
  { label: "Patches, coins, field manuals", amount: "$50", pct: 10 },
  { label: "Crisis Steward training", amount: "$27", pct: 5.5 },
  { label: "Content drops & marketing", amount: "$40", pct: 8 },
  { label: "Reserve fund (growth, legal, insurance)", amount: "$40", pct: 8 },
];

const ROI_METRICS = [
  { label: "Weekly elite reset training", value: "52 sessions/year", subtext: "Value: $2,600 (comparable gym: $50/session)" },
  { label: "Weekly Weight Room circle", value: "52 sessions/year", subtext: "Value: $5,200 (therapy: $100/session)" },
  { label: "Monthly Nā Koa Academy", value: "12 workshops/year", subtext: "Value: $2,400 (trade school: $200/class)" },
  { label: "Quarterly Ka Hoʻike (72HR)", value: "4 events/year", subtext: "Value: $2,400 (retreat: $600 each)" },
  { label: "Makahiki (annual resort)", value: "1 event/year", subtext: "Value: $1,500 (conference: $1,500)" },
  { label: "808 Network access", value: "365 days/year", subtext: "Value: $600 (mastermind group: $50/mo)" },
  { label: "Mentor pairing", value: "1:1 matched", subtext: "Value: $3,000 (executive coaching: $250/mo)" },
  { label: "Tool library + Mākoa Ride", value: "Unlimited access", subtext: "Value: $500 (tool rental: ~$500/year)" },
];

export default function ImpactDashboardTab() {
  const totalROI = 18200; // Sum of comparable values
  const duesCost = 497;
  const multiplier = Math.round(totalROI / duesCost);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div style={{ textAlign: "center", padding: "16px 0" }}>
        <div style={{ fontSize: "0.6rem", letterSpacing: "0.2em", color: GOLD, marginBottom: 8 }}>
          RETURN ON BROTHERHOOD
        </div>
        <div style={{ fontSize: "2.4rem", fontWeight: 800, color: "#fff" }}>
          {multiplier}x RETURN
        </div>
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>
          $497 annual dues → ${totalROI.toLocaleString()} in comparable value
        </div>
      </div>

      {/* 80/10/10 Split Visual */}
      <div style={{
        background: "rgba(255,255,255,0.02)",
        border: `1px solid ${GOLD_20}`,
        borderRadius: 14,
        padding: "20px",
      }}>
        <div style={{ fontSize: "0.6rem", letterSpacing: "0.15em", color: GOLD, marginBottom: 16, fontWeight: 600 }}>
          WHERE EVERY DOLLAR GOES — 80/10/10
        </div>

        {/* Bar */}
        <div style={{ display: "flex", borderRadius: 8, overflow: "hidden", height: 32, marginBottom: 16 }}>
          {REVENUE_BREAKDOWN.map((r) => (
            <div key={r.label} style={{
              width: `${r.pct}%`,
              background: r.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.7rem",
              fontWeight: 700,
              color: "#000",
            }}>
              {r.pct}%
            </div>
          ))}
        </div>

        {/* Legend */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {REVENUE_BREAKDOWN.map((r) => (
            <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: r.color, flexShrink: 0 }} />
              <div>
                <span style={{ color: "#fff", fontSize: "0.8rem", fontWeight: 600 }}>{r.label}</span>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.72rem", marginLeft: 8 }}>{r.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dues Breakdown */}
      <div style={{
        background: "rgba(255,255,255,0.02)",
        border: `1px solid ${GOLD_20}`,
        borderRadius: 14,
        padding: "20px",
      }}>
        <div style={{ fontSize: "0.6rem", letterSpacing: "0.15em", color: GOLD, marginBottom: 16, fontWeight: 600 }}>
          YOUR $497 ANNUAL DUES — LINE BY LINE
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {DUES_BREAKDOWN.map((d, i) => (
            <div key={i} style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: i < DUES_BREAKDOWN.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
            }}>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.78rem" }}>{d.label}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ color: GOLD, fontSize: "0.8rem", fontWeight: 600 }}>{d.amount}</span>
                <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.65rem", minWidth: 36, textAlign: "right" }}>{d.pct}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ROI Breakdown */}
      <div style={{
        background: "rgba(255,255,255,0.02)",
        border: `1px solid ${GOLD_20}`,
        borderRadius: 14,
        padding: "20px",
      }}>
        <div style={{ fontSize: "0.6rem", letterSpacing: "0.15em", color: GREEN, marginBottom: 16, fontWeight: 600 }}>
          WHAT YOU RECEIVE — COMPARABLE MARKET VALUE
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {ROI_METRICS.map((r, i) => (
            <div key={i} style={{
              background: "rgba(63,185,80,0.03)",
              border: "1px solid rgba(63,185,80,0.08)",
              borderRadius: 8,
              padding: "10px 14px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                <span style={{ color: "#fff", fontSize: "0.78rem", fontWeight: 600 }}>{r.label}</span>
                <span style={{ color: GREEN, fontSize: "0.78rem", fontWeight: 600 }}>{r.value}</span>
              </div>
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.68rem" }}>{r.subtext}</div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 16,
          padding: "14px",
          background: "rgba(63,185,80,0.06)",
          borderRadius: 8,
          textAlign: "center",
        }}>
          <div style={{ color: GREEN, fontSize: "1.2rem", fontWeight: 800 }}>
            ${totalROI.toLocaleString()} in value
          </div>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.72rem", marginTop: 4 }}>
            For $497/year — that is a {multiplier}x return on your brotherhood
          </div>
        </div>
      </div>

      {/* Tax Write-off Note */}
      <div style={{
        background: "rgba(88,166,255,0.04)",
        border: "1px solid rgba(88,166,255,0.12)",
        borderRadius: 10,
        padding: "14px 16px",
      }}>
        <div style={{ fontSize: "0.6rem", letterSpacing: "0.1em", color: BLUE, marginBottom: 6, fontWeight: 600 }}>
          TAX NOTE
        </div>
        <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.72rem", lineHeight: 1.6 }}>
          Annual dues and event registrations may be deductible as professional association fees
          and professional development. Consult your tax advisor. MAYDAY and Makahiki include
          documented business content (workshops, route strategy, trade academies).
        </div>
      </div>
    </div>
  );
}
