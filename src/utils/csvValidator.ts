
import Papa from 'papaparse';

export interface CsvUnit {
  name: string;
  faction: string;
  pointsCost: number;
  availability: number;
  command?: number;
  highCommand: boolean;
  keywords: string[];
  specialRules: string[];
  characteristics: string[];
}

export interface UnitMismatch {
  field: string;
  staticValue: any;
  csvValue: any;
}

// Parse CSV content into structured units
export const parseCsvContent = async (csvContent: string): Promise<CsvUnit[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const units = results.data
            .filter((row: any) => row['Unit Name'] && row['Unit Name'].trim())
            .map((row: any) => processCsvRow(row));
          
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

// Process a single CSV row into a CsvUnit
const processCsvRow = (row: any): CsvUnit => {
  // Parse characteristics and keywords using bracket format
  const rawCharacteristics = parseDelimitedFieldWithBrackets(row.Characteristics || '');
  const rawKeywords = parseDelimitedFieldWithBrackets(row.Keywords || '');
  
  // Known characteristics that should be treated as characteristics, not keywords
  const KNOWN_CHARACTERISTICS = ['Vulnerable', 'Elite', 'Experienced', 'Veteran'];
  
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
  const specialRules = parseDelimitedFieldWithBrackets(row['Special Rules'] || '');

  return {
    name: row['Unit Name'],
    faction: row.Faction || '',
    pointsCost,
    availability,
    command,
    highCommand,
    keywords,
    specialRules,
    characteristics
  };
};

// Parse bracket-enclosed fields with smart comma handling
const parseDelimitedFieldWithBrackets = (field: string): string[] => {
  if (!field || field.trim() === '') return [];
  
  let trimmedField = field.trim();
  
  // Check if the field is enclosed in brackets
  if (trimmedField.startsWith('[') && trimmedField.endsWith(']')) {
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

// Compare a static unit with a CSV unit
export const compareUnitWithCsv = (staticUnit: any, csvUnit: CsvUnit): UnitMismatch[] => {
  const mismatches: UnitMismatch[] = [];
  
  // Check points cost
  if (staticUnit.pointsCost !== csvUnit.pointsCost) {
    mismatches.push({
      field: 'pointsCost',
      staticValue: staticUnit.pointsCost,
      csvValue: csvUnit.pointsCost
    });
  }
  
  // Check availability
  if (staticUnit.availability !== csvUnit.availability) {
    mismatches.push({
      field: 'availability',
      staticValue: staticUnit.availability,
      csvValue: csvUnit.availability
    });
  }
  
  // Check high command
  if (Boolean(staticUnit.highCommand) !== csvUnit.highCommand) {
    mismatches.push({
      field: 'highCommand',
      staticValue: Boolean(staticUnit.highCommand),
      csvValue: csvUnit.highCommand
    });
  }
  
  // Check command
  if (staticUnit.command !== csvUnit.command) {
    mismatches.push({
      field: 'command',
      staticValue: staticUnit.command,
      csvValue: csvUnit.command
    });
  }
  
  return mismatches;
};

// Find matching unit by name (case-insensitive)
export const findMatchingUnit = (csvUnit: CsvUnit, staticUnits: any[]): any | null => {
  return staticUnits.find(staticUnit => 
    staticUnit.name.toLowerCase() === csvUnit.name.toLowerCase()
  ) || null;
};

// Get the expected CSV file path for a faction
export const getFactionCsvPath = (factionId: string): string => {
  const csvFileMap: Record<string, string> = {
    'northern-tribes': 'Northern Tribes.csv',
    'syenann': 'The Syenann.csv',
    'hegemony-of-embersig': 'Hegemony of Embersig.csv',
    'scions-of-yaldabaoth': 'Scions of Taldabaoth.csv'
  };
  
  const fileName = csvFileMap[factionId];
  return fileName ? `/data/reference-csv/units/${fileName}` : '';
};

// Check if a CSV file exists
export const checkCsvFileExists = async (filePath: string): Promise<boolean> => {
  try {
    const response = await fetch(filePath);
    return response.ok;
  } catch (error) {
    return false;
  }
};

// Load a CSV file and return its content
export const loadCsvFile = async (filePath: string): Promise<string> => {
  const response = await fetch(filePath);
  if (!response.ok) {
    throw new Error(`Failed to load CSV file: ${response.status} ${response.statusText}`);
  }
  return await response.text();
};
