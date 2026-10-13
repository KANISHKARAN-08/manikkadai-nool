import { UnitType, ReferenceEntry } from '../types';

export interface NormalizedResult {
  cm: number;
  mm: number;
}

/**
 * Accurately normalizes physical wrist circumference measurements:
 * 1 cm = 10 mm.
 */
export function normalizeMeasurement(value: number, unit: UnitType): NormalizedResult {
  const cleanVal = Number(value);
  if (!Number.isFinite(cleanVal) || cleanVal <= 0) {
    return { cm: 0, mm: 0 };
  }

  if (unit === 'cm') {
    return {
      cm: Number(cleanVal.toFixed(2)),
      mm: Number((cleanVal * 10).toFixed(1))
    };
  } else {
    return {
      cm: Number((cleanVal / 10).toFixed(2)),
      mm: Number(cleanVal.toFixed(1))
    };
  }
}

/**
 * Unit-aware repeat-reading discrepancy check:
 * Thresholds: > 0.3 cm or > 3.0 mm.
 */
export function checkRepeatDiscrepancy(
  reading1: number,
  reading2: number | undefined,
  unit: UnitType
): { hasDiscrepancy: boolean; diff: number; threshold: number } {
  if (reading2 === undefined || Number.isNaN(reading2) || reading2 <= 0) {
    return { hasDiscrepancy: false, diff: 0, threshold: unit === 'cm' ? 0.3 : 3.0 };
  }

  const threshold = unit === 'cm' ? 0.3 : 3.0;
  const diff = Math.abs(Number(reading1) - Number(reading2));
  const hasDiscrepancy = diff > threshold;

  return {
    hasDiscrepancy,
    diff: Number(diff.toFixed(2)),
    threshold
  };
}

/**
 * Searches verified reference entries matching a physical measurement.
 * Compares in normalized centimeters to guarantee cross-unit consistency.
 */
export function findMatchingReferences(
  measurement: number,
  unit: UnitType,
  entries: ReferenceEntry[]
): ReferenceEntry[] {
  const norm = normalizeMeasurement(measurement, unit);

  return entries.filter(entry => {
    // Only verified reference entries are eligible for matching in assessment
    if (entry.status !== 'verified') return false;

    // Normalize entry bounds to cm for standardized comparison
    const entryMinCm = entry.unit === 'cm' ? entry.minVal : entry.minVal / 10;
    const entryMaxCm = entry.unit === 'cm' ? entry.maxVal : entry.maxVal / 10;

    return norm.cm >= entryMinCm && norm.cm <= entryMaxCm;
  });
}

/**
 * Checks if a proposed reference range overlaps with any existing reference entry.
 */
export function checkRangeOverlap(
  newMin: number,
  newMax: number,
  newUnit: UnitType,
  existingEntries: ReferenceEntry[],
  excludeId?: string
): { hasOverlap: boolean; overlappingEntry?: ReferenceEntry } {
  const minCm = newUnit === 'cm' ? newMin : newMin / 10;
  const maxCm = newUnit === 'cm' ? newMax : newMax / 10;

  for (const entry of existingEntries) {
    if (excludeId && entry.id === excludeId) continue;

    const entryMinCm = entry.unit === 'cm' ? entry.minVal : entry.minVal / 10;
    const entryMaxCm = entry.unit === 'cm' ? entry.maxVal : entry.maxVal / 10;

    // Overlap exists if [minCm, maxCm] intersects [entryMinCm, entryMaxCm]
    if (minCm <= entryMaxCm && maxCm >= entryMinCm) {
      return { hasOverlap: true, overlappingEntry: entry };
    }
  }

  return { hasOverlap: false };
}
