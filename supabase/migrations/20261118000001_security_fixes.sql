-- Migration: 20261118000001_security_fixes.sql
-- Description: Security hardening for handle_new_user role assignment, search_path injection defense, and observation insert ownership check
-- Fixes: Checkpoint 3 review items 1, 2, and 10 (Issue #67)

-- ============================================================================
-- 1. Helper function: Get role of current authenticated user
-- Hardened with SET search_path = public to prevent search-path injection
-- ============================================================================
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

-- ============================================================================
-- 2. Trigger Function: Handle new auth user registration
-- Hardened to ignore any client-supplied role in raw_user_meta_data and always
-- default new profiles to 'analyst' (lowest privilege). Only admins can change
-- roles via the S8 management screen.
-- Hardened with SET search_path = public
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    'analyst' -- Always default to lowest role; client cannot self-elevate
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================================================
-- 3. Policy: public.amr_observations INSERT
-- Hardened so non-admins (data_submitters) can only insert records where
-- created_by matches their own auth.uid(), preventing submitting records
-- falsely attributed to other users. Admins retain full insert access.
-- ============================================================================
DROP POLICY IF EXISTS "amr_observations_insert" ON public.amr_observations;
CREATE POLICY "amr_observations_insert"
  ON public.amr_observations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.current_user_role() = 'admin'
    OR (
      public.current_user_role() = 'data_submitter'
      AND created_by = auth.uid()
    )
  );
