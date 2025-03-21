
import { supabase } from "@/integrations/supabase/client";
import { SavedList, SelectedUnit } from "@/types/army";

// Function to fetch saved lists by WAB ID
export const fetchListsByWabId = async (wabId: string): Promise<SavedList[]> => {
  try {
    console.log("Utility: Fetching profile by WAB ID:", wabId);
    
    // First, get the user profile by WAB ID
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('wab_id', wabId)
      .single();
    
    if (profileError) {
      console.error("Utility: Error fetching profile by WAB ID:", profileError);
      return [];
    }
    
    if (!profileData?.id) {
      console.log("Utility: No profile found with WAB ID:", wabId);
      return [];
    }
    
    console.log("Utility: Found profile with ID:", profileData.id);
    
    // Then fetch the lists using the profile ID
    return await fetchSavedLists(profileData.id);
  } catch (err) {
    console.error("Utility: Error in fetchListsByWabId:", err);
    return [];
  }
};

// Function to fetch saved lists by user ID
export const fetchSavedLists = async (userId: string): Promise<SavedList[]> => {
  try {
    console.log("Utility: Fetching saved lists for user ID:", userId);
    const { data, error } = await supabase
      .from('army_lists')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      console.error("Utility: Error fetching saved lists:", error);
      return [];
    }
    
    console.log("Utility: Raw data from Supabase:", data);
    
    // Convert the database response to SavedList[] type
    if (data && data.length > 0) {
      const typedLists: SavedList[] = data.map(item => {
        // Ensure units is properly typed as SelectedUnit[]
        let typedUnits: SelectedUnit[] = [];
        if (Array.isArray(item.units)) {
          typedUnits = item.units.map((unit: any) => ({
            id: unit.id || `unit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: unit.name || 'Unknown Unit',
            pointsCost: unit.pointsCost || 0,
            quantity: unit.quantity || 1,
            faction: unit.faction || item.faction,
            keywords: Array.isArray(unit.keywords) ? unit.keywords : [],
            highCommand: !!unit.highCommand,
            availability: unit.availability || 1,
            specialRules: Array.isArray(unit.specialRules) ? unit.specialRules : []
          }));
        }
        
        return {
          id: item.id,
          name: item.name,
          faction: item.faction,
          units: typedUnits,
          user_id: item.user_id,
          created_at: item.created_at
        };
      });
      
      console.log("Utility: Processed typed lists:", typedLists);
      return typedLists;
    } else {
      console.log("Utility: No saved lists found for user:", userId);
      return [];
    }
  } catch (err) {
    console.error("Utility: Error in fetchSavedLists:", err);
    return [];
  }
};
