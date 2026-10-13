import { ReferenceEntry, UnitType, VerificationStatus, UserProfile } from '../types';
import { INITIAL_VERIFIED_REFERENCES } from '../data/authenticManuscriptData';
import { supabase, isSupabaseConfigured } from './supabase';
import { checkRangeOverlap } from './normalization';

const LOCAL_STORAGE_KEY = 'mn_reference_entries';

export interface ReferenceFetchResult {
  entries: ReferenceEntry[];
  source: 'supabase' | 'local_storage' | 'authentic_seed';
  isLiveDbEmpty?: boolean;
}

/**
 * Initializes and retrieves reference entries.
 * If live Supabase has 0 rows, falls back gracefully to authentic baseline references
 * so assessments and reference viewers remain functional with genuine historical data.
 */
export async function getReferenceEntries(isAdmin: boolean = false): Promise<ReferenceEntry[]> {
  const result = await getReferenceEntriesWithMeta(isAdmin);
  return result.entries;
}

export async function getReferenceEntriesWithMeta(isAdmin: boolean = false): Promise<ReferenceFetchResult> {
  // If Supabase is live, attempt to fetch from Postgres
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('reference_entries').select('*');
      if (!isAdmin) {
        query = query.eq('status', 'verified');
      }
      const { data, error } = await query.order('min_val', { ascending: true });
      if (!error && data && data.length > 0) {
        const mapped = data.map(row => ({
          id: row.id,
          sourceId: row.source_id || undefined,
          minVal: Number(row.min_val),
          maxVal: Number(row.max_val),
          unit: row.unit as UnitType,
          traditionalVal: row.traditional_val || undefined,
          tamilText: row.tamil_text,
          englishText: row.english_text || undefined,
          sourceBook: row.source_book,
          pageNo: row.page_no || undefined,
          status: row.status as VerificationStatus,
          reviewer: row.reviewer,
          category: row.category || undefined,
          createdAt: row.created_at,
          updatedAt: row.updated_at
        }));
        return { entries: mapped, source: 'supabase' };
      }

      if (!error && data && data.length === 0) {
        // Table exists in Supabase but contains 0 records.
        // Fall back to local storage or authentic baseline seed data so the system functions.
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          try {
            const parsed: ReferenceEntry[] = JSON.parse(stored);
            if (parsed.length > 0) {
              const filtered = isAdmin ? parsed : parsed.filter(p => p.status === 'verified');
              return { entries: filtered, source: 'local_storage', isLiveDbEmpty: true };
            }
          } catch {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
          }
        }

        // Initialize local cache with authentic manuscript references from Noi Nadal
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_VERIFIED_REFERENCES));
        const filteredSeed = isAdmin ? INITIAL_VERIFIED_REFERENCES : INITIAL_VERIFIED_REFERENCES.filter(p => p.status === 'verified');
        return { entries: filteredSeed, source: 'authentic_seed', isLiveDbEmpty: true };
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
      if (parsed.length > 0) {
        return { entries: isAdmin ? parsed : parsed.filter(p => p.status === 'verified'), source: 'local_storage' };
      }
    } catch {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }

  // Pre-seed with authentic verified entries from Noi Nadal Noi Mudal Nadal Thirattu
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_VERIFIED_REFERENCES));
  const seed = isAdmin ? INITIAL_VERIFIED_REFERENCES : INITIAL_VERIFIED_REFERENCES.filter(p => p.status === 'verified');
  return { entries: seed, source: 'authentic_seed' };
}

/**
 * Adds a new reference entry with overlap validation.
 * Isolates demo mode to localStorage to prevent RLS violations.
 */
