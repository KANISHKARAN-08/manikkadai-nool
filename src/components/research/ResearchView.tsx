import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { RESEARCH_CITATIONS } from '../../data/authenticManuscriptData';
import { 
  BookOpen, 
  ExternalLink, 
  AlertTriangle, 
  FileCheck2, 
  ShieldAlert, 
  CheckCircle2,
  Sparkles,
  Scale
} from 'lucide-react';

export const ResearchView: React.FC = () => {
  const { t, language } = useLanguage();

  const guidelines = [
    { num: '1', text: t.research.g1 },
    { num: '2', text: t.research.g2 },
    { num: '3', text: t.research.g3 },
    { num: '4', text: t.research.g4 },
    { num: '5', text: t.research.g5 },
    { num: '6', text: t.research.g6 }
  ];

  return (
    <div className="py-12 bg-[#F6F3E9] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#123C35] text-[#D9AD54] text-xs font-mono font-bold tracking-wider uppercase">
            <BookOpen className="w-3.5 h-3.5" />
            <span>ACADEMIC EVIDENCE & LITERATURE SYNTHESIS</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#123C35] leading-tight">
            {t.research.title}
          </h1>

          <p className="text-sm sm:text-base text-[#68736F] leading-relaxed">
            {t.research.subtitle}
          </p>

          <div className="p-4 rounded-2xl bg-[#FFFDF8] border-l-4 border-[#D9AD54] text-xs sm:text-sm text-[#1E2926] leading-relaxed shadow-sm">
            {t.research.intro}
          </div>
        </div>

        {/* Section 1: Classical Literature Foundation */}
        <div className="rounded-2xl bg-[#FFFDF8] border border-[#E3E4DA] border-l-4 border-l-[#D9AD54] p-6 sm:p-8 shadow-card space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#123C35] flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-[#D9AD54]" />
            <span>{t.research.section1Title}</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#1E2926]/90 leading-relaxed">
            {t.research.section1Text}
          </p>
        </div>

        {/* Section 2: Gunmam Study Reported Ranges */}
        <div className="rounded-2xl bg-[#FFFDF8] border border-[#E3E4DA] p-6 sm:p-8 shadow-card space-y-6">
          <div className="space-y-2">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#123C35]">
              {t.research.section2Title}
            </h2>
            <p className="text-xs sm:text-sm text-[#68736F] leading-relaxed">
              {t.research.section2Text}
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#E3E4DA]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F6F3E9] text-[#123C35] border-b-2 border-[#123C35]">
                  <th className="py-3 px-4 font-bold">{t.research.tableCol1}</th>
                  <th className="py-3 px-4 font-bold">{t.research.tableCol2}</th>
                  <th className="py-3 px-4 font-bold">{t.research.tableCol3}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3E4DA]">
                <tr className="hover:bg-[#F6F3E9]/50">
                  <td className="py-3 px-4 font-bold text-[#123C35] whitespace-nowrap font-mono">{t.research.range1Vir}</td>
                  <td className="py-3 px-4 font-semibold text-[#194D42]">{t.research.range1Tier}</td>
                  <td className="py-3 px-4 text-[#68736F]">{t.research.range1Note}</td>
                </tr>
                <tr className="hover:bg-[#F6F3E9]/50">
                  <td className="py-3 px-4 font-bold text-[#123C35] whitespace-nowrap font-mono">{t.research.range2Vir}</td>
                  <td className="py-3 px-4 font-semibold text-[#87560B]">{t.research.range2Tier}</td>
                  <td className="py-3 px-4 text-[#68736F]">{t.research.range2Note}</td>
                </tr>
                <tr className="hover:bg-[#F6F3E9]/50">
                  <td className="py-3 px-4 font-bold text-[#123C35] whitespace-nowrap font-mono">{t.research.range3Vir}</td>
                  <td className="py-3 px-4 font-semibold text-[#8B2D2D]">{t.research.range3Tier}</td>
                  <td className="py-3 px-4 text-[#68736F]">{t.research.range3Note}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 2A: Metric Conversion Caveats Table */}
          <div className="p-5 rounded-xl bg-[#F6F3E9] border border-[#E3E4DA] space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#123C35] flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#D9AD54]" />
              <span>{t.research.conversionTitle}</span>
            </h3>
            <p className="text-xs text-[#68736F] leading-relaxed">
              {t.research.conversionText}
            </p>

            <div className="overflow-x-auto rounded-lg border border-[#CBD2C9] bg-white">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#CBD2C9] bg-[#FFFDF8] text-[#123C35]">
                    <th className="py-2.5 px-3 font-bold">{t.research.convCol1}</th>
                    <th className="py-2.5 px-3 font-bold">{t.research.convCol2}</th>
                    <th className="py-2.5 px-3 font-bold">{t.research.convCol3}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3E4DA]">
                  <tr>
                    <td className="py-2.5 px-3 font-semibold">{t.research.convTier1}</td>
                    <td className="py-2.5 px-3 font-mono">{t.research.convVal1}</td>
                    <td className="py-2.5 px-3 font-bold text-[#123C35]">{t.research.convMetric1}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold">{t.research.convTier2}</td>
                    <td className="py-2.5 px-3 font-mono">{t.research.convVal2}</td>
                    <td className="py-2.5 px-3 font-bold text-[#123C35]">{t.research.convMetric2}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold">{t.research.convTier3}</td>
                    <td className="py-2.5 px-3 font-mono">{t.research.convVal3}</td>
                    <td className="py-2.5 px-3 font-bold text-[#123C35]">{t.research.convMetric3}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-3.5 rounded-lg bg-[#FFF4D7] border border-[#F2D48E] text-xs text-[#87560B] leading-relaxed font-medium">
              <AlertTriangle className="w-4 h-4 text-[#D97706] inline mr-1.5 align-text-bottom" />
              {t.research.convWarning}
            </div>
          </div>

        </div>

        {/* Section 3: Study Design & Findings */}
        <div className="rounded-2xl bg-[#FFFDF8] border border-[#E3E4DA] p-6 sm:p-8 shadow-card space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#123C35]">
            {t.research.section3Title}
          </h2>
          <ul className="space-y-2.5 text-xs sm:text-sm text-[#1E2926]/90">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#194D42] shrink-0 mt-0.5" />
              <span>{t.research.s3_1}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#194D42] shrink-0 mt-0.5" />
              <span>{t.research.s3_2}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#194D42] shrink-0 mt-0.5" />
              <span>{t.research.s3_3}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#194D42] shrink-0 mt-0.5" />
              <span>{t.research.s3_4}</span>
            </li>
          </ul>
        </div>

        {/* Section 4: Verification Guidelines */}
        <div className="rounded-2xl bg-[#FFFDF8] border border-[#E3E4DA] p-6 sm:p-8 shadow-card space-y-6">
          <div className="space-y-1">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#123C35] flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-[#194D42]" />
              <span>{t.research.section4Title}</span>
            </h2>
            <p className="text-xs text-[#68736F]">
              Methodological guidelines for Siddha clinicians, postgraduates, and researchers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {guidelines.map((g) => (
              <div key={g.num} className="p-4 rounded-xl bg-[#F6F3E9] border border-[#E3E4DA] space-y-1 text-xs">
                <span className="font-mono font-bold text-[#D9AD54] text-sm">
                  Guideline 0{g.num}
                </span>
                <p className="text-[#1E2926]/90 leading-relaxed font-sans">
                  {g.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Study Limitations */}
        <div className="rounded-2xl bg-[#FFFDF8] border-l-4 border-[#8B2D2D] p-6 sm:p-8 shadow-card space-y-3">
          <h2 className="font-serif text-xl font-bold text-[#8B2D2D] flex items-center gap-2">
            <ShieldAlert className="w-5 h-5" />
            <span>{t.research.section5Title}</span>
          </h2>
          <ul className="space-y-2 text-xs sm:text-sm text-[#1E2926]/90">
            <li className="flex items-start gap-2">
              <span className="text-[#8B2D2D] font-bold">•</span>
              <span>{t.research.lim1}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#8B2D2D] font-bold">•</span>
              <span>{t.research.lim2}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#8B2D2D] font-bold">•</span>
              <span>{t.research.lim3}</span>
            </li>
          </ul>
        </div>

        {/* Section 6: Citations & Working DOIs */}
        <div className="rounded-2xl bg-[#FFFDF8] border-2 border-[#123C35] p-6 sm:p-8 shadow-card space-y-6">
          <div className="border-b border-[#E3E4DA] pb-4">
            <span className="text-xs font-mono font-bold text-[#D9AD54] uppercase">PEER-REVIEWED LITERATURE</span>
            <h2 className="font-serif text-2xl font-bold text-[#123C35] mt-1">
              {t.research.citationsHeading}
            </h2>
          </div>

          <div className="space-y-4">
            {RESEARCH_CITATIONS.map((cite, idx) => (
              <div key={cite.id} className="p-5 rounded-xl bg-[#F6F3E9] border border-[#E3E4DA] hover:shadow-sm transition-all space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="text-xs sm:text-sm font-bold text-[#123C35]">
                    {idx + 1}. {cite.authors} ({cite.year}).
                  </div>
                  <a
                    href={cite.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#123C35] text-[#D9AD54] hover:bg-[#194D42] text-xs font-mono font-bold transition-colors shrink-0"
                  >
                    <span>DOI: {cite.doi}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="text-xs font-serif italic text-[#1E2926]">
                  "{cite.title}"
                </div>

                <div className="text-xs text-[#68736F]">
                  <strong>{cite.journal}</strong>, Vol. {cite.volume}, pp. {cite.pages}.
                </div>

                <p className="text-xs text-[#829B83] pt-1 leading-relaxed">
                  {cite.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
