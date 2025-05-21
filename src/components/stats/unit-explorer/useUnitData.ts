
import { useQuery } from '@tanstack/react-query';
import { units } from '@/data/factions';
import { Unit, ApiUnit, Faction } from '@/types/army';
import { removeDuplicateUnits, normalizeUnits, normalizeFactionId } from '@/utils/unitManagement';
import { factions as fallbackFactions } from '@/data/factions';
import { translations } from '@/i18n/translations';

// First normalize all units before using them as fallback data
const normalizedLocalUnits = normalizeUnits(units);

// Define fallback units for testing when API fails - now our primary data source
const localUnits: ApiUnit[] = normalizedLocalUnits.map(unit => ({
  id: unit.id,
  name: unit.name,
  faction: unit.faction,
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

// Updated to use local data instead of database queries
export function useUnitData(selectedFaction: string) {
  return useQuery({
    queryKey: ['units', selectedFaction],
    queryFn: async () => {
      console.log(`[useUnitData] Fetching units for faction: ${selectedFaction}`);
      
      // Filter units by faction if needed
      let filteredUnits = localUnits;
      if (selectedFaction !== 'all') {
        // Normalize the selected faction to ensure consistent matching
        const normalizedFaction = normalizeFactionId(selectedFaction);
        filteredUnits = localUnits.filter(unit => normalizeFactionId(unit.faction) === normalizedFaction);
      }
      
      console.log(`[useUnitData] Found ${filteredUnits.length} units for faction: ${selectedFaction}`);
      
      // Log unit names for debugging
      if (filteredUnits.length > 0) {
        console.log(`[useUnitData] Units for ${selectedFaction}:`, 
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
  let normalizedFaction = normalizeFactionId(apiUnit.faction);
  
  return {
    id: apiUnit.id,
    name: apiUnit.name,
    faction: normalizedFaction,
    pointsCost: apiUnit.points,
    availability: characteristics?.availability || 0,
    command: characteristics?.command || 0,
    keywords: (apiUnit.keywords || []).map(k => ({ name: k })),
    specialRules: apiUnit.special_rules || [],
    highCommand: Boolean(characteristics?.highCommand) || false,
    imageUrl: characteristics?.imageUrl || `/art/card/${apiUnit.id}_card.jpg`
  };
}

// Updated to use local data for army builder
export const useArmyBuilderUnits = (factionId: string) => {
  return useQuery({
    queryKey: ['units', factionId],
    queryFn: async () => {
      console.log(`[useArmyBuilderUnits] Fetching units for faction: ${factionId}`);
      
      // Normalize the faction ID first
      const normalizedFactionId = normalizeFactionId(factionId);
      
      // Get normalized units from local data with matching faction
      const factionUnits = normalizedLocalUnits.filter(unit => 
        normalizeFactionId(unit.faction) === normalizedFactionId
      );
      
      console.log(`[useArmyBuilderUnits] Found ${factionUnits.length} units in local data`);
      
      return removeDuplicateUnits(factionUnits);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
