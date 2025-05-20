
import { Unit, SelectedUnit, Keyword } from "@/types/army";
import { validateUnitAddition, validateHighCommandAddition } from "./armyValidation";

export const validateUnitAdditionWrapper = (
  unit: Unit,
  currentQuantity: number,
  availability: number,
  selectedUnits: SelectedUnit[],
  armyFaction: string
): boolean => {
  // First, check basic availability
  if (currentQuantity >= availability) return false;
  
  // Then perform comprehensive validation
  return validateUnitAddition(selectedUnits, unit, armyFaction);
};

export const getUpdatedQuantities = (
  unitId: string,
  currentQuantities: Record<string, number>,
  isAdding: boolean
): Record<string, number> => {
  const currentQuantity = currentQuantities[unitId] || 0;
  
  if (isAdding) {
    return {
      ...currentQuantities,
      [unitId]: Math.min(currentQuantity + 1, 9),
    };
  } else {
    return {
      ...currentQuantities,
      [unitId]: Math.max(currentQuantity - 1, 0),
    };
  }
};

export const updateSelectedUnits = (
  selectedUnits: SelectedUnit[],
  unit: Unit | undefined,
  isAdding: boolean
): SelectedUnit[] => {
  if (!unit) return selectedUnits;

  const existingUnit = selectedUnits.find((u) => u.id === unit.id);
  
  if (isAdding) {
    if (existingUnit) {
      return selectedUnits.map((u) =>
        u.id === unit.id
          ? { ...u, quantity: Math.min(u.quantity + 1, 9) }
          : u
      );
    }
    // Convert Unit to SelectedUnit, mapping keywords from Keyword[] to string[]
    const keywordsAsStrings = unit.keywords.map(k => k.name);
    
    return [...selectedUnits, { 
      ...unit, 
      quantity: 1,
      keywords: keywordsAsStrings 
    }];
  } else {
    const updatedUnits = selectedUnits.map((u) =>
      u.id === unit.id ? { ...u, quantity: u.quantity - 1 } : u
    );
    return updatedUnits.filter((u) => u.quantity > 0);
  }
};

/**
 * Checks if a unit can be added to the army
 * Used by UnitCard and other components to disable add button when needed
 */
export const canAddUnit = (
  unit: Unit,
  currentQuantity: number,
  selectedUnits: SelectedUnit[],
  armyFaction: string
): boolean => {
  // If unit has reached availability limit
  if (currentQuantity >= unit.availability) return false;
  
  // If trying to add a high command unit when one already exists
  if (unit.highCommand && selectedUnits.some(u => u.highCommand)) return false;
  
  // If unit faction doesn't match army faction
  if (unit.faction !== armyFaction) return false;
  
  return true;
};

/**
 * Deduplicates an array of units based on ID and name
 * Used to ensure no duplicate units appear in a list
 */
export const removeDuplicateUnits = (units: Unit[]): Unit[] => {
  const uniqueUnits: Unit[] = [];
  const seenIds = new Set<string>();
  const seenNames = new Set<string>();
  const nameToIdMap = new Map<string, string>();
  
  for (const unit of units) {
    // Skip units without an ID
    if (!unit.id) {
      console.warn(`Skipped unit without ID: ${unit.name}`);
      continue;
    }
    
    const nameLower = unit.name.toLowerCase();
    
    // First check if we've seen this exact ID before
    if (seenIds.has(unit.id)) {
      console.warn(`Filtered out duplicate unit ID: ${unit.name} (${unit.id})`);
      continue;
    }
    
    // Then check if we've seen this name before
    if (seenNames.has(nameLower)) {
      // We have a name conflict, check if it's the same unit with different casing
      const existingId = nameToIdMap.get(nameLower);
      if (existingId && existingId !== unit.id) {
        console.warn(`Filtered out unit with duplicate name but different ID: ${unit.name} (ID: ${unit.id}, existing ID: ${existingId})`);
      } else {
        console.warn(`Filtered out duplicate unit name: ${unit.name} (${unit.id})`);
      }
      continue;
    }
    
    // Special case for variant units that should be included
    const isVariant = unit.name.includes('(') && unit.name.includes(')');
    if (isVariant) {
      // For variant units, extract the base name
      const baseName = unit.name.split('(')[0].trim().toLowerCase();
      
      // Allow variant if it has a different ID from the base unit
      if (seenNames.has(baseName)) {
        const baseId = nameToIdMap.get(baseName);
        if (baseId && baseId === unit.id) {
          console.warn(`Filtered out variant unit with same ID: ${unit.name} (${unit.id})`);
          continue;
        }
      }
    }
    
    // This is a new unique unit, add it to our tracking sets
    seenIds.add(unit.id);
    seenNames.add(nameLower);
    nameToIdMap.set(nameLower, unit.id);
    
    // Add to our filtered array
    uniqueUnits.push(unit);
  }
  
  return uniqueUnits;
};
