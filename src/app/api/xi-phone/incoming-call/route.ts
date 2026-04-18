// XI.Phone â Incoming Call Handler
// Twilio webhook: ALL incoming calls go to voicemail with XI greeting

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const formData = await req.formData();
  const from = formData.get('From') as string;
  const to = formData.get('To') as string;
  const callerName = formData.get('CallerName') as string || 'Unknown';
  const deviceRole = getDeviceRole(to);

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice" language="en-US">
    ${deviceRole === 'steward'
      ? 'Aloha. You have reached the Makoa Brotherhood steward line. Please leave your message after the tone. XI will review and respond.'
      : 'Aloha. You have reached the Makoa Ambassador line for business inquiries. Please leave your message after the tone. XI will review and respond.'
    }
  </Say>
  <Record
    maxLength="120"
    action="/api/xi-phone/voicemail-callback"
    transcribe="true"
    transcribeCallback="/api/xi-phone/transcription-ready"
    playBeep="true"
  />
  <Say voice="alice">Mahalo. Your message has been received.</Say>
</Response>`;

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    await fetch(`${supabaseUrl}/rest/v1/xi_phone_calls`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({
        from_number: from,
        to_number: to,
        caller_name: callerName,
        device_role: deviceRole,
        status: 'voicemail_recording',
        created_at: new Date().toISOString(),
      }),
    });
  } catch (e) {
    console.error('Failed to log call:', e);
  }

  return new NextResponse(twiml, {
    headers: { 'Content-Type': 'text/xml' },
  });
}

function getDeviceRole(toNumber: string): 'steward' | 'ambassador' {
  const fireNumber = process.env.XI_FIRE_NUMBER || '';
  const waterNumber = process.env.XI_WATER_NUMBER || '';
  if (toNumber === fireNumber) return 'steward';
  if (toNumber === waterNumber) return 'ambassador';
  return 'steward';
}
