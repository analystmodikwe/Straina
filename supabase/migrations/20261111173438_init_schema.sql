-- Migration: 20261111173438_init_schema.sql
-- Description: Initialize Straina AMR Surveillance database schema
-- Tables: profiles, data_sources, amr_observations

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. Table: profiles (User Profile and Role)
-- PRD Section 11.3 & Section 8
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'analyst' CHECK (role IN ('admin', 'data_submitter', 'analyst')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ============================================================================
-- 2. Table: data_sources (Data Sources)
-- PRD Section 11.2
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.data_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT,
  description TEXT,
  geographic_coverage TEXT NOT NULL,
  temporal_coverage_start DATE NOT NULL,
  temporal_coverage_end DATE NOT NULL,
  last_updated DATE NOT NULL,
  is_demo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT valid_temporal_range CHECK (temporal_coverage_end >= temporal_coverage_start)
);

-- ============================================================================
-- 3. Table: amr_observations (AMR Surveillance Observations)
-- PRD Section 11.1
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.amr_observations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data_source_id UUID NOT NULL REFERENCES public.data_sources(id) ON DELETE RESTRICT,
  area_code TEXT NOT NULL,
  area_name TEXT NOT NULL,
  area_level TEXT NOT NULL CHECK (area_level IN ('province', 'district', 'national')),
  latitude NUMERIC(9, 6) NOT NULL,
  longitude NUMERIC(9, 6) NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  pathogen TEXT NOT NULL,
  antimicrobial TEXT NOT NULL,
  isolates_tested INTEGER NOT NULL CHECK (isolates_tested >= 0),
  isolates_resistant INTEGER NOT NULL CHECK (isolates_resistant >= 0),
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT valid_period CHECK (period_end >= period_start),
  CONSTRAINT valid_resistance CHECK (isolates_resistant <= isolates_tested)
);

-- ============================================================================
-- Indexes for performance
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_amr_obs_area_code ON public.amr_observations (area_code);
CREATE INDEX IF NOT EXISTS idx_amr_obs_period ON public.amr_observations (period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_amr_obs_pathogen_antimicrobial ON public.amr_observations (pathogen, antimicrobial);
CREATE INDEX IF NOT EXISTS idx_amr_obs_data_source ON public.amr_observations (data_source_id);

-- ============================================================================
-- Trigger: Auto-update updated_at on amr_observations
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_amr_obs_updated_at ON public.amr_observations;
CREATE TRIGGER trigger_amr_obs_updated_at
  BEFORE UPDATE ON public.amr_observations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- Trigger: Handle new auth user registration
-- Synchronizes auth.users into public.profiles
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'analyst')
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

