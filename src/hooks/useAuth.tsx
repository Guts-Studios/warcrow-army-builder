
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
    console.log("[useAuth] Forcing sign out due to potential session issues");
    
    try {
      // Clear all auth-related localStorage items first
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('sb-') || key.includes('auth'))) {
          localStorage.removeItem(key);
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
      setIsLoading(false);
      
      console.log("[useAuth] Auth state ready after force sign out:", {
        isAuthenticated: false,
        isLoading: false,
        timestamp: new Date().toISOString()
      });
      
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
      console.error('[useAuth] Error during force sign out:', error);
      // Still try to reload as last resort
      window.location.href = '/';
    }
  };

  useEffect(() => {
    let mounted = true;
    let profileFetchTimeout: NodeJS.Timeout | null = null;

    const fetchUserProfile = async (userId: string, retryCount = 0) => {
      const MAX_RETRIES = 3;
      const RETRY_DELAY = 1000;

      try {
        console.log(`[useAuth] Fetching profile for user ${userId}, attempt ${retryCount + 1}`);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('wab_admin, tester')
          .eq('id', userId)
          .maybeSingle();
          
        if (error) {
          console.error("[useAuth] Error fetching profile:", error);
          if (retryCount < MAX_RETRIES) {
            console.log(`[useAuth] Retrying profile fetch in ${RETRY_DELAY}ms...`);
            profileFetchTimeout = setTimeout(() => {
              if (mounted) {
                fetchUserProfile(userId, retryCount + 1);
              }
            }, RETRY_DELAY);
            return;
          }
        }
        
        if (mounted && data) {
          const isAdminUser = !!data.wab_admin;
          console.log(`[useAuth] Profile loaded successfully: admin=${isAdminUser}, tester=${!!data.tester}`);
          setIsAdmin(isAdminUser);
          setIsTester(!!data.tester);
          setIsWabAdmin(isAdminUser);
        } else if (mounted) {
          console.log("[useAuth] No profile data found or error occurred");
          setIsAdmin(isPreview);
          setIsTester(isPreview);
          setIsWabAdmin(isPreview);
        }
      } catch (err) {
        console.error("[useAuth] Exception during profile fetch:", err);
        if (mounted) {
          setIsAdmin(isPreview);
          setIsTester(isPreview);
          setIsWabAdmin(isPreview);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
          console.log("[useAuth] Auth state ready after profile fetch:", {
            isLoading: false,
            timestamp: new Date().toISOString()
          });
        }
      }
    };

    const checkAuthStatus = async () => {
      try {
        console.log("[useAuth] Starting auth check...", { isPreview, timestamp: new Date().toISOString() });
        
        // Handle preview environment explicitly
        if (isPreview) {
          const isGuestUser = localStorage.getItem('guestSession') === 'true';
          
          if (mounted) {
            setIsAuthenticated(!isGuestUser);
            setIsAdmin(!isGuestUser);
            setIsTester(!isGuestUser);
            setIsWabAdmin(!isGuestUser);
            setUserId(isGuestUser ? null : "preview-user-id");
            setIsGuest(isGuestUser);
            setIsLoading(false);
            console.log("[useAuth] Auth state ready (preview):", {
              isAuthenticated: !isGuestUser,
              isLoading: false,
              timestamp: new Date().toISOString()
            });
          }
          return;
        }
        
        // For production environments, check real auth state
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("[useAuth] Session error:", sessionError);
          if (mounted) {
            setIsAuthenticated(false);
            setIsGuest(true);
            setIsLoading(false);
            console.log("[useAuth] Auth state ready (session error):", {
              isAuthenticated: false,
              isLoading: false,
              timestamp: new Date().toISOString()
            });
            forceSignOut();
          }
          return;
        }
        
        if (mounted) {
          const isAuth = !!session;
          console.log(`[useAuth] Session check complete: authenticated=${isAuth}`);
          
          setIsAuthenticated(isAuth);
          setUserId(session?.user?.id || null);
          setIsGuest(!session);
          
          if (session?.user?.id) {
            // Don't set loading to false yet, wait for profile fetch
            await fetchUserProfile(session.user.id);
          } else {
            setIsAdmin(false);
            setIsTester(false);
            setIsWabAdmin(false);
            setIsLoading(false);
            console.log("[useAuth] Auth state ready (no session):", {
              isAuthenticated: false,
              isLoading: false,
              timestamp: new Date().toISOString()
            });
          }
        }
      } catch (error) {
        console.error("[useAuth] Error in auth check:", error);
        if (mounted) {
          setIsLoading(false);
          setIsAuthenticated(false);
          setIsAdmin(isPreview);
          setIsTester(isPreview);
          setIsWabAdmin(isPreview);
          setIsGuest(!isPreview);
          console.log("[useAuth] Auth state ready (error):", {
            isAuthenticated: false,
            isLoading: false,
            timestamp: new Date().toISOString()
          });
        }
      }
    };
    
    const setupAuthListener = () => {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (!mounted) return;
          
          console.log(`[useAuth] Auth state changed: ${event}`, {
            hasUser: !!session?.user,
            userId: session?.user?.id
          });
          
          const isAuth = !!session;
          setIsAuthenticated(isAuth);
          setUserId(session?.user?.id || null);
          setIsGuest(!session);
          
          if (session?.user?.id && event !== 'INITIAL_SESSION') {
            setIsLoading(true);
            await fetchUserProfile(session.user.id);
          } else if (!session) {
            setIsAdmin(isPreview);
            setIsTester(isPreview);
            setIsWabAdmin(isPreview);
            if (event !== 'INITIAL_SESSION') {
              setIsLoading(false);
              console.log("[useAuth] Auth state ready (no user):", {
                isAuthenticated: false,
                isLoading: false,
                timestamp: new Date().toISOString()
              });
            }
          }
        }
      );
      
      return () => {
        if (subscription) subscription.unsubscribe();
      };
    };

    // Setup auth listener first, then check auth status
    const unsubscribeAuth = setupAuthListener();
    checkAuthStatus();
    
    return () => {
      mounted = false;
      if (unsubscribeAuth) unsubscribeAuth();
      if (profileFetchTimeout) clearTimeout(profileFetchTimeout);
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
