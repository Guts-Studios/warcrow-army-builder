
import { SelectedUnit, Unit } from "@/types/army";

export const getUpdatedQuantities = (
  unitId: string,
  currentQuantities: Record<string, number>,
  isAdding: boolean
): Record<string, number> => {
  const currentQuantity = currentQuantities[unitId] || 0;
  const newQuantity = isAdding ? currentQuantity + 1 : Math.max(0, currentQuantity - 1);
  
  console.log(`[getUpdatedQuantities] ${unitId}: ${currentQuantity} -> ${newQuantity} (${isAdding ? 'adding' : 'removing'})`);
  
  const newQuantities = { ...currentQuantities };
  
  if (newQuantity === 0) {
    delete newQuantities[unitId];
  } else {
    newQuantities[unitId] = newQuantity;
  }
  
  return newQuantities;
};

export const updateSelectedUnits = (
  currentUnits: SelectedUnit[],
  unit: Unit | undefined,
  isAdding: boolean
): SelectedUnit[] => {
  if (!unit) {
    console.warn("[updateSelectedUnits] Unit is undefined");
    return currentUnits;
  }
  
  console.log(`[updateSelectedUnits] ${isAdding ? 'Adding' : 'Removing'} unit: ${unit.name} (${unit.id})`);
  
  const existingUnitIndex = currentUnits.findIndex((u) => u.id === unit.id);
  
  if (isAdding) {
    if (existingUnitIndex >= 0) {
      // Unit already exists, increment quantity
      const updatedUnits = [...currentUnits];
      const existingUnit = updatedUnits[existingUnitIndex];
      updatedUnits[existingUnitIndex] = {
        ...existingUnit,
        quantity: existingUnit.quantity + 1
      };
      console.log(`[updateSelectedUnits] Incremented ${unit.name} quantity to ${updatedUnits[existingUnitIndex].quantity}`);
      return updatedUnits;
    } else {
      // New unit, add it
      const newSelectedUnit: SelectedUnit = {
        id: unit.id,
        name: unit.name,
        pointsCost: unit.pointsCost,
        quantity: 1,
        faction: unit.faction,
        faction_id: unit.faction_id,
        keywords: Array.isArray(unit.keywords) 
          ? unit.keywords.map(k => typeof k === 'string' ? k : k.name)
          : [],
        highCommand: unit.highCommand || false,
        availability: unit.availability,
        imageUrl: unit.imageUrl,
        specialRules: unit.specialRules || [],
        command: unit.command || 0
      };
      const updatedUnits = [...currentUnits, newSelectedUnit];
      console.log(`[updateSelectedUnits] Added new unit: ${unit.name}`);
      return updatedUnits;
    }
  } else {
    // Removing
    if (existingUnitIndex >= 0) {
      const existingUnit = currentUnits[existingUnitIndex];
      if (existingUnit.quantity > 1) {
        // Decrement quantity
        const updatedUnits = [...currentUnits];
        updatedUnits[existingUnitIndex] = {
          ...existingUnit,
          quantity: existingUnit.quantity - 1
        };
        console.log(`[updateSelectedUnits] Decremented ${unit.name} quantity to ${updatedUnits[existingUnitIndex].quantity}`);
        return updatedUnits;
      } else {
        // Remove the unit entirely
        const updatedUnits = currentUnits.filter((u) => u.id !== unit.id);
        console.log(`[updateSelectedUnits] Removed unit: ${unit.name}`);
        return updatedUnits;
      }
    }
  }
  
  console.log(`[updateSelectedUnits] No changes made for unit: ${unit.name}`);
  return currentUnits;
};

export const canAddUnit = (
  selectedUnits: SelectedUnit[],
  unit: Unit,
  selectedFaction: string
): boolean => {
  // Check if unit belongs to the selected faction
  if (unit.faction !== selectedFaction) {
    console.warn(`[canAddUnit] Unit ${unit.name} faction (${unit.faction}) doesn't match selected faction (${selectedFaction})`);
    return false;
  }
  
  // Check availability limit
  const existingUnit = selectedUnits.find((u) => u.id === unit.id);
  const currentQuantity = existingUnit ? existingUnit.quantity : 0;
  
  if (currentQuantity >= unit.availability) {
    console.warn(`[canAddUnit] Unit ${unit.name} has reached availability limit (${unit.availability})`);
    return false;
  }
  
  return true;
};
