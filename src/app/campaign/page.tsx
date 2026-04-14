"use client";
import { useState } from "react";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.5)";
const GOLD_20 = "rgba(176,142,80,0.2)";
const GOLD_10 = "rgba(176,142,80,0.1)";
const GOLD_40 = "rgba(176,142,80,0.4)";
const GREEN = "#3fb950";
const GREEN_20 = "rgba(63,185,80,0.2)";
const GREEN_10 = "rgba(63,185,80,0.1)";
const BLUE = "#58a6ff";
const BLUE_20 = "rgba(88,166,255,0.2)";
const BLUE_10 = "rgba(88,166,255,0.1)";
const AMBER = "#f0883e";
const AMBER_20 = "rgba(240,136,62,0.2)";
const AMBER_10 = "rgba(240,136,62,0.1)";
const RED = "#f85149";
const BG = "#04060a";

// ── 12-Day Sprint Schedule ────────────────────────────────────────────────────
const SPRINT = [
  {
    day: "MON APR 14",
    phase: "OPEN",
    label: "Day 1 — Drop the Signal",
    platform: "Instagram + Facebook",
    type: "REEL / VIDEO",
    color: GOLD,
    hook: "West Oahu. May 1. The founding fire.",
    caption: `West Oahu. May 1.

Not a conference. Not a retreat. Not a men's group that talks about doing things.

Mākoa is a brotherhood with a founding fire — and it happens once.

4am ice bath. Brotherhood circle. The oath. A trade network built by men who show up.

4 Co-Founder seats. 6 Mana seats. 10 Nā Koa Day Passes.

Hotel rooms held until April 20.
Sold out target: April 25.

The gate is open.
→ makoa.live

#Makoa #Brotherhood #WestOahu #MensMentalHealth #Hawaii #MAYDAY2026 #FoundingFire`,
    visual: "Crest on black. Gold glow. No text except MĀKOA. Let the image breathe.",
    cta: "Link in bio → makoa.live",
    target: "Cold leads — men who don't know you yet",
  },
  {
    day: "MON APR 14",
    phase: "OPEN",
    label: "Day 1 — Sponsor Post",
    platform: "Instagram + Facebook",
    type: "STATIC IMAGE",
    color: AMBER,
    hook: "Know a man who needs this?",
    caption: `Know a man who needs this?

A wife. A mother. A brother. A friend.

If you see something in him that he can't see in himself — this is how you act on it.

You choose his tier. You pay his way.
He receives a message:

"Someone believes in you.
You've been sponsored into Mākoa."

He never has to know who sent him.

Day Pass · $97
Mastermind · $197
War Room · $397 deposit

→ makoa.live/sponsor

#SponsorABrother #Makoa #MensHealing #Hawaii #Brotherhood`,
    visual: "Two silhouettes. One hand on the other's shoulder. Gold light. No faces.",
    cta: "makoa.live/sponsor",
    target: "Women — wives, mothers, sisters. Men who want to send a friend.",
  },
  {
    day: "TUE APR 15",
    phase: "OPEN",
    label: "Day 2 — The Gate Post",
    platform: "Instagram Stories + Facebook",
    type: "STORY SEQUENCE (3 slides)",
    color: GREEN,
    hook: "The gate is open. Are you ready?",
    caption: `SLIDE 1:
"The gate is open."
[Crest image]

SLIDE 2:
"12 questions.
XI reads every answer.
No fluff.
You get a tier: Nā Koa, Mana, or Aliʻi.
The order sees you before you see the order."

SLIDE 3:
"Hotel rooms held until April 20.
After that — you're on your own.
→ makoa.live"
[Swipe up / Link sticker]`,
    visual: "Dark. Minimal. Gold text on black. Each slide one thought.",
    cta: "Swipe up → makoa.live",
    target: "Men who are curious but haven't committed",
  },
  {
    day: "WED APR 16",
    phase: "URGENCY",
    label: "Day 3 — Early Bird Closes",
    platform: "Instagram + Facebook + Telegram",
    type: "REEL + STATIC",
    color: RED,
    hook: "Early bird closes tonight. Prices go up tomorrow.",
    caption: `Early bird closes tonight.

Nā Koa Day Pass: $149 → $199
Mana Mastermind: $299 → $399
Aliʻi War Room: $499 → $699

If you've been watching — this is the moment.

West Oahu. May 1–3.
The founding fire happens once.

→ makoa.live/founding20

#Makoa #MAYDAY2026 #LastChance #Brotherhood #Hawaii`,
    visual: "Countdown clock. Red urgency. Gold crest. Price comparison side by side.",
    cta: "makoa.live/founding20",
    target: "Warm leads who've visited the site but haven't bought",
  },
  {
    day: "THU APR 17",
    phase: "URGENCY",
    label: "Day 4 — The Trade Post",
    platform: "Instagram + Facebook",
    type: "CAROUSEL (5 slides)",
    color: AMBER,
    hook: "This isn't a brotherhood that talks. It's one that builds.",
    caption: `SLIDE 1: "The trade isn't what you sell. The trade is the men."

SLIDE 2: LABOR
"Skilled Hawaiian men, organized and dispatched.
Construction. Landscaping. Maintenance.
80% to the brother. 20% to the house."

SLIDE 3: KNOWLEDGE
"Brother teaches brother.
Welding. Finance. Code. Breathwork.
The Peer Academies."

SLIDE 4: TERRITORY
"West Oahu → Maui → Big Island → West Coast → Pacific Rim.
Each house is a node.
Each node opens a city."

SLIDE 5: "West Oahu. May 1–3.
The founding fire happens once.
→ makoa.live"`,
    visual: "Dark cards. Each slide one cargo. Gold, Blue, Green color coding.",
    cta: "makoa.live/trade",
    target: "Men who want to understand the business case before committing",
  },
  {
    day: "FRI APR 18",
    phase: "URGENCY",
    label: "Day 5 — Hotel Deadline Warning",
    platform: "Instagram Stories + Facebook + Telegram",
    type: "STORY + POST",
    color: RED,
    hook: "Hotel rooms released Sunday. After that you're booking your own.",
    caption: `Hotel rooms held until Sunday April 20.

After that — we release them back to the hotel.

If you want the full War Room experience (hotel included), you need to book by Sunday.

Aliʻi War Room: $499 (hotel included · 2 nights shared)
War Party VIP: $799/brother (airport pickup + hotel)

After Sunday: book your own room.

→ makoa.live/founding20

#Makoa #MAYDAY2026 #HotelDeadline #Brotherhood`,
    visual: "Calendar. April 20 circled in red. Hotel key icon.",
    cta: "makoa.live/founding20",
    target: "Men who want the full experience but are procrastinating",
  },
  {
    day: "SAT APR 19",
    phase: "URGENCY",
    label: "Day 6 — The Co-Founder Post",
    platform: "Instagram + Facebook",
    type: "STATIC + STORY",
    color: GOLD,
    hook: "4 seats. 1% equity each. The men who build the order from the inside.",
    caption: `4 seats.
1% equity each.
The men who build the order from the inside.

Co-Founder is not a title.
It's a seat at the founding table.

Territory rights. Council vote. 100-year mission.

At Year 1 ARR of $1.58M — that's a $15,800 annual dividend potential.
At Year 3 ARR — $168,000/yr.

You're buying in at the floor.
Before any external valuation.
Before the order is founded.

4 seats. Some are already claimed.

→ makoa.live/cofounder

#Makoa #CoFounder #Brotherhood #Investment #Hawaii #MAYDAY2026`,
    visual: "4 empty chairs around a fire. One lit. Gold light.",
    cta: "makoa.live/cofounder",
    target: "High-value men — business owners, investors, leaders",
  },
  {
    day: "SUN APR 20",
    phase: "DEADLINE",
    label: "Day 7 — HOTEL DEADLINE DAY",
    platform: "Instagram + Facebook + Telegram + ALL CHANNELS",
    type: "REEL + STORY + POST",
    color: RED,
    hook: "TODAY. Hotel rooms release at midnight.",
    caption: `TODAY.

Hotel rooms release at midnight.

After tonight — you book your own room.

Aliʻi War Room (hotel included): makoa.live/founding20
War Party VIP (airport pickup + hotel): makoa.live/founding20

If you've been waiting — this is the last moment to get the full package.

West Oahu. May 1–3.
The founding fire happens once.

→ makoa.live/founding20

#Makoa #MAYDAY2026 #TodayIsTheDay #Brotherhood #Hawaii`,
    visual: "Clock at 11:59. Red. Urgent. Crest. One CTA.",
    cta: "makoa.live/founding20",
    target: "Everyone. Maximum reach day. Post 3x today.",
  },
  {
    day: "MON APR 21",
    phase: "LAST CALL",
    label: "Day 8 — Post-Deadline Push",
    platform: "Instagram + Facebook",
    type: "STATIC + STORY",
    color: BLUE,
    hook: "Hotel rooms are gone. Seats are not.",
    caption: `Hotel rooms are gone.

Seats are not.

Mana Mastermind (book your own hotel): $399
Nā Koa Day Pass (no hotel needed): $199

You can still be at the founding fire.
You just book your own room.

Embassy Suites Kapolei — mention Mākoa.

→ makoa.live/founding20

#Makoa #MAYDAY2026 #LastCall #Brotherhood`,
    visual: "Hotel key crossed out. Seat still open. Gold.",
    cta: "makoa.live/founding20",
    target: "Men who missed the hotel deadline but can still come",
  },
  {
    day: "TUE APR 22",
    phase: "LAST CALL",
    label: "Day 9 — The Sponsor Push",
    platform: "Instagram + Facebook",
    type: "REEL",
    color: AMBER,
    hook: "You know a man who needs this. You've known for a while.",
    caption: `You know a man who needs this.

You've known for a while.

He won't ask for help.
He won't admit he's struggling.
He won't sign up for a men's retreat.

But if someone believed in him enough to send him —
he'd go.

Day Pass · $97
Mastermind · $197
War Room · $397 deposit

He receives a message:
"Someone believes in you.
You've been sponsored into Mākoa."

He never has to know who.

→ makoa.live/sponsor

#SponsorABrother #Makoa #MensHealing #Brotherhood #Hawaii`,
    visual: "Man alone. Then two men. Gold light. No faces needed.",
    cta: "makoa.live/sponsor",
    target: "Women and men who want to send someone but haven't yet",
  },
  {
    day: "WED APR 23",
    phase: "LAST CALL",
    label: "Day 10 — Seat Count Update",
    platform: "Instagram Stories + Telegram",
    type: "STORY",
    color: RED,
    hook: "Seat update. Here's where we stand.",
    caption: `Seat update.

Co-Founder (Aliʻi): [X] of 4 claimed
Mana Mastermind: [X] of 6 claimed
Nā Koa Day Pass: [X] of 10 claimed

Sold out target: April 25.
That's 2 days.

→ makoa.live/founding20`,
    visual: "Live seat count. Red dots for claimed. Gold for remaining. Clean.",
    cta: "makoa.live/founding20",
    target: "Everyone — FOMO trigger. Update the numbers manually.",
  },
  {
    day: "THU APR 24",
    phase: "FINAL",
    label: "Day 11 — 24 Hours Left",
    platform: "ALL CHANNELS",
    type: "REEL + STORY + POST",
    color: RED,
    hook: "24 hours. Then we close the gate.",
    caption: `24 hours.

Then we close the gate.

West Oahu. May 1–3.
The founding fire happens once.

After tomorrow — the gate closes.
The founding brothers are set.
The order is sealed.

If you're reading this — you still have time.

→ makoa.live

#Makoa #MAYDAY2026 #24Hours #Brotherhood #Hawaii #FoundingFire`,
    visual: "Crest. 24:00:00 countdown. Gold. Maximum urgency.",
    cta: "makoa.live",
    target: "Everyone. Final push. Post morning + evening.",
  },
  {
    day: "FRI APR 25",
    phase: "FINAL",
    label: "Day 12 — SOLD OUT (or close)",
    platform: "ALL CHANNELS",
    type: "ANNOUNCEMENT",
    color: GOLD,
    hook: "The gate is closed. The 20 are set.",
    caption: `The gate is closed.

The 20 are set.

To every man who claimed his seat —
we'll see you at the fire.

May 1. West Oahu. 4am.

Under the Malu — I am Mākoa.

#Makoa #MAYDAY2026 #SoldOut #Brotherhood #FoundingFire #Hawaii`,
    visual: "Crest. FOUNDING BROTHERS SEALED. Gold. Celebratory but serious.",
    cta: "Waitlist → makoa.live/gate",
    target: "Everyone — social proof. Shows the world it sold out.",
  },
];

