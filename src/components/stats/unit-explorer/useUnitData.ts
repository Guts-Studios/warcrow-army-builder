import { useQuery } from '@tanstack/react-query';
import { units } from '@/data/factions';
import { Unit, ApiUnit, Faction } from '@/types/army';
import { removeDuplicateUnits, normalizeUnits, normalizeFactionId } from '@/utils/unitManagement';
import { factions as fallbackFactions } from '@/data/factions';
import { translations } from '@/i18n/translations';

// Utility function to normalize characteristics to the expected ApiUnit shape
const normalizeCharacteristics = (characteristics: any): { availability: number; command: number; highCommand: boolean; imageUrl?: string } => {
  // Handle different input types
  if (!characteristics || typeof characteristics === 'string' || typeof characteristics === 'number' || typeof characteristics === 'boolean') {
    return {
      availability: 0,
      command: 0,
      highCommand: false
    };
  }

  // If it's already an object, extract the expected properties
  const charObj = typeof characteristics === 'object' ? characteristics : {};
  
  return {
    availability: typeof charObj.availability === 'number' ? charObj.availability : 0,
    command: typeof charObj.command === 'number' ? charObj.command : 0,
    highCommand: Boolean(charObj.highCommand),
    imageUrl: typeof charObj.imageUrl === 'string' ? charObj.imageUrl : undefined
  };
};

// First normalize all units before using them as fallback data
const normalizedLocalUnits = normalizeUnits(units);

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
  characteristics: normalizeCharacteristics({
    availability: unit.availability,
    command: unit.command,
    highCommand: unit.highCommand
  }),
  type: 'unit'
}));

// Convert local units to ApiUnit format for consistency
const getApiUnitsFromLocal = (factionId?: string): ApiUnit[] => {
  console.log(`[useUnitData] 📁 Getting local units for faction: ${factionId || 'all'}`);
  
  let filteredUnits = localUnits;
  if (factionId && factionId !== 'all') {
    const normalizedFactionId = normalizeFactionId(factionId);
    filteredUnits = localUnits.filter(unit => {
      // First check for faction_id match if available
      if (unit.faction_id) {
        const unitFactionId = normalizeFactionId(unit.faction_id);
        if (unitFactionId === normalizedFactionId) return true;
      }
      
      // Fall back to faction field
      const unitFaction = normalizeFactionId(unit.faction);
      return unitFaction === normalizedFactionId;
    });
  }
  
  console.log(`[useUnitData] ✅ Found ${filteredUnits.length} local units`);
  return filteredUnits;
};

// Simplified to always use local data for consistency
export function useUnitData(selectedFaction: string) {
  const normalizedSelectedFaction = selectedFaction ? normalizeFactionId(selectedFaction) : 'all';
  
  console.log('[useUnitData] 🔧 useUnitData called with:', {
    selectedFaction,
    normalizedSelectedFaction,
    timestamp: new Date().toISOString()
  });
  
  return useQuery({
    queryKey: ['units', normalizedSelectedFaction],
    queryFn: async () => {
      console.log(`[useUnitData] 📥 Query function executing for faction: ${normalizedSelectedFaction}`);
      return getApiUnitsFromLocal(normalizedSelectedFaction);
    },
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
  });
}

// Always use local faction data for consistency
export function useFactions(language: string = 'en') {
  return useQuery({
    queryKey: ['factions', language],
    queryFn: async () => {
      console.log('[useFactions] Using local faction data');
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
    staleTime: 30 * 60 * 1000, // Cache for 30 minutes
  });
}

// Fixed mapApiUnitToUnit function to be more reliable
export function mapApiUnitToUnit(apiUnit: ApiUnit): Unit {
  // Use the normalized characteristics directly since they're already in the correct format
  const characteristics = apiUnit.characteristics;
    
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
    availability: characteristics.availability,
    command: characteristics.command,
    keywords: (apiUnit.keywords || []).map(k => ({ name: k })),
    specialRules: apiUnit.special_rules || [],
    highCommand: characteristics.highCommand,
    imageUrl: characteristics.imageUrl || `/art/card/${apiUnit.id}_card.jpg`
  };
}
