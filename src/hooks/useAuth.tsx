
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useAuth() {
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
    console.log("Auth hook: Current hostname for preview check:", hostname);
    
    // More comprehensive list of preview hostnames
    const isPreviewEnv = hostname === 'lovableproject.com' || 
                         hostname.includes('.lovableproject.com') ||
                         hostname.includes('localhost') ||
                         hostname.includes('127.0.0.1') ||
                         hostname.includes('netlify.app') ||
                         hostname.includes('id-preview') ||
                         hostname.includes('lovable.app');
    
    console.log("Auth hook: Is preview environment:", isPreviewEnv);
    return isPreviewEnv;
  };

  // Resend confirmation email method
  const resendConfirmationEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });
      
      if (error) throw error;
      
      console.log('Confirmation email resent');
    } catch (err) {
      console.error('Error resending confirmation email:', err);
      throw err;
    }
  };

  useEffect(() => {
    let mounted = true;

    const checkAuthStatus = async () => {
      try {
        setIsLoading(true);
        console.log("Auth hook: Checking auth status");
        const inPreview = isPreview();
        console.log("Auth hook: isPreview =", inPreview);
        
        // For preview environment, we'll use the normal authentication flow but
        // with admin privileges if no session is found
        const { data: { session } } = await supabase.auth.getSession();
        
        console.log("Auth hook: Session check result:", {
          hasSession: !!session,
          userId: session?.user?.id,
          email: session?.user?.email,
          userMetadata: session?.user?.user_metadata,
          appMetadata: session?.user?.app_metadata,
          timestamp: new Date().toISOString()
        });
        
        if (mounted) {
          // If we're in preview and there's no session, set preview privileges
          if (inPreview && !session) {
            console.log("Preview mode detected with no session, using demo auth state");
            setIsAuthenticated(true);
            setIsAdmin(true);
            setIsTester(true);
            setIsWabAdmin(true);
            setUserId("preview-user-id");
            setIsGuest(false);
            setIsLoading(false);
            return;
          }
          
          // Set normal auth state based on session
          console.log("Setting auth state based on session:", !!session);
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
                .single();
                
              console.log("Auth hook: Profile data fetched:", {
                profileExists: !!data,
                wabAdmin: data?.wab_admin,
                tester: data?.tester,
                error: error?.message,
                timestamp: new Date().toISOString()
              });
                
              if (!error && data && mounted) {
                const isAdminUser = !!data.wab_admin;
                console.log("Admin status from database:", isAdminUser);
                setIsAdmin(isAdminUser);
                setIsTester(!!data.tester);
                setIsWabAdmin(isAdminUser);
              } else {
                console.error("Error or no data when checking user roles:", error);
                if (mounted) {
                  // In preview mode, default to admin if role check fails
                  if (inPreview) {
                    setIsAdmin(true);
                    setIsTester(true);
                    setIsWabAdmin(true);
                  } else {
                    // Explicit fallbacks when profile fetch fails in production
                    setIsAdmin(false);
                    setIsTester(false);
                    setIsWabAdmin(false);
                  }
                }
              }
            } catch (err) {
              console.error("Error checking user roles:", err);
              if (mounted) {
                // In preview mode, default to admin if role check fails
                if (inPreview) {
                  setIsAdmin(true);
                  setIsTester(true);
                  setIsWabAdmin(true);
                } else {
                  // Explicit fallbacks when profile fetch errors in production
                  setIsAdmin(false);
                  setIsTester(false);
                  setIsWabAdmin(false);
                }
              }
            }
          } else if (inPreview) {
            // Not authenticated but in preview mode
            setIsAdmin(true);
            setIsTester(true);
            setIsWabAdmin(true);
          } else {
            // Not authenticated and not in preview
            setIsAdmin(false);
            setIsTester(false);
            setIsWabAdmin(false);
          }
          
          setIsLoading(false);
        }
        
        // Set up the auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log("Auth state changed in AuthProvider:", event, {
              hasUser: !!session?.user,
              userId: session?.user?.id,
              email: session?.user?.email,
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
                    .single();
                    
                  console.log("Auth state change: Profile data fetched:", {
                    profileExists: !!data,
                    wabAdmin: data?.wab_admin,
                    tester: data?.tester,
                    error: error?.message,
                    timestamp: new Date().toISOString()
                  });
                    
                  if (!error && data && mounted) {
                    const isAdminUser = !!data.wab_admin;
                    console.log("Admin status from database:", isAdminUser);
                    setIsAdmin(isAdminUser);
                    setIsTester(!!data.tester);
                    setIsWabAdmin(isAdminUser);
                  } else {
                    console.error("Error or no data when checking user roles:", error);
                    if (mounted) {
                      // Explicit fallbacks when profile fetch fails
                      setIsAdmin(false);
                      setIsTester(false);
                      setIsWabAdmin(false);
                    }
                  }
                } catch (err) {
                  console.error("Error checking user roles:", err);
                  if (mounted) {
                    // Explicit fallbacks when profile fetch errors
                    setIsAdmin(false);
                    setIsTester(false);
                    setIsWabAdmin(false);
                  }
                }
              } else if (inPreview) {
                // Not authenticated but in preview mode
                setIsAdmin(true);
                setIsTester(true);
                setIsWabAdmin(true);
              } else {
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
      } catch (error) {
        console.error("Error in auth hook:", error);
        if (mounted) {
          setIsLoading(false);
          
          // In preview, default to admin even on error
          if (isPreview()) {
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
    
    checkAuthStatus();
    
    return () => {
      mounted = false;
    };
  }, []);

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
