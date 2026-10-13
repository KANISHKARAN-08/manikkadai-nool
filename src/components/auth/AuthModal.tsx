import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { X, Lock, Mail, User, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const { signInWithSupabase, signUpWithSupabase, signInDemo, isLiveSupabase } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        const res = await signInWithSupabase(email, password);
        if (res.error) {
          setErrorMsg(res.error);
        } else {
          onClose();
        }
      } else {
        const res = await signUpWithSupabase(email, password, fullName);
        if (res.error) {
          setErrorMsg(res.error);
        } else {
          alert('Registration successful! Please check your email for confirmation or sign in.');
          setMode('signin');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = (role: 'user' | 'admin') => {
    signInDemo(role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0B2925]/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#FFFDF8] rounded-2xl border-2 border-[#0B2925] shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-6 animate-fade-in relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-lg text-[#68736F] hover:bg-[#F6F3E9]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-full bg-[#123C35] text-[#D9AD54] border border-[#D9AD54] mx-auto flex items-center justify-center mb-3 shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#123C35]">
            {mode === 'signin' ? t.auth.signInTitle : t.auth.signUpTitle}
          </h3>
          <p className="text-xs text-[#68736F]">
            {isLiveSupabase ? 'Supabase Authentication Connected' : 'Exhibition Presentation Portal'}
          </p>
        </div>

        {/* Error notice */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-[#8B2D2D]/10 border border-[#8B2D2D]/30 text-xs text-[#8B2D2D] flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Supabase Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold uppercase text-[#194D42] mb-1">
                {t.auth.fullNameLabel}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Dr. / Prof. / Scholar"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#CBD2C9] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#123C35]"
                />
                <User className="w-4 h-4 text-[#829B83] absolute left-3 top-2.5" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase text-[#194D42] mb-1">
              {t.auth.emailLabel}
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="physician@siddha.edu"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#CBD2C9] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#123C35]"
              />
              <Mail className="w-4 h-4 text-[#829B83] absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#194D42] mb-1">
              {t.auth.passwordLabel}
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#CBD2C9] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#123C35]"
              />
              <Lock className="w-4 h-4 text-[#829B83] absolute left-3 top-2.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#D9AD54] to-[#E5C170] hover:from-[#C49D44] hover:to-[#D5B160] text-[#0B2925] font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Processing...' : (mode === 'signin' ? t.auth.signInBtn : t.auth.signUpBtn)}
          </button>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            className="text-xs text-[#194D42] font-semibold hover:underline"
          >
            {mode === 'signin' ? t.auth.needAccount : t.auth.alreadyAccount}
          </button>
        </div>

        {/* Exhibition Demo Shortcuts */}
        <div className="pt-4 border-t border-[#E3E4DA] space-y-3">
          <div className="text-center">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#D9AD54] font-bold">
              {t.auth.orDemo}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleDemoSignIn('user')}
              className="px-3 py-2 rounded-xl bg-[#F6F3E9] border border-[#E3E4DA] text-xs font-bold text-[#123C35] hover:bg-[#E8EFE8] flex items-center justify-center gap-1.5 transition-all"
            >
              <User className="w-3.5 h-3.5 text-[#194D42]" />
              <span>Visitor Demo</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoSignIn('admin')}
              className="px-3 py-2 rounded-xl bg-[#123C35] text-[#D9AD54] text-xs font-bold hover:bg-[#194D42] flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Faculty Admin</span>
            </button>
          </div>

          <p className="text-[11px] text-[#829B83] text-center leading-relaxed">
            {t.auth.demoNotice}
          </p>
        </div>

      </div>
    </div>
  );
};
