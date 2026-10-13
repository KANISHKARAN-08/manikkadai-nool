import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { createAssessment } from '../../lib/assessmentStore';
import { checkRepeatDiscrepancy, normalizeMeasurement } from '../../lib/normalization';
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
  BookOpen,
  Info,
  RefreshCw,
  Sparkles,
  Bookmark
} from 'lucide-react';

interface AssessmentViewProps {
  onNavigateHistory: () => void;
}

const TRADITIONAL_FRACTIONS = [
  '10', '9 ¾', '9 ½', '9 ¼', '9',
  '8 ¾', '8 ½', '8 ¼', '8',
  '7 ¾', '7 ½', '7 ¼', '7',
  '6 ¾', '6 ½', '6 ¼', '6',
  '5 ¾', '5 ½', '5 ¼', '5',
  '4 ¾', '4 ½', '4 ¼', '4'
];

export const AssessmentView: React.FC<AssessmentViewProps> = ({ onNavigateHistory }) => {
  const { t, language } = useLanguage();
  const { user } = useAuth();

  // Mode: traditional (Virarkadai) vs physical (cm / mm)
  const [measurementMode, setMeasurementMode] = useState<'traditional' | 'physical'>('traditional');

  // Form State
  const [sessionId, setSessionId] = useState('');
  const [traditionalInput, setTraditionalInput] = useState<string>('5 ½');
  const [metricVal, setMetricVal] = useState<string>('16.5');
  const [metricUnit, setMetricUnit] = useState<UnitType>('cm');
  const [repeatVal, setRepeatVal] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Result & Discrepancy State
  const [currentRecord, setCurrentRecord] = useState<AssessmentRecord | null>(null);
  const [discrepancyNotice, setDiscrepancyNotice] = useState<string | null>(null);

  // Real-time live normalization preview for physical mode
  const liveNorm = useMemo(() => {
    if (measurementMode !== 'physical') return null;
    const val = parseFloat(metricVal);
    if (isNaN(val) || val <= 0) return null;
    return normalizeMeasurement(val, metricUnit);
  }, [measurementMode, metricVal, metricUnit]);

  // Real-time live repeat discrepancy check for physical mode
  const liveDiscrepancy = useMemo(() => {
    if (measurementMode !== 'physical') return null;
    const val = parseFloat(metricVal);
    const rep = parseFloat(repeatVal);
    if (isNaN(val) || isNaN(rep) || val <= 0 || rep <= 0) return null;
    return checkRepeatDiscrepancy(val, rep, metricUnit);
  }, [measurementMode, metricVal, repeatVal, metricUnit]);

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    let activeVal: string | number = '';
    let activeUnit: UnitType = 'virarkadai';

    if (measurementMode === 'traditional') {
      if (!traditionalInput.trim()) {
        alert(language === 'ta' ? 'தயவுசெய்து விரற்கடை அளவைத் தேர்ந்தெடுக்கவும் அல்லது உள்ளிடவும்.' : 'Please select or enter a traditional Virarkadai value.');
        return;
      }
      activeVal = traditionalInput.trim();
      activeUnit = 'virarkadai';
    } else {
      const val = parseFloat(metricVal);
      if (isNaN(val) || val <= 0) {
        alert(t.assessment.invalidMeasurement);
        return;
      }
      activeVal = val;
      activeUnit = metricUnit;

      const repeat = repeatVal.trim() !== '' ? parseFloat(repeatVal) : undefined;
      if (repeat !== undefined) {
        const disc = checkRepeatDiscrepancy(val, repeat, metricUnit);
        if (disc.hasDiscrepancy) {
          setDiscrepancyNotice(
            `${t.assessment.repeatWarning} (Diff: ${disc.diff} ${metricUnit}, Threshold: ${disc.threshold} ${metricUnit})`
          );
        } else {
          setDiscrepancyNotice(null);
        }
      } else {
        setDiscrepancyNotice(null);
      }
    }

    setLoading(true);
    try {
      const record = await createAssessment({
        sessionId: sessionId.trim() || undefined,
        measurementMode,
        measurementVal: activeVal,
        unit: activeUnit,
        repeatMeasurement: measurementMode === 'physical' && repeatVal.trim() ? parseFloat(repeatVal) : undefined,
        notes: notes.trim() || undefined,
        userId: user?.id
      }, user);

      setCurrentRecord(record);

      setTimeout(() => {
        document.getElementById('assessment-report-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setErrorMessage(err.message || 'Database lookup failed. Please check network connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setTraditionalInput('5 ½');
    setMetricVal('');
    setRepeatVal('');
    setNotes('');
    setCurrentRecord(null);
    setDiscrepancyNotice(null);
    setErrorMessage(null);
  };

  // Export current record as CSV
  const handleExportSingleCsv = () => {
    if (!currentRecord) return;
    const headers = [
      'session_id', 'timestamp', 'measurement_mode', 'measurement_val', 'unit',
      'normalized_cm', 'normalized_mm', 'repeat_val', 'match_status',
      'matched_traditional_val', 'matched_tamil_text', 'source_book', 'reviewer', 'notes'
    ];
    const match = currentRecord.matchedReferences[0];
    const row = [
      currentRecord.sessionId,
      currentRecord.timestamp,
      currentRecord.measurementMode,
      currentRecord.measurementVal,
      currentRecord.unit,
      currentRecord.normalizedCm || '',
      currentRecord.normalizedMm || '',
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
            <div className="border-b border-[#E3E4DA] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#123C35]">
                  {t.assessment.formHeading}
                </h2>
                <p className="text-xs text-[#68736F] mt-0.5">
                  {t.assessment.formIntro}
                </p>
              </div>

              {/* Mode Toggle Switcher */}
              <div className="inline-flex p-1 rounded-xl bg-[#F6F3E9] border border-[#CBD2C9]">
                <button
                  type="button"
                  onClick={() => setMeasurementMode('traditional')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    measurementMode === 'traditional'
                      ? 'bg-[#123C35] text-[#D9AD54] shadow-sm'
                      : 'text-[#68736F] hover:text-[#123C35]'
                  }`}
                >
                  {language === 'ta' ? 'பாரம்பரிய விரற்கடை' : 'Traditional Virarkadai'}
                </button>
                <button
                  type="button"
                  onClick={() => setMeasurementMode('physical')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    measurementMode === 'physical'
                      ? 'bg-[#123C35] text-[#D9AD54] shadow-sm'
                      : 'text-[#68736F] hover:text-[#123C35]'
                  }`}
                >
                  {language === 'ta' ? 'நவீன அளவீடு (cm/mm)' : 'Physical Metric (cm/mm)'}
                </button>
              </div>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="p-4 rounded-xl bg-[#8B2D2D]/10 border border-[#8B2D2D]/30 text-xs text-[#8B2D2D] flex items-center justify-between gap-3 animate-fade-in">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
                <button
                  onClick={handleSubmit}
                  className="px-2.5 py-1 rounded bg-[#8B2D2D] text-white text-[11px] font-bold shrink-0 hover:bg-[#722323]"
                >
                  Retry
                </button>
              </div>
            )}

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

              {/* INPUT SECTION A: Traditional Virarkadai */}
              {measurementMode === 'traditional' ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#194D42]">
                      {language === 'ta' ? 'பாரம்பரிய விரற்கடை அளவு *' : 'Traditional Virarkadai Measurement *'}
                    </label>
                    <span className="text-[11px] font-mono text-[#87560B] bg-[#FFF4D7] px-2 py-0.5 rounded border border-[#F2D48E]">
                      அசல் ஏடு: 4 முதல் 10 விரற்கடை (¼ இடைவெளி)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2 relative">
                      <input
                        type="text"
                        required
                        value={traditionalInput}
                        onChange={(e) => setTraditionalInput(e.target.value)}
                        placeholder="எ.கா: 5 ½ அல்லது 6 ¼"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#CBD2C9] bg-white text-base font-bold text-[#123C35] focus:outline-none focus:ring-2 focus:ring-[#123C35]"
                      />
                      <Sparkles className="w-4 h-4 text-[#D9AD54] absolute right-3 top-3.5 pointer-events-none" />
                    </div>

                    <div>
                      <select
                        value={traditionalInput}
                        onChange={(e) => setTraditionalInput(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-[#CBD2C9] bg-white text-sm font-bold text-[#123C35] focus:outline-none focus:ring-2 focus:ring-[#123C35]"
                      >
                        <option value="">விரைவுத் தேர்வு...</option>
                        {TRADITIONAL_FRACTIONS.map(frac => (
                          <option key={frac} value={frac}>{frac} விரற்கடை</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Quick-Pick Fraction Chips */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] text-[#68736F] font-medium block">
                      {language === 'ta' ? 'விரைவுத் தேர்வுக் குறியீடுகள் (Quick Selection):' : 'Common Traditional Values:'}
                    </span>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1.5 rounded-xl bg-[#F6F3E9] border border-[#E3E4DA]">
                      {TRADITIONAL_FRACTIONS.map(frac => (
                        <button
                          key={frac}
                          type="button"
                          onClick={() => setTraditionalInput(frac)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                            traditionalInput === frac
                              ? 'bg-[#123C35] text-[#D9AD54] shadow-sm ring-2 ring-[#D9AD54]'
                              : 'bg-white text-[#123C35] border border-[#CBD2C9] hover:bg-[#E8EFE8]'
                          }`}
                        >
                          {frac}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* INPUT SECTION B: Physical Metric */
                <div className="space-y-4">
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
                          max="1000"
                          required
                          value={metricVal}
                          onChange={(e) => setMetricVal(e.target.value)}
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
                        value={metricUnit}
                        onChange={(e) => setMetricUnit(e.target.value as UnitType)}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#CBD2C9] bg-white text-sm font-bold text-[#123C35] focus:outline-none focus:ring-2 focus:ring-[#123C35]"
                      >
                        <option value="cm">cm (centimeter)</option>
                        <option value="mm">mm (millimeter)</option>
                      </select>
                    </div>
                  </div>

                  {/* Real-time live normalized equivalent card */}
                  {liveNorm && (
                    <div className="px-3.5 py-2 rounded-xl bg-[#123C35]/5 border border-[#123C35]/15 flex items-center justify-between text-xs font-mono">
                      <span className="text-[#68736F] font-sans">Normalized Metric Calibration:</span>
                      <span className="font-bold text-[#123C35]">
                        {liveNorm.cm.toFixed(2)} cm <span className="text-[#829B83]">⇄</span> {liveNorm.mm.toFixed(1)} mm
                      </span>
                    </div>
                  )}

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

                    {/* Live discrepancy preview */}
                    {liveDiscrepancy ? (
                      <div className={`mt-2 px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 ${
                        liveDiscrepancy.hasDiscrepancy 
                          ? 'bg-[#FFF4D7] border border-[#F2D48E] text-[#87560B]' 
                          : 'bg-[#E1ECE3] border border-[#CBD2C9] text-[#123C35]'
                      }`}>
                        {liveDiscrepancy.hasDiscrepancy ? (
                          <>
                            <AlertTriangle className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
                            <span>Diff: {liveDiscrepancy.diff} {metricUnit} &gt; {liveDiscrepancy.threshold} {metricUnit} threshold (Remeasurement suggested)</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-3.5 h-3.5 text-[#194D42] shrink-0" />
                            <span>Diff: {liveDiscrepancy.diff} {metricUnit} ≤ {liveDiscrepancy.threshold} {metricUnit} threshold (Consistent intra-observer reading)</span>
                          </>
                        )}
                      </div>
                    ) : (
                      <span className="text-[11px] text-[#829B83] mt-1 block">
                        Intra-observer consistency threshold: ±0.3 cm or ±3.0 mm.
                      </span>
                    )}
                  </div>
                </div>
              )}

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
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#D9AD54] to-[#E5C170] hover:from-[#e4be6b] hover:to-[#edd18e] text-[#0B2925] font-bold text-sm shadow-gold-glow transition-all flex items-center justify-center gap-2.5 transform hover:-translate-y-0.5 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 text-[#0B2925] animate-spin" />
                      <span>{t.assessment.searchingBtn}</span>
                    </>
                  ) : (
                    <>
                      <Stethoscope className="w-4 h-4 text-[#0B2925]" />
                      <span>{t.assessment.findBtn}</span>
                    </>
                  )}
                </button>
              </div>

            </form>

            {/* Repeat Discrepancy Warning Notice if triggered on submit */}
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
                Standard Operating Procedure (SOP) & Provenance
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
                <span>Source Provenance Authentication</span>
              </div>
              <p className="leading-relaxed">
                Transcriptions are drawn from <em>நோய் நாடல் நோய் முதல் நாடல் திரட்டு (பாகம் 1)</em>, பக்கங்கள் 368–371. Each reference reflects classical Siddha verses preserved without speculative interpolation.
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
                  OFFICIAL ARCHIVAL ASSESSMENT RECORD
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#123C35] mt-1">
                  {t.results.heading}
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-xs text-[#68736F] mt-2">
                  <span><strong>{t.results.sessionId}:</strong> <span className="font-mono text-[#123C35]">{currentRecord.sessionId}</span></span>
                  <span>•</span>
                  <span><strong>{t.results.recordedAt}:</strong> {new Date(currentRecord.timestamp).toLocaleString()}</span>
                  <span>•</span>
                  <span>
                    <strong>Mode:</strong> {currentRecord.measurementMode === 'traditional' ? 'Traditional Virarkadai (பாரம்பரியம்)' : 'Physical Metric (நவீன அளவீடு)'}
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <div>
                {currentRecord.matchStatus === 'matched' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E1ECE3] text-[#123C35] text-xs font-bold border border-[#123C35]/20">
                    <CheckCircle className="w-4 h-4 text-[#194D42]" />
                    <span>{t.results.matchFoundTitle}</span>
                  </span>
                ) : currentRecord.matchStatus === 'unsupported_conversion' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF4D7] text-[#87560B] text-xs font-bold border border-[#F2D48E]">
                    <AlertTriangle className="w-4 h-4 text-[#D97706]" />
                    <span>{language === 'ta' ? 'நவீன மாற்றீடு ஆய்வில் உறுதிப்படுத்தப்படவில்லை' : 'Unsupported Metric Conversion'}</span>
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
                  {currentRecord.measurementVal} {currentRecord.unit === 'virarkadai' ? 'விரற்கடை' : currentRecord.unit}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-[#68736F] uppercase tracking-wider block font-medium">
                  {currentRecord.measurementMode === 'traditional' ? 'Unit System' : t.results.normalizedEquivalent}
                </span>
                <span className="text-sm font-semibold text-[#194D42] font-mono mt-1 block">
                  {currentRecord.measurementMode === 'traditional' 
                    ? 'Traditional Virarkadai (விரற்கடை)' 
                    : `${currentRecord.normalizedCm} cm / ${currentRecord.normalizedMm} mm`}
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
                  Verification Status
                </span>
                <span className="text-xs font-bold mt-1 block">
                  {currentRecord.matchStatus === 'matched' ? (
                    <span className="text-[#194D42] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Authentic Reference
                    </span>
                  ) : (
                    <span className="text-[#87560B]">No authenticated match</span>
                  )}
                </span>
              </div>
            </div>

            {/* Matched Reference Content */}
            {currentRecord.matchStatus === 'matched' && currentRecord.matchedReferences.length > 0 ? (
              <div className="space-y-6">
                {currentRecord.matchedReferences.map((ref, idx) => {
                  const isTamil = language === 'ta';
                  const primaryText = isTamil ? ref.tamilText : (ref.englishText || ref.tamilText);
                  const secondaryText = isTamil ? ref.englishText : ref.tamilText;

                  return (
                    <div key={idx} className="p-6 rounded-2xl bg-[#FFFDF8] border-2 border-[#D9AD54]/40 shadow-sm space-y-5">
                      
                      {/* Top Header of Record Card */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E3E4DA] pb-4 gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-[#87560B] font-bold uppercase font-mono">
                              {t.results.traditionalVal}
                            </span>
                            {ref.category && (
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                ref.category === 'critical_prognosis' 
                                  ? 'bg-[#8B2D2D]/10 text-[#8B2D2D] border border-[#8B2D2D]/20' 
                                  : 'bg-[#123C35]/10 text-[#123C35] border border-[#123C35]/20'
                              }`}>
                                {ref.category === 'critical_prognosis' ? 'மரணக் குறிகுணங்கள் (Critical Signs)' : 'நோயிநிலைகள் (Disease Manifestation)'}
                              </span>
                            )}
                          </div>
                          <span className="text-2xl font-bold text-[#123C35] mt-0.5 block">
                            {ref.traditionalVal ? `${ref.traditionalVal} விரற்கடை` : `${ref.minVal} – ${ref.maxVal} ${ref.unit}`}
                          </span>
                        </div>

                        <div className="sm:text-right">
                          <span className="text-[11px] text-[#68736F] block">Source Page & Provenance</span>
                          <span className="font-mono text-xs font-bold text-[#123C35]">
                            {ref.sourceBook} {ref.pageNo ? `(பக். ${ref.pageNo})` : ''}
                          </span>
                        </div>
                      </div>

                      {/* Primary Language Display */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#194D42] uppercase tracking-wider flex items-center gap-1.5">
                            <Bookmark className="w-3.5 h-3.5 text-[#D9AD54]" />
                            {isTamil ? t.results.tamilInterpretation : t.results.englishTranslation}
                          </span>
                          <span className="text-[11px] font-mono text-[#829B83]">
                            Language: {isTamil ? 'தமிழ் (Tamil Active)' : 'English (Active)'}
                          </span>
                        </div>
                        <p className={`p-4 sm:p-5 rounded-xl border leading-relaxed ${
                          isTamil 
                            ? 'font-tamil text-lg sm:text-xl text-[#1E2926] font-semibold bg-[#F6F3E9] border-[#E3E4DA]' 
                            : 'text-sm sm:text-base text-[#1E2926] bg-white border-[#E3E4DA] font-medium'
                        }`}>
                          {primaryText}
                        </p>
                      </div>

                      {/* Secondary Language Display */}
                      {secondaryText && (
                        <div className="space-y-1.5 pt-1">
                          <span className="text-xs font-bold text-[#68736F] uppercase tracking-wider">
                            {isTamil ? t.results.englishTranslation : t.results.tamilInterpretation}
                          </span>
                          <p className={`p-3.5 rounded-lg border leading-relaxed ${
                            isTamil
                              ? 'text-xs sm:text-sm text-[#1E2926]/90 italic bg-white border-[#E3E4DA]'
                              : 'font-tamil text-base text-[#1E2926] bg-[#F6F3E9] border-[#E3E4DA]'
                          }`}>
                            {secondaryText}
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
                  );
                })}
              </div>
            ) : currentRecord.matchStatus === 'unsupported_conversion' ? (
              /* Unsupported Metric Conversion Card */
              <div className="p-6 sm:p-8 rounded-2xl bg-[#FFFDF8] border-2 border-[#F2D48E] space-y-5">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-[#FFF4D7] text-[#D97706] shrink-0 mt-0.5">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-serif font-bold text-[#123C35]">
                      {language === 'ta' ? 'நவீன அளவீட்டு மாற்றீடு நூலில் கிடைக்கவில்லை' : 'Modern Metric Conversion Not Documented in Classical Sources'}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#68736F] leading-relaxed mt-1">
                      {language === 'ta'
                        ? `நீங்கள் உள்ளிட்ட ${currentRecord.measurementVal} ${currentRecord.unit} அளவை மரபுவழி விரற்கடை அலகுகளுடன் இணைக்கும் நேரடி சமன்பாடு அசல் இலக்கியங்களில் குறிப்பிடப்படவில்லை. சித்த மருத்துவம் விரற்கடை (விரலின் அகலம்) என்ற தன்னுடல் சார்ந்த அலகையே பயன்படுத்தியது.`
                        : `Physical measurement ${currentRecord.measurementVal} ${currentRecord.unit} cannot be mapped to historical Virarkadai finger-breadths because classical Siddha literature defines diagnostic thresholds in discrete Virarkadai units rather than metric centimeters or millimeters.`}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#F6F3E9] border border-[#E3E4DA] text-xs space-y-2 text-[#1E2926]/90">
                  <div className="font-bold text-[#123C35] flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-[#D9AD54]" />
                    <span>Scientific Integrity & Anti-Fabrication Safeguard:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1.5 pl-1 leading-relaxed text-[#68736F]">
                    <li>
                      <strong>No Arbitrary Conversion:</strong> Ancient verses in <em>Noi Nadal Noi Mudal Nadal Thirattu</em> describe specific discrete Virarkadai intervals (4 to 10 விரற்கடை). Fabricating an arbitrary metric-to-virarkadai ratio without clinical source validation is strictly prohibited.
                    </li>
                    <li>
                      <strong>Switch to Traditional Virarkadai:</strong> If you know the patient&apos;s or subject&apos;s traditional Virarkadai count, switch to &quot;Traditional Virarkadai&quot; mode above to explore all 25 transcribed verses.
                    </li>
                    <li>
                      <strong>Documented Study Subset:</strong> Preliminary research (e.g. Palayamkottai Gunmam 2019) documented physical ranges between 11.9 cm and 19.0 cm for specific clinical subsets. Values outside documented ranges remain unmapped.
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              /* Generic No-Match Card */
              <div className="p-6 sm:p-8 rounded-2xl bg-[#FFFDF8] border-2 border-[#E3E4DA] space-y-5">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-[#FFF4D7] text-[#D97706] shrink-0 mt-0.5">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-serif font-bold text-[#123C35]">
                      {t.results.noMatchTitle}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#68736F] leading-relaxed mt-1">
                      Measurement <strong className="text-[#123C35]">{currentRecord.measurementVal} {currentRecord.unit}</strong> does not match any authenticated traditional Siddha reference entry in this archive.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#F6F3E9] border border-[#E3E4DA] text-xs space-y-2 text-[#1E2926]/90">
                  <div className="font-bold text-[#123C35] flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-[#D9AD54]" />
                    <span>Traditional Range Reference:</span>
                  </div>
                  <p className="text-[#68736F] leading-relaxed">
                    The authenticated reference archive covers values between <strong>4 and 10 விரற்கடை</strong> in ¼-virarkadai increments. Please verify the reading or consult the Reference Library.
                  </p>
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

