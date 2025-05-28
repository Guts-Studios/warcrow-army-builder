import Papa from 'papaparse';
import { CsvUnitRow, ProcessedCsvUnit, Unit } from '@/types/army';
import { characteristicDefinitions } from '@/data/characteristicDefinitions';

/**
 * CSV to Static File Generator
 * This utility reads CSV files and generates TypeScript static files
 * ensuring CSV remains the single source of truth
 */

// Known characteristics that should be treated as characteristics, not keywords
const KNOWN_CHARACTERISTICS = Object.keys(characteristicDefinitions);

// Faction file mappings
const FACTION_CSV_MAPPING: Record<string, string> = {
  'northern-tribes': 'Northern Tribes.csv',
  'syenann': 'The Syenann.csv',
  'hegemony-of-embersig': 'Hegemony of Embersig.csv',
  'scions-of-yaldabaoth': 'Scions of Taldabaoth.csv'
};

// Faction naming conventions that match existing codebase
const FACTION_NAMING: Record<string, string> = {
  'northern-tribes': 'northernTribes',
  'syenann': 'syenann',
  'hegemony-of-embersig': 'hegemonyOfEmbersig',
  'scions-of-yaldabaoth': 'scionsOfYaldabaoth'
};

/**
 * Parse CSV content and process into structured unit data
 */
