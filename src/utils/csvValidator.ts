/**
 * Utility functions for CSV validation
 */
import Papa from 'papaparse';

export type CsvUnit = {
  id: string;
  name: string;
  faction: string;
  faction_id?: string; // Add faction_id field
  type: string;
  pointsCost: number | string;
  availability: number | string;
  keywords: string[];
  specialRules?: string[];
  highCommand: string | boolean;
  command?: number | string;
};

/**
 * Parse a CSV file and return the data as an array of objects
 */
export const parseCsvFile = (file: File): Promise<CsvUnit[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        // Type cast and normalize the data
        const units = results.data as CsvUnit[];
        resolve(units);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

/**
 * Parse CSV content string directly
 * This is useful for parsing CSV content loaded as text
 */
export const parseCsvContent = (csvContent: string): Promise<CsvUnit[]> => {
  return new Promise((resolve) => {
    Papa.parse(csvContent, {
      header: true,
      complete: (results) => {
        // Map the parsed data to our CsvUnit type
        const units = results.data
          .filter((row: any) => row.name || row['Unit Name'] || row.id) // Filter out empty rows
          .map((row: any) => ({
            id: row.id || '',
            name: row['Unit Name'] || row.name || '',
            faction: row.Faction || row.faction || '',
            faction_id: row['Faction ID'] || row.faction_id || '', // Add faction_id mapping
            type: row['Unit Type'] || row.type || '',
            pointsCost: row['Points Cost'] || row.pointsCost || 0,
            availability: row.AVB || row.availability || 0,
            keywords: (row.Keywords || row.keywords || '').split(',').map((k: string) => k.trim()).filter(Boolean),
            specialRules: (row['Special Rules'] || row.specialRules || '')
              .split(',')
              .map((r: string) => r.trim())
              .filter((r: string) => r),
            highCommand: (row['High Command'] || row.highCommand || '').toLowerCase() === 'yes',
            command: parseInt(row.Command || row.command || '0', 10) || 0
          }));
        resolve(units);
      }
    });
  });
};

/**
 * Compare a unit from static data with a unit from CSV
 * Returns an array of mismatches
 */
export const compareUnitWithCsv = (staticUnit: any, csvUnit: CsvUnit): Array<{field: string, staticValue: any, csvValue: any}> => {
  const mismatches: Array<{field: string, staticValue: any, csvValue: any}> = [];
  
  // Check points cost
  const csvPoints = Number(csvUnit.pointsCost);
  if (!isNaN(csvPoints) && staticUnit.pointsCost !== csvPoints) {
    mismatches.push({
      field: 'pointsCost',
      staticValue: staticUnit.pointsCost,
      csvValue: csvPoints
    });
  }
  
  // Check availability
  const csvAvailability = Number(csvUnit.availability);
  if (!isNaN(csvAvailability) && staticUnit.availability !== csvAvailability) {
    mismatches.push({
      field: 'availability',
      staticValue: staticUnit.availability,
      csvValue: csvAvailability
    });
  }
  
  // Check high command
  const csvHighCommand = typeof csvUnit.highCommand === 'boolean' 
    ? csvUnit.highCommand 
    : csvUnit.highCommand.toString().toLowerCase() === 'yes';
  
  if (Boolean(staticUnit.highCommand) !== csvHighCommand) {
    mismatches.push({
      field: 'highCommand',
      staticValue: Boolean(staticUnit.highCommand),
      csvValue: csvHighCommand
    });
  }
  
  // Check command
  const csvCommand = Number(csvUnit.command);
  if (!isNaN(csvCommand) && staticUnit.command !== csvCommand && (csvCommand > 0 || staticUnit.command > 0)) {
    mismatches.push({
      field: 'command',
      staticValue: staticUnit.command || 0,
      csvValue: csvCommand
    });
  }
  
  // Check keywords (improved comparison)
  if (Array.isArray(staticUnit.keywords) && Array.isArray(csvUnit.keywords)) {
    const staticKeywords = staticUnit.keywords
      .map((k: any) => typeof k === 'string' ? k.toLowerCase() : k.name.toLowerCase())
      .filter(Boolean)
      .sort();
    
    const csvKeywordsList = csvUnit.keywords
      .map(k => k.toLowerCase())
      .filter(Boolean)
      .sort();
    
    // More lenient comparison (check if each CSV keyword appears in static keywords)
    let keywordMismatches = false;
    
    // Check if each required CSV keyword is in static keywords
    for (const keyword of csvKeywordsList) {
      if (keyword && !staticKeywords.some(k => k.includes(keyword) || keyword.includes(k))) {
        keywordMismatches = true;
        break;
      }
    }
    
    // Check if static data has important keywords not in CSV
    for (const keyword of staticKeywords) {
      if (keyword && !csvKeywordsList.some(k => k.includes(keyword) || keyword.includes(k))) {
        keywordMismatches = true;
        break;
      }
    }
    
    if (keywordMismatches) {
      mismatches.push({
        field: 'keywords',
        staticValue: staticKeywords,
        csvValue: csvKeywordsList
      });
    }
  }
  
  // Check special rules (improved comparison)
  if (Array.isArray(staticUnit.specialRules) || Array.isArray(csvUnit.specialRules)) {
    const staticRules = (staticUnit.specialRules || [])
      .map((r: string) => r.toLowerCase())
      .filter(Boolean)
      .sort();
    
    const csvRules = (csvUnit.specialRules || [])
      .map(r => r.toLowerCase())
      .filter(Boolean)
      .sort();
    
    // More lenient comparison
    let ruleMismatches = false;
    
    // Check if each CSV rule is in static rules
    for (const rule of csvRules) {
      if (rule && !staticRules.some(r => r.includes(rule) || rule.includes(r))) {
        ruleMismatches = true;
        break;
      }
    }
    
    // Check if static rules has important rules not in CSV
    for (const rule of staticRules) {
      if (rule && !csvRules.some(r => r.includes(rule) || rule.includes(r))) {
        ruleMismatches = true;
        break;
      }
    }
    
    if (ruleMismatches) {
      mismatches.push({
        field: 'specialRules',
        staticValue: staticRules,
        csvValue: csvRules
      });
    }
  }
  
  return mismatches;
};

/**
 * Find matching units between CSV and static data
 */
export const findMatchingUnit = (csvUnit: CsvUnit, staticUnits: any[]): any => {
  // First try to match by ID
  if (csvUnit.id) {
    const matchById = staticUnits.find(unit => unit.id === csvUnit.id);
    if (matchById) return matchById;
  }
  
  // Then try to match by name and faction_id if available
  if (csvUnit.faction_id) {
    const matchByNameAndFactionId = staticUnits.find(unit => 
      unit.name.toLowerCase() === csvUnit.name.toLowerCase() &&
      unit.faction_id === csvUnit.faction_id
    );
    if (matchByNameAndFactionId) return matchByNameAndFactionId;
  }
  
  // Then try to match by name (case insensitive)
  return staticUnits.find(unit => 
    unit.name.toLowerCase() === csvUnit.name.toLowerCase() &&
    (!csvUnit.faction || unit.faction.toLowerCase() === csvUnit.faction.toLowerCase())
  );
};

/**
 * Create a sample CSV file header
 */
export const getSampleCsvHeader = (): string => {
  return 'id,name,faction,faction_id,type,pointsCost,availability,keywords,specialRules,highCommand,command';
};

/**
 * Create a sample CSV row from a unit
 */
export const createCsvRowFromUnit = (unit: any): string => {
  const keywords = unit.keywords.map((k: any) => typeof k === 'string' ? k : k.name).join(',');
  const specialRules = (unit.specialRules || []).join(',');
  const highCommand = unit.highCommand ? 'Yes' : 'No';
  const faction_id = unit.faction_id || unit.faction;
  
  return `${unit.id},${unit.name},${unit.faction},${faction_id},${unit.type || ''},${unit.pointsCost},${unit.availability},${keywords},${specialRules},${highCommand},${unit.command || ''}`;
};

/**
 * Export units to CSV format
 */
export const exportUnitsToCSV = (units: any[]): string => {
  const header = "id,name,faction,faction_id,type,pointsCost,availability,keywords,specialRules,highCommand,command";
  const rows = units.map(createCsvRowFromUnit);
  return [header, ...rows].join('\n');
};

/**
 * Generate JavaScript code for a unit file from CSV data
 */
export const generateUnitFileCode = (units: CsvUnit[], faction: string): string => {
  const formattedUnits = units.map(unit => {
    const keywords = unit.keywords.map(keyword => {
      // Clean up the keyword
      const cleanKeyword = keyword.trim();
      if (!cleanKeyword) return null;
      return `{ name: "${cleanKeyword}", description: "" }`;
    }).filter(Boolean).join(",\n      ");
    
    const specialRules = Array.isArray(unit.specialRules) && unit.specialRules.length > 0 
      ? `specialRules: [${unit.specialRules.filter(Boolean).map(rule => `"${rule.trim()}"`).join(', ')}],` 
      : '';
    
    const command = unit.command && Number(unit.command) > 0 
      ? `command: ${Number(unit.command)},` 
      : '';
    
    // Add faction_id to generated code  
    const faction_id = unit.faction_id 
      ? `faction_id: "${unit.faction_id}",` 
      : '';
    
    return `
  {
    id: "${unit.id}",
    name: "${unit.name}",
    pointsCost: ${Number(unit.pointsCost)},
    faction: "${faction}",
    ${faction_id}
    keywords: [
      ${keywords}
    ],
    highCommand: ${typeof unit.highCommand === 'boolean' ? unit.highCommand : unit.highCommand.toString().toLowerCase() === 'yes'},
    availability: ${Number(unit.availability)},
    ${specialRules}
    ${command}
    imageUrl: "/art/card/${unit.id}_card.jpg"
  }`;
  }).join(',');

  return `
import { Unit } from "@/types/army";

export const ${faction.replace(/-/g, '')}Troops: Unit[] = [${formattedUnits}
];
`;
};

/**
 * Get faction ID from file name
 */
export const getFactionIdFromFileName = (fileName: string): string => {
  return fileName.replace('.csv', '').toLowerCase().replace(/\s+/g, '-');
};

/**
 * Normalize faction name for consistency
 */
export const normalizeFactionName = (factionName: string): string => {
  const lowerFaction = factionName.toLowerCase();
  
  // Map of known faction name variations to standardized names
  const factionMap: Record<string, string> = {
    'scions of taldabaoth': 'scions-of-yaldabaoth',
    'scions of yaldabaoth': 'scions-of-yaldabaoth',
    'scions-of-taldabaoth': 'scions-of-yaldabaoth',
    'the syenann': 'syenann',
    'syenann': 'syenann',
    'northern tribes': 'northern-tribes',
    'northern-tribes': 'northern-tribes',
    'hegemony of embersig': 'hegemony-of-embersig',
    'hegemony-of-embersig': 'hegemony-of-embersig'
  };
  
  return factionMap[lowerFaction] || lowerFaction.replace(/\s+/g, '-');
};
