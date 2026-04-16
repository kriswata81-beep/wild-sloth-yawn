-- MĀKOA BROTHERHOOD PLATFORM — inbound_messages migration
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard → SQL Editor → New Query
-- This creates the inbound_messages table for the Twilio SMS bridge.
-- Steward gets a public phone number; XI screens inbound, auto-replies, escalates to Telegram on crisis.
-- Safe to run multiple times — uses IF NOT EXISTS.

CREATE TABLE IF NOT EXISTS inbound_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),

  -- Twilio identity
  twilio_message_sid text UNIQUE,         -- the SMxxx ID Twilio assigns
  from_number text NOT NULL,              -- E.164 format, e.g. +18085551234
  to_number text,                         -- the Mākoa Twilio number that received it
  body text NOT NULL,
  num_media int DEFAULT 0,
  media_urls text[] DEFAULT '{}',

  -- XI screening output
  intent text NOT NULL DEFAULT 'unscreened',
  -- Intents: gate_inquiry | sponsor_inquiry | crisis | spam | needs_human | other | unscreened
  severity text NOT NULL DEFAULT 'normal',
  -- normal | crisis (for crisis-detection prioritization)
  classification_confidence float,        -- 0..1
  classification_reason text,             -- one-sentence XI reasoning

  -- Auto-response tracking
  auto_replied boolean DEFAULT false,
  auto_reply_body text,
  auto_reply_sent_at timestamptz,

  -- Steward triage
  handled_by text,                        -- 'xi_auto' | 'steward' | 'unhandled'
  handled_at timestamptz,
  steward_reply_body text,                -- if Steward replied via /steward UI
  steward_reply_sent_at timestamptz,

  -- Crisis escalation
  telegram_paged boolean DEFAULT false,
  telegram_paged_at timestamptz,

  CONSTRAINT inbound_messages_intent_check CHECK (intent IN (
    'gate_inquiry','sponsor_inquiry','crisis','spam','needs_human','other','unscreened'
  )),
  CONSTRAINT inbound_messages_severity_check CHECK (severity IN ('normal','crisis'))
);

-- Indexes
CREATE INDEX IF NOT EXISTS inbound_messages_recent_idx
  ON inbound_messages (created_at DESC);

CREATE INDEX IF NOT EXISTS inbound_messages_unhandled_idx
  ON inbound_messages (handled_by, severity, created_at DESC)
  WHERE handled_by IS NULL OR handled_by = 'unhandled';

CREATE INDEX IF NOT EXISTS inbound_messages_crisis_idx
  ON inbound_messages (severity, created_at DESC)
  WHERE severity = 'crisis';

-- Row Level Security — match existing pattern (sessionStorage-gated /steward UI uses anon)
ALTER TABLE inbound_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon read inbound_messages" ON inbound_messages;
CREATE POLICY "anon read inbound_messages" ON inbound_messages
  FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "anon update inbound_messages" ON inbound_messages;
CREATE POLICY "anon update inbound_messages" ON inbound_messages
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Service role bypass — used by /api/sms/inbound (Twilio webhook handler)

-- Verification:
-- SELECT id, from_number, intent, severity, handled_by, created_at
-- FROM inbound_messages ORDER BY created_at DESC LIMIT 5;