export const parseCsvToUnits = async (csvContent: string): Promise<ProcessedCsvUnit[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const units = results.data
            .filter((row: any) => row['Unit Name'] && row['Unit Name'].trim())
            .map((row: any) => processCsvRow(row as CsvUnitRow));
          
          console.log(`Processed ${units.length} units from CSV`);
          resolve(units);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

/**
 * Process a single CSV row into a ProcessedCsvUnit
 */
const processCsvRow = (row: CsvUnitRow): ProcessedCsvUnit => {
  // Generate ID from unit name
  const id = row['Unit Name'].toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-');

  // Parse characteristics and keywords using the new bracket format
  const rawCharacteristics = parseDelimitedFieldWithBrackets(row.Characteristics);
  const rawKeywords = parseDelimitedFieldWithBrackets(row.Keywords);
  
  // Separate characteristics from keywords
  const characteristics = rawCharacteristics.filter(item => 
    KNOWN_CHARACTERISTICS.includes(item)
  );
  
  const keywords = [
    ...rawKeywords.filter(item => !KNOWN_CHARACTERISTICS.includes(item)),
    ...rawCharacteristics.filter(item => !KNOWN_CHARACTERISTICS.includes(item))
  ];

  // Parse numeric fields
  const pointsCost = parseInt(row['Points Cost']) || 0;
  const availability = parseInt(row.AVB) || 0;
  const command = row.Command ? parseInt(row.Command) : undefined;

  // Parse boolean fields
  const highCommand = row['High Command']?.toLowerCase() === 'yes';

  // Parse special rules using the new bracket format
  const specialRules = parseDelimitedFieldWithBrackets(row['Special Rules']);

  // Normalize faction ID
  const factionId = row['Faction ID'] || normalizeFactionName(row.Faction);

  return {
    id,
    name: row['Unit Name'],
    faction: factionId,
    faction_id: factionId,
    type: row['Unit Type']?.toLowerCase() || 'troop',
    pointsCost,
    availability,
    command,
    characteristics,
    keywords,
    highCommand,
    specialRules,
    companion: row.Companion
  };
};

/**
 * Enhanced parsing function to handle bracket-enclosed groups and parentheses within keywords
 * Handles formats like: [Character, High Command, Varank] or Character, High Command, Varank
 * Also handles complex keywords like "Join (Infantry, Orc)" or "Dispel (BLK, BLK)"
 */
const parseDelimitedFieldWithBrackets = (field: string): string[] => {
  if (!field || field.trim() === '') return [];
  
  let trimmedField = field.trim();
  
  // Check if the field is enclosed in brackets
  if (trimmedField.startsWith('[') && trimmedField.endsWith(']')) {
    // Extract content between brackets and split by commas
    const content = trimmedField.slice(1, -1).trim();
    if (!content) return [];
    trimmedField = content;
  }
  
  // Smart parsing that respects parentheses
  const result: string[] = [];
  let current = '';
  let depth = 0;
  
  for (let i = 0; i < trimmedField.length; i++) {
    const char = trimmedField[i];
    
    if (char === '(') {
      depth++;
      current += char;
    } else if (char === ')') {
      depth--;
      current += char;
    } else if (char === ',' && depth === 0) {
      // Only split on commas that are not inside parentheses
      if (current.trim()) {
        result.push(current.trim());
      }
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add the last item
  if (current.trim()) {
    result.push(current.trim());
  }
  
  return result.filter(Boolean);
};

const normalizeFactionName = (factionName: string): string => {
  const nameMap: Record<string, string> = {
    'Northern Tribes': 'northern-tribes',
    'The Syenann': 'syenann',
    'Syenann': 'syenann',
    'Hegemony of Embersig': 'hegemony-of-embersig',
    'Scions of Taldabaoth': 'scions-of-yaldabaoth',
    'Scions of Yaldabaoth': 'scions-of-yaldabaoth'
  };
  
  return nameMap[factionName] || factionName.toLowerCase().replace(/\s+/g, '-');
};

/**
 * Convert ProcessedCsvUnit to Unit interface
 */
export const csvUnitToStaticUnit = (csvUnit: ProcessedCsvUnit): Unit => {
  // Convert keywords to keyword objects
  const keywords = csvUnit.keywords.map(keyword => ({
    name: keyword,
    description: ""
  }));

  // Add characteristics as keywords with proper descriptions
  csvUnit.characteristics.forEach(characteristic => {
    if (!keywords.some(k => k.name === characteristic)) {
      keywords.push({
        name: characteristic,
        description: characteristicDefinitions[characteristic] || ""
      });
    }
  });

  return {
    id: csvUnit.id,
    name: csvUnit.name,
    faction: csvUnit.faction,
    faction_id: csvUnit.faction_id,
    pointsCost: csvUnit.pointsCost,
    availability: csvUnit.availability,
    command: csvUnit.command,
    keywords,
    specialRules: csvUnit.specialRules.length > 0 ? csvUnit.specialRules : undefined,
    highCommand: csvUnit.highCommand,
    imageUrl: `/art/card/${csvUnit.id}_card.jpg`,
    companion: csvUnit.companion,
    type: csvUnit.type // Preserve the type information
  };
};

export const generateUnitFileContent = (
  units: Unit[], 
  factionId: string, 
  unitType: string
): string => {
  const factionPrefix = FACTION_NAMING[factionId] || factionId.replace(/-/g, '');
  const capitalizedType = unitType.charAt(0).toUpperCase() + unitType.slice(1);
  
  const unitDefinitions = units.map(unit => {
    const keywords = unit.keywords.map(keyword => {
      if (typeof keyword === 'string') {
        return `{ name: "${keyword}", description: "" }`;
      }
      return `{ name: "${keyword.name}", description: "${keyword.description || ''}" }`;
    }).join(',\n      ');
    
    const specialRules = unit.specialRules && unit.specialRules.length > 0 
      ? `specialRules: [${unit.specialRules.map(rule => `"${rule}"`).join(', ')}],`
      : '';
    
    const command = unit.command !== undefined ? `command: ${unit.command},` : '';
    const companion = unit.companion ? `companion: "${unit.companion}",` : '';
    
    return `  {
    id: "${unit.id}",
    name: "${unit.name}",
    pointsCost: ${unit.pointsCost},
    faction: "${unit.faction}",
    faction_id: "${unit.faction_id || unit.faction}",
    keywords: [
      ${keywords}
    ],
    highCommand: ${unit.highCommand || false},
    availability: ${unit.availability},
    ${command}
    ${specialRules}
    ${companion}
    imageUrl: "${unit.imageUrl}"
  }`;
  }).join(',\n');
  
  return `import { Unit } from "@/types/army";

export const ${factionPrefix}${capitalizedType}: Unit[] = [
${unitDefinitions}
];
`;
};

/**
 * Load and process CSV file for a faction with better error handling
 */
export const loadFactionCsvData = async (factionId: string): Promise<ProcessedCsvUnit[]> => {
  const csvFileName = FACTION_CSV_MAPPING[factionId];
  if (!csvFileName) {
    throw new Error(`No CSV file mapping found for faction: ${factionId}`);
  }
  
  const filePath = `/data/reference-csv/units/${csvFileName}`;
  
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`CSV file not found at ${filePath}. This is expected if CSV files are not available in this environment.`);
        throw new Error(`CSV file not found: ${csvFileName}`);
      }
      throw new Error(`Failed to fetch CSV: ${response.statusText}`);
    }
    
    const csvContent = await response.text();
    return await parseCsvToUnits(csvContent);
  } catch (error) {
    console.error(`Error loading CSV for faction ${factionId}:`, error);
    throw error;
  }
};

/**
 * Generate all unit files for a faction from CSV data with correct file structure
 */
