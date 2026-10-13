import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { BookMarked, FileText, ScrollText, CheckCircle2 } from 'lucide-react';

export const MetricsStrip: React.FC = () => {
  const { t } = useLanguage();

  const metrics = [
    {
      value: t.hero.stat1Val, // "25+"
      label: t.hero.stat1Label, // "Authentic Verses Transcribed"
      sub: "Pages 368 to 371",
      icon: ScrollText
    },
    {
      value: t.hero.stat2Val, // "4 DOIs"
      label: t.hero.stat2Label, // "Peer-Reviewed Citations"
      sub: "Indexed scientific publications",
      icon: FileText
    },
    {
      value: t.hero.stat3Val, // "Pages 368–371"
      label: t.hero.stat3Label, // "Siddha Source Book"
      sub: "Noi Nadal Noi Mudal Nadal Thirattu",
      icon: BookMarked
    },
    {
      value: "1 cm = 10 mm",
      label: "Unit Normalization",
      sub: "Intra-observer consistency checks",
      icon: CheckCircle2
    }
  ];

  return (
    <section className="bg-[#0B2925] border-b border-[#D9AD54]/25 py-8 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-[#829B83]/20">
          {metrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div key={idx} className={`pt-4 lg:pt-0 ${idx > 0 ? 'lg:pl-8' : ''} flex items-center gap-4 group`}>
                <div className="w-12 h-12 rounded-xl bg-[#123C35] border border-[#D9AD54]/30 flex items-center justify-center text-[#D9AD54] shrink-0 group-hover:scale-105 group-hover:border-[#D9AD54] transition-all">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-serif font-bold text-[#FFFDF8] group-hover:text-[#D9AD54] transition-colors">
                    {m.value}
                  </div>
                  <div className="text-xs font-semibold text-[#F6F3E9]/90 mt-0.5">
                    {m.label}
                  </div>
                  <div className="text-[11px] text-[#829B83] mt-0.5 font-mono">
                    {m.sub}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
