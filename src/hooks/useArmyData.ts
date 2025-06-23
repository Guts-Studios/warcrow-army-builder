
import { useQuery } from '@tanstack/react-query';
import { units } from '@/data/factions';
import { Unit } from '@/types/army';
import { removeDuplicateUnits, normalizeUnits, normalizeFactionId } from '@/utils/unitManagement';
import { useAuth } from '@/components/auth/AuthProvider';

export const useArmyBuilderUnits = (factionId: string) => {
  const { authReady, isAuthenticated } = useAuth();
  const normalizedFactionId = factionId ? normalizeFactionId(factionId) : '';
  
  return useQuery({
    queryKey: ['army-builder-units', normalizedFactionId, isAuthenticated, authReady],
    queryFn: async () => {
      console.log(`[useArmyBuilderUnits] Loading units for faction: ${normalizedFactionId}, auth: ${isAuthenticated}, ready: ${authReady}`);
      
      // Get all units and filter by faction
      const allUnits = normalizeUnits(units);
      console.log(`[useArmyBuilderUnits] Total units loaded: ${allUnits.length}`);
      
      const factionUnits = allUnits.filter(unit => {
        const unitFactionId = normalizeFactionId(unit.faction_id || unit.faction);
        return unitFactionId === normalizedFactionId;
      });
      
      console.log(`[useArmyBuilderUnits] Found ${factionUnits.length} units for ${normalizedFactionId}`);
      
      // Debug: Check specifically for Mounted Hetman in Hegemony
      if (normalizedFactionId === 'hegemony-of-embersig') {
        const mountedHetman = factionUnits.find(u => u.name === 'Mounted Hetman');
        console.log(`[useArmyBuilderUnits] Mounted Hetman found:`, mountedHetman ? 'YES' : 'NO');
        if (mountedHetman) {
          console.log(`[useArmyBuilderUnits] Mounted Hetman data:`, mountedHetman);
        }
        
        // Log all high command units for debugging
        const highCommandUnits = factionUnits.filter(u => u.highCommand);
        console.log(`[useArmyBuilderUnits] Hegemony High Command units:`, highCommandUnits.map(u => u.name));
      }
      
      return removeDuplicateUnits(factionUnits);
    },
    enabled: authReady, // Only run query when auth state is ready
    staleTime: 0, // Force fresh data
    gcTime: 0, // Don't cache
  });
};
