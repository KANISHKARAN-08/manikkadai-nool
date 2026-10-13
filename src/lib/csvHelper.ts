/**
 * Escapes values for safe CSV formatting.
 */
function escapeCsvCell(val: any): string {
  if (val === null || val === undefined) return '""';
  const str = String(val);
  return '"' + str.replace(/"/g, '""') + '"';
}

/**
 * Exports data rows to CSV file with UTF-8 BOM for perfect Tamil Unicode rendering.
 */
export function downloadCsv(filename: string, headers: string[], rows: (string | number | undefined | null)[][]): void {
  const allRows = [headers, ...rows];
  const csvContent = allRows
    .map(row => row.map(escapeCsvCell).join(','))
    .join('\r\n');

  // Prepend \ufeff UTF-8 BOM to ensure spreadsheet software decodes Tamil characters accurately
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Parses raw CSV text handling quotes, escapes, and multiline values.
 */
export function parseCsv(text: string): string[][] {
  const result: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let inQuotes = false;

  // Normalize line endings
  const clean = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  for (let i = 0; i < clean.length; i++) {
    const char = clean[i];
    const nextChar = clean[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentCell += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = '';
    } else if (char === '\n' && !inQuotes) {
      currentRow.push(currentCell.trim());
      if (currentRow.some(cell => cell.length > 0)) {
        result.push(currentRow);
      }
      currentRow = [];
      currentCell = '';
    } else {
      currentCell += char;
    }
  }

  // Push last cell & row if non-empty
  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some(cell => cell.length > 0)) {
      result.push(currentRow);
    }
  }

  return result;
}
