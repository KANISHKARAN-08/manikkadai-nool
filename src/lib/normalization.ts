import { UnitType, ReferenceEntry } from '../types';

export interface NormalizedResult {
  cm: number;
  mm: number;
}

export interface ParsedTraditionalValue {
  decimal: number;
  display: string;
  fractionPart?: string;
  wholePart: number;
  isValid: boolean;
}

/**
 * Standard fraction map for Virarkadai (quarter increments: ¼, ½, ¾).
 */
const FRACTION_DECIMALS: Record<string, number> = {
  '¼': 0.25,
  '1/4': 0.25,
  '½': 0.5,
  '1/2': 0.5,
  '¾': 0.75,
  '3/4': 0.75,
};

const DECIMAL_TO_FRACTION: Record<string, string> = {
  '0.25': '¼',
  '0.5': '½',
  '0.50': '½',
  '0.75': '¾',
};

/**
 * Parses any traditional Virarkadai input string or number
 * (e.g. "5 ½", "5 1/2", "5.5", "6 ¼", "9 ¾", "10")
 * into normalized decimal and canonical display format.
 */
export function parseTraditionalVirarkadai(input: string | number): ParsedTraditionalValue {
  if (typeof input === 'number') {
    const whole = Math.floor(input);
    const frac = Number((input - whole).toFixed(2));
    const fracStr = DECIMAL_TO_FRACTION[frac.toFixed(2)] || (frac > 0 ? frac.toString().replace(/^0/, '') : '');
    const display = fracStr ? (whole > 0 ? `${whole} ${fracStr}` : fracStr) : `${whole}`;
    return {
      decimal: Number(input.toFixed(2)),
      display: display.trim(),
      fractionPart: fracStr,
      wholePart: whole,
      isValid: input >= 3 && input <= 12
    };
  }

  const clean = input.trim();
  if (!clean) {
    return { decimal: 0, display: '', wholePart: 0, isValid: false };
  }

  // Check if standard decimal float
  const numericDirect = parseFloat(clean);
  if (!isNaN(numericDirect) && clean.match(/^\d+(\.\d+)?$/)) {
    return parseTraditionalVirarkadai(numericDirect);
  }

  // Match pattern like "5 ½", "5 1/2", "9 ¾"
  const fractionRegex = /^(\d+)?\s*([¼½¾]|1\/4|1\/2|3\/4)?$/;
  const match = clean.match(fractionRegex);

  if (match) {
    const whole = match[1] ? parseInt(match[1], 10) : 0;
    const fracStr = match[2] || '';
    const fracDec = FRACTION_DECIMALS[fracStr] || 0;
    const total = whole + fracDec;

    const canonicalFrac = fracDec === 0.25 ? '¼' : fracDec === 0.5 ? '½' : fracDec === 0.75 ? '¾' : '';
    const display = canonicalFrac ? (whole > 0 ? `${whole} ${canonicalFrac}` : canonicalFrac) : `${whole}`;

    return {
      decimal: Number(total.toFixed(2)),
      display,
      fractionPart: canonicalFrac,
      wholePart: whole,
      isValid: total >= 3 && total <= 12
    };
  }

  return { decimal: 0, display: clean, wholePart: 0, isValid: false };
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
  } else if (unit === 'mm') {
    return {
      cm: Number((cleanVal / 10).toFixed(2)),
      mm: Number(cleanVal.toFixed(1))
    };
  } else {
    // virarkadai has no fixed global mm conversion without individual finger joint calibration
    return { cm: 0, mm: 0 };
  }
}

/**
 * Unit-aware repeat-reading discrepancy check:
 * Thresholds: > 0.3 cm, > 3.0 mm, or > 0.25 Virarkadai.
 */
