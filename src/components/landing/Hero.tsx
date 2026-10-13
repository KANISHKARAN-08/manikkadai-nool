import React from 'react';
import { ArrowRight, BookOpen, Sparkles, Shield, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface HeroProps {
  onStartAssessment: () => void;
  onViewSource: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartAssessment, onViewSource }) => {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#123C35] via-[#15443B] to-[#123C35] text-[#F6F3E9] py-16 lg:py-24 border-b border-[#D9AD54]/30">
      {/* Decorative botanical manuscript subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#D9AD54_1px,transparent_1px)] [background-size:24px_24px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#194D42] border border-[#D9AD54]/40 text-[#D9AD54] text-xs font-mono font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.hero.eyebrow}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#FFFDF8] leading-[1.15]">
              {t.hero.title}
            </h1>

            <p className="text-base sm:text-lg text-[#F6F3E9]/85 max-w-2xl leading-relaxed font-sans">
              {t.hero.description}
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onStartAssessment}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#D9AD54] hover:bg-[#e4be6b] text-[#123C35] font-bold text-sm shadow-elevated transition-all transform hover:-translate-y-0.5"
              >
                <span>{t.hero.primaryCta}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onViewSource}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#194D42] hover:bg-[#1f5e51] text-[#F6F3E9] border border-[#D9AD54]/30 font-semibold text-sm transition-all"
              >
                <BookOpen className="w-4 h-4 text-[#D9AD54]" />
                <span>{t.hero.secondaryCta}</span>
              </button>
            </div>

            {/* Credibility highlights */}
            <div className="pt-8 border-t border-[#829B83]/20 grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-serif font-bold text-[#D9AD54]">{t.hero.stat1Val}</div>
                <div className="text-xs text-[#829B83] mt-0.5">{t.hero.stat1Label}</div>
              </div>
              <div>
                <div className="text-2xl font-serif font-bold text-[#D9AD54]">{t.hero.stat2Val}</div>
                <div className="text-xs text-[#829B83] mt-0.5">{t.hero.stat2Label}</div>
              </div>
              <div>
                <div className="text-2xl font-serif font-bold text-[#D9AD54]">{t.hero.stat3Val}</div>
                <div className="text-xs text-[#829B83] mt-0.5">{t.hero.stat3Label}</div>
              </div>
            </div>

          </div>

          {/* Right Column: Source Manuscript Showcase Card */}
          <div className="lg:col-span-5">
            <div className="relative group">
              {/* Outer decorative antique frame */}
              <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-r from-[#D9AD54] to-[#829B83] opacity-30 blur-sm group-hover:opacity-50 transition-opacity"></div>
              
              <div className="relative rounded-2xl bg-[#FFFDF8] text-[#1E2926] p-4 sm:p-6 shadow-2xl border border-[#E3E4DA]">
                {/* Image preview of authentic photographed book page */}
                <div className="relative overflow-hidden rounded-xl border border-[#E3E4DA] bg-[#F6F3E9] aspect-[4/3] flex items-center justify-center">
                  <img
                    src="/assets/book_page_368.jpeg"
                    alt="Authentic Siddha Medical Book Page 368 - Noi Nadal Noi Mudal Nadal Thirattu"
                    className="w-full h-full object-cover object-center filter saturate-90 hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 px-2.5 py-1 rounded bg-[#123C35]/90 text-[#D9AD54] text-[10px] font-mono tracking-wider backdrop-blur-sm">
                    PAGE 368
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#68736F]">
                    <span className="font-semibold text-[#123C35]">நோய் நாடல் நோய் முதல் நாடல் திரட்டு</span>
                    <span className="font-mono">Part 1</span>
                  </div>
                  <p className="text-xs text-[#1E2926] font-medium leading-relaxed">
                    Traditional measurement table transcribing wrist virarkadai dimensions (10 down to 4) and associated classical symptoms.
                  </p>
                  
                  <div 
                    onClick={onViewSource}
                    className="pt-2 flex items-center justify-between text-xs font-bold text-[#194D42] hover:text-[#123C35] cursor-pointer group-hover:translate-x-1 transition-transform"
                  >
                    <span>Inspect verified Tamil transcription</span>
                    <ChevronRight className="w-4 h-4 text-[#D9AD54]" />
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
