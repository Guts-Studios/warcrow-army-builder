
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
  const { data: profile, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      console.log("Fetching profile data for user ID:", userId, "usePreviewData:", usePreviewData);
      
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
          social_instagram: "@previewIG",
          social_youtube: "@previewYT",
          social_twitch: "previewTwitch",
          avatar_url: "/art/portrait/nuada_portrait.jpg",
          wab_id: "WAB-PREV-MODE-DEMO",
          games_won: 5,
          games_lost: 2,
          tester: true
        } as Profile;
      }
      
      // For an actual fetch, we need a real UUID that's not the preview ID
      if (!userId || userId === "preview-user-id") {
        console.log("No valid user ID available for database query");
        throw new Error("Valid user ID is required for database query");
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
      
      // Log the WAB ID specifically to verify it's present in the data
      console.log("Profile data fetched with WAB ID:", data?.wab_id);
      
      if (!data?.wab_id) {
        console.warn("No WAB ID found in profile data. This may indicate a database issue.");
      }
      
      return {
        id: data.id,
        username: data.username,
        bio: data.bio,
        location: data.location,
        favorite_faction: data.favorite_faction,
        social_discord: data.social_discord,
        social_twitter: data.social_twitter,
        social_instagram: data.social_instagram,
        social_youtube: data.social_youtube,
        social_twitch: data.social_twitch,
        avatar_url: data.avatar_url,
        wab_id: data.wab_id,
        games_won: data.games_won,
        games_lost: data.games_lost,
        tester: data.tester
      } as Profile;
    },
    retry: 2,
    retryDelay: 1000,
    // Enable the query only if:
    // 1. Session is checked AND
    // 2. Either in preview mode OR authenticated with a non-preview user ID
    enabled: sessionChecked && (usePreviewData || (isAuthenticated && !!userId && userId !== "preview-user-id")),
    staleTime: 60000, // Cache profile data for 1 minute
  });

  return { profile, isLoading, isError, error, refetch };
};
