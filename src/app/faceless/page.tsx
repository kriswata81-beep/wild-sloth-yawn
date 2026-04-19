"use client";
import { useState } from "react";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.55)";
const GOLD_20 = "rgba(176,142,80,0.2)";
const GOLD_10 = "rgba(176,142,80,0.1)";
const GREEN = "#3fb950";
const BLUE = "#58a6ff";
const RED = "#e05c5c";
const AMBER = "#f0883e";
const BG = "#04060a";

// ─── Types ────────────────────────────────────────────────────────────────────

type Format = {
  id: string;
  title: string;
  emoji: string;
  duration: string;
  platform: string;
  difficulty: "easy" | "medium";
  why: string;
  gear: string[];
  setup: string;
  shotList: { shot: string; how: string; duration: string }[];
  voiceover: string;
  caption: string;
  hashtags: string;
  doNot: string[];
  facelessTip: string;
};

// ─── The 6 Formats ───────────────────────────────────────────────────────────

const FORMATS: Format[] = [
  {
    id: "hands",
    title: "The Hands Video",
    emoji: "🤲",
    duration: "30–60 sec",
    platform: "IG Reels · TikTok · FB",
    difficulty: "easy",
    why: "Hands are the most powerful faceless shot. They show work, craft, and identity without showing a face. The algorithm treats it like a face video — same reach, zero exposure.",
    gear: ["Phone on a tripod or propped up", "Natural light (window or outdoor)", "Your hands doing something real"],
    setup: "Film your hands doing something that represents the brotherhood: writing in a journal, wrapping knuckles, holding a coffee at 4am, gripping a steering wheel, placing a stone on a table.",
    shotList: [
      { shot: "OPEN: Hands wrapped around a coffee mug", how: "Top-down shot. Steam rising. Dark background. 4am light.", duration: "3 sec" },
      { shot: "Hands writing in a journal", how: "Side angle. Show the pen moving. Don't show what's written.", duration: "4 sec" },
      { shot: "Hands gripping a steering wheel", how: "Dashboard in background. Early morning light. Engine running.", duration: "3 sec" },
      { shot: "Hands placing a stone on a table", how: "Slow. Deliberate. Close-up. The stone is the symbol.", duration: "4 sec" },
      { shot: "CLOSE: Hands open, palms up", how: "Stillness. Hold for 3 seconds. Then cut.", duration: "3 sec" },
    ],
    voiceover: `Record your voice separately. No face needed.

"These hands built something.

Not a business. Not a brand.

A brotherhood.

Men who show up at 4am when no one is watching.

Men who carry each other's weight.

Men who don't perform strength — they build it.

Mākoa. West Oahu.

The gate is open.

makoa.live"`,
    caption: `These hands built something.

Not a business. Not a brand.

A brotherhood.

Men who show up at 4am when no one is watching.

If you're the man who needed this — the gate is open.

makoa.live/gate`,
    hashtags: "#brotherhood #westOahu #makoa #mentalhealth #4am",
    doNot: [
      "Don't show your face — the mystery is the point",
      "Don't use stock footage — your real hands are more powerful",
      "Don't add music that competes with the voiceover",
      "Don't rush the shots — slow and deliberate wins",
    ],
    facelessTip: "Film in portrait mode. Prop your phone against a book or use a $12 tripod clip. The whole video can be filmed in your kitchen in 10 minutes.",
  },
  {
    id: "silhouette",
    title: "The Silhouette",
    emoji: "🌅",
    duration: "15–45 sec",
    platform: "IG Reels · TikTok · Stories",
    difficulty: "easy",
    why: "Silhouette videos are the highest-performing faceless format on Instagram. The algorithm loves them. They feel cinematic without any production. Sunrise or sunset. One take.",
    gear: ["Phone camera", "Sunrise or sunset (golden hour)", "A window, doorway, or outdoor location"],
    setup: "Stand in front of a bright window or outside at sunrise/sunset. Face the light source. Your phone films from behind you or from the side. You become a dark shape against the light. That IS the content.",
    shotList: [
      { shot: "OPEN: You standing in a doorway, light behind you", how: "Film from inside looking out. You're a silhouette in the frame. Hold still for 3 seconds.", duration: "3 sec" },
      { shot: "Walking toward the light", how: "Film from behind. You walk away from camera toward sunrise. Slow walk.", duration: "5 sec" },
      { shot: "Standing still, looking at horizon", how: "Side profile. Sun behind you. Arms at sides. Don't move.", duration: "4 sec" },
      { shot: "Hands raised (optional)", how: "From behind. Arms raised slowly. Sunrise in background.", duration: "3 sec" },
      { shot: "CLOSE: Back to camera, standing still", how: "Hold. Let the light change. Cut on stillness.", duration: "4 sec" },
    ],
    voiceover: `"Most men are waiting.

Waiting for permission.
Waiting for the right time.
Waiting for someone to go first.

The men in this order stopped waiting.

They show up at 4am.
They train when it's dark.
They build when no one is watching.

Mākoa. West Oahu.

The gate is open.

makoa.live"`,
    caption: `Most men are waiting.

Waiting for permission.
Waiting for the right time.
Waiting for someone to go first.

The men in this order stopped waiting.

Mākoa. West Oahu. May 1.

makoa.live/gate`,
    hashtags: "#silhouette #brotherhood #makoa #westOahu #sunrise",
    doNot: [
      "Don't film in bad light — golden hour only",
      "Don't move too fast — slow and deliberate",
      "Don't add text overlays — the image speaks",
      "Don't use a filter — raw is real",
    ],
    facelessTip: "The best silhouette shot is you standing in your front door at 5:30am. Phone propped on a chair inside, filming you from behind. Takes 5 minutes. Looks cinematic.",
  },
  {
    id: "broll",
    title: "The B-Roll Drop",
    emoji: "🎬",
    duration: "30–60 sec",
    platform: "IG Reels · TikTok · FB",
    difficulty: "medium",
    why: "B-roll with voiceover is the format that built every major men's movement online. No face. No talking head. Just real footage of real things — and your voice telling the truth. This format has the highest share rate of any format we've tested.",
    gear: ["Phone camera", "Tripod or steady surface", "Earbuds with mic for voiceover"],
    setup: "Film 6–8 short clips of real things: your truck, your hands, the ocean, a weight, a journal, a door, a road at dawn. Then record your voiceover separately and lay it over the clips in CapCut (free app).",
    shotList: [
      { shot: "Your truck parked at dawn", how: "Film from outside. Engine off. Just the truck in early light.", duration: "3 sec" },
      { shot: "Boots on pavement", how: "Low angle. Film your feet walking. Don't show above the knee.", duration: "3 sec" },
      { shot: "Ocean or mountain — West Oahu", how: "Wide shot. Waianae range or Makaha coast. Hold still.", duration: "4 sec" },
      { shot: "A weight or tool in your hands", how: "Close-up. Hands only. Something that represents work.", duration: "3 sec" },
      { shot: "A journal open on a table", how: "Top-down. Pen beside it. Coffee nearby.", duration: "3 sec" },
      { shot: "A door — closed, then opening", how: "Film the door from outside. Slow push open. Light inside.", duration: "4 sec" },
      { shot: "CLOSE: Road at dawn, empty", how: "Wide. No people. Just the road and the light.", duration: "5 sec" },
    ],
    voiceover: `"There's a version of you that's been waiting.

Waiting for the right brotherhood.
Waiting for men who actually show up.
Waiting for something worth belonging to.

That version of you found this.

Mākoa. West Oahu.

We meet the first weekend of every month.
We train at 4am.
We hold each other accountable.
We don't perform strength — we build it.

May 1st. 8 seats.

The gate is open.

makoa.live"`,
    caption: `There's a version of you that's been waiting.

Waiting for the right brotherhood.
Waiting for men who actually show up.

That version of you found this.

Mākoa. West Oahu. May 1. 8 seats.

makoa.live/gate`,
    hashtags: "#brotherhood #westOahu #makoa #menswellness #4am #Hawaii",
    doNot: [
      "Don't use stock footage — your real environment is more powerful",
      "Don't add music that competes with the voiceover",
      "Don't rush the edit — let each clip breathe",
      "Don't add text overlays — the voiceover carries it",
    ],
    facelessTip: "Use CapCut (free). Import your clips. Record voiceover in the app. Set each clip to match the voiceover timing. Add one subtle background track at 15% volume. Export. Done.",
  },
  {
    id: "text-only",
    title: "The Text Drop",
    emoji: "✍️",
    duration: "Static post or 15-sec reel",
    platform: "IG · FB · TikTok · Telegram",
    difficulty: "easy",
    why: "Text-only posts are the most underrated format. No face. No video. No production. Just words on a dark background. When the words are right, they stop the scroll better than any video. This is the mystery drop format.",
    gear: ["Your phone", "Notes app or CapCut text template", "Nothing else"],
    setup: "Open CapCut or Canva. Black background. White or gold text. One sentence per screen. No logo. No branding. Just the words. Export as a reel (text animating in) or a static post.",
    shotList: [
      { shot: "Screen 1: One sentence", how: "Black background. Gold or white text. Center aligned. Fade in.", duration: "2 sec" },
      { shot: "Screen 2: Second sentence", how: "Same style. Different line. Let it breathe.", duration: "2 sec" },
      { shot: "Screen 3: The turn", how: "The line that reframes everything.", duration: "2 sec" },
      { shot: "Screen 4: Mākoa", how: "Just the word. Gold. Centered.", duration: "2 sec" },
      { shot: "Screen 5: The call", how: "makoa.live/gate — white text, smaller.", duration: "3 sec" },
    ],
    voiceover: `No voiceover needed. The text IS the content.

VERSION 1 — THE MYSTERY:
👁
makoa.live

---

VERSION 2 — THE CONFESSION:
I had no real friends.

Not the kind you call at 2am.

I built what I needed.

Mākoa. West Oahu.

makoa.live/gate

---

VERSION 3 — THE STAT:
1 in 10 men has zero close friends.

Not few friends.

Zero.

This is unacceptable.

makoa.live/gate

---

VERSION 4 — THE INVITATION:
The gate is open.

Not for everyone.

makoa.live`,
    caption: `The gate is open.

Not for everyone.

If you know — you know.

makoa.live/gate`,
    hashtags: "#brotherhood #makoa #westOahu",
    doNot: [
      "Don't add your face or logo — the anonymity is the power",
      "Don't explain it in the comments — let the mystery work",
      "Don't use more than 3 hashtags on mystery posts",
      "Don't post more than once a day — let each post breathe",
    ],
    facelessTip: "The '👁' post with just 'makoa.live' underneath gets more DMs than any produced video. Post it. Reply to every comment with 'you'll know when you're ready.' Never explain.",
  },
  {
    id: "pov",
    title: "The POV Video",
    emoji: "👁",
    duration: "30–60 sec",
    platform: "TikTok · IG Reels",
    difficulty: "easy",
    why: "POV (point of view) is TikTok's highest-performing format for men's content. You film what you see — not yourself. The viewer becomes you. No face needed. The caption does the work.",
    gear: ["Phone camera", "Steady hands or gimbal", "Real location — your truck, training spot, ocean"],
    setup: "Film from your perspective — what you see, not what you look like. Walking to your truck at 4am. Driving to the training spot. Looking at the ocean. The viewer is inside your experience.",
    shotList: [
      { shot: "POV: Walking out your front door at 4am", how: "Film from chest height. Dark outside. Porch light. Your breath visible if cold.", duration: "4 sec" },
      { shot: "POV: Getting in your truck", how: "Film the door opening, sitting down, hands on wheel.", duration: "4 sec" },
      { shot: "POV: Driving — empty road at dawn", how: "Dashboard cam angle. Road ahead. No other cars.", duration: "5 sec" },
      { shot: "POV: Arriving — other trucks in the lot", how: "Film the parking lot. Other men arriving. Don't show faces.", duration: "4 sec" },
      { shot: "POV: Looking at the ocean or mountain", how: "Wide. Still. Hold for 4 seconds.", duration: "4 sec" },
    ],
    voiceover: `Caption does the work. No voiceover needed.

CAPTION FOR THIS VIDEO:

POV: You found the brotherhood you've been looking for.

4am. West Oahu. Every first weekend.

Men who actually show up.

makoa.live/gate — 8 seats for May.

---

ALTERNATIVE CAPTION:

POV: You stopped waiting and walked through the gate.

Mākoa. West Oahu.

makoa.live/gate`,
    caption: `POV: You found the brotherhood you've been looking for.

4am. West Oahu. Every first weekend.

Men who actually show up.

makoa.live/gate — 8 seats for May.`,
    hashtags: "#POV #brotherhood #makoa #westOahu #4am #menswellness",
    doNot: [
      "Don't show other men's faces without permission",
      "Don't add a voiceover — the POV format works with caption only",
      "Don't stabilize too much — slight movement feels real",
      "Don't film in bad light — dawn or golden hour only",
    ],
    facelessTip: "The best POV video is you walking out your door at 4am. 30 seconds. No editing. Just the walk. Caption: 'POV: You stopped waiting.' That's it. Post it.",
  },
  {
    id: "audio-only",
    title: "The Voice Drop",
    emoji: "🎙",
    duration: "60–90 sec",
    platform: "IG · TikTok · FB · Telegram",
    difficulty: "easy",
    why: "Voice-only content with a static image or waveform is one of the most intimate formats online. It feels like a private message. Men listen all the way through because it feels like it was made for them specifically. No face. Just truth.",
    gear: ["Phone with earbuds (mic in the cord)", "A quiet space — your truck, bathroom, outside at dawn", "A static image for the background (black screen or silhouette)"],
    setup: "Sit in your truck or a quiet room. Earbuds in. Record your voice in Voice Memos or directly in CapCut. No script in hand — just talk. Then put a black background or silhouette image behind it and post as a reel.",
    shotList: [
      { shot: "Background: Black screen or silhouette", how: "Static image. No movement. The voice is the content.", duration: "Full video" },
      { shot: "Optional: Waveform animation", how: "CapCut has a built-in waveform. Looks clean. Adds visual interest.", duration: "Full video" },
      { shot: "Optional: Slow zoom on a still image", how: "Your truck. The ocean. A stone. Slow Ken Burns effect.", duration: "Full video" },
    ],
    voiceover: `RECORD THIS — YOUR OWN WORDS, THIS IS A GUIDE:

"I want to talk to the man who's been carrying it alone.

You know who you are.

You wake up at 3am and your mind won't stop.
You perform strength all day and collapse at night.
You have people around you but no one who actually sees you.

I was that man.

I built Mākoa because I needed it.

A brotherhood of men who show up.
Who train at 4am.
Who hold each other accountable.
Who don't perform — they build.

West Oahu. May 1st. 8 seats.

If this is for you — you already know.

makoa.live"

---

SHORTER VERSION (30 sec):

"I want to talk to the man who's been carrying it alone.

You know who you are.

I built Mākoa for you.

West Oahu. May 1. 8 seats.

makoa.live"`,
    caption: `I want to talk to the man who's been carrying it alone.

You know who you are.

I built Mākoa for you.

West Oahu. May 1. 8 seats.

makoa.live/gate`,
    hashtags: "#brotherhood #makoa #westOahu #mentalhealth #isolation #Hawaii",
    doNot: [
      "Don't read from a script — it sounds fake. Use the guide, then put it down.",
      "Don't record in a noisy place — your truck with the engine off is perfect",
      "Don't add music that competes — silence or very low ambient sound only",
      "Don't edit out the pauses — the pauses are where the emotion lives",
    ],
    facelessTip: "Record in your truck with the engine off. Earbuds in. One take. If you mess up, keep going — the imperfection is what makes it real. Men can hear authenticity. They can also hear performance.",
  },
];

