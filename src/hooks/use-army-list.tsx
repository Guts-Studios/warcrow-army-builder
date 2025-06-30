
import { useState, useEffect, useMemo, useCallback } from "react";
import { Unit, SelectedUnit, SavedList } from "@/types/army";
import { useToast } from "@/hooks/use-toast";
import { validateUnitAddition, shouldShowHighCommandWarning } from "@/utils/armyValidation";
import { fetchSavedLists, saveListToStorage } from "@/utils/listManagement";
import { getUpdatedQuantities, updateSelectedUnits } from "@/utils/unitManagement";
import { useAuth } from "@/components/auth/AuthProvider";
import { useArmyBuilderUnits } from "@/hooks/useArmyData";
import { toast } from "sonner";
import { validateFactionUnits, validateKeyUnits } from "@/utils/unitValidation";
import { useQueryClient } from "@tanstack/react-query";

export const useArmyList = (selectedFaction: string) => {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [selectedUnits, setSelectedUnits] = useState<SelectedUnit[]>([]);
  const [listName, setListName] = useState("");
  const [currentListName, setCurrentListName] = useState<string | null>(null);
  const [savedLists, setSavedLists] = useState<SavedList[]>([]);
  const [showHighCommandAlert, setShowHighCommandAlert] = useState(false);
  const { toast: toastHook } = useToast();
  const { isAuthenticated, isGuest, authReady } = useAuth();
  const [isLoadingLists, setIsLoadingLists] = useState(false);
  const queryClient = useQueryClient();

  // Use react-query hook to fetch faction units with proper loading/error states
  // Cache key now includes auth state to prevent cross-contamination
  const { 
    data: factionUnits = [], 
    isLoading: unitsLoading, 
    error: unitsError,
    isError: isUnitsError,
    refetch: refetchUnits
  } = useArmyBuilderUnits(selectedFaction);

  // Invalidate cache when auth state changes to ensure fresh data
  useEffect(() => {
    if (authReady) {
      console.log(`[useArmyList] Auth state ready, invalidating related queries for: ${isAuthenticated ? 'authenticated' : 'guest'}`);
      queryClient.invalidateQueries({ 
        queryKey: ['army-builder-units'] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['saved-lists'] 
      });
    }
  }, [isAuthenticated, authReady, queryClient]);

  // Debug logging for unit loading - specifically check tournament legal status
  useEffect(() => {
    console.log(`[useArmyList] Faction: ${selectedFaction}, Units loaded: ${factionUnits.length}, Loading: ${unitsLoading}, Auth: ${isAuthenticated ? 'authenticated' : 'guest'}`);
    if (factionUnits.length > 0) {
      console.log(`[useArmyList] First 3 units:`, factionUnits.slice(0, 3).map(u => ({ 
        id: u.id, 
        name: u.name, 
        tournamentLegal: u.tournamentLegal,
        tournamentLegalType: typeof u.tournamentLegal
      })));
      
      // Check if any units have tournamentLegal set to false
      const nonTournamentUnits = factionUnits.filter(u => u.tournamentLegal === false || String(u.tournamentLegal) === "false");
      console.log(`[useArmyList] Non-tournament legal units found:`, nonTournamentUnits.length, nonTournamentUnits.map(u => u.name));
    }
  }, [factionUnits, unitsLoading, selectedFaction, isAuthenticated]);

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
        console.log("Fetching saved lists with auth state:", { isAuthenticated, isGuest, authReady });
        const lists = await fetchSavedLists();
        console.log(`Fetched ${lists.length} saved lists for ${isAuthenticated ? 'authenticated' : 'guest'} user`);
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
    
    if (authReady) {
      loadSavedLists();
    }
  }, [isAuthenticated, isGuest, authReady]);

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

      // Log tournament legal status when adding unit
      console.log(`[useArmyList] Adding unit ${unit.name} - tournamentLegal:`, unit.tournamentLegal, typeof unit.tournamentLegal);

      // Check availability limit first
      const existingUnit = selectedUnits.find(u => u.id === unitId);
      const currentQuantity = existingUnit ? existingUnit.quantity : 0;
      
      if (currentQuantity >= unit.availability) {
        toast.error(`Cannot add more ${unit.name} to your list. Maximum ${unit.availability} allowed.`);
        return;
      }

      // Check if we should show high command warning (but don't prevent addition)
      if (shouldShowHighCommandWarning(selectedUnits, unit)) {
        console.log(`[useArmyList] Showing high command warning for ${unit.name}`);
        setShowHighCommandAlert(true);
      }

      // Always add the unit - high command warning is just informational
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
    console.log(`[useArmyList] Saving list locally: ${nameToUse}`);

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
      // Validate and clean the selected units data - preserve tournament legal status
      const validatedUnits = selectedUnits.map((unit) => {
        const cleanUnit: SelectedUnit = {
          id: unit.id,
          name: unit.name,
          name_es: unit.name_es,
          name_fr: unit.name_fr,
          pointsCost: unit.pointsCost,
          quantity: Math.min(unit.quantity, unit.availability),
          faction: unit.faction,
          faction_id: unit.faction_id,
          keywords: Array.isArray(unit.keywords) ? unit.keywords : [],
          highCommand: unit.highCommand || false,
          availability: unit.availability,
          imageUrl: unit.imageUrl,
          specialRules: Array.isArray(unit.specialRules) ? unit.specialRules : [],
          command: unit.command || 0,
          tournamentLegal: unit.tournamentLegal // Explicitly preserve this property
        };
        
        // Log the tournament legal status being saved
        console.log(`[useArmyList] Saving unit ${cleanUnit.name} - tournamentLegal:`, cleanUnit.tournamentLegal);
        
        return cleanUnit;
      });

      console.log(`[useArmyList] Validated units for local save:`, validatedUnits.length);

      // Only save to local storage - no database operations
      const newList = saveListToStorage(nameToUse, selectedFaction, validatedUnits);
      
      // Update saved lists state
      const filteredLists = savedLists.filter((list) => list.name !== nameToUse);
      const updatedLists = [...filteredLists, newList];
      setSavedLists(updatedLists);
      
      setCurrentListName(nameToUse);
      setListName("");

      console.log(`[useArmyList] List saved locally successfully: ${nameToUse} with ${validatedUnits.length} units`);
      toast.success("Army list saved locally");
    } catch (error) {
      console.error("[useArmyList] Error saving list locally:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(`Failed to save list locally: ${errorMessage}`);
    }
  }, [currentListName, listName, selectedFaction, selectedUnits, savedLists]);

  const handleLoadList = useCallback((list: SavedList) => {
    console.log(`[useArmyList] Loading list: ${list.name} with ${list.units.length} units`);
    
    // Log tournament legal status when loading
    list.units.forEach(unit => {
      console.log(`[useArmyList] Loading unit ${unit.name} - tournamentLegal:`, unit.tournamentLegal, typeof unit.tournamentLegal);
    });
    
    const validatedUnits = list.units.map((unit) => ({
      ...unit,
      quantity: Math.min(unit.quantity, unit.availability),
      tournamentLegal: unit.tournamentLegal // Ensure this property is preserved
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
