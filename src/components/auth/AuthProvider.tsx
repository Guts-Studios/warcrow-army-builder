
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
  resendConfirmationEmail: async () => {}
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

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log("[AuthProvider] Initializing auth state...", { isPreview, timestamp: new Date().toISOString() });
        
        // For preview environment, provide dummy authenticated state
        if (isPreview) {
          console.log("[AuthProvider] Preview mode detected, using demo auth state");
          if (mounted) {
            setIsAuthenticated(true);
            setIsAdmin(true);
            setIsTester(true);
            setIsWabAdmin(true);
            setUserId("preview-user-id");
            setIsGuest(false);
            setIsLoading(false);
            console.log("[AuthProvider] Auth state ready (preview mode):", {
              isAuthenticated: true,
              isLoading: false,
              timestamp: new Date().toISOString()
            });
          }
          return;
        }

        console.log("[AuthProvider] Production environment detected, using real auth state");

        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log("[AuthProvider] Auth state changed:", event, {
              hasUser: !!session?.user,
              userId: session?.user?.id,
              email: session?.user?.email,
              timestamp: new Date().toISOString()
            });
            
            const authState = !!session;
            
            if (mounted) {
              setIsAuthenticated(authState);
              setUserId(session?.user?.id || null);
              setIsGuest(!session);
              
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
                    
                  if (!error && data && mounted) {
                    const isAdminUser = !!data.wab_admin;
                    setIsAdmin(isAdminUser);
                    setIsTester(!!data.tester);
                    setIsWabAdmin(isAdminUser);
                  } else {
                    console.error("[AuthProvider] Error or no data in onAuthStateChange:", error);
                    if (mounted) {
                      setIsAdmin(false);
                      setIsTester(false);
                      setIsWabAdmin(false);
                    }
                  }
                } catch (err) {
                  console.error("[AuthProvider] Error checking user roles in auth state change:", err);
                  if (mounted) {
                    setIsAdmin(false);
                    setIsTester(false);
                    setIsWabAdmin(false);
                  }
                }
              } else {
                if (mounted) {
                  setIsAdmin(false);
                  setIsTester(false);
                  setIsWabAdmin(false);
                }
              }
              
              // Always set loading to false after processing auth state change
              setIsLoading(false);
              console.log("[AuthProvider] Auth state ready after change:", {
                isAuthenticated: authState,
                isLoading: false,
                timestamp: new Date().toISOString()
              });
            }
          }
        );
        
        // Get initial session
        const { data, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("[AuthProvider] Session error:", sessionError);
          if (mounted) {
            setIsAuthenticated(false);
            setIsGuest(true);
            setIsLoading(false);
            console.log("[AuthProvider] Auth state ready (session error):", {
              isAuthenticated: false,
              isLoading: false,
              timestamp: new Date().toISOString()
            });
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
        
        if (mounted) {
          setIsAuthenticated(!!session);
          setUserId(session?.user?.id || null);
          setIsGuest(!session);
          
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
                
              if (!error && data && mounted) {
                const isAdminUser = !!data.wab_admin;
                setIsAdmin(isAdminUser);
                setIsTester(!!data.tester);
                setIsWabAdmin(isAdminUser);
              } else {
                console.error("[AuthProvider] Error or no data in initial session check:", error);
                if (mounted) {
                  setIsAdmin(false);
                  setIsTester(false);
                  setIsWabAdmin(false);
                }
              }
            } catch (err) {
              console.error("[AuthProvider] Error checking user roles in AuthProvider:", err);
              if (mounted) {
                setIsAdmin(false);
                setIsTester(false);
                setIsWabAdmin(false);
              }
            }
          } else {
            // Not authenticated
            if (mounted) {
              setIsAdmin(false);
              setIsTester(false);
              setIsWabAdmin(false);
            }
          }
          
          // Always set loading to false after initial session check
          setIsLoading(false);
          console.log("[AuthProvider] Auth state ready (initial):", {
            isAuthenticated: !!session,
            isLoading: false,
            timestamp: new Date().toISOString()
          });
        }
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("[AuthProvider] Error in AuthProvider:", error);
        if (mounted) {
          setIsLoading(false);
          setIsAuthenticated(false);
          setIsAdmin(false);
          setIsTester(false);
          setIsWabAdmin(false);
          setIsGuest(true);
          console.log("[AuthProvider] Auth state ready (error):", {
            isAuthenticated: false,
            isLoading: false,
            timestamp: new Date().toISOString()
          });
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
    resendConfirmationEmail
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
