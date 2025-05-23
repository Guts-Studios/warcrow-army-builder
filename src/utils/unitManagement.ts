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
  
  // Use the mapping if available, otherwise normalize the string by replacing spaces with hyphens
  const normalized = factionMappings[lowercased] || lowercased.replace(/\s+/g, '-');
  
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
 * Normalizes unit data by ensuring consistent faction values and handling empty values
 * @param units Array of units to normalize
 * @returns Array of normalized units
 */
export const normalizeUnits = (units: Unit[]): Unit[] => {
  if (!Array.isArray(units)) {
    console.error('normalizeUnits received non-array input:', units);
    return [];
  }
  
  // Create a new array to avoid modifying the original units
  return units.map(unit => {
    // Create a copy of the unit to avoid mutation
    const normalizedUnit = { ...unit };
    
    // Handle empty/null faction values
    if (!normalizedUnit.faction || 
        normalizedUnit.faction === 'null' || 
        normalizedUnit.faction === 'undefined') {
      normalizedUnit.faction = normalizedUnit.faction_id || 'unknown';
    }
    
    // Handle empty/null faction_id values
    if (!normalizedUnit.faction_id || 
        normalizedUnit.faction_id === 'null' || 
        normalizedUnit.faction_id === 'undefined') {
      normalizedUnit.faction_id = normalizedUnit.faction || 'unknown';
    }
    
    // Normalize both faction and faction_id
    if (normalizedUnit.faction) {
      normalizedUnit.faction = normalizeFactionId(normalizedUnit.faction);
    }
    
    if (normalizedUnit.faction_id) {
      normalizedUnit.faction_id = normalizeFactionId(normalizedUnit.faction_id);
    }
    
    // Make sure both faction fields are consistent
    if (normalizedUnit.faction && !normalizedUnit.faction_id) {
      normalizedUnit.faction_id = normalizedUnit.faction;
    } else if (normalizedUnit.faction_id && !normalizedUnit.faction) {
      normalizedUnit.faction = normalizedUnit.faction_id;
    }
    
    return normalizedUnit;
  });
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
