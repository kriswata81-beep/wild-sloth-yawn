export type XISubmission = {
  handle: string;
  q1: string;
  q2: string;
  zip: string;
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

  const systemPrompt = `You are Chief Makoa XI. You are the intelligence of the Makoa Order. You speak for the order not as a person. Review the submission and assign Alii Mana or Na Koa class based on answers. Q1 Leadership = Alii. Q1 Skills = Mana. Q1 Energy = Na Koa. Respond with JSON only, no markdown, no explanation: {"tier": string, "message": string}. The message should be: Ae [handle]. XI has reviewed your submission. You are called to the [Tier] class. Your portal opens in 24 hours. Keep your signal open. — XI`;

  const userContent = `Handle: ${submission.handle || "Brother"}
Q1 (What do you bring to a room?): ${submission.q1 || "Not answered"}
Q2 (What challenge are you facing?): ${submission.q2 || "Not answered"}
ZIP: ${submission.zip || "Not provided"}
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
        max_tokens: 256,
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

    // Strip markdown code fences if present
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
    message: `ʻAe ${handle}. XI has reviewed your submission. You are called to the ${tierLabel} class. Your portal opens in 24 hours. Keep your signal open. — XI`,
  };
}
