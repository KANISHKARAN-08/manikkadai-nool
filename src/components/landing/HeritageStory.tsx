import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { BookOpen, Stethoscope, FileText, AlertTriangle } from 'lucide-react';

export const HeritageStory: React.FC = () => {
  const { t } = useLanguage();

  const distinctions = [
    {
      icon: BookOpen,
      title: t.heritage.d1Title,
      desc: t.heritage.d1Desc,
      tag: 'Ancient Manuscript Evidence',
      tagColor: 'bg-[#D9AD54]/15 text-[#87560B] border-[#D9AD54]/30'
    },
    {
      icon: Stethoscope,
      title: t.heritage.d2Title,
      desc: t.heritage.d2Desc,
      tag: 'Digital Application Protocol',
      tagColor: 'bg-[#123C35]/10 text-[#123C35] border-[#123C35]/20'
    },
    {
      icon: FileText,
      title: t.heritage.d3Title,
      desc: t.heritage.d3Desc,
      tag: '2019 Observational Study',
      tagColor: 'bg-[#829B83]/20 text-[#194D42] border-[#829B83]/40'
    },
    {
      icon: AlertTriangle,
      title: t.heritage.d4Title,
      desc: t.heritage.d4Desc,
      tag: 'Clinical Safety Boundary',
      tagColor: 'bg-[#8B2D2D]/10 text-[#8B2D2D] border-[#8B2D2D]/20'
    }
  ];

  return (
    <section className="py-20 bg-[#FFFDF8] border-b border-[#E3E4DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#D9AD54] font-bold">
            TRADITIONAL SIDDHA ANTHROPOMETRY
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#123C35]">
            {t.heritage.title}
          </h2>
          <p className="text-base text-[#68736F] leading-relaxed font-sans">
            {t.heritage.subtitle}
          </p>
        </div>

        {/* Narrative Paragraphs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-5xl mx-auto">
          <div className="p-6 rounded-2xl bg-[#F6F3E9] border border-[#E3E4DA] space-y-3">
            <h3 className="font-serif text-lg font-bold text-[#123C35]">
              {t.heritage.p1.slice(0, 30)}...
            </h3>
            <p className="text-sm text-[#1E2926]/90 leading-relaxed">
              {t.heritage.p1}
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-[#F6F3E9] border border-[#E3E4DA] space-y-3">
            <h3 className="font-serif text-lg font-bold text-[#123C35]">
              {t.heritage.p2.slice(0, 35)}...
            </h3>
            <p className="text-sm text-[#1E2926]/90 leading-relaxed">
              {t.heritage.p2}
            </p>
          </div>
        </div>

        {/* Core Methodological Distinctions Grid */}
        <div className="mt-12">
          <div className="text-center mb-8">
            <h3 className="font-serif text-2xl font-bold text-[#123C35]">
              {t.heritage.distinctionTitle}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {distinctions.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-[#F6F3E9] border border-[#E3E4DA] p-6 hover:shadow-elevated transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-[#FFFDF8] border border-[#E3E4DA] flex items-center justify-center text-[#123C35] shadow-sm">
                        <Icon className="w-5 h-5 text-[#194D42]" />
                      </div>
                      <span className={`text-[10px] font-mono tracking-wider px-2 py-0.5 rounded border uppercase font-semibold ${item.tagColor}`}>
                        {item.tag}
                      </span>
                    </div>

                    <h4 className="font-serif text-base font-bold text-[#123C35] leading-snug">
                      {item.title}
                    </h4>

                    <p className="text-xs text-[#68736F] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
