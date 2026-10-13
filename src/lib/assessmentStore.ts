import { AssessmentRecord, UnitType, ReferenceEntry, MatchStatus } from '../types';
import { normalizeMeasurement, findMatchingReferences } from './normalization';
import { getReferenceEntries } from './referenceStore';
import { supabase, isSupabaseConfigured } from './supabase';

const LOCAL_ASSESSMENTS_KEY = 'mn_assessments_history';

export interface CreateAssessmentInput {
  sessionId?: string;
  measurementVal: number;
  unit: UnitType;
  repeatMeasurement?: number;
  notes?: string;
  userId?: string;
}

/**
 * Creates and persists a new assessment record.
 */
export async function createAssessment(input: CreateAssessmentInput): Promise<AssessmentRecord> {
  const norm = normalizeMeasurement(input.measurementVal, input.unit);
  const references = await getReferenceEntries(false); // only verified
  const matched = findMatchingReferences(input.measurementVal, input.unit, references);

  let matchStatus: MatchStatus = 'no_match';
  if (matched.length === 1) {
    matchStatus = 'matched';
  } else if (matched.length > 1) {
    matchStatus = 'multiple_matches';
  }

  const now = new Date();
  const defaultSessionId = `EXPO-${now.toISOString().slice(0, 10).replace(/-/g, '')}-${now.toTimeString().slice(0, 8).replace(/:/g, '')}`;
  const finalSessionId = input.sessionId?.trim() || defaultSessionId;

  const record: AssessmentRecord = {
    id: `asm-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    userId: input.userId,
    sessionId: finalSessionId,
    measurementVal: input.measurementVal,
    unit: input.unit,
    normalizedCm: norm.cm,
    normalizedMm: norm.mm,
    repeatMeasurement: input.repeatMeasurement,
    notes: input.notes?.trim(),
    matchStatus,
    matchedReferences: matched,
    timestamp: now.toISOString()
  };

  // If Supabase is live, persist in Postgres
  if (isSupabaseConfigured && supabase && input.userId) {
    try {
      const { data, error } = await supabase.from('assessments').insert([{
        user_id: input.userId,
        session_id: finalSessionId,
        measurement_val: input.measurementVal,
        unit: input.unit,
        normalized_cm: norm.cm,
        normalized_mm: norm.mm,
        repeat_measurement: input.repeatMeasurement || null,
        notes: input.notes?.trim() || null,
        match_status: matchStatus,
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
export async function getAssessmentHistory(userId?: string): Promise<AssessmentRecord[]> {
  if (isSupabaseConfigured && supabase && userId) {
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
export async function deleteAssessment(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
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
export async function clearAssessmentHistory(): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('assessments').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    } catch (e) {
      console.warn('Error clearing assessments from Supabase', e);
    }
  }

  localStorage.removeItem(LOCAL_ASSESSMENTS_KEY);
  return true;
}
