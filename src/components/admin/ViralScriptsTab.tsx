"use client";
import { useState } from "react";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.5)";
const GOLD_20 = "rgba(176,142,80,0.2)";
const GOLD_10 = "rgba(176,142,80,0.1)";
const GREEN = "#3fb950";
const BLUE = "#58a6ff";
const RED = "#e05c5c";
const AMBER = "#f0883e";

interface Script {
  id: string;
  title: string;
  platform: string;
  format: string;
  vibe: "raw" | "mystery" | "proof" | "hook" | "ugc";
  why: string;
  script: string;
  doNot: string;
  tag: string;
}

const SCRIPTS: Script[] = [
  {
    id: "truck",
    title: "The Truck Video",
    platform: "IG Reel · TikTok · FB",
    format: "Vertical video · 45–90 sec · No filter · Phone camera",
    vibe: "raw",
    why: "This is the #1 viral format for men's movements. Raw, real, no production. The algorithm rewards authenticity. This video alone can bring 50–200 gate submissions.",
    script: `SETUP: Sit in your truck or car. Early morning. No ring light. No script in hand. Just talk.

WHAT TO SAY (your own words, this is a guide):

"I used to sit in my truck for 20 minutes before going inside.

Not because of traffic.

Because I didn't know who I'd be in there.

Husband? Father? Or just... nothing.

I had no brothers. No one who'd call me out. No one who'd show up at 2am.

I was performing strength while I was breaking.

So I built what I needed.

Mākoa. West Oahu. A brotherhood of men who actually show up.

We meet the first weekend of every month.
We train at 4am.
We hold each other accountable.
We don't perform.

May 1st is our founding weekend.
8 seats left.

If you're the man who needed this — the gate is open.

makoa.live"

END: Hold the camera on your face for 3 seconds. Don't smile. Just look.`,
    doNot: "Don't use music. Don't add text overlays. Don't edit it. One take if possible. The rawness IS the content.",
    tag: "🎥 FILM THIS WEEK",
  },
  {
    id: "mystery",
    title: "The Mystery Drop",
    platform: "IG · FB · TikTok · Telegram",
    format: "Text post or black image · No explanation",
    vibe: "mystery",
    why: "Curiosity is the most powerful hook on social media. When people don't understand something, they comment, share, and DM. Every comment is free reach. Reply to every single one.",
    script: `POST 1 (just this, nothing else):
👁

makoa.live

.

---

POST 2 (3 days later):
The gate is open.

Not for everyone.

makoa.live

---

POST 3 (after people start asking):
Someone asked me what Mākoa is.

I told them: you'll know when you're ready.

If you're asking — you're ready.

makoa.live/gate

---

REPLY TO EVERY COMMENT WITH:
"You'll know when you're ready."

Or just: "👁"

Never explain. Let the mystery do the work.`,
    doNot: "Don't explain it in the caption. Don't add hashtags to the mystery posts. Don't break the mystique by over-explaining in comments.",
    tag: "🔥 POST TODAY",
  },
  {
    id: "ugc-ask",
    title: "Get a Brother to Post About You",
    platform: "IG · FB · Any platform",
    format: "UGC — someone else's words about Mākoa",
    vibe: "ugc",
    why: "User-generated content converts 5x better than anything you post about yourself. One real man saying 'this changed my life' is worth 100 of your own posts. This is how movements spread.",
    script: `STEP 1 — DM a brother who's been through a gathering:

"Hey brother — would you be willing to post something real about what Mākoa has meant to you? 
3 sentences. Your words. I'll never tell you what to say.
If you're willing, just post it and tag me or drop makoa.live in the caption."

---

STEP 2 — Give them this template if they want it:

"I found Mākoa when I was [their situation].

I didn't know what I was looking for. I just knew I was carrying too much alone.

What I found was [their transformation].

If you're a man on Oahu who's been waiting for something real — makoa.live/gate"

---

STEP 3 — When they post, reshare it immediately with:

"This is why I built it.
[Brother's first name] said it better than I ever could.
makoa.live/gate — 8 seats left."

---

TARGET BROTHERS:
· The one who almost didn't come
· The one who cried at the gathering
· The one who brought a friend the next month
· The one who changed the most visibly`,
    doNot: "Don't write it for them. Don't ask them to use specific words. Authenticity is the whole point — if it sounds scripted, it won't work.",
    tag: "📲 DO THIS NOW",
  },
  {
    id: "confession",
    title: "The Confession Post",
    platform: "FB · IG caption",
    format: "Text only · Long form on FB · Short on IG",
    vibe: "raw",
    why: "Confession-style posts get shared by men who feel the same thing but can't say it themselves. They share it because it says what they can't. Every share is a warm referral.",
    script: `FACEBOOK VERSION (post as-is or adapt):

I'm going to say something most men won't.

I had no real friends.

Not the kind you call at 2am.
Not the kind who'd tell you when you're wrong.
Not the kind who'd show up when everything falls apart.

I had acquaintances. Coworkers. Guys I'd grab a beer with.

But no brothers.

And I didn't realize how much that was killing me until I built something to fix it.

Mākoa Brotherhood. West Oahu.

We meet the first weekend of every month.
We train at 4am.
We hold each other accountable.
We don't perform strength — we build it.

May 1st is our founding weekend.
8 seats remain.

If you're the man who's been carrying it alone — the gate is open.

makoa.live/gate

---

IG VERSION (shorter):

I had no real friends.

Not the kind you call at 2am.

I built Mākoa because I was that man.

West Oahu. May 1. 8 seats.

makoa.live/gate`,
    doNot: "Don't add hashtags to the FB version. Don't use emojis. The rawness of plain text is what makes it hit. On IG, max 3 hashtags at the end.",
    tag: "✍️ POST MONDAY 6AM",
  },
  {
    id: "stat-hook",
    title: "The Stat That Stops the Scroll",
    platform: "IG · TikTok · FB",
    format: "Text card or talking head · 15–30 sec",
    vibe: "hook",
    why: "Data posts get shared more than any other format. Men share this because it validates what they feel but can't articulate. The stat is the hook — Mākoa is the solution.",
    script: `TEXT CARD VERSION:
"1 in 10 men has zero close friends.

Not 'few friends.'

Zero.

Mākoa exists because this stat is unacceptable.

West Oahu. May 1. 8 seats.

makoa.live/gate"

---

TALKING HEAD VERSION (30 sec):
"Here's a stat that should scare you.

1 in 10 men — right now — has no close friends. Zero.

Not 'not many.' Zero.

Men are 3 to 4 times more likely to die by suicide than women.

And the number one reason isn't depression.

It's isolation.

I built Mākoa because I was that statistic.

West Oahu. May 1st. 8 seats.

makoa.live"

---

CAROUSEL VERSION (5 slides):
Slide 1: "The stats no one talks about."
Slide 2: "1 in 10 men has zero close friends."
Slide 3: "Men are 4x more likely to die by suicide."
Slide 4: "The average man hasn't made a new friend in 5 years."
Slide 5: "Mākoa exists because this is unacceptable. makoa.live/gate"`,
    doNot: "Don't cite sources in the post — it kills the emotional momentum. The stats are real and well-documented. Lead with feeling, not footnotes.",
    tag: "📊 HIGH SHARE POTENTIAL",
  },
  {
    id: "seat-countdown",
    title: "The Seat Countdown",
    platform: "IG · FB · Telegram · Stories",
    format: "Text post · Daily for final 7 days",
    vibe: "hook",
    why: "Scarcity is the most powerful conversion trigger. When people see a number going down, they act. Post this every day for the final week before gate close.",
    script: `DAY 7 (April 19):
7 days.
8 seats.
makoa.live/gate

---

DAY 6:
6 days.
7 seats.
makoa.live/gate

---

DAY 5:
5 days.
6 seats.

The man who's been watching this for weeks —
today is the day.

makoa.live/gate

---

DAY 4:
4 days.
5 seats.

Someone just claimed a seat 20 minutes ago.

makoa.live/gate

---

DAY 3:
3 days.
4 seats.

If you're waiting for a sign — this is it.

makoa.live/gate

---

DAY 2:
2 days.
3 seats.

The founding fire is being built.

makoa.live/gate

---

DAY 1 (April 25 — gate close):
Tonight.
Final seats.
Gate closes at midnight.

makoa.live/gate

After midnight: "The gate is closed. The brothers have been chosen."`,
    doNot: "Don't add anything else to these posts. The simplicity IS the power. No hashtags. No explanation. Just the countdown.",
    tag: "⏳ START APRIL 19",
  },
  {
    id: "manifesto",
    title: "The Founder Manifesto",
    platform: "FB · IG · Email",
    format: "Long-form text · Pin to top of all profiles",
    vibe: "raw",
    why: "Your founding story is your most powerful piece of content. It only needs to be written once. Pin it everywhere. It converts cold traffic better than any ad because it's real.",
    script: `I was the man sitting in his truck at 7pm not wanting to go inside.

Not because I didn't love my family.

Because I had nothing left to give.

No brotherhood. No accountability. No mirror.

Just performance.

I was performing strength while I was breaking.

2 years ago I started looking for what I needed.

I found retreats that cost $10,000.
I found therapy groups that made me feel broken.
I found men who talked about their feelings but never held each other accountable.

So I built what I needed.

Mākoa. Brotherhood. West Oahu.

We meet the first weekend of every month.
We swear brothers in under the full moon.
We train at 4am when no one is watching.
We build men who build families.

May 1–4 is our founding weekend.
8 seats remain.

If you're the man who needed this —
the man who's been carrying it alone —
the man who's been waiting for something real —

the gate is open.

makoa.live/gate

— Kris W., Steward 0001`,
    doNot: "Don't edit this to sound professional. Don't clean it up. The vulnerability is the point. If it makes you uncomfortable to post — that's how you know it's right.",
    tag: "📌 PIN THIS EVERYWHERE",
  },
  {
    id: "telegram-tease",
    title: "The Telegram Tease",
    platform: "IG · FB",
    format: "Text post · Drives to private channel",
    vibe: "mystery",
    why: "Telegram is where the real community lives. Every person you move from public social to Telegram is 10x more likely to convert. Tease what's inside without revealing it.",
    script: `POST 1:
The conversation we had in the Mākoa channel last night is why I built this.

I can't post what was said here.

It's too real.

If you want in → link in bio → Telegram

---

POST 2:
A brother posted something in our private channel at 2am last night.

By morning, 6 men had responded.

That's what brotherhood looks like.

Not a group chat. Not a Facebook group.

A channel of men who actually show up.

t.me/makaobros

---

POST 3:
I don't post everything here.

The real conversations — the ones that matter — happen in our private channel.

If you've been watching from the outside, this is your invitation.

t.me/makaobros`,
    doNot: "Don't reveal what's actually in the Telegram channel in the post. The mystery drives the click. Once they're in, the community sells itself.",
    tag: "💬 WEEKLY",
  },
  {
    id: "rank-reveal",
    title: "The Rank Reveal",
    platform: "IG · FB · Telegram",
    format: "Quote card or text post · After each gathering",
    vibe: "proof",
    why: "Social proof from real brothers is the most powerful conversion tool you have. When men see transformation, they want it. Always get permission. First name only.",
    script: `TEMPLATE (adapt for each brother):

"Tonight, [First Name] earned his [Rank] patch.

3 months ago he was [their starting point — e.g., 'working 60-hour weeks with no outlet'].

Tonight he's [transformation — e.g., 'leading his cluster and training 4 brothers'].

This is what accountability looks like in the flesh.

Nā Koa → Mana → Aliʻi.

The path is real.

makoa.live/gate — [X] seats for May."

---

EXAMPLE:

"Tonight, Marcus earned his Mana patch.

3 months ago he told me he hadn't had a real conversation with another man in 2 years.

Tonight he led the accountability circle.

This is what brotherhood does.

makoa.live/gate — 8 seats for May."

---

HOW TO GET THE STORY:
DM the brother after the gathering:
"What changed for you this month? Real answer. 3 sentences."
Use their words. Quote them directly.`,
    doNot: "Don't post without permission. Don't use full names. Don't make it sound like a testimonial ad — it should sound like a real moment being shared.",
    tag: "🏆 AFTER EACH GATHERING",
  },
];

