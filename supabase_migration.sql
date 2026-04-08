-- MAKOA BROTHERHOOD PLATFORM — Supabase Migration
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard → SQL Editor → New Query
-- This creates the gate_submissions table for the 12-question onboarding flow

CREATE TABLE IF NOT EXISTS gate_submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),

  -- Brother identity
  handle text NOT NULL,
  phone text,

  -- 12 Questions
  q1 text,   -- What do you bring to a room of men?
  q2 text,   -- What's the hardest thing you've built?
  q3 text,   -- Can you commit to 4am-6am, 5-6 days a month?
  q4 text,   -- Do you have a trade or professional skill?
  q5 text,   -- How many men can you call at 2am?
  q6 text,   -- What are you willing to give 5 days a month to?
  q7 text,   -- Do you have a vehicle?
  q8 text,   -- What challenge keeps you up at night?
  q9 text,   -- Would you open your home to a brother for 30 days?
  q10 text,  -- Where are you? (ZIP)
  q11 text,  -- Who sent you? (referral code)
  q12 text,  -- One word that describes why you're here

  -- Derived fields
  zip text,
  referral_code text,
  pledge_amount numeric DEFAULT 9.99,
  tier_flag text,       -- alii, mana, or nakoa (assigned by XI)
  xi_message text,      -- XI's personalized response

  -- Status tracking
  status text DEFAULT 'pledged',  -- pledged, accepted, committed, founding
  dues_paid boolean DEFAULT false,
  event_ticket text,    -- war_room, mastermind, day_pass, or null

  -- Timestamps
  accepted_at timestamptz,
  committed_at timestamptz
);

-- Enable Row Level Security
ALTER TABLE gate_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (from the gate page)
CREATE POLICY "Allow anonymous inserts" ON gate_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anonymous reads (for the confirm page to read back data)
CREATE POLICY "Allow anonymous reads" ON gate_submissions
  FOR SELECT
  TO anon
  USING (true);

-- Allow anonymous updates (for status changes)
CREATE POLICY "Allow anonymous updates" ON gate_submissions
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Index for fast lookups
CREATE INDEX idx_gate_submissions_handle ON gate_submissions(handle);
CREATE INDEX idx_gate_submissions_tier ON gate_submissions(tier_flag);
CREATE INDEX idx_gate_submissions_status ON gate_submissions(status);
CREATE INDEX idx_gate_submissions_zip ON gate_submissions(zip);
