
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import useEnvironment from './useEnvironment';

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
  
  // Determine if we should use preview data based on environment
  const usePreviewData = isPreview && !isProduction;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        console.log("[useProfileSession] Auth check:", {
          hasSession: !!session,
          environment: { isPreview, isProduction, hostname },
          usePreviewData
        });
        
        if (session && session.user) {
          setIsAuthenticated(true);
          setUserId(session.user.id);
        } else {
          setIsAuthenticated(false);
          setUserId(null);
        }
        setSessionChecked(true);
      } catch (error) {
        console.error('[useProfileSession] Error checking authentication:', error);
        setIsAuthenticated(false);
        setUserId(null);
        setSessionChecked(true);
      }
    };

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("[useProfileSession] Auth state changed:", event, {
          hasUser: !!session?.user,
          environment: { isPreview, isProduction, hostname },
          usePreviewData
        });
        
        if (event === 'SIGNED_IN' && session) {
          setIsAuthenticated(true);
          setUserId(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setIsAuthenticated(false);
          setUserId(null);
        }
        setSessionChecked(true);
      }
    );

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [isPreview, isProduction, hostname, usePreviewData]);

  return { 
    isAuthenticated, 
    userId, 
    isPreview, 
    isProduction,
    sessionChecked,
    usePreviewData
  };
};

export default useProfileSession;
