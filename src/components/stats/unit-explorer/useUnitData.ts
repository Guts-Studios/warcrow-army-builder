import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { units } from '@/data/factions';
import { Unit, ApiUnit } from '@/types/army';
import { removeDuplicateUnits } from '@/utils/unitManagement';

// Remove the duplicate Unit interface since we're importing it from @/types/army
export function useUnitData(selectedFaction: string) {
  return useQuery({
    queryKey: ['units', selectedFaction],
    queryFn: async () => {
      console.log(`[useUnitData] Fetching units for faction: ${selectedFaction}`);
      try {
        // Set up a timeout for the fetch - reduced to 800ms for faster fallback
        const timeoutPromise = new Promise<ApiUnit[]>((_, reject) => {
          setTimeout(() => reject(new Error('Database fetch timeout')), 800); // 800ms timeout
        });
        
        // Actual fetch with promise race
        let query = supabase.from('unit_data').select('*');
        
        if (selectedFaction !== 'all') {
          query = query.eq('faction', selectedFaction);
        }
        
        // Race between the fetch and timeout
        const { data, error } = await Promise.race([
          query,
          timeoutPromise.then(() => {
            throw new Error('Database fetch timeout');
          })
        ]) as any;
        
        if (error) {
          console.error(`[useUnitData] Error fetching units for faction ${selectedFaction}:`, error);
          throw error;
        }
        
        console.log(`[useUnitData] Successfully fetched ${data?.length || 0} units`);
        
        // Log unit names for debugging
        if (data && data.length > 0) {
          console.log(`[useUnitData] Units for ${selectedFaction}:`, data.map((u: any) => u.name).slice(0, 5), `... (${data.length} total)`);
          // Also log faction values to check for mismatches
          const factionValues = [...new Set(data.map((u: any) => u.faction))];
          console.log(`[useUnitData] Faction values in results:`, factionValues);
        }
        
        // Add faction_display field and convert Json to proper Record type
        const unitsWithFactionDisplay = (data || []).map((unit: any) => ({
          ...unit,
          faction_display: unit.faction, // Use faction ID as display name for now
          characteristics: unit.characteristics as Record<string, any> // Convert Json to Record
        })) as ApiUnit[];
        
        return unitsWithFactionDisplay;
      } catch (error) {
        console.error(`[useUnitData] Failed to fetch units:`, error);
        
        // Return mock data for testing when API fails
        console.log(`[useUnitData] Using fallback data for faction: ${selectedFaction}`);
        return fallbackUnits.map(unit => ({
          ...unit,
          faction_display: unit.faction,
          characteristics: { command: unit.command, availability: unit.availability }
        })) as ApiUnit[];
      }
    },
    retry: 0, // No retries to provide fallback faster
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

// Updated useFactions hook with better environment detection
export function useFactions(language: string = 'en') {
  return useQuery({
    queryKey: ['factions', language],
    queryFn: async () => {
      console.log("[useFactions] Fetching factions from Supabase with language:", language);
      try {
        // Check environment to determine if we should use real data
        const hostname = window.location.hostname;
        const isPreview = hostname === 'localhost' || 
                         hostname === '127.0.0.1' || 
                         hostname.includes('lovableproject.com') || 
                         hostname.endsWith('.lovableproject.com') ||
                         hostname.includes('netlify.app') || 
                         hostname.includes('lovable.app') ||
                         hostname.includes('id-preview');
        const isProduction = hostname === 'warcrowarmy.com' || 
                            hostname.endsWith('.warcrowarmy.com');
                            
        // Only use mock/fallback data in specific preview environments and not in production
        const useRealData = !isPreview || isProduction;
        
        if (!useRealData) {
          console.log('[useFactions] Preview environment detected, using fallback factions');
          return fallbackFactions;
        }
        
        // First check localStorage for immediate display
        const cachedFactions = localStorage.getItem('cached_factions');
        let localFactions: Faction[] = [];
        
        if (cachedFactions) {
          try {
            localFactions = JSON.parse(cachedFactions);
            console.log('[useFactions] Found cached factions in localStorage:', localFactions.length);
            // Continue with the fetch but use cached data for faster display
          } catch (e) {
            console.error('[useFactions] Failed to parse cached factions:', e);
          }
        }
        
        // Set up a timeout for the fetch - reduced to 800ms for faster fallback
        const timeoutPromise = new Promise<Faction[]>((resolve) => {
          setTimeout(() => {
            console.log("[useFactions] Database fetch timeout after 800ms, using cached or default factions");
            return resolve(localFactions.length > 0 ? localFactions : fallbackFactions);
          }, 800); // 800ms timeout
        });
        
        // Actual fetch with promise race
        const fetchPromise = supabase
          .from('factions')
          .select('*')
          .order('name');
          
        // Race between the fetch and timeout
        const { data, error } = await Promise.race([
          fetchPromise,
          timeoutPromise.then(() => {
            // If timeout wins, return a fake response that will trigger fallback
            return { data: null, error: new Error('Database fetch timeout') };
          })
        ]) as any;
          
        if (error) {
          console.error("[useFactions] Error fetching factions:", error);
          throw error;
        }
        
        if (data && data.length > 0) {
          // Transform to expected Faction type with language support
          const fetchedFactions = data.map((faction: any) => ({
            id: faction.id,
            name: language === 'es' ? faction.name_es || faction.name :
                 language === 'fr' ? faction.name_fr || faction.name : 
                 faction.name,
            name_es: faction.name_es,
            name_fr: faction.name_fr
          }));
          
          console.log(`[useFactions] Successfully fetched ${fetchedFactions.length} factions:`, 
            fetchedFactions.map((f: Faction) => f.name).join(', '));
          
          // Store in localStorage as a backup
          try {
            localStorage.setItem('cached_factions', JSON.stringify(fetchedFactions));
          } catch (e) {
            console.error('[useFactions] Failed to cache factions in localStorage:', e);
          }
          
          return fetchedFactions;
        } 
        
        // If we have local factions, return them
        if (localFactions.length > 0) {
          console.log('[useFactions] No factions in database, using cached factions');
          return localFactions;
        }
        
        console.log('[useFactions] No factions found in database or cache, using default factions');
        // Provide fallback data if no factions were found
        return fallbackFactions;
      } catch (error) {
        console.error('[useFactions] Failed to fetch factions:', error);
        
        // Try getting from localStorage if API fails
        try {
          const cachedFactions = localStorage.getItem('cached_factions');
          if (cachedFactions) {
            console.log('[useFactions] Using cached factions from localStorage after API error');
            return JSON.parse(cachedFactions);
          }
        } catch (e) {
          console.error('[useFactions] Failed to retrieve cached factions after API error:', e);
        }
        
        // Return fallback data on error
        return fallbackFactions;
      }
    },
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
    retry: 0, // No retry to provide fallback faster
  });
}

// Fixed the mapApiUnitToUnit function to ensure proper faction assignment
export function mapApiUnitToUnit(apiUnit: ApiUnit): Unit {
  // Safely access characteristics as an object and handle nullability
  const characteristics = apiUnit.characteristics && 
    typeof apiUnit.characteristics === 'object' ? 
    apiUnit.characteristics as Record<string, any> : {};
    
  // Normalize the faction ID to ensure it matches our expected format
  let normalizedFaction = apiUnit.faction;
  
  // Some known normalization mappings
  const factionMappings: Record<string, string> = {
    "hegemony": "hegemony-of-embersig",
    "northern": "northern-tribes",
    "scions": "scions-of-yaldabaoth",
    "syenann": "syenann"
  };
  
  // Apply faction normalization if needed
  if (factionMappings[normalizedFaction]) {
    normalizedFaction = factionMappings[normalizedFaction];
    console.log(`[mapApiUnitToUnit] Normalized faction from ${apiUnit.faction} to ${normalizedFaction} for unit ${apiUnit.name}`);
  }
    
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

export const useArmyBuilderUnits = (factionId: string) => {
  const fetchUnits = async () => {
    try {
      console.log(`[useArmyBuilderUnits] Fetching units for faction: ${factionId}`);
      // Attempt to fetch from API
      const { data: apiUnits, error } = await supabase
        .from('unit_data')
        .select('*')
        .eq('faction', factionId);

      if (error) {
        throw error;
      }

      if (apiUnits && apiUnits.length > 0) {
        console.log(`[useArmyBuilderUnits] Found ${apiUnits.length} units in database`);
        // Convert API units to proper Unit type
        const mappedUnits = apiUnits.map(apiUnit => mapApiUnitToUnit(apiUnit as ApiUnit));
        return removeDuplicateUnits(mappedUnits);
      } else {
        console.log(`[useArmyBuilderUnits] No units found in database, falling back to local data`);
        // Fallback to local data
        const localUnits = units.filter(unit => unit.faction === factionId);
        return removeDuplicateUnits(localUnits);
      }
    } catch (error) {
      console.error(`[useArmyBuilderUnits] Error fetching units:`, error);
      // Fallback to local data on error
      const localUnits = units.filter(unit => unit.faction === factionId);
      return removeDuplicateUnits(localUnits);
    }
  };

  return useQuery({
    queryKey: ['units', factionId],
    queryFn: fetchUnits,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
};
