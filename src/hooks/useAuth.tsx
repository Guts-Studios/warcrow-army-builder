
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isTester, setIsTester] = useState<boolean>(false);
  const [isWabAdmin, setIsWabAdmin] = useState<boolean>(false); // Add this state
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGuest, setIsGuest] = useState<boolean>(false);

  // Check for preview mode
  const isPreview = window.location.hostname === 'lovableproject.com' || 
                   window.location.hostname.endsWith('.lovableproject.com');

  useEffect(() => {
    let mounted = true;
    const checkAuthStatus = async () => {
      try {
        setIsLoading(true);
        
        // For preview environment, provide dummy authenticated state
        if (isPreview) {
          console.log("Preview mode detected, using demo auth state");
          if (mounted) {
            setIsAuthenticated(true);
            setIsAdmin(true);
            setIsTester(true);
            setIsWabAdmin(true); // Set this for preview mode
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
                    setIsAdmin(!!data.wab_admin);
                    setIsTester(!!data.tester);
                    setIsWabAdmin(!!data.wab_admin); // Set isWabAdmin based on profile data
                    setIsGuest(false);
                  }
                } catch (err) {
                  console.error("Error checking user roles:", err);
                }
              } else {
                // Not authenticated
                if (mounted) {
                  setIsAdmin(false);
                  setIsTester(false);
                  setIsWabAdmin(false); // Reset when not authenticated
                  setIsGuest(false);
                }
              }
            }
          }
        );
        
        // Get the initial session state
        const { data: { session } } = await supabase.auth.getSession();
        
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
                setIsAdmin(!!data.wab_admin);
                setIsTester(!!data.tester);
                setIsWabAdmin(!!data.wab_admin); // Set based on profile data
                setIsGuest(false);
              }
            } catch (err) {
              console.error("Error checking user roles:", err);
            }
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
          setIsWabAdmin(false); // Reset on error
          setIsGuest(false);
        }
      }
    };
    
    checkAuthStatus();
    
    return () => {
      mounted = false;
    };
  }, [isPreview]);

  // Add placeholder for resendConfirmationEmail to match the interface
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
    isWabAdmin, // Include this in the return value
    userId,
    isLoading,
    isGuest,
    setIsGuest,
    resendConfirmationEmail // Include this in the return value
  };
}

export default useAuth;
