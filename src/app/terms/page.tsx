import type { Metadata } from "next";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.5)";
const GOLD_FAINT = "rgba(176,142,80,0.15)";
const TEXT = "rgba(232,224,208,0.75)";
const MUTED = "rgba(232,224,208,0.45)";
const RED = "#e05c5c";

export const metadata: Metadata = {
  title: "Terms — Mākoa Brotherhood",
  description: "The terms a brother accepts when he passes through the gate. Plain English. No fine print.",
};

const LAST_UPDATED = "April 16, 2026";

const SECTIONS = [
  {
    h: "WHAT MĀKOA IS",
    body: [
      "Mākoa is a private brotherhood and mutual association of men, headquartered on West Oʻahu and operated under the Malu Trust. The order runs trainings, gatherings, and a service economy among brothers. It is not a public membership organization, a gym, or a social network.",
      "By passing through the gate and accepting these terms, you agree that the order's standards, language, and decisions apply to you while you stand in it.",
    ],
  },
  {
    h: "GATE & MEMBERSHIP",
    body: [
      "The gate is free. Your 12 answers are your application. XI scores every submission and may accept, hold, or decline.",
      "If you are accepted, the founding membership rate is $497/year, locked for life as long as you remain in good standing. If you decline within 7 days of acceptance, your founding rate is refunded (gate fee is not).",
      "The order may remove a brother for breach of conduct, dishonesty, threats, or behavior that endangers the brotherhood. Removal forfeits remaining dues and equity. The order does not refund forfeited amounts.",
    ],
  },
  {
    h: "EVENTS & PHYSICAL RISK",
    body: [
      "MAYDAY and other 48-hour gatherings include physical activity (4am ice immersion, conditioning, manual labor). These activities carry inherent risk of injury, illness, hypothermia, or worse.",
      "By registering, you accept that risk. You agree to disclose medical conditions that could be affected, and to follow Steward and director instructions during events.",
      "A separate written waiver and assumption-of-risk agreement is required at event check-in. Without it, you do not enter the fire.",
    ],
  },
  {
    h: "PURCHASES & REFUNDS",
    body: [
      "Day Pass ($97), Mastermind ($197), and War Room ($397 deposit) are event-specific. These are refundable up to 14 days before the event start. After 14 days, they are non-refundable but may be transferred to another approved brother with Steward sign-off.",
      "Aliʻi co-founder seats ($4,997) are equity transactions, not memberships. See the next section.",
      "Sponsor purchases (someone gifting a man into the order) are non-refundable once the recipient is notified. If the recipient declines, the funds become a contribution to the Mākoa House.",
    ],
  },
  {
    h: "CO-FOUNDER EQUITY (ALIʻI · $4,997)",
    body: [
      "The Aliʻi co-founder seat is a one-time purchase that grants 1% equity in Mākoa Trade Co. LLC, a permanent Aliʻi Council seat, and territory revenue rights as defined in the founding charter.",
      "This is an equity instrument. You should consult your own legal and financial advisors before purchasing. The order makes no representation about future returns. Projections shown on the website (Year 1 ARR, Year 3 ARR, etc.) are forward-looking estimates, not guarantees.",
      "Equity vests on signing the founding charter at MAYDAY. If you do not attend MAYDAY or sign the charter, the $4,997 converts to a contribution to the Mākoa House and equity is not granted.",
      "Equity may not be transferred without Aliʻi Council approval. The Council reserves the right to repurchase equity at fair market value upon a brother's voluntary departure or removal.",
    ],
  },
  {
    h: "CONDUCT",
    body: [
      "Brothers carry the weight. They show up. They speak truth. They protect what is given to them.",
      "Conduct that gets you removed: dishonesty, theft from a brother, harassment, abuse, threats, betrayal of confidences shared in circle, or behavior that brings disrepute to the order.",
      "Disputes between brothers go to the Aliʻi Council. The Council decides. Decisions are final within the order.",
    ],
  },
  {
    h: "INTELLECTUAL PROPERTY",
    body: [
      "The Mākoa name, crest, language, training materials, and platform are property of Malu Trust. Brothers may use these in good faith for their work in the order. Public use, commercial reproduction, or external distribution requires Steward approval.",
      "Content brothers post in private channels (808, formation circles, etc.) belongs to the brother. The order may quote or use it for the order's own purposes (training, marketing) only with the brother's permission.",
    ],
  },
  {
    h: "GOVERNING LAW & DISPUTES",
    body: [
      "These terms are governed by the laws of the State of Hawaiʻi. Any dispute that cannot be resolved within the order shall be brought in state or federal courts located in Honolulu, Hawaiʻi.",
      "Brothers waive participation in class actions against the order. Disputes are individual.",
    ],
  },
  {
    h: "CHANGES",
    body: [
      "The order may update these terms. Material changes will be announced on the 808 channel and by email at least 14 days before they take effect. Continued participation after that date means you accept the changes.",
    ],
  },
  {
    h: "CONTACT",
    body: [
      "Questions, disputes, or anything else: wakachief@gmail.com",
      "Mākoa Order · Malu Trust · West Oʻahu",
    ],
  },
];

