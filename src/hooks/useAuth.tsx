
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

  // Enhanced preview detection
  const isPreview = () => {
    const hostname = window.location.hostname;
    return hostname === 'lovableproject.com' || 
           hostname.includes('lovableproject.com') ||
           hostname.includes('localhost') ||
           hostname.includes('127.0.0.1');
  };

  useEffect(() => {
    let mounted = true;
    const checkAuthStatus = async () => {
      try {
        setIsLoading(true);
        console.log("Auth hook: Checking auth status");
        console.log("Auth hook: isPreview =", isPreview());
        
        // For preview environment, provide dummy authenticated state
        if (isPreview()) {
          console.log("Preview mode detected, using demo auth state");
          if (mounted) {
            setIsAuthenticated(true);
            setIsAdmin(true);
            setIsTester(true);
            setIsWabAdmin(true);
            setUserId("preview-user-id");
            setIsGuest(false);
          }
          setIsLoading(false);
          return;
        }
        
        // Set up the auth state listener first
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log("Auth state changed:", event);
            
            if (mounted) {
              setIsAuthenticated(!!session);
              setUserId(session?.user?.id || null);
              
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
                    setIsGuest(false);
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
                  setIsGuest(true);
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
                setIsGuest(false);
              } else {
                console.error("Error or no data when checking initial user roles:", error);
                // Explicit fallbacks
                setIsAdmin(false);
                setIsTester(false);
                setIsWabAdmin(false);
                setIsGuest(!session);
              }
            } catch (err) {
              console.error("Error checking user roles:", err);
              // Explicit fallbacks
              setIsAdmin(false);
              setIsTester(false);
              setIsWabAdmin(false);
              setIsGuest(!session);
            }
          } else {
            // Not authenticated, set guest mode
            setIsAdmin(false);
            setIsTester(false);
            setIsWabAdmin(false);
            setIsGuest(true);
          }
        }
        
        setIsLoading(false);
        
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