export function checkRepeatDiscrepancy(
  reading1: number | string,
  reading2: number | string | undefined,
  unit: UnitType
): { hasDiscrepancy: boolean; diff: number; threshold: number } {
  if (reading2 === undefined || reading2 === '') {
    const defThresh = unit === 'cm' ? 0.3 : unit === 'mm' ? 3.0 : 0.25;
    return { hasDiscrepancy: false, diff: 0, threshold: defThresh };
  }

  let num1 = 0;
  let num2 = 0;

  if (unit === 'virarkadai') {
    num1 = parseTraditionalVirarkadai(reading1).decimal;
    num2 = parseTraditionalVirarkadai(reading2).decimal;
  } else {
    num1 = Number(reading1);
    num2 = Number(reading2);
  }

  if (isNaN(num1) || isNaN(num2) || num1 <= 0 || num2 <= 0) {
    const defThresh = unit === 'cm' ? 0.3 : unit === 'mm' ? 3.0 : 0.25;
    return { hasDiscrepancy: false, diff: 0, threshold: defThresh };
  }

  const threshold = unit === 'cm' ? 0.3 : unit === 'mm' ? 3.0 : 0.25;
  const diff = Math.abs(num1 - num2);
  const hasDiscrepancy = diff > threshold;

  return {
    hasDiscrepancy,
    diff: Number(diff.toFixed(2)),
    threshold
  };
}

/**
 * Searches verified reference entries matching a physical measurement in cm or mm.
 * Compares against documented clinical study ranges.
 */
export function findMatchingPhysicalReferences(
  measurement: number,
  unit: UnitType,
  entries: ReferenceEntry[]
): ReferenceEntry[] {
  const norm = normalizeMeasurement(measurement, unit);
  if (norm.cm <= 0) return [];

  return entries.filter(entry => {
    if (entry.status !== 'verified') return false;
    // Only physical reference entries with cm/mm units
    if (entry.unit !== 'cm' && entry.unit !== 'mm') return false;

    const entryMinCm = entry.unit === 'cm' ? entry.minVal : entry.minVal / 10;
    const entryMaxCm = entry.unit === 'cm' ? entry.maxVal : entry.maxVal / 10;

    return norm.cm >= entryMinCm && norm.cm <= entryMaxCm;
  });
}

/**
 * Searches verified reference entries matching a traditional Virarkadai value.
 * Matches exact source record from pages 368-371 of the manuscript.
 */
export function findMatchingTraditionalReferences(
  input: string | number,
  entries: ReferenceEntry[]
): ReferenceEntry[] {
  const parsed = parseTraditionalVirarkadai(input);
  if (!parsed.isValid) return [];

  return entries.filter(entry => {
    if (entry.status !== 'verified') return false;

    // Check if traditional entry
    if (entry.unit === 'virarkadai') {
      // 1. Exact numeric fraction match (e.g. 5.5 === 5.5)
      if (Math.abs(entry.minVal - parsed.decimal) < 0.05) {
        return true;
      }
      // 2. Canonical display string match (e.g. "5 ½" === "5 ½")
      if (entry.traditionalVal && entry.traditionalVal.trim() === parsed.display) {
        return true;
      }
    }

    // Also match physical tiers that reference this traditional range (e.g. traditionalVal "7 ¾ - 8 ¾")
    if (entry.traditionalVal) {
      if (entry.traditionalVal.includes(parsed.display)) {
        return true;
      }
    }

    return false;
  });
}

/**
 * Unified matching function.
 */
export function findMatchingReferences(
  measurement: number | string,
  unit: UnitType,
  entries: ReferenceEntry[]
): ReferenceEntry[] {
  if (unit === 'virarkadai') {
    return findMatchingTraditionalReferences(measurement, entries);
  } else {
    return findMatchingPhysicalReferences(Number(measurement), unit, entries);
  }
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
  if (newUnit === 'virarkadai') {
    for (const entry of existingEntries) {
      if (excludeId && entry.id === excludeId) continue;
      if (entry.unit === 'virarkadai') {
        if (newMin <= entry.maxVal && newMax >= entry.minVal) {
          return { hasOverlap: true, overlappingEntry: entry };
        }
      }
    }
    return { hasOverlap: false };
  }

  const minCm = newUnit === 'cm' ? newMin : newMin / 10;
  const maxCm = newUnit === 'cm' ? newMax : newMax / 10;

  for (const entry of existingEntries) {
    if (excludeId && entry.id === excludeId) continue;
    if (entry.unit === 'virarkadai') continue;

    const entryMinCm = entry.unit === 'cm' ? entry.minVal : entry.minVal / 10;
    const entryMaxCm = entry.unit === 'cm' ? entry.maxVal : entry.maxVal / 10;

    if (minCm <= entryMaxCm && maxCm >= entryMinCm) {
      return { hasOverlap: true, overlappingEntry: entry };
    }
  }

  return { hasOverlap: false };
}
