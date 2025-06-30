
import { Unit, SelectedUnit } from "@/types/army";

/**
 * Normalizes a faction ID by converting it to lowercase and replacing spaces with hyphens.
 * This ensures consistency when comparing faction IDs, regardless of the input format.
 *
 * @param {string} factionId - The faction ID to normalize.
 * @returns {string} The normalized faction ID.
 *
 * Example:
 *   normalizeFactionId("Northern Tribes") returns "northern-tribes"
 *   normalizeFactionId(" scions of yaldabaoth ") returns "scions-of-yaldabaoth"
 */
export const normalizeFactionId = (factionId: string): string => {
  if (!factionId) return "";
  return factionId.toLowerCase().replace(/\s+/g, '-').trim();
};

/**
 * Removes duplicate units from an array of units.
 * This function is useful for ensuring that the army builder does not display the same unit multiple times.
 *
 * @param {Unit[]} units - An array of Unit objects.
 * @returns {Unit[]} A new array containing only unique Unit objects.
 */
export const removeDuplicateUnits = (units: Unit[]): Unit[] => {
  const unitMap = new Map<string, Unit>();
  
  for (const unit of units) {
    if (!unitMap.has(unit.id)) {
      unitMap.set(unit.id, unit);
    }
  }
  
  return Array.from(unitMap.values());
};

/**
 * Normalizes units array to ensure consistent data structure
 */
export const normalizeUnits = (units: any[]): Unit[] => {
  if (!Array.isArray(units)) {
    console.error('normalizeUnits received non-array input:', units);
    return [];
  }
  
  return units.map(unit => {
    // Create a new unit object to avoid modifying the original
    const normalizedUnit = { ...unit };
    
    // Handle empty values, null, and special string values
    if (!normalizedUnit.faction || 
        normalizedUnit.faction === 'null' || 
        normalizedUnit.faction === 'undefined' || 
        normalizedUnit.faction === '') {
      normalizedUnit.faction = normalizedUnit.faction_id || 'unknown';
    }
    
    if (!normalizedUnit.faction_id || 
        normalizedUnit.faction_id === 'null' || 
        normalizedUnit.faction_id === 'undefined' || 
        normalizedUnit.faction_id === '') {
      normalizedUnit.faction_id = normalizedUnit.faction || 'unknown';
    }
    
    // Make sure faction_id exists and is normalized
    if (normalizedUnit.faction_id) {
      normalizedUnit.faction_id = normalizeFactionId(normalizedUnit.faction_id);
    }
    
    // Also normalize the faction field for backwards compatibility
    if (normalizedUnit.faction) {
      normalizedUnit.faction = normalizeFactionId(normalizedUnit.faction);
    } else if (normalizedUnit.faction_id) {
      // If faction is missing but faction_id exists, use that
      normalizedUnit.faction = normalizedUnit.faction_id;
    }
    
    // Ensure both faction and faction_id are set to the same value
    if (normalizedUnit.faction && !normalizedUnit.faction_id) {
      normalizedUnit.faction_id = normalizedUnit.faction;
    } else if (normalizedUnit.faction_id && !normalizedUnit.faction) {
      normalizedUnit.faction = normalizedUnit.faction_id;
    }
    
    return normalizedUnit;
  });
};

/**
 * Gets updated quantities for a unit based on whether it's being added or removed.
 *
 * @param {string} unitId - The ID of the unit to update.
 * @param {Record<string, number>} quantities - The current quantities of all units.
 * @param {boolean} isAdding - Whether the unit is being added (true) or removed (false).
 * @returns {Record<string, number>} The updated quantities of all units.
 */
export const getUpdatedQuantities = (
  unitId: string,
  quantities: Record<string, number>,
  isAdding: boolean
): Record<string, number> => {
  const currentQuantity = quantities[unitId] || 0;

  if (isAdding) {
    return {
      ...quantities,
      [unitId]: currentQuantity + 1,
    };
  } else {
    const newQuantities = { ...quantities };
    if (newQuantities[unitId] > 0) {
      newQuantities[unitId]--;
      if (newQuantities[unitId] === 0) {
        delete newQuantities[unitId];
      }
    }
    return newQuantities;
  }
};

export const updateSelectedUnits = (
  selectedUnits: SelectedUnit[],
  unit: Unit | undefined,
  isAdding: boolean
): SelectedUnit[] => {
  if (!unit) {
    console.warn('[updateSelectedUnits] No unit provided');
    return selectedUnits;
  }

  console.log(`[updateSelectedUnits] ${isAdding ? 'Adding' : 'Removing'} unit: ${unit.name}`);
  console.log(`[updateSelectedUnits] Current selected units:`, selectedUnits.length);

  if (isAdding) {
    const existingUnitIndex = selectedUnits.findIndex(u => u.id === unit.id);
    
    if (existingUnitIndex >= 0) {
      // Unit already exists, increment quantity
      const updatedUnits = [...selectedUnits];
      updatedUnits[existingUnitIndex] = {
        ...updatedUnits[existingUnitIndex],
        quantity: updatedUnits[existingUnitIndex].quantity + 1
      };
      console.log(`[updateSelectedUnits] Incremented quantity for ${unit.name} to ${updatedUnits[existingUnitIndex].quantity}`);
      return updatedUnits;
    } else {
      // New unit, add to list
      const newSelectedUnit: SelectedUnit = {
        id: unit.id,
        name: unit.name,
        name_es: unit.name_es,
        name_fr: unit.name_fr,
        pointsCost: unit.pointsCost,
        quantity: 1,
        faction: unit.faction,
        faction_id: unit.faction_id,
        keywords: unit.keywords || [],
        highCommand: unit.highCommand || false,
        availability: unit.availability,
        imageUrl: unit.imageUrl,
        specialRules: unit.specialRules || [],
        command: unit.command || 0,
        tournamentLegal: unit.tournamentLegal
      };
      
      const updatedUnits = [...selectedUnits, newSelectedUnit];
      console.log(`[updateSelectedUnits] Added new unit ${unit.name}, total units now: ${updatedUnits.length}`);
      console.log(`[updateSelectedUnits] New unit highCommand status:`, newSelectedUnit.highCommand);
      return updatedUnits;
    }
  } else {
    // Removing unit
    const existingUnitIndex = selectedUnits.findIndex(u => u.id === unit.id);
    
    if (existingUnitIndex >= 0) {
      const updatedUnits = [...selectedUnits];
      const currentUnit = updatedUnits[existingUnitIndex];
      
      if (currentUnit.quantity > 1) {
        // Decrement quantity
        updatedUnits[existingUnitIndex] = {
          ...currentUnit,
          quantity: currentUnit.quantity - 1
        };
        console.log(`[updateSelectedUnits] Decremented quantity for ${unit.name} to ${updatedUnits[existingUnitIndex].quantity}`);
        return updatedUnits;
      } else {
        // Remove unit entirely
        updatedUnits.splice(existingUnitIndex, 1);
        console.log(`[updateSelectedUnits] Removed ${unit.name} entirely, total units now: ${updatedUnits.length}`);
        return updatedUnits;
      }
    }
    
    console.log(`[updateSelectedUnits] Unit ${unit.name} not found for removal`);
    return selectedUnits;
  }
};
