-- ============================================================
-- MĀKOA ORDER — XI Territory Data Banks
-- Worldwide territory registry with timezone clocks,
-- Aliʻi / Mana / Nakoa / Ambassador rosters.
-- Self-contained — no external table dependencies.
-- ============================================================

-- ── 1. xi_territories ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS xi_territories (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  code          text UNIQUE NOT NULL,          -- e.g. "HI-96792", "CA-LA", "TX-HOU"
  name          text NOT NULL,                 -- "West Oahu · ZIP 96792"
  region        text NOT NULL,                 -- "Hawaii", "California", "Philippines"
  country       text NOT NULL DEFAULT 'USA',
  continent     text NOT NULL DEFAULT 'North America',
  timezone      text NOT NULL,                 -- IANA timezone e.g. "Pacific/Honolulu"
  utc_offset    text NOT NULL,                 -- display e.g. "UTC-10"
  zip_codes     text[],                        -- array of zip codes in this territory
  status        text DEFAULT 'open',           -- 'active' | 'forming' | 'open' | 'locked'
  phase         text DEFAULT '2027+',          -- '2026' | '2026-27' | '2027+'
  color         text DEFAULT '#7c6fd0',        -- gold=founding, purple=forming, blue=future
  notes         text,
  created_at    timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_territories_status    ON xi_territories(status);
CREATE INDEX IF NOT EXISTS idx_territories_continent ON xi_territories(continent);

-- ── 2. xi_territory_members ───────────────────────────────────
CREATE TABLE IF NOT EXISTS xi_territory_members (
  id             uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  territory_code text NOT NULL REFERENCES xi_territories(code),
  handle         text NOT NULL,
  rank_tier      text NOT NULL,    -- 'alii' | 'mana' | 'nakoa'
  role           text NOT NULL,    -- 'steward' | 'co-steward' | 'ambassador' | 'operator' | 'brother'
  seat_type      text,             -- 'primary' | 'co_steward_1' | 'ambassador'
  status         text DEFAULT 'active',
  instagram      text,
  telegram       text,
  timezone_local text,             -- their personal timezone if different from territory
  notes          text,
  joined_at      timestamptz DEFAULT now(),
  created_at     timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_territory_members_code ON xi_territory_members(territory_code);
CREATE INDEX IF NOT EXISTS idx_territory_members_tier ON xi_territory_members(rank_tier);

-- ── 3. Seed founding + target territories ────────────────────
INSERT INTO xi_territories (code, name, region, country, continent, timezone, utc_offset, zip_codes, status, phase, color, notes)
VALUES
  -- FOUNDING — LIVE
  ('HI-96792', 'West Oahu · ZIP 96792', 'Hawaii', 'USA', 'Pacific', 'Pacific/Honolulu', 'UTC-10',
   ARRAY['96792','96707','96706'], 'active', '2026', '#b08e50',
   'House 0001 sealed May 1 2026. Founding cluster. Steward 0001 seated.'),

  -- HAWAII EXPANSION — 2026
  ('HI-96818', 'Pearl City · ZIP 96818', 'Hawaii', 'USA', 'Pacific', 'Pacific/Honolulu', 'UTC-10',
   ARRAY['96818','96819'], 'forming', '2026', '#b08e50',
   'Cluster 2 — Pearl Harbor corridor. High brother density.'),
  ('HI-96744', 'Kāneʻohe · ZIP 96744', 'Hawaii', 'USA', 'Pacific', 'Pacific/Honolulu', 'UTC-10',
   ARRAY['96744','96734'], 'open', '2026-27', '#7c6fd0',
   'Windward Oahu expansion. Strong trades community.'),
  ('HI-96720', 'Hilo · Big Island', 'Hawaii', 'USA', 'Pacific', 'Pacific/Honolulu', 'UTC-10',
   ARRAY['96720','96721'], 'open', '2026-27', '#7c6fd0',
   'Big Island anchor. Trade route potential high.'),

  -- MAINLAND USA — 2026-27
  ('CA-LA',    'Los Angeles · South Central', 'California', 'USA', 'North America', 'America/Los_Angeles', 'UTC-8',
   NULL, 'open', '2026-27', '#7c6fd0',
   'Pacific Islander diaspora hub. Large Hawaii-born population.'),
  ('CA-SD',    'San Diego · National City', 'California', 'USA', 'North America', 'America/Los_Angeles', 'UTC-8',
   NULL, 'open', '2026-27', '#7c6fd0',
   'Military/vet community overlap. Trades ecosystem strong.'),
  ('TX-HOU',   'Houston · Alief', 'Texas', 'USA', 'North America', 'America/Chicago', 'UTC-6',
   NULL, 'open', '2027+', '#58a6ff',
   'Pacific Islander community growing. Long-term target.'),
  ('WA-SEA',   'Seattle · Renton', 'Washington', 'USA', 'North America', 'America/Los_Angeles', 'UTC-8',
   NULL, 'open', '2027+', '#58a6ff',
   'Strong PI community. Boeing trades corridor.'),
  ('NV-LAS',   'Las Vegas · Henderson', 'Nevada', 'USA', 'North America', 'America/Los_Angeles', 'UTC-8',
   NULL, 'open', '2027+', '#58a6ff',
   'Large Hawaii diaspora. Hospitality + trades economy.'),

  -- PACIFIC — NET2NET INTERNATIONAL
  ('PH-MNL',   'Metro Manila · NCR', 'National Capital Region', 'Philippines', 'Asia-Pacific', 'Asia/Manila', 'UTC+8',
   NULL, 'open', '2027+', '#58a6ff',
   'Net2Net partner territory. Aliʻi ambassador seat required.'),
  ('NZ-AKL',   'Auckland · South Auckland', 'Auckland', 'New Zealand', 'Pacific', 'Pacific/Auckland', 'UTC+12',
   NULL, 'open', '2027+', '#58a6ff',
   'Polynesian brotherhood hub. Strong PI trades economy.'),
  ('WS-APW',   'Apia · Upolu', 'Upolu', 'Samoa', 'Pacific', 'Pacific/Apia', 'UTC+13',
   NULL, 'open', '2027+', '#58a6ff',
   'Pacific origin territory. Cultural anchor. Future Makahiki site.'),
  ('AU-SYD',   'Sydney · Blacktown', 'New South Wales', 'Australia', 'Pacific', 'Australia/Sydney', 'UTC+10',
   NULL, 'open', '2027+', '#58a6ff',
   'Large PI diaspora. Net2Net expansion.'),
  ('JP-OSA',   'Osaka · Namba', 'Osaka', 'Japan', 'Asia-Pacific', 'Asia/Tokyo', 'UTC+9',
   NULL, 'open', '2027+', '#58a6ff',
   'Trade route node. Pacific rim positioning.'),
  ('GU-HAG',   'Hagåtña · Guam', 'Guam', 'USA Territory', 'Pacific', 'Pacific/Guam', 'UTC+10',
   NULL, 'open', '2027+', '#58a6ff',
   'US territory bridge to Asia-Pacific. Military economy.')
ON CONFLICT (code) DO NOTHING;

-- ── 4. Seed Steward 0001 as founding territory member ─────────
INSERT INTO xi_territory_members (territory_code, handle, rank_tier, role, seat_type, status, notes)
VALUES
  ('HI-96792', 'Kris W. · Steward 0001', 'alii', 'steward', 'primary', 'active',
   'Founding steward. House 0001 sealed May 1 2026.')
ON CONFLICT DO NOTHING;

-- ── 5. RLS ─────────────────────────────────────────────────────
ALTER TABLE xi_territories ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public reads territories" ON xi_territories FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Service role manages territories" ON xi_territories FOR ALL USING (auth.role() = 'service_role');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE xi_territory_members ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public reads territory members" ON xi_territory_members FOR SELECT USING (status = 'active');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Service role manages territory members" ON xi_territory_members FOR ALL USING (auth.role() = 'service_role');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
