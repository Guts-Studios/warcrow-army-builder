
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

  useEffect(() => {
    let mounted = true;
    let authSubscription: any = null;
    let timeoutId: NodeJS.Timeout | null = null;

    const initializeAuth = async () => {
      console.log("[AuthProvider] 🚀 Initializing auth...", {
        isPreview,
        hostname,
        useLocalContentData,
        timestamp: new Date().toISOString()
      });

      // Set up timeout fallback - if auth is stuck for 10 seconds, force completion
      timeoutId = setTimeout(() => {
        if (mounted) {
          console.warn("[AuthProvider] ⏰ Auth initialization timeout - forcing completion");
          finalizeAuthState(false, null, false, false, false, true);
        }
      }, 10000);

      try {
        console.log("[AuthProvider] 🔍 Attempting real authentication for all environments");

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
            
            // Special logging for SIGNED_IN events
            if (event === 'SIGNED_IN') {
              console.log("[AuthProvider] 🎉 SIGNED_IN event detected - user authenticated successfully!");
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
        
        // Get initial session
        console.log("[AuthProvider] 🔍 Checking for existing session");
        const { data, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("[AuthProvider] ❌ Session check error:", {
            message: sessionError.message,
            code: sessionError.code,
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
          return;
        }
        
        const session = data?.session;
        console.log("[AuthProvider] 📋 Initial session check result:", {
          hasSession: !!session,
          userId: session?.user?.id,
          userEmail: session?.user?.email,
          isPreview,
          hostname,
          useLocalContentData,
          sessionValid: !!session && !!session.access_token,
          timestamp: new Date().toISOString()
        });
        
        if (mounted) {
          // Clear timeout since we're handling the initial state
          if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
          }
          
          // Set initial state based on existing session (or lack thereof)
          await setAuthenticatedState(session, true); // Skip profile fetch since auth listener will handle it
        }
        
      } catch (error) {
        console.error("[AuthProvider] ❌ Fatal error in auth initialization:", {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          timestamp: new Date().toISOString()
        });
        
        if (mounted) {
          // Clear timeout
          if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
          }
          
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
