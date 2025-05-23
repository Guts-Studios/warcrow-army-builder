import { Unit } from '@/types/army';

/**
 * Utility function to normalize faction IDs consistently
 * @param faction The faction name or ID to normalize
 * @returns A normalized faction ID
 */
export const normalizeFactionId = (faction: string): string => {
  // Handle undefined or null input
  if (!faction) {
    console.warn('Received undefined or null faction');
    return 'unknown';
  }
  
  // Convert to lowercase and trim
  const lowercased = faction.toLowerCase().trim();
  
  // Handle "null" strings that might be in CSV
  if (lowercased === 'null' || lowercased === 'undefined') {
    console.warn('Received "null" or "undefined" string as faction');
    return 'unknown';
  }
  
  // Map common variations to canonical faction IDs
  const factionMappings: Record<string, string> = {
    // Syenann variants
    'syenann': 'syenann',
    'sÿenann': 'syenann',
    'the syenann': 'syenann',
    'the sÿenann': 'syenann',
    
    // Northern Tribes variants
    'northern': 'northern-tribes',
    'northern tribes': 'northern-tribes',
    'tribes': 'northern-tribes',
    'northern-tribes': 'northern-tribes',
    
    // Hegemony variants
    'hegemony': 'hegemony-of-embersig',
    'hegemony of embersig': 'hegemony-of-embersig',
    'embersig': 'hegemony-of-embersig',
    'hegemony-of-embersig': 'hegemony-of-embersig',
    
    // Scions variants
    'scions': 'scions-of-yaldabaoth',
    'scions of yaldabaoth': 'scions-of-yaldabaoth',
    'scions of taldabaoth': 'scions-of-yaldabaoth',
    'yaldabaoth': 'scions-of-yaldabaoth',
    'taldabaoth': 'scions-of-yaldabaoth',
    'scions-of-yaldabaoth': 'scions-of-yaldabaoth',
    'scions-of-taldabaoth': 'scions-of-yaldabaoth',
  };
  
  // Use the mapping if available, otherwise return the original
  const normalized = factionMappings[lowercased] || lowercased;
  
  // Add debugging to help track down problematic faction names
  if (!factionMappings[lowercased] && !lowercased.includes('-')) {
    console.debug(`Unmapped faction name: "${faction}" (normalized to "${normalized}")`);
  }
  
  return normalized;
};

/**
 * Removes duplicate units from an array of units based on their ID
 * @param units Array of units that might contain duplicates
 * @returns Array of units with duplicates removed
 */
export const removeDuplicateUnits = (units: Unit[]): Unit[] => {
  const seen = new Set<string>();
  
  return units.filter(unit => {
    // Ensure unit has a valid ID
    if (!unit.id) {
      console.warn('Found unit without ID:', unit.name);
      return false;
    }
    
    // Check if we've already seen this unit ID
    if (seen.has(unit.id)) {
      console.warn(`Duplicate unit ID found: ${unit.name} with ID ${unit.id}`);
      return false;
    }
    
    // Mark this ID as seen and keep the unit
    seen.add(unit.id);
    return true;
  });
};

/**
 * Normalizes unit data by ensuring consistent faction values
 * @param units Array of units to normalize
 * @returns Array of normalized units
 */