export default function TermsPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#04060a",
        color: TEXT,
        fontFamily: "'JetBrains Mono', monospace",
        padding: "60px 20px 80px",
      }}
    >
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p
            style={{
              color: GOLD_DIM,
              fontSize: "0.42rem",
              letterSpacing: "0.3em",
              marginBottom: 12,
            }}
          >
            UNDER THE MALU
          </p>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              color: GOLD,
              fontSize: "2.6rem",
              margin: "0 0 12px",
              fontWeight: 300,
            }}
          >
            Terms
          </h1>
          <p style={{ color: MUTED, fontSize: "0.78rem", lineHeight: 1.6 }}>
            What a brother accepts when he passes the gate.<br />
            Plain English. No fine print.
          </p>
          <p
            style={{
              color: GOLD_DIM,
              fontSize: "0.66rem",
              marginTop: 16,
              letterSpacing: "0.12em",
            }}
          >
            Last updated: {LAST_UPDATED}
          </p>
        </div>

        {/* Risk acknowledgment banner */}
        <div
          style={{
            border: `1px solid ${RED}40`,
            background: "rgba(224,92,92,0.05)",
            borderRadius: 8,
            padding: "16px 18px",
            marginBottom: 36,
          }}
        >
          <p
            style={{
              color: RED,
              fontSize: "0.7rem",
              letterSpacing: "0.18em",
              marginBottom: 8,
              fontWeight: 700,
            }}
          >
            READ BEFORE PAYING
          </p>
          <p style={{ color: TEXT, fontSize: "0.78rem", lineHeight: 1.6 }}>
            The Aliʻi co-founder seat ($4,997) is an equity transaction, not a refundable membership. Read that section carefully and consult your own advisors before buying.
          </p>
        </div>

        {/* Sections */}
        {SECTIONS.map((s) => (
          <section
            key={s.h}
            style={{
              marginBottom: 36,
              paddingBottom: 28,
              borderBottom: `1px solid ${GOLD_FAINT}`,
            }}
          >
            <h2
              style={{
                color: GOLD,
                fontSize: "0.72rem",
                letterSpacing: "0.22em",
                marginBottom: 18,
                fontWeight: 600,
              }}
            >
              {s.h}
            </h2>
            {s.body.map((p, i) => (
              <p
                key={i}
                style={{
                  color: TEXT,
                  fontSize: "0.82rem",
                  lineHeight: 1.7,
                  marginBottom: 12,
                }}
              >
                {p}
              </p>
            ))}
          </section>
        ))}

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 36 }}>
          <a
            href="/privacy"
            style={{
              color: GOLD_DIM,
              fontSize: "0.7rem",
              letterSpacing: "0.18em",
              textDecoration: "none",
              marginRight: 24,
            }}
          >
            PRIVACY
          </a>
          <a
            href="/"
            style={{
              color: GOLD_DIM,
              fontSize: "0.7rem",
              letterSpacing: "0.18em",
              textDecoration: "none",
            }}
          >
            ← RETURN HOME
          </a>
          <p
            style={{
              color: "rgba(176,142,80,0.18)",
              fontSize: "0.6rem",
              letterSpacing: "0.15em",
              marginTop: 24,
            }}
          >
            Mākoa Order · Malu Trust · West Oʻahu · 2026
          </p>
        </div>
      </div>
    </div>
  );
}
