import { useQuery } from '@tanstack/react-query';
import { units } from '@/data/factions';
import { Unit, ApiUnit, Faction } from '@/types/army';
import { removeDuplicateUnits, normalizeUnits, normalizeFactionId } from '@/utils/unitManagement';
import { factions as fallbackFactions } from '@/data/factions';
import { translations } from '@/i18n/translations';

// First normalize all units before using them as fallback data
const normalizedLocalUnits = normalizeUnits(units);

// Remove the hardcoded unit additions since units should be properly in their faction files now

// Now convert to ApiUnit format for consistency
const localUnits: ApiUnit[] = normalizedLocalUnits.map(unit => ({
  id: unit.id,
  name: unit.name,
  faction: unit.faction,
  faction_id: unit.faction_id || unit.faction,
  faction_display: unit.faction,
  points: unit.pointsCost,
  keywords: unit.keywords.map(k => typeof k === 'string' ? k : k.name),
  special_rules: unit.specialRules || [],
  characteristics: {
    availability: unit.availability || 0,
    command: unit.command || 0,
    highCommand: unit.highCommand || false
  },
  type: 'unit'
}));

// Updated to use local data instead of database queries and to properly handle faction_id
export function useUnitData(selectedFaction: string) {
  const normalizedSelectedFaction = selectedFaction ? normalizeFactionId(selectedFaction) : 'all';
  
  return useQuery({
    queryKey: ['units', normalizedSelectedFaction],
    queryFn: async () => {
      console.log(`[useUnitData] Fetching units for faction: ${normalizedSelectedFaction}`);
      
      // Filter units by faction if needed
      let filteredUnits = localUnits;
      if (normalizedSelectedFaction !== 'all') {
        filteredUnits = localUnits.filter(unit => {
          // First check for faction_id match if available
          if (unit.faction_id) {
            const unitFactionId = normalizeFactionId(unit.faction_id);
            if (unitFactionId === normalizedSelectedFaction) return true;
          }
          
          // Fall back to faction field
          const unitFaction = normalizeFactionId(unit.faction);
          return unitFaction === normalizedSelectedFaction;
        });
        
        // Double check for units that should be in this faction but aren't being found
        if (filteredUnits.length === 0) {
          console.warn(`[useUnitData] No units found for faction: ${normalizedSelectedFaction}. This might indicate a data issue.`);
          
          // Debug: log units that might be close matches
          const possibleMatches = localUnits.filter(unit => {
            const unitFaction = String(unit.faction || '').toLowerCase();
            const unitFactionId = String(unit.faction_id || '').toLowerCase();
            const targetFaction = normalizedSelectedFaction.toLowerCase();
            
            return unitFaction.includes(targetFaction) || unitFactionId.includes(targetFaction) || 
                   targetFaction.includes(unitFaction) || targetFaction.includes(unitFactionId);
          });
          
          if (possibleMatches.length > 0) {
            console.log(`[useUnitData] Possible matches found with similar faction names:`, 
              possibleMatches.slice(0, 3).map(u => ({name: u.name, faction: u.faction, faction_id: u.faction_id}))
            );
          }
        }
      }
      
      console.log(`[useUnitData] Found ${filteredUnits.length} units for faction: ${normalizedSelectedFaction}`);
      
      // Log unit names for debugging
      if (filteredUnits.length > 0) {
        console.log(`[useUnitData] Units for ${normalizedSelectedFaction}:`, 
          filteredUnits.map((u: any) => u.name).slice(0, 5), 
          `... (${filteredUnits.length} total)`
        );
      }
      
      return filteredUnits;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

// Updated to use local factions data
export function useFactions(language: string = 'en') {
  return useQuery({
    queryKey: ['factions', language],
    queryFn: async () => {
      console.log("[useFactions] Using local faction data");
      
      // Create language-specific faction names
      const localizedFactions: Faction[] = fallbackFactions.map(faction => {
        const baseKey = `faction_${faction.id.replace(/-/g, '_')}`;
        
        return {
          id: faction.id,
          name: language === 'en' ? faction.name : 
                language === 'es' ? translations[baseKey]?.es || faction.name : 
                language === 'fr' ? translations[baseKey]?.fr || faction.name : 
                faction.name,
          name_es: translations[baseKey]?.es || faction.name,
          name_fr: translations[baseKey]?.fr || faction.name
        };
      });
      
      return localizedFactions;
    },
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
  });
}

// Fixed mapApiUnitToUnit function to be more reliable
export function mapApiUnitToUnit(apiUnit: ApiUnit): Unit {
  // Safely access characteristics as an object and handle nullability
  const characteristics = apiUnit.characteristics && 
    typeof apiUnit.characteristics === 'object' ? 
    apiUnit.characteristics as Record<string, any> : {};
    
  // Normalize the faction ID to ensure it matches our expected format
  let normalizedFaction = apiUnit.faction ? normalizeFactionId(apiUnit.faction) : 'unknown';
  let normalizedFactionId = apiUnit.faction_id ? normalizeFactionId(apiUnit.faction_id) : normalizedFaction;
  
  // Handle null/undefined values in CSV
  if (normalizedFaction === 'null' || normalizedFaction === 'undefined') normalizedFaction = 'unknown';
  if (normalizedFactionId === 'null' || normalizedFactionId === 'undefined') normalizedFactionId = normalizedFaction;
  
  return {
    id: apiUnit.id,
    name: apiUnit.name,
    faction: normalizedFaction,
    faction_id: normalizedFactionId, // Ensure faction_id is set
    pointsCost: apiUnit.points,
    availability: characteristics?.availability || 0,
    command: characteristics?.command || 0,
    keywords: (apiUnit.keywords || []).map(k => ({ name: k })),
    specialRules: apiUnit.special_rules || [],
    highCommand: Boolean(characteristics?.highCommand) || false,
    imageUrl: characteristics?.imageUrl || `/art/card/${apiUnit.id}_card.jpg`
  };
}

// Updated to use local data for army builder with improved error handling
export const useArmyBuilderUnits = (factionId: string) => {
  const normalizedFactionId = factionId ? normalizeFactionId(factionId) : '';
  
  return useQuery({
    queryKey: ['units', normalizedFactionId],
    queryFn: async () => {
      console.log(`[useArmyBuilderUnits] Fetching units for faction: ${normalizedFactionId}`);
      
      // Get normalized units from local data with matching faction
      const factionUnits = normalizedLocalUnits.filter(unit => {
        // First check for faction_id match if available
        if (unit.faction_id) {
          return normalizeFactionId(unit.faction_id) === normalizedFactionId;
        }
        // Fall back to faction field
        return normalizeFactionId(unit.faction) === normalizedFactionId;
      });
      
      console.log(`[useArmyBuilderUnits] Found ${factionUnits.length} units in local data`);
      
      return removeDuplicateUnits(factionUnits);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
