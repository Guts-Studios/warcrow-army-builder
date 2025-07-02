
import Papa from 'papaparse';

export interface CsvUnit {
  faction_id: string;
  Faction: string;
  'Unit Type': string;
  'Unit Name EN': string;
  'Unit Name SP': string;
  Command: string;
  AVB: string;
  Characteristics: string;
  Keywords: string;
  'High Command': string;
  'Points Cost': string;
  'Special Rules': string;
  Companion?: string;
  'Tournament Legal': string;
}

export interface StaticUnit {
  id: string;
  name: string;
  name_es?: string;
  name_fr?: string;
  faction: string;
  faction_id: string;
  pointsCost: number;
  availability: number;
  command: number;
  keywords: Array<{ name: string }>;
  specialRules: string[];
  highCommand: boolean;
  tournamentLegal: boolean;
  imageUrl?: string;
}

// Load CSV data for a specific faction
export const loadFactionCsvData = async (factionId: string): Promise<CsvUnit[]> => {
  const factionFileMap: Record<string, string> = {
    'syenann': 'The Syenann.csv',
    'northern-tribes': 'Northern Tribes.csv', 
    'hegemony-of-embersig': 'Hegemony of Embersig.csv',
    'scions-of-yaldabaoth': 'Scions of Yaldabaoth.csv'
  };

  const fileName = factionFileMap[factionId];
  if (!fileName) {
    console.warn(`No CSV file found for faction: ${factionId}`);
    return [];
  }

  try {
    console.log(`[loadFactionCsvData] Loading CSV for faction: ${factionId}, file: ${fileName}`);
    const response = await fetch(`/data/reference-csv/units/${fileName}?t=${Date.now()}`); // Add cache busting
    if (!response.ok) {
      console.warn(`Failed to load CSV for faction ${factionId}: ${response.status}`);
      return [];
    }

    const csvText = await response.text();
    const parsed = Papa.parse<CsvUnit>(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim()
    });

    if (parsed.errors.length > 0) {
      console.warn(`CSV parsing errors for ${factionId}:`, parsed.errors);
    }

    console.log(`[loadFactionCsvData] Loaded ${parsed.data.length} units for ${factionId}`);
    console.log(`[loadFactionCsvData] First few units:`, parsed.data.slice(0, 3).map(u => ({ name: u['Unit Name EN'], tournamentLegal: u['Tournament Legal'] })));
    return parsed.data.filter(unit => unit['Unit Name EN']?.trim());
  } catch (error) {
    console.error(`Error loading CSV for faction ${factionId}:`, error);
    return [];
  }
};

// Convert CSV unit to static unit format
export const csvUnitToStaticUnit = (csvUnit: CsvUnit): StaticUnit => {
  // Parse keywords from string format like "[Infantry, Elf, Syenann]"
  const parseKeywords = (keywordsStr: string): Array<{ name: string }> => {
    if (!keywordsStr || keywordsStr.trim() === '[]') return [];
    
    try {
      // Remove brackets and split by comma
      const cleaned = keywordsStr.replace(/[\[\]]/g, '').trim();
      if (!cleaned) return [];
      
      return cleaned.split(',').map(k => ({ name: k.trim() })).filter(k => k.name);
    } catch (error) {
      console.warn('Error parsing keywords:', keywordsStr, error);
      return [];
    }
  };

  // Parse special rules from string format like "[Rule1, Rule2]"
  const parseSpecialRules = (rulesStr: string): string[] => {
    if (!rulesStr || rulesStr.trim() === '[]') return [];
    
    try {
      const cleaned = rulesStr.replace(/[\[\]]/g, '').trim();
      if (!cleaned) return [];
      
      return cleaned.split(',').map(r => r.trim()).filter(r => r);
    } catch (error) {
      console.warn('Error parsing special rules:', rulesStr, error);
      return [];
    }
  };

  // Parse tournament legal status - handle various formats
  const parseTournamentLegal = (tournamentLegalStr: string): boolean => {
    if (!tournamentLegalStr) return true; // Default to true if not specified
    
    const cleaned = tournamentLegalStr.toString().toLowerCase().trim();
    
    // Handle various representations of false
    if (cleaned === 'false' || cleaned === 'no' || cleaned === '0' || cleaned === 'f') {
      return false;
    }
    
    // Handle various representations of true
    if (cleaned === 'true' || cleaned === 'yes' || cleaned === '1' || cleaned === 't') {
      return true;
    }
    
    // Default to true for any other value
    console.log(`[csvUnitToStaticUnit] Unknown tournament legal value: "${tournamentLegalStr}" for unit ${csvUnit['Unit Name EN']}, defaulting to true`);
    return true;
  };

  const unitName = csvUnit['Unit Name EN']?.trim() || '';
  const unitNameEs = csvUnit['Unit Name SP']?.trim() || '';
  
  // Create URL-friendly ID
  const id = unitName.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  const tournamentLegal = parseTournamentLegal(csvUnit['Tournament Legal']);
  
  // Log tournament legal parsing for debugging
  console.log(`[csvUnitToStaticUnit] Unit: ${unitName}, Tournament Legal raw: "${csvUnit['Tournament Legal']}", parsed: ${tournamentLegal}`);

  return {
    id,
    name: unitName,
    name_es: unitNameEs || undefined,
    faction: csvUnit.faction_id || csvUnit.Faction,
    faction_id: csvUnit.faction_id || csvUnit.Faction,
    pointsCost: parseInt(csvUnit['Points Cost']) || 0,
    availability: parseInt(csvUnit.AVB) || 0,
    command: parseInt(csvUnit.Command) || 0,
    keywords: parseKeywords(csvUnit.Keywords || csvUnit.Characteristics || ''),
    specialRules: parseSpecialRules(csvUnit['Special Rules'] || ''),
    highCommand: csvUnit['High Command']?.toLowerCase().trim() === 'yes',
    tournamentLegal,
    imageUrl: `/art/portrait/${id}_portrait.jpg`
  };
};

