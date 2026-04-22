import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Palapala · Mākoa Manifest",
  description:
    "The founding document of the Mākoa Brotherhood. Under the Malu Trust. Read before you walk through the Gate.",
  openGraph: {
    title: "The Palapala · Mākoa Manifest",
    description:
      "The founding document of the Mākoa Brotherhood. Under the Malu Trust. Read before you walk through the Gate.",
    url: "https://makoa.live/palapala",
    type: "article",
    images: [{ url: "/makoa_eclipse_crest.png" }],
  },
};

const GOLD = "#d4af37";
const FLAME = "#ff4e1f";
const CREAM = "#f5ecd9";
const CHARCOAL = "#1a1a1a";
const DEEP_RED = "#7a0000";
const MALU = "#9d7fff";

export default function PalapalaPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: CHARCOAL,
        color: CREAM,
        fontFamily: "'Cormorant Garamond', Georgia, serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=JetBrains+Mono:wght@400;600;700&display=swap');

        .palapala-body {
          color: ${CREAM};
          font-size: clamp(1rem, 2.5vw, 1.15rem);
          line-height: 1.95;
          font-family: 'Cormorant Garamond', Georgia, serif;
        }
        .palapala-body p { margin: 0 0 1.4em; }
        .section-num {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.3em;
          color: ${GOLD};
          font-variant: small-caps;
          text-transform: uppercase;
          display: block;
          margin-bottom: 8px;
        }
        .section-header {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(1.4rem, 4vw, 1.9rem);
          font-weight: 600;
          color: ${FLAME};
          margin: 0 0 20px;
          line-height: 1.2;
        }
        .gold-rule {
          border: none;
          border-top: 1px solid ${GOLD};
          opacity: 0.4;
          margin: 40px 0;
        }
        .callout-routes {
          background: ${DEEP_RED};
          color: ${FLAME};
          text-align: center;
          padding: 32px 24px;
          margin: 36px 0;
          border-radius: 4px;
          font-size: clamp(1.3rem, 4vw, 1.8rem);
          font-weight: 600;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-style: italic;
          line-height: 1.4;
          letter-spacing: 0.02em;
        }
        .sticky-footer {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(26,26,26,0.97);
          border-top: 1px solid rgba(212,175,55,0.25);
          padding: 14px 20px;
          display: flex;
          gap: 10px;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          z-index: 50;
          backdrop-filter: blur(8px);
        }
        .btn-flame {
          background: ${FLAME};
          color: #fff;
          border: none;
          padding: 12px 22px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          border-radius: 6px;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          transition: opacity 0.2s;
        }
        .btn-flame:hover { opacity: 0.88; }
        .btn-gold-outline {
          background: transparent;
          color: ${GOLD};
          border: 1px solid ${GOLD};
          padding: 11px 20px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          border-radius: 6px;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          transition: background 0.2s;
        }
        .btn-gold-outline:hover { background: rgba(212,175,55,0.08); }
        .btn-text-link {
          color: rgba(245,236,217,0.5);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.68rem;
          letter-spacing: 0.12em;
          text-decoration: none;
          transition: color 0.2s;
        }
        .btn-text-link:hover { color: ${CREAM}; }
        .malu-callout {
          background: rgba(157,127,255,0.08);
          border: 1px solid rgba(157,127,255,0.3);
          border-left: 3px solid ${MALU};
          border-radius: 0 6px 6px 0;
          padding: 16px 20px;
          margin: 24px 0;
          color: rgba(245,236,217,0.8);
          font-size: 0.95rem;
          line-height: 1.8;
        }
        .signing-block {
          border-top: 1px solid rgba(212,175,55,0.2);
          padding-top: 32px;
          margin-top: 48px;
        }
        .signing-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.68rem;
          letter-spacing: 0.28em;
          color: ${GOLD};
          font-variant: small-caps;
          text-transform: uppercase;
          display: block;
          margin-bottom: 12px;
        }
      `}</style>

      {/* ── TOP MALU TRUST BANNER ─────────────────────────────────────────── */}
      <div
        style={{
          background: "rgba(157,127,255,0.1)",
          borderBottom: `1px solid rgba(157,127,255,0.25)`,
          padding: "10px 24px",
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.65rem",
            letterSpacing: "0.32em",
            color: MALU,
            fontVariant: "small-caps",
            textTransform: "uppercase",
          }}
        >
          Under the Malu Trust
        </span>
      </div>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <div
        style={{
          textAlign: "center",
          padding: "64px 24px 40px",
          borderBottom: `1px solid rgba(212,175,55,0.15)`,
          background: "radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.05) 0%, transparent 65%)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/makoa_eclipse_crest.png"
          alt="Mākoa Order Crest"
          style={{ width: 72, height: 72, borderRadius: "50%", margin: "0 auto 24px", display: "block", border: "1px solid rgba(212,175,55,0.2)" }}
        />
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(2.8rem, 10vw, 4.2rem)",
            fontWeight: 600,
            color: CREAM,
            margin: "0 0 8px",
            lineHeight: 1,
            letterSpacing: "0.06em",
          }}
        >
          THE PALAPALA
        </h1>
        <p
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontStyle: "italic",
            fontSize: "clamp(1.1rem, 3vw, 1.4rem)",
            color: GOLD,
            margin: "0 0 20px",
            letterSpacing: "0.04em",
          }}
        >
          the Mākoa Manifest
        </p>
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.68rem",
            letterSpacing: "0.2em",
            color: "rgba(245,236,217,0.4)",
            margin: 0,
          }}
        >
          Dropped April 21, 2026 · West Oʻahu
        </p>
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 160px" }}>

        <hr className="gold-rule" />

        <p
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontStyle: "italic",
            fontSize: "clamp(1.1rem, 3vw, 1.3rem)",
            color: GOLD,
            textAlign: "center",
            margin: "0 0 48px",
            lineHeight: 1.8,
          }}
        >
          "Read it twice. Then read it to a brother."
        </p>

        {/* ── SECTION I ─────────────────────────────────────────────────── */}
        <section style={{ marginBottom: 48 }}>
          <span className="section-num">I</span>
          <h2 className="section-header">What This Is</h2>
          <div className="palapala-body">
            <p>
              This is the founding document of the Mākoa Brotherhood. It is not a pitch. It is not a sales page. It is not a manifesto written to impress anyone. It is a record of what we believe, what we are building, and why we are building it — written before the first brother walks through the Gate, so that every brother who comes after knows what they are walking into.
            </p>
            <p>
              The Palapala is the word. The Gate is the door. The Malu Trust is the roof. The Brotherhood is the house.
            </p>
            <p>
              If you are reading this, you were meant to find it. Read it carefully. Read it honestly. If it speaks to you, walk through the Gate. If it doesn't, no hard feelings. This order is not for everyone — and that is by design.
            </p>
          </div>
        </section>

        <hr className="gold-rule" />

        {/* ── SECTION II ────────────────────────────────────────────────── */}
        <section style={{ marginBottom: 48 }}>
          <span className="section-num">II</span>
          <h2 className="section-header">Why This Exists</h2>
          <div className="palapala-body">
            <p>
              Men are dying in silence. Not from bullets — from isolation. From carrying weight no one sees. From performing strength while breaking inside. From having no one to call at 2am who will actually pick up.
            </p>
            <p>
              The modern world has given men every tool except the one they need most: each other. We have apps, networks, platforms, and communities — but we do not have brothers. Not real ones. Not the kind who show up at 4am when you call. Not the kind who tell you the truth when you need to hear it. Not the kind who build something with you that outlasts you both.
            </p>
            <p>
              Mākoa was built because one man needed it and couldn't find it. So he built it. And then he found the men who needed it too. And now we are building it together — not as a product, not as a brand, but as an order. A real one. With ranks, territory, a trade network, and a 100-year mission.
            </p>
            <p>
              This is not therapy. This is not a men's group that talks about doing things. This is a brotherhood of men who build real things together — and who show up for each other when the weight gets heavy.
            </p>
          </div>
        </section>

        <hr className="gold-rule" />

        {/* ── SECTION III ───────────────────────────────────────────────── */}
        <section style={{ marginBottom: 48 }}>
          <span className="section-num">III</span>
          <h2 className="section-header">The Structure of the Order</h2>
          <div className="palapala-body">
            <p>
              Mākoa is structured. It has to be. Brotherhood without structure is just friendship — and friendship, while good, does not build houses, run trade routes, or hold a man accountable to his word over years and decades.
            </p>
            <p>
              The order has three classes:
            </p>
            <p>
              <strong style={{ color: GOLD }}>Aliʻi</strong> — the council class. Men who lead. Men who carry vision and access. Men who sit at the founding table and help shape the direction of the order. The Aliʻi class is not bought — it is earned through demonstrated leadership and commitment to the mission.
            </p>
            <p>
              <strong style={{ color: "#58a6ff" }}>Mana</strong> — the builder class. Men who build with their hands and their minds. Tradesmen, craftsmen, professionals, teachers. The Mana class is the backbone of what the order creates. They run the academies. They hold the knowledge. They pass it on.
            </p>
            <p>
              <strong style={{ color: "#3fb950" }}>Nā Koa</strong> — the warrior class. Men who show up. Men who may not have the network yet — but who have the hunger. The Nā Koa class earns its place through action. Through service. Through showing up at 4am when no one is watching.
            </p>
            <p>
              Every man enters through the Gate. Every man answers the 12 questions. XI places you in the class where you belong — not the class you think you deserve, but the class where you will grow the most. Rank is earned. It is not purchased.
            </p>
          </div>
        </section>

        <hr className="gold-rule" />

        {/* ── SECTION IV ────────────────────────────────────────────────── */}
        <section style={{ marginBottom: 48 }}>
          <span className="section-num">IV</span>
          <h2 className="section-header">The Trade Network</h2>
          <div className="palapala-body">
            <p>
              Brotherhood without economics is charity. We are not a charity. We are an order — and orders sustain themselves through work.
            </p>
            <p>
              The Mākoa Trade Network is the economic engine of the brotherhood. It is built on a simple principle: brothers serve brothers, and brothers serve their communities. The route is the mechanism. The route moves labor, knowledge, and service through the network — connecting men who have skills with men who need them, and communities who need work with brothers who can do it.
            </p>

            <div className="callout-routes">
              "Routes move people, not products."
            </div>

            <p>
              Every brother on a route keeps 80% of what he earns. 10% goes to the house. 10% goes to the order's mission fund. This is not a franchise. This is not a pyramid. This is a trade network built on trust, accountability, and the understanding that when brothers prosper, the order prospers.
            </p>
            <p>
              The Nā Koa Academy runs from 9am to 2pm. It is a tool library, a skills exchange, and a peer-to-peer dispatch system. Brothers teach what they know. Brothers learn what they need. The academy is free to all active brothers.
            </p>
            <p>
              The Mana class runs the mastermind. The Aliʻi class runs the network-to-network sessions. Every class has a role. Every role has a purpose. The order is not a hierarchy of worth — it is a hierarchy of function.
            </p>
          </div>
        </section>

        <hr className="gold-rule" />

        {/* ── SECTION V ─────────────────────────────────────────────────── */}
        <section style={{ marginBottom: 48 }}>
          <span className="section-num">V</span>
          <h2 className="section-header">The Malu Trust</h2>
          <div className="palapala-body">
            <p>
              The Malu Trust is the legal and spiritual roof of the order. Malu means protection in Hawaiian. The Trust protects the brotherhood — its assets, its mission, its members, and its future.
            </p>
            <div className="malu-callout">
              The Malu Trust holds the Mākoa House, the trade network infrastructure, the founding documents, and the 100-year mission. It is not owned by any one man. It is held in trust for the brotherhood — for the brothers who are here now, and for the brothers who will come after us.
            </div>
            <p>
              The founding 48 brothers are the first trustees. Their names will be recorded. Their commitment will be sealed under the Blue Moon — May 31, 2026. This is not a ceremony for ceremony's sake. It is a legal and spiritual act. The order becomes real on that night.
            </p>
            <p>
              The Aliʻi Council will be the governing body of the Trust. They will make decisions about the order's direction, its resources, and its mission. They will be accountable to the brotherhood — not to any outside authority, not to any investor, not to any platform.
            </p>
            <p>
              The Malu Trust is the reason this order can last 100 years. Without it, we are just a group of men who met at a hotel in Kapolei. With it, we are a brotherhood with a legal structure, a physical home, and a mission that outlasts every man in it.
            </p>
          </div>
        </section>

        <hr className="gold-rule" />

        {/* ── SECTION VI ────────────────────────────────────────────────── */}
        <section style={{ marginBottom: 48 }}>
          <span className="section-num">VI</span>
          <h2 className="section-header">The MAYDAY Founding</h2>
          <div className="palapala-body">
            <p>
              The founding of the Mākoa Brotherhood happens in May 2026. The entire month of May. Four weekends. Four Wednesday 4am calls. Two founding dinners. One sealing under the Blue Moon.
            </p>
            <p>
              This is not a retreat. This is not a seminar. This is a month-long summit for team leaders and brotherhood networks worldwide. You bring your Aliʻi, your Mana, your Nā Koa. You choose your weekend. You stay for the founding.
            </p>
            <p>
              The Gate opens May 1 — the Full Moon. Applications are reviewed by XI. Brothers are placed in their class. The founding fire burns every weekend. The Co-Founders Founding closes the month on May 31, under the Blue Moon.
            </p>
            <p>
              <strong style={{ color: GOLD }}>Weekend 1: May 1–4</strong> — The Opening. War Room roll call. First circle. The ice bath. The formation run. The oath.
            </p>
            <p>
              <strong style={{ color: GOLD }}>Weekend 2: May 8–11</strong> — The Forge. Elite reset training. Mastermind small groups. The second ice bath.
            </p>
            <p>
              <strong style={{ color: GOLD }}>Weekend 3: May 15–18</strong> — The Build. Trade academies. Network-to-network sessions. The third ice bath.
            </p>
            <p>
              <strong style={{ color: GOLD }}>Weekend 4: May 29–June 1</strong> — The Founding. The Co-Founders Charter. The Blue Moon Sealing. The order is born.
            </p>
            <p>
              Every man who stands in the founding circle becomes a Founding Brother. Not a member — a founder. The difference matters. Founders build. Members attend. You are a founder.
            </p>
          </div>
        </section>

        <hr className="gold-rule" />

        {/* ── SECTION VII ───────────────────────────────────────────────── */}
        <section style={{ marginBottom: 48 }}>
          <span className="section-num">VII</span>
          <h2 className="section-header">The Oath</h2>
          <div className="palapala-body">
            <p>
              Every brother speaks the same oath. Every brother speaks it out loud. Once.
            </p>
            <blockquote
              style={{
                borderLeft: `3px solid ${GOLD}`,
                paddingLeft: 24,
                margin: "28px 0",
                fontStyle: "italic",
                fontSize: "clamp(1.05rem, 2.5vw, 1.2rem)",
                lineHeight: 2.2,
                color: CREAM,
              }}
            >
              I stand with the order.<br />
              I carry my brother's weight as my own.<br />
              I show up at 4am when no one is watching.<br />
              I serve before I lead.<br />
              I build what will outlast me.<br />
              Under the Malu — I am Makoa.
            </blockquote>
            <p>
              The oath is not a ceremony. It is a commitment. It is the line between the man who attended and the man who belongs. You speak it once. You live it every day after.
            </p>
            <p>
              The order does not ask for perfection. It asks for presence. Show up. Tell the truth. Do the work. Hold your brothers. That is the whole of it.
            </p>
            <p>
              If you break the oath — if you betray a brother, if you take without giving, if you use the order for your own gain at the expense of others — you will be removed. Not with anger. Not with drama. Simply removed. The order protects itself by protecting its brothers.
            </p>
            <p>
              The oath is the foundation. Everything else is built on top of it.
            </p>
          </div>
        </section>

        <hr className="gold-rule" />

        {/* ── SIGNING BLOCK ─────────────────────────────────────────────── */}
        <div className="signing-block">
          <span className="signing-label">The Palapala was signed</span>
          <p style={{ color: "rgba(245,236,217,0.6)", fontSize: "0.9rem", lineHeight: 1.8, margin: "0 0 8px", fontFamily: "'JetBrains Mono', monospace" }}>
            Published April 21, 2026
          </p>
          <p style={{ color: "rgba(245,236,217,0.6)", fontSize: "0.9rem", lineHeight: 1.8, margin: "0 0 8px", fontFamily: "'JetBrains Mono', monospace" }}>
            Held under the Malu Trust · West Oʻahu · 2026
          </p>
          <p style={{ color: GOLD, fontSize: "0.95rem", lineHeight: 1.8, margin: "0 0 16px", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>
            Signed by: Makoa Steward 0001 · Founder Trustee
          </p>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontStyle: "italic",
              color: "rgba(245,236,217,0.35)",
              fontSize: "0.95rem",
              lineHeight: 1.8,
              margin: "0 0 40px",
            }}
          >
            [Aliʻi Council signatories to be added post-Founding 48]
          </p>
        </div>

        {/* ── BOTTOM MARK ───────────────────────────────────────────────── */}
        <div style={{ textAlign: "center", paddingBottom: 24 }}>
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.28em",
              color: FLAME,
              fontWeight: 700,
            }}
          >
            ROOT · SNAP · PEG · DNA · ECHO
          </p>
        </div>
      </div>

      {/* ── STICKY FOOTER CTAs ────────────────────────────────────────────── */}
      <div className="sticky-footer">
        <a href="/gate" className="btn-flame">
          Walk through the Gate →
        </a>
        <a href="/sponsor" className="btn-gold-outline">
          Sponsor a brother
        </a>
        <a href="/founding48" className="btn-text-link">
          Join the Waitlist
        </a>
      </div>
    </div>
  );
}
