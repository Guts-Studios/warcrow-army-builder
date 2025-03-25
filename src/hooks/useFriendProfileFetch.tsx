
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/profile";

export const useFriendProfileFetch = (friendId: string | null) => {
  const { data: profile, isLoading, isError, error } = useQuery({
    queryKey: ["friend-profile", friendId],
    queryFn: async () => {
      if (!friendId) return null;
      
      console.log("Fetching friend profile data for:", friendId);
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", friendId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching friend profile:", error);
        throw error;
      }
      
      // Log friend WAB ID to verify it's present
      console.log("Friend profile data with WAB ID:", data?.wab_id);
      
      if (!data?.wab_id) {
        console.warn("No WAB ID found in friend profile data. This may indicate a database issue.");
      }
      
      return data as Profile;
    },
    enabled: !!friendId,
    staleTime: 60000, // Cache friend profile data for 1 minute
  });

  return { profile, isLoading, isError, error };
};
