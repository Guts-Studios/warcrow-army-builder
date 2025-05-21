
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useEnvironment } from "@/hooks/useEnvironment";
import { toast } from "sonner";

export function useAuth() {
  const { isPreview, isProduction, hostname } = useEnvironment();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isTester, setIsTester] = useState<boolean>(false);
  const [isWabAdmin, setIsWabAdmin] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGuest, setIsGuest] = useState<boolean>(false);

  // Resend confirmation email method
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
      console.error('Error resending confirmation email:', err);
      toast.error('Failed to send confirmation email');
      throw err;
    }
  };

  useEffect(() => {
    let mounted = true;

    const checkAuthStatus = async () => {
      try {
        setIsLoading(true);
        console.log("Auth hook: Checking auth status for hostname:", hostname);
        
        // Get the current session
        const { data: { session } } = await supabase.auth.getSession();
        
        console.log("Auth hook: Session check result:", {
          hasSession: !!session,
          userId: session?.user?.id,
          email: session?.user?.email,
          userMetadata: session?.user?.user_metadata,
          appMetadata: session?.user?.app_metadata,
          hostname: hostname,
          isPreview: isPreview,
          isProduction: isProduction,
          timestamp: new Date().toISOString()
        });
        
        if (mounted) {
          // Set auth state based on session
          setIsAuthenticated(!!session);
          setUserId(session?.user?.id || null);
          setIsGuest(!session);
          
          // If authenticated, check for admin/tester status
          if (session?.user?.id) {
            try {
              const { data, error } = await supabase
                .from('profiles')
                .select('wab_admin, tester')
                .eq('id', session.user.id)
                .maybeSingle(); // Use maybeSingle to avoid errors if no row is found
                
              console.log("Auth hook: Profile data fetched:", {
                profileExists: !!data,
                wabAdmin: data?.wab_admin,
                tester: data?.tester,
                error: error?.message,
                userId: session.user.id,
                timestamp: new Date().toISOString()
              });
                
              if (!error && data && mounted) {
                const isAdminUser = !!data.wab_admin;
                console.log("Admin status from database:", isAdminUser);
                setIsAdmin(isAdminUser);
                setIsTester(!!data.tester);
                setIsWabAdmin(isAdminUser);
              } else if (mounted) {
                // In preview mode, default to admin
                if (isPreview) {
                  setIsAdmin(true);
                  setIsTester(true);
                  setIsWabAdmin(true);
                } else {
                  setIsAdmin(false);
                  setIsTester(false);
                  setIsWabAdmin(false);
                }
              }
            } catch (err) {
              console.error("Error checking user roles:", err);
              if (mounted) {
                // In preview mode, default to admin
                if (isPreview) {
                  setIsAdmin(true);
                  setIsTester(true);
                  setIsWabAdmin(true);
                } else {
                  setIsAdmin(false);
                  setIsTester(false);
                  setIsWabAdmin(false);
                }
              }
            }
          } else if (isPreview && mounted) {
            // Not authenticated but in preview mode
            setIsAdmin(true);
            setIsTester(true);
            setIsWabAdmin(true);
            console.log("Preview mode without session, using demo auth state");
          } else {
            // Not authenticated and not in preview
            setIsAdmin(false);
            setIsTester(false);
            setIsWabAdmin(false);
          }
          
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error in auth hook:", error);
        if (mounted) {
          setIsLoading(false);
          
          // In preview, default to admin even on error
          if (isPreview) {
            setIsAuthenticated(true);
            setIsAdmin(true);
            setIsTester(true);
            setIsWabAdmin(true);
            setIsGuest(false);
          } else {
            // In production, default to guest on error
            setIsAuthenticated(false);
            setIsAdmin(false);
            setIsTester(false);
            setIsWabAdmin(false);
            setIsGuest(true);
          }
        }
      }
    };
    
    const setupAuthListener = () => {
      // Set up the auth state listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log("Auth state changed:", event, {
            hasUser: !!session?.user,
            userId: session?.user?.id,
            email: session?.user?.email,
            hostname: hostname,
            timestamp: new Date().toISOString()
          });
          
          if (mounted) {
            setIsAuthenticated(!!session);
            setUserId(session?.user?.id || null);
            setIsGuest(!session);
            
            // If authenticated, check for admin/tester status
            if (session?.user?.id) {
              try {
                const { data, error } = await supabase
                  .from('profiles')
                  .select('wab_admin, tester')
                  .eq('id', session.user.id)
                  .maybeSingle();
                  
                console.log("Auth state change: Profile data fetched:", {
                  profileExists: !!data,
                  wabAdmin: data?.wab_admin,
                  tester: data?.tester,
                  error: error?.message,
                  userId: session.user.id,
                  timestamp: new Date().toISOString()
                });
                  
                if (!error && data && mounted) {
                  const isAdminUser = !!data.wab_admin;
                  console.log("Admin status update on auth change:", isAdminUser);
                  setIsAdmin(isAdminUser);
                  setIsTester(!!data.tester);
                  setIsWabAdmin(isAdminUser);
                } else if (mounted && isPreview) {
                  setIsAdmin(true);
                  setIsTester(true);
                  setIsWabAdmin(true);
                } else if (mounted) {
                  setIsAdmin(false);
                  setIsTester(false);
                  setIsWabAdmin(false);
                }
              } catch (err) {
                console.error("Error checking user roles on auth change:", err);
                if (mounted && isPreview) {
                  setIsAdmin(true);
                  setIsTester(true);
                  setIsWabAdmin(true);
                } else if (mounted) {
                  setIsAdmin(false);
                  setIsTester(false);
                  setIsWabAdmin(false);
                }
              }
            } else if (isPreview && mounted) {
              // Not authenticated but in preview mode
              setIsAdmin(true);
              setIsTester(true);
              setIsWabAdmin(true);
            } else if (mounted) {
              // Not authenticated and not in preview
              setIsAdmin(false);
              setIsTester(false);
              setIsWabAdmin(false);
            }
          }
        }
      );
      
      return () => {
        if (subscription) subscription.unsubscribe();
      };
    };

    // Setup auth listener first
    const unsubscribeAuth = setupAuthListener();
    
    // Then check auth status
    checkAuthStatus();
    
    return () => {
      mounted = false;
      if (unsubscribeAuth) unsubscribeAuth();
    };
  }, [isPreview, isProduction, hostname]);

  return {
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
}

export default useAuth;
