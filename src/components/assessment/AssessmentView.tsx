import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { createAssessment } from '../../lib/assessmentStore';
import { checkRepeatDiscrepancy } from '../../lib/normalization';
import { UnitType, AssessmentRecord } from '../../types';
import { downloadCsv } from '../../lib/csvHelper';
import { 
  Stethoscope, 
  Ruler, 
  AlertTriangle, 
  Printer, 
  Download, 
  CheckCircle, 
  HelpCircle, 
  RotateCcw, 
  History,
  ShieldCheck,
  BookOpen
} from 'lucide-react';

interface AssessmentViewProps {
  onNavigateHistory: () => void;
}

export const AssessmentView: React.FC<AssessmentViewProps> = ({ onNavigateHistory }) => {
  const { t, language } = useLanguage();
  const { user } = useAuth();

  // Form State
  const [sessionId, setSessionId] = useState('');
  const [measurementVal, setMeasurementVal] = useState<string>('16.5');
  const [unit, setUnit] = useState<UnitType>('cm');
  const [repeatVal, setRepeatVal] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  // Result & Discrepancy State
  const [currentRecord, setCurrentRecord] = useState<AssessmentRecord | null>(null);
  const [discrepancyNotice, setDiscrepancyNotice] = useState<string | null>(null);

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(measurementVal);
    if (isNaN(val) || val <= 0) {
      alert(t.assessment.invalidMeasurement);
      return;
    }

    const repeat = repeatVal.trim() !== '' ? parseFloat(repeatVal) : undefined;

    // Check repeat discrepancy
    if (repeat !== undefined) {
      const disc = checkRepeatDiscrepancy(val, repeat, unit);
      if (disc.hasDiscrepancy) {
        setDiscrepancyNotice(
          `${t.assessment.repeatWarning} (Diff: ${disc.diff} ${unit}, Threshold: ${disc.threshold} ${unit})`
        );
      } else {
        setDiscrepancyNotice(null);
      }
    } else {
      setDiscrepancyNotice(null);
    }

    setLoading(true);
    try {
      const record = await createAssessment({
        sessionId: sessionId.trim() || undefined,
        measurementVal: val,
        unit,
        repeatMeasurement: repeat,
        notes: notes.trim() || undefined,
        userId: user?.id
      });
      setCurrentRecord(record);
    } catch (err: any) {
      alert(`Error recording assessment: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setMeasurementVal('');
    setRepeatVal('');
    setNotes('');
    setCurrentRecord(null);
    setDiscrepancyNotice(null);
  };

  // Export current record as CSV
  const handleExportSingleCsv = () => {
    if (!currentRecord) return;
    const headers = [
      'session_id', 'timestamp', 'measurement_val', 'unit',
      'normalized_cm', 'normalized_mm', 'repeat_val', 'match_status',
      'matched_traditional_val', 'matched_tamil_text', 'source_book', 'reviewer', 'notes'
    ];
    const match = currentRecord.matchedReferences[0];
    const row = [
      currentRecord.sessionId,
      currentRecord.timestamp,
      currentRecord.measurementVal,
      currentRecord.unit,
      currentRecord.normalizedCm,
      currentRecord.normalizedMm,
      currentRecord.repeatMeasurement || '',
      currentRecord.matchStatus,
      match?.traditionalVal || '',
      match?.tamilText || '',
      match?.sourceBook || '',
      match?.reviewer || '',
      currentRecord.notes || ''
    ];
    downloadCsv(`manikkadai_assessment_${currentRecord.sessionId}`, headers, [row]);
  };

  return (
    <div className="py-12 bg-[#F6F3E9] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Title & Academic Notice */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#123C35] text-[#D9AD54] text-xs font-mono font-bold tracking-wider uppercase">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>ANTHROPOMETRIC ASSESSMENT MODULE</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#123C35]">
            {t.assessment.title}
          </h1>

          <div className="p-4 rounded-2xl bg-[#FFFDF8] border-l-4 border-[#123C35] shadow-sm text-xs sm:text-sm text-[#1E2926]/90 leading-relaxed">
            {t.assessment.introNotice}
          </div>
        </div>

        {/* Two-Column Layout: Measurement Form & Measurement Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Input Form Card */}
          <div className="lg:col-span-7 rounded-2xl bg-[#FFFDF8] border border-[#E3E4DA] p-6 sm:p-8 shadow-card space-y-6">
            <div className="border-b border-[#E3E4DA] pb-4">
              <h2 className="font-serif text-xl font-bold text-[#123C35]">
                {t.assessment.formHeading}
              </h2>
              <p className="text-xs text-[#68736F] mt-1">
                {t.assessment.formIntro}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Anonymous Session ID */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#194D42] mb-1.5">
                  {t.assessment.sessionLabel}
                </label>
                <input
                  type="text"
                  value={sessionId}
                  onChange={(e) => setSessionId(e.target.value)}
                  placeholder={t.assessment.sessionPlaceholder}
                  maxLength={40}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#CBD2C9] bg-white text-sm text-[#1E2926] focus:outline-none focus:ring-2 focus:ring-[#123C35]"
                />
              </div>

              {/* Measurement Value & Unit */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#194D42] mb-1.5">
                    {t.assessment.measurementLabel} *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="100"
                      required
                      value={measurementVal}
                      onChange={(e) => setMeasurementVal(e.target.value)}
                      placeholder={t.assessment.measurementPlaceholder}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#CBD2C9] bg-white text-base font-semibold text-[#1E2926] focus:outline-none focus:ring-2 focus:ring-[#123C35]"
                    />
                    <Ruler className="w-4 h-4 text-[#829B83] absolute right-3 top-3.5 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#194D42] mb-1.5">
                    {t.assessment.unitLabel}
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as UnitType)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#CBD2C9] bg-white text-sm font-bold text-[#123C35] focus:outline-none focus:ring-2 focus:ring-[#123C35]"
                  >
                    <option value="cm">cm (centimeter)</option>
                    <option value="mm">mm (millimeter)</option>
                  </select>
                </div>
              </div>

              {/* Repeat Measurement (Optional) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#194D42] mb-1.5">
                  {t.assessment.repeatLabel}
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="1000"
                  value={repeatVal}
                  onChange={(e) => setRepeatVal(e.target.value)}
                  placeholder={t.assessment.repeatPlaceholder}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#CBD2C9] bg-white text-sm text-[#1E2926] focus:outline-none focus:ring-2 focus:ring-[#123C35]"
                />
                <span className="text-[11px] text-[#829B83] mt-1 block">
                  Intra-observer consistency threshold: ±0.3 cm or ±3.0 mm.
                </span>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#194D42] mb-1.5">
                  {t.assessment.notesLabel}
                </label>
                <textarea
                  rows={2}
                  maxLength={300}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t.assessment.notesPlaceholder}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#CBD2C9] bg-white text-sm text-[#1E2926] focus:outline-none focus:ring-2 focus:ring-[#123C35]"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#D9AD54] to-[#E5C170] hover:from-[#e4be6b] hover:to-[#edd18e] text-[#0B2925] font-bold text-sm shadow-gold-glow transition-all flex items-center justify-center gap-2.5 transform hover:-translate-y-0.5"
                >
                  {loading ? (
                    <span>{t.assessment.searchingBtn}</span>
                  ) : (
                    <>
                      <Stethoscope className="w-4 h-4 text-[#0B2925]" />
                      <span>{t.assessment.findBtn}</span>
                    </>
                  )}
                </button>
              </div>

            </form>

            {/* Repeat Discrepancy Warning Notice if triggered */}
            {discrepancyNotice && (
              <div className="p-4 rounded-xl bg-[#FFF4D7] border border-[#F2D48E] text-[#87560B] text-xs flex items-start gap-3 animate-fade-in">
                <AlertTriangle className="w-5 h-5 shrink-0 text-[#D97706] mt-0.5" />
                <div>
                  <strong className="block font-bold mb-0.5">Threshold Variation Alert</strong>
                  {discrepancyNotice}
                </div>
              </div>
            )}

            {/* Safety Disclaimer */}
            <div className="p-3.5 rounded-xl bg-[#F6F3E9] border border-[#E3E4DA] text-xs text-[#68736F]">
              <strong className="text-[#123C35] block mb-0.5">Medical Safety Notice:</strong>
              {t.assessment.safetyNotice}
            </div>

          </div>

          {/* Right: Protocol Checklist Card */}
          <div className="lg:col-span-5 rounded-2xl bg-[#FFFDF8] border border-[#E3E4DA] p-6 sm:p-8 shadow-card space-y-6">
            <div className="border-b border-[#E3E4DA] pb-4">
              <h2 className="font-serif text-xl font-bold text-[#123C35]">
                {t.assessment.stepsHeading}
              </h2>
              <span className="text-xs text-[#829B83]">
                Standard Operating Procedure (SOP)
              </span>
            </div>

            <ol className="space-y-4">
              {t.assessment.steps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3.5 text-xs sm:text-sm text-[#1E2926]/90">
                  <span className="w-6 h-6 rounded-full bg-[#123C35] text-[#D9AD54] text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>

            <div className="p-4 rounded-xl bg-[#FFFDF8] border border-[#D9AD54]/40 text-xs text-[#87560B] space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-[#123C35]">
                <ShieldCheck className="w-4 h-4 text-[#D9AD54]" />
                <span>Verification Mandate</span>
              </div>
              <p className="leading-relaxed">
                {t.assessment.reviewNotice}
              </p>
            </div>

          </div>

        </div>

        {/* RESULTS REPORT CARD (Rendered on Submission) */}
        {currentRecord && (
          <div className="mt-12 rounded-2xl bg-[#FFFDF8] border-2 border-[#D9AD54] p-6 sm:p-10 shadow-elevated space-y-8 animate-fade-in print-card relative overflow-hidden" id="assessment-report-section">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#123C35] via-[#D9AD54] to-[#123C35]"></div>
            
            {/* Report Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E3E4DA] gap-4">
              <div>
                <span className="text-xs font-mono font-bold text-[#D9AD54] tracking-wider uppercase">
                  OFFICIAL EXPO RECORD
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#123C35] mt-1">
                  {t.results.heading}
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-xs text-[#68736F] mt-2">
                  <span><strong>{t.results.sessionId}:</strong> <span className="font-mono text-[#123C35]">{currentRecord.sessionId}</span></span>
                  <span>•</span>
                  <span><strong>{t.results.recordedAt}:</strong> {new Date(currentRecord.timestamp).toLocaleString()}</span>
                </div>
              </div>

              {/* Status Badge */}
              <div>
                {currentRecord.matchStatus === 'matched' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E1ECE3] text-[#123C35] text-xs font-bold border border-[#123C35]/20">
                    <CheckCircle className="w-4 h-4 text-[#194D42]" />
                    <span>{t.results.matchFoundTitle}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF4D7] text-[#87560B] text-xs font-bold border border-[#F2D48E]">
                    <HelpCircle className="w-4 h-4 text-[#D97706]" />
                    <span>{t.results.noMatchTitle}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-xl bg-[#F6F3E9] border border-[#E3E4DA]">
              <div>
                <span className="text-[11px] text-[#68736F] uppercase tracking-wider block font-medium">
                  {t.results.rawMeasurement}
                </span>
                <span className="text-xl font-bold text-[#123C35] font-mono mt-0.5 block">
                  {currentRecord.measurementVal} {currentRecord.unit}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-[#68736F] uppercase tracking-wider block font-medium">
                  {t.results.normalizedEquivalent}
                </span>
                <span className="text-sm font-semibold text-[#194D42] font-mono mt-1 block">
                  {currentRecord.normalizedCm} cm / {currentRecord.normalizedMm} mm
                </span>
              </div>

              <div>
                <span className="text-[11px] text-[#68736F] uppercase tracking-wider block font-medium">
                  {t.results.repeatReading}
                </span>
                <span className="text-sm font-semibold text-[#1E2926] mt-1 block font-mono">
                  {currentRecord.repeatMeasurement ? `${currentRecord.repeatMeasurement} ${currentRecord.unit}` : 'None provided'}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-[#68736F] uppercase tracking-wider block font-medium">
                  Consistency Check
                </span>
                <span className="text-xs font-bold mt-1 block">
                  {discrepancyNotice ? (
                    <span className="text-[#8B2D2D]">{t.results.repeatStatusDiff}</span>
                  ) : (
                    <span className="text-[#194D42]">{t.results.repeatStatusConsistent}</span>
                  )}
                </span>
              </div>
            </div>

            {/* Matched Reference Content OR Transparent No-Match Section */}
            {currentRecord.matchStatus === 'matched' && currentRecord.matchedReferences.length > 0 ? (
              <div className="space-y-6">
                {currentRecord.matchedReferences.map((ref, idx) => (
                  <div key={idx} className="p-6 rounded-2xl bg-[#FFFDF8] border-2 border-[#D9AD54]/40 shadow-sm space-y-4">
                    
                    <div className="flex items-center justify-between border-b border-[#E3E4DA] pb-3">
                      <div>
                        <span className="text-xs text-[#87560B] font-bold block uppercase font-mono">
                          {t.results.traditionalVal}
                        </span>
                        <span className="text-xl font-bold text-[#123C35]">
                          {ref.traditionalVal ? `${ref.traditionalVal} விரற்கடை` : 'Verified Anatomical Range'}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[11px] text-[#68736F] block">Verified Bounds</span>
                        <span className="font-mono text-xs font-bold text-[#123C35]">
                          {ref.minVal} – {ref.maxVal} {ref.unit}
                        </span>
                      </div>
                    </div>

                    {/* Exact Tamil Text */}
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-[#194D42] uppercase tracking-wider">
                        {t.results.tamilInterpretation}
                      </span>
                      <p className="font-tamil text-base sm:text-lg text-[#1E2926] font-medium leading-relaxed bg-[#F6F3E9] p-4 rounded-xl border border-[#E3E4DA]">
                        {ref.tamilText}
                      </p>
                    </div>

                    {/* English Translation */}
                    {ref.englishText && (
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-[#68736F] uppercase tracking-wider">
                          {t.results.englishTranslation}
                        </span>
                        <p className="text-xs sm:text-sm text-[#1E2926]/90 leading-relaxed italic bg-white p-3 rounded-lg border border-[#E3E4DA]">
                          {ref.englishText}
                        </p>
                      </div>
                    )}

                    {/* Source & Reviewer Credits */}
                    <div className="pt-3 border-t border-[#E3E4DA] flex flex-wrap items-center justify-between text-xs text-[#68736F] gap-2">
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-[#D9AD54]" />
                        <span><strong>{t.results.sourceCitation}:</strong> {ref.sourceBook} {ref.pageNo ? `(p. ${ref.pageNo})` : ''}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#194D42]" />
                        <span><strong>{t.results.verifiedBy}:</strong> {ref.reviewer}</span>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-[#FFFDF8] border-2 border-[#E3E4DA] space-y-3">
                <div className="flex items-center gap-2 text-base font-bold text-[#123C35]">
                  <HelpCircle className="w-5 h-5 text-[#D97706]" />
                  <span>{t.results.noMatchTitle}</span>
                </div>
                <p className="text-xs sm:text-sm text-[#68736F] leading-relaxed">
                  {t.results.noMatchExplanation}
                </p>
                <div className="text-xs text-[#829B83] italic pt-2">
                  Reference range query: Physical measurement {currentRecord.measurementVal} {currentRecord.unit} ({currentRecord.normalizedCm} cm) does not intersect an authenticated Siddha clinical table mapping.
                </div>
              </div>
            )}

            {/* Prominent Educational Safety Disclaimer Banner */}
            <div className="p-4 rounded-xl bg-[#FFF4D7] border border-[#F2D48E] text-[#87560B] text-xs leading-relaxed">
              <strong>{t.results.disclaimerBanner}</strong>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-[#E3E4DA] flex flex-wrap items-center justify-between gap-3 action-buttons no-print">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#123C35] text-[#FFFDF8] font-bold text-xs hover:bg-[#194D42] shadow-sm transition-all"
                >
                  <Printer className="w-4 h-4 text-[#D9AD54]" />
                  <span>{t.results.printBtn}</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportSingleCsv}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F6F3E9] text-[#123C35] border border-[#E3E4DA] font-bold text-xs hover:bg-[#E8EFE8] transition-all"
                >
                  <Download className="w-4 h-4 text-[#194D42]" />
                  <span>{t.results.exportCsvBtn}</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F6F3E9] text-[#68736F] font-bold text-xs hover:bg-[#E8EFE8] transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{t.results.newAssessmentBtn}</span>
                </button>

                <button
                  type="button"
                  onClick={onNavigateHistory}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D9AD54] text-[#123C35] font-bold text-xs hover:bg-[#e4be6b] shadow-sm transition-all"
                >
                  <History className="w-4 h-4" />
                  <span>{t.results.viewHistoryBtn}</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
