import React, { useState } from 'react';
import { Menu, X, Globe, User, LogOut, BookOpen, ShieldCheck, History, Stethoscope, FileText } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenAuth }) => {
  const { language, toggleLanguage, t } = useLanguage();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: t.nav.home },
    { id: 'assessment', label: t.nav.assessment, icon: Stethoscope },
    { id: 'sourceGallery', label: t.nav.sourceGallery, icon: BookOpen },
    { id: 'references', label: t.nav.references, icon: ShieldCheck },
    { id: 'research', label: t.nav.research, icon: FileText },
    { id: 'history', label: t.nav.history, icon: History }
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0B2925]/90 backdrop-blur-md text-[#F6F3E9] border-b border-[#D9AD54]/35 shadow-lg no-print transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Wordmark & Emblem */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            {/* Custom Dimensional Emblem */}
            <div className="w-10 h-10 rounded-full border border-[#D9AD54] bg-[#123C35] flex items-center justify-center shadow-gold-glow group-hover:scale-105 transition-transform duration-300">
              <svg viewBox="0 0 40 40" className="w-6 h-6 text-[#D9AD54]">
                <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" strokeWidth="1.25" strokeDasharray="3 3" opacity="0.6" />
                <circle cx="20" cy="20" r="13" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12 23 C16 14, 20 12, 24 18 C28 24, 32 20, 30 15" fill="none" stroke="#FFFDF8" strokeWidth="2" strokeLinecap="round" />
                <circle cx="20" cy="20" r="3" fill="#D9AD54" />
              </svg>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif tracking-wide text-lg sm:text-xl font-bold text-[#FFFDF8] group-hover:text-[#D9AD54] transition-colors">
                  {t.brand}
                </span>
                <span className="hidden md:inline-block text-[9px] font-mono tracking-widest uppercase bg-[#D9AD54]/20 text-[#D9AD54] px-1.5 py-0.5 rounded border border-[#D9AD54]/30">
                  SIDDHA
                </span>
              </div>
              <p className="text-[10px] text-[#829B83] tracking-wide font-sans hidden sm:block">
                Traditional Siddha Knowledge. Thoughtfully Digitized.
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#194D42] text-[#D9AD54] border border-[#D9AD54]/50 shadow-inner'
                      : 'text-[#F6F3E9]/80 hover:text-[#FFFDF8] hover:bg-[#123C35]'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5 opacity-80" />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls: Language Toggle & User Account */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            {/* Language Switcher Pill */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#D9AD54]/50 bg-[#123C35] text-xs font-bold text-[#D9AD54] hover:bg-[#D9AD54] hover:text-[#0B2925] transition-all shadow-sm"
              title="Toggle English / தமிழ்"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
            </button>

            {/* User Session or Sign In Button */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-[#829B83]/30">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-semibold text-[#FFFDF8] truncate max-w-[120px]">
                    {user.fullName || user.email.split('@')[0]}
                  </span>
                  <span className="text-[9px] uppercase font-mono tracking-wider text-[#D9AD54]">
                    {user.role === 'admin' ? 'Faculty Admin' : 'Visitor'}
                  </span>
                </div>
                <button
                  onClick={signOut}
                  className="p-1.5 rounded-lg bg-[#123C35] hover:bg-[#8B2D2D] text-[#F6F3E9] transition-colors border border-[#829B83]/30"
                  title={t.nav.signOut}
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D9AD54] to-[#e4be6b] hover:from-[#e4be6b] hover:to-[#ebd18e] text-[#0B2925] text-xs font-bold transition-all shadow-md transform hover:-translate-y-0.5"
              >
                <User className="w-3.5 h-3.5 text-[#0B2925]" />
                <span>{t.nav.signIn}</span>
              </button>
            )}
          </div>

          {/* Mobile Menu & Language Toggle */}
          <div className="flex items-center gap-2 xl:hidden">
            <button
              onClick={toggleLanguage}
              className="sm:hidden px-2.5 py-1 rounded-full border border-[#D9AD54]/50 text-xs font-bold text-[#D9AD54] bg-[#123C35]"
            >
              {language === 'en' ? 'தமிழ்' : 'EN'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#F6F3E9] hover:bg-[#123C35] border border-[#829B83]/30"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#D9AD54]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-[#194D42] bg-[#0B2925]/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 animate-fade-in">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 transition-colors ${
                  isActive
                    ? 'bg-[#194D42] text-[#D9AD54] font-bold border border-[#D9AD54]/40 shadow-sm'
                    : 'text-[#F6F3E9] hover:bg-[#123C35]'
                }`}
              >
                {Icon && <Icon className="w-4 h-4 text-[#D9AD54]" />}
                <span>{item.label}</span>
              </button>
            );
          })}
          
          <div className="pt-4 border-t border-[#194D42] flex items-center justify-between">
            {user ? (
              <div className="flex items-center justify-between w-full">
                <div>
                  <div className="text-sm font-semibold text-[#FFFDF8]">
                    {user.fullName || user.email}
                  </div>
                  <div className="text-xs text-[#D9AD54] uppercase font-mono">{user.role}</div>
                </div>
                <button
                  onClick={() => { signOut(); setMobileMenuOpen(false); }}
                  className="px-3.5 py-1.5 rounded-lg bg-[#8B2D2D] text-xs font-semibold text-white"
                >
                  {t.nav.signOut}
                </button>
              </div>
            ) : (
              <button
                onClick={() => { onOpenAuth(); setMobileMenuOpen(false); }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D9AD54] to-[#e4be6b] text-[#0B2925] font-bold text-center text-sm shadow-md"
              >
                {t.nav.signIn}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
