
import { SavedList, SelectedUnit } from "@/types/army";
import { supabase } from "@/integrations/supabase/client";
import { fetchListsByWabId } from "./profileUtils";

export const fetchSavedLists = async (wabId?: string) => {
  const startTime = Date.now();
  console.log("Starting fetchSavedLists", { withWabId: !!wabId, timestamp: new Date().toISOString() });
  
  // Get local lists
  let localLists: SavedList[] = [];
  try {
    const localListsJson = localStorage.getItem("armyLists");
    localLists = localListsJson ? JSON.parse(localListsJson) : [];
    console.log(`Found ${localLists.length} local lists`);
  } catch (error) {
    console.error("Error parsing local lists:", error);
  }

  try {
    let cloudLists: SavedList[] = [];
    
    // If a WAB ID is provided, fetch lists by that WAB ID
    if (wabId) {
      console.log("Fetching cloud lists by WAB ID:", wabId);
      cloudLists = await fetchListsByWabId(wabId);
      console.log("Found cloud lists by WAB ID:", cloudLists.length);
    } else {
      // Otherwise, try to get the current user's lists
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log("User is authenticated, fetching their lists");
        const { data, error } = await supabase
          .from("army_lists")
          .select("*")
          .eq("user_id", session.user.id);
          
        if (error) {
          console.error("Error fetching cloud lists by user ID:", error);
        } else if (data) {
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
      } else {
        console.log("User is not authenticated, not fetching cloud lists");
      }
    }

    const combinedLists = [...localLists, ...cloudLists];
    console.log("Combined list count:", combinedLists.length, "Time taken:", Date.now() - startTime, "ms");
    return combinedLists;
  } catch (error) {
    console.error("Error in fetchSavedLists:", error);
    return localLists;
  }
};

export const saveListToStorage = (
  nameToUse: string,
  selectedFaction: string,
  validatedUnits: SelectedUnit[]
): SavedList => {
  const newList: SavedList = {
    id: Date.now().toString(),
    name: nameToUse,
    faction: selectedFaction,
    units: validatedUnits,
    created_at: new Date().toISOString(),
  };

  return newList;
};
