
import { useEffect } from "react";
import { useAuth as useAuthFromProvider } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

export function useAuth() {
  const authContext = useAuthFromProvider();
  
  // Calculate authReady from context
  const authReady = !authContext.isLoading && authContext.isAuthenticated !== null;
  
  // Log when authReady changes for debugging with more detail
  useEffect(() => {
    console.log("[useAuth] 📊 Auth state summary:", {
      isLoading: authContext.isLoading,
      isAuthenticated: authContext.isAuthenticated,
      authReady,
      userId: authContext.userId,
      isWabAdmin: authContext.isWabAdmin,
      isTester: authContext.isTester,
      isGuest: authContext.isGuest,
      authReadyTransition: authReady ? 'READY' : 'NOT_READY',
      timestamp: new Date().toISOString()
    });
    
    // Log when authReady becomes true for the first time
    if (authReady && !authContext.isLoading) {
      console.log("[useAuth] 🎉 AUTH READY - Data fetching can now proceed!", {
        userId: authContext.userId,
        isAuthenticated: authContext.isAuthenticated,
        timestamp: new Date().toISOString()
      });
    }
  }, [authContext.isLoading, authContext.isAuthenticated, authReady, authContext.userId]);

  return {
    ...authContext,
    authReady,
    // Add legacy methods for backward compatibility
    forceSignOut: async () => {
      console.log("[useAuth] 🔐 Force sign out requested");
      try {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error("[useAuth] ❌ Sign out error:", error);
          throw error;
        }
        console.log("[useAuth] ✅ Successfully signed out");
      } catch (err) {
        console.error("[useAuth] ❌ Exception during sign out:", err);
        throw err;
      }
    }
  };
}

export default useAuth;
