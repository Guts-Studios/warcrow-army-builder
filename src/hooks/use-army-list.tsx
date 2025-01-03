import { useState, useEffect, useMemo, useCallback } from "react";
import { Unit, SelectedUnit, SavedList } from "@/types/army";
import { useToast } from "@/hooks/use-toast";
import { validateHighCommandAddition } from "@/utils/armyValidation";
import { units } from "@/data/factions";
import { supabase } from "@/integrations/supabase/client";

export const useArmyList = (selectedFaction: string) => {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [selectedUnits, setSelectedUnits] = useState<SelectedUnit[]>([]);
  const [listName, setListName] = useState("");
  const [currentListName, setCurrentListName] = useState<string | null>(null);
  const [savedLists, setSavedLists] = useState<SavedList[]>([]);
  const [showHighCommandAlert, setShowHighCommandAlert] = useState(false);
  const { toast } = useToast();

  // Filter units by the selected faction
  const factionUnits = useMemo(
    () => units.filter((unit) => unit.faction === selectedFaction),
    [selectedFaction]
  );

  // Fetch saved lists from local storage and cloud (Supabase)
  useEffect(() => {
    const fetchSavedLists = async () => {
      const localLists = localStorage.getItem("armyLists");
      const parsedLocalLists: SavedList[] = localLists ? JSON.parse(localLists) : [];

      const { data: cloudLists, error } = await supabase
        .from("army_lists")
        .select("*");

      if (error) {
        console.error("Error fetching cloud lists:", error);
        setSavedLists(parsedLocalLists);
        return;
      }

      const allLists = [
        ...parsedLocalLists,
        ...(cloudLists || []).map((list: any) => ({
          id: list.id,
          name: list.name,
          faction: list.faction,
          units: list.units,
          user_id: list.user_id,
        })),
      ];

      setSavedLists(allLists);
    };

    fetchSavedLists();
  }, []);

  // Add a unit to the selectedUnits list
  const handleAdd = useCallback(
    (unitId: string) => {
      const unit = factionUnits.find((u) => u.id === unitId);
      if (!unit) return;

      const currentQuantity = quantities[unitId] || 0;

      // Log current state for debugging
      console.log("Adding unit:", unit); // Log the unit being added
      console.log("Current quantity:", currentQuantity); // Log the current quantity in the list
      console.log("Unit availability:", unit.availability); // Log the unit's availability limit

      // Check if adding another unit would exceed availability
      if (currentQuantity >= unit.availability) {
        toast({
          title: "Unit Limit Reached",
          description: `You cannot add more than ${unit.availability} ${unit.name} to your list.`,
          variant: "destructive",
        });
        return;
      }

      if (!validateHighCommandAddition(selectedUnits, unit)) {
        setShowHighCommandAlert(true);
        return;
      }

      // Update quantities while ensuring they are constrained to single digits
      setQuantities((prev) => ({
        ...prev,
        [unitId]: Math.min(currentQuantity + 1, 9), // Ensure quantity is no greater than 9
      }));

      // Update selected units
      setSelectedUnits((prev) => {
        const existingUnit = prev.find((u) => u.id === unitId);
        if (existingUnit) {
          return prev.map((u) =>
            u.id === unitId
              ? { ...u, quantity: Math.min(u.quantity + 1, 9) } // Constrain quantity to 9
              : u
          );
        }
        return [...prev, { ...unit, quantity: 1 }]; // Add new unit with quantity of 1
      });
    },
    [factionUnits, quantities, selectedUnits, toast]
  );

  // Remove a unit from the selectedUnits list
  const handleRemove = useCallback((unitId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [unitId]: Math.max((prev[unitId] || 0) - 1, 0), // Ensure quantity doesn't go below 0
    }));

    setSelectedUnits((prev) => {
      const updatedUnits = prev.map((u) =>
        u.id === unitId ? { ...u, quantity: u.quantity - 1 } : u
      );
      return updatedUnits.filter((u) => u.quantity > 0); // Remove units with quantity 0
    });
  }, []);

  // Format the display string with logging for debugging
  const formatDisplayString = (unit) => {
    const displayString = `${unit.name} x${Math.min(parseInt(unit.quantity, 10), 9)}`;
    console.log("Formatted display string:", displayString); // Log the formatted string
    return displayString;
  };

  // Start a new list
  const handleNewList = useCallback(() => {
    setQuantities({});
    setSelectedUnits([]);
    setListName("");
    setCurrentListName(null);
    toast({
      title: "New List Created",
      description: "Started a new empty list",
    });
  }, [toast]);

  // Save the current list
  const handleSaveList = useCallback(() => {
    const nameToUse = currentListName || listName;

    if (!nameToUse.trim() || nameToUse === "New List") {
      toast({
        title: "Enter List Name",
        description: "Please enter a name for your list before saving",
        variant: "destructive",
      });
      return;
    }

    // Validate and cap quantities at availability
    const validatedUnits = selectedUnits.map((unit) => ({
      ...unit,
      quantity: Math.min(unit.quantity, unit.availability),
    }));

    const filteredLists = savedLists.filter((list) => list.name !== nameToUse);

    const newList: SavedList = {
      id: Date.now().toString(),
      name: nameToUse,
      faction: selectedFaction,
      units: validatedUnits,
    };

    const updatedLists = [...filteredLists, newList];
    setSavedLists(updatedLists);
    localStorage.setItem("armyLists", JSON.stringify(updatedLists));
    setCurrentListName(nameToUse);

    // Sync quantities with validated units
    const newQuantities: Record<string, number> = {};
    validatedUnits.forEach((unit) => {
      newQuantities[unit.id] = unit.quantity;
    });
    setQuantities(newQuantities);
    setSelectedUnits(validatedUnits);

    toast({
      title: "Success",
      description: "Army list saved successfully",
    });
    setListName("");
  }, [currentListName, listName, selectedFaction, selectedUnits, savedLists, toast]);

  // Load an existing list
  const handleLoadList = useCallback((list: SavedList) => {
    const validatedUnits = list.units.map((unit) => ({
      ...unit,
      quantity: Math.min(unit.quantity, unit.availability), // Ensure valid quantities
    }));

    setSelectedUnits(validatedUnits);

    const newQuantities: Record<string, number> = {};
    validatedUnits.forEach((unit) => {
      newQuantities[unit.id] = unit.quantity;
    });

    setQuantities(newQuantities);
    setCurrentListName(list.name);

    toast({
      title: "Success",
      description: `Loaded army list: ${list.name}`,
    });
  }, [toast]);

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
    formatDisplayString, // Return formatDisplayString for testing/debugging
  };
};
