
import { Unit, SelectedUnit, ApiUnit, Faction } from '@/types/army';
import { factions, factionNameMap } from '@/data/factions';

/**
 * Normalize faction ID for consistency
 */
export const normalizeFactionId = (factionId: string): string => {
  if (!factionId) return 'northern-tribes'; // Default faction
  
  // Handle direct match in map
  if (factionNameMap[factionId]) {
    return factionNameMap[factionId];
  }
  
  // Handle case insensitive match
  const lowercaseFactionId = factionId.toLowerCase();
  for (const [key, value] of Object.entries(factionNameMap)) {
    if (key.toLowerCase() === lowercaseFactionId) {
      return value;
    }
  }
  
  // If no match found, attempt to normalize kebab-case
  if (factionId.includes(' ')) {
    const kebabFactionId = factionId.toLowerCase().replace(/\s+/g, '-');
    if (factionNameMap[kebabFactionId]) {
      return factionNameMap[kebabFactionId];
    }
  }
  
  // If all else fails, return the original (but ensure it's lowercase and kebab-case)
  return factionId.toLowerCase().replace(/\s+/g, '-').replace(/_/g, '-');
};

/**
 * Normalize all units data for consistent formats
 */
export const normalizeUnits = (unitsData: Unit[]): Unit[] => {
  return unitsData.map(unit => {
    // Ensure consistent factions
    const faction = normalizeFactionId(unit.faction);
    
    // Ensure keywords is an array of objects
    const keywords = Array.isArray(unit.keywords) 
      ? unit.keywords.map(k => {
          if (typeof k === 'string') {
            return { name: k, description: '' };
          }
          return k;
        }) 
      : [];
    
    // Ensure specialRules is an array of strings
    const specialRules = Array.isArray(unit.specialRules) 
      ? unit.specialRules 
      : [];
    
    // Normalize the unit object
    return {
      ...unit,
      faction,
      // Only set faction_id if it exists and is different from faction
      ...(unit.faction_id && unit.faction_id !== unit.faction ? { faction_id: normalizeFactionId(unit.faction_id) } : {}),
      keywords,
      specialRules,
      availability: unit.availability || 0,
      highCommand: Boolean(unit.highCommand),
      // Only include command if it has a value
      ...(unit.command ? { command: unit.command } : {})
    };
  });
};

/**
 * Remove duplicate units from an array, based on ID
 */
export const removeDuplicateUnits = (units: Unit[]): Unit[] => {
  const seen = new Set();
  return units.filter(unit => {
    const key = unit.id;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

/**
 * Convert ApiUnit to Unit format
 */
export const convertApiUnitToUnit = (apiUnit: ApiUnit): Unit => {
  return {
    id: apiUnit.id,
    name: apiUnit.name,
    faction: normalizeFactionId(apiUnit.faction),
    faction_id: apiUnit.faction_id ? normalizeFactionId(apiUnit.faction_id) : undefined,
    pointsCost: apiUnit.points,
    availability: apiUnit.characteristics?.availability || 0,
    command: apiUnit.characteristics?.command || undefined,
    keywords: (apiUnit.keywords || []).map(k => ({ name: k, description: '' })),
    specialRules: apiUnit.special_rules || [],
    highCommand: Boolean(apiUnit.characteristics?.highCommand),
    imageUrl: apiUnit.characteristics?.imageUrl || `/art/card/${apiUnit.id}_card.jpg`
  };
};

/**
 * Convert Unit to ApiUnit format
 */
export const convertUnitToApiUnit = (unit: Unit): ApiUnit => {
  return {
    id: unit.id,
    name: unit.name,
    faction: unit.faction,
    faction_id: unit.faction_id,
    points: unit.pointsCost,
    keywords: unit.keywords.map(k => typeof k === 'string' ? k : k.name),
    special_rules: unit.specialRules || [],
    characteristics: {
      availability: unit.availability || 0,
      command: unit.command || 0,
      highCommand: unit.highCommand || false,
      imageUrl: unit.imageUrl
    },
    type: 'unit'
  };
};

/**
 * Get all factions with localized names
 */
export const getLocalizedFactions = (language: string = 'en'): Faction[] => {
  return factions.map(faction => {
    // Add localization here if needed
    return {
      ...faction,
      // Add localized names in future
    };
  });
};

/**
 * Check if unit belongs to a faction
 */
export const isUnitInFaction = (unit: Unit | SelectedUnit, factionId: string): boolean => {
  const normalizedFactionId = normalizeFactionId(factionId);
  
  // First check unit.faction_id if available
  if (unit.faction_id) {
    return normalizeFactionId(unit.faction_id) === normalizedFactionId;
  }
  
  // Fall back to unit.faction
  return normalizeFactionId(unit.faction) === normalizedFactionId;
};

/**
 * Get faction name from ID
 */
export const getFactionNameById = (factionId: string): string => {
  const normalizedFactionId = normalizeFactionId(factionId);
  const faction = factions.find(f => normalizeFactionId(f.id) === normalizedFactionId);
  return faction?.name || factionId;
};

/**
 * Get updated quantities for a unit
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
 * Update selected units
 * Fix: Convert Keyword[] to string[] when adding a unit to selectedUnits
 */
export const updateSelectedUnits = (
  selectedUnits: SelectedUnit[],
  unit: Unit | undefined,
  isAdding: boolean
): SelectedUnit[] => {
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
      // Convert Keyword[] to string[] for compatibility with SelectedUnit type
      const keywordsAsStrings = unit.keywords.map(k => 
        typeof k === 'string' ? k : k.name
      );
      
      return [...selectedUnits, {
        ...unit,
        quantity: 1,
        keywords: keywordsAsStrings
      } as SelectedUnit];
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
 * Check if a unit can be added
 */
export const canAddUnit = (
  selectedUnits: SelectedUnit[], 
  unitToAdd: Unit | undefined
): boolean => {
  if (!unitToAdd) return false;
  
  const existingUnit = selectedUnits.find(u => u.id === unitToAdd.id);
  const currentQuantity = existingUnit ? existingUnit.quantity : 0;
  
  // Check if adding one more would exceed availability
  if (unitToAdd.availability && currentQuantity >= unitToAdd.availability) {
    return false;
  }
  
  return true;
};
