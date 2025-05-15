
import { useState, useEffect, useCallback } from "react";
import { SelectedUnit, SavedList } from "@/types/army";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getUpdatedQuantities, updateSelectedUnits } from "@/utils/unitManagement";
import { validateUnitAddition } from "@/utils/armyValidation";
import { useArmyBuilderUnits } from '@/components/stats/unit-explorer/useUnitData';

export const useArmyList = (selectedFaction: string) => {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [selectedUnits, setSelectedUnits] = useState<SelectedUnit[]>([]);
  const [currentListName, setCurrentListName] = useState<string>("New Army List");
  const [listName, setListName] = useState<string>("");
  const [savedLists, setSavedLists] = useState<SavedList[]>([]);
  const [showHighCommandAlert, setShowHighCommandAlert] = useState(false);
  
  // Use our new hook that filters out hidden units
  const { data: factionUnits = [], isLoading: unitsLoading } = useArmyBuilderUnits(selectedFaction);

  // Load saved lists for the current faction
  const fetchSavedLists = useCallback(async () => {
    const { data: userData } = await supabase.auth.getUser();
    
    if (userData?.user) {
      const { data } = await supabase
        .from('army_lists')
        .select('*')
        .eq('faction', selectedFaction)
        .eq('user_id', userData.user.id)
        .order('updated_at', { ascending: false });
      
      setSavedLists(data || []);
    } else {
      // If user is not logged in, check local storage
      const localLists = JSON.parse(localStorage.getItem('savedLists') || '[]');
      setSavedLists(localLists.filter((list: SavedList) => list.faction === selectedFaction));
    }
  }, [selectedFaction]);

  // Load saved lists on faction change
  useEffect(() => {
    fetchSavedLists();
    // Clear current selections when faction changes
    setQuantities({});
    setSelectedUnits([]);
    setCurrentListName("New Army List");
  }, [selectedFaction, fetchSavedLists]);

  const handleAdd = (unitId: string) => {
    const unit = factionUnits.find((u) => u.id === unitId);
    if (!unit) return;

    // Convert unit keywords from string[] to Keyword[] format required by the army builder
    const processedUnit = {
      ...unit,
      faction: unit.faction,
      pointsCost: unit.points,
      availability: unit.characteristics?.availability || 0,
      command: unit.characteristics?.command || 0,
      highCommand: unit.characteristics?.highCommand || false,
      keywords: unit.keywords.map(k => ({ name: k })),
    };

    // Perform validation 
    const canAdd = validateUnitAddition(
      selectedUnits, 
      processedUnit, 
      selectedFaction
    );

    if (!canAdd) {
      if (processedUnit.highCommand && selectedUnits.some(u => u.highCommand)) {
        setShowHighCommandAlert(true);
      }
      return;
    }

    // Update quantities and selected units
    const newQuantities = getUpdatedQuantities(unitId, quantities, true);
    setQuantities(newQuantities);

    const updatedSelectedUnits = updateSelectedUnits(
      selectedUnits,
      processedUnit,
      true
    );
    setSelectedUnits(updatedSelectedUnits);
  };

  const handleRemove = (unitId: string) => {
    const unit = factionUnits.find((u) => u.id === unitId);
    if (!unit) return;

    // Convert unit keywords from string[] to Keyword[] format required by the army builder  
    const processedUnit = {
      ...unit,
      faction: unit.faction,
      pointsCost: unit.points,
      availability: unit.characteristics?.availability || 0,
      command: unit.characteristics?.command || 0,
      highCommand: unit.characteristics?.highCommand || false,
      keywords: unit.keywords.map(k => ({ name: k })),
    };

    // Update quantities and selected units
    const newQuantities = getUpdatedQuantities(unitId, quantities, false);
    setQuantities(newQuantities);

    const updatedSelectedUnits = updateSelectedUnits(
      selectedUnits,
      processedUnit,
      false
    );
    setSelectedUnits(updatedSelectedUnits);
  };

  const handleNewList = () => {
    setQuantities({});
    setSelectedUnits([]);
    setCurrentListName("New Army List");
  };

  const handleSaveList = async () => {
    if (listName.trim() === "") {
      toast.error("Please enter a name for your list");
      return;
    }

    const { data: userData } = await supabase.auth.getUser();
    const listToSave: SavedList = {
      id: crypto.randomUUID(),
      name: listName,
      faction: selectedFaction,
      units: selectedUnits,
      created_at: new Date().toISOString(),
      user_id: userData?.user?.id
    };

    try {
      if (userData?.user) {
        // Save to Supabase if user is logged in
        const { error } = await supabase
          .from('army_lists')
          .insert({
            name: listName,
            faction: selectedFaction,
            units: selectedUnits,
            user_id: userData.user.id
          });

        if (error) throw error;
      } else {
        // Save to local storage if not logged in
        const existingLists = JSON.parse(localStorage.getItem('savedLists') || '[]');
        const updatedLists = [...existingLists, listToSave];
        localStorage.setItem('savedLists', JSON.stringify(updatedLists));
      }

      setCurrentListName(listName);
      toast.success("List saved successfully");
      fetchSavedLists();
    } catch (error: any) {
      console.error("Error saving list:", error);
      toast.error(`Error saving list: ${error.message}`);
    }
  };

  const handleLoadList = (list: SavedList) => {
    setCurrentListName(list.name);
    setSelectedUnits(list.units);
    
    // Rebuild quantities from the selected units
    const newQuantities: Record<string, number> = {};
    list.units.forEach(unit => {
      newQuantities[unit.id] = unit.quantity;
    });
    setQuantities(newQuantities);
  };

  return {
    quantities,
    selectedUnits,
    listName,
    currentListName,
    savedLists,
    showHighCommandAlert,
    setShowHighCommandAlert,
    setListName,
    handleAdd,
    handleRemove,
    handleNewList,
    handleSaveList,
    handleLoadList,
    factionUnits,
    unitsLoading
  };
};
