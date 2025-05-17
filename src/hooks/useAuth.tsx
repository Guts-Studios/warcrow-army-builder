
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
    
    // Check for specific production domain - adjust this to match your actual production domain
    const isProduction = hostname === 'warcrow-army-builder.netlify.app' || 
                         hostname === 'wab.warcrow.com';
    
    if (isProduction) {
      console.log("Production environment detected");
      return false;
    }
    
    // Otherwise, check if it's a preview/development environment
    const isPreviewEnv = hostname === 'lovableproject.com' || 
                         hostname.includes('.lovableproject.com') ||
                         hostname.includes('localhost') ||
                         hostname.includes('127.0.0.1') ||
                         hostname.includes('netlify.app') ||
                         hostname.includes('id-preview') ||
                         hostname.includes('lovable.app');
    
    console.log("Is preview environment:", isPreviewEnv);
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
        
        // For preview environment, provide dummy authenticated state
        if (inPreview) {
          console.log("Preview mode detected, using demo auth state");
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
        
        // Set up the auth state listener for production environments
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log("Auth state changed:", event);
            
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
              } else {
                // Not authenticated
                if (mounted) {
                  setIsAdmin(false);
                  setIsTester(false);
                  setIsWabAdmin(false);
                }
              }
            }
          }
        );
        
        // Get the initial session state
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Initial auth session:", session ? "Found" : "Not found");
        
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
                
              if (!error && data) {
                const isAdminUser = !!data.wab_admin;
                console.log("Initial admin status from database:", isAdminUser);
                setIsAdmin(isAdminUser);
                setIsTester(!!data.tester);
                setIsWabAdmin(isAdminUser);
              } else {
                console.error("Error or no data when checking initial user roles:", error);
                // Explicit fallbacks
                setIsAdmin(false);
                setIsTester(false);
                setIsWabAdmin(false);
              }
            } catch (err) {
              console.error("Error checking user roles:", err);
              // Explicit fallbacks
              setIsAdmin(false);
              setIsTester(false);
              setIsWabAdmin(false);
            }
          } else {
            // Not authenticated, set guest mode
            setIsAdmin(false);
            setIsTester(false);
            setIsWabAdmin(false);
          }
          
          setIsLoading(false);
        }
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Error in auth hook:", error);
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