// Load all faction data and convert to static units
export const loadAllFactionData = async (): Promise<StaticUnit[]> => {
  const factionIds = ['syenann', 'northern-tribes', 'hegemony-of-embersig', 'scions-of-yaldabaoth'];
  const allUnits: StaticUnit[] = [];

  for (const factionId of factionIds) {
    try {
      const csvUnits = await loadFactionCsvData(factionId);
      const staticUnits = csvUnits.map(csvUnitToStaticUnit);
      allUnits.push(...staticUnits);
      
      // Log tournament legal status for debugging
      const tournamentIllegalCount = staticUnits.filter(u => !u.tournamentLegal).length;
      console.log(`[loadAllFactionData] ${factionId}: ${staticUnits.length} total units, ${tournamentIllegalCount} tournament illegal`);
    } catch (error) {
      console.error(`Error loading faction ${factionId}:`, error);
    }
  }

  console.log(`[loadAllFactionData] Total units loaded: ${allUnits.length}`);
  return allUnits;
};

// Generate TypeScript file content for units
export const generateUnitFileContent = (units: StaticUnit[], factionId: string, type: string): string => {
  const factionName = factionId.replace(/-/g, '');
  const content = `import { Unit } from "@/types/army";

export const ${factionName}${type.charAt(0).toUpperCase() + type.slice(1)}: Unit[] = [
${units.map(unit => `  {
    id: "${unit.id}",
    name: "${unit.name}",
    ${unit.name_es ? `name_es: "${unit.name_es}",` : ''}
    ${unit.name_fr ? `name_fr: "${unit.name_fr}",` : ''}
    faction: "${unit.faction}",
    faction_id: "${unit.faction_id}",
    pointsCost: ${unit.pointsCost},
    availability: ${unit.availability},
    command: ${unit.command},
    keywords: ${JSON.stringify(unit.keywords, null, 2).replace(/\n/g, '\n    ')},
    specialRules: ${JSON.stringify(unit.specialRules)},
    highCommand: ${unit.highCommand},
    tournamentLegal: ${unit.tournamentLegal},
    imageUrl: "${unit.imageUrl}"
  }`).join(',\n')}
];
`;
  return content;
};

// Generate all faction files
export const generateFactionFiles = async (factionId: string) => {
  const csvUnits = await loadFactionCsvData(factionId);
  const staticUnits = csvUnits.map(csvUnitToStaticUnit);
  
  // Categorize units
  const troops = staticUnits.filter(unit => 
    !unit.keywords.some(k => 
      (typeof k === 'string' ? k : k.name).toLowerCase() === 'character'
    ) && !unit.highCommand
  );
  
  const characters = staticUnits.filter(unit => 
    unit.keywords.some(k => 
      (typeof k === 'string' ? k : k.name).toLowerCase() === 'character'
    ) && !unit.highCommand
  );
  
  const highCommand = staticUnits.filter(unit => unit.highCommand);
  
  const companions = staticUnits.filter(unit => 
    unit.keywords.some(k => 
      (typeof k === 'string' ? k : k.name).toLowerCase() === 'companion'
    )
  );

  return {
    troops: generateUnitFileContent(troops, factionId, 'troops'),
    characters: generateUnitFileContent(characters, factionId, 'characters'), 
    highCommand: generateUnitFileContent(highCommand, factionId, 'highCommand'),
    companions: generateUnitFileContent(companions, factionId, 'companions'),
    index: `import { ${factionId.replace(/-/g, '')}Troops } from "./troops";
import { ${factionId.replace(/-/g, '')}Characters } from "./characters";
import { ${factionId.replace(/-/g, '')}HighCommand } from "./highCommand";

export const ${factionId.replace(/-/g, '')}Units = [
  ...${factionId.replace(/-/g, '')}Troops,
  ...${factionId.replace(/-/g, '')}Characters,
  ...${factionId.replace(/-/g, '')}HighCommand
];
`
  };
};

// Validate CSV vs static data sync
export const validateCsvStaticSync = async (factionId: string, staticUnits: any[]) => {
  const csvUnits = await loadFactionCsvData(factionId);
  const csvStaticUnits = csvUnits.map(csvUnitToStaticUnit);
  
  const missingInStatic = csvStaticUnits.filter(csvUnit => 
    !staticUnits.find(staticUnit => staticUnit.id === csvUnit.id)
  );
  
  const extraInStatic = staticUnits.filter(staticUnit => 
    !csvStaticUnits.find(csvUnit => csvUnit.id === staticUnit.id)
  );
  
  const mismatches: any[] = [];
  csvStaticUnits.forEach(csvUnit => {
    const staticUnit = staticUnits.find(u => u.id === csvUnit.id);
    if (staticUnit) {
      if (staticUnit.pointsCost !== csvUnit.pointsCost) {
        mismatches.push({
          unit: csvUnit.name,
          field: 'pointsCost',
          csvValue: csvUnit.pointsCost,
          staticValue: staticUnit.pointsCost
        });
      }
      if (staticUnit.tournamentLegal !== csvUnit.tournamentLegal) {
        mismatches.push({
          unit: csvUnit.name,
          field: 'tournamentLegal',
          csvValue: csvUnit.tournamentLegal,
          staticValue: staticUnit.tournamentLegal
        });
      }
    }
  });
  
  return { missingInStatic, extraInStatic, mismatches };
};
