// XI.Phone — Transcription Ready Handler
// Twilio callback: voicemail transcribed -> XI classifies -> Telegram alert

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const formData = await req.formData();
  const transcriptionText = formData.get('TranscriptionText') as string;
  const recordingUrl = formData.get('RecordingUrl') as string;
  const from = formData.get('From') as string;
  const to = formData.get('To') as string;
  const callSid = formData.get('CallSid') as string;

  const deviceRole = getDeviceRole(to);

  // Step 1: XI classifies the call using Claude Haiku
  const classification = await classifyCall(transcriptionText, from, deviceRole);

  // Step 2: Format Telegram message
  const telegramMessage = formatTelegramMessage({
    from,
    transcription: transcriptionText,
    classification,
    recordingUrl,
    deviceRole,
  });

  // Step 3: Send to Steward 0001 via Telegram
  await sendTelegram(telegramMessage);

  // Step 4: Update Supabase call record
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    await fetch(\`\${supabaseUrl}/rest/v1/xi_phone_calls?call_sid=eq.\${callSid}\`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': \`Bearer \${supabaseKey}\`,
      },
      body: JSON.stringify({
        transcription: transcriptionText,
        recording_url: recordingUrl,
        classification: classification.tier,
        urgency: classification.urgency,
        summary: classification.summary,
        action_required: classification.action,
        status: 'classified',
      }),
    });
  } catch (e) {
    console.error('Failed to update call record:', e);
  }

  return NextResponse.json({ status: 'processed' });
}

async function classifyCall(
  transcription: string,
  callerNumber: string,
  deviceRole: string
): Promise<{
  tier: 'alii' | 'mana' | 'nakoa' | 'unknown';
  urgency: 'critical' | 'high' | 'normal' | 'low';
  summary: string;
  action: string;
  category: string;
}> {
  const systemPrompt = \`You are XI, operational intelligence of the Makoa Brotherhood Order.
You classify incoming voicemail messages for Steward 0001.

CLASSIFICATION TIERS:
- alii: Brotherhood order affairs, leadership matters, territory operations, warchest, steward applications, emergency
- mana: B2B affairs, real estate (Pono Home), TP Hawaii/Pro business, ambassador operations, client/buyer communications
- nakoa: Community matters, general inquiries, personal calls, non-urgent

URGENCY LEVELS:
- critical: Emergency, legal threat, money at risk, time-sensitive deal (respond within 1 hour)
- high: Active deal, Brotherhood operation in progress, scheduled callback needed (respond today)
- normal: Standard business or community matter (respond within 24 hours)
- low: Informational, spam, can wait or ignore

DEVICE CONTEXT: This call came to the \${deviceRole === 'steward' ? 'Steward (ohana/Brotherhood)' : 'Ambassador (B2B)'} line.

Respond in JSON only:
{
  "tier": "alii|mana|nakoa|unknown",
  "urgency": "critical|high|normal|low",
  "summary": "2-3 sentence summary",
  "action": "specific next step recommendation",
  "category": "brief category label"
}\`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: \`Classify this voicemail:\n\nFrom: \${callerNumber}\nDevice: xi.\${deviceRole === 'steward' ? 'fire' : 'water'}\nTranscription: "\${transcription}"\`,
          },
        ],
      }),
    });

    const data = await response.json();
    const text = data.content?.[0]?.text || '{}';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error('XI classification failed:', e);
  }

  return {
    tier: 'unknown',
    urgency: 'normal',
    summary: \`Voicemail from \${callerNumber}. Classification failed — review manually.\`,
    action: 'Listen to recording and classify manually.',
    category: 'Unclassified',
  };
}

function formatTelegramMessage(data: {
  from: string;
  transcription: string;
  classification: any;
  recordingUrl: string;
  deviceRole: string;
}): string {
  const tierEmoji: Record<string, string> = {
    alii: '👑',
    mana: '💼',
    nakoa: '🤝',
    unknown: '❓',
  };
  const urgencyEmoji: Record<string, string> = {
    critical: '🔴',
    high: '🟠',
    normal: '🟢',
    low: '⚪',
  };

  const deviceName = data.deviceRole === 'steward' ? 'xi.fire' : 'xi.water';
  const tier = data.classification.tier || 'unknown';
  const urgency = data.classification.urgency || 'normal';

  return \`📞 XI.PHONE ALERT — \${deviceName.toUpperCase()}

\${tierEmoji[tier]} Tier: \${tier.toUpperCase()}
\${urgencyEmoji[urgency]} Urgency: \${urgency.toUpperCase()}
📋 Category: \${data.classification.category}

👤 From: \${data.from}
📝 Summary: \${data.classification.summary}

⚡ Action: \${data.classification.action}

🎙️ Recording: \${data.recordingUrl}

---
Transcription: "\${data.transcription}"\`;
}

async function sendTelegram(message: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN!;
  const chatId = process.env.TELEGRAM_STEWARD_CHAT_ID || '7954185672';

  await fetch(\`https://api.telegram.org/bot\${botToken}/sendMessage\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
    }),
  });
}

function getDeviceRole(toNumber: string): 'steward' | 'ambassador' {
  const fireNumber = process.env.XI_FIRE_NUMBER || '';
  if (toNumber === fireNumber) return 'steward';
  return 'ambassador';
}
