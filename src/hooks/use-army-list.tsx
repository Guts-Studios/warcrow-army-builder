
import { useState, useEffect, useMemo, useCallback } from "react";
import { Unit, SelectedUnit, SavedList } from "@/types/army";
import { useToast } from "@/hooks/use-toast";
import { validateUnitAddition, validateHighCommandAddition } from "@/utils/armyValidation";
import { fetchSavedLists, saveListToStorage } from "@/utils/listManagement";
import { getUpdatedQuantities, updateSelectedUnits } from "@/utils/unitManagement";
import { useAuth } from "@/components/auth/AuthProvider";
import { useArmyBuilderUnits } from "@/hooks/useArmyData";
import { toast } from "sonner";
import { validateFactionUnits, validateKeyUnits } from "@/utils/unitValidation";

export const useArmyList = (selectedFaction: string) => {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [selectedUnits, setSelectedUnits] = useState<SelectedUnit[]>([]);
  const [listName, setListName] = useState("");
  const [currentListName, setCurrentListName] = useState<string | null>(null);
  const [savedLists, setSavedLists] = useState<SavedList[]>([]);
  const [showHighCommandAlert, setShowHighCommandAlert] = useState(false);
  const { toast: toastHook } = useToast();
  const { isAuthenticated, isGuest } = useAuth();
  const [isLoadingLists, setIsLoadingLists] = useState(false);

  // Use react-query hook to fetch faction units with proper loading/error states
  const { 
    data: factionUnits = [], 
    isLoading: unitsLoading, 
    error: unitsError,
    isError: isUnitsError,
    refetch: refetchUnits
  } = useArmyBuilderUnits(selectedFaction);

  // Debug logging for unit loading
  useEffect(() => {
    console.log(`[useArmyList] Faction: ${selectedFaction}, Units loaded: ${factionUnits.length}, Loading: ${unitsLoading}`);
    if (factionUnits.length > 0) {
      console.log(`[useArmyList] First 3 units:`, factionUnits.slice(0, 3).map(u => ({ id: u.id, name: u.name })));
    }
  }, [factionUnits, unitsLoading, selectedFaction]);

  // Validate faction units and log any issues
  useEffect(() => {
    if (!unitsLoading && !isUnitsError && factionUnits.length > 0) {
      const validation = validateFactionUnits(factionUnits, selectedFaction);
      
      if (validation.missingUnits.length > 0) {
        console.warn(`[useArmyList] Missing key units for ${selectedFaction}:`, validation.missingUnits);
      }
      
      // Use new validation function for key units
      const keyUnitValidation = validateKeyUnits(factionUnits);
      if (keyUnitValidation.issues.length > 0) {
        console.warn(`[useArmyList] Issues with key units:`, keyUnitValidation.issues);
      }
    }
  }, [factionUnits, unitsLoading, isUnitsError, selectedFaction]);

  // Show toast if units fail to load
  useEffect(() => {
    if (isUnitsError && unitsError) {
      console.error('[useArmyList] Error loading units:', unitsError);
      toast.error("Failed to load units. Using fallback data.");
    }
  }, [isUnitsError, unitsError]);

  // Fetch saved lists on mount and when auth state changes
  useEffect(() => {
    const loadSavedLists = async () => {
      setIsLoadingLists(true);
      try {
        console.log("Fetching saved lists with auth state:", { isAuthenticated, isGuest });
        const lists = await fetchSavedLists();
        console.log(`Fetched ${lists.length} saved lists`);
        // Convert the raw database format to SavedList format
        const convertedLists: SavedList[] = lists.map(list => ({
          id: list.id,
          name: list.name,
          faction: list.faction,
          units: Array.isArray(list.units) ? list.units as SelectedUnit[] : [],
          user_id: list.user_id || undefined,
          created_at: list.created_at,
          wab_id: list.wab_id || undefined
        }));
        setSavedLists(convertedLists);
      } catch (error) {
        console.error('[useArmyList] Error fetching saved lists:', error);
      } finally {
        setIsLoadingLists(false);
      }
    };
    loadSavedLists();
  }, [isAuthenticated, isGuest]);

  // Clear state when faction changes
  useEffect(() => {
    console.log(`[useArmyList] Faction changed to: ${selectedFaction}, clearing state`);
    setQuantities({});
    setSelectedUnits([]);
    setCurrentListName(null);
  }, [selectedFaction]);

  const handleAdd = useCallback(
    (unitId: string) => {
      console.log(`[useArmyList] Adding unit: ${unitId}`);
      const unit = factionUnits.find((u) => u.id === unitId);
      if (!unit) {
        console.warn(`[useArmyList] Unit ${unitId} not found in factionUnits`);
        toast.error(`Unit not found: ${unitId}`);
        return;
      }

      if (!validateUnitAddition(selectedUnits, unit, selectedFaction)) {
        toast.error(`Cannot add more ${unit.name} to your list.`);
        return;
      }

      if (!validateHighCommandAddition(selectedUnits, unit)) {
        setShowHighCommandAlert(true);
        return;
      }

      const newQuantities = getUpdatedQuantities(unitId, quantities, true);
      const updatedSelectedUnits = updateSelectedUnits(selectedUnits, unit, true);
      
      console.log(`[useArmyList] Unit added successfully. New quantity: ${newQuantities[unitId]}, Total units: ${updatedSelectedUnits.length}`);
      
      setQuantities(newQuantities);
      setSelectedUnits(updatedSelectedUnits);
    },
    [factionUnits, quantities, selectedUnits, selectedFaction]
  );

  const handleRemove = useCallback((unitId: string) => {
    console.log(`[useArmyList] Removing unit: ${unitId}`);
    const unit = factionUnits.find((u) => u.id === unitId);
    const newQuantities = getUpdatedQuantities(unitId, quantities, false);
    const updatedSelectedUnits = updateSelectedUnits(selectedUnits, unit, false);
    
    console.log(`[useArmyList] Unit removed. New quantity: ${newQuantities[unitId] || 0}, Total units: ${updatedSelectedUnits.length}`);
    
    setQuantities(newQuantities);
    setSelectedUnits(updatedSelectedUnits);
  }, [factionUnits, quantities, selectedUnits]);

  const handleNewList = useCallback(() => {
    console.log("[useArmyList] Creating new list");
    setQuantities({});
    setSelectedUnits([]);
    setListName("");
    setCurrentListName(null);
    toast.success("New list created");
  }, []);

  const handleSaveList = useCallback(() => {
    const nameToUse = currentListName || listName;
    console.log(`[useArmyList] Saving list: ${nameToUse}`);

    if (!nameToUse || !nameToUse.trim()) {
      toast.error("Please enter a name for your list before saving");
      return;
    }

    if (nameToUse.toLowerCase() === "new list" || nameToUse.toLowerCase() === "new army list") {
      toast.error("Please choose a different name for your list");
      return;
    }

    if (selectedUnits.length === 0) {
      toast.error("Cannot save an empty list. Add some units first.");
      return;
    }

    try {
      const validatedUnits = selectedUnits.map((unit) => ({
        ...unit,
        quantity: Math.min(unit.quantity, unit.availability),
      }));

      const newList = saveListToStorage(nameToUse, selectedFaction, validatedUnits);
      
      // Update saved lists state
      const filteredLists = savedLists.filter((list) => list.name !== nameToUse);
      const updatedLists = [...filteredLists, newList];
      setSavedLists(updatedLists);
      
      setCurrentListName(nameToUse);
      setListName("");

      console.log(`[useArmyList] List saved successfully: ${nameToUse} with ${validatedUnits.length} units`);
      toast.success("Army list saved successfully");
    } catch (error) {
      console.error("[useArmyList] Error saving list:", error);
      toast.error("Failed to save list");
    }
  }, [currentListName, listName, selectedFaction, selectedUnits, savedLists]);

  const handleLoadList = useCallback((list: SavedList) => {
    console.log(`[useArmyList] Loading list: ${list.name} with ${list.units.length} units`);
    
    const validatedUnits = list.units.map((unit) => ({
      ...unit,
      quantity: Math.min(unit.quantity, unit.availability),
    }));

    const newQuantities: Record<string, number> = {};
    validatedUnits.forEach((unit) => {
      newQuantities[unit.id] = unit.quantity;
    });

    setSelectedUnits(validatedUnits);
    setQuantities(newQuantities);
    setCurrentListName(list.name);
    setListName(list.name);

    console.log(`[useArmyList] List loaded successfully: ${list.name}`);
    toast.success(`Loaded army list: ${list.name}`);
  }, []);

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
    unitsLoading,
    unitsError,
    isLoadingLists,
    refetchUnits
  };
};