export const normalizeUnits = (units: Unit[]): Unit[] => {
  if (!Array.isArray(units)) {
    console.error('normalizeUnits received non-array input:', units);
    return [];
  }
  
  const normalizedUnits = units.map(unit => {
    // Don't modify the original unit
    const copy = { ...unit };
    
    // Normalize faction_id first if it exists
    if (copy.faction_id) {
      // Handle "null" strings that might be in CSV data
      if (typeof copy.faction_id === 'string' && 
          (copy.faction_id.toLowerCase() === 'null' || copy.faction_id.toLowerCase() === 'undefined')) {
        copy.faction_id = copy.faction || 'unknown';
      } else {
        copy.faction_id = normalizeFactionId(copy.faction_id);
      }
      
      // Also use faction_id for faction if we have it
      copy.faction = copy.faction_id;
    } 
    // Then normalize faction if faction_id doesn't exist
    else if (copy.faction) {
      // Handle "null" strings that might be in CSV data
      if (typeof copy.faction === 'string' && 
          (copy.faction.toLowerCase() === 'null' || copy.faction.toLowerCase() === 'undefined')) {
        copy.faction = 'unknown';
      } else {
        copy.faction = normalizeFactionId(copy.faction);
      }
      
      // Set faction_id to match normalized faction
      copy.faction_id = copy.faction;
    } else {
      console.warn(`Unit ${copy.name || 'unnamed'} has no faction assigned`);
      copy.faction = 'unknown';
      copy.faction_id = 'unknown';
    }
    
    return copy;
  });
  
  console.log(`Normalized ${normalizedUnits.length} units`);
  
  // Log faction distribution
  const factionCounts: Record<string, number> = {};
  normalizedUnits.forEach(unit => {
    const faction = unit.faction || 'unknown';
    factionCounts[faction] = (factionCounts[faction] || 0) + 1;
  });
  
  // Log the counts
  console.log('Normalized faction distribution:');
  Object.entries(factionCounts).forEach(([faction, count]) => {
    console.log(`- ${faction}: ${count}`);
  });
  
  return normalizedUnits;
};

/**
 * Updates quantities when adding or removing units
 * @param unitId The ID of the unit to update
 * @param currentQuantities The current quantities object
 * @param isAdding Whether the unit is being added (true) or removed (false)
 * @returns Updated quantities object
 */
export const getUpdatedQuantities = (
  unitId: string,
  currentQuantities: Record<string, number>,
  isAdding: boolean
): Record<string, number> => {
  const newQuantities = { ...currentQuantities };
  const currentQty = currentQuantities[unitId] || 0;
  
  if (isAdding) {
    newQuantities[unitId] = currentQty + 1;
  } else if (currentQty > 0) {
    newQuantities[unitId] = currentQty - 1;
    // Remove the entry if quantity becomes zero
    if (newQuantities[unitId] === 0) {
      delete newQuantities[unitId];
    }
  }
  
  return newQuantities;
};

/**
 * Updates the selected units array when adding or removing units
 * @param selectedUnits The current array of selected units
 * @param unit The unit to add or remove
 * @param isAdding Whether the unit is being added (true) or removed (false)
 * @returns Updated array of selected units
 */
export const updateSelectedUnits = (
  selectedUnits: any[],
  unit: any,
  isAdding: boolean
): any[] => {
  if (!unit) return selectedUnits;
  
  const existingUnitIndex = selectedUnits.findIndex(u => u.id === unit.id);
  
  if (isAdding) {
    if (existingUnitIndex >= 0) {
      // Unit already exists, increment quantity
      const updatedUnits = [...selectedUnits];
      updatedUnits[existingUnitIndex] = {
        ...updatedUnits[existingUnitIndex],
        quantity: updatedUnits[existingUnitIndex].quantity + 1
      };
      return updatedUnits;
    } else {
      // Add new unit with quantity 1
      return [...selectedUnits, { ...unit, quantity: 1 }];
    }
  } else {
    // Removing a unit
    if (existingUnitIndex >= 0) {
      const updatedUnits = [...selectedUnits];
      const currentQty = updatedUnits[existingUnitIndex].quantity;
      
      if (currentQty > 1) {
        // Decrease quantity if more than 1
        updatedUnits[existingUnitIndex] = {
          ...updatedUnits[existingUnitIndex],
          quantity: currentQty - 1
        };
        return updatedUnits;
      } else {
        // Remove unit completely if quantity is 1
        return updatedUnits.filter(u => u.id !== unit.id);
      }
    }
  }
  
  return selectedUnits;
};

/**
 * Checks if a unit can be added based on availability rules
 * @param selectedUnits Currently selected units
 * @param unitToAdd The unit to add
 * @returns Boolean indicating if the unit can be added
 */
export const canAddUnit = (selectedUnits: any[], unitToAdd: any): boolean => {
  if (!unitToAdd) return false;
  
  const existingUnit = selectedUnits.find(u => u.id === unitToAdd.id);
  const currentQuantity = existingUnit ? existingUnit.quantity : 0;
  
  // Check if adding one more would exceed availability
  if (unitToAdd.availability && currentQuantity >= unitToAdd.availability) {
    return false;
  }
  
  return true;
};
