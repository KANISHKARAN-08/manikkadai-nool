import assert from 'assert';

// 1. Test Normalization
function normalizeMeasurement(value, unit) {
  const cleanVal = Number(value);
  if (!Number.isFinite(cleanVal) || cleanVal <= 0) return { cm: 0, mm: 0 };
  if (unit === 'cm') {
    return { cm: Number(cleanVal.toFixed(2)), mm: Number((cleanVal * 10).toFixed(1)) };
  } else {
    return { cm: Number((cleanVal / 10).toFixed(2)), mm: Number(cleanVal.toFixed(1)) };
  }
}

console.log('Testing Unit Normalization...');
assert.deepStrictEqual(normalizeMeasurement(16.5, 'cm'), { cm: 16.5, mm: 165.0 });
assert.deepStrictEqual(normalizeMeasurement(165, 'mm'), { cm: 16.5, mm: 165.0 });
assert.deepStrictEqual(normalizeMeasurement(18.23, 'cm'), { cm: 18.23, mm: 182.3 });
console.log('✓ Normalization tests passed.');

// 2. Test Repeat Discrepancy
function checkRepeatDiscrepancy(reading1, reading2, unit) {
  if (reading2 === undefined || Number.isNaN(reading2) || reading2 <= 0) {
    return { hasDiscrepancy: false, diff: 0, threshold: unit === 'cm' ? 0.3 : 3.0 };
  }
  const threshold = unit === 'cm' ? 0.3 : 3.0;
  const diff = Math.abs(Number(reading1) - Number(reading2));
  return { hasDiscrepancy: diff > threshold, diff: Number(diff.toFixed(2)), threshold };
}

console.log('Testing Repeat Discrepancy Thresholds...');
// Diff of 0.2 cm <= 0.3 cm threshold -> No discrepancy
assert.strictEqual(checkRepeatDiscrepancy(16.5, 16.7, 'cm').hasDiscrepancy, false);
// Diff of 0.4 cm > 0.3 cm threshold -> Discrepancy!
assert.strictEqual(checkRepeatDiscrepancy(16.5, 16.9, 'cm').hasDiscrepancy, true);
// Diff of 2 mm <= 3.0 mm threshold -> No discrepancy
assert.strictEqual(checkRepeatDiscrepancy(165, 167, 'mm').hasDiscrepancy, false);
// Diff of 4 mm > 3.0 mm threshold -> Discrepancy!
assert.strictEqual(checkRepeatDiscrepancy(165, 169, 'mm').hasDiscrepancy, true);
console.log('✓ Repeat discrepancy threshold tests passed.');

// 3. Test Overlap Detection
function checkRangeOverlap(newMin, newMax, newUnit, existingEntries) {
  const minCm = newUnit === 'cm' ? newMin : newMin / 10;
  const maxCm = newUnit === 'cm' ? newMax : newMax / 10;
  for (const entry of existingEntries) {
    const entryMinCm = entry.unit === 'cm' ? entry.minVal : entry.minVal / 10;
    const entryMaxCm = entry.unit === 'cm' ? entry.maxVal : entry.maxVal / 10;
    if (minCm <= entryMaxCm && maxCm >= entryMinCm) {
      return { hasOverlap: true, overlappingEntry: entry };
    }
  }
  return { hasOverlap: false };
}

const existing = [
  { minVal: 17.1, maxVal: 19.0, unit: 'cm' },
  { minVal: 14.7, maxVal: 16.6, unit: 'cm' }
];

console.log('Testing Range Overlap Detection...');
// 15.0 - 16.0 cm overlaps with 14.7 - 16.6 cm
assert.strictEqual(checkRangeOverlap(15.0, 16.0, 'cm', existing).hasOverlap, true);
// 12.0 - 14.0 cm does NOT overlap
assert.strictEqual(checkRangeOverlap(12.0, 14.0, 'cm', existing).hasOverlap, false);
// 171 - 180 mm overlaps with 17.1 - 19.0 cm
assert.strictEqual(checkRangeOverlap(171, 180, 'mm', existing).hasOverlap, true);
console.log('✓ Range overlap detection tests passed.');

// 4. Test CSV parsing with Tamil Unicode and quotes
function parseCsv(text) {
  const result = [];
  let currentRow = [];
  let currentCell = '';
  let inQuotes = false;
  const clean = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  for (let i = 0; i < clean.length; i++) {
    const char = clean[i];
    const nextChar = clean[i + 1];
    if (char === '"') {
      if (inQuotes && nextChar === '"') { currentCell += '"'; i++; }
      else { inQuotes = !inQuotes; }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentCell.trim()); currentCell = '';
    } else if (char === '\n' && !inQuotes) {
      currentRow.push(currentCell.trim());
      if (currentRow.some(c => c.length > 0)) result.push(currentRow);
      currentRow = []; currentCell = '';
    } else {
      currentCell += char;
    }
  }
  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some(c => c.length > 0)) result.push(currentRow);
  }
  return result;
}

console.log('Testing CSV Parsing with Tamil characters...');
const testCsv = '"min","max","unit","tamil"\n"14.7","16.6","cm","மூலவாயு, பீனிசம், உடல் காய்தல்"\n';
const parsed = parseCsv(testCsv);
assert.strictEqual(parsed.length, 2);
assert.strictEqual(parsed[1][3], 'மூலவாயு, பீனிசம், உடல் காய்தல்');
console.log('✓ CSV Tamil parsing tests passed.');

console.log('\n=========================================');
console.log('ALL CORE VERIFICATION SUITES PASSED (100%)');
console.log('=========================================\n');
