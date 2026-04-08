-- MAKOA FIX — Drop old table and recreate with all columns
-- Safe to run pre-launch (no real brother data yet)

DROP TABLE IF EXISTS gate_submissions;

CREATE TABLE gate_submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),

  handle text NOT NULL,
  phone text,

  q1 text,
  q2 text,
  q3 text,
  q4 text,
  q5 text,
  q6 text,
  q7 text,
  q8 text,
  q9 text,
  q10 text,
  q11 text,
  q12 text,

  zip text,
  referral_code text,
  pledge_amount numeric DEFAULT 9.99,
  tier_flag text,
  xi_message text,

  status text DEFAULT 'pledged',
  dues_paid boolean DEFAULT false,
  event_ticket text,

  accepted_at timestamptz,
  committed_at timestamptz
);

ALTER TABLE gate_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_insert" ON gate_submissions FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_select" ON gate_submissions FOR SELECT TO anon USING (true);
CREATE POLICY "anon_update" ON gate_submissions FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE INDEX idx_gs_handle ON gate_submissions(handle);
CREATE INDEX idx_gs_tier ON gate_submissions(tier_flag);
CREATE INDEX idx_gs_status ON gate_submissions(status);
CREATE INDEX idx_gs_zip ON gate_submissions(zip);
