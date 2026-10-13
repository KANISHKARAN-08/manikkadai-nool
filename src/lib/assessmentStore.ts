import { AssessmentRecord, UnitType, ReferenceEntry, MatchStatus, UserProfile } from '../types';
import { normalizeMeasurement, findMatchingReferences, parseTraditionalVirarkadai } from './normalization';
import { getReferenceEntries } from './referenceStore';
import { supabase, isSupabaseConfigured } from './supabase';

const LOCAL_ASSESSMENTS_KEY = 'mn_assessments_history';

export interface CreateAssessmentInput {
  sessionId?: string;
  measurementMode: 'traditional' | 'physical';
  measurementVal: number | string;
  unit: UnitType;
  repeatMeasurement?: number | string;
  notes?: string;
  userId?: string;
}

/**
 * Creates and persists a new assessment record.
 */
export async function createAssessment(
  input: CreateAssessmentInput,
  user?: UserProfile | null
): Promise<AssessmentRecord> {
  const references = await getReferenceEntries(false); // only verified references

  let norm = { cm: 0, mm: 0 };
  let traditionalStr: string | undefined = undefined;

  if (input.unit === 'virarkadai' || input.measurementMode === 'traditional') {
    const parsed = parseTraditionalVirarkadai(input.measurementVal);
    traditionalStr = parsed.display;
  } else {
    norm = normalizeMeasurement(Number(input.measurementVal), input.unit);
  }

  const matched = findMatchingReferences(input.measurementVal, input.unit, references);

  let matchStatus: MatchStatus = 'no_match';
  if (matched.length === 1) {
    matchStatus = 'matched';
  } else if (matched.length > 1) {
    matchStatus = 'multiple_matches';
  } else if (input.measurementMode === 'physical' && matched.length === 0) {
    // Check if within physical study ranges
    matchStatus = 'unsupported_conversion';
  }

  const now = new Date();
  const defaultSessionId = `EXPO-${now.toISOString().slice(0, 10).replace(/-/g, '')}-${now.toTimeString().slice(0, 8).replace(/:/g, '')}`;
  const finalSessionId = input.sessionId?.trim() || defaultSessionId;

  const record: AssessmentRecord = {
    id: `asm-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    userId: input.userId,
    sessionId: finalSessionId,
    measurementMode: input.measurementMode,
    measurementVal: input.measurementVal,
    unit: input.unit,
    normalizedCm: norm.cm > 0 ? norm.cm : undefined,
    normalizedMm: norm.mm > 0 ? norm.mm : undefined,
    traditionalVal: traditionalStr,
    repeatMeasurement: input.repeatMeasurement,
    notes: input.notes?.trim(),
    matchStatus,
    matchedReferences: matched,
    timestamp: now.toISOString()
  };

  const isDemo = user?.isDemo ?? false;

  // If Supabase is live and user is authenticated (not demo), persist to Postgres
  if (isSupabaseConfigured && supabase && input.userId && !isDemo) {
    try {
      const numVal = input.unit === 'virarkadai' 
        ? parseTraditionalVirarkadai(input.measurementVal).decimal 
        : Number(input.measurementVal);

      const dbUnit = input.unit === 'virarkadai' ? 'cm' : input.unit; // fallback to 'cm' if db check constraint hasn't been updated

      const { data, error } = await supabase.from('assessments').insert([{
        user_id: input.userId,
        session_id: finalSessionId,
        measurement_val: numVal,
        unit: dbUnit,
        normalized_cm: norm.cm,
        normalized_mm: norm.mm,
        repeat_measurement: input.repeatMeasurement ? Number(input.repeatMeasurement) || null : null,
        notes: input.notes?.trim() || null,
        match_status: matchStatus === 'unsupported_conversion' ? 'no_match' : matchStatus,
        matched_reference_ids: matched.map(m => m.id)
      }]).select().single();

      if (!error && data) {
        record.id = data.id;
      }
    } catch (e) {
      console.warn('Supabase assessment insertion error, saved to local cache', e);
    }
  }

  // Update local storage
  const stored = getLocalAssessments();
  const updated = [record, ...stored];
  localStorage.setItem(LOCAL_ASSESSMENTS_KEY, JSON.stringify(updated.slice(0, 500)));

  return record;
}

function getLocalAssessments(): AssessmentRecord[] {
  const stored = localStorage.getItem(LOCAL_ASSESSMENTS_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

/**
 * Retrieves assessment history for the current user.
 */
export async function getAssessmentHistory(user?: UserProfile | null): Promise<AssessmentRecord[]> {
  const isDemo = user?.isDemo ?? false;
  const userId = user?.id;

  if (isSupabaseConfigured && supabase && userId && !isDemo) {
    try {
      const { data, error } = await supabase
        .from('assessments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        const allRefs = await getReferenceEntries(true);
        const refMap = new Map<string, ReferenceEntry>(allRefs.map(r => [r.id, r]));

        return data.map(row => {
          const matchedIds: string[] = Array.isArray(row.matched_reference_ids)
            ? row.matched_reference_ids
            : [];
          const matchedRefs = matchedIds
            .map(id => refMap.get(id))
            .filter((r): r is ReferenceEntry => Boolean(r));

          return {
            id: row.id,
            userId: row.user_id,
            sessionId: row.session_id,
            measurementMode: 'physical',
            measurementVal: Number(row.measurement_val),
            unit: row.unit as UnitType,
            normalizedCm: Number(row.normalized_cm),
            normalizedMm: Number(row.normalized_mm),
            repeatMeasurement: row.repeat_measurement ? Number(row.repeat_measurement) : undefined,
            notes: row.notes || undefined,
            matchStatus: row.match_status as MatchStatus,
            matchedReferences: matchedRefs,
            timestamp: row.created_at
          };
        });
      }
    } catch (e) {
      console.warn('Supabase fetch failed for assessments', e);
    }
  }

  return getLocalAssessments();
}

/**
 * Deletes an individual assessment record.
 */
export async function deleteAssessment(id: string, user?: UserProfile | null): Promise<boolean> {
  const isDemo = user?.isDemo ?? false;

  if (isSupabaseConfigured && supabase && !isDemo) {
    try {
      await supabase.from('assessments').delete().eq('id', id);
    } catch (e) {
      console.warn('Error deleting assessment from Supabase', e);
    }
  }

  const stored = getLocalAssessments();
  const filtered = stored.filter(s => s.id !== id);
  localStorage.setItem(LOCAL_ASSESSMENTS_KEY, JSON.stringify(filtered));
  return true;
}

/**
 * Clears all assessment history.
 */
export async function clearAssessmentHistory(user?: UserProfile | null): Promise<boolean> {
  const isDemo = user?.isDemo ?? false;

  if (isSupabaseConfigured && supabase && !isDemo) {
    try {
      await supabase.from('assessments').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    } catch (e) {
      console.warn('Error clearing assessments from Supabase', e);
    }
  }

  localStorage.removeItem(LOCAL_ASSESSMENTS_KEY);
  return true;
}
