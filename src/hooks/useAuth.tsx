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

  // Handle session recovery issues with manual sign out
  const forceSignOut = async () => {
    console.log("[Auth] Forcing sign out due to potential session issues");
    
    try {
      // Clear all auth-related localStorage items first
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('sb-') || key.includes('auth'))) {
          localStorage.removeItem(key);
          console.log(`[Auth] Removed problematic auth item: ${key}`);
        }
      }
      
      // Then call the official sign out method
      await supabase.auth.signOut();
      
      // Reset all auth state
      setIsAuthenticated(false);
      setIsAdmin(false);
      setIsTester(false);
      setIsWabAdmin(false);
      setUserId(null);
      setIsGuest(true);
      
      // Purge storage to ensure clean slate
      if (typeof window !== 'undefined') {
        const { checkVersionAndPurgeStorage } = await import('../utils/storageUtils');
        const fakeChangelog = `# Changelog\n\n## [999.999.999]`;
        checkVersionAndPurgeStorage(fakeChangelog, true);
      }
      
      // Force reload the page to ensure clean state
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
      
    } catch (error) {
      console.error('[Auth] Error during force sign out:', error);
      // Still try to reload as last resort
      window.location.href = '/';
    }
  };

  useEffect(() => {
    let mounted = true;
    let sessionCheckTimeout: number | null = null;

    const checkAuthStatus = async () => {
      try {
        setIsLoading(true);
        console.log("[Auth] Checking auth status for hostname:", hostname);
        
        // Handle preview environment explicitly
        if (isPreview) {
          console.log("[Auth] Preview environment detected, checking guest status");
          
          // If in a preview environment but not a guest, grant admin privileges
          const isGuestUser = localStorage.getItem('guestSession') === 'true';
          console.log("[Auth] Preview guest status:", isGuestUser);
          
          if (mounted) {
            // In preview, users are authenticated unless explicitly marked as guests
            setIsAuthenticated(!isGuestUser);
            setIsAdmin(!isGuestUser);
            setIsTester(!isGuestUser);
            setIsWabAdmin(!isGuestUser);
            setUserId(isGuestUser ? null : "preview-user-id");
            setIsGuest(isGuestUser);
            setIsLoading(false);
          }
          return;
        }
        
        // For production environments, check real auth state
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        // If there's an error getting the session, treat as authentication failure
        if (sessionError) {
          console.error("[Auth] Session error:", sessionError);
          
          if (mounted) {
            setIsAuthenticated(false);
            setIsGuest(true);
            
            // If there was a session error, try to clean up auth state
            forceSignOut();
          }
          return;
        }
        
        console.log("[Auth] Session check result:", {
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
                
              console.log("[Auth] Profile data fetched:", {
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
              console.error("[Auth] Error checking user roles:", err);
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
            const isGuestUser = localStorage.getItem('guestSession') === 'true';
            if (!isGuestUser) {
              setIsAdmin(true);
              setIsTester(true);
              setIsWabAdmin(true);
              setIsAuthenticated(true);
              setUserId("preview-user-id");
              setIsGuest(false);
              console.log("Preview mode without session, using demo auth state");
            } else {
              setIsAuthenticated(false);
              setIsAdmin(false);
              setIsTester(false);
              setIsWabAdmin(false);
              setIsGuest(true);
              console.log("Preview mode with guest session, denying admin access");
            }
          } else {
            // Not authenticated and not in preview
            setIsAdmin(false);
            setIsTester(false);
            setIsWabAdmin(false);
          }
          
          setIsLoading(false);
        }
      } catch (error) {
        console.error("[Auth] Error in auth hook:", error);
        if (mounted) {
          setIsLoading(false);
          
          // In preview, default to admin even on error
          if (isPreview) {
            const isGuestUser = localStorage.getItem('guestSession') === 'true';
            if (!isGuestUser) {
              setIsAuthenticated(true);
              setIsAdmin(true);
              setIsTester(true);
              setIsWabAdmin(true);
              setIsGuest(false);
            } else {
              setIsAuthenticated(false);
              setIsAdmin(false);
              setIsTester(false);
              setIsWabAdmin(false);
              setIsGuest(true);
            }
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
          console.log("[Auth] Auth state changed:", event, {
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
                // Use setTimeout to prevent deadlocks in Auth state changes
                setTimeout(async () => {
                  if (!mounted) return;
                  
                  const { data, error } = await supabase
                    .from('profiles')
                    .select('wab_admin, tester')
                    .eq('id', session.user.id)
                    .maybeSingle();
                    
                  console.log("[Auth] Auth state change: Profile data fetched:", {
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
                }, 0);
              } catch (err) {
                console.error("[Auth] Error checking user roles on auth change:", err);
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
    
    // Set up a session validation check every 5 minutes to catch broken sessions
    sessionCheckTimeout = window.setInterval(() => {
      console.log("[Auth] Running scheduled session validation check");
      checkAuthStatus();
    }, 5 * 60 * 1000); // 5 minutes
    
    return () => {
      mounted = false;
      if (unsubscribeAuth) unsubscribeAuth();
      if (sessionCheckTimeout) window.clearInterval(sessionCheckTimeout);
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
    forceSignOut,
    resendConfirmationEmail
  };
}

export default useAuth;
