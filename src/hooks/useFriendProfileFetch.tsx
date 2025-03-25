
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
      
      console.log("Friend profile data:", data);
      return data as Profile;
    },
    enabled: !!friendId,
  });

  return { profile, isLoading, isError, error };
};
