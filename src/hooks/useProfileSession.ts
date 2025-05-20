
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useEnvironment } from './useEnvironment';

// Define a type for the session information
interface ProfileSession {
  isPreview: boolean;
  isAdmin: boolean;
  isAuthenticated: boolean;
  userId?: string;
  isGuest: boolean;
  sessionChecked: boolean;
  usePreviewData: boolean;
}

/**
 * Hook to manage profile session state and authentication
 */
export const useProfileSession = (): ProfileSession => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [sessionChecked, setSessionChecked] = useState<boolean>(false);
  const { isPreview, isProduction } = useEnvironment();
  
  // Always set usePreviewData to false - we want to use real data
  const usePreviewData = false;

  // Effect to check and set authentication state when the component mounts
  useEffect(() => {
    let mounted = true;
    
    const checkAuthState = async () => {
      try {
        console.log("[useProfileSession] Checking authentication state...");
        
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        // Set authentication state based on session
        const hasSession = !!session?.user;
        
        if (mounted) {
          console.log("[useProfileSession] Session check result:", { 
            hasSession, 
            userId: session?.user?.id 
          });
          
          setIsAuthenticated(hasSession);
          
          // Initialize a variable to store admin status
          let adminStatus = false;
          
          // If authenticated, check if user is admin and set user ID
          if (hasSession) {
            setUserId(session?.user?.id);
            
            // Check if user is admin via profiles table
            const { data: profileData } = await supabase
              .from('profiles')
              .select('wab_admin')
              .eq('id', session?.user?.id)
              .single();
              
            adminStatus = !!profileData?.wab_admin;
            setIsAdmin(adminStatus);
            setIsGuest(false);
          } else {
            setIsAdmin(false);
            setIsGuest(!!localStorage.getItem('guestSession'));
          }
          
          setSessionChecked(true);
          
          console.log("[useProfileSession] Auth state determined:", { 
            isAuthenticated: hasSession,
            isAdmin: adminStatus,
            userId: session?.user?.id,
            environment: { isPreview, isProduction },
            isGuest: !!localStorage.getItem('guestSession'),
            sessionChecked: true,
            usePreviewData
          });
        }
      } catch (error) {
        console.error("[useProfileSession] Error checking auth state:", error);
        if (mounted) {
          setIsAuthenticated(false);
          setIsAdmin(false);
          setIsGuest(!!localStorage.getItem('guestSession'));
          setSessionChecked(true);
        }
      }
    };
    
    // Call the function to check auth state
    checkAuthState();
    
    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      
      console.log("[useProfileSession] Auth state changed:", event, {
        hasUser: !!session?.user,
        environment: { isPreview, isProduction },
        usePreviewData
      });
      
      // Update authentication state based on event
      const isSignedIn = event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED';
      setIsAuthenticated(!!session);
      
      // If signed in, update user ID and check admin status
      if (session?.user?.id) {
        setUserId(session.user.id);
        setIsGuest(false);
        
        // Check if user is admin
        supabase
          .from('profiles')
          .select('wab_admin')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            if (mounted) {
              setIsAdmin(!!data?.wab_admin);
            }
          });
      } else if (event === 'SIGNED_OUT') {
        setUserId(undefined);
        setIsAdmin(false);
        setIsGuest(!!localStorage.getItem('guestSession'));
      }
      
      setSessionChecked(true);
    });
    
    // Cleanup subscription on unmount
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [isPreview, isProduction]);
  
  return {
    isPreview,
    isAdmin,
    isAuthenticated,
    userId,
    isGuest,
    sessionChecked,
    usePreviewData
  };
};

export default useProfileSession;
