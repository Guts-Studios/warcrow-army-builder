import { SavedList, SelectedUnit } from "@/types/army";
import { supabase } from "@/integrations/supabase/client";

export const fetchSavedLists = async () => {
  const localLists = localStorage.getItem("armyLists");
  const parsedLocalLists: SavedList[] = localLists ? JSON.parse(localLists) : [];

  const { data: cloudLists, error } = await supabase
    .from("army_lists")
    .select("*");

  if (error) {
    console.error("Error fetching cloud lists:", error);
    return parsedLocalLists;
  }

  return [
    ...parsedLocalLists,
    ...(cloudLists || []).map((list: any) => ({
      id: list.id,
      name: list.name,
      faction: list.faction,
      units: list.units,
      user_id: list.user_id,
    })),
  ];
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
  };

  return newList;
};