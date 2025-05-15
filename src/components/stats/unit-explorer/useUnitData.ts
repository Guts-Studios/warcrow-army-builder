
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
      
      // Add faction_display field for all units based on faction id
      const unitsWithFactionDisplay = (data || []).map(unit => ({
        ...unit,
        faction_display: unit.faction // Use faction ID as display name for now
      }));
      
      return unitsWithFactionDisplay;
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
