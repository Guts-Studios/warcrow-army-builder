import { useQuery } from '@tanstack/react-query';
import { units } from '@/data/factions';
import { Unit, ApiUnit, Faction } from '@/types/army';
import { removeDuplicateUnits, normalizeUnits, normalizeFactionId } from '@/utils/unitManagement';
import { factions as fallbackFactions } from '@/data/factions';
import { translations } from '@/i18n/translations';
import { useEnvironment } from '@/hooks/useEnvironment';
import { supabase } from '@/integrations/supabase/client';

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
  characteristics: {
    availability: unit.availability || 0,
    command: unit.command || 0,
    highCommand: unit.highCommand || false
  },
  type: 'unit'
}));

// Fetch units from database
const fetchUnitsFromDatabase = async (factionId?: string): Promise<ApiUnit[]> => {
  console.log(`[useUnitData] Fetching units from database for faction: ${factionId || 'all'}`);
  
  try {
    let query = supabase.from('unit_data').select('*');
    
    if (factionId && factionId !== 'all') {
      const normalizedFactionId = normalizeFactionId(factionId);
      query = query.eq('faction', normalizedFactionId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('[useUnitData] Database error:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log('[useUnitData] No units found in database, using local fallback');
      return localUnits;
    }
    
    // Convert database format to ApiUnit format
    const dbUnits: ApiUnit[] = data.map(unit => ({
      id: unit.id,
      name: unit.name,
      faction: unit.faction,
      faction_id: unit.faction,
      faction_display: unit.faction,
      points: unit.points || 0,
      keywords: unit.keywords || [],
      special_rules: unit.special_rules || [],
      characteristics: unit.characteristics || {},
      type: unit.type || 'unit'
    }));
    
    console.log(`[useUnitData] Retrieved ${dbUnits.length} units from database`);
    return dbUnits;
    
  } catch (error) {
    console.error('[useUnitData] Failed to fetch from database:', error);
    throw error;
  }
};

// Updated to use environment-aware data source selection
export function useUnitData(selectedFaction: string) {
  const { useLocalContentData } = useEnvironment();
  const normalizedSelectedFaction = selectedFaction ? normalizeFactionId(selectedFaction) : 'all';
  
  return useQuery({
    queryKey: ['units', normalizedSelectedFaction, useLocalContentData],
    queryFn: async () => {
      console.log(`[useUnitData] Fetching units for faction: ${normalizedSelectedFaction}, useLocal: ${useLocalContentData}`);
      
      if (useLocalContentData) {
        console.log('[useUnitData] Using local unit data');
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
        }
        
        console.log(`[useUnitData] Found ${filteredUnits.length} local units for faction: ${normalizedSelectedFaction}`);
        return filteredUnits;
      } else {
        console.log('[useUnitData] Using database unit data');
        try {
          return await fetchUnitsFromDatabase(normalizedSelectedFaction);
        } catch (error) {
          console.error('[useUnitData] Database fetch failed, falling back to local data:', error);
          // Only fall back to local data if database fails
          let filteredUnits = localUnits;
          if (normalizedSelectedFaction !== 'all') {
            filteredUnits = localUnits.filter(unit => {
              if (unit.faction_id) {
                const unitFactionId = normalizeFactionId(unit.faction_id);
                if (unitFactionId === normalizedSelectedFaction) return true;
              }
              const unitFaction = normalizeFactionId(unit.faction);
              return unitFaction === normalizedSelectedFaction;
            });
          }
          return filteredUnits;
        }
      }
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

// Updated to use local factions data but respect environment for database queries
export function useFactions(language: string = 'en') {
  const { useLocalContentData } = useEnvironment();
  
  return useQuery({
    queryKey: ['factions', language, useLocalContentData],
    queryFn: async () => {
      console.log(`[useFactions] Using data source - local: ${useLocalContentData}`);
      
      if (useLocalContentData) {
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
      } else {
        console.log('[useFactions] Attempting to fetch factions from database');
        try {
          const { data, error } = await supabase.from('factions').select('*');
          
          if (error) {
            console.error('[useFactions] Database error:', error);
            throw error;
          }
          
          if (!data || data.length === 0) {
            console.log('[useFactions] No factions in database, using local fallback');
            return fallbackFactions;
          }
          
          console.log(`[useFactions] Retrieved ${data.length} factions from database`);
          return data;
          
        } catch (error) {
          console.error('[useFactions] Database fetch failed, using local fallback:', error);
          return fallbackFactions;
        }
      }
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

// Updated to use environment-aware data source
export const useArmyBuilderUnits = (factionId: string) => {
  const { useLocalContentData } = useEnvironment();
  const normalizedFactionId = factionId ? normalizeFactionId(factionId) : '';
  
  return useQuery({
    queryKey: ['units', normalizedFactionId, useLocalContentData],
    queryFn: async () => {
      console.log(`[useArmyBuilderUnits] Fetching units for faction: ${normalizedFactionId}, useLocal: ${useLocalContentData}`);
      
      if (useLocalContentData) {
        console.log('[useArmyBuilderUnits] Using local unit data');
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
      } else {
        console.log('[useArmyBuilderUnits] Using database unit data');
        try {
          const { data, error } = await supabase
            .from('unit_data')
            .select('*')
            .eq('faction', normalizedFactionId);
          
          if (error) {
            console.error('[useArmyBuilderUnits] Database error:', error);
            throw error;
          }
          
          if (!data || data.length === 0) {
            console.log('[useArmyBuilderUnits] No units in database, using local fallback');
            const factionUnits = normalizedLocalUnits.filter(unit => {
              if (unit.faction_id) {
                return normalizeFactionId(unit.faction_id) === normalizedFactionId;
              }
              return normalizeFactionId(unit.faction) === normalizedFactionId;
            });
            return removeDuplicateUnits(factionUnits);
          }
          
          // Convert database units to the expected format
          const dbUnits = data.map(unit => ({
            id: unit.id,
            name: unit.name,
            faction: unit.faction,
            faction_id: unit.faction,
            pointsCost: unit.points || 0,
            availability: unit.characteristics?.availability || 0,
            command: unit.characteristics?.command || 0,
            keywords: (unit.keywords || []).map(k => ({ name: k })),
            specialRules: unit.special_rules || [],
            highCommand: Boolean(unit.characteristics?.highCommand) || false,
            imageUrl: `/art/card/${unit.id}_card.jpg`
          }));
          
          console.log(`[useArmyBuilderUnits] Retrieved ${dbUnits.length} units from database`);
          return removeDuplicateUnits(dbUnits);
          
        } catch (error) {
          console.error('[useArmyBuilderUnits] Database fetch failed, using local fallback:', error);
          const factionUnits = normalizedLocalUnits.filter(unit => {
            if (unit.faction_id) {
              return normalizeFactionId(unit.faction_id) === normalizedFactionId;
            }
            return normalizeFactionId(unit.faction) === normalizedFactionId;
          });
          return removeDuplicateUnits(factionUnits);
        }
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
