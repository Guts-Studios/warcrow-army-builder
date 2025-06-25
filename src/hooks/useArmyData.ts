
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { units } from '@/data/factions';
import { Unit } from '@/types/army';
import { removeDuplicateUnits, normalizeUnits, normalizeFactionId } from '@/utils/unitManagement';
import { useAuth } from '@/components/auth/AuthProvider';
import { useEffect } from 'react';

export const useArmyBuilderUnits = (factionId: string) => {
  const { authReady, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const normalizedFactionId = factionId ? normalizeFactionId(factionId) : '';
  
  // Create cache key that includes auth state to prevent cross-contamination
  const cacheKey = ['army-builder-units', normalizedFactionId, isAuthenticated ? 'authenticated' : 'guest', authReady];
  
  // Invalidate cache when auth state changes
  useEffect(() => {
    if (authReady) {
      console.log(`[useArmyBuilderUnits] Auth state changed, invalidating cache for: ${isAuthenticated ? 'authenticated' : 'guest'}`);
      // Invalidate all army-builder-units queries to ensure fresh data
      queryClient.invalidateQueries({ 
        queryKey: ['army-builder-units'] 
      });
    }
  }, [isAuthenticated, authReady, queryClient]);
  
  return useQuery({
    queryKey: cacheKey,
    queryFn: async () => {
      console.log(`[useArmyBuilderUnits] Loading units for faction: ${normalizedFactionId}, auth: ${isAuthenticated ? 'authenticated' : 'guest'}, ready: ${authReady}`);
      
      // Get all units and filter by faction
      const allUnits = normalizeUnits(units);
      console.log(`[useArmyBuilderUnits] Total units loaded: ${allUnits.length}`);
      
      // Debug: Log all Syenann units before filtering
      const syenannUnitsAll = allUnits.filter(unit => {
        const unitFactionId = normalizeFactionId(unit.faction_id || unit.faction);
        return unitFactionId === 'syenann';
      });
      console.log(`[useArmyBuilderUnits] All Syenann units found:`, syenannUnitsAll.map(u => ({ 
        name: u.name, 
        faction: u.faction, 
        faction_id: u.faction_id 
      })));
      
      const factionUnits = allUnits.filter(unit => {
        const unitFactionId = normalizeFactionId(unit.faction_id || unit.faction);
        return unitFactionId === normalizedFactionId;
      });
      
      console.log(`[useArmyBuilderUnits] Found ${factionUnits.length} units for ${normalizedFactionId} (${isAuthenticated ? 'authenticated' : 'guest'})`);
      console.log(`[useArmyBuilderUnits] Unit names:`, factionUnits.map(u => u.name));
      
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
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes to allow proper caching
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    // Force refetch when auth state changes by including it in cache key
  });
};
