
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

  // Helper function to fetch user profile data with RLS diagnostics
  const fetchUserProfile = async (sessionUserId: string) => {
    console.log("[AuthProvider] 👤 Fetching profile for user:", sessionUserId);
    try {
      console.log("[AuthProvider] 📡 Executing profile query...");
      const { data, error } = await supabase
        .from('profiles')
        .select('wab_admin, tester')
        .eq('id', sessionUserId)
        .single();
      
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
        
        // Don't throw - continue with default values
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

  // Helper function to finalize auth state - ALWAYS sets loading to false
  const finalizeAuthState = (
    authenticated: boolean,
    userIdValue: string | null = null,
    adminValue: boolean = false,
    testerValue: boolean = false,
    wabAdminValue: boolean = false,
    guestValue: boolean = false
  ) => {
    console.log("[AuthProvider] 🔒 Finalizing auth state:", {
      authenticated,
      userIdValue,
      adminValue,
      testerValue,
      wabAdminValue,
      guestValue,
      timestamp: new Date().toISOString()
    });

    setIsAuthenticated(authenticated);
    setUserId(userIdValue);
    setIsAdmin(adminValue);
    setIsTester(testerValue);
    setIsWabAdmin(wabAdminValue);
    setIsGuest(guestValue);
    setIsLoading(false); // CRITICAL: Always set loading to false

    console.log("[AuthProvider] ✅ Auth state finalized - loading set to false:", {
      isAuthenticated: authenticated,
      isLoading: false,
      authReady: true,
      userId: userIdValue,
      isAdmin: adminValue,
      timestamp: new Date().toISOString()
    });
  };

  // Helper function to set authenticated state
  const setAuthenticatedState = async (session: any, skipProfileFetch = false) => {
    console.log("[AuthProvider] 🔄 Setting authenticated state:", {
      hasSession: !!session,
      userId: session?.user?.id,
      skipProfileFetch,
      sessionDetails: session ? {
        accessToken: session.access_token ? 'present' : 'missing',
        refreshToken: session.refresh_token ? 'present' : 'missing',
        expiresAt: session.expires_at,
      } : null,
      timestamp: new Date().toISOString()
    });

    try {
      if (session?.user?.id) {
        if (!skipProfileFetch) {
          console.log("[AuthProvider] 🔍 Fetching user profile...");
          const profile = await fetchUserProfile(session.user.id);
          const isAdminUser = !!profile.wab_admin;
          
          finalizeAuthState(
            true,
            session.user.id,
            isAdminUser,
            !!profile.tester,
            isAdminUser,
            false
          );
        } else {
          // Just set basic auth state without profile fetch
          finalizeAuthState(true, session.user.id, false, false, false, false);
        }
      } else {
        console.log("[AuthProvider] 🚫 No session - setting unauthenticated state");
        // Always set guest state when not authenticated, regardless of environment
        finalizeAuthState(false, null, false, false, false, true);
      }
    } catch (error) {
      console.error("[AuthProvider] ❌ Error in setAuthenticatedState:", {
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      });
      
      // CRITICAL: Even on error, finalize the state to prevent stuck loading
      finalizeAuthState(false, null, false, false, false, true);
    }
  };

  // Check stored auth tokens for debugging
  const debugStoredTokens = () => {
    const localToken = localStorage.getItem('supabase.auth.token');
    const sessionToken = sessionStorage.getItem('supabase.auth.token');
    
    console.log("[AuthProvider] 🔍 Stored tokens debug:", {
      localStorageToken: localToken ? 'present' : 'missing',
      sessionStorageToken: sessionToken ? 'present' : 'missing',
      localStorageKeys: Object.keys(localStorage),
      hasStoredSupabaseData: Object.keys(localStorage).some(key => key.includes('supabase')),
      timestamp: new Date().toISOString()
    });
    
    // Parse and log token details if present
    if (localToken) {
      try {
        const tokenData = JSON.parse(localToken);
        console.log("[AuthProvider] 📋 Local token details:", {
          hasAccessToken: !!tokenData.access_token,
          hasRefreshToken: !!tokenData.refresh_token,
          expiresAt: tokenData.expires_at,
          isExpired: tokenData.expires_at ? new Date(tokenData.expires_at * 1000) < new Date() : 'unknown',
          userId: tokenData.user?.id,
          timestamp: new Date().toISOString()
        });
      } catch (err) {
        console.error("[AuthProvider] ❌ Failed to parse stored token:", err);
      }
    }
  };

  useEffect(() => {
    let mounted = true;
    let authSubscription: any = null;
    let timeoutId: NodeJS.Timeout | null = null;

    const restoreSession = async () => {
      console.log("[AuthProvider] 🚀 Starting session restoration...", {
        isPreview,
        hostname,
        useLocalContentData,
        timestamp: new Date().toISOString()
      });

      // Debug stored tokens first
      debugStoredTokens();

      try {
        console.log("[AuthProvider] 🔍 Attempting to restore existing session");
        
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("[AuthProvider] ❌ Session restoration error:", {
            message: error.message,
            code: error.code,
            timestamp: new Date().toISOString()
          });
          throw error;
        }
        
        const session = data?.session;
        console.log("[AuthProvider] 📋 Session restoration result:", {
          hasSession: !!session,
          userId: session?.user?.id,
          userEmail: session?.user?.email,
          sessionValid: !!session && !!session.access_token,
          expiresAt: session?.expires_at,
          isExpired: session?.expires_at ? new Date(session.expires_at * 1000) < new Date() : 'unknown',
          timestamp: new Date().toISOString()
        });
        
        if (mounted) {
          if (session?.user) {
            console.log("[AuthProvider] 🎉 Session restored successfully - user authenticated!");
            await setAuthenticatedState(session);
          } else {
            console.log("[AuthProvider] 🚫 No valid session found - user not authenticated");
            finalizeAuthState(false, null, false, false, false, true);
          }
          
          // Clear timeout since we successfully restored session
          if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
          }
        }
      } catch (error) {
        console.error("[AuthProvider] ❌ Error during session restoration:", {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          timestamp: new Date().toISOString()
        });
        
        if (mounted) {
          // Clear timeout and finalize state
          if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
          }
          
          finalizeAuthState(false, null, false, false, false, true);
        }
      }
    };

    const initializeAuth = async () => {
      console.log("[AuthProvider] 🚀 Initializing auth...", {
        isPreview,
        hostname,
        useLocalContentData,
        timestamp: new Date().toISOString()
      });

      // Set up timeout fallback - if auth is stuck for 8 seconds, force completion
      timeoutId = setTimeout(() => {
        if (mounted) {
          console.warn("[AuthProvider] ⏰ Auth initialization timeout - forcing completion");
          finalizeAuthState(false, null, false, false, false, true);
        }
      }, 8000);

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
            isPreview,
            hostname,
            useLocalContentData,
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
          
          try {
            // Handle the auth state change
            await setAuthenticatedState(session);
            
            // Clear timeout since we successfully handled auth
            if (timeoutId) {
              clearTimeout(timeoutId);
              timeoutId = null;
            }
          } catch (error) {
            console.error("[AuthProvider] ❌ Error handling auth state change:", {
              error: error instanceof Error ? error.message : String(error),
              event,
              timestamp: new Date().toISOString()
            });
            
            // Ensure we don't get stuck on auth change errors
            finalizeAuthState(false, null, false, false, false, true);
          }
        }
      );
      
      authSubscription = subscription;
      console.log("[AuthProvider] ✅ Auth listener established");
      
      // Then restore existing session
      await restoreSession();
    };

    initializeAuth();

    return () => {
      console.log("[AuthProvider] 🧹 Cleaning up auth provider");
      mounted = false;
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []); // Remove dependencies to prevent re-initialization

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
