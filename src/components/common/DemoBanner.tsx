import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const DemoBanner: React.FC = () => {
  const { isDemoSession, isLiveSupabase, user } = useAuth();
  const { language } = useLanguage();

  if (!isDemoSession && isLiveSupabase) {
    return (
      <div className="bg-[#123C35] text-[#D9AD54] border-b border-[#D9AD54]/30 px-4 py-1.5 text-xs font-medium flex items-center justify-between no-print">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#D9AD54]" />
          <span>
            {language === 'ta' 
              ? 'நேரடி SUPABASE தரவுத்தளத்துடன் இணைக்கப்பட்டுள்ளது • PostgreSQL & RLS செயல்படுத்தப்பட்டுள்ளது' 
              : 'LIVE SUPABASE CONNECTED • PostgreSQL Database & Row Level Security Enforced'}
          </span>
          {user && (
            <span className="ml-auto opacity-80">
              {user.email} ({user.role})
            </span>
          )}
        </div>
      </div>
    );
  }

  if (isDemoSession) {
    return (
      <div className="bg-[#FFF4D7] text-[#87560B] border-b border-[#F2D48E] px-4 py-1.5 text-xs font-medium flex items-center justify-between no-print">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
          <AlertCircle className="w-3.5 h-3.5 text-[#D97706]" />
          <span>
            {language === 'ta'
              ? 'கண்காட்சி மாதிரி முறை (DEMO MODE): உள்ளூர் உலாவி சேமிப்பகத்தில் இயங்குகிறது. நேரடி சுபாபேஸ் தரவுத்தளத்தில் சேமிக்கப்படாது.'
              : 'EXHIBITION DEMO MODE: Operating in local browser storage for presentation. Not connected to live Supabase Postgres.'}
          </span>
          {user && (
            <span className="ml-auto font-semibold bg-[#F2D48E] px-2 py-0.5 rounded text-[11px]">
              {user.role === 'admin' ? 'Siddha Admin Mode' : 'Visitor Mode'}
            </span>
          )}
        </div>
      </div>
    );
  }

  return null;
};
