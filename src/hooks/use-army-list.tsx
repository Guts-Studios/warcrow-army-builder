import { useState, useEffect, useMemo, useCallback } from "react";
import { Unit, SelectedUnit, SavedList } from "@/types/army";
import { useToast } from "@/components/ui/use-toast";
import { validateHighCommandAddition } from "@/utils/armyValidation";
import { units } from "@/data/factions";

export const useArmyList = (selectedFaction: string) => {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [selectedUnits, setSelectedUnits] = useState<SelectedUnit[]>([]);
  const [listName, setListName] = useState("");
  const [currentListName, setCurrentListName] = useState<string | null>(null);
  const [savedLists, setSavedLists] = useState<SavedList[]>([]);
  const [showHighCommandAlert, setShowHighCommandAlert] = useState(false);
  const { toast } = useToast();

  // Memoize faction units to prevent unnecessary filtering
  const factionUnits = useMemo(() => 
    units.filter((unit) => unit.faction === selectedFaction),
    [selectedFaction]
  );

  useEffect(() => {
    const lists = localStorage.getItem("armyLists");
    if (lists) {
      setSavedLists(JSON.parse(lists));
    }
  }, []);

  const handleAdd = useCallback((unitId: string) => {
    const unit = factionUnits.find((u) => u.id === unitId);
    if (!unit) return;

    if (!validateHighCommandAddition(selectedUnits, unit)) {
      setShowHighCommandAlert(true);
      return;
    }

    setQuantities((prev) => ({
      ...prev,
      [unitId]: (prev[unitId] || 0) + 1,
    }));

    setSelectedUnits((prev) => {
      const existingUnit = prev.find((u) => u.id === unitId);
      if (existingUnit) {
        return prev.map((u) =>
          u.id === unitId ? { ...u, quantity: u.quantity + 1 } : u
        );
      }
      return [...prev, { ...unit, quantity: 1 }];
    });
  }, [factionUnits, selectedUnits]);

  const handleRemove = useCallback((unitId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [unitId]: Math.max((prev[unitId] || 0) - 1, 0),
    }));

    setSelectedUnits((prev) => {
      const updatedUnits = prev.map((u) =>
        u.id === unitId ? { ...u, quantity: u.quantity - 1 } : u
      );
      return updatedUnits.filter((u) => u.quantity > 0);
    });
  }, []);

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

    const filteredLists = savedLists.filter(list => list.name !== nameToUse);

    const newList: SavedList = {
      id: Date.now().toString(),
      name: nameToUse,
      faction: selectedFaction,
      units: selectedUnits,
    };

    const updatedLists = [...filteredLists, newList];
    setSavedLists(updatedLists);
    localStorage.setItem("armyLists", JSON.stringify(updatedLists));
    setCurrentListName(nameToUse);

    toast({
      title: "Success",
      description: "Army list saved successfully",
    });
    setListName("");
  }, [currentListName, listName, selectedFaction, selectedUnits, savedLists, toast]);

  const handleLoadList = useCallback((list: SavedList) => {
    setSelectedUnits(list.units);
    const newQuantities: Record<string, number> = {};
    list.units.forEach((unit) => {
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
  };
};