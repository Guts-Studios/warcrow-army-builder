import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

// Define the unit type to avoid excessive type depth
export interface Unit {
  id: string;
  name: string;
  name_es?: string | null;
  name_fr?: string | null;
  description?: string | null;
  description_es?: string | null;
  description_fr?: string | null;
  faction: string;
  faction_display?: string;
  type: string;
  points: number;
  keywords?: string[];
  special_rules?: string[];
  characteristics?: Record<string, any>;
}

export function useUnitData(selectedFaction: string) {
  return useQuery<Unit[]>({
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
      })) as Unit[];
      
      return unitsWithFactionDisplay;
    }
  });
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
          // If showInBuilder is explicitly false, exclude the unit
          // Otherwise include it (undefined or true)
          return unit.characteristics?.showInBuilder !== false;
        })
        .map(unit => ({
          ...unit,
          faction_display: unit.faction,
          characteristics: unit.characteristics as Record<string, any>
        })) as Unit[];
      
      return visibleUnits;
    }
  });
}

export function useFactions() {
  return useQuery({
    queryKey: ['factions'],
    queryFn: async () => {
      const { data } = await supabase.from('factions').select('*');
      return data || [];
    }
  });
}
