"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const GOLD = "#b08e50";
const GOLD_40 = "rgba(176,142,80,0.4)";
const GOLD_20 = "rgba(176,142,80,0.2)";
const GOLD_10 = "rgba(176,142,80,0.1)";
const GOLD_DIM = "rgba(176,142,80,0.5)";
const BG = "#04060a";
const TEXT = "#e8e0d0";
const TEXT_DIM = "rgba(232,224,208,0.5)";

const GIFT_OPTIONS = [
  {
    id: "daypass",
    title: "DAY PASS",
    price: "$97",
    description: "12 hours. One day that changes everything.",
    priceId: "price_1TKlQr836uPpUiqMWjqFLNKv",
  },
  {
    id: "mastermind",
    title: "MASTERMIND",
    price: "$197",
    description: "24 hours. Deep work. Real brotherhood.",
    priceId: "price_1TKlQs836uPpUiqMuxnP56sT",
  },
  {
    id: "warroom",
    title: "WAR ROOM",
    price: "$397 deposit",
    description: "The full 48 hours. All in.",
    priceId: "price_1TKlQt836uPpUiqMCqiGFNj0",
  },
];

export default function SponsorPage() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Form state
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
            sponsorName,
            sponsorEmail,
            brotherName,
            brotherEmail,
            message: message || "",
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
    background: "rgba(176,142,80,0.06)",
    border: `1px solid ${GOLD_20}`,
    borderRadius: 8,
    color: TEXT,
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "0.85rem",
    outline: "none",
    marginBottom: 10,
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.7rem",
    letterSpacing: "0.08em",
    color: GOLD_DIM,
    marginBottom: 4,
    fontFamily: "'JetBrains Mono', monospace",
    textTransform: "uppercase",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: BG,
        color: TEXT,
        fontFamily: "'JetBrains Mono', monospace",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.8s ease",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", padding: "64px 24px 32px" }}>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: "clamp(2rem, 5vw, 3rem)",
            color: GOLD,
            fontWeight: 400,
            margin: 0,
            letterSpacing: "0.06em",
          }}
        >
          SPONSOR A BROTHER
        </h1>
        <p
          style={{
            color: TEXT_DIM,
            fontSize: "0.85rem",
            marginTop: 12,
            maxWidth: 440,
            marginLeft: "auto",
            marginRight: "auto",
            lineHeight: 1.7,
          }}
        >
          Know a man who needs this? Send him through the gate.
        </p>
      </div>

      {/* Gift Options */}
      <div
        style={{
          maxWidth: 540,
          margin: "0 auto",
          padding: "0 20px 32px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {GIFT_OPTIONS.map((opt) => {
          const isExpanded = expanded === opt.id;
          return (
            <div
              key={opt.id}
              style={{
                border: `1px solid ${isExpanded ? GOLD_40 : GOLD_20}`,
                borderRadius: 12,
                background: isExpanded ? "rgba(176,142,80,0.04)" : "transparent",
                overflow: "hidden",
                transition: "all 0.35s ease",
              }}
            >
              {/* Card Header */}
              <button
                onClick={() => {
                  setExpanded(isExpanded ? null : opt.id);
                }}
                style={{
                  width: "100%",
                  background: "none",
                  border: "none",
                  padding: "20px 24px",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  textAlign: "left",
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontStyle: "italic",
                      fontSize: "1.3rem",
                      color: GOLD,
                      fontWeight: 400,
                      letterSpacing: "0.04em",
                    }}
                  >
                    {opt.title}
                  </div>
                  <div
                    style={{
                      color: TEXT_DIM,
                      fontSize: "0.78rem",
                      marginTop: 6,
                      lineHeight: 1.6,
                    }}
                  >
                    {opt.description}
                  </div>
                </div>
                <div
                  style={{
                    color: GOLD,
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    marginLeft: 16,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {opt.price}
                </div>
              </button>

              {/* Expanded Form */}
              {isExpanded && (
                <div
                  style={{
                    padding: "0 24px 24px",
                    animation: "fadeIn 0.3s ease forwards",
                  }}
                >
                  <div
                    style={{
                      height: 1,
                      background: GOLD_20,
                      marginBottom: 20,
                    }}
                  />

                  <label style={labelStyle}>Your Name</label>
                  <input
                    style={inputStyle}
                    value={sponsorName}
                    onChange={(e) => setSponsorName(e.target.value)}
                    placeholder="Your name"
                  />

                  <label style={labelStyle}>Your Email</label>
                  <input
                    style={inputStyle}
                    type="email"
                    value={sponsorEmail}
                    onChange={(e) => setSponsorEmail(e.target.value)}
                    placeholder="you@email.com"
                  />

                  <label style={labelStyle}>Brother&apos;s Name</label>
                  <input
                    style={inputStyle}
                    value={brotherName}
                    onChange={(e) => setBrotherName(e.target.value)}
                    placeholder="His name"
                  />

                  <label style={labelStyle}>Brother&apos;s Email</label>
                  <input
                    style={inputStyle}
                    type="email"
                    value={brotherEmail}
                    onChange={(e) => setBrotherEmail(e.target.value)}
                    placeholder="his@email.com"
                  />

                  <label style={labelStyle}>Message (optional)</label>
                  <textarea
                    style={{
                      ...inputStyle,
                      minHeight: 60,
                      resize: "vertical",
                    }}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="A word for him..."
                  />

                  <button
                    onClick={() => handleSubmit(opt.priceId)}
                    disabled={
                      loading ||
                      !sponsorName ||
                      !sponsorEmail ||
                      !brotherName ||
                      !brotherEmail
                    }
                    style={{
                      width: "100%",
                      marginTop: 8,
                      padding: "14px",
                      background: GOLD,
                      color: "#000",
                      border: "none",
                      borderRadius: 8,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      cursor:
                        loading ||
                        !sponsorName ||
                        !sponsorEmail ||
                        !brotherName ||
                        !brotherEmail
                          ? "not-allowed"
                          : "pointer",
                      opacity:
                        loading ||
                        !sponsorName ||
                        !sponsorEmail ||
                        !brotherName ||
                        !brotherEmail
                          ? 0.5
                          : 1,
                      transition: "opacity 0.2s ease",
                    }}
                  >
                    {loading ? "PROCESSING..." : `SPONSOR — ${opt.price}`}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Text */}
      <div
        style={{
          maxWidth: 480,
          margin: "0 auto",
          padding: "24px 24px 48px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            height: 1,
            background: GOLD_10,
            marginBottom: 32,
          }}
        />
        <p
          style={{
            color: TEXT_DIM,
            fontSize: "0.8rem",
            lineHeight: 1.8,
            fontStyle: "italic",
            fontFamily: "'Cormorant Garamond', serif",
            maxWidth: 400,
            margin: "0 auto",
          }}
        >
          He&apos;ll receive a message: &ldquo;Someone believes in you.
          You&apos;ve been sponsored into M&#257;koa.&rdquo; He never has to
          know who &mdash; unless you want him to.
        </p>

        {/* Navigation Links */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 24,
            marginTop: 40,
            flexWrap: "wrap",
          }}
        >
          {[
            { href: "/gate", label: "THE GATE" },
            { href: "/founding48", label: "FOUNDING 48" },
            { href: "/circle", label: "THE CIRCLE" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                color: GOLD_DIM,
                fontSize: "0.7rem",
                letterSpacing: "0.1em",
                textDecoration: "none",
                borderBottom: `1px solid ${GOLD_20}`,
                paddingBottom: 2,
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = GOLD)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = GOLD_DIM)
              }
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Keyframe animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
