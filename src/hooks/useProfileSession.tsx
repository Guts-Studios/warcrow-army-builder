
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useEnvironment } from '@/hooks/useEnvironment';

interface ProfileSession {
  isAuthenticated: boolean;
  userId: string | null;
  isPreview: boolean;
  isProduction: boolean;
  sessionChecked: boolean;
  usePreviewData: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

export const useProfileSession = (): ProfileSession => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [sessionChecked, setSessionChecked] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const { isPreview, isProduction, hostname } = useEnvironment();
  
  // For preview environments, always set usePreviewData to true
  const usePreviewData = isPreview;

  // Handle sign out function
  const signOut = async () => {
    try {
      console.log("[useProfileSession] Signing out user");
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("[useProfileSession] Error signing out:", error);
        throw error;
      }
      
      console.log("[useProfileSession] Successfully signed out");
      
      // Force clear local state regardless of Supabase response
      setIsAuthenticated(false);
      setUserId(null);
      setIsAdmin(false);
      
      // Force clear localStorage to ensure all session data is removed
      localStorage.removeItem('supabase.auth.token');
      
      // Redirect to home page after sign out
      window.location.href = '/';
      
    } catch (err) {
      console.error("[useProfileSession] Error in sign out process:", err);
      // Force redirect even if there was an error
      window.location.href = '/';
    }
  };

  useEffect(() => {
    let mounted = true;
    
    const checkAuthState = async () => {
      try {
        console.log("[useProfileSession] Checking authentication state on:", hostname);
        
        // Special handling for preview environment - automatically authenticate with demo user
        if (isPreview && mounted) {
          console.log("[useProfileSession] Preview environment detected, using demo auth state");
          setIsAuthenticated(true);
          setUserId("preview-user-id");
          setIsAdmin(true); // Admins in preview mode
          setSessionChecked(true);
          return;
        }
        
        // Get current session
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
          
          // If authenticated, set user ID and check admin status
          if (hasSession) {
            setUserId(session?.user?.id || null);
            
            try {
              const { data, error } = await supabase
                .from('profiles')
                .select('wab_admin')
                .eq('id', session.user.id)
                .maybeSingle();
                
              if (!error && data) {
                setIsAdmin(!!data.wab_admin);
                console.log("[useProfileSession] Admin status:", !!data.wab_admin);
              } else {
                console.error("[useProfileSession] Error checking admin status:", error);
                setIsAdmin(false);
              }
            } catch (err) {
              console.error("[useProfileSession] Error fetching profile:", err);
              setIsAdmin(false);
            }
          } else {
            setUserId(null);
            setIsAdmin(false);
          }
          
          setSessionChecked(true);
        }
      } catch (error) {
        console.error("[useProfileSession] Error checking auth state:", error);
        if (mounted) {
          setIsAuthenticated(false);
          setUserId(null);
          setIsAdmin(false);
          setSessionChecked(true);
        }
      }
    };
    
    // Set up auth subscription first, then check auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      console.log("[useProfileSession] Auth state changed:", event, {
        hasUser: !!session?.user,
        environment: { isPreview, isProduction, hostname },
        usePreviewData,
        timestamp: new Date().toISOString()
      });
      
      // Special handling for preview environment
      if (isPreview) {
        setIsAuthenticated(true);
        setUserId("preview-user-id");
        setIsAdmin(true);
        setSessionChecked(true);
        return;
      }
      
      // Update authentication state based on event
      setIsAuthenticated(!!session);
      
      // If signed in, update user ID
      if (session?.user?.id) {
        setUserId(session.user.id);
        
        // Check for admin status
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('wab_admin')
            .eq('id', session.user.id)
            .maybeSingle();
            
          if (!error && data) {
            setIsAdmin(!!data.wab_admin);
            console.log("[useProfileSession] Admin status updated:", !!data.wab_admin);
          } else {
            console.error("[useProfileSession] Error checking admin status:", error);
            setIsAdmin(false);
          }
        } catch (err) {
          console.error("[useProfileSession] Error fetching profile:", err);
          setIsAdmin(false);
        }
      } else if (event === 'SIGNED_OUT') {
        setUserId(null);
        setIsAdmin(false);
      }
      
      setSessionChecked(true);
    });
    
    // Call the function to check auth state
    checkAuthState();
    
    // Cleanup subscription on unmount
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [isPreview, isProduction, hostname, usePreviewData]);
  
  return {
    isPreview,
    isAuthenticated,
    userId,
    isProduction,
    sessionChecked,
    usePreviewData,
    isAdmin,
    signOut
  };
};

export default useProfileSession;
