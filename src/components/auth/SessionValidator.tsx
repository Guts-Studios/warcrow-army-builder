
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
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("[SessionValidator] Error fetching session:", sessionError);
          await handleInvalidSession("Session error detected");
          return;
        }
        
        // If no session, nothing to validate
        if (!session) {
          setIsValidating(false);
          return;
        }
        
        // Verify user exists by attempting to get profile data
        if (session.user?.id) {
          const { error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', session.user.id)
            .maybeSingle();
            
          if (profileError) {
            console.error("[SessionValidator] Error fetching user profile:", profileError);
            await handleInvalidSession("User profile validation failed");
            return;
          }
        }
        
        setIsValidating(false);
      } catch (error) {
        console.error("[SessionValidator] Unexpected error during session validation:", error);
        await handleInvalidSession("Unexpected authentication error");
      }
    };
    
    const handleInvalidSession = async (reason: string) => {
      console.warn(`[SessionValidator] Invalid session detected: ${reason}`);
      
      try {
        // Force sign out
        await supabase.auth.signOut();
        
        // Clean up any problematic auth state
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.startsWith('sb-') || key.includes('auth'))) {
            localStorage.removeItem(key);
          }
        }
        
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
    
    // Set up a periodic validation check
    const intervalId = setInterval(validateSession, 5 * 60 * 1000); // Check every 5 minutes
    
    return () => clearInterval(intervalId);
  }, [navigate]);

  // Simple loading state while validating
  if (isValidating) {
    return null; // Or return a minimal loading indicator if preferred
  }

  // Render children once validation is complete
  return <>{children}</>;
};
