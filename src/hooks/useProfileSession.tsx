
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
}

export const useProfileSession = (): ProfileSession => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [sessionChecked, setSessionChecked] = useState<boolean>(false);
  const { isPreview, isProduction, hostname } = useEnvironment();
  
  // Important: Set usePreviewData to false for both preview and production
  const usePreviewData = false;

  useEffect(() => {
    let mounted = true;
    
    const checkAuthState = async () => {
      try {
        console.log("[useProfileSession] Checking authentication state on:", hostname);
        
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
          
          // If authenticated, set user ID
          if (hasSession) {
            setUserId(session?.user?.id || null);
          } else {
            setUserId(null);
          }
          
          setSessionChecked(true);
        }
      } catch (error) {
        console.error("[useProfileSession] Error checking auth state:", error);
        if (mounted) {
          setIsAuthenticated(false);
          setUserId(null);
          setSessionChecked(true);
        }
      }
    };
    
    // Set up auth subscription first
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
      
      // If signed in, update user ID
      if (session?.user?.id) {
        setUserId(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUserId(null);
      }
      
      setSessionChecked(true);
    });
    
    // Then check auth state
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
    usePreviewData
  };
};

export default useProfileSession;
