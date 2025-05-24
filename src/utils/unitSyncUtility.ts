
import { supabase } from "@/integrations/supabase/client";
import { units as localUnits } from "@/data/factions";
import { Unit, ApiUnit } from "@/types/army";
import { normalizeFactionId } from "./unitManagement";

/**
 * Find missing units between database and local data
 */
export const findMissingUnits = async (factionId: string) => {
  try {
    const normalizedFactionId = normalizeFactionId(factionId);
    
    // Get units from database
    const { data: dbUnits, error } = await supabase
      .from('unit_data')
      .select('*')
      .eq('faction', normalizedFactionId);
    
    if (error) throw error;
    
    // Filter local units by faction
    const factionLocalUnits = localUnits.filter(unit => {
      if (unit.faction_id) {
        return normalizeFactionId(unit.faction_id) === normalizedFactionId;
      }
      return normalizeFactionId(unit.faction) === normalizedFactionId;
    });
    
    // Find units in database but not in local data
    const onlyInDatabase = dbUnits.filter(dbUnit => 
      !factionLocalUnits.some(localUnit => localUnit.id === dbUnit.id)
    );
    
    // Find units in local data but not in database
    const onlyInLocalData = factionLocalUnits.filter(localUnit => 
      !dbUnits.some(dbUnit => dbUnit.id === localUnit.id)
    );
    
    return {
      onlyInDatabase,
      onlyInLocalData
    };
  } catch (error) {
    console.error('Error finding missing units:', error);
    throw error;
  }
};

/**
 * Generate TypeScript file content for a faction
 */
export const generateFactionFileContent = async (factionId: string) => {
  try {
    const normalizedFactionId = normalizeFactionId(factionId);
    
    // Get units from database
    const { data: dbUnits, error } = await supabase
      .from('unit_data')
      .select('*')
      .eq('faction', normalizedFactionId);
    
    if (error) throw error;
    
    // Organize units by type
    const troops = dbUnits.filter(unit => unit.type === 'troop' || unit.type === 'troops');
    const characters = dbUnits.filter(unit => unit.type === 'character' || unit.type === 'characters');
    const highCommand = dbUnits.filter(unit => {
      const isHighCommand = unit.characteristics?.highCommand === true || 
                            unit.keywords?.includes('High Command');
      return isHighCommand;
    });
    
    // Generate TypeScript content for each file
    const filePrefix = factionId.replace(/-/g, '');
    
    // Main file content
    const mainFile = `import { Unit } from "@/types/army";
import { ${filePrefix}Troops } from "./${filePrefix}Troops";
import { ${filePrefix}Characters } from "./${filePrefix}Characters";
import { ${filePrefix}HighCommand } from "./${filePrefix}HighCommand";

export const ${filePrefix}Units: Unit[] = [
  ...${filePrefix}Troops,
  ...${filePrefix}Characters,
  ...${filePrefix}HighCommand
];
`;

    // Generate type-specific files
    const generateUnitFileContent = (units: any[], typeName: string) => {
      const unitDefinitions = units.map(unit => {
        // Convert database unit to TypeScript code
        const keywords = (unit.keywords || []).map(k => `{ name: "${k}", description: "" }`).join(',\n    ');
        const specialRules = unit.special_rules ? 
          `specialRules: [${unit.special_rules.map(rule => `"${rule}"`).join(', ')}],` : '';
        const command = unit.characteristics?.command ? 
          `command: ${unit.characteristics.command},` : '';
        
        return `  {
    id: "${unit.id}",
    name: "${unit.name}",
    faction: "${normalizedFactionId}",
    faction_id: "${normalizedFactionId}",
    pointsCost: ${unit.points || 0},
    availability: ${unit.characteristics?.availability || 0},
    ${command}
    keywords: [
      ${keywords}
    ],
    ${specialRules}
    highCommand: ${Boolean(unit.characteristics?.highCommand)},
    imageUrl: "/art/card/${unit.id}_card.jpg"
  }`;
      }).join(',\n');
      
      return `import { Unit } from "@/types/army";

export const ${filePrefix}${typeName}: Unit[] = [
${unitDefinitions}
];
`;
    };
    
    const troopsFile = generateUnitFileContent(troops, 'Troops');
    const charactersFile = generateUnitFileContent(characters, 'Characters');
    const highCommandFile = generateUnitFileContent(highCommand, 'HighCommand');
    
    return {
      mainFile,
      troopsFile,
      charactersFile,
      highCommandFile
    };
  } catch (error) {
    console.error('Error generating faction file content:', error);
    throw error;
  }
};
