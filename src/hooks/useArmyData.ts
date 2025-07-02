
import { useQuery } from '@tanstack/react-query';
import { units } from '@/data/factions';
import { Unit } from '@/types/army';
import { removeDuplicateUnits, normalizeUnits, normalizeFactionId } from '@/utils/unitManagement';

export const useArmyBuilderUnits = (factionId: string) => {
  const normalizedFactionId = factionId ? normalizeFactionId(factionId) : '';
  
  return useQuery({
    queryKey: ['army-builder-units', normalizedFactionId],
    queryFn: async () => {
      console.log(`[useArmyBuilderUnits] Loading units for faction: ${normalizedFactionId}`);
      
      // Always use local data for consistency
      const allUnits = normalizeUnits(units);
      
      console.log(`[useArmyBuilderUnits] Total units loaded: ${allUnits.length}`);
      
      const factionUnits = allUnits.filter(unit => {
        const unitFactionId = normalizeFactionId(unit.faction_id || unit.faction);
        return unitFactionId === normalizedFactionId;
      });
      
      console.log(`[useArmyBuilderUnits] Found ${factionUnits.length} units for ${normalizedFactionId}`);
      
      return removeDuplicateUnits(factionUnits);
    },
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
  });
};
