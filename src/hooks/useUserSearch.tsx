
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SearchResult {
  id: string;
  username: string | null;
  wab_id: string | null;
  avatar_url: string | null;
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
      // Search by WAB ID or username
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, wab_id, avatar_url")
        .or(`wab_id.ilike.%${query}%,username.ilike.%${query}%`)
        .limit(10);
      
      if (error) throw error;
      
      setSearchResults(data || []);
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
