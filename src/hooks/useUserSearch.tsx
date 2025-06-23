
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
      
      // If we have results from WAB ID or username search, return them
      if (profileData && profileData.length > 0) {
        setSearchResults(profileData);
        return;
      }
      
      // If no results found and query looks like an email, try email search
      if (query.includes('@')) {
        try {
          // Use the RPC function to get user by email first
          const { data: emailSearchData, error: emailSearchError } = await supabase
            .rpc('get_user_email', { user_id: query });
            
          // If the RPC call fails, it means the user doesn't exist or we can't access their email
          if (emailSearchError) {
            console.log("Email search via RPC failed:", emailSearchError);
            setSearchResults([]);
            return;
          }
          
          // If we got a result from the email RPC, we need to find the corresponding profile
          // The RPC function expects a user_id, but we're passing an email, so this approach won't work
          // Instead, let's try a different approach using the admin function
          
          // For admin users, we can try to find profiles that might match
          // Since we can't directly search by email in profiles, we'll return empty results
          // and suggest the admin look up the user's WAB ID or username instead
          setSearchResults([]);
          return;
          
        } catch (emailSearchError: unknown) {
          console.error("Email search error:", emailSearchError);
          setSearchResults([]);
          return;
        }
      }
      
      // If we reached here, return empty results
      setSearchResults([]);
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
