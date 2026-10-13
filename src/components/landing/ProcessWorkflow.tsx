import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { BookOpen, Ruler, RefreshCw, Search, FileCheck, Download } from 'lucide-react';

export const ProcessWorkflow: React.FC = () => {
  const { t } = useLanguage();

  const steps = [
    {
      num: t.process.step1Num,
      title: t.process.step1Title,
      desc: t.process.step1Desc,
      icon: BookOpen
    },
    {
      num: t.process.step2Num,
      title: t.process.step2Title,
      desc: t.process.step2Desc,
      icon: Ruler
    },
    {
      num: t.process.step3Num,
      title: t.process.step3Title,
      desc: t.process.step3Desc,
      icon: RefreshCw
    },
    {
      num: t.process.step4Num,
      title: t.process.step4Title,
      desc: t.process.step4Desc,
      icon: Search
    },
    {
      num: t.process.step5Num,
      title: t.process.step5Title,
      desc: t.process.step5Desc,
      icon: FileCheck
    },
    {
      num: t.process.step6Num,
      title: t.process.step6Title,
      desc: t.process.step6Desc,
      icon: Download
    }
  ];

  return (
    <section className="py-20 bg-[#F6F3E9] border-b border-[#E3E4DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#D9AD54] font-bold">
            EDUCATIONAL PROTOCOL
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#123C35]">
            {t.process.title}
          </h2>
          <p className="text-base text-[#68736F] leading-relaxed">
            {t.process.subtitle}
          </p>
        </div>

        {/* 6-Step Connected Sequence */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative rounded-2xl bg-[#FFFDF8] border border-[#E3E4DA] p-6 shadow-sm hover:shadow-elevated transition-all flex flex-col justify-between group"
              >
                {/* Step badge and icon */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-2xl font-bold text-[#D9AD54] opacity-80 group-hover:opacity-100 transition-opacity">
                    {step.num}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-[#F6F3E9] border border-[#E3E4DA] flex items-center justify-center text-[#123C35] group-hover:bg-[#123C35] group-hover:text-[#D9AD54] transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif text-lg font-bold text-[#123C35]">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#68736F] leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E3E4DA]/60 flex items-center justify-between text-[11px] text-[#829B83]">
                  <span>Protocol Phase {idx + 1} of 6</span>
                  <span className="w-2 h-2 rounded-full bg-[#D9AD54]/70"></span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
