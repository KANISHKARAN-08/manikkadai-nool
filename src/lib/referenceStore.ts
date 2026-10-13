import { ReferenceEntry, UnitType, VerificationStatus } from '../types';
import { INITIAL_VERIFIED_REFERENCES } from '../data/authenticManuscriptData';
import { supabase, isSupabaseConfigured } from './supabase';
import { checkRangeOverlap } from './normalization';

const LOCAL_STORAGE_KEY = 'mn_reference_entries';

/**
 * Initializes and retrieves reference entries.
 */
export async function getReferenceEntries(isAdmin: boolean = false): Promise<ReferenceEntry[]> {
  // If Supabase is live, fetch from Postgres
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('reference_entries').select('*');
      if (!isAdmin) {
        query = query.eq('status', 'verified');
      }
      const { data, error } = await query.order('min_val', { ascending: true });
      if (!error && data) {
        return data.map(row => ({
          id: row.id,
          minVal: Number(row.min_val),
          maxVal: Number(row.max_val),
          unit: row.unit as UnitType,
          traditionalVal: row.traditional_val,
          tamilText: row.tamil_text,
          englishText: row.english_text,
          sourceBook: row.source_book,
          pageNo: row.page_no,
          status: row.status as VerificationStatus,
          reviewer: row.reviewer,
          createdAt: row.created_at,
          updatedAt: row.updated_at
        }));
      }
    } catch (e) {
      console.warn('Supabase fetch failed, falling back to local store', e);
    }
  }

  // Fallback to local storage
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (stored) {
    try {
      const parsed: ReferenceEntry[] = JSON.parse(stored);
      return isAdmin ? parsed : parsed.filter(p => p.status === 'verified');
    } catch {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }

  // Pre-seed with authentic verified entries from Noi Nadal Noi Mudal Nadal Thirattu
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_VERIFIED_REFERENCES));
  return isAdmin ? INITIAL_VERIFIED_REFERENCES : INITIAL_VERIFIED_REFERENCES.filter(p => p.status === 'verified');
}

/**
 * Adds a new reference entry with overlap detection and admin role enforcement.
 */
export async function addReferenceEntry(
  entry: Omit<ReferenceEntry, 'id' | 'createdAt'>,
  userId?: string
): Promise<{ success: boolean; entry?: ReferenceEntry; error?: string; overlapWarning?: boolean }> {
  // Validation: Min <= Max
  if (entry.minVal > entry.maxVal) {
    return { success: false, error: 'Minimum circumference must be less than or equal to maximum circumference.' };
  }

  const existing = await getReferenceEntries(true);
  const overlap = checkRangeOverlap(entry.minVal, entry.maxVal, entry.unit, existing);

  const newEntry: ReferenceEntry = {
    ...entry,
    id: `ref-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString()
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('reference_entries').insert([{
        min_val: entry.minVal,
        max_val: entry.maxVal,
        unit: entry.unit,
        traditional_val: entry.traditionalVal,
        tamil_text: entry.tamilText,
        english_text: entry.englishText,
        source_book: entry.sourceBook,
        page_no: entry.pageNo,
        status: entry.status,
        reviewer: entry.reviewer,
        created_by: userId
      }]).select().single();

      if (error) {
        return { success: false, error: error.message };
      }

      newEntry.id = data.id;
    } catch (err: any) {
      return { success: false, error: err.message || 'Database error occurred' };
    }
  }

  // Update local storage
  const updated = [newEntry, ...existing];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));

  return {
    success: true,
    entry: newEntry,
    overlapWarning: overlap.hasOverlap
  };
}

/**
 * Deletes a reference entry.
 */
export async function deleteReferenceEntry(id: string): Promise<{ success: boolean; error?: string }> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('reference_entries').delete().eq('id', id);
      if (error) return { success: false, error: error.message };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  const existing = await getReferenceEntries(true);
  const filtered = existing.filter(e => e.id !== id);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));

  return { success: true };
}

/**
 * Clears all reference entries.
 */
export async function clearAllReferenceEntries(): Promise<{ success: boolean; error?: string }> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('reference_entries').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (error) return { success: false, error: error.message };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([]));
  return { success: true };
}
