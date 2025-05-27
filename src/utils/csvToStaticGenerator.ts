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

  // Parse characteristics and keywords
  const rawCharacteristics = parseDelimitedField(row.Characteristics);
  const rawKeywords = parseDelimitedField(row.Keywords);
  
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

  // Parse special rules
  const specialRules = parseDelimitedField(row['Special Rules']);

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
 * Parse comma-delimited field, handling empty values
 */
const parseDelimitedField = (field: string): string[] => {
  if (!field || field.trim() === '') return [];
  return field.split(',').map(item => item.trim()).filter(Boolean);
};

/**
 * Normalize faction name to match our faction IDs
 */
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

/**
 * Generate TypeScript file content for a list of units
 */
export const generateUnitFileContent = (
  units: Unit[], 
  factionId: string, 
  unitType: string
): string => {
  const factionPrefix = factionId.replace(/-/g, '');
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
 * Load and process CSV file for a faction
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
 * Generate all unit files for a faction from CSV data
 */
export const generateFactionFiles = async (factionId: string): Promise<{
  troops: string;
  characters: string;
  highCommand: string;
  index: string;
}> => {
  const csvUnits = await loadFactionCsvData(factionId);
  const staticUnits = csvUnits.map(csvUnitToStaticUnit);
  
  // Categorize units
  const troops = staticUnits.filter(unit => 
    unit.type === 'troop' || unit.type === 'troops' || (!unit.type && !unit.highCommand)
  );
  
  const characters = staticUnits.filter(unit => 
    unit.keywords.some(k => 
      (typeof k === 'string' ? k : k.name).toLowerCase() === 'character'
    ) && !unit.highCommand
  );
  
  const highCommand = staticUnits.filter(unit => unit.highCommand);
  
  const factionPrefix = factionId.replace(/-/g, '');
  
  return {
    troops: generateUnitFileContent(troops, factionId, 'troops'),
    characters: generateUnitFileContent(characters, factionId, 'characters'),
    highCommand: generateUnitFileContent(highCommand, factionId, 'highCommand'),
    index: `import { Unit } from "@/types/army";
import { ${factionPrefix}Troops } from "./troops";
import { ${factionPrefix}Characters } from "./characters";
import { ${factionPrefix}HighCommand } from "./highCommand";

export const ${factionPrefix}Units: Unit[] = [
  ...${factionPrefix}Troops,
  ...${factionPrefix}Characters,
  ...${factionPrefix}HighCommand
];
`
  };
};

/**
 * Validation utility to compare CSV and static data
 */
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
};
