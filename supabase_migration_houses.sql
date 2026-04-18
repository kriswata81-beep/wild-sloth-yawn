-- ============================================================
-- MĀKOA ORDER — House Charter System Schema
-- Run in Supabase SQL Editor after supabase_migration_808_network.sql
-- ============================================================

-- ── 1. makoa_charters ────────────────────────────────────────
-- World Chapter · Regional Charter · Makoa House
-- The 3-tier charter hierarchy

CREATE TABLE IF NOT EXISTS makoa_charters (
  id                uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  charter_number    serial UNIQUE,       -- 0001, 0002 ...
  charter_type      text NOT NULL,       -- world_chapter | regional | makoa_house
  name              text NOT NULL,       -- "West Oahu Founding House"
  -- Location
  location          text,               -- "West Oahu, Hawaiʻi"
  country           text DEFAULT 'USA',
  island            text,               -- for Hawaii charters
  zip_cluster       text[],             -- zip codes in this charter's territory
  primary_zip       text,
  -- Territory routes
  route_types       text[],             -- land | sea | air (for regional/alii)
  -- Class & rank
  class             text NOT NULL,      -- alii_global | alii_land | alii_sea | alii_air | mana_live_in
  -- Leadership
  charter_holder_id uuid,               -- references makoa_stewards or makoa_ambassadors
  holder_name       text,
  holder_email      text,
  -- Status
  status            text DEFAULT 'open', -- founding | active | open | suspended
  is_founding       boolean DEFAULT false, -- first 100 houses
  -- Stone
  stone_number      text,               -- e.g. "HOUSE-0001"
  stone_class       text DEFAULT 'founding', -- founding | standard
  charter_date      date,
  -- Equity
  trade_route_equity_pct numeric(5,2) DEFAULT 0, -- % equity in routes within territory
  -- Timestamps
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_charters_type ON makoa_charters(charter_type);
CREATE INDEX IF NOT EXISTS idx_charters_status ON makoa_charters(status);
CREATE INDEX IF NOT EXISTS idx_charters_zip ON makoa_charters(primary_zip);

-- ── 2. makoa_houses ──────────────────────────────────────────
-- Physical Makoa Houses — one per zip cluster.
-- Managed by a Mana live-in brother.

CREATE TABLE IF NOT EXISTS makoa_houses (
  id                uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  house_number      serial UNIQUE,       -- 0001, 0002 ...
  charter_id        uuid REFERENCES makoa_charters(id),
  name              text NOT NULL,       -- "House 0001 — West Oahu"
  -- Location
  address           text,
  city              text,
  state             text DEFAULT 'HI',
  zip               text,
  island            text,
  country           text DEFAULT 'USA',
  -- Rooms
  total_rooms       int DEFAULT 0,
  master_room       boolean DEFAULT true,  -- Aliʻi timeshare room
  resident_rooms    int DEFAULT 0,         -- Mana live-in rooms
  -- Current occupancy
  mana_manager_id   uuid,                  -- current Mana live-in steward
  mana_manager_name text,
  live_in_start     date,
  live_in_day       int DEFAULT 0,         -- current day of 90-day cycle
  elevation_due     date,                  -- day 90
  -- Programs hosted
  has_trade_academy boolean DEFAULT true,  -- Nakoa Trade Academy 9-2
  has_wed_reset     boolean DEFAULT true,  -- Wednesday 4AM Elite Reset
  has_war_room      boolean DEFAULT true,  -- Full Moon 72hr War Room
  has_tool_library  boolean DEFAULT true,  -- B2B SaaS + equipment
  -- Status
  status            text DEFAULT 'open',   -- founding | active | open | pending
  is_founding       boolean DEFAULT false,
  stone_number      text,
  stone_sealed_at   timestamptz,
  -- Revenue & metrics
  active_nakoa_count int DEFAULT 0,
  monthly_job_count  int DEFAULT 0,
  monthly_revenue    numeric(10,2) DEFAULT 0,
  -- Timestamps
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_houses_zip ON makoa_houses(zip);
CREATE INDEX IF NOT EXISTS idx_houses_status ON makoa_houses(status);

-- ── 3. makoa_live_ins ────────────────────────────────────────
-- Tracks every Mana brother's 90-day live-in application & progress.

CREATE TABLE IF NOT EXISTS makoa_live_ins (
  id                uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  house_id          uuid REFERENCES makoa_houses(id),
  steward_id        uuid REFERENCES makoa_stewards(id),
  brother_name      text NOT NULL,
  brother_email     text NOT NULL,
  brother_phone     text,
  -- 90-day tracking
  start_date        date,
  day_current       int DEFAULT 0,
  day_90_target     date,
  -- Completion milestones
  trade_academy_sessions  int DEFAULT 0,  -- must host minimum sessions
  wed_reset_sessions      int DEFAULT 0,
  war_room_sessions       int DEFAULT 0,
  jobs_dispatched         int DEFAULT 0,
  -- Status
  status            text DEFAULT 'applied', -- applied | approved | active | completed | withdrawn
  elevation_vote    text,                   -- pending | approved | denied
  elevation_date    date,
  elevated_to_alii  boolean DEFAULT false,
  -- Notes
  notes             text,
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);

-- ── 4. master_room_bookings ──────────────────────────────────
-- Aliʻi timeshare bookings for the Master Room in each house.

CREATE TABLE IF NOT EXISTS master_room_bookings (
  id                uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  house_id          uuid REFERENCES makoa_houses(id),
  charter_id        uuid REFERENCES makoa_charters(id),
  -- Guest
  alii_name         text NOT NULL,
  alii_email        text NOT NULL,
  alii_class        text,               -- alii_global | alii_land | alii_sea | alii_air
  -- Booking
  check_in          date NOT NULL,
  check_out         date NOT NULL,
  nights            int,
  purpose           text,               -- travel | war_room | full_moon | mayday
  -- Status
  status            text DEFAULT 'pending', -- pending | confirmed | checked_in | completed | cancelled
  confirmed_by      text,               -- house manager name
  -- Timestamps
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bookings_house ON master_room_bookings(house_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON master_room_bookings(check_in, check_out);

-- ── 5. house_applications ────────────────────────────────────
-- Incoming applications to open a new Makoa House (from /houses CTA).

CREATE TABLE IF NOT EXISTS house_applications (
  id                uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  applicant_name    text NOT NULL,
  applicant_email   text NOT NULL,
  applicant_phone   text,
  -- Proposed location
  proposed_city     text,
  proposed_state    text,
  proposed_country  text,
  proposed_zip      text,
  -- Current class
  current_class     text,              -- nakoa | mana | alii
  gate_submission_id uuid,
  steward_id        uuid REFERENCES makoa_stewards(id),
  -- Application details
  why_open_house    text,
  property_type     text,              -- own | rent | seeking
  capacity          int,               -- estimated rooms
  -- Referral
  referred_by       text,
  heard_via         text,              -- mayday | 808_net | gary_vee | social | word_of_mouth
  -- Status
  status            text DEFAULT 'new', -- new | reviewing | approved | denied | waitlist
  reviewer_notes    text,
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);

-- ── 6. Seed founding charters ────────────────────────────────

-- World Chapter
INSERT INTO makoa_charters (
  charter_type, name, location, country, class, status, is_founding,
  stone_number, stone_class, charter_date, trade_route_equity_pct
) VALUES (
  'world_chapter', 'Mākoa World Chapter', 'West Oahu, Hawaiʻi', 'USA',
  'alii_global', 'founding', true, 'WORLD-0001', 'founding',
  '2026-05-31', 5.0
) ON CONFLICT DO NOTHING;

-- West Oahu Regional Charter (Land)
INSERT INTO makoa_charters (
  charter_type, name, location, country, island, primary_zip, zip_cluster,
  route_types, class, holder_name, status, is_founding,
  stone_number, stone_class, charter_date, trade_route_equity_pct
) VALUES (
  'regional', 'West Oahu Land Charter', 'West Oahu, Hawaiʻi', 'USA',
  'Oahu', '96792', ARRAY['96792','96707','96706','96791','96701'],
  ARRAY['land'], 'alii_land', 'Mana Steward 0001',
  'founding', true, 'REGIONAL-0001', 'founding',
  '2026-05-31', 3.0
) ON CONFLICT DO NOTHING;

-- Founding House — West Oahu
INSERT INTO makoa_charters (
  charter_type, name, location, country, island, primary_zip,
  zip_cluster, route_types, class, holder_name, status, is_founding,
  stone_number, stone_class, charter_date, trade_route_equity_pct
) VALUES (
  'makoa_house', 'House 0001 — West Oahu', 'West Oahu, Hawaiʻi', 'USA',
  'Oahu', '96792', ARRAY['96792','96707','96706'],
  ARRAY['land'], 'mana_live_in', 'Mana Steward 0001',
  'founding', true, 'HOUSE-0001', 'founding',
  '2026-05-01', 1.0
) ON CONFLICT DO NOTHING;

-- ── 7. RLS Policies ──────────────────────────────────────────

ALTER TABLE makoa_charters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads charters" ON makoa_charters FOR SELECT USING (true);
CREATE POLICY "Service role manages charters" ON makoa_charters FOR ALL USING (auth.role() = 'service_role');

ALTER TABLE makoa_houses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads houses" ON makoa_houses FOR SELECT USING (true);
CREATE POLICY "Service role manages houses" ON makoa_houses FOR ALL USING (auth.role() = 'service_role');

ALTER TABLE makoa_live_ins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can apply for live-in" ON makoa_live_ins FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role manages live-ins" ON makoa_live_ins FOR ALL USING (auth.role() = 'service_role');

ALTER TABLE master_room_bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Alii can book master room" ON master_room_bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role manages bookings" ON master_room_bookings FOR ALL USING (auth.role() = 'service_role');

ALTER TABLE house_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can apply to open a house" ON house_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role manages house applications" ON house_applications FOR ALL USING (auth.role() = 'service_role');
