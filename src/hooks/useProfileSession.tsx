
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useProfileSession = () => {
  // Check if we're running in preview mode
  const isPreview = window.location.hostname === 'lovableproject.com' || 
                  window.location.hostname.endsWith('.lovableproject.com');

  // Get the session to check if user is authenticated
  const { data: sessionData, error: sessionError } = useQuery({
    queryKey: ["auth-session"],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data;
    },
    retry: 1,
  });

  // Determine if we're authenticated and if we should use preview data
  const isAuthenticated = !!sessionData?.session?.user;
  const usePreviewData = isPreview && !isAuthenticated;

  console.log("Auth status:", { isPreview, isAuthenticated, usePreviewData });

  return {
    isAuthenticated,
    usePreviewData,
    sessionData,
    sessionError,
    userId: sessionData?.session?.user?.id
  };
};