// ─── Components ───────────────────────────────────────────────────────────────

function CopyBtn({ text, label = "COPY" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      }}
      style={{
        background: copied ? "rgba(63,185,80,0.15)" : GOLD_10,
        border: `1px solid ${copied ? "rgba(63,185,80,0.4)" : GOLD_20}`,
        color: copied ? GREEN : GOLD,
        fontSize: "0.38rem", letterSpacing: "0.12em",
        padding: "7px 14px", borderRadius: 5, cursor: "pointer",
        fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
        transition: "all 0.2s", flexShrink: 0,
      }}
    >
      {copied ? "✓ COPIED" : label}
    </button>
  );
}

function Block({
  label, color = GOLD_DIM, children,
}: {
  label: string; color?: string; children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <p style={{ color, fontSize: "0.34rem", letterSpacing: "0.22em", marginBottom: 8 }}>{label}</p>
      {children}
    </div>
  );
}

function CodeBlock({ text, copyLabel }: { text: string; copyLabel?: string }) {
  return (
    <div style={{
      background: "rgba(0,0,0,0.5)", border: "1px solid rgba(176,142,80,0.15)",
      borderRadius: 8, padding: "14px 16px",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
        <div style={{ flex: 1 }} />
        <CopyBtn text={text} label={copyLabel || "COPY"} />
      </div>
      <p style={{
        color: "rgba(232,224,208,0.8)", fontSize: "0.46rem", lineHeight: 1.9,
        whiteSpace: "pre-line", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
        margin: 0,
      }}>
        {text}
      </p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function FacelessPage() {
  const [active, setActive] = useState<string>("hands");
  const format = FORMATS.find(f => f.id === active)!;

  return (
    <div style={{
      minHeight: "100vh", background: BG,
      fontFamily: "'JetBrains Mono', monospace",
      color: "#e8e0d0",
    }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:0.6; } 50% { opacity:1; } }
      `}</style>

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <div style={{
        borderBottom: `1px solid ${GOLD_20}`,
        padding: "40px 24px 28px",
        textAlign: "center",
        animation: "fadeUp 0.5s ease both",
      }}>
        <p style={{ color: GOLD_DIM, fontSize: "0.36rem", letterSpacing: "0.3em", marginBottom: 10 }}>
          MĀKOA ORDER · CONTENT SYSTEM
        </p>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
          fontSize: "clamp(1.8rem, 5vw, 2.8rem)", color: GOLD,
          margin: "0 0 10px", fontWeight: 300, lineHeight: 1.2,
        }}>
          Faceless Videos That Work
        </h1>
        <p style={{
          color: "rgba(232,224,208,0.45)", fontSize: "0.46rem",
          lineHeight: 1.7, maxWidth: 480, margin: "0 auto",
        }}>
          6 formats. No face required. Full shot lists, voiceovers, and captions — ready to copy and film.
        </p>

        {/* The core truth */}
        <div style={{
          display: "inline-flex", gap: 20, marginTop: 20, flexWrap: "wrap", justifyContent: "center",
        }}>
          {[
            { icon: "👁", label: "No face needed" },
            { icon: "📱", label: "Phone only" },
            { icon: "⏱", label: "Under 30 min to film" },
          ].map(item => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: "0.9rem" }}>{item.icon}</span>
              <span style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.4rem" }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── WHY FACELESS WORKS ─────────────────────────────────────────────── */}
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px 20px 0" }}>
        <div style={{
          background: "rgba(176,142,80,0.04)", border: `1px solid ${GOLD_20}`,
          borderRadius: 10, padding: "18px 20px", marginBottom: 24,
          animation: "fadeUp 0.6s ease both",
        }}>
          <p style={{ color: GOLD, fontSize: "0.42rem", letterSpacing: "0.18em", marginBottom: 12 }}>
            WHY FACELESS WORKS BETTER FOR MĀKOA
          </p>
          <div style={{ display: "grid", gap: 8 }}>
            {[
              { icon: "◈", text: "Mystery drives curiosity. Curiosity drives clicks. Clicks drive gate submissions." },
              { icon: "◈", text: "XI is the face of the order — not you. The movement is bigger than any one man." },
              { icon: "◈", text: "Faceless content gets shared more — men share what they feel, not who they see." },
              { icon: "◈", text: "You can post daily without burning out. No makeup. No lighting. No performance." },
              { icon: "◈", text: "The algorithm treats silhouettes and hands the same as face videos. Same reach." },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ color: GOLD, fontSize: "0.5rem", flexShrink: 0, opacity: 0.5, marginTop: 1 }}>{item.icon}</span>
                <p style={{ color: "rgba(232,224,208,0.6)", fontSize: "0.44rem", lineHeight: 1.6, margin: 0 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── FORMAT SELECTOR ─────────────────────────────────────────────── */}
        <p style={{ color: GOLD_DIM, fontSize: "0.36rem", letterSpacing: "0.22em", marginBottom: 12 }}>
          CHOOSE YOUR FORMAT
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 28 }}>
          {FORMATS.map(f => (
            <button
              key={f.id}
              onClick={() => setActive(f.id)}
              style={{
                background: active === f.id ? GOLD_10 : "rgba(0,0,0,0.3)",
                border: `1px solid ${active === f.id ? GOLD_20 : "rgba(176,142,80,0.08)"}`,
                borderRadius: 10, padding: "14px 14px",
                cursor: "pointer", textAlign: "left",
                transition: "all 0.2s",
                outline: "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: "1.1rem" }}>{f.emoji}</span>
                <p style={{
                  color: active === f.id ? GOLD : "#e8e0d0",
                  fontSize: "0.44rem", fontWeight: 600, margin: 0,
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  {f.title}
                </p>
              </div>
              <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.36rem", margin: 0 }}>
                {f.duration}
              </p>
              <div style={{ marginTop: 6 }}>
                <span style={{
                  background: f.difficulty === "easy" ? "rgba(63,185,80,0.12)" : "rgba(240,136,62,0.12)",
                  border: `1px solid ${f.difficulty === "easy" ? "rgba(63,185,80,0.3)" : "rgba(240,136,62,0.3)"}`,
                  color: f.difficulty === "easy" ? GREEN : AMBER,
                  fontSize: "0.32rem", letterSpacing: "0.1em",
                  padding: "2px 7px", borderRadius: 3,
                }}>
                  {f.difficulty === "easy" ? "EASY" : "MEDIUM"}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* ── ACTIVE FORMAT DETAIL ─────────────────────────────────────────── */}
        <div key={active} style={{ animation: "fadeUp 0.35s ease both" }}>

          {/* Header */}
          <div style={{
            background: GOLD_10, border: `1px solid ${GOLD_20}`,
            borderRadius: 12, padding: "20px 20px", marginBottom: 20,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <span style={{ fontSize: "1.8rem" }}>{format.emoji}</span>
              <div>
                <h2 style={{
                  fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
                  color: GOLD, fontSize: "1.4rem", margin: 0, fontWeight: 400,
                }}>
                  {format.title}
                </h2>
                <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.38rem", margin: "4px 0 0" }}>
                  {format.platform} · {format.duration}
                </p>
              </div>
            </div>
            <p style={{ color: "rgba(232,224,208,0.65)", fontSize: "0.46rem", lineHeight: 1.7, margin: 0 }}>
              {format.why}
            </p>
          </div>

          {/* Faceless tip */}
          <div style={{
            background: "rgba(88,166,255,0.06)", border: "1px solid rgba(88,166,255,0.2)",
            borderRadius: 8, padding: "14px 16px", marginBottom: 20,
            display: "flex", gap: 10, alignItems: "flex-start",
          }}>
            <span style={{ color: BLUE, fontSize: "1rem", flexShrink: 0 }}>💡</span>
            <p style={{ color: "rgba(232,224,208,0.7)", fontSize: "0.44rem", lineHeight: 1.7, margin: 0 }}>
              <span style={{ color: BLUE, fontWeight: 700 }}>FACELESS TIP: </span>
              {format.facelessTip}
            </p>
          </div>

          {/* Gear */}
          <Block label="WHAT YOU NEED">
            <div style={{ display: "grid", gap: 6 }}>
              {format.gear.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ color: GREEN, fontSize: "0.5rem", flexShrink: 0 }}>✓</span>
                  <p style={{ color: "rgba(232,224,208,0.65)", fontSize: "0.44rem", lineHeight: 1.5, margin: 0 }}>{item}</p>
                </div>
              ))}
            </div>
          </Block>

          {/* Setup */}
          <Block label="SETUP">
            <div style={{
              background: "rgba(0,0,0,0.3)", border: "1px solid rgba(176,142,80,0.1)",
              borderRadius: 8, padding: "14px 16px",
            }}>
              <p style={{ color: "rgba(232,224,208,0.65)", fontSize: "0.46rem", lineHeight: 1.8, margin: 0 }}>
                {format.setup}
              </p>
            </div>
          </Block>

          {/* Shot list */}
          <Block label="SHOT LIST — FILM THESE IN ORDER">
            <div style={{ display: "grid", gap: 8 }}>
              {format.shotList.map((shot, i) => (
                <div key={i} style={{
                  background: "rgba(0,0,0,0.3)", border: "1px solid rgba(176,142,80,0.08)",
                  borderRadius: 8, padding: "12px 14px",
                  display: "flex", gap: 12, alignItems: "flex-start",
                }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: "50%",
                    background: `${GOLD}15`, border: `1px solid ${GOLD}30`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, marginTop: 2,
                  }}>
                    <span style={{ color: GOLD, fontSize: "0.6rem", fontWeight: 700 }}>{i + 1}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: "#e8e0d0", fontSize: "0.44rem", fontWeight: 600, marginBottom: 3 }}>
                      {shot.shot}
                    </p>
                    <p style={{ color: "rgba(232,224,208,0.45)", fontSize: "0.4rem", lineHeight: 1.5, marginBottom: 4 }}>
                      {shot.how}
                    </p>
                    <span style={{
                      background: "rgba(176,142,80,0.08)", border: "1px solid rgba(176,142,80,0.15)",
                      color: GOLD_DIM, fontSize: "0.34rem", letterSpacing: "0.1em",
                      padding: "2px 8px", borderRadius: 3,
                    }}>
                      {shot.duration}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Block>

          {/* Voiceover */}
          <Block label="VOICEOVER / SCRIPT" color={GOLD_DIM}>
            <CodeBlock text={format.voiceover} copyLabel="COPY VOICEOVER" />
          </Block>

          {/* Caption */}
          <Block label="CAPTION — COPY THIS EXACTLY" color={GOLD_DIM}>
            <CodeBlock text={format.caption} copyLabel="COPY CAPTION" />
          </Block>

          {/* Hashtags */}
          <Block label="HASHTAGS">
            <div style={{
              background: "rgba(0,0,0,0.3)", border: "1px solid rgba(176,142,80,0.1)",
              borderRadius: 8, padding: "12px 14px",
              display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
            }}>
              <p style={{ color: "rgba(232,224,208,0.5)", fontSize: "0.44rem", margin: 0 }}>
                {format.hashtags}
              </p>
              <CopyBtn text={format.hashtags} label="COPY" />
            </div>
          </Block>

          {/* Do not */}
          <Block label="DO NOT" color={RED}>
            <div style={{
              background: "rgba(224,92,92,0.05)", border: "1px solid rgba(224,92,92,0.15)",
              borderRadius: 8, padding: "14px 16px",
            }}>
              <div style={{ display: "grid", gap: 8 }}>
                {format.doNot.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ color: RED, fontSize: "0.5rem", flexShrink: 0 }}>×</span>
                    <p style={{ color: "rgba(232,224,208,0.6)", fontSize: "0.44rem", lineHeight: 1.5, margin: 0 }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </Block>

          {/* Format nav */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            marginTop: 8, marginBottom: 32, paddingTop: 20,
            borderTop: `1px solid ${GOLD_20}`,
          }}>
            {(() => {
              const idx = FORMATS.findIndex(f => f.id === active);
              const prev = FORMATS[idx - 1];
              const next = FORMATS[idx + 1];
              return (
                <>
                  {prev ? (
                    <button onClick={() => setActive(prev.id)} style={{
                      background: "none", border: `1px solid ${GOLD_20}`,
                      color: GOLD_DIM, fontSize: "0.38rem", letterSpacing: "0.1em",
                      padding: "8px 14px", borderRadius: 6, cursor: "pointer",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}>
                      ← {prev.emoji} {prev.title}
                    </button>
                  ) : <div />}
                  {next ? (
                    <button onClick={() => setActive(next.id)} style={{
                      background: GOLD_10, border: `1px solid ${GOLD_20}`,
                      color: GOLD, fontSize: "0.38rem", letterSpacing: "0.1em",
                      padding: "8px 14px", borderRadius: 6, cursor: "pointer",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}>
                      {next.emoji} {next.title} →
                    </button>
                  ) : <div />}
                </>
              );
            })()}
          </div>
        </div>

        {/* ── THE WEEKLY POSTING PLAN ─────────────────────────────────────── */}
        <div style={{
          background: GOLD_10, border: `1px solid ${GOLD_20}`,
          borderRadius: 12, padding: "20px 20px", marginBottom: 32,
        }}>
          <p style={{ color: GOLD, fontSize: "0.42rem", letterSpacing: "0.18em", marginBottom: 16 }}>
            THE WEEKLY POSTING PLAN — FACELESS
          </p>
          <div style={{ display: "grid", gap: 10 }}>
            {[
              { day: "MON", format: "Text Drop", desc: "Mystery post. Just '👁' and makoa.live. Nothing else.", color: GOLD },
              { day: "WED", format: "Hands Video", desc: "Film your hands at 4am. Coffee, journal, or stone. 30 sec.", color: BLUE },
              { day: "FRI", format: "B-Roll Drop", desc: "6 clips of West Oahu + voiceover. Film Thursday, post Friday.", color: GREEN },
              { day: "SUN", format: "Voice Drop", desc: "Record in your truck. 60 sec. Raw truth. No script.", color: AMBER },
            ].map(item => (
              <div key={item.day} style={{
                display: "flex", gap: 14, alignItems: "flex-start",
                padding: "12px 14px",
                background: "rgba(0,0,0,0.3)", border: "1px solid rgba(176,142,80,0.08)",
                borderRadius: 8,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 6, flexShrink: 0,
                  background: `${item.color}12`, border: `1px solid ${item.color}30`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ color: item.color, fontSize: "0.38rem", fontWeight: 700, letterSpacing: "0.05em" }}>{item.day}</span>
                </div>
                <div>
                  <p style={{ color: "#e8e0d0", fontSize: "0.46rem", fontWeight: 600, marginBottom: 3 }}>{item.format}</p>
                  <p style={{ color: "rgba(232,224,208,0.4)", fontSize: "0.4rem", lineHeight: 1.5, margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p style={{
            color: "rgba(232,224,208,0.3)", fontSize: "0.4rem", lineHeight: 1.6,
            marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(176,142,80,0.1)",
          }}>
            4 posts per week. All faceless. All under 30 minutes to produce. This is the minimum viable content plan for Mākoa.
          </p>
        </div>

        {/* ── BOTTOM NAV ──────────────────────────────────────────────────── */}
        <div style={{ textAlign: "center", paddingBottom: 48 }}>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 16 }}>
            {[
              { href: "/gate", label: "THE GATE" },
              { href: "/links", label: "LINK IN BIO" },
              { href: "/steward", label: "STEWARD" },
            ].map(l => (
              <a key={l.href} href={l.href} style={{
                color: GOLD_DIM, fontSize: "0.38rem", letterSpacing: "0.14em",
                textDecoration: "none", borderBottom: `1px solid ${GOLD_20}`, paddingBottom: 2,
              }}>
                {l.label}
              </a>
            ))}
          </div>
          <p style={{ color: "rgba(176,142,80,0.15)", fontSize: "0.34rem", letterSpacing: "0.12em" }}>
            Mākoa Order · Content System · 2026
          </p>
        </div>
      </div>
    </div>
  );
}
