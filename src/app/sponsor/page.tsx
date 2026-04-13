"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const GOLD = "#b08e50";
const GOLD_40 = "rgba(176,142,80,0.4)";
const GOLD_20 = "rgba(176,142,80,0.2)";
const GOLD_10 = "rgba(176,142,80,0.1)";
const GOLD_DIM = "rgba(176,142,80,0.5)";
const GOLD_FAINT = "rgba(176,142,80,0.06)";
const BG = "#04060a";
const TEXT = "#e8e0d0";
const TEXT_DIM = "rgba(232,224,208,0.5)";
const GREEN = "#3fb950";

const GIFT_OPTIONS = [
  {
    id: "daypass",
    title: "DAY PASS",
    price: "$97",
    hours: "12 hours",
    description: "One day that changes everything.",
    detail: "He arrives Saturday morning. Ice bath at 4am. Brotherhood circle. The Nā Koa Academy. He leaves a different man.",
    priceId: "price_1TKlQr836uPpUiqMWjqFLNKv",
    color: "#3fb950",
    badge: "12HR",
  },
  {
    id: "mastermind",
    title: "MASTERMIND",
    price: "$197",
    hours: "24 hours",
    description: "Deep work. Real brotherhood.",
    detail: "Friday night through Saturday. The full Mana experience — ice, circle, academy, bonfire. He goes deep.",
    priceId: "price_1TKlQs836uPpUiqMuxnP56sT",
    color: "#58a6ff",
    badge: "24HR",
  },
  {
    id: "warroom",
    title: "WAR ROOM",
    price: "$397",
    hours: "48 hours",
    description: "The full experience. All in.",
    detail: "The complete founding experience. Friday through Sunday. Ice bath both mornings. The fire ceremony. The oath. He comes back changed.",
    priceId: "price_1TKlQt836uPpUiqMCqiGFNj0",
    color: GOLD,
    badge: "48HR",
  },
];

