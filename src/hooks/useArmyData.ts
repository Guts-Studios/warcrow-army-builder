
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
      
      // Enhanced processing to ensure tournament legal status is preserved
      const processedUnits = allUnits.map(unit => {
        // Ensure tournamentLegal property is properly set
        let tournamentLegal = true; // Default to true if not specified
        
        // Safe property access with proper type checking
        const tournamentLegalValue = (unit as any).tournamentLegal;
        
        if (tournamentLegalValue !== undefined) {
          // Handle various formats: boolean false, string "false", etc.
          if (typeof tournamentLegalValue === 'boolean') {
            tournamentLegal = tournamentLegalValue;
          } else if (typeof tournamentLegalValue === 'string') {
            const lowerValue = tournamentLegalValue.toLowerCase();
            tournamentLegal = lowerValue !== 'false' && lowerValue !== 'no';
          } else {
            // Handle any other type by converting to string first
            const stringValue = String(tournamentLegalValue).toLowerCase();
            tournamentLegal = stringValue !== 'false' && stringValue !== 'no';
          }
        }
        
        return {
          ...unit,
          tournamentLegal
        };
      });
      
      console.log(`[useArmyBuilderUnits] Processed ${processedUnits.length} units with tournament legal status`);
      
      // Debug: Log tournament legal status for first few units
      const sampleUnits = processedUnits.slice(0, 3);
      sampleUnits.forEach(unit => {
        console.log(`[useArmyBuilderUnits] Unit ${unit.name} - tournamentLegal: ${unit.tournamentLegal} (type: ${typeof unit.tournamentLegal})`);
      });
      
      const factionUnits = processedUnits.filter(unit => {
        const unitFactionId = normalizeFactionId(unit.faction_id || unit.faction);
        return unitFactionId === normalizedFactionId;
      });
      
      console.log(`[useArmyBuilderUnits] Found ${factionUnits.length} units for ${normalizedFactionId} (${isAuthenticated ? 'authenticated' : 'guest'})`);
      
      // Debug: Check for non-tournament legal units in this faction
      const nonTournamentUnits = factionUnits.filter(unit => unit.tournamentLegal === false);
      console.log(`[useArmyBuilderUnits] Non-tournament legal units in ${normalizedFactionId}:`, nonTournamentUnits.map(u => u.name));
      
      return removeDuplicateUnits(factionUnits);
    },
    enabled: authReady, // Only run query when auth state is ready
    staleTime: 1 * 60 * 1000, // Reduced cache time to 1 minute for production testing
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    // Force refetch when auth state changes by including it in cache key
  });
};
