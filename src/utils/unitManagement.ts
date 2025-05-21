import { Unit } from '@/types/army';

/**
 * Utility function to normalize faction IDs consistently
 * @param faction The faction name or ID to normalize
 * @returns A normalized faction ID
 */
export const normalizeFactionId = (faction: string): string => {
  // Convert to lowercase and trim
  const lowercased = faction.toLowerCase().trim();
  
  // Map common variations to canonical faction IDs
  const factionMappings: Record<string, string> = {
    // Syenann variants
    'syenann': 'syenann',
    'the syenann': 'syenann',
    'sÿenann': 'syenann',
    
    // Northern Tribes variants
    'northern': 'northern-tribes',
    'northern tribes': 'northern-tribes',
    'tribes': 'northern-tribes',
    
    // Hegemony variants
    'hegemony': 'hegemony-of-embersig', 
    'hegemony of embersig': 'hegemony-of-embersig',
    'embersig': 'hegemony-of-embersig',
    
    // Scions variants
    'scions': 'scions-of-yaldabaoth',
    'scions of yaldabaoth': 'scions-of-yaldabaoth',
    'scions of taldabaoth': 'scions-of-yaldabaoth',
    'yaldabaoth': 'scions-of-yaldabaoth',
  };
  
  return factionMappings[lowercased] || faction;
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
  const normalizedUnits = units.map(unit => {
    // Don't modify the original unit
    const copy = { ...unit };
    
    // Normalize faction ID if present
    if (copy.faction) {
      copy.faction = normalizeFactionId(copy.faction);
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
