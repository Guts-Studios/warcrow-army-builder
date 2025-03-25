
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/profile";

interface UseProfileFetchProps {
  isAuthenticated: boolean;
  usePreviewData: boolean;
  userId?: string;
}

export const useProfileFetch = ({ isAuthenticated, usePreviewData, userId }: UseProfileFetchProps) => {
  const { data: profile, isLoading, isError, error } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      console.log("Fetching profile data");
      
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
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log("No session found");
        throw new Error("Not authenticated");
      }

      console.log("User ID:", session.user.id);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }
      
      console.log("Profile data:", data);
      return data as Profile;
    },
    retry: 1,
    enabled: usePreviewData || isAuthenticated,
  });

  return { profile, isLoading, isError, error };
};
