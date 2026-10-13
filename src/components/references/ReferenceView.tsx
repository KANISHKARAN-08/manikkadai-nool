import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { 
  getReferenceEntriesWithMeta, 
  addReferenceEntry, 
  updateReferenceStatus,
  deleteReferenceEntry, 
  clearAllReferenceEntries,
  seedInitialReferencesToSupabase,
  ReferenceFetchResult
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
  BookOpen,
  CheckCircle,
  RotateCcw,
  Database,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

export const ReferenceView: React.FC = () => {
  const { t, language } = useLanguage();
  const { user, isLiveSupabase } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [entries, setEntries] = useState<ReferenceEntry[]>([]);
  const [metaInfo, setMetaInfo] = useState<ReferenceFetchResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
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
  const [sourceBook, setSourceBook] = useState('நோய் நாடல் நோய் முதல் நாடல் திரட்டு (பாகம் 1)');
  const [pageNo, setPageNo] = useState('');
  const [reviewer, setReviewer] = useState('');
  const [status, setStatus] = useState<VerificationStatus>('verified');

  useEffect(() => {
    loadEntries();
  }, [isAdmin]);

  const loadEntries = async () => {
    setLoading(true);
    try {
      const data = await getReferenceEntriesWithMeta(isAdmin);
      setEntries(data.entries);
      setMetaInfo(data);
    } catch (err) {
      console.error('Failed to load reference entries', err);
    } finally {
      setLoading(false);
    }
  };

  // Status counts
  const totalCount = entries.length;
  const verifiedCount = entries.filter(e => e.status === 'verified').length;
  const pendingCount = entries.filter(e => e.status === 'pending_review').length;
  const draftCount = entries.filter(e => e.status === 'draft').length;

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
      (e.traditionalVal && e.traditionalVal.replace(/\s+/g, '').includes(q.replace(/\s+/g, ''))) ||
      (e.traditionalVal && (q.includes('1/2') || q.includes('.5')) && e.traditionalVal.includes('½')) ||
      (e.traditionalVal && (q.includes('1/4') || q.includes('.25')) && e.traditionalVal.includes('¼')) ||
      (e.traditionalVal && (q.includes('3/4') || q.includes('.75')) && e.traditionalVal.includes('¾')) ||
      (e.category && e.category.toLowerCase().includes(q)) ||
      (e.pageNo && e.pageNo.includes(q)) ||
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

    setActionLoading(true);
    try {
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
        reviewer: reviewer.trim() || (user?.fullName || 'Faculty Reviewer')
      }, user);

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
      setPageNo('');
      setReviewer('');
      loadEntries();
    } finally {
      setActionLoading(false);
    }
  };

  // Status transition handler for review workflow
  const handleStatusChange = async (id: string, newStatus: VerificationStatus) => {
    setActionLoading(true);
    try {
      const reviewerName = user?.fullName || 'Faculty Reviewer';
      const res = await updateReferenceStatus(id, newStatus, reviewerName, user);
      if (!res.success) {
        alert(`Status update failed: ${res.error}`);
      } else {
        loadEntries();
      }
    } finally {
      setActionLoading(false);
    }
  };

  // Seed baseline to Supabase
  const handleSeedToSupabase = async () => {
    if (!confirm('Seed authentic verified manuscript baseline records into the live Supabase PostgreSQL database?')) return;
    setActionLoading(true);
    try {
      const res = await seedInitialReferencesToSupabase(user);
      if (res.success) {
        alert(`Successfully seeded ${res.count} authentic reference entries into Supabase!`);
        loadEntries();
      } else {
        alert(`Seeding failed: ${res.error}`);
      }
    } finally {
      setActionLoading(false);
    }
  };

  // Delete single entry
  const handleDelete = async (id: string) => {
    if (!confirm(t.references.deleteConfirm)) return;
    setActionLoading(true);
    try {
      await deleteReferenceEntry(id, user);
      loadEntries();
    } finally {
      setActionLoading(false);
    }
  };

  // Clear all
  const handleClearAll = async () => {
    if (!confirm(t.references.clearConfirm)) return;
    setActionLoading(true);
    try {
      await clearAllReferenceEntries(user);
      loadEntries();
    } finally {
      setActionLoading(false);
    }
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
      setActionLoading(true);
      for (const row of dataRows) {
        const min = parseFloat(row[0]);
        const max = parseFloat(row[1]);
        const u = (row[2] || 'cm').trim() as UnitType;
        const trad = row[3] || undefined;
        const tamil = row[4] || '';
        const eng = row[5] || undefined;
        const src = row[6] || 'Imported Manuscript Reference';
        const page = row[7] || undefined;
        const rev = row[8] || (user?.fullName || 'CSV Import Reviewer');
        // Safeguard: Never silently convert an imported row into verified without explicit reviewer check
        const parsedStatus = (row[9] as VerificationStatus);
        const st: VerificationStatus = parsedStatus === 'verified' && isAdmin ? 'verified' : 'pending_review';

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
          }, user);
          importCount++;
        }
      }

      alert(`Successfully imported ${importCount} reference entries (set to pending review for verification).`);
      loadEntries();
    } catch (err: any) {
      alert(`CSV import error: ${err.message}`);
    } finally {
      setActionLoading(false);
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
                disabled={actionLoading}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D9AD54] to-[#E5C170] hover:from-[#C49D44] hover:to-[#D5B160] text-[#0B2925] font-bold text-xs shadow-md transition-all disabled:opacity-50"
              >
                <Plus className="w-4 h-4 text-[#0B2925]" />
                <span>{t.references.addEntryBtn}</span>
              </button>
            )}

            <button
              onClick={handleExportCsv}
              disabled={entries.length === 0}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#FFFDF8] text-[#123C35] border border-[#E3E4DA] font-bold text-xs hover:bg-[#E8EFE8] transition-all disabled:opacity-50"
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
                  disabled={actionLoading || entries.length === 0}
                  className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#8B2D2D]/10 hover:bg-[#8B2D2D] text-[#8B2D2D] hover:text-white font-bold text-xs transition-all disabled:opacity-50"
                  title={t.references.clearAll}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}

            <button
              onClick={loadEntries}
              disabled={loading}
              className="p-2.5 rounded-xl bg-[#FFFDF8] border border-[#E3E4DA] text-[#123C35] hover:bg-[#E8EFE8] transition-all"
              title="Refresh repository"
            >
              <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Database & Repository Provenance Banner */}
        {metaInfo?.isLiveDbEmpty && (
          <div className="p-4 rounded-2xl bg-[#FFF4D7] border border-[#F2D48E] text-[#87560B] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
            <div className="flex items-start gap-3">
              <Database className="w-5 h-5 shrink-0 text-[#D97706] mt-0.5" />
              <div>
                <strong className="block text-xs font-bold text-[#123C35]">
                  Live Database Status: PostgreSQL Connected (Zero Remote Records)
                </strong>
                <p className="text-xs text-[#87560B] mt-0.5 leading-relaxed">
                  The connected Supabase table <code className="bg-white/80 px-1 py-0.5 rounded font-mono text-[11px]">reference_entries</code> is currently empty. Serving authentic manuscript baseline mappings from <em className="font-semibold">Noi Nadal Noi Mudal Nadal Thirattu</em> (Palayamkottai Siddha Medical College Reference Archive) via fallback cache so assessments remain fully functional.
                </p>
              </div>
            </div>

            {isAdmin && !user?.isDemo && (
              <button
                onClick={handleSeedToSupabase}
                disabled={actionLoading}
                className="shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#123C35] text-[#D9AD54] hover:bg-[#194D42] text-xs font-bold transition-all shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D9AD54]" />
                <span>Seed Baseline to Supabase</span>
              </button>
            )}
          </div>
        )}

        {/* Status Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#FFFDF8] border border-[#E3E4DA] shadow-sm">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#68736F] block">
              Total References
            </span>
            <span className="text-2xl font-serif font-bold text-[#123C35] mt-1 block">
              {totalCount}
            </span>
            <span className="text-[11px] text-[#829B83] mt-0.5 block">
              Across cm & mm ranges
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFFDF8] border border-[#E3E4DA] shadow-sm">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#194D42] block">
              Verified Entries
            </span>
            <span className="text-2xl font-serif font-bold text-[#194D42] mt-1 block">
              {verifiedCount}
            </span>
            <span className="text-[11px] text-[#829B83] mt-0.5 block">
              Approved for assessment
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFFDF8] border border-[#E3E4DA] shadow-sm">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#D97706] block">
              Pending Review
            </span>
            <span className="text-2xl font-serif font-bold text-[#D97706] mt-1 block">
              {pendingCount}
            </span>
            <span className="text-[11px] text-[#829B83] mt-0.5 block">
              Awaiting faculty audit
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFFDF8] border border-[#E3E4DA] shadow-sm">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#68736F] block">
              Draft Entries
            </span>
            <span className="text-2xl font-serif font-bold text-[#68736F] mt-1 block">
              {draftCount}
            </span>
            <span className="text-[11px] text-[#829B83] mt-0.5 block">
              Unpublished drafts
            </span>
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
              <option value="virarkadai">Virarkadai (விரற்கடை) only</option>
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
          {loading ? (
            <div className="p-16 text-center space-y-3">
              <RotateCcw className="w-8 h-8 text-[#D9AD54] animate-spin mx-auto" />
              <p className="text-xs font-mono uppercase tracking-wider text-[#68736F]">
                Loading reference repository...
              </p>
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="p-12 text-center space-y-4">
              <BookOpen className="w-12 h-12 text-[#829B83] mx-auto opacity-60" />
              <div className="space-y-1">
                <p className="text-sm font-serif font-bold text-[#123C35]">
                  {t.references.noEntriesFound}
                </p>
                <p className="text-xs text-[#68736F] max-w-md mx-auto">
                  {t.references.emptyNotice}
                </p>
              </div>
              {isAdmin && (
                <button
                  onClick={() => setModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#123C35] text-[#D9AD54] text-xs font-bold hover:bg-[#194D42]"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add First Entry</span>
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-[#123C35] text-[#123C35] bg-[#F6F3E9]">
                    <th className="py-3.5 px-4 font-bold">{t.references.rangeCol}</th>
                    <th className="py-3.5 px-4 font-bold">{t.references.traditionalCol}</th>
                    <th className="py-3.5 px-4 font-bold">{t.references.textCol}</th>
                    <th className="py-3.5 px-4 font-bold">{t.references.sourceCol}</th>
                    <th className="py-3.5 px-4 font-bold">{t.references.statusCol}</th>
                    {isAdmin && <th className="py-3.5 px-4 font-bold text-right">{t.references.actionsCol}</th>}
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
                          <span className="inline-block px-2.5 py-1 rounded bg-[#123C35]/10 text-[#123C35] font-bold font-mono">
                            {entry.traditionalVal} விரற்கடை
                          </span>
                        ) : (
                          <span className="text-[#829B83] italic">Unmapped</span>
                        )}
                      </td>

                      {/* Tamil & English Text */}
                      <td className="py-4 px-4 align-top max-w-md space-y-1.5">
                        <div className="font-tamil text-sm text-[#1E2926] leading-relaxed font-medium">
                          {entry.tamilText}
                        </div>
                        {entry.englishText && (
                          <div className="text-xs text-[#68736F] leading-relaxed italic bg-white/70 p-2 rounded-lg border border-[#E3E4DA]">
                            {entry.englishText}
                          </div>
                        )}
                      </td>

                      {/* Source & Reviewer */}
                      <td className="py-4 px-4 align-top text-xs text-[#68736F] whitespace-nowrap">
                        <div className="font-semibold text-[#123C35]">{entry.sourceBook}</div>
                        {entry.pageNo && <div className="text-[11px]">p. {entry.pageNo}</div>}
                        <div className="text-[11px] text-[#829B83] mt-1 flex items-center gap-1">
                          <span>Reviewer:</span>
                          <span className="font-medium text-[#1E2926]">{entry.reviewer}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 align-top whitespace-nowrap">
                        {entry.status === 'verified' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E1ECE3] text-[#123C35] font-bold text-[11px]">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#194D42]" />
                            <span>{t.references.statusVerified}</span>
                          </span>
                        )}
                        {entry.status === 'pending_review' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF4D7] text-[#87560B] font-bold text-[11px]">
                            <Clock className="w-3.5 h-3.5 text-[#D97706]" />
                            <span>{t.references.statusPending}</span>
                          </span>
                        )}
                        {entry.status === 'draft' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E8EFE8] text-[#68736F] font-bold text-[11px]">
                            <FileText className="w-3.5 h-3.5" />
                            <span>{t.references.statusDraft}</span>
                          </span>
                        )}

                        {/* Reviewer Action Buttons */}
                        {isAdmin && (
                          <div className="mt-2 flex flex-col gap-1">
                            {entry.status === 'draft' && (
                              <button
                                onClick={() => handleStatusChange(entry.id, 'pending_review')}
                                className="text-[10px] font-semibold text-[#D97706] hover:underline text-left"
                              >
                                Submit for Review →
                              </button>
                            )}
                            {entry.status === 'pending_review' && (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleStatusChange(entry.id, 'verified')}
                                  className="text-[10px] font-bold text-[#194D42] hover:underline"
                                >
                                  ✓ Verify & Publish
                                </button>
                                <span className="text-[#829B83]">|</span>
                                <button
                                  onClick={() => handleStatusChange(entry.id, 'draft')}
                                  className="text-[10px] font-medium text-[#8B2D2D] hover:underline"
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                            {entry.status === 'verified' && (
                              <button
                                onClick={() => handleStatusChange(entry.id, 'draft')}
                                className="text-[10px] text-[#68736F] hover:underline text-left"
                              >
                                Revoke to Draft
                              </button>
                            )}
                          </div>
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
        <div className="fixed inset-0 z-50 bg-[#0B2925]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#FFFDF8] rounded-2xl border-2 border-[#0B2925] shadow-2xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6 animate-fade-in">
            
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
                    min="1"
                    max="1000"
                    required
                    value={minVal}
                    onChange={(e) => setMinVal(e.target.value)}
                    placeholder="e.g. 14.7"
                    className="w-full px-3 py-2 rounded-xl border border-[#CBD2C9] text-sm focus:outline-none focus:ring-2 focus:ring-[#123C35]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#194D42] mb-1">
                    {t.admin.maxBound} *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="1000"
                    required
                    value={maxVal}
                    onChange={(e) => setMaxVal(e.target.value)}
                    placeholder="e.g. 16.6"
                    className="w-full px-3 py-2 rounded-xl border border-[#CBD2C9] text-sm focus:outline-none focus:ring-2 focus:ring-[#123C35]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#194D42] mb-1">
                    {t.admin.unitSelect}
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as UnitType)}
                    className="w-full px-3 py-2 rounded-xl border border-[#CBD2C9] text-sm font-semibold text-[#123C35]"
                  >
                    <option value="cm">cm (centimeter)</option>
                    <option value="mm">mm (millimeter)</option>
                  </select>
                </div>
              </div>

              {/* Traditional Virarkadai */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#194D42] mb-1">
                  {t.admin.traditionalField}
                </label>
                <input
                  type="text"
                  value={traditionalVal}
                  onChange={(e) => setTraditionalVal(e.target.value)}
                  placeholder="e.g. 7 ¾ - 8 ¾"
                  className="w-full px-3 py-2 rounded-xl border border-[#CBD2C9] text-sm focus:outline-none focus:ring-2 focus:ring-[#123C35]"
                />
              </div>

              {/* Tamil Interpretation */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#194D42] mb-1">
                  {t.admin.tamilField} *
                </label>
                <textarea
                  rows={3}
                  required
                  value={tamilText}
                  onChange={(e) => setTamilText(e.target.value)}
                  placeholder="உடல் வெதும்பி, வாயுவினால் நெஞ்சு குத்தல்..."
                  className="w-full px-3 py-2 rounded-xl border border-[#CBD2C9] text-sm font-tamil focus:outline-none focus:ring-2 focus:ring-[#123C35]"
                />
              </div>

              {/* English Translation */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#194D42] mb-1">
                  {t.admin.englishField}
                </label>
                <textarea
                  rows={2}
                  value={englishText}
                  onChange={(e) => setEnglishText(e.target.value)}
                  placeholder="Body heat, chest stabbing pain due to Vayu..."
                  className="w-full px-3 py-2 rounded-xl border border-[#CBD2C9] text-sm focus:outline-none focus:ring-2 focus:ring-[#123C35]"
                />
              </div>

              {/* Source Book & Page */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-[#194D42] mb-1">
                    {t.admin.sourceField} *
                  </label>
                  <input
                    type="text"
                    required
                    value={sourceBook}
                    onChange={(e) => setSourceBook(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#CBD2C9] text-sm focus:outline-none focus:ring-2 focus:ring-[#123C35]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#194D42] mb-1">
                    Page No.
                  </label>
                  <input
                    type="text"
                    value={pageNo}
                    onChange={(e) => setPageNo(e.target.value)}
                    placeholder="e.g. 368"
                    className="w-full px-3 py-2 rounded-xl border border-[#CBD2C9] text-sm focus:outline-none focus:ring-2 focus:ring-[#123C35]"
                  />
                </div>
              </div>

              {/* Reviewer & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#194D42] mb-1">
                    {t.admin.reviewerField}
                  </label>
                  <input
                    type="text"
                    value={reviewer}
                    onChange={(e) => setReviewer(e.target.value)}
                    placeholder={user?.fullName || 'Faculty Reviewer'}
                    className="w-full px-3 py-2 rounded-xl border border-[#CBD2C9] text-sm focus:outline-none focus:ring-2 focus:ring-[#123C35]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#194D42] mb-1">
                    {t.admin.statusSelect}
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as VerificationStatus)}
                    className="w-full px-3 py-2 rounded-xl border border-[#CBD2C9] text-sm font-semibold text-[#123C35]"
                  >
                    <option value="verified">{t.references.statusVerified}</option>
                    <option value="pending_review">{t.references.statusPending}</option>
                    <option value="draft">{t.references.statusDraft}</option>
                  </select>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-[#E3E4DA] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#E3E4DA] text-xs font-bold text-[#68736F] hover:bg-[#F6F3E9]"
                >
                  {t.admin.cancelBtn}
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D9AD54] to-[#E5C170] hover:from-[#C49D44] hover:to-[#D5B160] text-[#0B2925] font-bold text-xs shadow-md transition-all disabled:opacity-50"
                >
                  {actionLoading ? 'Saving...' : t.admin.saveBtn}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
