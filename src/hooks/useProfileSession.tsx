
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import useEnvironment from './useEnvironment';

interface ProfileSession {
  isAuthenticated: boolean;
  userId: string | null;
  isPreview: boolean;
  isProduction: boolean;
}

export const useProfileSession = (): ProfileSession => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { isPreview, isProduction, hostname } = useEnvironment();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        console.log("[useProfileSession] Auth check:", {
          hasSession: !!session,
          environment: { isPreview, isProduction, hostname }
        });
        
        if (session && session.user) {
          setIsAuthenticated(true);
          setUserId(session.user.id);
        } else {
          setIsAuthenticated(false);
          setUserId(null);
        }
      } catch (error) {
        console.error('[useProfileSession] Error checking authentication:', error);
        setIsAuthenticated(false);
        setUserId(null);
      }
    };

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("[useProfileSession] Auth state changed:", event, {
          hasUser: !!session?.user,
          environment: { isPreview, isProduction, hostname }
        });
        
        if (event === 'SIGNED_IN' && session) {
          setIsAuthenticated(true);
          setUserId(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setIsAuthenticated(false);
          setUserId(null);
        }
      }
    );

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [isPreview, isProduction, hostname]);

  return { isAuthenticated, userId, isPreview, isProduction };
};

export default useProfileSession;
