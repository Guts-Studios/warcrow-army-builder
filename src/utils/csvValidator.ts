/**
 * Utility functions for CSV validation
 */
import Papa from 'papaparse';
import { normalizeFactionId } from './unitManagement';

export type CsvUnit = {
  id: string;
  name: string;
  faction: string;
  faction_id?: string;
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
        console.log('CSV parsing raw results:', results.data.slice(0, 2));
        
        // Map the parsed data to our CsvUnit type
        const units = results.data
          .filter((row: any) => row.name || row['Unit Name'] || row.id) // Filter out empty rows
          .map((row: any) => {
            // Log first couple of rows to help debug
            if (results.data.indexOf(row) < 2) {
              console.log('Processing CSV row:', row);
            }
            
            // Helper function to safely parse field values
            const parseField = (value: any) => {
              if (!value || value === 'null' || value === 'undefined') return '';
              return value;
            };
            
            // Explicitly check for faction_id first
            const factionId = parseField(row['faction_id'] || row['Faction ID']);
            const normalizedFactionId = factionId ? normalizeFactionId(factionId) : '';
            
            const faction = parseField(row.Faction || row.faction);
            const normalizedFaction = faction ? normalizeFactionId(faction) : '';
            
            // Parse keywords, handling nulls and empty strings
            const parseKeywords = (keywordsStr: string) => {
              if (!keywordsStr || keywordsStr === 'null' || keywordsStr === 'undefined') return [];
              return keywordsStr.split(',').map(k => k.trim()).filter(Boolean);
            };
            
            // Parse special rules, handling nulls and empty strings
            const parseSpecialRules = (rulesStr: string) => {
              if (!rulesStr || rulesStr === 'null' || rulesStr === 'undefined') return [];
              return rulesStr.split(',').map(r => r.trim()).filter(Boolean);
            };
            
            // Parse high command value
            const parseHighCommand = (hcValue: string) => {
              if (!hcValue) return false;
              return hcValue.toLowerCase() === 'yes' || hcValue.toLowerCase() === 'true';
            };
            
            return {
              id: parseField(row.id),
              name: parseField(row['Unit Name'] || row.name),
              faction: normalizedFaction,
              faction_id: normalizedFactionId || normalizedFaction, // Make sure faction_id is set
              type: parseField(row['Unit Type'] || row.type),
              pointsCost: parseInt(parseField(row['Points Cost'] || row.pointsCost) || '0', 10) || 0,
              availability: parseInt(parseField(row.AVB || row.availability) || '0', 10) || 0,
              keywords: parseKeywords(parseField(row.Keywords || row.keywords)),
              specialRules: parseSpecialRules(parseField(row['Special Rules'] || row.specialRules)),
              highCommand: parseHighCommand(parseField(row['High Command'] || row.highCommand)),
              command: parseInt(parseField(row.Command || row.command) || '0', 10) || 0
            };
          });
        console.log(`Parsed ${units.length} units from CSV`);
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
  
  // Debug log
  console.log(`Comparing unit: ${staticUnit.name} with CSV unit: ${csvUnit.name}`);
  
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
  
  // Check faction_id if available
  if (csvUnit.faction_id && staticUnit.faction_id !== csvUnit.faction_id) {
    const normalizedStaticFactionId = normalizeFactionId(staticUnit.faction_id || staticUnit.faction);
    const normalizedCsvFactionId = normalizeFactionId(csvUnit.faction_id);
    
    if (normalizedStaticFactionId !== normalizedCsvFactionId) {
      mismatches.push({
        field: 'faction_id',
        staticValue: normalizedStaticFactionId,
        csvValue: normalizedCsvFactionId
      });
    }
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
  // Debug
  console.log(`Finding match for CSV unit: ${csvUnit.name} with faction_id: ${csvUnit.faction_id}`);
  
  // First try to match by ID
  if (csvUnit.id) {
    const matchById = staticUnits.find(unit => unit.id === csvUnit.id);
    if (matchById) {
      console.log(`Matched ${csvUnit.name} by ID`);
      return matchById;
    }
  }
  
  // Then try to match by name and faction_id if available
  if (csvUnit.faction_id) {
    console.log(`Trying to match ${csvUnit.name} by name and faction_id: ${csvUnit.faction_id}`);
    
    const normalizedCsvFactionId = normalizeFactionId(csvUnit.faction_id);
    
    const matchByNameAndFactionId = staticUnits.find(unit => {
      const unitFactionId = unit.faction_id ? normalizeFactionId(unit.faction_id) : '';
      const unitFaction = unit.faction ? normalizeFactionId(unit.faction) : '';
      
      return unit.name.toLowerCase() === csvUnit.name.toLowerCase() && 
             (unitFactionId === normalizedCsvFactionId || unitFaction === normalizedCsvFactionId);
    });
    
    if (matchByNameAndFactionId) {
      console.log(`Matched ${csvUnit.name} by name and faction_id`);
      return matchByNameAndFactionId;
    }
  }
  
  // Then try to match by name (case insensitive)
  const matchByName = staticUnits.find(unit => 
    unit.name.toLowerCase() === csvUnit.name.toLowerCase() &&
    (!csvUnit.faction || normalizeFactionId(unit.faction) === normalizeFactionId(csvUnit.faction))
  );
  
  if (matchByName) {
    console.log(`Matched ${csvUnit.name} by name only`);
  } else {
    console.log(`No match found for ${csvUnit.name}`);
  }
  
  return matchByName;
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
