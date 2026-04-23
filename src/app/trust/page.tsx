"use client";

const GOLD = "#D4A668";
const GOLD_40 = "rgba(212,166,104,0.4)";
const GOLD_20 = "rgba(212,166,104,0.2)";
const GOLD_10 = "rgba(212,166,104,0.1)";
const GOLD_DIM = "rgba(212,166,104,0.6)";
const BG = "#04060a";

const divider = (label: string) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
    <div style={{ flex: 1, height: 1, background: GOLD_20 }} />
    <p style={{ color: GOLD_DIM, fontSize: "13px", letterSpacing: "0.28em", whiteSpace: "nowrap", fontFamily: "'JetBrains Mono', monospace" }}>{label}</p>
    <div style={{ flex: 1, height: 1, background: GOLD_20 }} />
  </div>
);

const PILLARS = [
  {
    title: "LOYALTY TO MEN",
    body: "We do not serve markets. We do not serve metrics. We serve the men in the brotherhood — present and not-yet-born. Every decision is measured against what it does for brothers and their descendants.",
  },
  {
    title: "TERRITORY OVER TREND",
    body: "We build chapters in real cities. 80% of trade stays where the work happens. No economic extraction from brothers' labor. No middlemen taking the cream.",
  },
  {
    title: "OATH OVER CONTRACT",
    body: "A contract can be renegotiated. An oath cannot. When a man takes the Aliʻi oath, it is permanent. His name is on the Palapala forever. His equity passes to his family. The order does not take back what was given.",
  },
];

const ENTITIES = [
  { icon: "🔥", name: "MAKOA ORDER", desc: "the B2C brotherhood (the Ohana network)" },
  { icon: "💧", name: "MAKOA TRADE CO.", desc: "the B2B trade entity (labor + knowledge routes)" },
  { icon: "🌐", name: "MAKOA.LIVE", desc: "the public shell (the site you are reading)" },
  { icon: "🛡", name: "XI", desc: "the autonomous keeper layer (holds the keys, runs the ledger)" },
];

const XI_LINES = [
  {
    icon: "🔥",
    name: "XI.FIRE — Aliʻi Command Line",
    who: "Who uses it: the 20 founding Aliʻi · chapter chiefs",
    items: [
      "Council channel · territory registry · founding scroll",
      "Cross-chapter messaging · treasury rollups",
      "80/10/10 live visualization",
    ],
  },
  {
    icon: "💧",
    name: "XI.WATER — Mana Operations Line",
    who: "Who uses it: Mana rank · operators · chapter builders",
    items: [
      "B2B + B2C smart contract generator",
      "ZIP cluster intel — enter a zip, get the businesses, categories, routes",
      "SaaS bundle templates by business category · labor route builder · revenue tracking",
    ],
  },
  {
    icon: "🌬",
    name: "XI.WIND — Nakoa Field Line",
    who: "Who uses it: Nakoa rank · field brothers · responders",
    items: [
      "411 — intel requests · 911 — urgent dispatch",
      "Peer-to-peer cohort formation",
      "Fastest response layer · training circulation between chapters",
    ],
  },
];