const PHASE_COLORS: Record<string, string> = {
  OPEN: GREEN,
  URGENCY: AMBER,
  DEADLINE: RED,
  "LAST CALL": BLUE,
  FINAL: GOLD,
};

const STRATEGY = [
  {
    title: "You don't need hundreds",
    body: "You need 50 warm leads to sell 20 seats. That's 2–3 posts that hit the right man in the chest. One viral reel about the sponsor path could fill the Nā Koa tier alone.",
    color: GOLD,
  },
  {
    title: "The sponsor path is your secret weapon",
    body: "Women share things men won't. One post targeting wives, mothers, and sisters — 'You know a man who needs this' — will reach men who would never click a brotherhood ad. The sponsor page is your highest-conversion cold traffic play.",
    color: AMBER,
  },
  {
    title: "Scarcity is real — use it",
    body: "4 Co-Founder seats. 6 Mana. 10 Nā Koa. These are real numbers. Post the seat count every 2 days. When a tier sells out, announce it. Nothing converts like 'only 3 left.'",
    color: RED,
  },
  {
    title: "The hotel deadline is your first hard close",
    body: "April 20 is your first real urgency moment. Hotel rooms included in War Room and War Party — after April 20, they book their own. This is a real deadline. Use it hard on April 18, 19, and 20.",
    color: BLUE,
  },
  {
    title: "Telegram is your inner circle",
    body: "Post everything to Telegram first. Your Telegram members are your warmest leads. They share to their networks. The channel is the brotherhood before the brotherhood exists.",
    color: GREEN,
  },
];

