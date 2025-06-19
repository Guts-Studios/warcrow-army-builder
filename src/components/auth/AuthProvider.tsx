
import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEnvironment } from "@/hooks/useEnvironment";

interface AuthContextType {
  isAuthenticated: boolean | null;
  isAdmin: boolean;
  isTester: boolean;
  isWabAdmin: boolean;
  userId: string | null;
  isLoading: boolean;
  isGuest: boolean;
  setIsGuest: (value: boolean) => void;
  resendConfirmationEmail: (email: string) => Promise<void>;
  authReady: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: null,
  isAdmin: false,
  isTester: false,
  isWabAdmin: false,
  userId: null,
  isLoading: true,
  isGuest: false,
  setIsGuest: () => {},
  resendConfirmationEmail: async () => {},
  authReady: false
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isTester, setIsTester] = useState<boolean>(false);
  const [isWabAdmin, setIsWabAdmin] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const { isPreview, hostname, useLocalContentData } = useEnvironment();

  // Calculate authReady based on loading state
  const authReady = !isLoading && isAuthenticated !== null;

  console.log("[AuthProvider] 🔍 Current state:", {
    isLoading,
    isAuthenticated,
    authReady,
    isAdmin,
    isTester,
    isWabAdmin,
    userId,
    isPreview,
    hostname,
    useLocalContentData,
    authReadyStatus: authReady ? 'READY' : 'NOT_READY',
    timestamp: new Date().toISOString()
  });

  // Function to resend confirmation email
  const resendConfirmationEmail = async (email: string) => {
    console.log("[AuthProvider] 📧 Resending confirmation email for:", email);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });
      
      if (error) {
        console.error('[AuthProvider] ❌ Error resending confirmation email:', error);
        toast.error('Failed to resend confirmation email');
        throw error;
      }
      
      console.log("[AuthProvider] ✅ Confirmation email sent successfully");
      toast.success('Confirmation email has been sent');
    } catch (err) {
      console.error('[AuthProvider] ❌ Exception in resendConfirmationEmail:', err);
      toast.error('Failed to send confirmation email');
      throw err;
    }
  };

  // Helper function to finalize auth state
  const finalizeAuthState = (
    authenticated: boolean, 
    user: string | null, 
    admin: boolean, 
    tester: boolean, 
    wabAdmin: boolean, 
    guest: boolean
  ) => {
    console.log("[AuthProvider] 🎯 Finalizing auth state:", {
      authenticated,
      user,
      admin,
      tester,
      wabAdmin,
      guest,
      timestamp: new Date().toISOString()
    });
    
    setIsAuthenticated(authenticated);
    setUserId(user);
    setIsAdmin(admin);
    setIsTester(tester);
    setIsWabAdmin(wabAdmin);
    setIsGuest(guest);
    setIsLoading(false);
  };

  // Helper function to fetch user profile data with timeout
  const fetchUserProfile = async (sessionUserId: string): Promise<{ wab_admin: boolean; tester: boolean }> => {
    console.log("[AuthProvider] 👤 Fetching profile for user:", sessionUserId);
    
    try {
      // Add a timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile fetch timeout')), 10000)
      );
      
      const profilePromise = supabase
        .from('profiles')
        .select('wab_admin, tester')
        .eq('id', sessionUserId)
        .single();
      
      console.log("[AuthProvider] 📡 Executing profile query with timeout...");
      const { data, error } = await Promise.race([profilePromise, timeoutPromise]) as any;
      
      console.log("[AuthProvider] 📊 Profile query response:", {
        hasData: !!data,
        hasError: !!error,
        errorMessage: error?.message || null,
        errorCode: error?.code || null,
        userId: sessionUserId,
        timestamp: new Date().toISOString()
      });
        
      if (error) {
        console.error("[AuthProvider] ❌ Profile fetch error details:", {
          message: error.message,
          code: error.code,
          userId: sessionUserId,
          timestamp: new Date().toISOString()
        });
        
        // Check if this is an RLS policy violation
        if (error.message.includes('row-level security') || error.code === 'PGRST116') {
          console.error("[AuthProvider] 🚨 RLS POLICY VIOLATION - User cannot access their own profile!");
          toast.error("Profile access denied. Please check authentication.");
        }
        
        // Return default values on error
        return { wab_admin: false, tester: false };
      }
      
      console.log("[AuthProvider] ✅ Profile data fetched successfully:", {
        wabAdmin: data?.wab_admin,
        tester: data?.tester,
        userId: sessionUserId,
        timestamp: new Date().toISOString()
      });
      
      return data || { wab_admin: false, tester: false };
    } catch (err) {
      console.error("[AuthProvider] ❌ Exception fetching profile:", {
        error: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
        userId: sessionUserId,
        timestamp: new Date().toISOString()
      });
      return { wab_admin: false, tester: false };
    }
  };

  // Helper function to restore session with improved error handling
  const restoreSession = async () => {
    console.log("[AuthProvider] 🔄 Restoring session...");
    
    try {
      // Clear any potentially corrupted tokens first
      console.warn("[AuthProvider] 🧹 Flushing old auth tokens from both storages");
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.removeItem('supabase.auth.token');
      
      // Add timeout to prevent infinite hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Session restore timeout')), 15000)
      );
      
      console.log("[AuthProvider] ⏳ Awaiting supabase.auth.getSession()...");
      const sessionPromise = supabase.auth.getSession();
      
      let sessionData;
      let sessionError;
      try {
        const result = await Promise.race([sessionPromise, timeoutPromise]) as any;
        sessionData = result.data;
        sessionError = result.error;
        console.log("[AuthProvider] 📦 Session fetch result:", { 
          hasSession: !!sessionData?.session,
          hasError: !!sessionError,
          errorMessage: sessionError?.message || null
        });
      } catch (err) {
        console.error("[AuthProvider] ❌ Exception thrown in getSession:", err);
        sessionError = err;
      }
      
      if (sessionError || !sessionData?.session) {
        console.warn("[AuthProvider] ⚠️ No valid session returned - finalizing as guest");
        finalizeAuthState(false, null, false, false, false, true);
        return;
      }
      
      const session = sessionData.session;
      console.log("[AuthProvider] 🎉 Session restored successfully - user authenticated!");
      
      // Fetch profile data
      const profile = await fetchUserProfile(session.user.id);
      const isAdminUser = !!profile.wab_admin;
      
      finalizeAuthState(true, session.user.id, isAdminUser, !!profile.tester, isAdminUser, false);
    } catch (error) {
      console.error("[AuthProvider] ❌ Error in restoreSession:", {
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      });
      
      // Fallback to guest state on any error
      finalizeAuthState(false, null, false, false, false, true);
    }
  };

  // Helper function to set authenticated state from auth change
  const handleAuthChange = async (session: any) => {
    console.log("[AuthProvider] 🔄 Handling auth change:", {
      hasSession: !!session,
      userId: session?.user?.id,
      sessionDetails: session ? {
        accessToken: session.access_token ? 'present' : 'missing',
        refreshToken: session.refresh_token ? 'present' : 'missing',
        expiresAt: session.expires_at,
      } : null,
      timestamp: new Date().toISOString()
    });

    try {
      if (session?.user?.id) {
        console.log("[AuthProvider] 🔍 Fetching user profile for auth change...");
        const profile = await fetchUserProfile(session.user.id);
        const isAdminUser = !!profile.wab_admin;
        
        finalizeAuthState(true, session.user.id, isAdminUser, !!profile.tester, isAdminUser, false);
      } else {
        console.log("[AuthProvider] 🚫 No session in auth change - setting unauthenticated state");
        finalizeAuthState(false, null, false, false, false, true);
      }
    } catch (error) {
      console.error("[AuthProvider] ❌ Error in handleAuthChange:", {
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      });
      
      // Set fallback state on error
      finalizeAuthState(false, null, false, false, false, true);
    }
  };

  useEffect(() => {
    let mounted = true;
    let authSubscription: any = null;

    const initializeAuth = async () => {
      console.log("[AuthProvider] 🚀 Initializing auth...", {
        isPreview,
        hostname,
        useLocalContentData,
        timestamp: new Date().toISOString()
      });

      try {
        // Set up auth state listener FIRST
        console.log("[AuthProvider] 👂 Setting up auth state listener");
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (!mounted) {
              console.log("[AuthProvider] 🚫 Component unmounted, ignoring auth change");
              return;
            }
            
            console.log("[AuthProvider] 🔄 Auth state change event:", event, {
              hasUser: !!session?.user,
              userId: session?.user?.id,
              email: session?.user?.email,
              eventType: event,
              sessionValid: !!session && !!session.access_token,
              timestamp: new Date().toISOString()
            });
            
            // Special logging for important events
            if (event === 'SIGNED_IN') {
              console.log("[AuthProvider] 🎉 SIGNED_IN event detected - user authenticated successfully!");
            } else if (event === 'SIGNED_OUT') {
              console.log("[AuthProvider] 👋 SIGNED_OUT event detected - user logged out");
            } else if (event === 'TOKEN_REFRESHED') {
              console.log("[AuthProvider] 🔄 TOKEN_REFRESHED event detected - session updated");
            }
            
            // Handle the auth state change
            await handleAuthChange(session);
          }
        );
        
        authSubscription = subscription;
        console.log("[AuthProvider] ✅ Auth listener established");
        
        // THEN restore session
        if (mounted) {
          await restoreSession();
        }
      } catch (error) {
        console.error("[AuthProvider] ❌ Error during auth initialization:", {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          timestamp: new Date().toISOString()
        });
        
        if (mounted) {
          // Set fallback state on error
          finalizeAuthState(false, null, false, false, false, true);
        }
      }
    };

    initializeAuth();

    return () => {
      console.log("[AuthProvider] 🧹 Cleaning up auth provider");
      mounted = false;
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, []); // Remove dependencies to prevent re-initialization

  // Show loading state while auth is initializing
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center text-warcrow-text">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-warcrow-gold mx-auto mb-4"></div>
          <div>Initializing authentication...</div>
        </div>
      </div>
    );
  }

  const value = {
    isAuthenticated,
    isAdmin,
    isTester,
    isWabAdmin,
    userId,
    isLoading,
    isGuest,
    setIsGuest,
    resendConfirmationEmail,
    authReady
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
