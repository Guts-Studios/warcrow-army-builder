
import { useEffect } from "react";
import { useAuth as useAuthFromProvider } from "@/components/auth/AuthProvider";

export function useAuth() {
  const authContext = useAuthFromProvider();
  
  // Calculate authReady from context
  const authReady = !authContext.isLoading && authContext.isAuthenticated !== null;
  
  // Log when authReady changes for debugging
  useEffect(() => {
    console.log("[useAuth] Auth ready state:", {
      isLoading: authContext.isLoading,
      isAuthenticated: authContext.isAuthenticated,
      authReady,
      timestamp: new Date().toISOString()
    });
  }, [authContext.isLoading, authContext.isAuthenticated, authReady]);

  return {
    ...authContext,
    authReady,
    // Add legacy methods for backward compatibility
    forceSignOut: async () => {
      console.log("[useAuth] Force sign out requested");
      // Implementation would go here if needed
    }
  };
}

export default useAuth;
