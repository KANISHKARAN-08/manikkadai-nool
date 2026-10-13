-- ====================================================================
-- MANIKKADAI NOOL ROW LEVEL SECURITY POLICIES
-- Migration: 20261013000002_rls_policies.sql
-- ====================================================================

-- 1. Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reference_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reference_audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is an administrator
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- --------------------------------------------------------------------
-- PROFILES POLICIES
-- --------------------------------------------------------------------
-- Users can view their own profile; admins can view all profiles
CREATE POLICY "Users can view own profile or admins view all"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

-- Users can update non-role fields of their own profile
CREATE POLICY "Users can update own profile (excluding role)"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    AND (role = (SELECT role FROM public.profiles WHERE id = auth.uid()) OR public.is_admin())
  );

-- --------------------------------------------------------------------
-- REFERENCE ENTRIES POLICIES
-- --------------------------------------------------------------------
-- Anyone (public or authenticated) can view VERIFIED reference entries
CREATE POLICY "Public can view verified references"
  ON public.reference_entries
  FOR SELECT
  USING (status = 'verified' OR public.is_admin());

-- Only administrators can insert new reference entries
CREATE POLICY "Admins can insert reference entries"
  ON public.reference_entries
  FOR INSERT
  WITH CHECK (public.is_admin());

-- Only administrators can update reference entries
CREATE POLICY "Admins can update reference entries"
  ON public.reference_entries
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Only administrators can delete reference entries
CREATE POLICY "Admins can delete reference entries"
  ON public.reference_entries
  FOR DELETE
  USING (public.is_admin());

-- --------------------------------------------------------------------
-- ASSESSMENTS POLICIES
-- --------------------------------------------------------------------
-- Users can view ONLY their own assessment sessions
CREATE POLICY "Users can view own assessments"
  ON public.assessments
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own assessment sessions
CREATE POLICY "Users can create own assessments"
  ON public.assessments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own assessment sessions
CREATE POLICY "Users can delete own assessments"
  ON public.assessments
  FOR DELETE
  USING (auth.uid() = user_id);

-- --------------------------------------------------------------------
-- AUDIT LOGS POLICIES
-- --------------------------------------------------------------------
-- Only administrators can view audit logs
CREATE POLICY "Admins can view audit logs"
  ON public.reference_audit_logs
  FOR SELECT
  USING (public.is_admin());

-- System or authenticated actions can write audit logs
CREATE POLICY "Authenticated users can create audit logs"
  ON public.reference_audit_logs
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');
