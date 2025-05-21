
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
  keywords: string;
  specialRules?: string;
  highCommand: string;
  command?: string;
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
  
  // Check name
  if (staticUnit.name !== csvUnit.name) {
    mismatches.push({
      field: 'name',
      staticValue: staticUnit.name,
      csvValue: csvUnit.name
    });
  }
  
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
  const csvHighCommand = csvUnit.highCommand.toLowerCase() === 'yes';
  if (Boolean(staticUnit.highCommand) !== csvHighCommand) {
    mismatches.push({
      field: 'highCommand',
      staticValue: Boolean(staticUnit.highCommand),
      csvValue: csvHighCommand
    });
  }
  
  // Check keywords (simplified comparison)
  const staticKeywords = staticUnit.keywords.map((k: any) => typeof k === 'string' ? k : k.name).sort().join(',');
  const csvKeywordsList = csvUnit.keywords.split(',').map(k => k.trim()).sort().join(',');
  
  if (staticKeywords !== csvKeywordsList) {
    mismatches.push({
      field: 'keywords',
      staticValue: staticKeywords,
      csvValue: csvKeywordsList
    });
  }
  
  // Check special rules
  const staticRules = (staticUnit.specialRules || []).sort().join(',');
  const csvRules = csvUnit.specialRules ? csvUnit.specialRules.split(',').map(r => r.trim()).sort().join(',') : '';
  
  if (staticRules !== csvRules) {
    mismatches.push({
      field: 'specialRules',
      staticValue: staticRules,
      csvValue: csvRules
    });
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
