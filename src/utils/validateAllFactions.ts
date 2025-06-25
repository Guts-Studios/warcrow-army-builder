
import { loadFactionCsvData, csvUnitToStaticUnit } from '@/utils/csvToStaticGenerator';
import { units } from '@/data/factions';
import { normalizeFactionId } from '@/utils/unitManagement';

const FACTION_IDS = ['syenann', 'northern-tribes', 'hegemony-of-embersig', 'scions-of-yaldabaoth'];

export const validateAllFactionData = async () => {
  const results: Record<string, any> = {};
  
  for (const factionId of FACTION_IDS) {
    console.log(`\n=== VALIDATING ${factionId.toUpperCase()} ===`);
    
    try {
      // Load CSV data
      const csvUnits = await loadFactionCsvData(factionId);
      const csvStaticUnits = csvUnits.map(csvUnitToStaticUnit);
      
      // Get current static units for this faction
      const normalizedFactionId = normalizeFactionId(factionId);
      const currentStaticUnits = units.filter(unit => {
        const unitFactionId = normalizeFactionId(unit.faction_id || unit.faction);
        return unitFactionId === normalizedFactionId;
      });
      
      // Compare
      const csvUnitNames = csvStaticUnits.map(u => u.name).sort();
      const staticUnitNames = currentStaticUnits.map(u => u.name).sort();
      
      const missingInStatic = csvUnitNames.filter(name => !staticUnitNames.includes(name));
      const extraInStatic = staticUnitNames.filter(name => !csvUnitNames.includes(name));
      
      results[factionId] = {
        csvCount: csvStaticUnits.length,
        staticCount: currentStaticUnits.length,
        missingInStatic,
        extraInStatic,
        csvUnits: csvUnitNames,
        staticUnits: staticUnitNames
      };
      
      console.log(`CSV Units (${csvStaticUnits.length}):`, csvUnitNames);
      console.log(`Static Units (${currentStaticUnits.length}):`, staticUnitNames);
      console.log(`Missing in Static (${missingInStatic.length}):`, missingInStatic);
      console.log(`Extra in Static (${extraInStatic.length}):`, extraInStatic);
      
    } catch (error) {
      console.error(`Error validating ${factionId}:`, error);
      results[factionId] = {
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
  
  return results;
};

// Auto-run validation when this module loads
validateAllFactionData().then(results => {
  console.log('\n=== VALIDATION SUMMARY ===');
  Object.entries(results).forEach(([faction, data]) => {
    if (data.error) {
      console.log(`${faction}: ERROR - ${data.error}`);
    } else {
      const issues = data.missingInStatic.length + data.extraInStatic.length;
      console.log(`${faction}: ${data.staticCount}/${data.csvCount} units (${issues} issues)`);
    }
  });
});
