-- MĀKOA BROTHERHOOD PLATFORM — social_posts migration
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard → SQL Editor → New Query
-- This creates the social_posts queue used by /steward Social tab + /api/social/* + Vercel cron.
-- Safe to run multiple times — uses IF NOT EXISTS where possible.

CREATE TABLE IF NOT EXISTS social_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),

  -- Targeting
  platform text NOT NULL,                -- facebook | instagram | tiktok | youtube | twitter | threads | bluesky | linkedin
  account_id text NOT NULL,              -- Blotato account ID (e.g. 27169 for Mākoa Facebook)
  platform_specific jsonb DEFAULT '{}',  -- pageId, privacyLevel, mediaType, etc.

  -- Content
  text text NOT NULL,
  media_urls text[] DEFAULT '{}',

  -- Scheduling
  scheduled_for timestamptz,             -- NULL for ad-hoc / fired immediately
  status text NOT NULL DEFAULT 'draft',  -- draft | scheduled | firing | fired | failed
  fired_by text,                         -- cron | steward_manual | claude_adhoc | dyad
  fired_at timestamptz,

  -- Blotato response
  blotato_submission_id text,
  blotato_post_url text,                 -- live URL once published
  error_message text,

  -- Provenance
  created_by text DEFAULT 'steward',     -- steward | claude | dyad

  CONSTRAINT social_posts_status_check CHECK (status IN ('draft','scheduled','firing','fired','failed')),
  CONSTRAINT social_posts_platform_check CHECK (platform IN ('facebook','instagram','tiktok','youtube','twitter','threads','bluesky','linkedin'))
);

-- Indexes
CREATE INDEX IF NOT EXISTS social_posts_due_idx
  ON social_posts (scheduled_for)
  WHERE status = 'scheduled';

CREATE INDEX IF NOT EXISTS social_posts_history_idx
  ON social_posts (platform, created_at DESC);

CREATE INDEX IF NOT EXISTS social_posts_status_idx
  ON social_posts (status, created_at DESC);

-- Row Level Security
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;

-- The /steward UI uses anon (sessionStorage password gate, not real auth) — match existing pattern
DROP POLICY IF EXISTS "anon read social_posts" ON social_posts;
CREATE POLICY "anon read social_posts" ON social_posts
  FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "anon insert social_posts" ON social_posts;
CREATE POLICY "anon insert social_posts" ON social_posts
  FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "anon update social_posts" ON social_posts;
CREATE POLICY "anon update social_posts" ON social_posts
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Service role (used by /api/cron + /api/social/post) bypasses RLS automatically.

-- Verification query — run this after to confirm:
-- SELECT id, platform, account_id, status, scheduled_for FROM social_posts ORDER BY created_at DESC LIMIT 5;
