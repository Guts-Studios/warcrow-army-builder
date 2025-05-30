
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
  const { isPreview, hostname } = useEnvironment();

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

  // Helper function to fetch user profile data
  const fetchUserProfile = async (sessionUserId: string) => {
    console.log("[AuthProvider] 👤 Fetching profile for user:", sessionUserId);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('wab_admin, tester')
        .eq('id', sessionUserId)
        .single();
        
      if (error) {
        console.error("[AuthProvider] ❌ Profile fetch error:", error.message);
        // Don't throw - continue with default values
        return { wab_admin: false, tester: false };
      }
      
      console.log("[AuthProvider] ✅ Profile data fetched:", {
        wabAdmin: data?.wab_admin,
        tester: data?.tester,
        userId: sessionUserId
      });
      
      return data || { wab_admin: false, tester: false };
    } catch (err) {
      console.error("[AuthProvider] ❌ Exception fetching profile:", err);
      return { wab_admin: false, tester: false };
    }
  };

  // Helper function to set authenticated state
  const setAuthenticatedState = async (session: any, skipProfileFetch = false) => {
    console.log("[AuthProvider] 🔄 Setting authenticated state:", {
      hasSession: !!session,
      userId: session?.user?.id,
      skipProfileFetch,
      timestamp: new Date().toISOString()
    });

    if (session?.user?.id) {
      setIsAuthenticated(true);
      setUserId(session.user.id);
      setIsGuest(false);
      
      if (!skipProfileFetch) {
        const profile = await fetchUserProfile(session.user.id);
        const isAdminUser = !!profile.wab_admin;
        setIsAdmin(isAdminUser);
        setIsTester(!!profile.tester);
        setIsWabAdmin(isAdminUser);
      }
    } else {
      console.log("[AuthProvider] 🚫 No session - setting unauthenticated state");
      setIsAuthenticated(false);
      setUserId(null);
      setIsGuest(true);
      
      // UPDATED: Only give admin privileges for Lovable preview environments
      // But still try to use real auth first - fallback to demo mode only if needed
      if (isPreview) {
        console.log("[AuthProvider] 🔧 Preview mode - granting demo admin privileges as fallback");
        setIsAdmin(true);
        setIsTester(true);
        setIsWabAdmin(true);
      } else {
        setIsAdmin(false);
        setIsTester(false);
        setIsWabAdmin(false);
      }
    }
    
    setIsLoading(false);
    
    console.log("[AuthProvider] ✅ Auth state finalized:", {
      isAuthenticated: !!session?.user?.id,
      isLoading: false,
      authReady: true,
      isPreview,
      hostname,
      timestamp: new Date().toISOString()
    });
  };

  // Helper function for preview mode (only as fallback)
  const setPreviewMode = () => {
    console.log("[AuthProvider] 🔧 Setting up preview mode as fallback");
    setIsAuthenticated(true);
    setUserId("preview-user-id");
    setIsGuest(false);
    setIsAdmin(true);
    setIsTester(true);
    setIsWabAdmin(true);
    setIsLoading(false);
    
    console.log("[AuthProvider] ✅ Preview mode setup complete");
  };

  useEffect(() => {
    let mounted = true;
    let authSubscription: any = null;

    const initializeAuth = async () => {
      console.log("[AuthProvider] 🚀 Initializing auth...", {
        isPreview,
        hostname,
        timestamp: new Date().toISOString()
      });

      try {
        // UPDATED: Always try real auth first, even in preview
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
              timestamp: new Date().toISOString()
            });
            
            // Handle the auth state change
            await setAuthenticatedState(session);
          }
        );
        
        authSubscription = subscription;
        console.log("[AuthProvider] ✅ Auth listener established");
        
        // Get initial session
        console.log("[AuthProvider] 🔍 Checking for existing session");
        const { data, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("[AuthProvider] ❌ Session check error:", sessionError);
          if (mounted) {
            // Only fall back to preview mode if we're in a preview environment AND there's an auth error
            if (isPreview) {
              console.log("[AuthProvider] 🔧 Auth error in preview - falling back to demo mode");
              setPreviewMode();
            } else {
              await setAuthenticatedState(null);
            }
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
          timestamp: new Date().toISOString()
        });
        
        if (mounted) {
          // If no session and in preview, fall back to demo mode
          if (!session && isPreview) {
            console.log("[AuthProvider] 🔧 No session in preview - using demo mode");
            setPreviewMode();
          } else {
            // Set initial state based on existing session (or lack thereof)
            await setAuthenticatedState(session, true); // Skip profile fetch since auth listener will handle it
          }
        }
        
      } catch (error) {
        console.error("[AuthProvider] ❌ Fatal error in auth initialization:", error);
        if (mounted) {
          // Fall back to preview mode only if in preview environment
          if (isPreview) {
            console.log("[AuthProvider] 🔧 Fatal auth error in preview - falling back to demo mode");
            setPreviewMode();
          } else {
            await setAuthenticatedState(null);
          }
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
  }, []); // Remove isPreview dependency to prevent re-initialization

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
