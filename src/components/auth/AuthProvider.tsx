import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

  // Enhanced preview detection with more robust hostname checking
  const isPreview = () => {
    const hostname = window.location.hostname;
    console.log("AuthProvider: Current hostname for preview check:", hostname);
    
    // Check for specific production domain - adjust this to match your actual production domain
    const isProduction = hostname === 'warcrow-army-builder.netlify.app' || 
                         hostname === 'wab.warcrow.com';
    
    if (isProduction) {
      console.log("Production environment detected in AuthProvider");
      return false;
    }
    
    // Otherwise, check if it's a preview/development environment
    const isPreviewEnv = hostname === 'lovableproject.com' || 
                         hostname.includes('.lovableproject.com') ||
                         hostname.includes('localhost') ||
                         hostname.includes('127.0.0.1') ||
                         hostname.includes('netlify.app');
    
    console.log("Is preview environment in AuthProvider:", isPreviewEnv);
    return isPreviewEnv;
  };

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
        setIsLoading(true);
        const inPreview = isPreview();
        console.log("AuthProvider: isPreview =", inPreview);
        
        // For preview environment, provide dummy authenticated state
        if (inPreview) {
          console.log("Preview mode detected in AuthProvider, using demo auth state");
          if (mounted) {
            setIsAuthenticated(true);
            setIsAdmin(true);
            setIsTester(true);
            setIsWabAdmin(true);
            setUserId("preview-user-id");
            setIsGuest(false);
            setIsLoading(false);
          }
          return;
        }

        // Set up auth state listener for production environments
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log("Auth state changed in AuthProvider:", event);
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
                    
                  if (!error && data && mounted) {
                    const isAdminUser = !!data.wab_admin;
                    console.log("Admin status from auth state change:", isAdminUser);
                    setIsAdmin(isAdminUser);
                    setIsTester(!!data.tester);
                    setIsWabAdmin(isAdminUser);
                  } else {
                    console.error("Error or no data in onAuthStateChange:", error);
                    if (mounted) {
                      setIsAdmin(false);
                      setIsTester(false);
                      setIsWabAdmin(false);
                    }
                  }
                } catch (err) {
                  console.error("Error checking user roles in auth state change:", err);
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
            }
          }
        );
        
        // Get initial session
        const { data } = await supabase.auth.getSession();
        const session = data?.session;
        
        if (mounted) {
          setIsAuthenticated(!!session);
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
                
              if (!error && data && mounted) {
                const isAdminUser = !!data.wab_admin;
                console.log("Initial admin status:", isAdminUser);
                setIsAdmin(isAdminUser);
                setIsTester(!!data.tester);
                setIsWabAdmin(isAdminUser);
              } else {
                console.error("Error or no data in initial session check:", error);
                if (mounted) {
                  setIsAdmin(false);
                  setIsTester(false);
                  setIsWabAdmin(false);
                }
              }
            } catch (err) {
              console.error("Error checking user roles in AuthProvider:", err);
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
          
          setIsLoading(false);
        }
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Error in AuthProvider:", error);
        if (mounted) {
          setIsLoading(false);
          setIsAuthenticated(false);
          setIsAdmin(false);
          setIsTester(false);
          setIsWabAdmin(false);
          setIsGuest(true);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

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
