
/**
 * Utility functions for CSV validation
 */
import Papa from 'papaparse';

export type CsvUnit = {
  id: string;
  name: string;
  faction: string;
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
  
  // Check keywords (simplified comparison)
  if (Array.isArray(staticUnit.keywords) && Array.isArray(csvUnit.keywords)) {
    const staticKeywords = staticUnit.keywords
      .map((k: any) => typeof k === 'string' ? k.toLowerCase() : k.name.toLowerCase())
      .filter(Boolean)
      .sort();
    
    const csvKeywordsList = csvUnit.keywords
      .map(k => k.toLowerCase())
      .filter(Boolean)
      .sort();
    
    // Check if arrays are different
    if (JSON.stringify(staticKeywords) !== JSON.stringify(csvKeywordsList)) {
      mismatches.push({
        field: 'keywords',
        staticValue: staticKeywords,
        csvValue: csvKeywordsList
      });
    }
  }
  
  // Check special rules
  if (Array.isArray(staticUnit.specialRules) && Array.isArray(csvUnit.specialRules)) {
    const staticRules = (staticUnit.specialRules || [])
      .map((r: string) => r.toLowerCase())
      .filter(Boolean)
      .sort();
    
    const csvRules = (csvUnit.specialRules || [])
      .map(r => r.toLowerCase())
      .filter(Boolean)
      .sort();
    
    // Check if arrays are different
    if (JSON.stringify(staticRules) !== JSON.stringify(csvRules)) {
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
 * Create a sample CSV file header
 */
export const getSampleCsvHeader = (): string => {
  return 'id,name,faction,type,pointsCost,availability,keywords,specialRules,highCommand,command';
};

/**
 * Create a sample CSV row from a unit
 */
export const createCsvRowFromUnit = (unit: any): string => {
  const keywords = unit.keywords.map((k: any) => typeof k === 'string' ? k : k.name).join(',');
  const specialRules = (unit.specialRules || []).join(',');
  const highCommand = unit.highCommand ? 'Yes' : 'No';
  
  return `${unit.id},${unit.name},${unit.faction},${unit.type || ''},${unit.pointsCost},${unit.availability},${keywords},${specialRules},${highCommand},${unit.command || ''}`;
};

/**
 * Export units to CSV format
 */
export const exportUnitsToCSV = (units: any[]): string => {
  const header = getSampleCsvHeader();
  const rows = units.map(createCsvRowFromUnit);
  return [header, ...rows].join('\n');
};

/**
 * Generate JavaScript code for a unit file from CSV data
 */
export const generateUnitFileCode = (units: CsvUnit[], faction: string): string => {
  const formattedUnits = units.map(unit => {
    const keywords = unit.keywords.map(keyword => {
      return `{ name: "${keyword}", description: "" }`;
    }).join(",\n      ");
    
    const specialRules = Array.isArray(unit.specialRules) && unit.specialRules.length > 0 
      ? `specialRules: [${unit.specialRules.map(rule => `"${rule}"`).join(', ')}],` 
      : '';
    
    const command = unit.command && Number(unit.command) > 0 
      ? `command: ${Number(unit.command)},` 
      : '';
    
    return `
  {
    id: "${unit.id}",
    name: "${unit.name}",
    pointsCost: ${Number(unit.pointsCost)},
    faction: "${faction}",
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
