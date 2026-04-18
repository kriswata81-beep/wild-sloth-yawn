-- ============================================================
-- MĀKOA 808 7G NET — Database Schema
-- Run in Supabase SQL Editor
-- ============================================================

-- ── 1. makoa_businesses ─────────────────────────────────────
-- All businesses in the 808 directory: discovered (DCCA scrape),
-- claimed (owner submitted /claim form), or verified (confirmed active).

CREATE TABLE IF NOT EXISTS makoa_businesses (
  id                  uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name                text NOT NULL,
  category            text,
  zip                 text NOT NULL,
  city                text DEFAULT 'Honolulu',
  state               text DEFAULT 'HI',
  -- DCCA data
  dcca_file_number    text UNIQUE,
  dcca_status         text,
  entity_type         text,
  date_filed          text,
  -- Claim data (from /claim page)
  owner_name          text,
  email               text,
  phone               text,
  website             text,
  instagram           text,
  route_interest      text,   -- b2c, b2b, both, n2n
  is_makoa_member     boolean DEFAULT false,
  -- 7G Net routing
  status              text DEFAULT 'discovered',
  -- discovered | pending_verification | claimed | verified | inactive
  source              text DEFAULT 'dcca',  -- dcca | manual | self_claim
  steward_zip         text,   -- assigned Mana Steward zip cluster
  ambassador_zip      text,   -- assigned Ambassador zip route
  network_tier        text,   -- nā_koa | mana_steward | mana_ambassador | alii
  -- Timestamps
  created_at          timestamptz DEFAULT now(),
  updated_at          timestamptz DEFAULT now()
);

-- Index for fast zip + status lookups (directory queries)
CREATE INDEX IF NOT EXISTS idx_makoa_businesses_zip ON makoa_businesses(zip);
CREATE INDEX IF NOT EXISTS idx_makoa_businesses_status ON makoa_businesses(status);
CREATE INDEX IF NOT EXISTS idx_makoa_businesses_category ON makoa_businesses(category);

-- ── 2. makoa_stewards ────────────────────────────────────────
-- Mana Stewards: B2C, zip code cluster operators.
-- Max 1,000 worldwide. First 100 = Founders.

