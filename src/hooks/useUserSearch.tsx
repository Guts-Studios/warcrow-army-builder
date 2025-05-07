
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SearchResult {
  id: string;
  username: string | null;
  wab_id: string | null;
  avatar_url: string | null;
  banned?: boolean;
  deactivated?: boolean;
}

export const useUserSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // First try to search by WAB ID or username
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, username, wab_id, avatar_url, banned, deactivated")
        .or(`wab_id.ilike.%${query}%,username.ilike.%${query}%`)
        .limit(10);
      
      if (profileError) throw profileError;
      
      // If no results found, try to search by email
      if ((!profileData || profileData.length === 0) && query.includes('@')) {
        try {
          // Use the function to get user by email
          const { data: emailData, error: emailError } = await supabase
            .rpc('get_user_email', { user_id: query });
            
          if (emailError) {
            console.error("Email search error:", emailError);
            // If this fails, just return profile data (which might be empty)
            setSearchResults(profileData || []);
            return;
          }
          
          if (emailData) {
            // We need to modify this part to correctly handle the email search
            // First, use auth.users to find the user with this email
            const { data: authUserData, error: authUserError } = await supabase
              .from("auth.users")
              .select("id")
              .eq("email", query)
              .single();

            if (authUserError) {
              console.error("Auth user search error:", authUserError);
              setSearchResults(profileData || []);
              return;
            }

            if (authUserData) {
              // Then get the profile for this user
              const { data: userProfile } = await supabase
                .from("profiles")
                .select("id, username, wab_id, avatar_url, banned, deactivated")
                .eq("id", authUserData.id)
                .limit(1)
                .single();
                
              setSearchResults(userProfile ? [userProfile] : []);
              return;
            }
          }
        } catch (emailSearchError: unknown) {
          if (emailSearchError instanceof Error) {
            console.error("Email search error:", emailSearchError.message);
          } else {
            console.error("Email search error:", emailSearchError);
          }
          // If this fails, just return profile data
        }

        // As a fallback, try to directly query profiles that might match the email pattern
        try {
          const { data: emailProfileData, error: emailProfileError } = await supabase
            .from("profiles")
            .select("id, username, wab_id, avatar_url, banned, deactivated")
            .eq("id", query)
            .limit(10);
          
          if (!emailProfileError && emailProfileData && emailProfileData.length > 0) {
            setSearchResults(emailProfileData);
            return;
          }
        } catch (directSearchError: unknown) {
          if (directSearchError instanceof Error) {
            console.error("Direct email search error:", directSearchError.message);
          } else {
            console.error("Direct email search error:", directSearchError);
          }
        }
      }
      
      setSearchResults(profileData || []);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error searching users:", error.message);
      } else {
        console.error("Error searching users:", error);
      }
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    searchUsers
  };
};
