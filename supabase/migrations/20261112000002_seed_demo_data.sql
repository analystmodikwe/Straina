-- Migration: 20261112000002_seed_demo_data.sql
-- Description: Seed synthetic demo dataset for Straina MVP
-- PRD Section 11.5, BR1, BR13

-- ============================================================================
-- 1. Insert Synthetic Demo Data Source (BR13)
-- ============================================================================
INSERT INTO public.data_sources (
  id,
  name,
  url,
  description,
  geographic_coverage,
  temporal_coverage_start,
  temporal_coverage_end,
  last_updated,
  is_demo
) VALUES (
  'd0000000-0000-0000-0000-000000000001',
  'Straina demo dataset (synthetic)',
  NULL,
  'Synthetic antimicrobial resistance surveillance dataset developed for the Straina MVP demonstration across South African provinces.',
  'South Africa (all 9 provinces)',
  '2025-01-01',
  '2026-06-30',
  '2026-06-30',
  true
) ON CONFLICT (id) DO UPDATE
SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  temporal_coverage_end = EXCLUDED.temporal_coverage_end,
  last_updated = EXCLUDED.last_updated;

-- ============================================================================
-- 2. Insert Synthetic AMR Observations across South Africa
-- Covers all 9 provinces with multi-quarter data, multiple pathogens & antimicrobials
-- ============================================================================
INSERT INTO public.amr_observations (
  id,
  data_source_id,
  area_code,
  area_name,
  area_level,
  latitude,
  longitude,
  period_start,
  period_end,
  pathogen,
  antimicrobial,
  isolates_tested,
  isolates_resistant,
  created_by
) VALUES
  -- Gauteng (GP)
  ('a0000001-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'GP', 'Gauteng', 'province', -26.2041, 28.0473, '2026-01-01', '2026-03-31', 'Klebsiella pneumoniae', 'Meropenem', 85, 34, NULL),
  ('a0000001-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000001', 'GP', 'Gauteng', 'province', -26.2041, 28.0473, '2026-01-01', '2026-03-31', 'Escherichia coli', 'Ciprofloxacin', 120, 52, NULL),
  ('a0000001-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000001', 'GP', 'Gauteng', 'province', -26.2041, 28.0473, '2026-04-01', '2026-06-30', 'Klebsiella pneumoniae', 'Meropenem', 92, 41, NULL),
  ('a0000001-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000001', 'GP', 'Gauteng', 'province', -26.2041, 28.0473, '2026-04-01', '2026-06-30', 'Staphylococcus aureus', 'Oxacillin', 70, 28, NULL),

  -- Western Cape (WC)
  ('a0000002-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'WC', 'Western Cape', 'province', -33.9249, 18.4241, '2026-01-01', '2026-03-31', 'Klebsiella pneumoniae', 'Meropenem', 65, 12, NULL),
  ('a0000002-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000001', 'WC', 'Western Cape', 'province', -33.9249, 18.4241, '2026-01-01', '2026-03-31', 'Escherichia coli', 'Ciprofloxacin', 95, 23, NULL),
  ('a0000002-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000001', 'WC', 'Western Cape', 'province', -33.9249, 18.4241, '2026-04-01', '2026-06-30', 'Klebsiella pneumoniae', 'Meropenem', 72, 14, NULL),

  -- KwaZulu-Natal (KZN)
  ('a0000003-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'KZN', 'KwaZulu-Natal', 'province', -29.8587, 31.0218, '2026-01-01', '2026-03-31', 'Klebsiella pneumoniae', 'Meropenem', 80, 31, NULL),
  ('a0000003-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000001', 'KZN', 'KwaZulu-Natal', 'province', -29.8587, 31.0218, '2026-01-01', '2026-03-31', 'Escherichia coli', 'Ciprofloxacin', 110, 48, NULL),
  ('a0000003-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000001', 'KZN', 'KwaZulu-Natal', 'province', -29.8587, 31.0218, '2026-04-01', '2026-06-30', 'Staphylococcus aureus', 'Oxacillin', 60, 22, NULL),

  -- Eastern Cape (EC)
  ('a0000004-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'EC', 'Eastern Cape', 'province', -32.2968, 26.4194, '2026-01-01', '2026-03-31', 'Klebsiella pneumoniae', 'Meropenem', 45, 15, NULL),
  ('a0000004-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000001', 'EC', 'Eastern Cape', 'province', -32.2968, 26.4194, '2026-04-01', '2026-06-30', 'Escherichia coli', 'Ciprofloxacin', 55, 19, NULL),

  -- Free State (FS)
  ('a0000005-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'FS', 'Free State', 'province', -28.4541, 26.7968, '2026-01-01', '2026-03-31', 'Klebsiella pneumoniae', 'Meropenem', 40, 11, NULL),
  ('a0000005-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000001', 'FS', 'Free State', 'province', -28.4541, 26.7968, '2026-04-01', '2026-06-30', 'Escherichia coli', 'Ciprofloxacin', 50, 16, NULL),

  -- Limpopo (LP)
  ('a0000006-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'LP', 'Limpopo', 'province', -23.4013, 29.4179, '2026-01-01', '2026-03-31', 'Klebsiella pneumoniae', 'Meropenem', 35, 10, NULL),
  ('a0000006-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000001', 'LP', 'Limpopo', 'province', -23.4013, 29.4179, '2026-04-01', '2026-06-30', 'Staphylococcus aureus', 'Oxacillin', 42, 13, NULL),

  -- Mpumalanga (MP)
  ('a0000007-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'MP', 'Mpumalanga', 'province', -25.5647, 30.5279, '2026-01-01', '2026-03-31', 'Klebsiella pneumoniae', 'Meropenem', 38, 12, NULL),
  ('a0000007-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000001', 'MP', 'Mpumalanga', 'province', -25.5647, 30.5279, '2026-04-01', '2026-06-30', 'Escherichia coli', 'Ciprofloxacin', 48, 18, NULL),

  -- North West (NW)
  ('a0000008-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'NW', 'North West', 'province', -25.8560, 25.6403, '2026-01-01', '2026-03-31', 'Klebsiella pneumoniae', 'Meropenem', 32, 9, NULL),
  ('a0000008-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000001', 'NW', 'North West', 'province', -25.8560, 25.6403, '2026-04-01', '2026-06-30', 'Staphylococcus aureus', 'Oxacillin', 36, 11, NULL),

  -- Northern Cape (NC)
  ('a0000009-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'NC', 'Northern Cape', 'province', -29.0852, 21.8569, '2026-01-01', '2026-03-31', 'Klebsiella pneumoniae', 'Meropenem', 25, 6, NULL),
  ('a0000009-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000001', 'NC', 'Northern Cape', 'province', -29.0852, 21.8569, '2026-04-01', '2026-06-30', 'Escherichia coli', 'Ciprofloxacin', 30, 8, NULL)
ON CONFLICT (id) DO UPDATE
SET
  isolates_tested = EXCLUDED.isolates_tested,
  isolates_resistant = EXCLUDED.isolates_resistant,
  updated_at = timezone('utc'::text, now());