export default function SponsorPage() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [anonymous, setAnonymous] = useState(true);

  const [sponsorName, setSponsorName] = useState("");
  const [sponsorEmail, setSponsorEmail] = useState("");
  const [brotherName, setBrotherName] = useState("");
  const [brotherEmail, setBrotherEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = async (priceId: string) => {
    if (!sponsorName || !sponsorEmail || !brotherName || !brotherEmail) return;
    setLoading(true);
    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId,
          customerEmail: sponsorEmail,
          metadata: {
            type: "sponsor",
            sponsorName: anonymous ? "Anonymous" : sponsorName,
            sponsorEmail,
            brotherName,
            brotherEmail,
            message: message || "",
            anonymous: anonymous ? "true" : "false",
          },
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error("Checkout error:", err);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    background: "rgba(176,142,80,0.05)",
    border: `1px solid ${GOLD_20}`,
    borderRadius: 8,
    color: TEXT,
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "0.6rem",
    outline: "none",
    boxSizing: "border-box",
    letterSpacing: "0.03em",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.38rem",
    letterSpacing: "0.2em",
    color: GOLD_DIM,
    marginBottom: 6,
    fontFamily: "'JetBrains Mono', monospace",
    textTransform: "uppercase",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: BG,
      color: TEXT,
      fontFamily: "'JetBrains Mono', monospace",
      opacity: visible ? 1 : 0,
      transition: "opacity 0.8s ease",
    }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100%{opacity:1;}50%{opacity:0.4;} }
        input::placeholder, textarea::placeholder { color: rgba(176,142,80,0.2); }
        .gift-card { transition: border-color 0.3s, transform 0.2s; }
        .gift-card:hover { transform: translateY(-1px); }
      `}</style>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <div style={{
        textAlign: "center",
        padding: "72px 24px 48px",
        borderBottom: `1px solid ${GOLD_10}`,
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 0%, rgba(176,142,80,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Crest mark */}
        <div style={{
          width: "56px", height: "56px",
          border: `1px solid ${GOLD_20}`,
          borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 24px",
        }}>
          <span style={{ color: GOLD_DIM, fontSize: "1.2rem" }}>◈</span>
        </div>

        <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.35em", marginBottom: "14px" }}>
          MĀKOA ORDER
        </p>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          fontSize: "clamp(2.2rem, 7vw, 3.2rem)",
          color: GOLD,
          fontWeight: 300,
          margin: "0 0 16px",
          lineHeight: 1.1,
        }}>
          Sponsor a Brother
        </h1>

        <p style={{
          color: TEXT_DIM,
          fontSize: "0.55rem",
          maxWidth: 400,
          margin: "0 auto 24px",
          lineHeight: 1.9,
        }}>
          Know a man who needs this?<br />
          Send him through the gate.
        </p>

        {/* Divider */}
        <div style={{ height: 1, background: `linear-gradient(to right, transparent, ${GOLD_20}, transparent)`, maxWidth: 300, margin: "0 auto" }} />
      </div>

      {/* ── WHAT HAPPENS ──────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 540, margin: "0 auto", padding: "48px 24px 0" }}>
        <div style={{
          background: GOLD_FAINT,
          border: `1px solid ${GOLD_10}`,
          borderRadius: 12,
          padding: "24px 20px",
          marginBottom: 40,
          textAlign: "center",
        }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: TEXT,
            fontSize: "1.1rem",
            lineHeight: 2.0,
            marginBottom: 16,
          }}>
            He'll receive a message:<br />
            <span style={{ color: GOLD }}>"Someone believes in you.<br />You've been sponsored into Mākoa."</span>
          </p>
          <p style={{ color: TEXT_DIM, fontSize: "0.48rem", lineHeight: 1.8 }}>
            He never has to know who — unless you want him to.<br />
            You choose. Anonymous or named. Either way, the gift is real.
          </p>
        </div>

        {/* ── GIFT OPTIONS ────────────────────────────────────────────────── */}
        <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.3em", textAlign: "center", marginBottom: "28px" }}>
          CHOOSE HIS EXPERIENCE
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 40 }}>
          {GIFT_OPTIONS.map((opt) => {
            const isExpanded = expanded === opt.id;
            const formReady = sponsorName && sponsorEmail && brotherName && brotherEmail;

            return (
              <div
                key={opt.id}
                className="gift-card"
                style={{
                  border: `1px solid ${isExpanded ? opt.color + "60" : GOLD_20}`,
                  borderRadius: 12,
                  background: isExpanded ? `${opt.color}05` : "transparent",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                }}
              >
                {/* Card Header */}
                <button
                  onClick={() => setExpanded(isExpanded ? null : opt.id)}
                  style={{
                    width: "100%",
                    background: "none",
                    border: "none",
                    padding: "20px 22px",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    textAlign: "left",
                    gap: 12,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <span style={{
                        background: `${opt.color}15`,
                        border: `1px solid ${opt.color}40`,
                        color: opt.color,
                        fontSize: "0.36rem",
                        letterSpacing: "0.15em",
                        padding: "3px 8px",
                        borderRadius: 3,
                      }}>{opt.badge}</span>
                      <p style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontStyle: "italic",
                        fontSize: "1.3rem",
                        color: opt.color,
                        fontWeight: 400,
                        lineHeight: 1,
                      }}>{opt.title}</p>
                    </div>
                    <p style={{ color: TEXT_DIM, fontSize: "0.48rem", lineHeight: 1.5 }}>
                      <span style={{ color: opt.color }}>{opt.hours}</span> · {opt.description}
                    </p>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <p style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "1.6rem",
                      color: TEXT,
                      fontWeight: 300,
                      lineHeight: 1,
                      marginBottom: 4,
                    }}>{opt.price}</p>
                    <span style={{ color: opt.color, fontSize: "0.7rem", lineHeight: 1 }}>
                      {isExpanded ? "−" : "+"}
                    </span>
                  </div>
                </button>

                {/* Expanded Form */}
                {isExpanded && (
                  <div style={{ padding: "0 22px 24px", animation: "fadeUp 0.3s ease forwards" }}>
                    <div style={{ height: 1, background: `${opt.color}20`, marginBottom: 20 }} />

                    {/* What he gets */}
                    <div style={{
                      background: `${opt.color}08`,
                      border: `1px solid ${opt.color}20`,
                      borderRadius: 8,
                      padding: "12px 14px",
                      marginBottom: 20,
                    }}>
                      <p style={{ color: opt.color, fontSize: "0.38rem", letterSpacing: "0.15em", marginBottom: 6 }}>WHAT HE GETS</p>
                      <p style={{ color: TEXT_DIM, fontSize: "0.46rem", lineHeight: 1.7 }}>{opt.detail}</p>
                    </div>

                    {/* Anonymous toggle */}
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 14px",
                      background: GOLD_FAINT,
                      border: `1px solid ${GOLD_10}`,
                      borderRadius: 8,
                      marginBottom: 20,
                      cursor: "pointer",
                    }} onClick={() => setAnonymous(!anonymous)}>
                      <div>
                        <p style={{ color: TEXT, fontSize: "0.48rem", marginBottom: 2 }}>
                          {anonymous ? "Anonymous gift" : "Reveal your name"}
                        </p>
                        <p style={{ color: TEXT_DIM, fontSize: "0.4rem" }}>
                          {anonymous ? "He won't know who sent this" : "He'll know it came from you"}
                        </p>
                      </div>
                      <div style={{
                        width: 36, height: 20, borderRadius: 10,
                        background: anonymous ? GOLD : "rgba(255,255,255,0.1)",
                        border: `1px solid ${anonymous ? GOLD : "rgba(255,255,255,0.15)"}`,
                        position: "relative",
                        transition: "all 0.2s",
                        flexShrink: 0,
                      }}>
                        <div style={{
                          position: "absolute",
                          top: 2, left: anonymous ? 18 : 2,
                          width: 14, height: 14,
                          borderRadius: "50%",
                          background: anonymous ? "#000" : "rgba(255,255,255,0.4)",
                          transition: "left 0.2s",
                        }} />
                      </div>
                    </div>

                    {/* Form fields */}
                    <div style={{ display: "grid", gap: 14 }}>
                      <div>
                        <label style={labelStyle}>Your Name</label>
                        <input style={inputStyle} value={sponsorName} onChange={e => setSponsorName(e.target.value)} placeholder="Your name" />
                      </div>
                      <div>
                        <label style={labelStyle}>Your Email</label>
                        <input style={inputStyle} type="email" value={sponsorEmail} onChange={e => setSponsorEmail(e.target.value)} placeholder="you@email.com" />
                      </div>
                      <div style={{ height: 1, background: GOLD_10 }} />
                      <div>
                        <label style={labelStyle}>His Name</label>
                        <input style={inputStyle} value={brotherName} onChange={e => setBrotherName(e.target.value)} placeholder="His name" />
                      </div>
                      <div>
                        <label style={labelStyle}>His Email</label>
                        <input style={inputStyle} type="email" value={brotherEmail} onChange={e => setBrotherEmail(e.target.value)} placeholder="his@email.com" />
                      </div>
                      <div>
                        <label style={labelStyle}>A word for him (optional)</label>
                        <textarea
                          style={{ ...inputStyle, minHeight: 72, resize: "vertical" as const, lineHeight: 1.7 }}
                          value={message}
                          onChange={e => setMessage(e.target.value)}
                          placeholder="Why you believe in him..."
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => handleSubmit(opt.priceId)}
                      disabled={loading || !formReady}
                      style={{
                        width: "100%",
                        marginTop: 16,
                        padding: "15px",
                        background: formReady ? opt.color : "transparent",
                        color: formReady ? (opt.color === GOLD ? "#000" : "#000") : GOLD_DIM,
                        border: `1px solid ${formReady ? opt.color : GOLD_20}`,
                        borderRadius: 8,
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.5rem",
                        fontWeight: 700,
                        letterSpacing: "0.15em",
                        cursor: formReady && !loading ? "pointer" : "not-allowed",
                        opacity: !formReady ? 0.4 : 1,
                        transition: "all 0.2s",
                      }}
                    >
                      {loading ? "PROCESSING..." : `SPONSOR HIM — ${opt.price}`}
                    </button>

                    <p style={{ color: "rgba(176,142,80,0.2)", fontSize: "0.38rem", textAlign: "center", marginTop: 10 }}>
                      Secure checkout via Stripe · He receives his invitation after payment
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── THE MESSAGE ───────────────────────────────────────────────────── */}
        <div style={{
          borderTop: `1px solid ${GOLD_10}`,
          paddingTop: 40,
          marginBottom: 48,
          textAlign: "center",
        }}>
          <div style={{ height: 1, background: `linear-gradient(to right, transparent, ${GOLD_20}, transparent)`, marginBottom: 32 }} />

          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: TEXT_DIM,
            fontSize: "1.1rem",
            lineHeight: 2.0,
            maxWidth: 400,
            margin: "0 auto 32px",
          }}>
            "Someone believes in you.<br />
            You've been sponsored into Mākoa."<br />
            <span style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.85rem" }}>
              He never has to know who — unless you want him to.
            </span>
          </p>

          {/* Who this is for */}
          <div style={{ display: "grid", gap: 8, maxWidth: 400, margin: "0 auto 32px", textAlign: "left" }}>
            {[
              { who: "A wife", why: "who sees what her husband could become" },
              { who: "A mother", why: "who knows her son needs brothers" },
              { who: "A friend", why: "who won't let him stay stuck" },
              { who: "A brother", why: "who wants to bring him in" },
              { who: "Anyone", why: "who believes in a man enough to act" },
            ].map((row, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", padding: "8px 12px", background: GOLD_FAINT, borderRadius: 6, border: `1px solid ${GOLD_10}` }}>
                <span style={{ color: GOLD, fontSize: "0.48rem", minWidth: 60 }}>{row.who}</span>
                <span style={{ color: TEXT_DIM, fontSize: "0.44rem" }}>{row.why}</span>
              </div>
            ))}
          </div>

          {/* Nav links */}
          <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
            {[
              { href: "/gate", label: "THE GATE" },
              { href: "/founding48", label: "MAYDAY" },
              { href: "/wahine", label: "WAHINE CIRCLE" },
              { href: "/circle", label: "CO-FOUNDER" },
            ].map(link => (
              <Link key={link.href} href={link.href} style={{
                color: GOLD_DIM,
                fontSize: "0.38rem",
                letterSpacing: "0.15em",
                textDecoration: "none",
                borderBottom: `1px solid ${GOLD_20}`,
                paddingBottom: 2,
                transition: "color 0.2s",
              }}
                onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
                onMouseLeave={e => (e.currentTarget.style.color = GOLD_DIM)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
