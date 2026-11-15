-- Migration: 20261112000001_rls_policies.sql
-- Description: Row Level Security (RLS) policies for Straina AMR Surveillance
-- PRD Section 8.2 (Permissions Table), Section 12.3, Section 13 (Security), BR6

-- ============================================================================
-- 1. Enable Row Level Security on all tables (BR6)
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.amr_observations ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 2. Helper function: Get role of current authenticated user
-- ============================================================================
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ============================================================================
-- 3. Policies: public.profiles
-- Users can view their own profile; admins can view and manage all profiles.
-- ============================================================================
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
CREATE POLICY "profiles_select_policy"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    id = auth.uid() OR public.current_user_role() = 'admin'
  );

DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
CREATE POLICY "profiles_insert_policy"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    id = auth.uid() OR public.current_user_role() = 'admin'
  );

DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
CREATE POLICY "profiles_update_policy"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (
    id = auth.uid() OR public.current_user_role() = 'admin'
  )
  WITH CHECK (
    public.current_user_role() = 'admin'
    OR (
      id = auth.uid()
      AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "profiles_delete_policy" ON public.profiles;
CREATE POLICY "profiles_delete_policy"
  ON public.profiles
  FOR DELETE
  TO authenticated
  USING (
    public.current_user_role() = 'admin'
  );

-- ============================================================================
-- 4. Policies: public.data_sources
-- Public read (OQ10). Admin only for insert, update, delete (T-PERM-5a/b).
-- ============================================================================
DROP POLICY IF EXISTS "data_sources_public_select" ON public.data_sources;
CREATE POLICY "data_sources_public_select"
  ON public.data_sources
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "data_sources_admin_insert" ON public.data_sources;
CREATE POLICY "data_sources_admin_insert"
  ON public.data_sources
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.current_user_role() = 'admin'
  );

DROP POLICY IF EXISTS "data_sources_admin_update" ON public.data_sources;
CREATE POLICY "data_sources_admin_update"
  ON public.data_sources
  FOR UPDATE
  TO authenticated
  USING (
    public.current_user_role() = 'admin'
  )
  WITH CHECK (
    public.current_user_role() = 'admin'
  );

DROP POLICY IF EXISTS "data_sources_admin_delete" ON public.data_sources;
CREATE POLICY "data_sources_admin_delete"
  ON public.data_sources
  FOR DELETE
  TO authenticated
  USING (
    public.current_user_role() = 'admin'
  );

-- ============================================================================
-- 5. Policies: public.amr_observations
-- Public read (OQ10).
-- Insert: Admin or Data Submitter (T-PERM-2a/b).
-- Update/Delete: Admin (any) or Data Submitter (own records only) (T-PERM-3a/b).
-- ============================================================================
DROP POLICY IF EXISTS "amr_observations_public_select" ON public.amr_observations;
CREATE POLICY "amr_observations_public_select"
  ON public.amr_observations
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "amr_observations_insert" ON public.amr_observations;
CREATE POLICY "amr_observations_insert"
  ON public.amr_observations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.current_user_role() IN ('admin', 'data_submitter')
  );

DROP POLICY IF EXISTS "amr_observations_update" ON public.amr_observations;
CREATE POLICY "amr_observations_update"
  ON public.amr_observations
  FOR UPDATE
  TO authenticated
  USING (
    public.current_user_role() = 'admin'
    OR (
      public.current_user_role() = 'data_submitter'
      AND created_by = auth.uid()
    )
  )
  WITH CHECK (
    public.current_user_role() = 'admin'
    OR (
      public.current_user_role() = 'data_submitter'
      AND created_by = auth.uid()
    )
  );

DROP POLICY IF EXISTS "amr_observations_delete" ON public.amr_observations;
CREATE POLICY "amr_observations_delete"
  ON public.amr_observations
  FOR DELETE
  TO authenticated
  USING (
    public.current_user_role() = 'admin'
    OR (
      public.current_user_role() = 'data_submitter'
      AND created_by = auth.uid()
    )
  );

