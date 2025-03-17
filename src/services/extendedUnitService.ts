
import { ExtendedUnit, AttachedCharacter } from "@/types/extendedUnit";
import { allExtendedUnits, hegemonyCharacters } from "@/data/extendedUnits";
import { SelectedUnit } from "@/types/army";

// Get extended unit data by unit ID
export const getExtendedUnitById = (unitId: string): ExtendedUnit | undefined => {
  return allExtendedUnits.find(unit => unit.id === unitId);
};

// Get character data by ID
export const getCharacterById = (characterId: string): AttachedCharacter | undefined => {
  // Combine all character arrays for searching
  const allCharacters = [...hegemonyCharacters];
  return allCharacters.find(char => char.id === characterId);
};

// Match regular unit with extended unit data
export const matchWithExtendedData = (selectedUnit: SelectedUnit): ExtendedUnit | undefined => {
  // Try to match by ID first
  let extendedUnit = getExtendedUnitById(selectedUnit.id);
  
  // If no match by ID, try matching by name
  if (!extendedUnit) {
    extendedUnit = allExtendedUnits.find(
      unit => unit.name.toLowerCase() === selectedUnit.name.toLowerCase()
    );
  }
  
  return extendedUnit;
};

// Get all extended units
export const getAllExtendedUnits = (): ExtendedUnit[] => {
  return allExtendedUnits;
};