export default function CampaignPage() {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [activePhase, setActivePhase] = useState<string | null>(null);

  function copyCaption(text: string, idx: number) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    });
  }

  const filtered = activePhase ? SPRINT.filter(s => s.phase === activePhase) : SPRINT;

  return (
    <div style={{ background: BG, minHeight: "100vh", color: "#e8e0d0", fontFamily: "'JetBrains Mono', monospace", paddingBottom: 80 }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes breathe { 0%,100% { opacity:0.4; } 50% { opacity:1; } }
        @keyframes goldGlow { 0%,100% { box-shadow:0 0 12px rgba(176,142,80,0.1); } 50% { box-shadow:0 0 40px rgba(176,142,80,0.3); } }
        .copy-btn { transition: background 0.15s, color 0.15s; cursor: pointer; }
        .copy-btn:hover { background: rgba(176,142,80,0.15) !important; }
        .phase-btn { transition: all 0.15s; cursor: pointer; }
        .phase-btn:hover { opacity: 1 !important; }
      `}</style>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <div style={{
        background: "linear-gradient(180deg, #060810 0%, #04060a 100%)",
        borderBottom: `1px solid ${GOLD_20}`,
        padding: "56px 24px 48px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 0%, rgba(176,142,80,0.08) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />
        <div style={{ height: 1, background: `linear-gradient(to right, transparent, ${GOLD_40}, transparent)`, marginBottom: 40 }} />

        <p style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.3em", marginBottom: 16 }}>
          MĀKOA ORDER · SOCIAL CAMPAIGN
        </p>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          color: GOLD,
          fontSize: "clamp(2rem, 7vw, 3rem)",
          lineHeight: 1.1,
          margin: "0 0 12px",
        }}>
          The 12-Day Sprint
        </h1>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          color: "rgba(232,224,208,0.5)",
          fontSize: "1.1rem",
          marginBottom: 8,
        }}>
          April 14 → April 25
        </p>
        <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.48rem", lineHeight: 1.7, maxWidth: 360, margin: "0 auto 28px" }}>
          Hotel deadline: April 20 · Sold out target: April 25<br />
          Every post. Every caption. Every CTA. Ready to copy.
        </p>

        {/* Phase legend */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
          {[
            { phase: null, label: "ALL", color: GOLD_DIM },
            { phase: "OPEN", label: "OPEN", color: GREEN },
            { phase: "URGENCY", label: "URGENCY", color: AMBER },
            { phase: "DEADLINE", label: "DEADLINE", color: RED },
            { phase: "LAST CALL", label: "LAST CALL", color: BLUE },
            { phase: "FINAL", label: "FINAL", color: GOLD },
          ].map(p => (
            <button
              key={p.label}
              className="phase-btn"
              onClick={() => setActivePhase(p.phase)}
              style={{
                background: activePhase === p.phase ? `${p.color}20` : "transparent",
                border: `1px solid ${p.color}${activePhase === p.phase ? "60" : "30"}`,
                color: p.color,
                fontSize: "0.38rem",
                letterSpacing: "0.15em",
                padding: "5px 12px",
                borderRadius: 4,
                fontFamily: "'JetBrains Mono', monospace",
                opacity: activePhase === p.phase ? 1 : 0.6,
              }}
            >{p.label}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "0 20px" }}>

        {/* ── STRATEGY BRIEF ───────────────────────────────────────────────── */}
        <div style={{ margin: "36px 0 32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: GOLD_20 }} />
            <p style={{ color: GOLD_DIM, fontSize: "0.4rem", letterSpacing: "0.25em", whiteSpace: "nowrap" }}>STRATEGY BRIEF</p>
            <div style={{ flex: 1, height: 1, background: GOLD_20 }} />
          </div>

          <div style={{ display: "grid", gap: 10 }}>
            {STRATEGY.map((s, i) => (
              <div key={i} style={{
                padding: "16px 18px",
                background: "rgba(0,0,0,0.3)",
                border: `1px solid ${s.color}20`,
                borderLeft: `3px solid ${s.color}`,
                borderRadius: "0 8px 8px 0",
              }}>
                <p style={{ color: s.color, fontSize: "0.46rem", letterSpacing: "0.1em", marginBottom: 6 }}>{s.title}</p>
                <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.44rem", lineHeight: 1.8 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── DAILY POSTS ──────────────────────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ flex: 1, height: 1, background: GOLD_20 }} />
          <p style={{ color: GOLD_DIM, fontSize: "0.4rem", letterSpacing: "0.25em", whiteSpace: "nowrap" }}>
            {activePhase ? `${activePhase} PHASE` : "ALL 12 DAYS"}
          </p>
          <div style={{ flex: 1, height: 1, background: GOLD_20 }} />
        </div>

        <div style={{ display: "grid", gap: 16 }}>
          {filtered.map((post, i) => {
            const phaseColor = PHASE_COLORS[post.phase] || GOLD;
            return (
              <div key={i} style={{
                border: `1px solid ${phaseColor}25`,
                borderRadius: 12,
                background: "rgba(8,10,15,0.8)",
                overflow: "hidden",
              }}>
                {/* Header */}
                <div style={{
                  background: `${phaseColor}10`,
                  borderBottom: `1px solid ${phaseColor}20`,
                  padding: "14px 18px",
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 12,
                }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{
                        background: `${phaseColor}20`,
                        border: `1px solid ${phaseColor}40`,
                        color: phaseColor,
                        fontSize: "0.34rem",
                        letterSpacing: "0.12em",
                        padding: "2px 7px",
                        borderRadius: 3,
                      }}>{post.phase}</span>
                      <span style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.38rem" }}>{post.day}</span>
                    </div>
                    <p style={{ color: "#e8e0d0", fontSize: "0.5rem", lineHeight: 1.3 }}>{post.label}</p>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <p style={{ color: phaseColor, fontSize: "0.38rem", letterSpacing: "0.1em", marginBottom: 2 }}>{post.type}</p>
                    <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.36rem" }}>{post.platform}</p>
                  </div>
                </div>

                <div style={{ padding: "18px" }}>
                  {/* Hook */}
                  <div style={{
                    background: `${phaseColor}08`,
                    border: `1px solid ${phaseColor}20`,
                    borderRadius: 6,
                    padding: "10px 14px",
                    marginBottom: 14,
                  }}>
                    <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.36rem", letterSpacing: "0.15em", marginBottom: 4 }}>HOOK</p>
                    <p style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontStyle: "italic",
                      color: phaseColor,
                      fontSize: "1.0rem",
                      lineHeight: 1.4,
                    }}>{post.hook}</p>
                  </div>

                  {/* Caption */}
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.36rem", letterSpacing: "0.15em" }}>CAPTION</p>
                      <button
                        className="copy-btn"
                        onClick={() => copyCaption(post.caption, i)}
                        style={{
                          background: copiedIdx === i ? `${GREEN}20` : "rgba(176,142,80,0.08)",
                          border: `1px solid ${copiedIdx === i ? GREEN : GOLD_20}`,
                          color: copiedIdx === i ? GREEN : GOLD_DIM,
                          fontSize: "0.36rem",
                          letterSpacing: "0.1em",
                          padding: "4px 10px",
                          borderRadius: 4,
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                      >
                        {copiedIdx === i ? "✓ COPIED" : "COPY"}
                      </button>
                    </div>
                    <pre style={{
                      color: "rgba(232,224,208,0.6)",
                      fontSize: "0.44rem",
                      lineHeight: 1.8,
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      background: "rgba(0,0,0,0.3)",
                      border: "1px solid rgba(255,255,255,0.04)",
                      borderRadius: 6,
                      padding: "12px 14px",
                      margin: 0,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}>{post.caption}</pre>
                  </div>

                  {/* Visual + CTA + Target */}
                  <div style={{ display: "grid", gap: 8 }}>
                    <div style={{ padding: "10px 12px", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 6 }}>
                      <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.36rem", letterSpacing: "0.12em", marginBottom: 4 }}>VISUAL DIRECTION</p>
                      <p style={{ color: "rgba(232,224,208,0.55)", fontSize: "0.44rem", lineHeight: 1.6 }}>{post.visual}</p>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      <div style={{ padding: "10px 12px", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 6 }}>
                        <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.36rem", letterSpacing: "0.12em", marginBottom: 4 }}>CTA</p>
                        <p style={{ color: phaseColor, fontSize: "0.42rem", lineHeight: 1.5 }}>{post.cta}</p>
                      </div>
                      <div style={{ padding: "10px 12px", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 6 }}>
                        <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.36rem", letterSpacing: "0.12em", marginBottom: 4 }}>TARGET</p>
                        <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.4rem", lineHeight: 1.5 }}>{post.target}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── QUICK NUMBERS ─────────────────────────────────────────────────── */}
        <div style={{
          margin: "40px 0",
          background: "rgba(176,142,80,0.04)",
          border: `1px solid ${GOLD_40}`,
          borderRadius: 12,
          padding: "28px 22px",
          animation: "goldGlow 5s ease-in-out infinite",
        }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.4rem", letterSpacing: "0.28em", marginBottom: 20 }}>
            WHAT SOLD OUT LOOKS LIKE
          </p>

          <div style={{ display: "grid", gap: 10, marginBottom: 20 }}>
            {[
              { tier: "4 CO-FOUNDERS", need: "~12 qualified leads", price: "$4,997 each", color: GOLD, revenue: "$19,988" },
              { tier: "6 MANA", need: "~20 qualified leads", price: "$299–$399 each", color: BLUE, revenue: "$1,794–$2,394" },
              { tier: "10 NĀ KOA", need: "~25 qualified leads", price: "$149–$199 each", color: GREEN, revenue: "$1,490–$1,990" },
            ].map(t => (
              <div key={t.tier} style={{
                padding: "14px 16px",
                background: "rgba(0,0,0,0.3)",
                border: `1px solid ${t.color}20`,
                borderLeft: `3px solid ${t.color}`,
                borderRadius: "0 8px 8px 0",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                  <p style={{ color: t.color, fontSize: "0.44rem", letterSpacing: "0.1em" }}>{t.tier}</p>
                  <p style={{ color: t.color, fontSize: "0.5rem", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{t.revenue}</p>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.42rem" }}>Need: {t.need}</p>
                  <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.4rem" }}>{t.price}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ height: 1, background: GOLD_20, margin: "16px 0" }} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div style={{ textAlign: "center", padding: "14px", background: GOLD_10, border: `1px solid ${GOLD_20}`, borderRadius: 8 }}>
              <p style={{ color: GOLD, fontSize: "1.4rem", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>50</p>
              <p style={{ color: GOLD_DIM, fontSize: "0.38rem", letterSpacing: "0.1em", marginTop: 4 }}>WARM LEADS NEEDED</p>
            </div>
            <div style={{ textAlign: "center", padding: "14px", background: GOLD_10, border: `1px solid ${GOLD_20}`, borderRadius: 8 }}>
              <p style={{ color: GOLD, fontSize: "1.4rem", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>12</p>
              <p style={{ color: GOLD_DIM, fontSize: "0.38rem", letterSpacing: "0.1em", marginTop: 4 }}>DAYS TO SELL OUT</p>
            </div>
          </div>
        </div>

        {/* ── FOOTER ───────────────────────────────────────────────────────── */}
        <div style={{ textAlign: "center", paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
            {[
              { href: "/founding48", label: "MAYDAY" },
              { href: "/sponsor", label: "SPONSOR" },
              { href: "/cofounder", label: "CO-FOUNDER" },
              { href: "/gate", label: "THE GATE" },
            ].map(link => (
              <a key={link.href} href={link.href} style={{ color: "rgba(176,142,80,0.3)", fontSize: "0.4rem", letterSpacing: "0.15em", textDecoration: "none" }}>{link.label}</a>
            ))}
          </div>
          <p style={{ color: "rgba(176,142,80,0.15)", fontSize: "0.4rem", letterSpacing: "0.15em" }}>
            MĀKOA ORDER · CAMPAIGN VAULT · APR 14–25 · 2026
          </p>
        </div>

      </div>
    </div>
  );
}