import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface SessionValidatorProps {
  children: React.ReactNode;
}

export const SessionValidator = ({ children }: SessionValidatorProps) => {
  const [isValidating, setIsValidating] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const validateSession = async () => {
      try {
        setIsValidating(true);
        
        // Check if we have a session
        console.log("[SessionValidator] Checking for existing session...");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("[SessionValidator] Error fetching session:", sessionError);
          await handleInvalidSession("Session error detected");
          return;
        }
        
        // If no session, nothing to validate - just continue as unauthenticated user
        if (!session) {
          console.log("[SessionValidator] No session found, continuing as unauthenticated user");
          setIsValidating(false);
          return;
        }

        console.log("[SessionValidator] Session found, validating token...");

        // If we have a session, validate it by trying to use it to get the user
        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error("[SessionValidator] Token validation failed:", userError);
          await handleInvalidSession("Session token is invalid");
          return;
        }

        console.log("[SessionValidator] Token validation successful. User ID:", userData.user?.id);

        // Additional validation: Perform a test query to verify the session works for DB access
        try {
          console.log("[SessionValidator] Testing database access with token...");
          const { error: testQueryError } = await supabase
            .from('profiles')
            .select('id')
            .limit(1);
            
          if (testQueryError) {
            console.error("[SessionValidator] Database access validation failed:", testQueryError);
            
            // Only clear sessions for actual auth errors, not for other types of errors
            if (testQueryError.code === 'PGRST301' || 
                testQueryError.code === '42501' || 
                testQueryError.message.includes('JWT') || 
                testQueryError.message.includes('auth') ||
                testQueryError.status === 401 ||
                testQueryError.status === 403) {
              await handleInvalidSession("Session token is invalid for database access");
              return;
            } else {
              // Other database errors shouldn't invalidate the session
              console.log("[SessionValidator] Database error not related to authentication, continuing");
            }
          } else {
            console.log("[SessionValidator] Database access test successful");
          }
        } catch (testError) {
          console.error("[SessionValidator] Error testing session validity:", testError);
          // Don't invalidate session on unexpected errors
          console.log("[SessionValidator] Unexpected error, but not clearing session");
        }
        
        // If we get here, the session is valid - verify user profile exists if needed
        if (session.user?.id) {
          try {
            console.log("[SessionValidator] Checking user profile...");
            const { error: profileError } = await supabase
              .from('profiles')
              .select('id')
              .eq('id', session.user.id)
              .maybeSingle();
              
            if (profileError) {
              console.error("[SessionValidator] Error fetching user profile:", profileError);
              // Profile errors shouldn't invalidate the session unless they're auth-related
              if (profileError.code?.includes('auth') || profileError.status === 401) {
                await handleInvalidSession("User profile validation failed");
                return;
              }
            } else {
              console.log("[SessionValidator] User profile validation successful");
            }
          } catch (profileError) {
            console.error("[SessionValidator] Unexpected error checking profile:", profileError);
            // Don't invalidate session for unexpected errors
          }
        }
        
        // All validation passed
        console.log("[SessionValidator] Session validated successfully");
        setIsValidating(false);
      } catch (error) {
        console.error("[SessionValidator] Unexpected error during session validation:", error);
        // Don't invalidate session for unexpected errors
        setIsValidating(false);
      }
    };
    
    const handleInvalidSession = async (reason: string) => {
      console.warn(`[SessionValidator] Invalid session detected: ${reason}`);
      
      try {
        // Only remove auth-related items, not everything
        for (const key in localStorage) {
          if (key.startsWith('sb-') || key.includes('auth') || key.includes('supabase')) {
            console.log("[SessionValidator] Removing invalid auth item:", key);
            localStorage.removeItem(key);
          }
        }
        
        // Force sign out with Supabase (this is separate from clearing localStorage)
        await supabase.auth.signOut();
        
        // Notify user
        toast.error("Your session has expired", {
          description: "Please sign in again",
          duration: 5000
        });
        
        // Redirect to login page (with a slight delay to allow toast to be seen)
        setTimeout(() => {
          navigate("/login");
        }, 500);
        
      } catch (signOutError) {
        console.error("[SessionValidator] Error during sign out:", signOutError);
        // Force page refresh as last resort
        window.location.href = "/login";
      } finally {
        setIsValidating(false);
      }
    };
    
    // Run validation on mount
    validateSession();
    
    // Set up a periodic validation check every 10 minutes
    const intervalId = setInterval(validateSession, 10 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [navigate]);

  // Simple loading state while validating
  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warcrow-background text-warcrow-gold">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-warcrow-gold mx-auto mb-4"></div>
          <p>Validating session...</p>
        </div>
      </div>
    );
  }

  // Render children once validation is complete
  return <>{children}</>;
};
