
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/profile";

interface UseProfileFetchProps {
  isAuthenticated: boolean;
  usePreviewData: boolean;
  userId?: string;
  sessionChecked: boolean;
}

export const useProfileFetch = ({ isAuthenticated, usePreviewData, userId, sessionChecked }: UseProfileFetchProps) => {
  const { data: profile, isLoading, isError, error } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      console.log("Fetching profile data for user ID:", userId);
      
      if (usePreviewData) {
        console.log("Using preview mode profile data");
        return {
          id: "preview-user-id",
          username: "Preview User",
          bio: "This is a preview account",
          location: "Preview Land",
          favorite_faction: "Hegemony of Embersig",
          social_discord: "preview#1234",
          social_twitter: "@previewUser",
          avatar_url: "/art/portrait/nuada_portrait.jpg",
          wab_id: "WAB-PREV-MODE-DEMO",
          games_won: 5,
          games_lost: 2
        } as Profile;
      }
      
      if (!userId) {
        console.log("No user ID available");
        throw new Error("User ID is required");
      }
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }
      
      console.log("Profile data fetched:", data);
      return data as Profile;
    },
    retry: 2,
    retryDelay: 1000,
    // Enable the query only when we've checked the session and either we're in preview mode or authenticated with a userId
    enabled: sessionChecked && (usePreviewData || (isAuthenticated && !!userId)),
  });

  return { profile, isLoading, isError, error };
};
