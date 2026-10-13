import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isLiveSupabase: boolean;
  isDemoSession: boolean;
  signInWithSupabase: (email: string, pass: string) => Promise<{ error?: string }>;
  signUpWithSupabase: (email: string, pass: string, fullName: string) => Promise<{ error?: string }>;
  signInDemo: (role: UserRole) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDemoSession, setIsDemoSession] = useState<boolean>(false);

  useEffect(() => {
    // Check if demo user is stored in session
    const savedDemo = localStorage.getItem('mn_demo_user');
    if (savedDemo) {
      try {
        const parsed = JSON.parse(savedDemo);
        setUser(parsed);
        setIsDemoSession(true);
        setLoading(false);
        return;
      } catch (e) {
        localStorage.removeItem('mn_demo_user');
      }
    }

    // Otherwise check Supabase if configured
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          fetchSupabaseProfile(session.user.id, session.user.email || '');
        } else {
          setLoading(false);
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          fetchSupabaseProfile(session.user.id, session.user.email || '');
        } else if (!savedDemo) {
          setUser(null);
          setIsDemoSession(false);
          setLoading(false);
        }
      });

      return () => subscription.unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchSupabaseProfile = async (userId: string, email: string) => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) {
        setUser({
          id: data.id,
          email: data.email,
          role: data.role as UserRole,
          fullName: data.full_name,
          isDemo: false
        });
        setIsDemoSession(false);
      } else {
        // Fallback default profile
        setUser({
          id: userId,
          email,
          role: 'user',
          isDemo: false
        });
      }
    } catch {
      setUser({
        id: userId,
        email,
        role: 'user',
        isDemo: false
      });
    } finally {
      setLoading(false);
    }
  };

  const signInWithSupabase = async (email: string, pass: string): Promise<{ error?: string }> => {
    if (!isSupabaseConfigured || !supabase) {
      return { error: 'Supabase credentials are not configured in .env. Please configure VITE_SUPABASE_URL or use Exhibition Demo Mode.' };
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: pass
      });
      if (error) return { error: error.message };
      return {};
    } catch (err: any) {
      return { error: err.message || 'An error occurred during authentication.' };
    }
  };

  const signUpWithSupabase = async (email: string, pass: string, fullName: string): Promise<{ error?: string }> => {
    if (!isSupabaseConfigured || !supabase) {
      return { error: 'Supabase credentials are not configured in .env. Please configure VITE_SUPABASE_URL or use Exhibition Demo Mode.' };
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: { full_name: fullName }
        }
      });
      if (error) return { error: error.message };
      return {};
    } catch (err: any) {
      return { error: err.message || 'Failed to register account.' };
    }
  };

  const signInDemo = (role: UserRole) => {
    const demoProfile: UserProfile = {
      id: role === 'admin' ? 'demo-admin-id-01' : 'demo-visitor-id-01',
      email: role === 'admin' ? 'siddha.physician@expo.siddha.edu' : 'exhibition.visitor@demo.edu',
      role,
      fullName: role === 'admin' ? 'Prof. Siddha Physician (Reviewer)' : 'Exhibition Delegate',
      isDemo: true
    };
    setUser(demoProfile);
    setIsDemoSession(true);
    localStorage.setItem('mn_demo_user', JSON.stringify(demoProfile));
  };

  const signOut = async () => {
    localStorage.removeItem('mn_demo_user');
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setIsDemoSession(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isLiveSupabase: isSupabaseConfigured,
        isDemoSession,
        signInWithSupabase,
        signUpWithSupabase,
        signInDemo,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
