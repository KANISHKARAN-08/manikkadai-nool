import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { 
  getReferenceEntries, 
  addReferenceEntry, 
  deleteReferenceEntry, 
  clearAllReferenceEntries 
} from '../../lib/referenceStore';
import { downloadCsv, parseCsv } from '../../lib/csvHelper';
import { ReferenceEntry, UnitType, VerificationStatus } from '../../types';
import { 
  Search, 
  Plus, 
  Download, 
  Upload, 
  Trash2, 
  ShieldCheck, 
  Clock, 
  FileText, 
  AlertTriangle,
  X,
  BookOpen
} from 'lucide-react';

export const ReferenceView: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [entries, setEntries] = useState<ReferenceEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);

  // New Entry Modal Form State
  const [minVal, setMinVal] = useState('');
  const [maxVal, setMaxVal] = useState('');
  const [unit, setUnit] = useState<UnitType>('cm');
  const [traditionalVal, setTraditionalVal] = useState('');
  const [tamilText, setTamilText] = useState('');
  const [englishText, setEnglishText] = useState('');
  const [sourceBook, setSourceBook] = useState('');
  const [pageNo, setPageNo] = useState('');
  const [reviewer, setReviewer] = useState('');
  const [status, setStatus] = useState<VerificationStatus>('verified');

  useEffect(() => {
    loadEntries();
  }, [isAdmin]);

  const loadEntries = async () => {
    const data = await getReferenceEntries(isAdmin);
    setEntries(data);
  };

  // Filtered entries
  const filteredEntries = entries.filter((e) => {
    const matchesUnit = selectedUnit === 'all' || e.unit === selectedUnit;
    const matchesStatus = selectedStatus === 'all' || e.status === selectedStatus;
    const q = searchTerm.toLowerCase();
    const matchesSearch = 
      !searchTerm ||
      e.tamilText.toLowerCase().includes(q) ||
      (e.englishText && e.englishText.toLowerCase().includes(q)) ||
      (e.traditionalVal && e.traditionalVal.toLowerCase().includes(q)) ||
      e.sourceBook.toLowerCase().includes(q) ||
      e.reviewer.toLowerCase().includes(q);

    return matchesUnit && matchesStatus && matchesSearch;
  });

  // Handle Add Entry
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const min = parseFloat(minVal);
    const max = parseFloat(maxVal);

    if (isNaN(min) || isNaN(max)) {
      alert('Please enter valid numeric minimum and maximum values.');
      return;
    }

    if (min > max) {
      alert('Minimum circumference must be less than or equal to maximum circumference.');
      return;
    }

    const res = await addReferenceEntry({
      minVal: min,
      maxVal: max,
      unit,
      traditionalVal: traditionalVal.trim() || undefined,
      tamilText: tamilText.trim(),
      englishText: englishText.trim() || undefined,
      sourceBook: sourceBook.trim(),
      pageNo: pageNo.trim() || undefined,
      status,
      reviewer: reviewer.trim() || (user?.fullName || 'Academic Reviewer')
    }, user?.id);

    if (!res.success) {
      alert(`Error saving reference entry: ${res.error}`);
      return;
    }

    if (res.overlapWarning) {
      alert(t.references.overlapWarning);
    } else {
      alert(t.references.savedSuccess);
    }

    // Reset and reload
    setModalOpen(false);
    setMinVal('');
    setMaxVal('');
    setTraditionalVal('');
    setTamilText('');
    setEnglishText('');
    setSourceBook('');
    setPageNo('');
    setReviewer('');
    loadEntries();
  };

  // Delete single entry
  const handleDelete = async (id: string) => {
    if (!confirm(t.references.deleteConfirm)) return;
    await deleteReferenceEntry(id);
    loadEntries();
  };

  // Clear all
  const handleClearAll = async () => {
    if (!confirm(t.references.clearConfirm)) return;
    await clearAllReferenceEntries();
    loadEntries();
  };

  // Export to CSV
  const handleExportCsv = () => {
    const headers = ['min', 'max', 'unit', 'traditional', 'tamil', 'english', 'source', 'page', 'reviewer', 'status'];
    const rows = entries.map(e => [
      e.minVal,
      e.maxVal,
      e.unit,
      e.traditionalVal || '',
      e.tamilText,
      e.englishText || '',
      e.sourceBook,
      e.pageNo || '',
      e.reviewer,
      e.status
    ]);
    downloadCsv('manikkadai_reference_library', headers, rows);
  };

  // Import from CSV
  const handleImportCsv = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const rows = parseCsv(text);
      if (rows.length < 2) {
        alert('Invalid CSV file: at least one data row is required.');
        return;
      }

      // Identify header row
      const firstRow = rows[0].map(c => c.toLowerCase());
      const hasHeader = firstRow.includes('min') || firstRow.includes('tamil');
      const dataRows = hasHeader ? rows.slice(1) : rows;

      let importCount = 0;
      for (const row of dataRows) {
        const min = parseFloat(row[0]);
        const max = parseFloat(row[1]);
        const u = (row[2] || 'cm').trim() as UnitType;
        const trad = row[3] || undefined;
        const tamil = row[4] || '';
        const eng = row[5] || undefined;
        const src = row[6] || 'Imported Reference';
        const page = row[7] || undefined;
        const rev = row[8] || 'CSV Import Reviewer';
        const st = (row[9] as VerificationStatus) || 'pending_review';

        if (!isNaN(min) && !isNaN(max) && min <= max && tamil.trim()) {
          await addReferenceEntry({
            minVal: min,
            maxVal: max,
            unit: u === 'mm' ? 'mm' : 'cm',
            traditionalVal: trad,
            tamilText: tamil.trim(),
            englishText: eng?.trim(),
            sourceBook: src.trim(),
            pageNo: page?.trim(),
            reviewer: rev.trim(),
            status: st
          }, user?.id);
          importCount++;
        }
      }

      alert(`Successfully imported ${importCount} reference entries.`);
      loadEntries();
    } catch (err: any) {
      alert(`CSV import error: ${err.message}`);
    } finally {
      e.target.value = '';
    }
  };

  return (
    <div className="py-12 bg-[#F6F3E9] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#123C35] text-[#D9AD54] text-xs font-mono font-bold tracking-wider uppercase mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>AUTHENTICATED REFERENCE REPOSITORY</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#123C35]">
              {t.references.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#68736F] mt-1">
              {t.references.subtitle}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {isAdmin && (
              <button
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#123C35] hover:bg-[#194D42] text-[#FFFDF8] font-bold text-xs shadow-md transition-all"
              >
                <Plus className="w-4 h-4 text-[#D9AD54]" />
                <span>{t.references.addEntryBtn}</span>
              </button>
            )}

            <button
              onClick={handleExportCsv}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#FFFDF8] text-[#123C35] border border-[#E3E4DA] font-bold text-xs hover:bg-[#E8EFE8] transition-all"
            >
              <Download className="w-4 h-4 text-[#194D42]" />
              <span>{t.references.exportCsv}</span>
            </button>

            {isAdmin && (
              <>
                <label className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#FFFDF8] text-[#123C35] border border-[#E3E4DA] font-bold text-xs hover:bg-[#E8EFE8] cursor-pointer transition-all">
                  <Upload className="w-4 h-4 text-[#194D42]" />
                  <span>{t.references.importCsv}</span>
                  <input
                    type="file"
                    accept=".csv,text/csv"
                    onChange={handleImportCsv}
                    className="hidden"
                  />
                </label>

                <button
                  onClick={handleClearAll}
                  className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#8B2D2D]/10 hover:bg-[#8B2D2D] text-[#8B2D2D] hover:text-white font-bold text-xs transition-all"
                  title={t.references.clearAll}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-4 rounded-2xl bg-[#FFFDF8] border border-[#E3E4DA] shadow-sm flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#829B83] absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.references.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#CBD2C9] bg-white text-xs sm:text-sm text-[#1E2926] focus:outline-none focus:ring-2 focus:ring-[#123C35]"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="px-3 py-2 rounded-xl border border-[#CBD2C9] bg-white text-xs font-semibold text-[#123C35]"
            >
              <option value="all">{t.references.filterUnitAll}</option>
              <option value="cm">cm only</option>
              <option value="mm">mm only</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 rounded-xl border border-[#CBD2C9] bg-white text-xs font-semibold text-[#123C35]"
            >
              <option value="all">{t.references.filterStatusAll}</option>
              <option value="verified">{t.references.statusVerified}</option>
              <option value="pending_review">{t.references.statusPending}</option>
              <option value="draft">{t.references.statusDraft}</option>
            </select>
          </div>
        </div>

        {/* References Table */}
        <div className="rounded-2xl bg-[#FFFDF8] border border-[#E3E4DA] shadow-card overflow-hidden">
          {filteredEntries.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <BookOpen className="w-10 h-10 text-[#829B83] mx-auto opacity-60" />
              <p className="text-sm font-semibold text-[#68736F]">
                {t.references.noEntriesFound}
              </p>
              <p className="text-xs text-[#829B83] max-w-md mx-auto">
                {t.references.emptyNotice}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-[#123C35] text-[#123C35] bg-[#F6F3E9]">
                    <th className="py-3 px-4 font-bold">{t.references.rangeCol}</th>
                    <th className="py-3 px-4 font-bold">{t.references.traditionalCol}</th>
                    <th className="py-3 px-4 font-bold">{t.references.textCol}</th>
                    <th className="py-3 px-4 font-bold">{t.references.sourceCol}</th>
                    <th className="py-3 px-4 font-bold">{t.references.statusCol}</th>
                    {isAdmin && <th className="py-3 px-4 font-bold text-right">{t.references.actionsCol}</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3E4DA]">
                  {filteredEntries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-[#F6F3E9]/60 transition-colors">
                      
                      {/* Physical Range */}
                      <td className="py-4 px-4 align-top whitespace-nowrap font-mono font-bold text-sm text-[#123C35]">
                        {entry.minVal} – {entry.maxVal} {entry.unit}
                      </td>

                      {/* Virarkadai */}
                      <td className="py-4 px-4 align-top whitespace-nowrap">
                        {entry.traditionalVal ? (
                          <span className="inline-block px-2 py-0.5 rounded bg-[#123C35]/10 text-[#123C35] font-bold font-mono">
                            {entry.traditionalVal} விரற்கடை
                          </span>
                        ) : (
                          <span className="text-[#829B83] italic">Unmapped</span>
                        )}
                      </td>

                      {/* Tamil & English Text */}
                      <td className="py-4 px-4 align-top max-w-md space-y-1">
                        <div className="font-tamil text-sm text-[#1E2926] leading-relaxed font-medium">
                          {entry.tamilText}
                        </div>
                        {entry.englishText && (
                          <div className="text-xs text-[#68736F] leading-relaxed italic">
                            {entry.englishText}
                          </div>
                        )}
                      </td>

                      {/* Source & Reviewer */}
                      <td className="py-4 px-4 align-top text-xs text-[#68736F] whitespace-nowrap">
                        <div className="font-semibold text-[#123C35]">{entry.sourceBook}</div>
                        {entry.pageNo && <div>p. {entry.pageNo}</div>}
                        <div className="text-[11px] text-[#829B83] mt-0.5">Rev: {entry.reviewer}</div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 align-top whitespace-nowrap">
                        {entry.status === 'verified' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E1ECE3] text-[#123C35] font-bold text-[11px]">
                            <ShieldCheck className="w-3 h-3 text-[#194D42]" />
                            <span>{t.references.statusVerified}</span>
                          </span>
                        )}
                        {entry.status === 'pending_review' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFF4D7] text-[#87560B] font-bold text-[11px]">
                            <Clock className="w-3 h-3 text-[#D97706]" />
                            <span>{t.references.statusPending}</span>
                          </span>
                        )}
                        {entry.status === 'draft' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E8EFE8] text-[#68736F] font-bold text-[11px]">
                            <FileText className="w-3 h-3" />
                            <span>{t.references.statusDraft}</span>
                          </span>
                        )}
                      </td>

                      {/* Admin Actions */}
                      {isAdmin && (
                        <td className="py-4 px-4 align-top text-right whitespace-nowrap">
                          <button
                            onClick={() => handleDelete(entry.id)}
                            className="p-1.5 rounded-lg text-[#8B2D2D] hover:bg-[#8B2D2D]/10 transition-colors"
                            title={t.references.delete}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      )}

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* ADD REFERENCE ENTRY MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-[#123C35]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFFDF8] rounded-2xl border-2 border-[#123C35] shadow-2xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6 animate-fade-in">
            
            <div className="flex items-center justify-between border-b border-[#E3E4DA] pb-4">
              <div>
                <span className="text-[11px] font-mono text-[#D9AD54] uppercase font-bold">EDITORIAL PORTAL</span>
                <h3 className="font-serif text-2xl font-bold text-[#123C35]">
                  {t.references.addEntryBtn}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-lg text-[#68736F] hover:bg-[#F6F3E9]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              
              {/* Range Bounds */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#194D42] mb-1">
                    {t.admin.minBound} *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={minVal}
                    onChange={(e) => setMinVal(e.target.value)}
                    placeholder="e.g. 14.5"
                    className="w-full px-3 py-2 rounded-xl border border-[#CBD2C9] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#194D42] mb-1">
                    {t.admin.maxBound} *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={maxVal}
                    onChange={(e) => setMaxVal(e.target.value)}
                    placeholder="e.g. 16.0"
                    className="w-full px-3 py-2 rounded-xl border border-[#CBD2C9] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#194D42] mb-1">
                    {t.admin.unitSelect}
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as UnitType)}
                    className="w-full px-3 py-2 rounded-xl border border-[#CBD2C9] text-sm font-bold text-[#123C35]"
                  >
                    <option value="cm">cm</option>
                    <option value="mm">mm</option>
                  </select>
                </div>
              </div>

              {/* Traditional Virarkadai Value */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#194D42] mb-1">
                  {t.admin.traditionalField}
                </label>
                <input
                  type="text"
                  value={traditionalVal}
                  onChange={(e) => setTraditionalVal(e.target.value)}
                  placeholder="e.g. 8 ¾ or 7 ½ - 8 ¾"
                  className="w-full px-3 py-2 rounded-xl border border-[#CBD2C9] text-sm"
                />
              </div>

              {/* Tamil Text */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#194D42] mb-1">
                  {t.admin.tamilField} *
                </label>
                <textarea
                  rows={3}
                  required
                  value={tamilText}
                  onChange={(e) => setTamilText(e.target.value)}
                  placeholder="அசல் தமிழ் மருத்துவ உரை / பாடல் விளக்கம்..."
                  className="w-full px-3 py-2 rounded-xl border border-[#CBD2C9] text-sm font-tamil"
                />
              </div>

              {/* English Text */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#194D42] mb-1">
                  {t.admin.englishField}
                </label>
                <textarea
                  rows={2}
                  value={englishText}
                  onChange={(e) => setEnglishText(e.target.value)}
                  placeholder="Reviewed English translation or academic notes..."
                  className="w-full px-3 py-2 rounded-xl border border-[#CBD2C9] text-sm"
                />
              </div>

              {/* Source & Reviewer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#194D42] mb-1">
                    {t.admin.sourceField} *
                  </label>
                  <input
                    type="text"
                    required
                    value={sourceBook}
                    onChange={(e) => setSourceBook(e.target.value)}
                    placeholder="Book title, edition"
                    className="w-full px-3 py-2 rounded-xl border border-[#CBD2C9] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#194D42] mb-1">
                    Page Number
                  </label>
                  <input
                    type="text"
                    value={pageNo}
                    onChange={(e) => setPageNo(e.target.value)}
                    placeholder="e.g. 368"
                    className="w-full px-3 py-2 rounded-xl border border-[#CBD2C9] text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#194D42] mb-1">
                    {t.admin.reviewerField} *
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewer}
                    onChange={(e) => setReviewer(e.target.value)}
                    placeholder="Faculty member / physician"
                    className="w-full px-3 py-2 rounded-xl border border-[#CBD2C9] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#194D42] mb-1">
                    {t.admin.statusSelect}
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as VerificationStatus)}
                    className="w-full px-3 py-2 rounded-xl border border-[#CBD2C9] text-sm font-semibold"
                  >
                    <option value="verified">Verified (Eligible for Assessment Matching)</option>
                    <option value="pending_review">Pending Review</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#E3E4DA] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#CBD2C9] text-xs font-bold text-[#68736F]"
                >
                  {t.admin.cancelBtn}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#123C35] text-[#FFFDF8] text-xs font-bold hover:bg-[#194D42] shadow-sm"
                >
                  {t.admin.saveBtn}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
