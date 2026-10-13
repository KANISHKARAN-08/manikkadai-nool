import React, { useState } from 'react';
import { Menu, X, Globe, User, LogOut, BookOpen, ShieldCheck, History, Stethoscope } from 'lucide-react';
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
    { id: 'sourceGallery', label: t.nav.sourceGallery, icon: BookOpen },
    { id: 'assessment', label: t.nav.assessment, icon: Stethoscope },
    { id: 'references', label: t.nav.references, icon: ShieldCheck },
    { id: 'research', label: t.nav.research },
    { id: 'history', label: t.nav.history, icon: History }
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#123C35] text-[#F6F3E9] border-b-2 border-[#D9AD54]/70 shadow-lg no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Wordmark & Emblem */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full border border-[#D9AD54] bg-[#194D42] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 40 40" className="w-6 h-6 text-[#D9AD54]">
                <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12 23 C16 14, 20 12, 24 18 C28 24, 32 20, 30 15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="20" cy="20" r="3.5" fill="currentColor" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif tracking-wider text-xl font-bold text-[#FFFDF8]">
                  {t.brand}
                </span>
                <span className="hidden sm:inline-block text-[10px] font-mono tracking-widest uppercase bg-[#D9AD54]/20 text-[#D9AD54] px-1.5 py-0.5 rounded border border-[#D9AD54]/30">
                  SIDDHA EXPO
                </span>
              </div>
              <p className="text-[11px] text-[#829B83] tracking-wide font-sans hidden sm:block">
                {t.subtitle}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-[#194D42] text-[#D9AD54] border border-[#D9AD54]/40 shadow-inner'
                      : 'text-[#F6F3E9]/80 hover:text-[#FFFDF8] hover:bg-[#194D42]/50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#D9AD54]/50 bg-[#194D42] text-xs font-semibold text-[#D9AD54] hover:bg-[#D9AD54] hover:text-[#123C35] transition-all shadow-sm"
              title="Toggle English / தமிழ்"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
            </button>

            {/* User Session or Sign In */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-[#829B83]/30">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-semibold text-[#FFFDF8] truncate max-w-[130px]">
                    {user.fullName || user.email.split('@')[0]}
                  </span>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[#D9AD54]">
                    {user.role === 'admin' ? 'Faculty Admin' : 'Visitor'}
                  </span>
                </div>
                <button
                  onClick={signOut}
                  className="p-2 rounded-lg bg-[#194D42] hover:bg-[#8B2D2D] text-[#F6F3E9] transition-colors"
                  title={t.nav.signOut}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#D9AD54] text-[#123C35] text-xs font-bold hover:bg-[#e4be6b] transition-all shadow-md"
              >
                <User className="w-3.5 h-3.5" />
                <span>{t.nav.signIn}</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1 rounded-full border border-[#D9AD54]/50 text-xs font-bold text-[#D9AD54]"
            >
              {language === 'en' ? 'தமிழ்' : 'EN'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#F6F3E9] hover:bg-[#194D42]"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#194D42] bg-[#123C35] px-4 pt-3 pb-6 space-y-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-[#194D42] text-[#D9AD54] font-bold border border-[#D9AD54]/30'
                    : 'text-[#F6F3E9] hover:bg-[#194D42]/60'
                }`}
              >
                {item.label}
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
                  <div className="text-xs text-[#D9AD54] uppercase">{user.role}</div>
                </div>
                <button
                  onClick={() => { signOut(); setMobileMenuOpen(false); }}
                  className="px-3 py-1.5 rounded bg-[#8B2D2D] text-xs font-semibold text-white"
                >
                  {t.nav.signOut}
                </button>
              </div>
            ) : (
              <button
                onClick={() => { onOpenAuth(); setMobileMenuOpen(false); }}
                className="w-full py-2.5 rounded-lg bg-[#D9AD54] text-[#123C35] font-bold text-center text-sm"
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
