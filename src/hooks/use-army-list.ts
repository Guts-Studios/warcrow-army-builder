
import { useState, useEffect, useMemo, useCallback } from "react";
import { Unit, SelectedUnit, SavedList } from "@/types/army";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getAllFactionUnits } from "@/data/factions/index";
import { removeDuplicateUnits } from "@/utils/unitManagement";
import { useEnvironment } from "@/hooks/useEnvironment";

export const useArmyList = (selectedFaction: string) => {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [listName, setListName] = useState<string>("");
  const [currentListName, setCurrentListName] = useState<string>("");
  const [showHighCommandAlert, setShowHighCommandAlert] = useState(false);
  const { toast } = useToast();
  const { useLocalContentData } = useEnvironment();

  // Get units for the selected faction
  const { 
    data: factionUnits = [], 
    isLoading: unitsLoading, 
    error: unitsError,
    refetch: refetchUnits 
  } = useQuery({
    queryKey: ['faction-units', selectedFaction, useLocalContentData],
    queryFn: async () => {
      if (useLocalContentData) {
        // Use local data - get all units for the faction without filtering by tournament status
        const allUnits = getAllFactionUnits(selectedFaction);
        return removeDuplicateUnits(allUnits);
      } else {
        // Try to fetch from database, fall back to local data
        try {
          const { data, error } = await supabase
            .from('unit_data')
            .select('*')
            .eq('faction', selectedFaction);
          
          if (error) throw error;
          
          if (!data || data.length === 0) {
            // Fall back to local data
            const allUnits = getAllFactionUnits(selectedFaction);
            return removeDuplicateUnits(allUnits);
          }
          
          // Convert database format to Unit format
          return data.map(unit => ({
            id: unit.id,
            name: unit.name,
            name_es: unit.name_es,
            faction: unit.faction,
            faction_id: unit.faction,
            pointsCost: unit.points || 0,
            availability: (unit.characteristics as any)?.availability || 1,
            command: (unit.characteristics as any)?.command || 0,
            keywords: (unit.keywords || []).map((k: string) => ({ name: k })),
            specialRules: unit.special_rules || [],
            highCommand: (unit.characteristics as any)?.highCommand || false,
            tournamentLegal: (unit.characteristics as any)?.tournamentLegal !== false, // Default to true if not specified
            imageUrl: (unit.characteristics as any)?.imageUrl
          }));
        } catch (error) {
          console.error('Failed to fetch from database, using local data:', error);
          const allUnits = getAllFactionUnits(selectedFaction);
          return removeDuplicateUnits(allUnits);
        }
      }
    },
    enabled: !!selectedFaction,
  });

  // Fetch saved lists
  const { data: savedLists = [], isLoading: isLoadingLists } = useQuery({
    queryKey: ['saved-lists'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('army_lists')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Convert the raw database format to SavedList format
      return (data || []).map(list => {
        // Parse units if they're stored as a string
        let unitsList = list.units;
        if (typeof unitsList === 'string') {
          try {
            unitsList = JSON.parse(unitsList);
          } catch (e) {
            console.error("Error parsing units JSON:", e);
            unitsList = [];
          }
        }

        // Ensure units is properly typed as SelectedUnit[]
        const typedUnits: SelectedUnit[] = Array.isArray(unitsList) 
          ? (unitsList as unknown as SelectedUnit[])
          : [];

        return {
          id: list.id,
          name: list.name,
          faction: list.faction,
          units: typedUnits,
          user_id: list.user_id || undefined,
          created_at: list.created_at,
          wab_id: list.wab_id || undefined
        };
      });
    },
  });

  // Calculate selected units
  const selectedUnits: SelectedUnit[] = useMemo(() => {
    return factionUnits
      .filter(unit => quantities[unit.id] > 0)
      .map(unit => ({
        ...unit,
        quantity: quantities[unit.id]
      }));
  }, [factionUnits, quantities]);

  // Handle adding units
  const handleAdd = useCallback((unitId: string) => {
    const unit = factionUnits.find(u => u.id === unitId);
    if (!unit) return;

    const currentQuantity = quantities[unitId] || 0;
    
    // Check availability limit
    if (currentQuantity >= unit.availability) {
      toast({
        title: "Cannot add more units",
        description: `Maximum ${unit.availability} of this unit allowed`,
        variant: "destructive",
      });
      return;
    }

    // Check high command limit
    if (unit.highCommand && currentQuantity === 0) {
      const currentHighCommand = selectedUnits.filter(u => u.highCommand).length;
      if (currentHighCommand >= 1) {
        setShowHighCommandAlert(true);
        return;
      }
    }

    setQuantities(prev => ({
      ...prev,
      [unitId]: currentQuantity + 1
    }));
  }, [factionUnits, quantities, selectedUnits, toast]);

  // Handle removing units
  const handleRemove = useCallback((unitId: string) => {
    setQuantities(prev => {
      const newQuantities = { ...prev };
      if (newQuantities[unitId] > 0) {
        newQuantities[unitId]--;
        if (newQuantities[unitId] === 0) {
          delete newQuantities[unitId];
        }
      }
      return newQuantities;
    });
  }, []);

  // Handle creating new list
  const handleNewList = useCallback(() => {
    setQuantities({});
    setListName("");
    setCurrentListName("");
  }, []);

  // Handle saving list
  const handleSaveList = useCallback(async () => {
    if (!listName.trim()) {
      toast({
        title: "Please enter a list name",
        variant: "destructive",
      });
      return;
    }

    try {
      const listData = {
        name: listName,
        faction: selectedFaction,
        units: selectedUnits as any, // Cast to any to handle Json type
      };

      const { error } = await supabase
        .from('army_lists')
        .insert([listData]);

      if (error) throw error;

      toast({
        title: "List saved successfully",
      });
      
      setCurrentListName(listName);
    } catch (error) {
      console.error('Error saving list:', error);
      toast({
        title: "Error saving list",
        variant: "destructive",
      });
    }
  }, [listName, selectedFaction, selectedUnits, toast]);

  // Handle loading list
  const handleLoadList = useCallback((list: SavedList) => {
    const newQuantities: Record<string, number> = {};
    
    list.units.forEach(unit => {
      newQuantities[unit.id] = unit.quantity;
    });
    
    setQuantities(newQuantities);
    setListName(list.name);
    setCurrentListName(list.name);
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
