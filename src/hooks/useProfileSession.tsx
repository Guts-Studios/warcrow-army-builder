
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
  isGuest: boolean;
  signOut: () => Promise<void>;
}

export const useProfileSession = (): ProfileSession => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [sessionChecked, setSessionChecked] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const { isPreview, isProduction, hostname } = useEnvironment();
  
  // Only use preview data if we're in a preview environment AND no real user is logged in
  const [usePreviewData, setUsePreviewData] = useState<boolean>(false);

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
      setIsGuest(true);
      
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
        
        // Get current session first to check for real authentication
        const { data: { session } } = await supabase.auth.getSession();
        
        // If we have a real authenticated session, use it
        if (session?.user && mounted) {
          console.log("[useProfileSession] Real authenticated user found:", session.user.id);
          setIsAuthenticated(true);
          setUserId(session.user.id);
          setIsGuest(false);
          setUsePreviewData(false);
          
          // Check admin status
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
          
          setSessionChecked(true);
          return;
        }
        
        // No real session - check if we should use preview mode
        if (isPreview && mounted) {
          console.log("[useProfileSession] No real session, using preview mode");
          setIsAuthenticated(true);
          setUserId("preview-user-id");
          setIsAdmin(true);
          setIsGuest(false);
          setUsePreviewData(true);
          setSessionChecked(true);
          return;
        }
        
        // No session and not preview - user is not authenticated
        if (mounted) {
          console.log("[useProfileSession] No session found, user not authenticated");
          setIsAuthenticated(false);
          setUserId(null);
          setIsAdmin(false);
          setIsGuest(true);
          setUsePreviewData(false);
          setSessionChecked(true);
        }
      } catch (error) {
        console.error("[useProfileSession] Error checking auth state:", error);
        if (mounted) {
          setIsAuthenticated(false);
          setUserId(null);
          setIsAdmin(false);
          setIsGuest(true);
          setUsePreviewData(false);
          setSessionChecked(true);
        }
      }
    };
    
    // Set up auth subscription first, then check auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      console.log("[useProfileSession] Auth state changed:", event, {
        hasUser: !!session?.user,
        userId: session?.user?.id,
        environment: { isPreview, isProduction, hostname },
        timestamp: new Date().toISOString()
      });
      
      // If we have a real session, prioritize it over preview
      if (session?.user) {
        setIsAuthenticated(true);
        setUserId(session.user.id);
        setIsGuest(false);
        setUsePreviewData(false);
        
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
        // User signed out - fallback to preview if in preview environment
        if (isPreview) {
          setIsAuthenticated(true);
          setUserId("preview-user-id");
          setIsAdmin(true);
          setIsGuest(false);
          setUsePreviewData(true);
        } else {
          setIsAuthenticated(false);
          setUserId(null);
          setIsAdmin(false);
          setIsGuest(true);
          setUsePreviewData(false);
        }
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
  }, [isPreview, isProduction, hostname]);
  
  return {
    isAuthenticated,
    userId,
    isPreview,
    isProduction,
    sessionChecked,
    usePreviewData,
    isAdmin,
    isGuest,
    signOut
  };
};

export default useProfileSession;
