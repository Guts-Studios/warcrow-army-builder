import { loadFactionCsvData, csvUnitToStaticUnit } from '@/utils/csvToStaticGenerator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const FACTION_IDS = ['syenann', 'northern-tribes', 'hegemony-of-embersig', 'scions-of-yaldabaoth'];

export interface SyncResults {
  totalProcessed: number;
  successCount: number;
  errorCount: number;
  errors: string[];
  factionResults: Record<string, {
    processed: number;
    errors: string[];
  }>;
}

/**
 * Sync all factions from CSV to database including tournament legal status
 */
export const syncAllFactionsToDatabase = async (
  onProgress?: (progress: number, status: string) => void
): Promise<SyncResults> => {
  const results: SyncResults = {
    totalProcessed: 0,
    successCount: 0,
    errorCount: 0,
    errors: [],
    factionResults: {}
  };

  try {
    onProgress?.(0, 'Starting sync of all factions...');

    for (let i = 0; i < FACTION_IDS.length; i++) {
      const factionId = FACTION_IDS[i];
      const progress = Math.round(((i) / FACTION_IDS.length) * 90);
      
      onProgress?.(progress, `Syncing ${factionId}...`);
      
      try {
        const factionResult = await syncFactionToDatabase(factionId);
        results.factionResults[factionId] = factionResult;
        results.totalProcessed += factionResult.processed;
        results.successCount += factionResult.processed - factionResult.errors.length;
        results.errorCount += factionResult.errors.length;
        results.errors.push(...factionResult.errors);
      } catch (error: any) {
        console.error(`Error syncing faction ${factionId}:`, error);
        const errorMsg = `Failed to sync ${factionId}: ${error.message}`;
        results.errors.push(errorMsg);
        results.errorCount++;
        results.factionResults[factionId] = {
          processed: 0,
          errors: [errorMsg]
        };
      }
    }

    onProgress?.(100, 'Sync completed!');
    
    console.log('Final sync results:', results);
    return results;

  } catch (error: any) {
    console.error('Error in syncAllFactionsToDatabase:', error);
    throw error;
  }
};

/**
 * Sync a single faction from CSV to database
 */
export const syncFactionToDatabase = async (factionId: string): Promise<{
  processed: number;
  errors: string[];
}> => {
  const factionResult = {
    processed: 0,
    errors: [] as string[]
  };

  try {
    console.log(`Loading CSV data for ${factionId}...`);
    const csvUnits = await loadFactionCsvData(factionId);
    const staticUnits = csvUnits.map(csvUnitToStaticUnit);

    console.log(`Processing ${staticUnits.length} units for ${factionId}`);

    // First, clear existing data for this faction
    const { error: deleteError } = await supabase
      .from('unit_data')
      .delete()
      .eq('faction', factionId);

    if (deleteError) {
      throw new Error(`Failed to clear existing data for ${factionId}: ${deleteError.message}`);
    }

    // Process units in batches
    const batchSize = 10;
    for (let i = 0; i < staticUnits.length; i += batchSize) {
      const batch = staticUnits.slice(i, i + batchSize);
      
      for (const unit of batch) {
        try {
          // Convert unit to database format with tournament legal status
          const dbUnit = {
            id: crypto.randomUUID(),
            name: unit.name,
            name_es: unit.name_es || null,
            name_fr: unit.name_fr || null,
            description: `${unit.name} unit`,
            description_es: null,
            description_fr: null,
            faction: factionId,
            type: unit.highCommand ? 'High Command' : 
                  unit.keywords.some(k => (typeof k === 'string' ? k : k.name).toLowerCase() === 'character') ? 'Character' : 'Troop',
            points: unit.pointsCost,
            characteristics: {
              availability: unit.availability,
              command: unit.command || 0,
              highCommand: unit.highCommand
            },
            keywords: unit.keywords.map(k => typeof k === 'string' ? k : k.name),
            special_rules: unit.specialRules || [],
            options: [],
            tournament_legal: unit.tournamentLegal // Add tournament legal status to dedicated column
          };

          const { error } = await supabase
            .from('unit_data')
            .insert(dbUnit);

          if (error) {
            console.error(`Error inserting unit ${unit.name}:`, error);
            factionResult.errors.push(`${unit.name}: ${error.message}`);
          } else {
            factionResult.processed++;
          }

        } catch (unitError: any) {
          console.error(`Error processing unit ${unit.name}:`, unitError);
          factionResult.errors.push(`${unit.name}: ${unitError.message}`);
        }
      }
    }

    console.log(`Completed ${factionId}: ${factionResult.processed} units processed, ${factionResult.errors.length} errors`);
    return factionResult;

  } catch (error: any) {
    console.error(`Error syncing faction ${factionId}:`, error);
    factionResult.errors.push(`Faction sync failed: ${error.message}`);
    return factionResult;
  }
};