const VIBE_COLOR: Record<Script["vibe"], string> = {
  raw: RED,
  mystery: GOLD,
  proof: GREEN,
  hook: BLUE,
  ugc: AMBER,
};

const VIBE_LABEL: Record<Script["vibe"], string> = {
  raw: "RAW",
  mystery: "MYSTERY",
  proof: "PROOF",
  hook: "HOOK",
  ugc: "UGC",
};

function CopyBtn({ text }: { text: string }) {
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
        padding: "8px 16px", borderRadius: 5, cursor: "pointer",
        fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
        transition: "all 0.2s",
      }}
    >
      {copied ? "✓ COPIED" : "COPY SCRIPT"}
    </button>
  );
}

export default function ViralScriptsTab() {
  const [selected, setSelected] = useState<string | null>("truck");
  const [vibeFilter, setVibeFilter] = useState<Script["vibe"] | "all">("all");

  const filtered = SCRIPTS.filter(s => vibeFilter === "all" || s.vibe === vibeFilter);
  const active = SCRIPTS.find(s => s.id === selected) || null;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <p style={{ color: GOLD_DIM, fontSize: "0.38rem", letterSpacing: "0.28em", marginBottom: 6 }}>
          VIRAL CONTENT SCRIPTS · READY TO USE
        </p>
        <div style={{
          background: "rgba(224,92,92,0.06)", border: "1px solid rgba(224,92,92,0.2)",
          borderRadius: 8, padding: "14px 16px", marginBottom: 16,
        }}>
          <p style={{ color: RED, fontSize: "0.42rem", letterSpacing: "0.12em", marginBottom: 8 }}>
            WHY YOUR CURRENT CONTENT LOOKS FAKE
          </p>
          <div style={{ display: "grid", gap: 6 }}>
            {[
              "Produced = fake. Raw = real. The algorithm knows the difference.",
              "You posting about yourself = ad. A brother posting about you = movement.",
              "Stock footage + voiceover = skip. Man in truck at 5am = watch.",
              "Hashtag spam = shadow ban. No hashtags + raw truth = viral.",
              "The mystery drop gets more DMs than any produced ad. Every time.",
            ].map((line, i) => (
              <div key={i} style={{ display: "flex", gap: 8 }}>
                <span style={{ color: RED, fontSize: "0.44rem", flexShrink: 0 }}>×</span>
                <p style={{ color: "rgba(232,224,208,0.6)", fontSize: "0.44rem", lineHeight: 1.5 }}>{line}</p>
              </div>
            ))}
          </div>
        </div>
        <div style={{
          background: "rgba(63,185,80,0.05)", border: "1px solid rgba(63,185,80,0.2)",
          borderRadius: 8, padding: "14px 16px",
        }}>
          <p style={{ color: GREEN, fontSize: "0.42rem", letterSpacing: "0.12em", marginBottom: 8 }}>
            WHAT ACTUALLY GOES VIRAL FOR MĀKOA
          </p>
          <div style={{ display: "grid", gap: 6 }}>
            {[
              "You in your truck, 5am, talking raw. No script. No filter. One take.",
              "A brother posting about you — not you posting about yourself.",
              "The mystery drop: just '👁' and 'makoa.live'. Nothing else.",
              "The confession post: 'I had no real friends.' Men share what they feel but can't say.",
              "The stat: '1 in 10 men has zero close friends.' Data gets shared.",
            ].map((line, i) => (
              <div key={i} style={{ display: "flex", gap: 8 }}>
                <span style={{ color: GREEN, fontSize: "0.44rem", flexShrink: 0 }}>✓</span>
                <p style={{ color: "rgba(232,224,208,0.6)", fontSize: "0.44rem", lineHeight: 1.5 }}>{line}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vibe filter */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        <button
          onClick={() => setVibeFilter("all")}
          style={{
            background: vibeFilter === "all" ? GOLD : "transparent",
            border: `1px solid ${vibeFilter === "all" ? GOLD : GOLD_20}`,
            color: vibeFilter === "all" ? "#000" : GOLD_DIM,
            fontSize: "0.36rem", letterSpacing: "0.12em", padding: "5px 10px",
            borderRadius: 4, cursor: "pointer", fontFamily: "'JetBrains Mono', monospace",
          }}
        >ALL</button>
        {(["raw", "mystery", "hook", "proof", "ugc"] as Script["vibe"][]).map(v => (
          <button
            key={v}
            onClick={() => setVibeFilter(v)}
            style={{
              background: vibeFilter === v ? VIBE_COLOR[v] : "transparent",
              border: `1px solid ${vibeFilter === v ? VIBE_COLOR[v] : "rgba(176,142,80,0.15)"}`,
              color: vibeFilter === v ? "#000" : "rgba(232,224,208,0.5)",
              fontSize: "0.36rem", letterSpacing: "0.12em", padding: "5px 10px",
              borderRadius: 4, cursor: "pointer", fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {VIBE_LABEL[v]}
          </button>
        ))}
      </div>

      {/* Script list + detail */}
      <div style={{ display: "grid", gap: 8, marginBottom: 20 }}>
        {filtered.map(s => (
          <div
            key={s.id}
            onClick={() => setSelected(selected === s.id ? null : s.id)}
            style={{
              background: selected === s.id ? GOLD_10 : "rgba(0,0,0,0.3)",
              border: `1px solid ${selected === s.id ? GOLD_20 : "rgba(176,142,80,0.1)"}`,
              borderRadius: 8, padding: "12px 16px", cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {/* Header row */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{
                background: VIBE_COLOR[s.vibe], color: "#000",
                fontSize: "0.32rem", letterSpacing: "0.12em", fontWeight: 700,
                padding: "2px 7px", borderRadius: 3, flexShrink: 0,
              }}>
                {VIBE_LABEL[s.vibe]}
              </span>
              <p style={{ color: "#e8e0d0", fontSize: "0.5rem", flex: 1 }}>{s.title}</p>
              <span style={{
                color: AMBER, fontSize: "0.34rem", letterSpacing: "0.08em",
                background: "rgba(240,136,62,0.1)", border: "1px solid rgba(240,136,62,0.2)",
                padding: "2px 8px", borderRadius: 3, flexShrink: 0,
              }}>
                {s.tag}
              </span>
            </div>

            {/* Platform */}
            <p style={{ color: "rgba(232,224,208,0.35)", fontSize: "0.38rem", marginTop: 4 }}>
              {s.platform} · {s.format}
            </p>

            {/* Expanded */}
            {selected === s.id && (
              <div style={{ marginTop: 16, borderTop: "1px solid rgba(176,142,80,0.1)", paddingTop: 16 }}>

                {/* Why it works */}
                <div style={{
                  background: "rgba(63,185,80,0.05)", border: "1px solid rgba(63,185,80,0.15)",
                  borderRadius: 6, padding: "12px 14px", marginBottom: 14,
                }}>
                  <p style={{ color: GREEN, fontSize: "0.34rem", letterSpacing: "0.15em", marginBottom: 6 }}>
                    WHY THIS WORKS
                  </p>
                  <p style={{ color: "rgba(232,224,208,0.65)", fontSize: "0.44rem", lineHeight: 1.7 }}>
                    {s.why}
                  </p>
                </div>

                {/* The script */}
                <div style={{
                  background: "rgba(0,0,0,0.4)", border: "1px solid rgba(176,142,80,0.15)",
                  borderRadius: 6, padding: "14px 16px", marginBottom: 14,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <p style={{ color: GOLD_DIM, fontSize: "0.34rem", letterSpacing: "0.18em" }}>
                      THE SCRIPT
                    </p>
                    <CopyBtn text={s.script} />
                  </div>
                  <p style={{
                    color: "rgba(232,224,208,0.8)", fontSize: "0.46rem", lineHeight: 1.85,
                    whiteSpace: "pre-line", fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: "italic",
                  }}>
                    {s.script}
                  </p>
                </div>

                {/* Do not */}
                <div style={{
                  background: "rgba(224,92,92,0.05)", border: "1px solid rgba(224,92,92,0.15)",
                  borderRadius: 6, padding: "12px 14px",
                }}>
                  <p style={{ color: RED, fontSize: "0.34rem", letterSpacing: "0.15em", marginBottom: 6 }}>
                    DO NOT
                  </p>
                  <p style={{ color: "rgba(232,224,208,0.55)", fontSize: "0.44rem", lineHeight: 1.7 }}>
                    {s.doNot}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* The 3 plays to run THIS WEEK */}
      <div style={{
        background: GOLD_10, border: `1px solid ${GOLD_20}`,
        borderRadius: 10, padding: "18px 16px",
      }}>
        <p style={{ color: GOLD, fontSize: "0.42rem", letterSpacing: "0.18em", marginBottom: 14 }}>
          THE 3 PLAYS TO RUN THIS WEEK
        </p>
        <div style={{ display: "grid", gap: 12 }}>
          {[
            {
              num: "1",
              title: "Film the Truck Video",
              sub: "Today or tomorrow. 5am. Your truck. One take. No filter. This is your first viral video.",
              color: RED,
            },
            {
              num: "2",
              title: "Post the Mystery Drop",
              sub: "Right now. Just '👁' and 'makoa.live'. Nothing else. Reply to every comment with 'you'll know when you're ready.'",
              color: GOLD,
            },
            {
              num: "3",
              title: "DM one brother to post about you",
              sub: "Pick the brother who changed the most. Ask him for 3 real sentences. His post will reach more people than yours ever will.",
              color: GREEN,
            },
          ].map(p => (
            <div key={p.num} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: `${p.color}15`, border: `1px solid ${p.color}40`,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <span style={{ color: p.color, fontSize: "0.7rem", fontWeight: 700 }}>{p.num}</span>
              </div>
              <div>
                <p style={{ color: "#e8e0d0", fontSize: "0.5rem", fontWeight: 600, marginBottom: 3 }}>{p.title}</p>
                <p style={{ color: "rgba(232,224,208,0.45)", fontSize: "0.42rem", lineHeight: 1.6 }}>{p.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
