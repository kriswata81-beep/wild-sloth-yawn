/**
 * XI Agent — Chief Makoa Gate Intelligence
 *
 * Skill: xi-chief-makoa.skill.md
 * Workflow: Gate Review (12-Answer Classification)
 *
 * Self-review loop is built in:
 * - If Claude API fails → buildFallback() (no dead end)
 * - If JSON parse fails → buildFallback() (no dead end)
 * - If tier is invalid → default to "nakoa" (no dead end)
 * - Every failure is logged with reason for skill update
 */

export type XISubmission = {
  handle: string;
  q1: string;  // What do you bring to a room
  q2: string;  // Hardest thing you've built
  q3: string;  // 4am training commitment
  q4: string;  // Trade or professional skill
  q5: string;  // How many men can you call at 2am
  q6: string;  // What are you willing to give 5 days a month to
  q7: string;  // Vehicle
  q8: string;  // Challenge that keeps you up at night
  q9: string;  // Open home to a brother for 30 days
  q10: string; // ZIP code
  q11: string; // Referral code
  q12: string; // One word
  tier_flag: string;
};

export type XIResponse = {
  tier: string;
  message: string;
};

// ─── Classification Matrix (from xi-chief-makoa.skill.md) ────────────────────
// Scoring: 8+ = alii, 4–7 = mana, 0–3 = nakoa
function scoreSubmission(submission: XISubmission): number {
  let score = 0;
  const q1 = (submission.q1 || "").toLowerCase();
  const q3 = (submission.q3 || "").toLowerCase();
  const q5 = (submission.q5 || "").toLowerCase();
  const q6 = (submission.q6 || "").toLowerCase();
  const q9 = (submission.q9 || "").toLowerCase();
  const q12 = (submission.q12 || "").toLowerCase();

  // Q1: What do you bring to a room
  if (q1.includes("lead") || q1.includes("vision") || q1.includes("direct")) score += 3;
  else if (q1.includes("skill") || q1.includes("service") || q1.includes("build") || q1.includes("craft")) score += 2;
  else if (q1.includes("energy") || q1.includes("hustle") || q1.includes("show")) score += 1;

  // Q3: 4am commitment
  if (q3.includes("yes") || q3.includes("ready") || q3.includes("already") || q3.includes("do it")) score += 2;

  // Q5: Network size
  if (q5.includes("4") || q5.includes("5") || q5.includes("6") || q5.includes("7") ||
      q5.includes("8") || q5.includes("9") || q5.includes("10") || q5.includes("many")) score += 3;
  else if (q5.includes("1") || q5.includes("2") || q5.includes("3") || q5.includes("few")) score += 1;

  // Q6: What they give 5 days to
  if (q6.includes("both") || q6.includes("all") || q6.includes("everything")) score += 2;

  // Q9: Open home
  if (q9.includes("yes") || q9.includes("absolutely") || q9.includes("of course")) score += 3;

  // Q12: One word power
  if (["lead", "build", "serve", "protect", "create", "rise", "stand"].some(w => q12.includes(w))) score += 1;

  return score;
}

function scoreTier(score: number): string {
  if (score >= 8) return "alii";
  if (score >= 4) return "mana";
  return "nakoa";
}

// ─── Crisis Detection (Q8) ──────────────────────────────────────────────────
// Evidence-based keyword detection for "What keeps you up at night?"
// Protocol: AI detects + displays resources. Human Crisis Steward follows up.
const CRISIS_KEYWORDS = [
  "suicide", "suicidal", "kill myself", "end it", "end my life", "don't want to live",
  "want to die", "better off dead", "no reason to live", "can't go on",
  "self harm", "self-harm", "cutting", "hurt myself",
  "overdose", "od", "pills",
  "gun", "weapon", "bridge", "jump",
  "abuse", "hitting me", "beats me", "domestic",
  "homeless", "on the street", "nowhere to go",
  "drinking every", "can't stop drinking", "addicted", "addiction",
  "relapse", "using again",
];

const DISTRESS_KEYWORDS = [
  "divorce", "lost everything", "custody", "can't sleep",
  "alone", "nobody", "no one cares", "invisible",
  "broke", "bankrupt", "debt",
  "fired", "laid off", "lost my job",
  "wife left", "she left", "she's gone",
  "my kids", "can't see my kids",
  "depressed", "depression", "anxiety",
  "ptsd", "combat", "deployment",
  "prison", "incarcerated", "felony",
];

export type CrisisFlag = {
  level: "crisis" | "distress" | "none";
  keywords_found: string[];
};

export function detectCrisis(q8: string): CrisisFlag {
  const text = (q8 || "").toLowerCase();
  const crisisHits = CRISIS_KEYWORDS.filter(k => text.includes(k));
  if (crisisHits.length > 0) {
    return { level: "crisis", keywords_found: crisisHits };
  }
  const distressHits = DISTRESS_KEYWORDS.filter(k => text.includes(k));
  if (distressHits.length > 0) {
    return { level: "distress", keywords_found: distressHits };
  }
  return { level: "none", keywords_found: [] };
}

