"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PRODUCTS, ProductId } from "@/lib/stripe";
import SocialFooter from "@/components/SocialFooter";

const GOLD = "#b08e50";
const GOLD_40 = "rgba(176,142,80,0.4)";
const GOLD_20 = "rgba(176,142,80,0.2)";
const GOLD_10 = "rgba(176,142,80,0.1)";
const GOLD_DIM = "rgba(176,142,80,0.5)";
const BG = "#04060a";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [handle, setHandle] = useState("Brother");
  const [productId, setProductId] = useState<ProductId | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const urlHandle = searchParams.get("handle") || searchParams.get("h") || "";
    const storedHandle =
      typeof window !== "undefined"
        ? sessionStorage.getItem("makoa_handle") || ""
        : "";
    setHandle(urlHandle || storedHandle || "Brother");

    const pid = searchParams.get("product_id") as ProductId | null;
    if (pid && pid in PRODUCTS) {
      setProductId(pid);
    }

    const t = setTimeout(() => setRevealed(true), 400);
    return () => clearTimeout(t);
  }, [searchParams]);

  const product = productId ? PRODUCTS[productId] : null;

  return (
    <div
      style={{
        background: BG,
        minHeight: "100vh",
        color: "#e8e0d0",
        fontFamily: "'JetBrains Mono', monospace",
        paddingBottom: 80,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <style>{`
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes breathe { 0%,100% { opacity:0.5; transform:scale(1); } 50% { opacity:1; transform:scale(1.08); } }
        @keyframes goldPulse { 0%,100% { box-shadow: 0 0 20px rgba(176,142,80,0.15); } 50% { box-shadow: 0 0 48px rgba(176,142,80,0.4); } }
        @keyframes checkDraw { from { stroke-dashoffset: 60; } to { stroke-dashoffset: 0; } }
      `}</style>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <div
        style={{
          width: "100%",
          background: "linear-gradient(180deg, #060810 0%, #04060a 100%)",
          borderBottom: `1px solid ${GOLD_20}`,
          padding: "56px 24px 48px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(176,142,80,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            height: 1,
            background: `linear-gradient(to right, transparent, ${GOLD_40}, transparent)`,
            marginBottom: 40,
          }}
        />

        {/* Seal */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            border: `2px solid ${GOLD_40}`,
            background: GOLD_10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 28px",
            animation: "goldPulse 3s ease-in-out infinite",
          }}
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            style={{ display: "block" }}
          >
            <polyline
              points="6,18 14,26 30,10"
              stroke={GOLD}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="60"
              strokeDashoffset="0"
              style={{ animation: "checkDraw 0.8s ease 0.3s both" }}
            />
          </svg>
        </div>

        <p
          style={{
            color: GOLD_DIM,
            fontSize: "0.42rem",
            letterSpacing: "0.3em",
            marginBottom: 16,
            animation: "fadeUp 0.8s ease 0.2s both",
          }}
        >
          MĀKOA ORDER · PAYMENT CONFIRMED
        </p>

        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: GOLD,
            fontSize: "2.4rem",
            lineHeight: 1.2,
            margin: "0 0 16px",
            animation: "fadeUp 0.9s ease 0.35s both",
          }}
        >
          Your seat is secured,<br />
          {handle}.
        </h1>

        <p
          style={{
            color: "rgba(232,224,208,0.45)",
            fontSize: "0.5rem",
            lineHeight: 1.8,
            animation: "fadeUp 0.9s ease 0.5s both",
          }}
        >
          XI has confirmed your reservation.<br />
          Stand by on the Makoa 808.
        </p>
      </div>

      {/* ── CONTENT ──────────────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 480,
          width: "100%",
          padding: "0 20px",
          opacity: revealed ? 1 : 0,
          transform: revealed ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s",
        }}
      >
        {/* What they bought */}
        {product && (
          <div
            style={{
              margin: "32px 0",
              background: "rgba(176,142,80,0.06)",
              border: `1px solid ${GOLD_40}`,
              borderRadius: 12,
              padding: "24px 20px",
            }}
          >
            <p
              style={{
                color: GOLD_DIM,
                fontSize: "0.4rem",
                letterSpacing: "0.22em",
                marginBottom: 12,
              }}
            >
              YOUR RESERVATION
            </p>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                color: "#e8e0d0",
                fontSize: "1.2rem",
                lineHeight: 1.4,
                marginBottom: 10,
              }}
            >
              {product.name}
            </p>
            <p
              style={{
                color: "rgba(232,224,208,0.45)",
                fontSize: "0.48rem",
                lineHeight: 1.6,
                marginBottom: 16,
              }}
            >
              {product.description}
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 14px",
                background: "rgba(0,0,0,0.3)",
                border: `1px solid ${GOLD_20}`,
                borderRadius: 6,
              }}
            >
              <span
                style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.44rem" }}
              >
                Amount paid today
              </span>
              <span
                style={{
                  color: GOLD,
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {product.displayPrice}
              </span>
            </div>
          </div>
        )}

        {/* What happens next */}
        <div
          style={{
            marginBottom: 32,
            background: "#080b10",
            border: "1px solid rgba(255,255,255,0.05)",
            borderRadius: 10,
            padding: "22px 20px",
          }}
        >
          <p
            style={{
              color: GOLD_DIM,
              fontSize: "0.4rem",
              letterSpacing: "0.22em",
              marginBottom: 16,
            }}
          >
            WHAT HAPPENS NEXT
          </p>
          {[
            "XI has confirmed your reservation",
            "Confirmation drops on the Makoa 808 channel",
            "Full event details sent to your Telegram",
            "Your seat is locked — no action needed",
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                marginBottom: 10,
              }}
            >
              <span
                style={{
                  color: GOLD,
                  fontSize: "0.5rem",
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                {i + 1}.
              </span>
              <p
                style={{
                  color: "rgba(232,224,208,0.6)",
                  fontSize: "0.5rem",
                  lineHeight: 1.6,
                }}
              >
                {item}
              </p>
            </div>
          ))}
        </div>

        {/* Quote */}
        <div
          style={{
            borderLeft: `3px solid ${GOLD_40}`,
            background: "rgba(176,142,80,0.03)",
            borderRadius: "0 8px 8px 0",
            padding: "20px 18px",
            marginBottom: 32,
          }}
        >
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              color: "rgba(232,224,208,0.6)",
              fontSize: "1.05rem",
              lineHeight: 2.0,
            }}
          >
            The founding fire is waiting.<br />
            Your name is on the wall.
          </p>
        </div>

        {/* Founding Brother seal */}
        <div
          style={{
            background: "linear-gradient(135deg, #0d0f14 0%, #080a0f 100%)",
            border: `1px solid ${GOLD_40}`,
            borderRadius: 12,
            padding: "28px 22px",
            marginBottom: 32,
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 50% 0%, rgba(176,142,80,0.06) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <span
            style={{
              color: GOLD_DIM,
              fontSize: "2rem",
              display: "block",
              marginBottom: 16,
              animation: "breathe 3s ease-in-out infinite",
            }}
          >
            ◈
          </span>
          <p
            style={{
              color: GOLD_DIM,
              fontSize: "0.42rem",
              letterSpacing: "0.25em",
              marginBottom: 12,
            }}
          >
            FOUNDING BROTHER STATUS
          </p>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              color: "#e8e0d0",
              fontSize: "1.05rem",
              lineHeight: 2.0,
            }}
          >
            Permanent. Stone engraved.<br />
            This happens once.
          </p>
        </div>

        {/* ── NEXT STEP: COMPLETE YOUR FORMATION ─────────────────────────── */}
        <div style={{
          background: "rgba(63,185,80,0.06)",
          border: "1px solid rgba(63,185,80,0.25)",
          borderRadius: 12,
          padding: "24px 20px",
          marginBottom: 24,
          textAlign: "center",
        }}>
          <p style={{ color: "#3fb950", fontSize: "0.42rem", letterSpacing: "0.22em", marginBottom: 12 }}>
            NEXT STEP — COMPLETE YOUR FORMATION
          </p>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: "#e8e0d0",
            fontSize: "1rem",
            lineHeight: 1.8,
            marginBottom: 16,
          }}>
            Take the oath. Receive your application ID.<br />
            This activates your portal access.
          </p>
          <a
            href={`/pledge?tier=nakoa&h=${encodeURIComponent(handle)}`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              background: "#3fb950",
              color: "#000",
              border: "none",
              borderRadius: 8,
              padding: "16px 20px",
              textDecoration: "none",
              fontSize: "0.52rem",
              letterSpacing: "0.2em",
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
            }}
          >
            COMPLETE FORMATION — TAKE THE OATH →
          </a>
          <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.4rem", marginTop: 10, lineHeight: 1.6 }}>
            Takes 2 minutes · Unlocks your Mākoa portal + 808 channels
          </p>
        </div>

        {/* ── ACTION BUTTONS ───────────────────────────────────────────────── */}
        <div style={{ display: "grid", gap: 12, marginBottom: 32 }}>
          <a
            href="https://t.me/+dsS4Mz0p5wM4OGYx"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              background: "rgba(88,166,255,0.08)",
              border: "1px solid rgba(88,166,255,0.35)",
              borderRadius: 8,
              padding: "15px 20px",
              textDecoration: "none",
              color: "#58a6ff",
              fontSize: "0.52rem",
              letterSpacing: "0.18em",
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-2.04 9.613c-.15.678-.546.843-1.107.524l-3.07-2.263-1.48 1.424c-.164.164-.302.302-.618.302l.22-3.12 5.67-5.12c.247-.22-.054-.342-.383-.122L6.48 14.41l-3.02-.944c-.657-.205-.67-.657.137-.973l11.81-4.554c.547-.198 1.025.133.855.97l-.7-.661z"/>
            </svg>
            JOIN THE MAKOA 808 ON TELEGRAM
          </a>

          <a
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 8,
              padding: "13px 20px",
              textDecoration: "none",
              color: "rgba(232,224,208,0.3)",
              fontSize: "0.48rem",
              letterSpacing: "0.15em",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            ← RETURN HOME
          </a>
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            paddingTop: 16,
            borderTop: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              color: GOLD_DIM,
              fontSize: "0.95rem",
              marginBottom: 12,
            }}
          >
            Hana · Pale · Ola
          </p>
          <p
            style={{
              color: "rgba(232,224,208,0.2)",
              fontSize: "0.42rem",
              marginBottom: 6,
            }}
          >
            Questions: wakachief@gmail.com
          </p>
          <p
            style={{
              color: "rgba(176,142,80,0.15)",
              fontSize: "0.4rem",
              letterSpacing: "0.15em",
            }}
          >
            MĀKOA ORDER · MALU TRUST · WEST OAHU · 2026
          </p>
        </div>

        <div style={{ marginTop: 32 }}>
          <SocialFooter />
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            background: "#04060a",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p
            style={{
              color: "rgba(176,142,80,0.4)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.5rem",
              letterSpacing: "0.2em",
            }}
          >
            LOADING...
          </p>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
