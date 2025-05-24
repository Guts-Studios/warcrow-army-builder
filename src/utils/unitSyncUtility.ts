
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
 * Generate unit code from database unit data
 */
export const generateUnitCode = (unit: any) => {
  // Function to clean and format string arrays
  const formatStringArray = (arr: string[]) => {
    if (!Array.isArray(arr) || arr.length === 0) return '[]';
    return `[${arr.map(item => `"${item.trim()}"`).join(', ')}]`;
  };

  // Start building the unit object code
  let code = `  {\n`;
  code += `    id: "${unit.id}",\n`;
  code += `    name: "${unit.name}",\n`;
  code += `    faction: "${unit.faction}",\n`;
  
  // Include faction_id if available
  if (unit.faction_id && unit.faction_id !== unit.faction) {
    code += `    faction_id: "${unit.faction_id}",\n`;
  }
  
  code += `    pointsCost: ${unit.pointsCost || unit.points || 0},\n`;
  code += `    availability: ${unit.availability || 0},\n`;
  
  // Add command if available
  if (unit.command) {
    code += `    command: ${unit.command},\n`;
  }
  
  // Format keywords as array of objects
  const keywordsArr = Array.isArray(unit.keywords) ? unit.keywords : [];
  code += `    keywords: [\n`;
  code += keywordsArr.map(keyword => {
    return `      { name: "${keyword}", description: "" }`;
  }).join(',\n');
  code += `\n    ],\n`;
  
  // Add highCommand if true - properly check characteristics object
  if (unit.characteristics && 
      typeof unit.characteristics === 'object' && 
      unit.characteristics.highCommand === true) {
    code += `    highCommand: true,\n`;
  } else if (unit.highCommand === true) {
    // Also check direct property as fallback
    code += `    highCommand: true,\n`;
  }
  
  // Add special rules if available
  if (unit.specialRules && unit.specialRules.length > 0) {
    code += `    specialRules: ${formatStringArray(unit.specialRules)},\n`;
  } else if (unit.special_rules && unit.special_rules.length > 0) {
    code += `    specialRules: ${formatStringArray(unit.special_rules)},\n`;
  }
  
  // Add imageUrl
  code += `    imageUrl: "/art/card/${unit.id}_card.jpg"\n`;
  code += `  }`;
  
  return code;
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
      // Safely check for highCommand property in characteristics
      const characteristics = unit.characteristics;
      const isHighCommand = (
        (characteristics && 
         typeof characteristics === 'object' && 
         characteristics.highCommand === true) || 
        (unit.keywords && 
         Array.isArray(unit.keywords) && 
         unit.keywords.includes('High Command'))
      );
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
        
        // Safely check for command in characteristics
        const characteristics = unit.characteristics;
        const command = characteristics && typeof characteristics === 'object' && characteristics.command ? 
          `command: ${characteristics.command},` : '';
        
        return `  {
    id: "${unit.id}",
    name: "${unit.name}",
    faction: "${normalizedFactionId}",
    faction_id: "${normalizedFactionId}",
    pointsCost: ${unit.points || 0},
    availability: ${characteristics && typeof characteristics === 'object' ? characteristics.availability || 0 : 0},
    ${command}
    keywords: [
      ${keywords}
    ],
    ${specialRules}
    highCommand: ${Boolean(characteristics && typeof characteristics === 'object' && characteristics.highCommand)},
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
