import React, { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { DemoBanner } from './components/common/DemoBanner';
import { Hero } from './components/landing/Hero';
import { HeritageStory } from './components/landing/HeritageStory';
import { ProcessWorkflow } from './components/landing/ProcessWorkflow';
import { SourceViewer } from './components/landing/SourceViewer';
import { AssessmentView } from './components/assessment/AssessmentView';
import { ReferenceView } from './components/references/ReferenceView';
import { ResearchView } from './components/research/ResearchView';
import { HistoryView } from './components/history/HistoryView';
import { AuthModal } from './components/auth/AuthModal';
import { useLanguage } from './context/LanguageContext';
import { useAuth } from './context/AuthContext';
import { ArrowRight, BookOpen, Stethoscope, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('home');
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);

  // Require auth or demo for assessment / admin if configured, or prompt modal
  const handleProtectedNavigation = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F3E9] text-[#1E2926] selection:bg-[#123C35] selection:text-[#FFFDF8]">
      
      {/* Top Banner indicating Supabase vs Demo mode */}
      <DemoBanner />

      {/* Main Sticky Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={handleProtectedNavigation} 
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Main Tab Router */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div>
            <Hero 
              onStartAssessment={() => handleProtectedNavigation('assessment')} 
              onViewSource={() => handleProtectedNavigation('sourceGallery')} 
            />
            <HeritageStory />
            <ProcessWorkflow />
            <SourceViewer />

            {/* Final Landing Call to Action Section */}
            <section className="py-20 bg-gradient-to-br from-[#123C35] via-[#15443B] to-[#194D42] text-[#F6F3E9] border-t border-[#D9AD54]/30">
              <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#194D42] text-[#D9AD54] text-xs font-mono font-bold uppercase border border-[#D9AD54]/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>EXPLORE THE REFERENCE METHOD</span>
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#FFFDF8]">
                  Digitizing Siddha Wisdom with Transparency & Rigor.
                </h2>

                <p className="text-sm sm:text-base text-[#F6F3E9]/80 max-w-2xl mx-auto leading-relaxed">
                  Join researchers, students, and clinicians in exploring traditional Siddha anthropometrics through authenticated manuscripts, rigorous unit normalization, and responsible data management.
                </p>

                <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                  <button
                    onClick={() => handleProtectedNavigation('assessment')}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#D9AD54] hover:bg-[#e4be6b] text-[#123C35] font-bold text-sm shadow-elevated transition-all"
                  >
                    <Stethoscope className="w-4 h-4" />
                    <span>{t.hero.primaryCta}</span>
                  </button>

                  <button
                    onClick={() => handleProtectedNavigation('research')}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#194D42] hover:bg-[#1f5e51] text-[#F6F3E9] border border-[#D9AD54]/30 font-semibold text-sm transition-all"
                  >
                    <BookOpen className="w-4 h-4 text-[#D9AD54]" />
                    <span>View Published Studies</span>
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'sourceGallery' && (
          <SourceViewer />
        )}

        {activeTab === 'assessment' && (
          <AssessmentView 
            onNavigateHistory={() => handleProtectedNavigation('history')} 
          />
        )}

        {activeTab === 'references' && (
          <ReferenceView />
        )}

        {activeTab === 'research' && (
          <ResearchView />
        )}

        {activeTab === 'history' && (
          <HistoryView />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleProtectedNavigation} />

      {/* Authentication & Exhibition Demo Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />

    </div>
  );
};
export default App;
