-- ============================================================
-- MĀKOA ORDER — 7G Net Cluster System Schema
-- Self-contained — no external table dependencies.
-- Safe to run on a fresh Supabase project.
-- ============================================================

-- ── 1. steward_applications ──────────────────────────────────
CREATE TABLE IF NOT EXISTS steward_applications (
  id                uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  zip_cluster       text NOT NULL,
  handle            text NOT NULL,
  essay             text NOT NULL,
  word_count        int NOT NULL,
  xi_score          int DEFAULT 0,
  xi_tier           text,
  xi_signals        text[],
  xi_recommendation text,
  status            text DEFAULT 'pending',
  seat_type         text,
  approved_by       text,
  approved_at       timestamptz,
  contact_phone     text,
  contact_email     text,
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_steward_apps_zip    ON steward_applications(zip_cluster);
CREATE INDEX IF NOT EXISTS idx_steward_apps_score  ON steward_applications(xi_score DESC);
CREATE INDEX IF NOT EXISTS idx_steward_apps_status ON steward_applications(status);

-- ── 2. cluster_stewards ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS cluster_stewards (
  id                uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  zip_cluster       text NOT NULL,
  handle            text NOT NULL,
  seat_type         text NOT NULL,
  application_id    uuid REFERENCES steward_applications(id),
  steward_id        uuid,           -- soft ref to makoa_stewards — no FK
  status            text DEFAULT 'active',
  activated_at      timestamptz DEFAULT now(),
  warchest_amount   numeric(10,2) DEFAULT 0,
  war_room_count    int DEFAULT 0,
  brothers_count    int DEFAULT 0,
  businesses_claimed int DEFAULT 0,
  jobs_dispatched   int DEFAULT 0,
  monthly_revenue   numeric(10,2) DEFAULT 0,
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_one_primary_per_zip
  ON cluster_stewards(zip_cluster) WHERE seat_type = 'primary' AND status = 'active';

-- ── 3. cluster_news (411 Channel) ────────────────────────────
CREATE TABLE IF NOT EXISTS cluster_news (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  zip_cluster  text NOT NULL,
  headline     text NOT NULL,
  body         text,
  source_url   text,
  source_name  text,
  category     text DEFAULT 'community',
  is_approved  boolean DEFAULT false,
  approved_by  text,
  published_at timestamptz,
  expires_at   timestamptz,
  created_at   timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_news_zip       ON cluster_news(zip_cluster);
CREATE INDEX IF NOT EXISTS idx_news_published ON cluster_news(published_at DESC);

-- ── 4. cluster_checkins ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS cluster_checkins (
  id             uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  zip_cluster    text NOT NULL,
  brother_handle text NOT NULL,
  gate_id        uuid,           -- soft ref to gate_submissions — no FK
  checked_in_at  timestamptz DEFAULT now(),
  check_in_date  date DEFAULT CURRENT_DATE,
  streak_days    int DEFAULT 1,
  lat            numeric(9,6),
  lng            numeric(9,6),
  UNIQUE(brother_handle, check_in_date)
);

CREATE INDEX IF NOT EXISTS idx_checkins_zip  ON cluster_checkins(zip_cluster);
CREATE INDEX IF NOT EXISTS idx_checkins_date ON cluster_checkins(check_in_date DESC);

-- ── 5. cluster_911 ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cluster_911 (
  id               uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  zip_cluster      text NOT NULL,
  brother_handle   text,
  gate_id          uuid,           -- soft ref to gate_submissions — no FK
  emergency_type   text NOT NULL,
  message          text NOT NULL,
  severity         text DEFAULT 'medium',
  steward_notified boolean DEFAULT false,
  steward_response text,
  resolved         boolean DEFAULT false,
  resolved_at      timestamptz,
  created_at       timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_911_zip      ON cluster_911(zip_cluster);
CREATE INDEX IF NOT EXISTS idx_911_resolved ON cluster_911(resolved) WHERE resolved = false;

-- ── 6. cluster_businesses (extend makoa_businesses if it exists) ──
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'makoa_businesses') THEN
    ALTER TABLE makoa_businesses
      ADD COLUMN IF NOT EXISTS claimed_by_handle  text,
      ADD COLUMN IF NOT EXISTS claimed_by_phone   text,
      ADD COLUMN IF NOT EXISTS claim_submitted_at timestamptz,
      ADD COLUMN IF NOT EXISTS claim_verified     boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS claim_verified_by  text,
      ADD COLUMN IF NOT EXISTS claim_verified_at  timestamptz,
      ADD COLUMN IF NOT EXISTS cluster_featured   boolean DEFAULT false;
  END IF;
END $$;

-- ── 7. cluster_warchest ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS cluster_warchest (
  id                 uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  zip_cluster        text NOT NULL,
  contributor_handle text NOT NULL,
  contributor_tier   text,
  amount             numeric(10,2) NOT NULL,
  currency           text DEFAULT 'USD',
  purpose            text,
  status             text DEFAULT 'pledged',
  disbursed_to       text,
  disbursed_at       timestamptz,
  stripe_payment_id  text,
  notes              text,
  created_at         timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_warchest_zip ON cluster_warchest(zip_cluster);

-- ── 8. Seed founding cluster steward ─────────────────────────
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
INSERT INTO cluster_news (zip_cluster, headline, body, source_name, category, is_approved, approved_by, published_at, expires_at)
VALUES
  ('96792', 'Founding house stone placed — House 0001 is sealed',
   'The West Oahu founding house charter is sealed. Stone number HOUSE-0001 placed on May 1, 2026. First house in the worldwide Mākoa Order.',
   'Steward Report', 'milestone', true, 'steward_0001', now() - interval '1 day', now() + interval '6 days'),
  ('96792', '3 brothers completed Nakoa Trade Academy this week',
   'Three Nā Koa from the 96792 cluster graduated the 9-2 Trade Academy session. Active routes are now live. First jobs dispatched.',
   'XI Scraper', 'brotherhood', true, 'xi_auto', now() - interval '2 days', now() + interval '5 days'),
  ('96792', 'Kaala Lush Services: 6 yard + plant jobs dispatched this month',
   '80% stays in the zip. The brotherhood economy is working. Total route revenue to brothers: $2,400 this month.',
   'Steward Report', 'trade', true, 'steward_0001', now() - interval '3 days', now() + interval '4 days')
ON CONFLICT DO NOTHING;

-- ── 10. RLS Policies (idempotent) ────────────────────────────
ALTER TABLE steward_applications ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Anyone can apply to be steward" ON steward_applications FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Public reads approved stewards" ON steward_applications FOR SELECT USING (status IN ('approved', 'co-steward'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Service role manages steward apps" ON steward_applications FOR ALL USING (auth.role() = 'service_role');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE cluster_stewards ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public reads active stewards" ON cluster_stewards FOR SELECT USING (status = 'active');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Service role manages stewards" ON cluster_stewards FOR ALL USING (auth.role() = 'service_role');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE cluster_news ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public reads approved news" ON cluster_news FOR SELECT USING (is_approved = true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Anyone can submit news" ON cluster_news FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Service role manages news" ON cluster_news FOR ALL USING (auth.role() = 'service_role');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE cluster_checkins ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Anyone can check in" ON cluster_checkins FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Public reads checkin counts" ON cluster_checkins FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Service role manages checkins" ON cluster_checkins FOR ALL USING (auth.role() = 'service_role');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE cluster_911 ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Anyone can submit 911 alert" ON cluster_911 FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Service role manages 911" ON cluster_911 FOR ALL USING (auth.role() = 'service_role');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE cluster_warchest ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Anyone can pledge to warchest" ON cluster_warchest FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Public reads warchest totals" ON cluster_warchest FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Service role manages warchest" ON cluster_warchest FOR ALL USING (auth.role() = 'service_role');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
