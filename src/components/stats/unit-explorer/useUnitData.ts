
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';
import { ApiUnit, Unit } from '@/types/army';

// Remove the duplicate Unit interface since we're importing it from @/types/army
export function useUnitData(selectedFaction: string) {
  return useQuery<ApiUnit[]>({
    queryKey: ['units', selectedFaction],
    queryFn: async () => {
      let query = supabase.from('unit_data').select('*');
      
      if (selectedFaction !== 'all') {
        query = query.eq('faction', selectedFaction);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Add faction_display field and convert Json to proper Record type
      const unitsWithFactionDisplay = (data || []).map(unit => ({
        ...unit,
        faction_display: unit.faction, // Use faction ID as display name for now
        characteristics: unit.characteristics as Record<string, any> // Convert Json to Record
      })) as ApiUnit[];
      
      return unitsWithFactionDisplay;
    }
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
  return useQuery<Unit[]>({
    queryKey: ['army-builder-units', selectedFaction],
    queryFn: async () => {
      let query = supabase.from('unit_data').select('*');
      
      if (selectedFaction !== 'all') {
        query = query.eq('faction', selectedFaction);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Filter out units that should not be shown in the builder
      const visibleUnits = (data || [])
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
      
      return visibleUnits;
    }
  });
}

export function useFactions() {
  return useQuery({
    queryKey: ['factions'],
    queryFn: async () => {
      const { data, error } = await supabase.from('factions').select('*');
      
      if (error) {
        console.error("Error fetching factions:", error);
        // Provide fallback data if the fetch fails
        return [
          { id: "northern-tribes", name: "Northern Tribes" },
          { id: "hegemony-of-embersig", name: "Hegemony of Embersig" },
          { id: "scions-of-yaldabaoth", name: "Scions of Yaldabaoth" },
          { id: "syenann", name: "Sÿenann" }
        ];
      }
      
      return data || [];
    }
  });
}
