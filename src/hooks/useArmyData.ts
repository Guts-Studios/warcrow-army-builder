
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { units } from '@/data/factions';
import { Unit } from '@/types/army';
import { removeDuplicateUnits, normalizeUnits, normalizeFactionId } from '@/utils/unitManagement';
import { useAuth } from '@/components/auth/AuthProvider';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
      
      let allUnits: Unit[] = [];
      
      // For authenticated users, try to fetch from database first
      if (isAuthenticated) {
        try {
          console.log(`[useArmyBuilderUnits] 🚀 Fetching from database for authenticated user`);
          let query = supabase.from('unit_data').select('*');
          
          if (normalizedFactionId) {
            query = query.eq('faction', normalizedFactionId);
          }
          
          const { data, error } = await query;
          
          if (error) {
            console.error('[useArmyBuilderUnits] ❌ Database error:', error);
            throw error;
          }
          
          if (data && data.length > 0) {
            console.log(`[useArmyBuilderUnits] 📊 Retrieved ${data.length} units from database`);
            
            // Get local units for tournament legal status fallback
            const localUnits = normalizeUnits(units);
            const localUnitsMap = new Map(localUnits.map(unit => [unit.name, unit]));
            
            // Convert database units to local Unit format
            allUnits = data.map(dbUnit => {
              // Try to find corresponding local unit for tournament legal status
              const localUnit = localUnitsMap.get(dbUnit.name);
              
              // Get tournament legal status from database column or characteristics or fallback to local data
              let tournamentLegal = true; // Default value
              
              // First check the dedicated tournament_legal column
              if ('tournament_legal' in dbUnit && dbUnit.tournament_legal !== null) {
                tournamentLegal = dbUnit.tournament_legal;
              }
              // Then check characteristics
              else if (dbUnit.characteristics && typeof dbUnit.characteristics === 'object') {
                if ('tournament_legal' in dbUnit.characteristics) {
                  tournamentLegal = dbUnit.characteristics.tournament_legal === true || dbUnit.characteristics.tournament_legal === 'Yes';
                } else if (localUnit?.tournamentLegal !== undefined) {
                  tournamentLegal = localUnit.tournamentLegal;
                }
              } 
              // Finally fallback to local data
              else if (localUnit?.tournamentLegal !== undefined) {
                tournamentLegal = localUnit.tournamentLegal;
              }
              
              return {
                id: dbUnit.name.toLowerCase().replace(/\s+/g, '_'),
                name: dbUnit.name,
                name_es: dbUnit.name_es || dbUnit.name,
                name_fr: dbUnit.name_fr || dbUnit.name,
                pointsCost: dbUnit.points || 0,
                faction: dbUnit.faction,
                faction_id: dbUnit.faction,
                keywords: Array.isArray(dbUnit.keywords) ? dbUnit.keywords.map(kw => ({ name: kw, description: '' })) : [],
                highCommand: dbUnit.type === 'High Command',
                availability: 1,
                command: 0,
                specialRules: Array.isArray(dbUnit.special_rules) ? dbUnit.special_rules : [],
                tournamentLegal,
                imageUrl: `/art/card/${dbUnit.name.toLowerCase().replace(/\s+/g, '_')}_card.jpg`
              };
            });
          } else {
            console.warn('[useArmyBuilderUnits] ⚠️ No units found in database, falling back to local data');
            allUnits = normalizeUnits(units);
          }
        } catch (error) {
          console.error('[useArmyBuilderUnits] ❌ Error fetching from database, falling back to local data:', error);
          allUnits = normalizeUnits(units);
        }
      } else {
        // For guest users, use local data
        console.log(`[useArmyBuilderUnits] 📁 Using local data for guest user`);
        allUnits = normalizeUnits(units);
      }
      
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
