
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
      
      // Get all units and filter by faction
      const allUnits = normalizeUnits(units);
      const factionUnits = allUnits.filter(unit => {
        const unitFactionId = normalizeFactionId(unit.faction_id || unit.faction);
        return unitFactionId === normalizedFactionId;
      });
      
      console.log(`[useArmyBuilderUnits] Found ${factionUnits.length} units for ${normalizedFactionId}`);
      
      // Log a sample unit to verify data format
      if (factionUnits.length > 0) {
        const sampleUnit = factionUnits.find(u => u.name === 'Wisemane');
        if (sampleUnit) {
          console.log(`[useArmyBuilderUnits] Wisemane data:`, {
            name: sampleUnit.name,
            keywords: sampleUnit.keywords,
            specialRules: sampleUnit.specialRules
          });
        }
      }
      
      return removeDuplicateUnits(factionUnits);
    },
    staleTime: 0, // Force fresh data
    gcTime: 0, // Don't cache
  });
};
