import React from 'react';
import { ArrowRight, BookOpen, Sparkles, Compass, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { HeroVisual } from './HeroVisual';

interface HeroProps {
  onStartAssessment: () => void;
  onViewSource: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartAssessment, onViewSource }) => {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0B2925] via-[#123C35] to-[#0E312B] text-[#F6F3E9] py-16 sm:py-24 lg:py-28 border-b border-[#D9AD54]/30">
      
      {/* Background radial atmosphere & subtle luxury pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#D9AD54_1.5px,transparent_1.5px)] [background-size:32px_32px]"></div>
      <div className="absolute -top-40 right-10 w-[550px] h-[550px] bg-[#194D42]/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 left-10 w-[500px] h-[500px] bg-[#0B2925]/80 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Powerful Editorial Headline & Actions */}
          <div className="lg:col-span-7 space-y-7 text-left">
            
            {/* Editorial Eyebrow */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#194D42]/80 border border-[#D9AD54]/40 text-[#D9AD54] text-xs font-mono font-semibold tracking-widest uppercase shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#D9AD54]" />
              <span>{t.hero.eyebrow}</span>
            </div>

            {/* Main Headline with balanced editorial hierarchy */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#FFFDF8] leading-[1.12]">
              Ancient Wisdom, <br className="hidden sm:inline" />
              <span className="text-gold-gradient font-serif">
                Presented for a Digital Generation.
              </span>
            </h1>

            {/* Refined Description */}
            <p className="text-base sm:text-lg text-[#F6F3E9]/85 max-w-2xl leading-relaxed font-sans font-normal">
              {t.hero.description}
            </p>

            {/* CTAs: Gold Primary & Emerald Glass Secondary */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onStartAssessment}
                className="inline-flex items-center gap-3 px-7 py-4 rounded-xl bg-gradient-to-r from-[#D9AD54] to-[#E5C170] hover:from-[#e4be6b] hover:to-[#edd18e] text-[#0B2925] font-bold text-sm shadow-gold-glow transition-all transform hover:-translate-y-0.5"
              >
                <span>{t.hero.primaryCta}</span>
                <ArrowRight className="w-4 h-4 text-[#0B2925]" />
              </button>

              <button
                onClick={onViewSource}
                className="inline-flex items-center gap-2.5 px-6 py-4 rounded-xl emerald-glass hover:bg-[#194D42] text-[#F6F3E9] border border-[#D9AD54]/40 font-semibold text-sm transition-all shadow-sm hover:border-[#D9AD54]"
              >
                <BookOpen className="w-4 h-4 text-[#D9AD54]" />
                <span>Explore Source Gallery</span>
              </button>
            </div>

            {/* Refined Trust & Provenance Bar */}
            <div className="pt-8 border-t border-[#829B83]/20 flex flex-wrap items-center gap-y-4 gap-x-8 text-xs text-[#829B83]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D9AD54]" />
                <span>Verified Historical Source Archive</span>
              </div>
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#D9AD54]" />
                <span>Standardized Anthropometric Protocol</span>
              </div>
            </div>

          </div>

          {/* Right Column: Custom 3D Digital Sculpture (NO BOOK PHOTO) */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <HeroVisual />
          </div>

        </div>
      </div>
    </section>
  );
};
