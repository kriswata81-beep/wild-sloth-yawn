import type { Metadata } from "next";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.5)";
const GOLD_FAINT = "rgba(176,142,80,0.15)";
const TEXT = "rgba(232,224,208,0.75)";
const MUTED = "rgba(232,224,208,0.45)";

export const metadata: Metadata = {
  title: "Privacy — Mākoa Brotherhood",
  description: "How Mākoa handles brother data, payments, and trust. Plain English. Under the Malu.",
};

const LAST_UPDATED = "April 16, 2026";

const SECTIONS = [
  {
    h: "WHAT WE COLLECT",
    body: [
      "When you enter the gate, we collect what you tell us: your name, email, phone, region, your answers to the 12 questions, and your Telegram handle. We collect this because the order needs to know who you are before you stand with brothers.",
      "When you pay — for the gate, an event, or co-founder seat — Stripe processes the card. We do not see your card number. We see only what Stripe tells us: amount, date, that you paid.",
      "When you visit the site, your browser sends standard request data: IP address, user-agent, page visited. Vercel (our host) and we use this to serve the site and detect abuse. We do not run third-party trackers, ad pixels, or session replay.",
    ],
  },
  {
    h: "WHO WE SHARE IT WITH",
    body: [
      "Brothers in your formation circle and your assigned mentors see your handle, region, and rank. They do not see your contact info unless you give it.",
      "Service providers we use to run the order: Stripe (payments), Supabase (database), Resend (email), Vercel (hosting), Telegram (channels), and Blotato (social posting on the order's accounts only — never yours). Each has its own privacy policy.",
      "We do not sell your data. We do not share it with advertisers. We do not give it to data brokers.",
      "If a court orders us to hand over data, we will respond as required by law. We will tell you unless legally barred.",
    ],
  },
  {
    h: "HOW WE USE IT",
    body: [
      "To run the gate — XI scores your application and sends your acceptance, hold, or not-yet response.",
      "To send you email about your application, payments, gatherings, and rank progression. You can stop these by replying STOP or emailing the address below.",
      "To send 808 Telegram channel messages once you opt in.",
      "To track your rank, attendance, route revenue, and other operational data needed to govern the order.",
    ],
  },
  {
    h: "YOUR RIGHTS",
    body: [
      "You can ask what we have about you. We will send it.",
      "You can ask us to correct or delete it. We will, except where the order needs it for legal, financial, or safety reasons (e.g. payment records, crisis-detection logs).",
      "You can leave the order at any time. Your data is archived but not used.",
      "If you are in California, the EU, or another jurisdiction with stronger rights, those rights apply to you on top of these.",
    ],
  },
  {
    h: "CHILDREN",
    body: [
      "The order is for men 18 and older. We do not knowingly collect data from anyone under 18. If you believe we have, contact us and we will delete it.",
    ],
  },
  {
    h: "SECURITY",
    body: [
      "We use industry-standard encryption in transit (HTTPS) and at rest (Supabase + Vercel platform encryption). Stripe handles all card data. We protect what brothers give us as we would protect a brother.",
      "If a breach affects your data, we will notify you within 72 hours of confirming it.",
    ],
  },
  {
    h: "CONTACT",
    body: [
      "Questions about your data, this policy, or anything else: wakachief@gmail.com",
      "Mākoa Order · Malu Trust · West Oʻahu",
    ],
  },
];

export default function PrivacyPage() {
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
            Privacy
          </h1>
          <p style={{ color: MUTED, fontSize: "0.78rem", lineHeight: 1.6 }}>
            How we handle what brothers give us.<br />
            Plain English. No tricks.
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
