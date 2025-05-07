
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
          // Use the function to get user by email - this requires admin privileges
          const { data: emailData, error: emailError } = await supabase
            .rpc('get_user_by_email', { email_query: query });
            
          if (emailError) {
            console.error("Email search error:", emailError);
            // If this fails, just return profile data (which might be empty)
            setSearchResults(profileData || []);
            return;
          }
          
          if (emailData && emailData.id) {
            // Get the profile for this user
            const { data: userProfile } = await supabase
              .from("profiles")
              .select("id, username, wab_id, avatar_url, banned, deactivated")
              .eq("id", emailData.id)
              .limit(1)
              .single();
              
            setSearchResults(userProfile ? [userProfile] : []);
            return;
          }
        } catch (emailSearchError) {
          console.error("Email search error:", emailSearchError);
          // If this fails, just return profile data
        }
      }
      
      setSearchResults(profileData || []);
    } catch (error) {
      console.error("Error searching users:", error);
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
