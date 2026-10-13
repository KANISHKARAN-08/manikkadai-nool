import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { getAssessmentHistory, deleteAssessment, clearAssessmentHistory } from '../../lib/assessmentStore';
import { downloadCsv } from '../../lib/csvHelper';
import { AssessmentRecord } from '../../types';
import { 
  History, 
  Search, 
  Download, 
  Trash2, 
  FileText, 
  Printer, 
  CheckCircle, 
  HelpCircle,
  X,
  BookOpen
} from 'lucide-react';

export const HistoryView: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();

  const [records, setRecords] = useState<AssessmentRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<AssessmentRecord | null>(null);

  useEffect(() => {
    loadHistory();
  }, [user]);

  const loadHistory = async () => {
    const list = await getAssessmentHistory(user);
    setRecords(list);
  };

  const filteredRecords = records.filter(r => {
    const q = searchTerm.toLowerCase();
    return (
      !searchTerm ||
      r.sessionId.toLowerCase().includes(q) ||
      (r.notes && r.notes.toLowerCase().includes(q)) ||
      r.matchedReferences.some(m => m.tamilText.toLowerCase().includes(q) || (m.englishText && m.englishText.toLowerCase().includes(q)))
    );
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this assessment session record?')) return;
    await deleteAssessment(id, user);
    loadHistory();
  };

  const handleClear = async () => {
    if (!confirm(t.history.clearConfirm)) return;
    await clearAssessmentHistory(user);
    loadHistory();
  };

  const handleExportCsv = () => {
    const headers = [
      'date', 'session_id', 'measurement', 'unit', 'normalized_cm', 'normalized_mm',
      'repeat_reading', 'match_status', 'matched_traditional', 'matched_tamil', 'source_book', 'reviewer', 'notes'
    ];
    const rows = records.map(r => {
      const match = r.matchedReferences[0];
      return [
        r.timestamp,
        r.sessionId,
        r.measurementVal,
        r.unit,
        r.normalizedCm,
        r.normalizedMm,
        r.repeatMeasurement || '',
        r.matchStatus,
        match?.traditionalVal || '',
        match?.tamilText || '',
        match?.sourceBook || '',
        match?.reviewer || '',
        r.notes || ''
      ];
    });
    downloadCsv('manikkadai_session_history', headers, rows);
  };

  return (
    <div className="py-12 bg-[#F6F3E9] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#123C35] text-[#D9AD54] text-xs font-mono font-bold tracking-wider uppercase mb-2">
              <History className="w-3.5 h-3.5" />
              <span>PERSISTENT SESSION LOG</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#123C35]">
              {t.history.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#68736F] mt-1">
              {t.history.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExportCsv}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFFDF8] text-[#123C35] border border-[#E3E4DA] font-bold text-xs hover:bg-[#E8EFE8] transition-all shadow-sm"
            >
              <Download className="w-4 h-4 text-[#194D42]" />
              <span>{t.history.exportCsv}</span>
            </button>

            {records.length > 0 && (
              <button
                onClick={handleClear}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#8B2D2D]/10 hover:bg-[#8B2D2D] text-[#8B2D2D] hover:text-white font-bold text-xs transition-all"
                title={t.history.clearAll}
              >
                <Trash2 className="w-4 h-4" />
                <span>{t.history.clearAll}</span>
              </button>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="p-4 rounded-2xl bg-[#FFFDF8] border border-[#E3E4DA] shadow-sm">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-[#829B83] absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.history.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#CBD2C9] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#123C35]"
            />
          </div>
        </div>

        {/* Table of Records */}
        <div className="rounded-2xl bg-[#FFFDF8] border border-[#E3E4DA] shadow-card overflow-hidden">
          {filteredRecords.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <FileText className="w-10 h-10 text-[#829B83] mx-auto opacity-60" />
              <p className="text-sm font-semibold text-[#68736F]">
                {t.history.noHistory}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-[#123C35] text-[#123C35] bg-[#F6F3E9]">
                    <th className="py-3 px-4 font-bold">{t.history.dateCol}</th>
                    <th className="py-3 px-4 font-bold">{t.history.sessionCol}</th>
                    <th className="py-3 px-4 font-bold">{t.history.measurementCol}</th>
                    <th className="py-3 px-4 font-bold">{t.history.normalizedCol}</th>
                    <th className="py-3 px-4 font-bold">{t.history.matchCol}</th>
                    <th className="py-3 px-4 font-bold text-right">{t.history.actionsCol}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3E4DA]">
                  {filteredRecords.map((r) => {
                    const match = r.matchedReferences[0];
                    return (
                      <tr key={r.id} className="hover:bg-[#F6F3E9]/60 transition-colors">
                        <td className="py-4 px-4 align-top whitespace-nowrap text-[#68736F]">
                          {new Date(r.timestamp).toLocaleDateString()}
                          <div className="text-[10px] text-[#829B83]">{new Date(r.timestamp).toLocaleTimeString()}</div>
                        </td>

                        <td className="py-4 px-4 align-top whitespace-nowrap font-mono font-bold text-[#123C35]">
                          {r.sessionId}
                        </td>

                        <td className="py-4 px-4 align-top whitespace-nowrap font-mono font-bold text-sm">
                          {r.measurementVal} {r.unit}
                          {r.repeatMeasurement && (
                            <div className="text-[10px] text-[#829B83]">rep: {r.repeatMeasurement} {r.unit}</div>
                          )}
                        </td>

                        <td className="py-4 px-4 align-top whitespace-nowrap text-xs text-[#68736F] font-mono">
                          {r.normalizedCm} cm
                          <div className="text-[10px] text-[#829B83]">{r.normalizedMm} mm</div>
                        </td>

                        <td className="py-4 px-4 align-top max-w-sm">
                          {r.matchStatus === 'matched' && match ? (
                            <div className="space-y-1">
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#194D42] bg-[#E1ECE3] px-2 py-0.5 rounded">
                                <CheckCircle className="w-3 h-3" />
                                <span>{match.traditionalVal ? `${match.traditionalVal} விரற்கடை` : 'Matched'}</span>
                              </span>
                              <div className="font-tamil text-xs text-[#1E2926] line-clamp-2">
                                {match.tamilText}
                              </div>
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#87560B] bg-[#FFF4D7] px-2 py-0.5 rounded">
                              <HelpCircle className="w-3 h-3 text-[#D97706]" />
                              <span>No verified match</span>
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-4 align-top text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedRecord(r)}
                              className="px-2.5 py-1 rounded-lg bg-[#123C35] text-[#D9AD54] text-[11px] font-bold hover:bg-[#194D42]"
                            >
                              {t.history.viewDetails}
                            </button>
                            <button
                              onClick={() => handleDelete(r.id)}
                              className="p-1 rounded text-[#8B2D2D] hover:bg-[#8B2D2D]/10"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* DETAIL MODAL */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-[#0B2925]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#FFFDF8] rounded-2xl border-2 border-[#0B2925] shadow-2xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6 animate-fade-in">
            <div className="flex items-center justify-between border-b border-[#E3E4DA] pb-4">
              <div>
                <span className="text-[11px] font-mono text-[#D9AD54] uppercase font-bold">EXPO ARCHIVE RECORD</span>
                <h3 className="font-serif text-2xl font-bold text-[#123C35]">
                  Session: {selectedRecord.sessionId}
                </h3>
                <div className="text-xs text-[#68736F]">{new Date(selectedRecord.timestamp).toLocaleString()}</div>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-2 rounded-lg text-[#68736F] hover:bg-[#F6F3E9]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[#F6F3E9] text-xs">
              <div>
                <span className="text-[#68736F] block">Measurement:</span>
                <strong className="text-base text-[#123C35] font-mono">{selectedRecord.measurementVal} {selectedRecord.unit}</strong>
              </div>
              <div>
                <span className="text-[#68736F] block">Normalized:</span>
                <span className="font-mono font-bold">{selectedRecord.normalizedCm} cm / {selectedRecord.normalizedMm} mm</span>
              </div>
              <div>
                <span className="text-[#68736F] block">Repeat Reading:</span>
                <span className="font-mono">{selectedRecord.repeatMeasurement ? `${selectedRecord.repeatMeasurement} ${selectedRecord.unit}` : 'None'}</span>
              </div>
            </div>

            {selectedRecord.notes && (
              <div className="p-3.5 rounded-xl bg-white border border-[#E3E4DA] text-xs space-y-1">
                <strong className="text-[#123C35] block">Notes:</strong>
                <p className="text-[#68736F]">{selectedRecord.notes}</p>
              </div>
            )}

            {selectedRecord.matchedReferences.length > 0 ? (
              <div className="space-y-4">
                {selectedRecord.matchedReferences.map((m, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white border border-[#D9AD54]/50 space-y-2 text-xs">
                    <div className="flex items-center justify-between font-bold text-[#123C35]">
                      <span>{m.traditionalVal ? `${m.traditionalVal} விரற்கடை` : 'Matched'}</span>
                      <span className="font-mono text-[#87560B]">{m.minVal} – {m.maxVal} {m.unit}</span>
                    </div>
                    <p className="font-tamil text-sm text-[#1E2926] leading-relaxed bg-[#F6F3E9] p-3 rounded">
                      {m.tamilText}
                    </p>
                    {m.englishText && (
                      <p className="text-[#68736F] italic">{m.englishText}</p>
                    )}
                    <div className="text-[11px] text-[#829B83] border-t border-[#E3E4DA] pt-2 flex items-center justify-between">
                      <span>Source: {m.sourceBook}</span>
                      <span>Reviewer: {m.reviewer}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-[#FFF4D7] border border-[#F2D48E] text-xs text-[#87560B]">
                No verified reference entry matches this recorded circumference measurement.
              </div>
            )}

            <div className="pt-4 border-t border-[#E3E4DA] flex items-center justify-between">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#123C35] text-[#FFFDF8] font-bold text-xs"
              >
                <Printer className="w-4 h-4 text-[#D9AD54]" />
                <span>Print Record</span>
              </button>
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 rounded-xl border border-[#CBD2C9] text-xs font-bold text-[#68736F]"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
