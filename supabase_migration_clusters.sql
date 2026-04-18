-- ============================================================
-- MĀKOA ORDER — 7G Net Cluster System Schema
-- Run AFTER supabase_migration_808_network.sql and supabase_migration_houses.sql
-- ============================================================

-- ── 1. steward_applications ──────────────────────────────────
-- Every person who writes an essay to hold a zip cluster.
-- XI scores each essay. Top applicants get approved as Primary Steward + 2 Co-Stewards.

CREATE TABLE IF NOT EXISTS steward_applications (
  id                uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  zip_cluster       text NOT NULL,
  handle            text NOT NULL,
  essay             text NOT NULL,
  word_count        int NOT NULL,
  -- XI scoring
  xi_score          int DEFAULT 0,         -- 0-100
  xi_tier           text,                  -- nakoa | mana | alii
  xi_signals        text[],               -- signal tags from essay analysis
  xi_recommendation text,                 -- XI's recommendation string
  -- Seat assignment
  status            text DEFAULT 'pending', -- pending | approved | co-steward | waitlist | denied
  seat_type         text,                  -- primary | co_steward_1 | co_steward_2
  approved_by       text,                  -- 'xi_auto' | 'steward_0001'
  approved_at       timestamptz,
  -- Contact (optional, provided after approval)
  contact_phone     text,
  contact_email     text,
  -- Timestamps
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_steward_apps_zip ON steward_applications(zip_cluster);
CREATE INDEX IF NOT EXISTS idx_steward_apps_score ON steward_applications(xi_score DESC);
CREATE INDEX IF NOT EXISTS idx_steward_apps_status ON steward_applications(status);

-- ── 2. cluster_stewards ──────────────────────────────────────
-- The active Steward roster. 1,000 max worldwide. 1 primary + 2 co per zip.

CREATE TABLE IF NOT EXISTS cluster_stewards (
  id                uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  zip_cluster       text NOT NULL,
  handle            text NOT NULL,
  seat_type         text NOT NULL,       -- primary | co_steward_1 | co_steward_2
  application_id    uuid REFERENCES steward_applications(id),
  steward_id        uuid REFERENCES makoa_stewards(id),
  -- Status
  status            text DEFAULT 'active', -- active | suspended | resigned
  activated_at      timestamptz DEFAULT now(),
  -- War Room
  warchest_amount   numeric(10,2) DEFAULT 0,
  war_room_count    int DEFAULT 0,
  -- Cluster metrics
  brothers_count    int DEFAULT 0,
  businesses_claimed int DEFAULT 0,
  jobs_dispatched   int DEFAULT 0,
  monthly_revenue   numeric(10,2) DEFAULT 0,
  -- Timestamps
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_one_primary_per_zip
  ON cluster_stewards(zip_cluster) WHERE seat_type = 'primary' AND status = 'active';

-- ── 3. cluster_news (411 Channel) ────────────────────────────
-- Hyper-local good news only. XI scrapes + Steward submits.
-- No national news. No negativity. Brotherhood wins only.

CREATE TABLE IF NOT EXISTS cluster_news (
  id                uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  zip_cluster       text NOT NULL,
  -- Content
  headline          text NOT NULL,
  body              text,
  source_url        text,
  source_name       text,               -- e.g. "XI Scraper" | "Steward Report" | "Brother submission"
  -- Category
  category          text DEFAULT 'community', -- community | brotherhood | trade | milestone | event
  -- Visibility
  is_approved       boolean DEFAULT false,   -- Steward approves before publish
  approved_by       text,
  -- Expiry (news ages out)
  published_at      timestamptz,
  expires_at        timestamptz GENERATED ALWAYS AS (published_at + interval '7 days') STORED,
  -- Timestamps
  created_at        timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_news_zip ON cluster_news(zip_cluster);
CREATE INDEX IF NOT EXISTS idx_news_published ON cluster_news(published_at DESC);

-- ── 4. cluster_checkins ──────────────────────────────────────
-- Daily check-in tracking. Brotherhood presence = accountability.

CREATE TABLE IF NOT EXISTS cluster_checkins (
  id                uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  zip_cluster       text NOT NULL,
  brother_handle    text NOT NULL,
  gate_id           uuid REFERENCES gate_submissions(id),
  -- Check-in data
  checked_in_at     timestamptz DEFAULT now(),
  check_in_date     date DEFAULT CURRENT_DATE,
  streak_days       int DEFAULT 1,
  -- Location (optional, for P2P meet detection)
  lat               numeric(9,6),
  lng               numeric(9,6),
  UNIQUE(brother_handle, check_in_date)
);

CREATE INDEX IF NOT EXISTS idx_checkins_zip ON cluster_checkins(zip_cluster);
CREATE INDEX IF NOT EXISTS idx_checkins_date ON cluster_checkins(check_in_date DESC);

-- ── 5. cluster_911 ───────────────────────────────────────────
-- Emergency channel. Brotherhood coordination only — not a substitute for 911.
-- Steward notified via Telegram instantly.

CREATE TABLE IF NOT EXISTS cluster_911 (
  id                uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  zip_cluster       text NOT NULL,
  -- Requester
  brother_handle    text,
  gate_id           uuid REFERENCES gate_submissions(id),
  -- Alert
  emergency_type    text NOT NULL,   -- medical | safety | resource | mental_health | housing
  message           text NOT NULL,
  severity          text DEFAULT 'medium', -- low | medium | high | critical
  -- Response
  steward_notified  boolean DEFAULT false,
  steward_response  text,
  resolved          boolean DEFAULT false,
  resolved_at       timestamptz,
  -- Timestamps
  created_at        timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_911_zip ON cluster_911(zip_cluster);
CREATE INDEX IF NOT EXISTS idx_911_resolved ON cluster_911(resolved) WHERE resolved = false;

-- ── 6. cluster_businesses ────────────────────────────────────
-- Extends makoa_businesses with claim tracking per cluster.
-- Steward activates claimed businesses in their zip.

ALTER TABLE makoa_businesses
  ADD COLUMN IF NOT EXISTS claimed_by_handle   text,
  ADD COLUMN IF NOT EXISTS claimed_by_phone    text,
  ADD COLUMN IF NOT EXISTS claim_submitted_at  timestamptz,
  ADD COLUMN IF NOT EXISTS claim_verified      boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS claim_verified_by   text,
  ADD COLUMN IF NOT EXISTS claim_verified_at   timestamptz,
  ADD COLUMN IF NOT EXISTS cluster_featured    boolean DEFAULT false;

-- ── 7. cluster_warchest ──────────────────────────────────────
-- Regional war chest — pooled resources by the cluster's Aliʻi.
-- Custom to each region. Steward manages disbursement.

CREATE TABLE IF NOT EXISTS cluster_warchest (
  id                uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  zip_cluster       text NOT NULL,
  -- Entry
  contributor_handle text NOT NULL,
  contributor_tier  text,              -- nakoa | mana | alii
  amount            numeric(10,2) NOT NULL,
  currency          text DEFAULT 'USD',
  purpose           text,             -- e.g. "MAYDAY travel fund" | "house deposit" | "tool library"
  -- Status
  status            text DEFAULT 'pledged', -- pledged | received | disbursed
  disbursed_to      text,
  disbursed_at      timestamptz,
  -- Reference
  stripe_payment_id text,
  notes             text,
  -- Timestamps
  created_at        timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_warchest_zip ON cluster_warchest(zip_cluster);

-- ── 8. Seed founding cluster steward ─────────────────────────
-- Steward 0001 as primary for West Oahu (96792)

INSERT INTO steward_applications (
  zip_cluster, handle, essay, word_count, xi_score, xi_tier,
  xi_recommendation, status, seat_type, approved_by, approved_at
) VALUES (
  '96792', 'Kris W. · Steward 0001',
  'West Oahu is my territory. I was born here. I work here. I will build the founding house here. The 7G Net starts in zip 96792 because this is where the need is greatest and where the brotherhood is strongest. My plan for the first 90 days: activate 10 brothers, dispatch 20 jobs through the route, host the founding War Room, and seal the charter stone. This is not a hobby. This is the mission. I hold the cluster because no one else will hold it the way it deserves to be held.',
  99, 100, 'alii',
  'RECOMMEND: Primary Steward seat',
  'approved', 'primary', 'steward_0001', '2026-05-01T00:00:00Z'
) ON CONFLICT DO NOTHING;

-- ── 9. Seed sample 411 news for West Oahu ────────────────────

INSERT INTO cluster_news (zip_cluster, headline, body, source_name, category, is_approved, approved_by, published_at)
VALUES
  ('96792', 'Founding house stone placed — House 0001 is sealed',
   'The West Oahu founding house charter is sealed. Stone number HOUSE-0001 placed on May 1, 2026. First house in the worldwide Mākoa Order.',
   'Steward Report', 'milestone', true, 'steward_0001', now() - interval '1 day'),
  ('96792', '3 brothers completed Nakoa Trade Academy this week',
   'Three Nā Koa from the 96792 cluster graduated the 9-2 Trade Academy session. Active routes are now live. First jobs dispatched.',
   'XI Scraper', 'brotherhood', true, 'xi_auto', now() - interval '2 days'),
  ('96792', 'Kaala Lush Services: 6 yard + plant jobs dispatched this month',
   '80% stays in the zip. The brotherhood economy is working. Total route revenue to brothers: $2,400 this month.',
   'Steward Report', 'trade', true, 'steward_0001', now() - interval '3 days')
ON CONFLICT DO NOTHING;

-- ── 10. RLS Policies ─────────────────────────────────────────

ALTER TABLE steward_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can apply to be steward" ON steward_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Public reads approved stewards" ON steward_applications FOR SELECT USING (status IN ('approved', 'co-steward'));
CREATE POLICY "Service role manages steward apps" ON steward_applications FOR ALL USING (auth.role() = 'service_role');

ALTER TABLE cluster_stewards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads active stewards" ON cluster_stewards FOR SELECT USING (status = 'active');
CREATE POLICY "Service role manages stewards" ON cluster_stewards FOR ALL USING (auth.role() = 'service_role');

ALTER TABLE cluster_news ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads approved news" ON cluster_news FOR SELECT USING (is_approved = true);
CREATE POLICY "Anyone can submit news" ON cluster_news FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role manages news" ON cluster_news FOR ALL USING (auth.role() = 'service_role');

ALTER TABLE cluster_checkins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can check in" ON cluster_checkins FOR INSERT WITH CHECK (true);
CREATE POLICY "Public reads checkin counts" ON cluster_checkins FOR SELECT USING (true);
CREATE POLICY "Service role manages checkins" ON cluster_checkins FOR ALL USING (auth.role() = 'service_role');

ALTER TABLE cluster_911 ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit 911 alert" ON cluster_911 FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role manages 911" ON cluster_911 FOR ALL USING (auth.role() = 'service_role');

ALTER TABLE cluster_warchest ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can pledge to warchest" ON cluster_warchest FOR INSERT WITH CHECK (true);
CREATE POLICY "Public reads warchest totals" ON cluster_warchest FOR SELECT USING (true);
CREATE POLICY "Service role manages warchest" ON cluster_warchest FOR ALL USING (auth.role() = 'service_role');
