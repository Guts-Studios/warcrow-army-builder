
import { SavedList, SelectedUnit } from "@/types/army";
import { supabase } from "@/integrations/supabase/client";
import { fetchListsByWabId } from "./profileUtils";

export const fetchSavedLists = async (wabId?: string) => {
  // Get local lists
  const localLists = localStorage.getItem("armyLists");
  const parsedLocalLists: SavedList[] = localLists ? JSON.parse(localLists) : [];

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
      }
    }

    const combinedLists = [...parsedLocalLists, ...cloudLists];
    console.log("Combined list count:", combinedLists.length);
    return combinedLists;
  } catch (error) {
    console.error("Error in fetchSavedLists:", error);
    return parsedLocalLists;
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
