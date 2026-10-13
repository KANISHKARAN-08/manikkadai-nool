-- ====================================================================
-- MANIKKADAI NOOL DATABASE MIGRATION
-- Migration: 20261014000001_support_virarkadai_references.sql
-- Supports traditional Virarkadai measurements from ancient printed tables
-- ====================================================================

-- 1. Update unit check constraint to include 'virarkadai'
ALTER TABLE public.reference_entries 
  DROP CONSTRAINT IF EXISTS reference_entries_unit_check;

ALTER TABLE public.reference_entries 
  ADD CONSTRAINT reference_entries_unit_check 
  CHECK (unit IN ('cm', 'mm', 'virarkadai'));

-- 2. Add source_id for idempotent seeding without duplicate entries
ALTER TABLE public.reference_entries 
  ADD COLUMN IF NOT EXISTS source_id TEXT UNIQUE;

-- 3. Add table category column (Disease Manifestation / Critical Prognosis)
ALTER TABLE public.reference_entries 
  ADD COLUMN IF NOT EXISTS category TEXT CHECK (category IN ('disease_manifestation', 'critical_prognosis', 'general'));

-- 4. Create indexes on source_id and traditional_val for fast matching
CREATE INDEX IF NOT EXISTS idx_ref_source_id ON public.reference_entries(source_id);
CREATE INDEX IF NOT EXISTS idx_ref_traditional_val ON public.reference_entries(traditional_val);
