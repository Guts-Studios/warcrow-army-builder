
import { ExtendedUnit } from "@/types/extendedUnit";
import { sampleExtendedUnits } from "@/data/extendedUnits";
import { SelectedUnit } from "@/types/army";

// Get extended unit data by unit ID
export const getExtendedUnitById = (unitId: string): ExtendedUnit | undefined => {
  return sampleExtendedUnits.find(unit => unit.id === unitId);
};

// Match regular unit with extended unit data
export const matchWithExtendedData = (selectedUnit: SelectedUnit): ExtendedUnit | undefined => {
  // Try to match by ID first
  let extendedUnit = getExtendedUnitById(selectedUnit.id);
  
  // If no match by ID, try matching by name
  if (!extendedUnit) {
    extendedUnit = sampleExtendedUnits.find(
      unit => unit.name.toLowerCase() === selectedUnit.name.toLowerCase()
    );
  }
  
  return extendedUnit;
};

// Get all extended units
export const getAllExtendedUnits = (): ExtendedUnit[] => {
  return sampleExtendedUnits;
};
