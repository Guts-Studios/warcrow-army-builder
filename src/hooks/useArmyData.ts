
import { useQuery } from '@tanstack/react-query';
import { Unit } from '@/types/army';
import { removeDuplicateUnits, normalizeUnits, normalizeFactionId } from '@/utils/unitManagement';
import { loadAllFactionData } from '@/utils/csvToStaticGenerator';

export const useArmyBuilderUnits = (factionId: string) => {
  const normalizedFactionId = factionId ? normalizeFactionId(factionId) : '';
  
  return useQuery({
    queryKey: ['army-builder-units', normalizedFactionId],
    queryFn: async () => {
      console.log(`[useArmyBuilderUnits] Loading fresh CSV data for faction: ${normalizedFactionId}`);
      
      // Load fresh data directly from CSV files
      const staticUnits = await loadAllFactionData();
      
      // Convert to Unit format
      const allUnits: Unit[] = staticUnits.map(staticUnit => ({
        id: staticUnit.id,
        name: staticUnit.name,
        name_es: staticUnit.name_es,
        name_fr: staticUnit.name_fr,
        faction: staticUnit.faction,
        faction_id: staticUnit.faction_id,
        pointsCost: staticUnit.pointsCost,
        availability: staticUnit.availability,
        command: staticUnit.command,
        keywords: staticUnit.keywords,
        specialRules: staticUnit.specialRules,
        highCommand: staticUnit.highCommand,
        tournamentLegal: staticUnit.tournamentLegal,
        imageUrl: staticUnit.imageUrl
      }));
      
      console.log(`[useArmyBuilderUnits] Total units loaded from CSV: ${allUnits.length}`);
      
      const factionUnits = allUnits.filter(unit => {
        const unitFactionId = normalizeFactionId(unit.faction_id || unit.faction);
        return unitFactionId === normalizedFactionId;
      });
      
      console.log(`[useArmyBuilderUnits] Found ${factionUnits.length} units for ${normalizedFactionId}`);
      
      // Log specific units for debugging
      if (normalizedFactionId === 'northern-tribes') {
        const mountedWrathmane = factionUnits.find(u => u.name.toLowerCase().includes('mounted wrathmane'));
        const tattooist = factionUnits.find(u => u.name.toLowerCase().includes('tattooist'));
        const hersir = factionUnits.find(u => u.name.toLowerCase().includes('hersir'));
        console.log(`[useArmyBuilderUnits] Mounted Wrathmane found:`, mountedWrathmane);
        console.log(`[useArmyBuilderUnits] Tattooist keywords:`, tattooist?.keywords);
        console.log(`[useArmyBuilderUnits] Hersir keywords:`, hersir?.keywords);
      }
      
      return removeDuplicateUnits(factionUnits);
    },
    staleTime: 0, // Always fetch fresh data
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  });
};
