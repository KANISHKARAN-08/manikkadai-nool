-- ====================================================================
-- MANIKKADAI NOOL DATABASE SCHEMA
-- Migration: 20261013000001_initial_schema.sql
-- ====================================================================

-- 1. Profiles Table linked to Supabase Auth
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index on email and role
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Function to handle new user registration automatically via trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'user' -- Always enforce default 'user' role on public signup
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile record on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Reference Entries Table
CREATE TABLE IF NOT EXISTS public.reference_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  min_val NUMERIC(6, 2) NOT NULL CHECK (min_val >= 0),
  max_val NUMERIC(6, 2) NOT NULL CHECK (max_val >= min_val),
  unit TEXT NOT NULL CHECK (unit IN ('cm', 'mm')),
  traditional_val TEXT,
  tamil_text TEXT NOT NULL,
  english_text TEXT,
  source_book TEXT NOT NULL,
  page_no TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'verified')),
  reviewer TEXT NOT NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_ref_status ON public.reference_entries(status);
CREATE INDEX IF NOT EXISTS idx_ref_range ON public.reference_entries(unit, min_val, max_val);

-- 3. Assessments Table
CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  session_id TEXT NOT NULL,
  measurement_val NUMERIC(6, 2) NOT NULL CHECK (measurement_val > 0),
  unit TEXT NOT NULL CHECK (unit IN ('cm', 'mm')),
  normalized_cm NUMERIC(6, 2) NOT NULL,
  normalized_mm NUMERIC(6, 2) NOT NULL,
  repeat_measurement NUMERIC(6, 2),
  notes TEXT,
  match_status TEXT NOT NULL CHECK (match_status IN ('matched', 'no_match', 'multiple_matches')),
  matched_reference_ids JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_assessments_user ON public.assessments(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_assessments_session ON public.assessments(session_id);

-- 4. Reference Audit Log Table
CREATE TABLE IF NOT EXISTS public.reference_audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reference_id UUID REFERENCES public.reference_entries(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL CHECK (action IN ('insert', 'update', 'delete', 'verify')),
  diff JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
