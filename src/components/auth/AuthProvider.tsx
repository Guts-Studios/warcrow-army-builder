
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  resendConfirmationEmail: (email: string) => Promise<{ error: any }>;
  setIsGuest: (isGuest: boolean) => void;
  isAuthenticated: boolean;
  authReady: boolean;
  isLoading: boolean;
  userId: string | null;
  isWabAdmin: boolean;
  isTester: boolean;
  isGuest: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  signOut: async () => {},
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  resendConfirmationEmail: async () => ({ error: null }),
  setIsGuest: () => {},
  isAuthenticated: false,
  authReady: false,
  isLoading: true,
  userId: null,
  isWabAdmin: false,
  isTester: false,
  isGuest: true,
  isAdmin: false,
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
  const [isLoading, setIsLoading] = useState(true);
  const [isWabAdmin, setIsWabAdmin] = useState(false);
  const [isTester, setIsTester] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[AuthProvider] Auth state change:', event, session?.user?.id || 'no user');
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
        setAuthReady(true);

        // Check for admin/tester roles if user exists
        if (session?.user) {
          try {
            const { data, error } = await supabase
              .from('profiles')
              .select('wab_admin, tester')
              .eq('id', session.user.id)
              .maybeSingle();
            
            if (!error && data) {
              setIsWabAdmin(!!data.wab_admin);
              setIsTester(!!data.tester);
            } else {
              setIsWabAdmin(false);
              setIsTester(false);
            }
          } catch (error) {
            console.error('[AuthProvider] Error fetching user roles:', error);
            setIsWabAdmin(false);
            setIsTester(false);
          }
        } else {
          setIsWabAdmin(false);
          setIsTester(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('[AuthProvider] Initial session check:', session?.user?.id || 'no user');
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
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

  const resendConfirmationEmail = async (email: string) => {
    console.log('[AuthProvider] Resending confirmation email...');
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/`
      }
    });
    if (error) {
      console.error('[AuthProvider] Resend confirmation error:', error);
    }
    return { error };
  };

  const handleSetIsGuest = (guestStatus: boolean) => {
    console.log('[AuthProvider] Setting guest status:', guestStatus);
    setIsGuest(guestStatus);
  };

  const value: AuthContextType = {
    user,
    session,
    signOut,
    signIn,
    signUp,
    resendConfirmationEmail,
    setIsGuest: handleSetIsGuest,
    isAuthenticated: !!user,
    authReady,
    isLoading,
    userId: user?.id ?? null,
    isWabAdmin,
    isTester,
    isGuest: !user || isGuest,
    isAdmin: isWabAdmin, // isAdmin is an alias for isWabAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