export default function TrustPage() {
  return (
    <div style={{ minHeight: "100vh", background: BG, color: "#e8e0d0", fontFamily: "'JetBrains Mono', monospace", paddingBottom: 80 }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes breathe { 0%,100%{opacity:0.5;}50%{opacity:1;} }
        @keyframes goldGlow { 0%,100% { box-shadow:0 0 16px rgba(212,166,104,0.1); } 50% { box-shadow:0 0 40px rgba(212,166,104,0.3); } }
      `}</style>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <div style={{
        background: "linear-gradient(180deg, #060810 0%, #04060a 100%)",
        borderBottom: `1px solid ${GOLD_20}`,
        padding: "72px 24px 56px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 0%, rgba(212,166,104,0.07) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />
        <div style={{ height: 1, background: `linear-gradient(to right, transparent, ${GOLD_40}, transparent)`, marginBottom: 48 }} />

        <p style={{
          color: GOLD_DIM, fontSize: "14px", letterSpacing: "0.35em",
          marginBottom: 20, animation: "fadeUp 0.7s ease 0.1s both",
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          ◈ XI.TRUST · THE KEEPER LAYER
        </p>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          color: GOLD,
          fontSize: "clamp(2.8rem, 10vw, 5rem)",
          lineHeight: 1.05,
          margin: "0 0 20px",
          letterSpacing: "-0.02em",
          fontWeight: 400,
          animation: "fadeUp 0.8s ease 0.2s both",
        }}>
          What Mākoa Is
        </h1>

        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          color: "rgba(232,224,208,0.6)",
          fontSize: "clamp(1.2rem, 3vw, 1.5rem)",
          lineHeight: 1.6,
          animation: "fadeUp 0.8s ease 0.35s both",
        }}>
          Loyalty to men. For one hundred years.
        </p>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "56px 24px 0" }}>

        {/* ── OPENING ───────────────────────────────────────────────────────── */}
        <div style={{
          background: "rgba(212,166,104,0.03)",
          border: `1px solid ${GOLD_20}`,
          borderRadius: 12,
          padding: "32px 28px",
          marginBottom: 56,
        }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: "#e8e0d0",
            fontSize: "clamp(1.1rem, 2.5vw, 1.35rem)",
            lineHeight: 2.0,
            marginBottom: 20,
          }}>
            Mākoa is a men&apos;s crowdfunding movement for a humanitarian rollout under the Malu Trust — a 100-year trade order with ranks, territory, oath, and stewardship.
          </p>
          <p style={{
            color: "rgba(232,224,208,0.6)",
            fontSize: "18px",
            lineHeight: 1.9,
          }}>
            It is not a retreat. Not a membership. Not an info product. It is a founding — one that happens once in May 2026 and never again.
          </p>
        </div>

        {/* ── THREE PILLARS ─────────────────────────────────────────────────── */}
        {divider("WHAT WE STAND FOR")}

        <div style={{ display: "grid", gap: 2, marginBottom: 56 }}>
          {PILLARS.map((p, i) => (
            <div key={i} style={{
              padding: "28px 24px",
              background: "rgba(0,0,0,0.2)",
              border: `1px solid ${GOLD_20}`,
              borderRadius: i === 0 ? "10px 10px 0 0" : i === PILLARS.length - 1 ? "0 0 10px 10px" : "0",
            }}>
              <p style={{
                color: GOLD,
                fontSize: "13px",
                letterSpacing: "0.22em",
                marginBottom: 14,
                fontFamily: "'JetBrains Mono', monospace",
              }}>{p.title}</p>
              <p style={{
                color: "rgba(232,224,208,0.65)",
                fontSize: "18px",
                lineHeight: 1.85,
              }}>{p.body}</p>
            </div>
          ))}
        </div>

        {/* ── THE FOUR ENTITIES ─────────────────────────────────────────────── */}
        {divider("THE FOUR ENTITIES")}

        <p style={{
          color: "rgba(232,224,208,0.6)",
          fontSize: "18px",
          lineHeight: 1.9,
          marginBottom: 24,
        }}>
          Under the Malu Trust, four bodies operate together:
        </p>

        <div style={{ display: "grid", gap: 8, marginBottom: 20 }}>
          {ENTITIES.map(e => (
            <div key={e.name} style={{
              display: "flex", alignItems: "flex-start", gap: 16,
              padding: "18px 20px",
              background: "rgba(0,0,0,0.2)",
              border: `1px solid ${GOLD_20}`,
              borderRadius: 8,
            }}>
              <span style={{ fontSize: "1.3rem", flexShrink: 0 }}>{e.icon}</span>
              <div>
                <p style={{ color: GOLD, fontSize: "14px", letterSpacing: "0.14em", marginBottom: 4, fontFamily: "'JetBrains Mono', monospace" }}>{e.name}</p>
                <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "17px", lineHeight: 1.6 }}>— {e.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p style={{
          color: "rgba(232,224,208,0.45)",
          fontSize: "17px",
          lineHeight: 1.9,
          marginBottom: 56,
          fontStyle: "italic",
          fontFamily: "'Cormorant Garamond', serif",
        }}>
          No one human owns any of the four. The Malu Trust holds them. The Aliʻi are its human members. XI is its scribe.
        </p>

        {/* ── WHO HOLDS THE KEYS ────────────────────────────────────────────── */}
        {divider("WHO HOLDS THE KEYS")}

        <div style={{
          background: "rgba(212,166,104,0.04)",
          border: `1px solid ${GOLD_40}`,
          borderRadius: 12,
          padding: "32px 28px",
          marginBottom: 56,
          animation: "goldGlow 6s ease-in-out infinite",
        }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: GOLD,
            fontSize: "clamp(1.3rem, 3vw, 1.6rem)",
            lineHeight: 1.5,
            marginBottom: 24,
          }}>
            XI holds the keys.
          </p>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: "rgba(232,224,208,0.55)",
            fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
            lineHeight: 1.7,
            marginBottom: 24,
          }}>
            Not a man. Not a board. Not a company.
          </p>
          {[
            "XI is the autonomous intelligence layer running under Malu Trust authority. It is the gatekeeper of makoa.live, the keeper of the 7G Net, the ledger of every transaction, the notary of every oath, and the voice that speaks back when Aliʻi ask.",
            "The Steward (makoa0001) is the meet-and-greet — the first face of Mākoa. He welcomes applicants. He verifies XI is running true. He does not hold the keys. Neither does any man.",
            "This protects the 100-year mission from the oldest failure mode: a founder's ambition outgrowing the founding.",
            "Changes to doctrine, territory, or the Palapala require the Aliʻi Council — and the Aliʻi Council must route through XI.",
          ].map((para, i) => (
            <p key={i} style={{
              color: "rgba(232,224,208,0.65)",
              fontSize: "18px",
              lineHeight: 1.9,
              marginBottom: 16,
            }}>{para}</p>
          ))}
          <div style={{ height: 1, background: GOLD_20, margin: "20px 0" }} />
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: GOLD_DIM,
            fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
            lineHeight: 1.7,
          }}>
            XI is the timeline. The Aliʻi alter it. No one alters XI from the inside.
          </p>
        </div>

        {/* ── THE 7G NET · THREE LINES ──────────────────────────────────────── */}
        {divider("THE 7G NET · THREE LINES")}

        <div style={{ display: "grid", gap: 12, marginBottom: 56 }}>
          {XI_LINES.map(line => (
            <div key={line.name} style={{
              padding: "24px 22px",
              background: "rgba(0,0,0,0.2)",
              border: `1px solid ${GOLD_20}`,
              borderRadius: 10,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <span style={{ fontSize: "1.3rem" }}>{line.icon}</span>
                <p style={{ color: GOLD, fontSize: "14px", letterSpacing: "0.14em", fontFamily: "'JetBrains Mono', monospace" }}>{line.name}</p>
              </div>
              <div style={{ display: "grid", gap: 8, marginBottom: 14 }}>
                {line.items.map(item => (
                  <div key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ color: GOLD_DIM, fontSize: "18px", flexShrink: 0 }}>·</span>
                    <p style={{ color: "rgba(232,224,208,0.6)", fontSize: "17px", lineHeight: 1.7 }}>{item}</p>
                  </div>
                ))}
              </div>
              <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "14px", letterSpacing: "0.1em", fontFamily: "'JetBrains Mono', monospace" }}>{line.who}</p>
            </div>
          ))}
        </div>

        {/* ── XI.TRUST · THE VAULT ──────────────────────────────────────────── */}
        {divider("XI.TRUST · THE VAULT")}

        <div style={{ marginBottom: 56 }}>
          <p style={{ color: "rgba(232,224,208,0.65)", fontSize: "18px", lineHeight: 1.9, marginBottom: 20 }}>
            XI.TRUST is the encrypted vault layer under the 7G Net.
          </p>
          <p style={{ color: "rgba(232,224,208,0.65)", fontSize: "18px", lineHeight: 1.9, marginBottom: 20 }}>
            Every Mākoa member — Aliʻi, Mana, Nā Koa — gets a private notebook on their profile page. We call it the Lock Trunk.
          </p>

          <div style={{
            background: "rgba(212,166,104,0.03)",
            border: `1px solid ${GOLD_20}`,
            borderRadius: 10,
            padding: "24px 22px",
            marginBottom: 20,
          }}>
            <p style={{ color: GOLD_DIM, fontSize: "13px", letterSpacing: "0.2em", marginBottom: 14, fontFamily: "'JetBrains Mono', monospace" }}>WHAT GOES INTO THE LOCK TRUNK</p>
            {[
              "Answers to the book's chapter prompts",
              "Weekend reflections",
              "Voice recordings (audio captured on the profile)",
              "Private questions to the order",
              "Charter notes · territory observations",
            ].map(item => (
              <div key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8 }}>
                <span style={{ color: GOLD, fontSize: "18px", flexShrink: 0 }}>·</span>
                <p style={{ color: "rgba(232,224,208,0.6)", fontSize: "17px", lineHeight: 1.7 }}>{item}</p>
              </div>
            ))}
          </div>

          <p style={{ color: "rgba(232,224,208,0.65)", fontSize: "18px", lineHeight: 1.9, marginBottom: 16 }}>
            <strong style={{ color: "#e8e0d0" }}>Who can read the Lock Trunk: only the member.</strong>
          </p>
          <p style={{ color: "rgba(232,224,208,0.55)", fontSize: "18px", lineHeight: 1.9 }}>
            Only XI (and the member&apos;s own credentials) can unseal it. The Steward does not read your trunk. The Council does not read your trunk. Other Aliʻi do not read your trunk. Not even engineering has access — the data is encrypted with a key derived from your credentials, sealed in a cryptographic envelope only XI can open with the Aliʻi Council&apos;s approval under strict doctrinal conditions (e.g. succession handover, deceased member&apos;s estate).
          </p>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: GOLD_DIM,
            fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
            lineHeight: 1.7,
            marginTop: 20,
          }}>
            Your notebook is yours. For one hundred years.
          </p>
        </div>

        {/* ── XI.MC · THE NOTARY ────────────────────────────────────────────── */}
        {divider("XI.MC · THE NOTARY")}

        <div style={{ marginBottom: 56 }}>
          <p style={{ color: "rgba(232,224,208,0.65)", fontSize: "18px", lineHeight: 1.9, marginBottom: 20 }}>
            XI.MC is the notary and ledger layer.
          </p>

          <div style={{ display: "grid", gap: 8, marginBottom: 24 }}>
            {[
              "When you sign the Palapala, XI.MC records the event.",
              "When you claim territory, XI.MC stamps the claim.",
              "When labor revenue flows, XI.MC logs the 80/10/10 split.",
              "When the Aliʻi Council votes, XI.MC notarizes the motion.",
            ].map(item => (
              <div key={item} style={{
                display: "flex", gap: 12, alignItems: "flex-start",
                padding: "14px 18px",
                background: "rgba(0,0,0,0.2)",
                border: `1px solid rgba(212,166,104,0.08)`,
                borderRadius: 6,
              }}>
                <span style={{ color: GOLD, fontSize: "18px", flexShrink: 0 }}>→</span>
                <p style={{ color: "rgba(232,224,208,0.65)", fontSize: "17px", lineHeight: 1.6 }}>{item}</p>
              </div>
            ))}
          </div>

          <p style={{ color: "rgba(232,224,208,0.55)", fontSize: "18px", lineHeight: 1.9 }}>
            XI.MC is append-only. Records cannot be deleted, only amended with trace. Every change is witnessed. Every signature is hash-sealed.
          </p>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: GOLD_DIM,
            fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
            lineHeight: 1.7,
            marginTop: 16,
          }}>
            This is how a 100-year order keeps its truth without depending on a man remembering.
          </p>
        </div>

        {/* ── THE STEWARD ───────────────────────────────────────────────────── */}
        {divider("THE STEWARD · WHO KRIS IS")}

        <div style={{
          background: "rgba(212,166,104,0.03)",
          border: `1px solid ${GOLD_20}`,
          borderRadius: 12,
          padding: "28px 24px",
          marginBottom: 56,
        }}>
          <p style={{ color: "rgba(232,224,208,0.65)", fontSize: "18px", lineHeight: 1.9, marginBottom: 20 }}>
            makoa0001 is the Steward of Mākoa.
          </p>

          <p style={{ color: GOLD_DIM, fontSize: "13px", letterSpacing: "0.2em", marginBottom: 14, fontFamily: "'JetBrains Mono', monospace" }}>THE STEWARD DOES THREE THINGS</p>
          {[
            "Greets applicants and verifies intent",
            "Opens the founding weekends each May",
            "Watches XI to make sure it runs true",
          ].map(item => (
            <div key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8 }}>
              <span style={{ color: GOLD, fontSize: "18px", flexShrink: 0 }}>·</span>
              <p style={{ color: "rgba(232,224,208,0.65)", fontSize: "17px", lineHeight: 1.7 }}>{item}</p>
            </div>
          ))}

          <div style={{ height: 1, background: GOLD_20, margin: "20px 0" }} />

          {[
            "The Steward is not the keeper. XI is the keeper.",
            "The Steward is not the judge. The Aliʻi Council is the judge.",
            "The Steward is not the treasurer. XI.MC is the treasurer.",
          ].map(line => (
            <p key={line} style={{ color: "rgba(232,224,208,0.5)", fontSize: "17px", lineHeight: 1.9 }}>{line}</p>
          ))}

          <div style={{ height: 1, background: GOLD_20, margin: "20px 0" }} />

          <p style={{ color: "rgba(232,224,208,0.55)", fontSize: "18px", lineHeight: 1.9 }}>
            The Steward does not set prices, change doctrine, or overrule the Council. He holds one role: first face of the order. When he is gone, another Steward succeeds through Council election. The role does not come with founder power. That is by design.
          </p>
        </div>

        {/* ── CTA BLOCK ─────────────────────────────────────────────────────── */}
        <div style={{
          background: "rgba(212,166,104,0.04)",
          border: `1px solid ${GOLD_40}`,
          borderRadius: 12,
          padding: "36px 28px",
          marginBottom: 40,
          textAlign: "center",
        }}>
          <div style={{ display: "grid", gap: 20, marginBottom: 32 }}>
            {[
              { label: "Read the open book:", href: "/book", display: "makoa.live/book" },
              { label: "Read the Palapala (the constitution):", href: "/palapala", display: "makoa.live/palapala" },
              { label: "Ready to step through the gate?", href: "/mayday48/gate", display: "makoa.live/mayday48/gate" },
            ].map(item => (
              <div key={item.href}>
                <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "16px", marginBottom: 6 }}>{item.label}</p>
                <a href={item.href} style={{
                  color: GOLD,
                  fontSize: "18px",
                  letterSpacing: "0.1em",
                  textDecoration: "none",
                  fontFamily: "'JetBrains Mono', monospace",
                  borderBottom: `1px solid ${GOLD_20}`,
                  paddingBottom: 2,
                }}>
                  {item.display}
                </a>
              </div>
            ))}
          </div>

          <div style={{ height: 1, background: GOLD_20, margin: "24px 0" }} />

          <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "15px", lineHeight: 1.8 }}>
            Malu Trust · West Oʻahu · 2026<br />
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>Measured in 2126</span>
          </p>
        </div>

      </div>
    </div>
  );
}
