
import { SavedList, SelectedUnit } from "@/types/army";
import { supabase } from "@/integrations/supabase/client";
import { fetchListsByWabId } from "./profileUtils";
import { toast } from "sonner";

export const fetchSavedLists = async (wabId?: string) => {
  const startTime = Date.now();
  console.log("Starting fetchSavedLists", { withWabId: !!wabId, timestamp: new Date().toISOString() });
  
  // Get local lists first for immediate display
  let localLists: SavedList[] = [];
  try {
    const localListsJson = localStorage.getItem("armyLists");
    if (localListsJson) {
      // Parse local lists and ensure they don't have user_id for proper display
      const parsedLists = JSON.parse(localListsJson);
      localLists = parsedLists.map((list: SavedList) => {
        // If it doesn't have user_id, keep as is
        if (!list.user_id) return list;
        
        // Otherwise, strip out the user_id to ensure it shows as local
        const { user_id, ...listWithoutUserId } = list;
        return listWithoutUserId as SavedList;
      });
      
      console.log(`Found ${localLists.length} local lists`);
    } else {
      console.log("No local lists found in localStorage");
      // Initialize empty array in localStorage if it doesn't exist
      localStorage.setItem("armyLists", JSON.stringify([]));
    }
  } catch (error) {
    console.error("Error parsing local lists:", error);
    toast.error("Error loading your local lists");
    // Initialize empty array in localStorage if there was an error
    localStorage.setItem("armyLists", JSON.stringify([]));
    localLists = [];
  }

  try {
    let cloudLists: SavedList[] = [];
    
    // Get current user session
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData?.session;
    const isAuthenticated = !!session?.user;
    
    console.log("Auth state:", { 
      isAuthenticated, 
      userId: session?.user?.id, 
      wabIdProvided: !!wabId 
    });
    
    // If user is authenticated, fetch their lists first
    if (isAuthenticated) {
      console.log("Fetching cloud lists for authenticated user:", session.user.id);
      
      try {
        const { data, error } = await supabase
          .from("army_lists")
          .select("*")
          .eq("user_id", session.user.id);
          
        if (error) {
          console.error("Error fetching cloud lists by user ID:", error);
          toast.error("Error loading your cloud lists");
        } else if (data && Array.isArray(data)) {
          console.log("Found cloud lists by user ID:", data.length);
          cloudLists = data.map((list: any) => ({
            id: list.id,
            name: list.name,
            faction: list.faction,
            units: list.units,
            user_id: list.user_id,
            created_at: list.created_at,
            wab_id: list.wab_id
          }));
        }
      } catch (fetchError) {
        console.error("Error in authenticated lists fetch:", fetchError);
      }
    }
    
    // If a WAB ID is provided and different from the user's ID, fetch additional lists
    if (wabId && (!isAuthenticated || wabId !== session?.user?.id)) {
      try {
        console.log("Fetching additional cloud lists by WAB ID:", wabId);
        const wabLists = await fetchListsByWabId(wabId);
        
        if (Array.isArray(wabLists)) {
          // Only add WAB lists that aren't already in the user's lists
          const existingIds = new Set(cloudLists.map(list => list.id));
          const newWabLists = wabLists.filter(list => !existingIds.has(list.id));
          
          cloudLists = [...cloudLists, ...newWabLists];
          console.log("Found additional cloud lists by WAB ID:", newWabLists.length);
        } else {
          console.error("fetchListsByWabId did not return an array:", wabLists);
        }
      } catch (wabError) {
        console.error("Error fetching WAB ID lists:", wabError);
      }
    }

    const combinedLists = [...localLists, ...cloudLists];
    console.log("Combined list count:", combinedLists.length, "Time taken:", Date.now() - startTime, "ms");
    return combinedLists;
  } catch (error) {
    console.error("Error in fetchSavedLists:", error);
    toast.error("Error loading saved lists");
    return localLists;
  }
};

export const saveListToStorage = (
  nameToUse: string,
  selectedFaction: string,
  validatedUnits: SelectedUnit[]
): SavedList => {
  // Create a new list object with explicitly no user_id property
  const newList: SavedList = {
    id: crypto.randomUUID(),
    name: nameToUse,
    faction: selectedFaction,
    units: validatedUnits,
    created_at: new Date().toISOString()
    // Explicitly omit user_id to ensure it's not present
  };

  try {
    // Update localStorage with the new list
    const existingListsJson = localStorage.getItem("armyLists");
    let existingLists = existingListsJson ? JSON.parse(existingListsJson) : [];
    
    // Clean any existing lists to ensure they don't have user_id property
    existingLists = existingLists.map((list: SavedList) => {
      if (!list.user_id) return list;
      
      // Remove user_id if it exists for local list
      const { user_id, ...listWithoutUserId } = list;
      return listWithoutUserId;
    });
    
    // Remove any existing list with the same name and faction
    const filteredLists = existingLists.filter((list: SavedList) => 
      !(list.name === nameToUse && list.faction === selectedFaction)
    );
    
    // Add the new list
    const updatedLists = [...filteredLists, newList];
    
    // Save to localStorage
    localStorage.setItem("armyLists", JSON.stringify(updatedLists));
    console.log(`List saved to local storage: ${nameToUse} (${selectedFaction})`);
  } catch (error) {
    console.error("Error saving list to storage:", error);
    toast.error("Failed to save list locally");
  }

  return newList;
};