export async function addReferenceEntry(
  entry: Omit<ReferenceEntry, 'id' | 'createdAt'>,
  user?: UserProfile | null
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

  const isDemo = user?.isDemo ?? false;

  // If live Supabase is configured and NOT demo mode, persist to Postgres
  if (isSupabaseConfigured && supabase && !isDemo) {
    try {
      const { data, error } = await supabase.from('reference_entries').insert([{
        min_val: entry.minVal,
        max_val: entry.maxVal,
        unit: entry.unit,
        traditional_val: entry.traditionalVal || null,
        tamil_text: entry.tamilText,
        english_text: entry.englishText || null,
        source_book: entry.sourceBook,
        page_no: entry.pageNo || null,
        status: entry.status,
        reviewer: entry.reviewer,
        created_by: user?.id || null
      }]).select().single();

      if (error) {
        return { success: false, error: error.message };
      }

      if (data) {
        newEntry.id = data.id;
      }
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
 * Updates an existing reference entry's status or details (e.g. Draft -> Pending Review -> Verified).
 */
export async function updateReferenceStatus(
  id: string,
  newStatus: VerificationStatus,
  reviewerName: string,
  user?: UserProfile | null
): Promise<{ success: boolean; error?: string }> {
  const isDemo = user?.isDemo ?? false;

  if (isSupabaseConfigured && supabase && !isDemo) {
    try {
      const { error } = await supabase
        .from('reference_entries')
        .update({
          status: newStatus,
          reviewer: reviewerName,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) return { success: false, error: error.message };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  // Update local storage
  const existing = await getReferenceEntries(true);
  const updated = existing.map(e => {
    if (e.id === id) {
      return {
        ...e,
        status: newStatus,
        reviewer: reviewerName,
        updatedAt: new Date().toISOString()
      };
    }
    return e;
  });
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));

  return { success: true };
}

/**
 * Deletes a reference entry.
 */
export async function deleteReferenceEntry(id: string, user?: UserProfile | null): Promise<{ success: boolean; error?: string }> {
  const isDemo = user?.isDemo ?? false;

  if (isSupabaseConfigured && supabase && !isDemo) {
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
export async function clearAllReferenceEntries(user?: UserProfile | null): Promise<{ success: boolean; error?: string }> {
  const isDemo = user?.isDemo ?? false;

  if (isSupabaseConfigured && supabase && !isDemo) {
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

/**
 * Seeds authentic verified reference records into live Supabase database.
 * Requires authenticated admin session in Supabase.
 */
export async function seedInitialReferencesToSupabase(user?: UserProfile | null): Promise<{ success: boolean; count: number; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return { success: false, count: 0, error: 'Supabase is not configured' };
  }

  if (user?.isDemo) {
    return { success: false, count: 0, error: 'Cannot seed live Supabase from Demo session. Please sign in with admin account.' };
  }

  try {
    // Check existing records in Supabase to avoid duplicate inserts
    const { data: existingRows } = await supabase
      .from('reference_entries')
      .select('id, traditional_val, min_val, max_val, unit');

    const existingTraditional = new Set((existingRows || []).map(r => r.traditional_val).filter(Boolean));
    const existingRangeKeys = new Set((existingRows || []).map(r => `${r.min_val}-${r.max_val}-${r.unit}`));

    const missingEntries = INITIAL_VERIFIED_REFERENCES.filter(ref => {
      if (ref.traditionalVal && existingTraditional.has(ref.traditionalVal)) return false;
      const key = `${ref.minVal}-${ref.maxVal}-${ref.unit}`;
      if (existingRangeKeys.has(key)) return false;
      return true;
    });

    if (missingEntries.length === 0) {
      return { success: true, count: 0 };
    }

    const payload = missingEntries.map(ref => ({
      min_val: ref.minVal,
      max_val: ref.maxVal,
      unit: ref.unit,
      traditional_val: ref.traditionalVal || null,
      tamil_text: ref.tamilText,
      english_text: ref.englishText || null,
      source_book: ref.sourceBook,
      page_no: ref.pageNo || null,
      status: ref.status,
      reviewer: ref.reviewer,
      created_by: user?.id || null
    }));

    const { data, error } = await supabase.from('reference_entries').insert(payload).select();
    if (error) {
      return { success: false, count: 0, error: error.message };
    }

    return { success: true, count: data?.length || payload.length };
  } catch (err: any) {
    return { success: false, count: 0, error: err.message || 'Seeding failed' };
  }
}