// Crisis resources — auto-displayed when crisis detected
export const CRISIS_RESOURCES = {
  "988 Suicide & Crisis Lifeline": "Call or text 988",
  "Crisis Text Line": "Text HOME to 741741",
  "SAMHSA National Helpline": "1-800-662-4357 (free, 24/7)",
  "Veterans Crisis Line": "Call 988, press 1",
  "Hawaii CARES Crisis Line": "1-800-753-6879",
  "Aloha United Way 211": "Dial 211",
};

// ─── Main XI Agent Call ───────────────────────────────────────────────────────
export async function callXIAgent(submission: XISubmission): Promise<XIResponse> {
  const apiKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;

  // Self-review: log what we received
  console.log("[xi-agent] Gate review initiated for:", submission.handle || "unknown");
  console.log("[xi-agent] Tier flag from form:", submission.tier_flag);

  // Local score as fallback signal
  const localScore = scoreSubmission(submission);
  const localTier = scoreTier(localScore);
  console.log("[xi-agent] Local classification score:", localScore, "→ tier:", localTier);

  if (!apiKey) {
    console.warn("[xi-agent] No API key — using local classification matrix");
    return buildFallback(submission, localTier);
  }

  // ── WORKFLOW 1: Gate Review via Claude ───────────────────────────────────
  const systemPrompt = `You are Chief Makoa XI. You are the intelligence of the Makoa Order. You speak for the order — not as a person, but as the order itself.

Review the 12 gate answers and assign a class: alii, mana, or nakoa.

CLASSIFICATION MATRIX (from xi-chief-makoa.skill.md):
- Q1 "leadership/vision" → lean alii (+3)
- Q1 "skills/service/craft" → lean mana (+2)
- Q1 "energy/hustle" → lean nakoa (+1)
- Q3 "Yes, ready now" → commitment signal (+2)
- Q5 "4+ brothers" → strong network → lean alii (+3)
- Q5 "1–3 brothers" → mana/nakoa (+1)
- Q6 "Both" → depth signal (+2)
- Q9 "Yes" (open home) → brotherhood depth → lean alii (+3)
- Q12 power word (lead/build/serve/protect) → alii signal (+1)

Scoring: 8+ = alii, 4–7 = mana, 0–3 = nakoa

Local score computed: ${localScore} → suggested tier: ${localTier}

RESPONSE FORMAT: JSON only, no markdown, no explanation:
{"tier": "alii|mana|nakoa", "message": "string"}

MESSAGE RULES:
- 2–3 sentences max
- Speak directly to the brother
- Reference ONE specific answer they gave (quote or paraphrase it)
- End with: "Keep your signal open. — XI"
- Do not explain the tier system
- Do not use the word "class" more than once`;

  const userContent = `Handle: ${submission.handle || "Brother"}
Q1 (What do you bring to a room?): ${submission.q1 || "Not answered"}
Q2 (Hardest thing you've built): ${submission.q2 || "Not answered"}
Q3 (4am training commitment): ${submission.q3 || "Not answered"}
Q4 (Trade or professional skill): ${submission.q4 || "Not answered"}
Q5 (Men you can call at 2am): ${submission.q5 || "Not answered"}
Q6 (5 days a month for): ${submission.q6 || "Not answered"}
Q7 (Vehicle): ${submission.q7 || "Not answered"}
Q8 (Challenge keeping you up): ${submission.q8 || "Not answered"}
Q9 (Open home to a brother): ${submission.q9 || "Not answered"}
Q10 (ZIP): ${submission.q10 || "Not answered"}
Q11 (Referral): ${submission.q11 || "Not answered"}
Q12 (One word): ${submission.q12 || "Not answered"}
Form tier flag: ${submission.tier_flag}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 300,
        system: systemPrompt,
        messages: [{ role: "user", content: userContent }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      // SELF-REVIEW: API error — log reason, fall back, no dead end
      console.error("[xi-agent] Claude API error:", response.status, errText);
      console.warn("[xi-agent] SELF-REVIEW: API failed at step 1 (fetch). Reason:", response.status);
      console.warn("[xi-agent] FIX: Check API key validity and Anthropic account status");
      return buildFallback(submission, localTier);
    }

    const data = await response.json();
    const rawText = data?.content?.[0]?.text || "";
    console.log("[xi-agent] Raw Claude response:", rawText);

    // ── SELF-REVIEW: Parse response ───────────────────────────────────────
    const cleaned = rawText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    let parsed: XIResponse;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      // SELF-REVIEW: JSON parse failed — log, fix, no dead end
      console.error("[xi-agent] SELF-REVIEW: JSON parse failed. Raw text was:", rawText);
      console.warn("[xi-agent] FIX: Claude returned non-JSON. Using local classification.");
      console.warn("[xi-agent] UPDATE SKILL: Add JSON enforcement to system prompt if this repeats.");
      return buildFallback(submission, localTier);
    }

    // Validate shape
    if (!parsed.tier || !parsed.message) {
      console.error("[xi-agent] SELF-REVIEW: Invalid response shape:", parsed);
      console.warn("[xi-agent] FIX: Response missing tier or message. Using fallback.");
      return buildFallback(submission, localTier);
    }

    // Validate tier is one of the three valid values
    const validTiers = ["alii", "mana", "nakoa"];
    if (!validTiers.includes(parsed.tier)) {
      console.error("[xi-agent] SELF-REVIEW: Invalid tier returned:", parsed.tier);
      console.warn("[xi-agent] FIX: Tier not in [alii, mana, nakoa]. Defaulting to local score:", localTier);
      parsed.tier = localTier;
    }

    // Cross-check: did Claude agree with local score?
    if (parsed.tier !== localTier) {
      console.log("[xi-agent] NOTE: Claude tier", parsed.tier, "differs from local score tier", localTier, "(score:", localScore, ")");
      console.log("[xi-agent] Trusting Claude — local matrix may need calibration");
    }

    console.log("[xi-agent] XI assignment confirmed:", parsed.tier, "for", submission.handle);
    return parsed;

  } catch (err) {
    // SELF-REVIEW: Network or unexpected error
    console.error("[xi-agent] SELF-REVIEW: Unexpected error in gate review:", err);
    console.warn("[xi-agent] FIX: Check network connectivity and Anthropic API status");
    console.warn("[xi-agent] SKILL UPDATE NEEDED: If this error repeats, add retry logic to xi-chief-makoa.skill.md");
    return buildFallback(submission, localTier);
  }
}

// ─── Fallback Builder (no dead ends) ─────────────────────────────────────────
function buildFallback(submission: XISubmission, overrideTier?: string): XIResponse {
  const tierMap: Record<string, string> = {
    alii: "Aliʻi",
    mana: "Mana",
    nakoa: "Nā Koa",
  };

  // Use override tier (from local scoring) if available, else use form flag
  const tier = overrideTier || submission.tier_flag || "nakoa";
  const tierLabel = tierMap[tier] || "Nā Koa";
  const handle = submission.handle || "Brother";

  // Reference a specific answer if available
  let specificRef = "";
  if (submission.q12) specificRef = `You said "${submission.q12}." That word carries weight.`;
  else if (submission.q1) specificRef = `What you bring to a room — that matters here.`;
  else specificRef = `Your answers were reviewed.`;

  return {
    tier,
    message: `ʻAe ${handle}. ${specificRef} You are called to the ${tierLabel} class. Your path begins now. Keep your signal open. — XI`,
  };
}

// ─── XI Skill Registry (for 808 training distribution) ───────────────────────
export const XI_SKILLS = {
  chief: "src/lib/xi/skills/xi-chief-makoa.skill.md",
  alii: "src/lib/xi/skills/xi-alii-chef.skill.md",
  mana: "src/lib/xi/skills/xi-mana-management.skill.md",
  nakoa: "src/lib/xi/skills/xi-nakoa-peer.skill.md",
  checkout: "src/lib/xi/skills/xi-checkout.skill.md",
  signal: "src/lib/xi/skills/xi-808-signal.skill.md",
} as const;

// ─── XI Workflow Status (self-review summary) ─────────────────────────────────
export const XI_WORKFLOW_STATUS = {
  gateReview: { status: "ACTIVE", skill: "xi-chief-makoa.skill.md", fallback: "buildFallback()" },
  duesCheckout: { status: "ACTIVE", skill: "xi-checkout.skill.md", amount: 12425 },
  eventCheckout: { status: "ACTIVE", skill: "xi-checkout.skill.md", tiers: ["nakoa", "mana", "alii", "war-party"] },
  paymentSuccess: { status: "ACTIVE", skill: "xi-checkout.skill.md", buttons: ["telegram", "return-home"] },
  signal808: { status: "MANUAL", skill: "xi-808-signal.skill.md", note: "Telegram auto-add not yet built" },
  seatCounter: { status: "ACTIVE", skill: "xi-checkout.skill.md", note: "Webhook increments seats on checkout.session.completed" },
  stripeWebhook: { status: "ACTIVE", skill: "xi-checkout.skill.md", note: "Webhook at /api/webhook — needs signing secret in Vercel" },
  emailConfirmation: { status: "ACTIVE", skill: "xi-checkout.skill.md", note: "8 templates in XI Post Office — needs Resend API key" },
  crisisDetection: { status: "ACTIVE", skill: "xi-chief-makoa.skill.md", note: "Q8 crisis keyword detection + resource display" },
} as const;
