import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Stethoscope, 
  BookOpen, 
  ShieldCheck, 
  FileText, 
  History, 
  ArrowUpRight 
} from 'lucide-react';

interface FeatureCardsProps {
  onNavigate: (tab: string) => void;
}

export const FeatureCards: React.FC<FeatureCardsProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

  const features = [
    {
      id: 'assessment',
      title: 'Traditional Assessment',
      tamilTitle: 'மணிக்கடை நூல் மதிப்பீடு',
      desc: 'Guided protocol to record wrist circumference, normalize physical units, check repeat-reading consistency, and explore verified mappings.',
      icon: Stethoscope,
      accent: 'border-[#D9AD54]/40 hover:border-[#D9AD54]',
      badge: 'Interactive Tool'
    },
    {
      id: 'sourceGallery',
      title: 'Source Gallery',
      tamilTitle: 'அசல் சித்த மூல ஏடுகள்',
      desc: 'High-resolution photographs of classical pages from Noi Nadal Noi Mudal Nadal Thirattu with verified Unicode Tamil transcriptions and verses.',
      icon: BookOpen,
      accent: 'border-[#829B83]/30 hover:border-[#D9AD54]',
      badge: 'Manuscript Archive'
    },
    {
      id: 'references',
      title: 'Verified Reference Library',
      tamilTitle: 'சரிபார்க்கப்பட்ட குறிப்பு நூலகம்',
      desc: 'Curated repository of authenticated measurement-to-interpretation mappings with overlap detection, status tracking, and CSV tools.',
      icon: ShieldCheck,
      accent: 'border-[#194D42]/40 hover:border-[#D9AD54]',
      badge: 'Curated Database'
    },
    {
      id: 'research',
      title: 'Research & DOI References',
      tamilTitle: 'ஆய்வு வெளியீடுகள் & DOI',
      desc: 'Critical academic review of the 2019 Palayamkottai Gunmam study, approximate metric conversion caveats, and four clickable DOI citations.',
      icon: FileText,
      accent: 'border-[#829B83]/30 hover:border-[#D9AD54]',
      badge: 'Peer-Reviewed'
    },
    {
      id: 'history',
      title: 'Session History',
      tamilTitle: 'அமர்வு வரலாறு',
      desc: 'Persistent records of physical measurements, repeat readings, and matched queries, with instant print reports and UTF-8 CSV exports.',
      icon: History,
      accent: 'border-[#D9AD54]/40 hover:border-[#D9AD54]',
      badge: 'Cloud & Local'
    }
  ];

  return (
    <section className="py-20 bg-[#FFFDF8] border-b border-[#E3E4DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#D9AD54] font-bold">
            PLATFORM ARCHITECTURE
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#123C35]">
            Core Educational Modules
          </h2>
          <p className="text-base text-[#68736F] leading-relaxed">
            Thoughtfully structured digital tools honoring traditional Siddha scholarship while maintaining rigorous academic and data standards.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            const isWide = idx === 0 || idx === 1; // prominent cards
            return (
              <div
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`group relative rounded-2xl bg-[#F6F3E9] p-7 border transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 cursor-pointer flex flex-col justify-between ${item.accent}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-[#FFFDF8] border border-[#E3E4DA] flex items-center justify-center text-[#123C35] shadow-sm group-hover:bg-[#123C35] group-hover:text-[#D9AD54] transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono tracking-wider px-2.5 py-1 rounded-full bg-[#123C35]/10 text-[#123C35] font-semibold border border-[#123C35]/15">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-[#123C35] group-hover:text-[#194D42] transition-colors">
                    {item.title}
                  </h3>
                  <div className="font-tamil text-xs text-[#829B83] mt-0.5 mb-3">
                    {item.tamilTitle}
                  </div>

                  <p className="text-xs sm:text-sm text-[#68736F] leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#E3E4DA] flex items-center justify-between text-xs font-bold text-[#123C35] group-hover:text-[#D9AD54] transition-colors">
                  <span>Open Module</span>
                  <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
