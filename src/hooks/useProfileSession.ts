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
  signOut: () => Promise<void>;
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
  const { isPreview, isProduction, hostname } = useEnvironment();
  
  // Always set usePreviewData to false - we want to use real data
  const usePreviewData = false;

  // Add signOut function
  const signOut = async () => {
    try {
      console.log("[useProfileSession] Signing out user");
      
      // Clear local auth state first for UI responsiveness
      setIsAuthenticated(false);
      setUserId(undefined);
      setIsAdmin(false);
      
      // Force clear localStorage to ensure all session data is removed
      localStorage.removeItem('supabase.auth.token');
      
      // Call Supabase signOut
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("[useProfileSession] Error signing out:", error);
        throw error;
      } else {
        console.log("[useProfileSession] Successfully signed out");
      }
      
      // Hard redirect to login page after sign out
      window.location.href = '/login';
      
    } catch (err) {
      console.error("[useProfileSession] Error in sign out process:", err);
      
      // Force redirect even if there was an error
      window.location.href = '/login';
    }
  };

  // Effect to check and set authentication state when the component mounts
  useEffect(() => {
    let mounted = true;
    
    const checkAuthState = async () => {
      try {
        console.log("[useProfileSession] Checking authentication state on:", hostname);
        
        // Handle preview environment directly
        if (isPreview && mounted) {
          console.log("[useProfileSession] Preview environment detected, using demo auth state");
          setIsAuthenticated(true);
          setIsAdmin(true);
          setIsGuest(false);
          setUserId("preview-user-id");
          setSessionChecked(true);
          return;
        }
        
        // For production, check real auth state
        const { data: { session } } = await supabase.auth.getSession();
        
        // Set authentication state based on session
        const hasSession = !!session;
        
        if (mounted) {
          console.log("[useProfileSession] Session check result:", { 
            hasSession, 
            userId: session?.user?.id,
            hostname,
            timestamp: new Date().toISOString()
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

            console.log("[useProfileSession] Profile data fetched:", {
              profileExists: !!profileData,
              isAdmin: adminStatus,
              userId: session?.user?.id,
              profileData
            });
          } else {
            setIsAdmin(false);
            setIsGuest(true);
            
            // Provide special admin privileges in preview environments if needed
            if (isPreview) {
              console.log("[useProfileSession] Preview environment detected without session");
            }
          }
          
          setSessionChecked(true);
          
          console.log("[useProfileSession] Auth state determined:", { 
            isAuthenticated: hasSession,
            isAdmin: adminStatus,
            userId: session?.user?.id,
            environment: { isPreview, isProduction, hostname },
            isGuest: !!localStorage.getItem('guestSession'),
            sessionChecked: true,
            usePreviewData,
            timestamp: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error("[useProfileSession] Error checking auth state:", error);
        if (mounted) {
          setIsAuthenticated(false);
          setIsAdmin(isPreview); // Set admin to true in preview mode
          setIsGuest(!isPreview);
          setSessionChecked(true);
        }
      }
    };
    
    // Call the function to check auth state
    checkAuthState();
    
    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      console.log("[useProfileSession] Auth state changed:", event, {
        hasUser: !!session?.user,
        environment: { isPreview, isProduction, hostname },
        usePreviewData,
        timestamp: new Date().toISOString()
      });
      
      // Update authentication state based on event
      setIsAuthenticated(!!session);
      
      // If signed in, update user ID and check admin status
      if (session?.user?.id) {
        setUserId(session.user.id);
        setIsGuest(false);
        
        // Check if user is admin
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('wab_admin')
            .eq('id', session.user.id)
            .single();
            
          if (error) {
            console.error("[useProfileSession] Error checking admin status:", error);
          }
          
          console.log("[useProfileSession] Admin status check:", {
            profileExists: !!data,
            isAdmin: !!data?.wab_admin,
            userId: session.user.id,
            profileData: data
          });
            
          if (mounted) {
            setIsAdmin(!!data?.wab_admin);
          }
        } catch (err) {
          console.error("[useProfileSession] Error fetching profile:", err);
          setIsAdmin(isPreview); // Fallback to preview setting
        }
      } else if (event === 'SIGNED_OUT') {
        console.log("[useProfileSession] User signed out");
        setUserId(undefined);
        setIsAdmin(isPreview); // Set admin to true in preview mode
        setIsGuest(true);
      }
      
      setSessionChecked(true);
    });
    
    // Cleanup subscription on unmount
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [isPreview, isProduction, hostname]);
  
  return {
    isPreview,
    isAdmin,
    isAuthenticated,
    userId,
    isGuest,
    sessionChecked,
    usePreviewData,
    signOut
  };
};

export default useProfileSession;