CREATE TABLE IF NOT EXISTS makoa_stewards (
  id                  uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  steward_number      serial UNIQUE,  -- 0001, 0002, ... 1000
  full_name           text NOT NULL,
  email               text UNIQUE NOT NULL,
  phone               text,
  -- Territory
  primary_zip         text NOT NULL,
  zip_cluster         text[],         -- all zips in this steward's cluster
  island              text DEFAULT 'Oahu',
  -- Status
  status              text DEFAULT 'active',  -- active | inactive | suspended
  is_founder          boolean DEFAULT false,  -- first 100
  activated_at        timestamptz,
  -- Linked gate_submission
  gate_submission_id  uuid,
  -- Stripe / billing
  stripe_customer_id  text,
  plan                text DEFAULT 'mana_steward',  -- $497/yr
  plan_active         boolean DEFAULT false,
  -- Revenue tracking
  total_jobs_dispatched   int DEFAULT 0,
  total_revenue_generated numeric(10,2) DEFAULT 0,
  -- Timestamps
  created_at          timestamptz DEFAULT now(),
  updated_at          timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_makoa_stewards_zip ON makoa_stewards(primary_zip);
CREATE INDEX IF NOT EXISTS idx_makoa_stewards_status ON makoa_stewards(status);

-- ── 3. makoa_ambassadors ─────────────────────────────────────
-- Mana Ambassadors: B2B, zip code route operators.
-- Max 1,000 worldwide. First 100 = Founders.

CREATE TABLE IF NOT EXISTS makoa_ambassadors (
  id                    uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  ambassador_number     serial UNIQUE,  -- 0001 ... 1000
  full_name             text NOT NULL,
  email                 text UNIQUE NOT NULL,
  phone                 text,
  company_name          text,
  -- Territory
  primary_zip           text NOT NULL,
  zip_routes            text[],         -- zip codes this ambassador routes B2B
  island                text DEFAULT 'Oahu',
  -- Route types
  route_types           text[],         -- ['land','sea','air'] for Aliʻi; ['b2b'] for Ambassadors
  network_level         text DEFAULT 'mana_ambassador',  -- mana_ambassador | alii_land | alii_sea | alii_air
  -- Status
  status                text DEFAULT 'active',
  is_founder            boolean DEFAULT false,
  activated_at          timestamptz,
  -- Billing
  stripe_customer_id    text,
  plan                  text DEFAULT 'mana_ambassador',  -- $997/yr or Aliʻi $4,997
  plan_active           boolean DEFAULT false,
  -- Metrics
  total_b2b_referrals   int DEFAULT 0,
  total_revenue_routed  numeric(10,2) DEFAULT 0,
  -- Timestamps
  created_at            timestamptz DEFAULT now(),
  updated_at            timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_makoa_ambassadors_zip ON makoa_ambassadors(primary_zip);
CREATE INDEX IF NOT EXISTS idx_makoa_ambassadors_status ON makoa_ambassadors(status);

-- ── 4. makoa_zip_clusters ────────────────────────────────────
-- Maps zip codes to active stewards/ambassadors and network metrics.

CREATE TABLE IF NOT EXISTS makoa_zip_clusters (
  zip                 text PRIMARY KEY,
  area_name           text NOT NULL,
  island              text DEFAULT 'Oahu',
  -- Assignment
  steward_id          uuid REFERENCES makoa_stewards(id),
  ambassador_id       uuid REFERENCES makoa_ambassadors(id),
  -- Status
  cluster_status      text DEFAULT 'open',  -- open | active | saturated
  -- Metrics
  business_count      int DEFAULT 0,
  claimed_count       int DEFAULT 0,
  nakoa_node_count    int DEFAULT 0,
  -- Updated by scraper / cron
  last_scraped_at     timestamptz,
  created_at          timestamptz DEFAULT now(),
  updated_at          timestamptz DEFAULT now()
);

-- ── 5. nakoa_free_nodes ──────────────────────────────────────
-- Nā Koa P2P free tier — individual brothers with a zip presence.
-- Activates when 1 Mana Steward holds the zip.
-- Free: Wednesday 4AM call access, 808 hotspot listing.

CREATE TABLE IF NOT EXISTS nakoa_free_nodes (
  id                  uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name           text NOT NULL,
  zip                 text NOT NULL,
  island              text,
  -- Contact
  email               text,
  phone               text,
  -- Status
  status              text DEFAULT 'active',
  nakoa_class         text DEFAULT 'nā_koa',  -- nā_koa | mana (upgraded)
  -- Wednesday call access
  call_opt_in         boolean DEFAULT true,
  -- Linked gate_submission (if they applied)
  gate_submission_id  uuid,
  -- Timestamps
  joined_at           timestamptz DEFAULT now(),
  created_at          timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_nakoa_nodes_zip ON nakoa_free_nodes(zip);

-- ── 6. yard_quotes ───────────────────────────────────────────
-- Quote requests submitted via /services/yard.
-- Dispatched by XI → Steward 0001.

CREATE TABLE IF NOT EXISTS yard_quotes (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name        text NOT NULL,
  phone       text NOT NULL,
  address     text NOT NULL,
  zip         text NOT NULL,
  service     text DEFAULT 'unspecified',
  notes       text,
  source      text DEFAULT 'yard_landing',
  status      text DEFAULT 'new',   -- new | contacted | scheduled | completed | cancelled
  assigned_to text,                 -- steward or crew name
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- ── 7. Seed West Oahu zip clusters ──────────────────────────

INSERT INTO makoa_zip_clusters (zip, area_name, island, cluster_status)
VALUES
  ('96792', 'Waianae · Mākaha',        'Oahu', 'active'),
  ('96707', 'Kapolei',                 'Oahu', 'active'),
  ('96706', 'Ewa Beach · Ewa',         'Oahu', 'active'),
  ('96791', 'Waialua',                 'Oahu', 'open'),
  ('96701', 'Aiea',                    'Oahu', 'open'),
  ('96782', 'Pearl City',              'Oahu', 'open'),
  ('96789', 'Mililani',                'Oahu', 'open'),
  ('96797', 'Waipahu',                 'Oahu', 'open'),
  ('96762', 'Laie · North Shore East', 'Oahu', 'open'),
  ('96731', 'Kahuku',                  'Oahu', 'open'),
  ('96744', 'Kaneohe',                 'Oahu', 'open'),
  ('96734', 'Kailua',                  'Oahu', 'open')
ON CONFLICT (zip) DO NOTHING;

-- ── 8. Seed Steward 0001 (Kris — West Oahu) ─────────────────

INSERT INTO makoa_stewards (
  steward_number,
  full_name,
  email,
  primary_zip,
  zip_cluster,
  island,
  status,
  is_founder,
  plan,
  plan_active
)
VALUES (
  1,
  'Mana Steward 0001',
  'steward@makoa.live',
  '96792',
  ARRAY['96792','96707','96706'],
  'Oahu',
  'active',
  true,
  'mana_steward',
  true
)
ON CONFLICT (steward_number) DO NOTHING;

-- ── 9. RLS Policies ──────────────────────────────────────────
-- Public read on discovered businesses (the directory is public)
ALTER TABLE makoa_businesses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read businesses" ON makoa_businesses
  FOR SELECT USING (true);
CREATE POLICY "Service role can write businesses" ON makoa_businesses
  FOR ALL USING (auth.role() = 'service_role');

-- Yard quotes: write-only for anon, service role reads all
ALTER TABLE yard_quotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit yard quote" ON yard_quotes
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role manages yard quotes" ON yard_quotes
  FOR ALL USING (auth.role() = 'service_role');

-- Zip clusters: public read
ALTER TABLE makoa_zip_clusters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads zip clusters" ON makoa_zip_clusters
  FOR SELECT USING (true);
CREATE POLICY "Service role writes zip clusters" ON makoa_zip_clusters
  FOR ALL USING (auth.role() = 'service_role');

-- Stewards / Ambassadors / Nā Koa: service role only
ALTER TABLE makoa_stewards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role manages stewards" ON makoa_stewards
  FOR ALL USING (auth.role() = 'service_role');

ALTER TABLE makoa_ambassadors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role manages ambassadors" ON makoa_ambassadors
  FOR ALL USING (auth.role() = 'service_role');

ALTER TABLE nakoa_free_nodes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role manages nakoa nodes" ON nakoa_free_nodes
  FOR ALL USING (auth.role() = 'service_role');
