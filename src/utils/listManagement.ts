
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
      const parsedLists = JSON.parse(localListsJson);
      localLists = Array.isArray(parsedLists) ? parsedLists.map((list: SavedList) => {
        // Ensure local lists don't have user_id
        if (!list.user_id) return list;
        
        const { user_id, ...listWithoutUserId } = list;
        return listWithoutUserId as SavedList;
      }) : [];
      
      console.log(`Found ${localLists.length} local lists`);
    } else {
      console.log("No local lists found, initializing empty array");
      localStorage.setItem("armyLists", JSON.stringify([]));
    }
  } catch (error) {
    console.error("Error parsing local lists:", error);
    toast.error("Error loading your local lists");
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
    
    // If user is authenticated, fetch their lists
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
            units: Array.isArray(list.units) ? list.units : [],
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
          const existingIds = new Set(cloudLists.map(list => list.id));
          const newWabLists = wabLists.filter(list => !existingIds.has(list.id));
          
          cloudLists = [...cloudLists, ...newWabLists];
          console.log("Found additional cloud lists by WAB ID:", newWabLists.length);
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
  console.log(`[saveListToStorage] Saving list: ${nameToUse} for faction: ${selectedFaction} with ${validatedUnits.length} units`);
  
  // Validate inputs
  if (!nameToUse || !nameToUse.trim()) {
    throw new Error("List name is required");
  }
  
  if (!selectedFaction) {
    throw new Error("Faction is required");
  }
  
  if (!Array.isArray(validatedUnits)) {
    throw new Error("Units must be an array");
  }

  // Create a new list object with explicitly no user_id property
  const newList: SavedList = {
    id: crypto.randomUUID(),
    name: nameToUse.trim(),
    faction: selectedFaction,
    units: validatedUnits,
    created_at: new Date().toISOString()
    // Explicitly omit user_id to ensure it's not present
  };

  try {
    // Update localStorage with the new list
    const existingListsJson = localStorage.getItem("armyLists");
    let existingLists = existingListsJson ? JSON.parse(existingListsJson) : [];
    
    // Ensure existing lists is an array
    if (!Array.isArray(existingLists)) {
      console.warn("[saveListToStorage] Existing lists was not an array, resetting to empty array");
      existingLists = [];
    }
    
    // Clean any existing lists to ensure they don't have user_id property
    existingLists = existingLists.map((list: SavedList) => {
      if (!list.user_id) return list;
      
      // Remove user_id if it exists for local list
      const { user_id, ...listWithoutUserId } = list;
      return listWithoutUserId;
    });
    
    // Remove any existing list with the same name and faction
    const filteredLists = existingLists.filter((list: SavedList) => 
      !(list.name === nameToUse.trim() && list.faction === selectedFaction)
    );
    
    // Add the new list
    const updatedLists = [...filteredLists, newList];
    
    // Save to localStorage
    localStorage.setItem("armyLists", JSON.stringify(updatedLists));
    console.log(`[saveListToStorage] Successfully saved list to localStorage: ${nameToUse} (${selectedFaction})`);
  } catch (error) {
    console.error("Error saving list to storage:", error);
    toast.error("Failed to save list locally");
    throw error;
  }

  return newList;
};