export const generateFactionFiles = async (factionId: string): Promise<{
  troops: string;
  characters: string;
  highCommand: string;
  companions: string;
  index: string;
}> => {
  const csvUnits = await loadFactionCsvData(factionId);
  const staticUnits = csvUnits.map(csvUnitToStaticUnit);
  
  // Categorize units
  const troops = staticUnits.filter(unit => 
    (unit.type === 'troop' || unit.type === 'troops' || (!unit.type && !unit.highCommand)) &&
    !unit.keywords.some(k => (typeof k === 'string' ? k : k.name).toLowerCase() === 'character') &&
    unit.type !== 'companion'
  );
  
  const characters = staticUnits.filter(unit => 
    unit.keywords.some(k => 
      (typeof k === 'string' ? k : k.name).toLowerCase() === 'character'
    ) && !unit.highCommand && unit.type !== 'companion'
  );
  
  const highCommand = staticUnits.filter(unit => 
    unit.highCommand && unit.type !== 'companion'
  );
  
  const companions = staticUnits.filter(unit => 
    unit.type === 'companion'
  );
  
  const factionPrefix = FACTION_NAMING[factionId] || factionId.replace(/-/g, '');
  
  // Generate index file with correct import paths based on existing structure
  const indexImports = [
    `import { ${factionPrefix}Troops } from "./troops";`,
    `import { ${factionPrefix}Characters } from "./characters";`
  ];
  
  // Handle high command import path based on faction structure
  if (factionId === 'hegemony-of-embersig') {
    indexImports.push(`import { ${factionPrefix}HighCommand } from "./high-command/index";`);
  } else {
    indexImports.push(`import { ${factionPrefix}HighCommand } from "./highCommand";`);
  }
  
  const indexArrays = [
    `  ...${factionPrefix}Troops,`,
    `  ...${factionPrefix}Characters,`,
    `  ...${factionPrefix}HighCommand`
  ];
  
  if (companions.length > 0) {
    indexImports.push(`import { ${factionPrefix}Companions } from "./companions";`);
    indexArrays.push(`  ...${factionPrefix}Companions`);
  }
  
  const indexContent = `import { Unit } from "@/types/army";
${indexImports.join('\n')}

export const ${factionPrefix}Units: Unit[] = [
${indexArrays.join(',\n')}
];
`;
  
  return {
    troops: generateUnitFileContent(troops, factionId, 'troops'),
    characters: generateUnitFileContent(characters, factionId, 'characters'),
    highCommand: generateUnitFileContent(highCommand, factionId, 'highCommand'),
    companions: generateUnitFileContent(companions, factionId, 'companions'),
    index: indexContent
  };
};

export const validateCsvStaticSync = async (factionId: string, staticUnits: Unit[]): Promise<{
  missingInStatic: ProcessedCsvUnit[];
  extraInStatic: Unit[];
  mismatches: Array<{
    unit: string;
    field: string;
    csvValue: any;
    staticValue: any;
  }>;
}> => {
  try {
    const csvUnits = await loadFactionCsvData(factionId);
    
    const missingInStatic = csvUnits.filter(csvUnit => 
      !staticUnits.some(staticUnit => staticUnit.id === csvUnit.id)
    );
    
    const extraInStatic = staticUnits.filter(staticUnit => 
      !csvUnits.some(csvUnit => csvUnit.id === staticUnit.id)
    );
    
    const mismatches: Array<{
      unit: string;
      field: string;
      csvValue: any;
      staticValue: any;
    }> = [];
    
    // Check for field mismatches
    csvUnits.forEach(csvUnit => {
      const staticUnit = staticUnits.find(u => u.id === csvUnit.id);
      if (staticUnit) {
        // Check points cost
        if (staticUnit.pointsCost !== csvUnit.pointsCost) {
          mismatches.push({
            unit: csvUnit.name,
            field: 'pointsCost',
            csvValue: csvUnit.pointsCost,
            staticValue: staticUnit.pointsCost
          });
        }
        
        // Check availability
        if (staticUnit.availability !== csvUnit.availability) {
          mismatches.push({
            unit: csvUnit.name,
            field: 'availability',
            csvValue: csvUnit.availability,
            staticValue: staticUnit.availability
          });
        }
        
        // Check high command
        if (Boolean(staticUnit.highCommand) !== csvUnit.highCommand) {
          mismatches.push({
            unit: csvUnit.name,
            field: 'highCommand',
            csvValue: csvUnit.highCommand,
            staticValue: Boolean(staticUnit.highCommand)
          });
        }
        
        // Check command
        if (staticUnit.command !== csvUnit.command) {
          mismatches.push({
            unit: csvUnit.name,
            field: 'command',
            csvValue: csvUnit.command,
            staticValue: staticUnit.command
          });
        }
      }
    });
    
    return {
      missingInStatic,
      extraInStatic,
      mismatches
    };
  } catch (error) {
    console.warn(`CSV validation failed for ${factionId}, falling back to static data only:`, error);
    return {
      missingInStatic: [],
      extraInStatic: [],
      mismatches: []
    };
  }
};
