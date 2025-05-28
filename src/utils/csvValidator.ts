
// Utility functions for CSV validation and file loading

export const getFactionCsvPath = (factionId: string): string => {
  const factionFileMap: Record<string, string> = {
    'syenann': 'The Syenann.csv',
    'northern-tribes': 'Northern Tribes.csv',
    'hegemony-of-embersig': 'Hegemony of Embersig.csv',
    'scions-of-yaldabaoth': 'Scions of Taldabaoth.csv'
  };
  
  const fileName = factionFileMap[factionId];
  if (!fileName) {
    throw new Error(`No CSV file mapping for faction: ${factionId}`);
  }
  
  return `/data/reference-csv/units/${fileName}`;
};

export const checkCsvFileExists = async (filePath: string): Promise<boolean> => {
  try {
    const response = await fetch(filePath, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error(`Error checking if CSV file exists at ${filePath}:`, error);
    return false;
  }
};

export const loadCsvFile = async (filePath: string): Promise<string> => {
  console.log(`Attempting to load CSV from: ${filePath}`);
  
  const response = await fetch(filePath);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`CSV file not found at ${filePath}. Status: ${response.status}`);
    }
    throw new Error(`Failed to load CSV file: ${response.status} ${response.statusText}`);
  }
  
  return await response.text();
};

export interface CsvUnit {
  Faction: string;
  'Unit Type': string;
  'Unit Name': string;
  Command: string;
  AVB: string;
  Characteristics: string;
  Keywords: string;
  'High Command': string;
  'Points Cost': string;
  'Special Rules': string;
  Companion: string;
  name?: string;
  type?: string;
  pointsCost?: number;
  commandValue?: number;
  avbValue?: number;
}

export const parseCsvContent = async (csvContent: string): Promise<CsvUnit[]> => {
  return new Promise((resolve, reject) => {
    const lines = csvContent.split('\n');
    if (lines.length < 2) {
      reject(new Error('CSV file appears to be empty or invalid'));
      return;
    }
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const units: CsvUnit[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      if (values.length !== headers.length) continue;
      
      const unit: any = {};
      headers.forEach((header, index) => {
        unit[header] = values[index];
      });
      
      // Add normalized properties
      unit.name = unit['Unit Name'];
      unit.type = unit['Unit Type'];
      unit.pointsCost = parseInt(unit['Points Cost']) || 0;
      unit.commandValue = parseInt(unit.Command) || 0;
      unit.avbValue = parseInt(unit.AVB) || 0;
      
      units.push(unit);
    }
    
    resolve(units);
  });
};

export const compareUnitWithCsv = (staticUnit: any, csvUnit: CsvUnit): Array<{field: string, staticValue: any, csvValue: any}> => {
  const mismatches: Array<{field: string, staticValue: any, csvValue: any}> = [];
  
  // Compare name
  if (staticUnit.name !== csvUnit.name) {
    mismatches.push({
      field: 'name',
      staticValue: staticUnit.name,
      csvValue: csvUnit.name
    });
  }
  
  // Compare points cost
  if (staticUnit.pointsCost !== csvUnit.pointsCost) {
    mismatches.push({
      field: 'pointsCost',
      staticValue: staticUnit.pointsCost,
      csvValue: csvUnit.pointsCost
    });
  }
  
  // Compare command value
  if (staticUnit.commandValue !== csvUnit.commandValue) {
    mismatches.push({
      field: 'commandValue',
      staticValue: staticUnit.commandValue,
      csvValue: csvUnit.commandValue
    });
  }
  
  // Compare AVB value
  if (staticUnit.avbValue !== csvUnit.avbValue) {
    mismatches.push({
      field: 'avbValue',
      staticValue: staticUnit.avbValue,
      csvValue: csvUnit.avbValue
    });
  }
  
  return mismatches;
};

export const findMatchingUnit = (csvUnit: CsvUnit, staticUnits: any[]): any | null => {
  // First try exact name match
  let match = staticUnits.find(unit => 
    unit.name.toLowerCase() === csvUnit.name?.toLowerCase()
  );
  
  if (match) return match;
  
  // Try fuzzy matching by removing common prefixes/suffixes
  const normalizedCsvName = csvUnit.name?.toLowerCase()
    .replace(/^(the|a)\s+/, '')
    .replace(/\s+(unit|troops?|warriors?)$/, '')
    .trim();
  
  match = staticUnits.find(unit => {
    const normalizedStaticName = unit.name.toLowerCase()
      .replace(/^(the|a)\s+/, '')
      .replace(/\s+(unit|troops?|warriors?)$/, '')
      .trim();
    return normalizedStaticName === normalizedCsvName;
  });
  
  return match || null;
};
