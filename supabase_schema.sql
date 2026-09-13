-- ==============================================================================
-- Gopal Maddheshiya Portfolio — Supabase Database & Storage Setup
-- Run this in your Supabase SQL Editor: (https://supabase.com/dashboard/project/rnchpivzlmjlvctjqitr/sql)
-- ==============================================================================

-- 1. Create the portfolio_data table
CREATE TABLE IF NOT EXISTS public.portfolio_data (
  id TEXT PRIMARY KEY,
  content JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.portfolio_data ENABLE ROW LEVEL SECURITY;

-- 3. Allow public visitors to READ portfolio content
DROP POLICY IF EXISTS "Allow public read on portfolio_data" ON public.portfolio_data;
CREATE POLICY "Allow public read on portfolio_data"
  ON public.portfolio_data
  FOR SELECT
  TO public
  USING (true);

-- 4. Allow authenticated admin (Gopal) to INSERT / UPDATE portfolio content
DROP POLICY IF EXISTS "Allow authenticated modify on portfolio_data" ON public.portfolio_data;
CREATE POLICY "Allow authenticated modify on portfolio_data"
  ON public.portfolio_data
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 5. Create storage bucket 'portfolio-media' for project screenshots & photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-media', 'portfolio-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 6. Storage Security Policies
DROP POLICY IF EXISTS "Public Read Portfolio Media" ON storage.objects;
CREATE POLICY "Public Read Portfolio Media"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'portfolio-media');

DROP POLICY IF EXISTS "Authenticated Upload Portfolio Media" ON storage.objects;
CREATE POLICY "Authenticated Upload Portfolio Media"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'portfolio-media');

DROP POLICY IF EXISTS "Authenticated Update Portfolio Media" ON storage.objects;
CREATE POLICY "Authenticated Update Portfolio Media"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'portfolio-media');
