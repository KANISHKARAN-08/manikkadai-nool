import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { AUTHENTIC_MANUSCRIPT_TRANSCRIPTION, TraditionalTableItem } from '../../data/authenticManuscriptData';
import { BookOpen, ZoomIn, Eye, Sparkles } from 'lucide-react';

export const SourceViewer: React.FC = () => {
  const { t, language } = useLanguage();
  const [activePage, setActivePage] = useState<'368' | '369' | '371'>('368');
  const [enlargeImage, setEnlargeImage] = useState(false);

  const pageDetails = {
    '368': {
      title: t.sourceGallery.tab368,
      image: '/assets/book_page_368.jpeg',
      description: 'Page 368 contains the classical Virarkadai measurement table from 10 down to 7 virarkadai representing various systemic disease manifestations (நோயிநிலைகள்).',
      items: AUTHENTIC_MANUSCRIPT_TRANSCRIPTION.filter(i => i.pageNo === '368')
    },
    '369': {
      title: t.sourceGallery.tab369,
      image: '/assets/book_page_369.jpeg',
      description: 'Page 369 concludes the disease manifestations (6¾ to 6¼) and introduces classical verses for terminal/critical states (மரணக் குறிகுணங்கள்).',
      items: AUTHENTIC_MANUSCRIPT_TRANSCRIPTION.filter(i => i.pageNo === '369' || i.pageNo === '369 & 371')
    },
    '371': {
      title: t.sourceGallery.tab371,
      image: '/assets/book_page_371.jpeg',
      description: 'Page 371 outlines critical prognostic signs from 6 down to 4 virarkadai, listing day-specific indicators and closing classical stanzas.',
      items: AUTHENTIC_MANUSCRIPT_TRANSCRIPTION.filter(i => i.pageNo === '371' || i.pageNo === '369 & 371')
    }
  };

  const current = pageDetails[activePage];

  return (
    <section className="py-20 bg-[#FFFDF8] border-b border-[#E3E4DA]" id="source-gallery">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D9AD54]/15 border border-[#D9AD54]/30 text-[#87560B] text-xs font-mono font-bold uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AUTHENTIC PRIMARY SOURCE ARCHIVE</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#123C35]">
            {t.sourceGallery.title}
          </h2>
          <p className="text-base text-[#68736F] leading-relaxed">
            {t.sourceGallery.subtitle}
          </p>
        </div>

        {/* Page Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {(['368', '369', '371'] as const).map((pageKey) => {
            const isActive = activePage === pageKey;
            return (
              <button
                key={pageKey}
                onClick={() => setActivePage(pageKey)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#123C35] text-[#D9AD54] shadow-md border-2 border-[#D9AD54]'
                    : 'bg-[#F6F3E9] text-[#1E2926] border border-[#E3E4DA] hover:bg-[#E8EFE8]'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>{pageDetails[pageKey].title}</span>
              </button>
            );
          })}
        </div>

        {/* Split Layout: Photo on Left, Transcribed Data on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Original Photograph Preview */}
          <div className="lg:col-span-5 bg-[#F6F3E9] border border-[#E3E4DA] rounded-2xl p-4 shadow-sm sticky top-28">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-bold text-[#123C35] uppercase tracking-wider">
                {t.sourceGallery.viewOriginalPhoto}
              </span>
              <button
                onClick={() => setEnlargeImage(!enlargeImage)}
                className="text-xs text-[#87560B] flex items-center gap-1 font-semibold hover:underline"
              >
                <ZoomIn className="w-3.5 h-3.5" />
                <span>{enlargeImage ? 'Normal Size' : 'Zoom In'}</span>
              </button>
            </div>

            <div className={`overflow-hidden rounded-xl border border-[#E3E4DA] bg-white transition-all duration-300 ${enlargeImage ? 'max-h-[700px]' : 'max-h-[480px]'}`}>
              <img
                src={current.image}
                alt={current.title}
                className="w-full h-full object-contain cursor-zoom-in"
                onClick={() => setEnlargeImage(!enlargeImage)}
              />
            </div>

            <div className="mt-3 p-3 rounded-lg bg-[#FFFDF8] border border-[#E3E4DA] text-xs text-[#68736F]">
              <strong className="text-[#123C35] block mb-0.5">Citation Reference:</strong>
              <em>நோய் நாடல் நோய் முதல் நாடல் திரட்டு (பாகம் 1)</em>, பக். {activePage}.
            </div>
          </div>

          {/* Right: Accurate Transcriptions & Classical Verses */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl bg-[#FFFDF8] border border-[#E3E4DA] p-6 shadow-sm">
              <div className="border-b border-[#E3E4DA] pb-4 mb-4">
                <h3 className="font-serif text-xl font-bold text-[#123C35]">
                  {current.title}
                </h3>
                <p className="text-xs text-[#68736F] mt-1">
                  {current.description}
                </p>
              </div>

              {/* Classical Poems if present on page */}
              {current.items.some(i => i.poemVerse) && (
                <div className="mb-6 space-y-3">
                  <div className="text-xs font-mono font-bold text-[#87560B] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{t.sourceGallery.classicalPoemNotice}</span>
                  </div>
                  
                  {current.items.filter(i => i.poemVerse).map((pItem, pIdx) => (
                    <div key={pIdx} className="p-4 rounded-xl bg-[#F6F3E9] border-l-4 border-[#D9AD54] text-xs space-y-2">
                      <div className="font-bold text-[#123C35] flex items-center justify-between">
                        <span>{pItem.poemVerseTitle}</span>
                        <span className="font-mono text-[#D9AD54]">{pItem.virarkadai} விரற்கடை</span>
                      </div>
                      <pre className="font-tamil whitespace-pre-wrap text-sm text-[#1E2926] leading-relaxed">
                        {pItem.poemVerse}
                      </pre>
                    </div>
                  ))}
                </div>
              )}

              {/* Table of Virarkadai values and disease states */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b-2 border-[#123C35] text-[#123C35] bg-[#F6F3E9]">
                      <th className="py-2.5 px-3 font-bold w-24">
                        {t.sourceGallery.virarkadaiCol}
                      </th>
                      <th className="py-2.5 px-3 font-bold">
                        {t.sourceGallery.tamilManifestationCol}
                      </th>
                      <th className="py-2.5 px-3 font-bold">
                        {t.sourceGallery.englishTranslationCol}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E3E4DA]">
                    {current.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-[#F6F3E9]/50 transition-colors">
                        <td className="py-3 px-3 align-top font-bold text-[#123C35] font-mono text-sm whitespace-nowrap">
                          <span className="inline-block bg-[#123C35]/10 px-2 py-0.5 rounded text-[#123C35]">
                            {item.virarkadai}
                          </span>
                        </td>
                        <td className="py-3 px-3 align-top font-tamil text-sm text-[#1E2926] leading-relaxed">
                          {item.tamilText}
                        </td>
                        <td className="py-3 px-3 align-top text-xs text-[#68736F] leading-relaxed">
                          {item.englishText}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
