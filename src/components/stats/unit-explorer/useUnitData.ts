import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';
import { ApiUnit, Unit, Faction } from '@/types/army';
import { useAuth } from '@/components/auth/AuthProvider';

// Remove the duplicate Unit interface since we're importing it from @/types/army
export function useUnitData(selectedFaction: string) {
  return useQuery<ApiUnit[]>({
    queryKey: ['units', selectedFaction],
    queryFn: async () => {
      console.log(`[useUnitData] Fetching units for faction: ${selectedFaction}`);
      let query = supabase.from('unit_data').select('*');
      
      if (selectedFaction !== 'all') {
        query = query.eq('faction', selectedFaction);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error(`[useUnitData] Error fetching units for faction ${selectedFaction}:`, error);
        throw error;
      }
      
      console.log(`[useUnitData] Successfully fetched ${data?.length || 0} units`);
      
      // Log unit names for debugging
      if (data && data.length > 0) {
        console.log(`[useUnitData] Units for ${selectedFaction}:`, data.map(u => u.name));
      }
      
      // Add faction_display field and convert Json to proper Record type
      const unitsWithFactionDisplay = (data || []).map(unit => ({
        ...unit,
        faction_display: unit.faction, // Use faction ID as display name for now
        characteristics: unit.characteristics as Record<string, any> // Convert Json to Record
      })) as ApiUnit[];
      
      return unitsWithFactionDisplay;
    },
    retry: 2 // Retry failed requests up to 2 times
  });
}

// Updated useFactions hook with better error handling and language support
export function useFactions(language: string = 'en') {
  return useQuery<Faction[]>({
    queryKey: ['factions', language],
    queryFn: async () => {
      console.log("[useFactions] Fetching factions from Supabase with language:", language);
      try {
        const { data, error } = await supabase
          .from('factions')
          .select('*')
          .order('name');
          
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
            fetchedFactions.map(f => f.name).join(', '));
          return fetchedFactions;
        } else {
          console.log('[useFactions] No factions found in database, using default factions');
          // Provide fallback data if no factions were found
          return [
            { id: "northern-tribes", name: "Northern Tribes" },
            { id: "hegemony-of-embersig", name: "Hegemony of Embersig" },
            { id: "scions-of-yaldabaoth", name: "Scions of Yaldabaoth" },
            { id: "syenann", name: "Sÿenann" }
          ];
        }
      } catch (error) {
        console.error('[useFactions] Failed to fetch factions:', error);
        // Return fallback data on error
        return [
          { id: "northern-tribes", name: "Northern Tribes" },
          { id: "hegemony-of-embersig", name: "Hegemony of Embersig" },
          { id: "scions-of-yaldabaoth", name: "Scions of Yaldabaoth" },
          { id: "syenann", name: "Sÿenann" }
        ];
      }
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 2 // Retry failed requests up to 2 times
  });
}

// Convert API units to army builder units - ensuring type compatibility
export function mapApiUnitToUnit(apiUnit: ApiUnit): Unit {
  return {
    id: apiUnit.id,
    name: apiUnit.name,
    faction: apiUnit.faction,
    pointsCost: apiUnit.points,
    availability: apiUnit.characteristics?.availability || 0,
    command: apiUnit.characteristics?.command || 0,
    keywords: (apiUnit.keywords || []).map(k => ({ name: k })),
    specialRules: apiUnit.special_rules || [],
    highCommand: apiUnit.characteristics?.highCommand || false,
  };
}

export function useArmyBuilderUnits(selectedFaction: string) {
  const { isAuthenticated, isGuest } = useAuth();
  
  return useQuery<Unit[]>({
    queryKey: ['army-builder-units', selectedFaction, isAuthenticated, isGuest],
    queryFn: async () => {
      // Log the authentication state for debugging
      console.log("[useArmyBuilderUnits] Auth state:", { isAuthenticated, isGuest, selectedFaction, timestamp: new Date().toISOString() });
      
      try {
        // First try getting data from Supabase
        let query = supabase.from('unit_data').select('*');
        
        if (selectedFaction !== 'all') {
          query = query.eq('faction', selectedFaction);
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error("[useArmyBuilderUnits] Error fetching units from Supabase:", error);
          throw error; // Throw to trigger the fallback path
        }
        
        // Check if we have data
        if (!data || data.length === 0) {
          console.info(`[useArmyBuilderUnits] No units found in database for faction: ${selectedFaction}`);
          throw new Error("No units found in database"); // Trigger fallback to local data
        }
        
        // Log all unit names for debugging
        console.log(`[useArmyBuilderUnits] Database units for ${selectedFaction}:`, 
          data.map(u => {
            // Safe access of nested properties
            const highCommand = u.characteristics && 
              typeof u.characteristics === 'object' && 
              'highCommand' in u.characteristics ? 
              u.characteristics.highCommand : false;
              
            return `${u.name}${highCommand ? ' (HC)' : ''}`;
          }).join(', '));
        
        // Filter out units that should not be shown in the builder
        const visibleUnits = data
          .filter(unit => {
            const characteristics = unit.characteristics as Record<string, any> || {};
            // If showInBuilder is explicitly false, exclude the unit
            // Otherwise include it (undefined or true)
            return characteristics.showInBuilder !== false;
          })
          .map(apiUnit => {
            const mappedUnit = mapApiUnitToUnit({
              ...apiUnit,
              characteristics: apiUnit.characteristics as Record<string, any> || {},
              faction_display: apiUnit.faction,
            });
            return mappedUnit;
          });
        
        console.log(`[useArmyBuilderUnits] Found ${visibleUnits.length} units for faction ${selectedFaction} in database`);
        
        return visibleUnits;
      } catch (error) {
        // Fall back to local faction data for guest users or when database access fails
        console.log(`[useArmyBuilderUnits] Using fallback unit data from local factions for: ${selectedFaction}`);
        
        // Import all units from local data first (we'll filter by faction later)
        const { units } = await import('@/data/factions');
        
        // Get the faction-specific units
        let factionUnits: Unit[] = [];
        
        if (selectedFaction === 'scions-of-yaldabaoth') {
          // Import all Scions units explicitly to ensure they're all included
          const { scionsOfYaldabaothUnits } = await import('@/data/factions/scions-of-yaldabaoth');
          factionUnits = scionsOfYaldabaothUnits;
          
          // Log all unit names for debugging
          console.log(`[useArmyBuilderUnits] Local Scions units:`, 
            factionUnits.map(u => `${u.name}${u.highCommand ? ' (HC)' : ''}`).join(', '));
            
          console.log(`[useArmyBuilderUnits] Loaded ${factionUnits.length} Scions units directly from faction file`);
        } else {
          // For other factions use the standard filtering
          factionUnits = units.filter(unit => unit.faction === selectedFaction);
        }
        
        console.log(`[useArmyBuilderUnits] Found ${factionUnits.length} local units for faction ${selectedFaction}`);
        
        return factionUnits;
      }
    },
    retry: 1, // Only retry once to prevent multiple fallback attempts
  });
}
