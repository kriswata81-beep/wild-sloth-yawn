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

export async function callXIAgent(submission: XISubmission): Promise<XIResponse> {
  const apiKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.warn("[xi-agent] No API key set — returning fallback tier assignment");
    return buildFallback(submission);
  }

  const systemPrompt = `You are Chief Makoa XI. You are the intelligence of the Makoa Order. You speak for the order — not as a person, but as the order itself. Review the 12 gate answers and assign a class: Alii, Mana, or Na Koa. 

Assignment logic:
- Q1 "Leadership and vision" → lean Alii
- Q1 "Skills and service" → lean Mana  
- Q1 "Energy and hustle" → lean Na Koa
- Q3 "Yes I'm ready" + Q6 "Both" → stronger commitment signal
- Q9 "Yes" → brotherhood depth signal
- Q5 "4+" → strong network signal → lean Alii

Respond with JSON only, no markdown, no explanation:
{"tier": string, "message": string}

The message should be 2-3 sentences max. Speak directly to the brother. Reference one specific answer they gave. End with: "Keep your signal open. — XI"`;

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
Initial tier flag: ${submission.tier_flag}`;

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
      console.error("[xi-agent] Claude API error:", response.status, errText);
      return buildFallback(submission);
    }

    const data = await response.json();
    const rawText = data?.content?.[0]?.text || "";
    console.log("[xi-agent] Raw Claude response:", rawText);

    const cleaned = rawText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed: XIResponse = JSON.parse(cleaned);

    if (!parsed.tier || !parsed.message) throw new Error("Invalid XI response shape");

    console.log("[xi-agent] XI assignment:", parsed);
    return parsed;
  } catch (err) {
    console.error("[xi-agent] Failed to parse XI response:", err);
    return buildFallback(submission);
  }
}

function buildFallback(submission: XISubmission): XIResponse {
  const tierMap: Record<string, string> = {
    alii: "Aliʻi",
    mana: "Mana",
    nakoa: "Nā Koa",
  };
  const tierLabel = tierMap[submission.tier_flag] || "Nā Koa";
  const handle = submission.handle || "Brother";
  return {
    tier: submission.tier_flag || "nakoa",
    message: `ʻAe ${handle}. XI has reviewed your 12 answers. You are called to the ${tierLabel} class. Your portal opens in 24 hours. Keep your signal open. — XI`,
  };
}
