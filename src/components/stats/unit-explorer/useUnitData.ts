import { useQuery } from '@tanstack/react-query';
import { units } from '@/data/factions';
import { Unit, ApiUnit, Faction } from '@/types/army';
import { removeDuplicateUnits, normalizeUnits, normalizeFactionId } from '@/utils/unitManagement';
import { factions as fallbackFactions } from '@/data/factions';
import { translations } from '@/i18n/translations';
import { useEnvironment } from '@/hooks/useEnvironment';
import { supabase } from '@/integrations/supabase/client';

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

// Fetch units from database with comprehensive logging
const fetchUnitsFromDatabase = async (factionId?: string): Promise<ApiUnit[]> => {
  console.log(`[useUnitData] 🚀 fetchUnitsFromDatabase called for faction: ${factionId || 'all'} - timestamp:`, new Date().toISOString());
  
  try {
    let query = supabase.from('unit_data').select('*');
    
    if (factionId && factionId !== 'all') {
      const normalizedFactionId = normalizeFactionId(factionId);
      console.log(`[useUnitData] 🔍 Filtering by faction: ${normalizedFactionId}`);
      query = query.eq('faction', normalizedFactionId);
    }
    
    console.log('[useUnitData] 📡 Executing Supabase query...');
    const { data, error } = await query;
    
    console.log('[useUnitData] 📊 Supabase response:', {
      hasData: !!data,
      dataLength: data?.length || 0,
      hasError: !!error,
      error: error?.message || null,
      factionFilter: factionId,
      timestamp: new Date().toISOString()
    });
    
    if (error) {
      console.error('[useUnitData] ❌ Database error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        timestamp: new Date().toISOString()
      });
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.warn('[useUnitData] ⚠️ No units found in database, falling back to local data');
      return localUnits;
    }
    
    // Convert database format to ApiUnit format with proper characteristics normalization
    const dbUnits: ApiUnit[] = data.map(unit => ({
      id: unit.id,
      name: unit.name,
      faction: unit.faction,
      faction_id: unit.faction,
      faction_display: unit.faction,
      points: unit.points || 0,
      keywords: unit.keywords || [],
      special_rules: unit.special_rules || [],
      characteristics: normalizeCharacteristics(unit.characteristics),
      type: unit.type || 'unit'
    }));
    
    console.log(`[useUnitData] ✅ Successfully converted ${dbUnits.length} units from database format`);
    return dbUnits;
    
  } catch (error) {
    console.error('[useUnitData] ❌ Failed to fetch from database:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
};

// Updated to use environment-aware data source selection with comprehensive logging
export function useUnitData(selectedFaction: string) {
  const { useLocalContentData } = useEnvironment();
  const normalizedSelectedFaction = selectedFaction ? normalizeFactionId(selectedFaction) : 'all';
  
  console.log('[useUnitData] 🔧 useUnitData called with:', {
    selectedFaction,
    normalizedSelectedFaction,
    useLocalContentData,
    timestamp: new Date().toISOString()
  });
  
  return useQuery({
    queryKey: ['units', normalizedSelectedFaction, useLocalContentData],
    queryFn: async () => {
      console.log(`[useUnitData] 📥 Query function executing for faction: ${normalizedSelectedFaction}, useLocal: ${useLocalContentData}`);
      
      if (useLocalContentData) {
        console.log('[useUnitData] 🏠 Using local unit data (as configured by environment)');
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
        
        console.log(`[useUnitData] ✅ Found ${filteredUnits.length} local units for faction: ${normalizedSelectedFaction}`);
        return filteredUnits;
      } else {
        console.log('[useUnitData] 🌐 Using database unit data (as configured by environment)');
        try {
          const dbUnits = await fetchUnitsFromDatabase(normalizedSelectedFaction);
          console.log(`[useUnitData] ✅ Successfully fetched ${dbUnits.length} units from database`);
          return dbUnits;
        } catch (error) {
          console.error('[useUnitData] ❌ Database fetch failed, falling back to local data:', {
            error: error instanceof Error ? error.message : String(error),
            timestamp: new Date().toISOString()
          });
          
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
          console.log(`[useUnitData] 📦 Fallback: returning ${filteredUnits.length} local units`);
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
