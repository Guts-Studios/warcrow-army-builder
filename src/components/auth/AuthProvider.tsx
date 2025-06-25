
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  isAuthenticated: boolean;
  authReady: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  signOut: async () => {},
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  isAuthenticated: false,
  authReady: false,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('[AuthProvider] Auth state change:', event, session?.user?.id || 'no user');
        setSession(session);
        setUser(session?.user ?? null);
        setAuthReady(true);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('[AuthProvider] Initial session check:', session?.user?.id || 'no user');
      setSession(session);
      setUser(session?.user ?? null);
      setAuthReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    console.log('[AuthProvider] Signing out...');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('[AuthProvider] Sign out error:', error);
      throw error;
    }
    console.log('[AuthProvider] Sign out successful');
  };

  const signIn = async (email: string, password: string) => {
    console.log('[AuthProvider] Signing in...');
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error('[AuthProvider] Sign in error:', error);
    }
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    console.log('[AuthProvider] Signing up...');
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    if (error) {
      console.error('[AuthProvider] Sign up error:', error);
    }
    return { error };
  };

  const value: AuthContextType = {
    user,
    session,
    signOut,
    signIn,
    signUp,
    isAuthenticated: !!user,
    authReady,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
