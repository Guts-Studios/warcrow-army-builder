
import { loadFactionCsvData, csvUnitToStaticUnit, generateUnitFileContent } from '@/utils/csvToStaticGenerator';
import { Unit } from '@/types/army';

/**
 * Utility to update Syenann faction data from CSV
 * This compares CSV data with current static data and generates updated files
 */
export const updateSyenannFromCsv = async () => {
  try {
    console.log('Loading Syenann CSV data...');
    const csvUnits = await loadFactionCsvData('syenann');
    const staticUnits = csvUnits.map(csvUnitToStaticUnit);
    
    console.log(`Loaded ${staticUnits.length} units from CSV`);
    
    // Categorize units based on their properties
    const troops = staticUnits.filter(unit => 
      !unit.keywords.some(k => 
        (typeof k === 'string' ? k : k.name).toLowerCase() === 'character'
      ) && !unit.highCommand
    );
    
    const characters = staticUnits.filter(unit => 
      unit.keywords.some(k => 
        (typeof k === 'string' ? k : k.name).toLowerCase() === 'character'
      ) && !unit.highCommand
    );
    
    const highCommand = staticUnits.filter(unit => 
      unit.highCommand
    );
    
    console.log(`Categorized: ${troops.length} troops, ${characters.length} characters, ${highCommand.length} high command`);
    
    // Generate the file contents
    const troopsContent = generateUnitFileContent(troops, 'syenann', 'troops');
    const charactersContent = generateUnitFileContent(characters, 'syenann', 'characters');
    const highCommandContent = generateUnitFileContent(highCommand, 'syenann', 'highCommand');
    
    return {
      troops: troopsContent,
      characters: charactersContent,
      highCommand: highCommandContent,
      summary: {
        totalUnits: staticUnits.length,
        troopsCount: troops.length,
        charactersCount: characters.length,
        highCommandCount: highCommand.length
      }
    };
  } catch (error) {
    console.error('Error updating Syenann from CSV:', error);
    throw error;
  }
};
