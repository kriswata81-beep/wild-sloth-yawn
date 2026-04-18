// XI.Phone — Voicemail Callback
// Twilio calls this after recording completes

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const formData = await req.formData();
  const callSid = formData.get('CallSid') as string;
  const recordingUrl = formData.get('RecordingUrl') as string;

  // Update call record with recording URL
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
        recording_url: recordingUrl,
        status: 'transcribing',
      }),
    });
  } catch (e) {
    console.error('Failed to update recording:', e);
  }

  return new NextResponse(
    '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
    { headers: { 'Content-Type': 'text/xml' } }
  );
}
