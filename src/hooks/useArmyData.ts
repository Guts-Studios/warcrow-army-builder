
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { units } from '@/data/factions';
import { Unit } from '@/types/army';
import { removeDuplicateUnits, normalizeUnits, normalizeFactionId } from '@/utils/unitManagement';
import { useAuth } from '@/components/auth/AuthProvider';
import { useEffect } from 'react';

// Critical data validation for known units
const validateCriticalUnits = (units: Unit[]): void => {
  console.log('[DATA-VALIDATION] 🔍 Validating critical unit data...');
  
  const criticalUnits = {
    'aide': { expectedCost: 25, expectedAvailability: 1, expectedCommand: 1 }
  };
  
  units.forEach(unit => {
    const expected = criticalUnits[unit.id];
    if (expected) {
      const isValid = unit.pointsCost === expected.expectedCost && 
                     unit.availability === expected.expectedAvailability &&
                     unit.command === expected.expectedCommand;
      
      if (!isValid) {
        console.error(`[DATA-VALIDATION] ❌ CRITICAL DATA MISMATCH for ${unit.id}:`, {
          current: { cost: unit.pointsCost, availability: unit.availability, command: unit.command },
          expected: { cost: expected.expectedCost, availability: expected.expectedAvailability, command: expected.expectedCommand }
        });
        
        // Alert in production for immediate detection
        if (typeof window !== 'undefined' && window.location.hostname === 'warcrowarmy.com') {
          console.error('🚨 PRODUCTION DATA ERROR: Users seeing incorrect unit stats!', unit);
        }
      } else {
        console.log(`[DATA-VALIDATION] ✅ ${unit.id} data is correct`);
      }
    }
  });
};

export const useArmyBuilderUnits = (factionId: string) => {
  const { authReady, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const normalizedFactionId = factionId ? normalizeFactionId(factionId) : '';
  
  // Force cache refresh with timestamp for critical data issues
  const cacheTimestamp = Date.now();
  const cacheKey = ['army-builder-units', normalizedFactionId, isAuthenticated ? 'authenticated' : 'guest', authReady, cacheTimestamp];
  
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
      console.log(`[useArmyBuilderUnits] 🔄 FORCE LOADING fresh units for faction: ${normalizedFactionId}, auth: ${isAuthenticated ? 'authenticated' : 'guest'}, ready: ${authReady}`);
      
      // Get all units and filter by faction
      const allUnits = normalizeUnits(units);
      console.log(`[useArmyBuilderUnits] Total units loaded: ${allUnits.length}`);
      
      // CRITICAL: Validate data before processing
      validateCriticalUnits(allUnits);
      
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
      
      const factionUnits = processedUnits.filter(unit => {
        const unitFactionId = normalizeFactionId(unit.faction_id || unit.faction);
        return unitFactionId === normalizedFactionId;
      });
      
      console.log(`[useArmyBuilderUnits] Found ${factionUnits.length} units for ${normalizedFactionId} (${isAuthenticated ? 'authenticated' : 'guest'})`);
      
      // CRITICAL: Final validation of faction units
      if (normalizedFactionId === 'hegemony-of-embersig') {
        const aideUnit = factionUnits.find(u => u.id === 'aide');
        if (aideUnit) {
          console.log(`[useArmyBuilderUnits] 🔍 Aide unit validation:`, {
            id: aideUnit.id,
            cost: aideUnit.pointsCost,
            availability: aideUnit.availability,
            command: aideUnit.command,
            tournamentLegal: aideUnit.tournamentLegal
          });
        }
      }
      
      return removeDuplicateUnits(factionUnits);
    },
    enabled: authReady,
    staleTime: 0, // Always fetch fresh data for critical issue
    gcTime: 0, // Don't cache for critical issue
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};
