import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Shield, BookOpen, ExternalLink } from 'lucide-react';
import { RESEARCH_CITATIONS } from '../../data/authenticManuscriptData';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#123C35] text-[#F6F3E9] border-t-4 border-[#D9AD54] pt-14 pb-12 mt-20 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold tracking-wider text-[#FFFDF8]">
                {t.brand}
              </span>
            </div>
            <p className="text-sm text-[#829B83] max-w-md leading-relaxed">
              {t.tagline}
            </p>
            <div className="p-3.5 rounded-xl bg-[#194D42] border border-[#D9AD54]/20 text-xs text-[#FFFDF8]/90 flex items-start gap-3">
              <Shield className="w-5 h-5 text-[#D9AD54] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#D9AD54] block mb-0.5">Academic Exhibition Reference Tool</strong>
                {t.footer.disclaimer}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#D9AD54] font-semibold">
              Platform Modules
            </h4>
            <ul className="space-y-2 text-sm text-[#F6F3E9]/80">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-[#D9AD54] transition-colors">
                  {t.nav.home}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('sourceGallery')} className="hover:text-[#D9AD54] transition-colors">
                  {t.nav.sourceGallery}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('assessment')} className="hover:text-[#D9AD54] transition-colors">
                  {t.nav.assessment}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('references')} className="hover:text-[#D9AD54] transition-colors">
                  {t.nav.references}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('research')} className="hover:text-[#D9AD54] transition-colors">
                  {t.nav.research}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('history')} className="hover:text-[#D9AD54] transition-colors">
                  {t.nav.history}
                </button>
              </li>
            </ul>
          </div>

          {/* DOI Publications */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#D9AD54] font-semibold">
              Research DOIs
            </h4>
            <ul className="space-y-2 text-xs text-[#829B83]">
              {RESEARCH_CITATIONS.map((c) => (
                <li key={c.id}>
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#FFFDF8] flex items-center gap-1.5 group"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#D9AD54] group-hover:scale-110 transition-transform" />
                    <span className="truncate max-w-[200px]">{c.journal} ({c.year})</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-[#194D42] text-xs text-[#829B83] text-center flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>{t.footer.text}</p>
          <p className="text-[11px] opacity-75">{t.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
};
