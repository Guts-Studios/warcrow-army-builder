
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

  // Simplified profile fetch with faster timeout
  const fetchUserProfile = async (sessionUserId: string): Promise<{ wab_admin: boolean; tester: boolean }> => {
    console.log("[AuthProvider] 👤 Fetching profile for user:", sessionUserId);
    
    try {
      // Reduced timeout to 2 seconds for faster initialization
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile fetch timeout')), 2000)
      );
      
      const profilePromise = supabase
        .from('profiles')
        .select('wab_admin, tester')
        .eq('id', sessionUserId)
        .single();
      
      console.log("[AuthProvider] 📡 Executing fast profile query...");
      const { data, error } = await Promise.race([profilePromise, timeoutPromise]) as any;
      
      if (error) {
        console.warn("[AuthProvider] ⚠️ Profile fetch failed, using defaults:", error.message);
        return { wab_admin: false, tester: false };
      }
      
      console.log("[AuthProvider] ✅ Profile data fetched:", {
        wabAdmin: data?.wab_admin,
        tester: data?.tester,
        userId: sessionUserId
      });
      
      return data || { wab_admin: false, tester: false };
    } catch (err) {
      console.warn("[AuthProvider] ⚠️ Profile fetch exception, using defaults:", err instanceof Error ? err.message : String(err));
      return { wab_admin: false, tester: false };
    }
  };

  // Streamlined session restoration
  const restoreSession = async () => {
    console.log("[AuthProvider] 🔄 Fast session restore...");
    
    try {
      // Reduced timeout to 3 seconds for faster startup
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Session restore timeout')), 3000)
      );
      
      console.log("[AuthProvider] ⏳ Getting session with fast timeout...");
      const sessionPromise = supabase.auth.getSession();
      
      let sessionData;
      let sessionError;
      try {
        const result = await Promise.race([sessionPromise, timeoutPromise]) as any;
        sessionData = result.data;
        sessionError = result.error;
      } catch (err) {
        console.warn("[AuthProvider] ⚠️ Session timeout, proceeding as guest");
        finalizeAuthState(false, null, false, false, false, true);
        return;
      }
      
      if (sessionError || !sessionData?.session) {
        console.log("[AuthProvider] ℹ️ No session, setting guest state");
        finalizeAuthState(false, null, false, false, false, true);
        return;
      }
      
      const session = sessionData.session;
      console.log("[AuthProvider] 🎉 Session found - authenticating user");
      
      // Fetch profile in parallel but don't block on it
      const profile = await fetchUserProfile(session.user.id);
      const isAdminUser = !!profile.wab_admin;
      
      finalizeAuthState(true, session.user.id, isAdminUser, !!profile.tester, isAdminUser, false);
    } catch (error) {
      console.warn("[AuthProvider] ⚠️ Session restore failed, using guest mode:", error instanceof Error ? error.message : String(error));
      finalizeAuthState(false, null, false, false, false, true);
    }
  };

  // Optimized auth change handler
  const handleAuthChange = async (session: any) => {
    console.log("[AuthProvider] 🔄 Auth change detected:", {
      hasSession: !!session,
      userId: session?.user?.id
    });

    try {
      if (session?.user?.id) {
        // Fetch profile quickly, don't block the UI
        const profile = await fetchUserProfile(session.user.id);
        const isAdminUser = !!profile.wab_admin;
        
        finalizeAuthState(true, session.user.id, isAdminUser, !!profile.tester, isAdminUser, false);
      } else {
        finalizeAuthState(false, null, false, false, false, true);
      }
    } catch (error) {
      console.warn("[AuthProvider] ⚠️ Auth change error:", error instanceof Error ? error.message : String(error));
      finalizeAuthState(false, null, false, false, false, true);
    }
  };

  useEffect(() => {
    let mounted = true;
    let authSubscription: any = null;

    const initializeAuth = async () => {
      console.log("[AuthProvider] 🚀 Fast auth initialization...", {
        isPreview,
        hostname,
        timestamp: new Date().toISOString()
      });

      try {
        // Set up auth listener first
        console.log("[AuthProvider] 👂 Setting up auth listener");
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (!mounted) return;
            
            console.log("[AuthProvider] 🔄 Auth event:", event, {
              hasUser: !!session?.user,
              userId: session?.user?.id
            });
            
            await handleAuthChange(session);
          }
        );
        
        authSubscription = subscription;
        
        // Then restore session quickly
        if (mounted) {
          await restoreSession();
        }
      } catch (error) {
        console.error("[AuthProvider] ❌ Init error:", error instanceof Error ? error.message : String(error));
        
        if (mounted) {
          finalizeAuthState(false, null, false, false, false, true);
        }
      }
    };

    initializeAuth();

    return () => {
      console.log("[AuthProvider] 🧹 Cleaning up");
      mounted = false;
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, []);

  // Simplified loading state
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center text-warcrow-text">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-warcrow-gold mx-auto mb-2"></div>
          <div className="text-sm">Loading...</div>
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
