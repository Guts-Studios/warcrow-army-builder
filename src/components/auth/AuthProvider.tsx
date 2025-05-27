
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
  // Add authReady to context for direct access
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
  const { isPreview } = useEnvironment();

  // Calculate authReady based on loading state
  const authReady = !isLoading && isAuthenticated !== null;

  // Log auth state changes for debugging
  useEffect(() => {
    console.log("[AuthProvider] Auth state updated:", {
      isLoading,
      isAuthenticated,
      authReady,
      isAdmin,
      isTester,
      isWabAdmin,
      timestamp: new Date().toISOString()
    });
  }, [isLoading, isAuthenticated, authReady, isAdmin, isTester, isWabAdmin]);

  // Function to resend confirmation email
  const resendConfirmationEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });
      
      if (error) {
        console.error('Error resending confirmation email:', error);
        toast.error('Failed to resend confirmation email');
        throw error;
      }
      
      toast.success('Confirmation email has been sent');
    } catch (err) {
      console.error('Error in resendConfirmationEmail:', err);
      toast.error('Failed to send confirmation email');
      throw err;
    }
  };

  // Helper function to finalize auth state
  const finalizeAuthState = (session: any, roles?: { wab_admin?: boolean; tester?: boolean }) => {
    const authState = !!session;
    
    console.log("[AuthProvider] Finalizing auth state:", {
      hasSession: !!session,
      roles,
      timestamp: new Date().toISOString()
    });
    
    setIsAuthenticated(authState);
    setUserId(session?.user?.id || null);
    setIsGuest(!session);
    
    if (roles) {
      const isAdminUser = !!roles.wab_admin;
      setIsAdmin(isAdminUser);
      setIsTester(!!roles.tester);
      setIsWabAdmin(isAdminUser);
    } else if (session?.user?.id) {
      // Set defaults for authenticated users without roles
      setIsAdmin(false);
      setIsTester(false);
      setIsWabAdmin(false);
    } else {
      // Set defaults for non-authenticated users
      setIsAdmin(isPreview);
      setIsTester(isPreview);
      setIsWabAdmin(isPreview);
    }
    
    // Always set loading to false at the end
    setIsLoading(false);
    
    console.log("[AuthProvider] ✅ Auth state ready:", {
      isAuthenticated: authState,
      isLoading: false,
      authReady: true,
      timestamp: new Date().toISOString()
    });
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log("[AuthProvider] Initializing auth state...", { isPreview, timestamp: new Date().toISOString() });
        
        // For preview environment, provide dummy authenticated state
        if (isPreview) {
          console.log("[AuthProvider] Preview mode detected, using demo auth state");
          if (mounted) {
            finalizeAuthState({ user: { id: "preview-user-id" } }, { wab_admin: true, tester: true });
          }
          return;
        }

        console.log("[AuthProvider] Production environment detected, using real auth state");

        // Set up auth state listener FIRST
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (!mounted) return;
            
            console.log("[AuthProvider] Auth state changed:", event, {
              hasUser: !!session?.user,
              userId: session?.user?.id,
              email: session?.user?.email,
              timestamp: new Date().toISOString()
            });
            
            if (session?.user?.id) {
              // Get user role information
              try {
                const { data, error } = await supabase
                  .from('profiles')
                  .select('wab_admin, tester')
                  .eq('id', session.user.id)
                  .single();
                  
                console.log("[AuthProvider] Profile data check on auth change:", {
                  profileExists: !!data,
                  wabAdmin: data?.wab_admin,
                  tester: data?.tester,
                  error: error?.message,
                  userId: session.user.id,
                  timestamp: new Date().toISOString()
                });
                
                if (mounted) {
                  finalizeAuthState(session, data || undefined);
                }
              } catch (err) {
                console.error("[AuthProvider] Error checking user roles in auth state change:", err);
                if (mounted) {
                  finalizeAuthState(session);
                }
              }
            } else {
              if (mounted) {
                finalizeAuthState(null);
              }
            }
          }
        );
        
        // THEN get initial session
        const { data, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("[AuthProvider] Session error:", sessionError);
          if (mounted) {
            finalizeAuthState(null);
          }
          return;
        }
        
        const session = data?.session;
        
        console.log("[AuthProvider] Initial session check result:", {
          hasSession: !!session,
          userId: session?.user?.id,
          userEmail: session?.user?.email,
          timestamp: new Date().toISOString()
        });
        
        if (session?.user?.id) {
          // Get user role information
          try {
            console.log("[AuthProvider] Fetching profile data for user:", session.user.id);
            const { data, error } = await supabase
              .from('profiles')
              .select('wab_admin, tester')
              .eq('id', session.user.id)
              .single();
              
            console.log("[AuthProvider] Profile data fetched:", {
              profileExists: !!data,
              wabAdmin: data?.wab_admin,
              tester: data?.tester,
              error: error?.message,
              userId: session.user.id,
              timestamp: new Date().toISOString()
            });
            
            if (mounted) {
              finalizeAuthState(session, data || undefined);
            }
          } catch (err) {
            console.error("[AuthProvider] Error checking user roles in AuthProvider:", err);
            if (mounted) {
              finalizeAuthState(session);
            }
          }
        } else {
          if (mounted) {
            finalizeAuthState(null);
          }
        }
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("[AuthProvider] Error in AuthProvider:", error);
        if (mounted) {
          finalizeAuthState(null);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, [isPreview]);

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
