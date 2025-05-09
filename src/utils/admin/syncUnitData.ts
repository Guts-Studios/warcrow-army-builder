
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface SyncStats {
  units: number;
  keywords: number;
  specialRules: number;
  characteristics: number;
  errors: string[];
  files: { [key: string]: string }; // Store generated file content
}

/**
 * Syncs all unit data from Supabase to static files
 * This function is intended to be used only in admin-facing components
 */
export const syncUnitDataToFiles = async (): Promise<SyncStats> => {
  const stats: SyncStats = {
    units: 0,
    keywords: 0, 
    specialRules: 0,
    characteristics: 0,
    errors: [],
    files: {}
  };
  
  try {
    // 1. Fetch all unit data from Supabase
    const { data: units, error: unitsError } = await supabase
      .from('unit_data')
      .select('*')
      .order('name');
      
    if (unitsError) {
      stats.errors.push(`Failed to fetch units: ${unitsError.message}`);
      return stats;
    }
    
    stats.units = units?.length || 0;
    
    // 2. Fetch keywords
    const { data: keywords, error: keywordsError } = await supabase
      .from('unit_keywords')
      .select('*')
      .order('name');
      
    if (keywordsError) {
      stats.errors.push(`Failed to fetch keywords: ${keywordsError.message}`);
    } else {
      stats.keywords = keywords?.length || 0;
    }
    
    // 3. Fetch special rules
    const { data: specialRules, error: rulesError } = await supabase
      .from('special_rules')
      .select('*')
      .order('name');
      
    if (rulesError) {
      stats.errors.push(`Failed to fetch special rules: ${rulesError.message}`);
    } else {
      stats.specialRules = specialRules?.length || 0;
    }
    
    // 4. Fetch characteristics
    const { data: characteristics, error: charError } = await supabase
      .from('unit_characteristics')
      .select('*')
      .order('name');
      
    if (charError) {
      stats.errors.push(`Failed to fetch characteristics: ${charError.message}`);
    } else {
      stats.characteristics = characteristics?.length || 0;
    }

    // 5. Generate files for different faction units
    if (units && units.length > 0) {
      // Group units by faction
      const factionGroups = units.reduce((acc, unit) => {
        const faction = unit.faction;
        if (!acc[faction]) {
          acc[faction] = [];
        }
        acc[faction].push(unit);
        return acc;
      }, {} as Record<string, any[]>);
      
      // Generate files for each faction
      for (const [faction, factionUnits] of Object.entries(factionGroups)) {
        const fileName = `${faction}-units.json`;
        const content = generateStaticDataFiles(factionUnits, 'units');
        stats.files[fileName] = content;
      }
      
      // Generate keywords file
      if (keywords && keywords.length > 0) {
        const content = generateStaticDataFiles(keywords, 'keywords');
        stats.files['keywords.json'] = content;
      }
      
      // Generate special rules file
      if (specialRules && specialRules.length > 0) {
        const content = generateStaticDataFiles(specialRules, 'special-rules');
        stats.files['special-rules.json'] = content;
      }
      
      // Generate characteristics file
      if (characteristics && characteristics.length > 0) {
        const content = generateStaticDataFiles(characteristics, 'characteristics');
        stats.files['characteristics.json'] = content;
      }
      
      console.log("Unit data sync complete:", stats);
    }

    return stats;
  } catch (error: any) {
    stats.errors.push(`Sync failed: ${error.message || 'Unknown error'}`);
    console.error("Data sync error:", error);
    return stats;
  }
};

/**
 * Generates static data files for the specified data type
 * In a production environment, this would write to the filesystem
 * For this demo, we're returning the JSON content as a string
 */
export const generateStaticDataFiles = (data: any, type: 'units' | 'keywords' | 'special-rules' | 'characteristics'): string => {
  const formattedData = formatDataForExport(data, type);
  return JSON.stringify(formattedData, null, 2);
};

/**
 * Formats the data based on the type for export
 */
const formatDataForExport = (data: any[], type: 'units' | 'keywords' | 'special-rules' | 'characteristics'): any => {
  switch (type) {
    case 'units':
      return data.map(unit => ({
        id: unit.id,
        name: unit.name,
        faction: unit.faction,
        pointsCost: unit.points,
        type: unit.type,
        keywords: unit.keywords,
        specialRules: unit.special_rules,
        characteristics: unit.characteristics
      }));
    
    case 'keywords':
      return data.reduce((acc: Record<string, string>, keyword) => {
        acc[keyword.name] = keyword.description;
        return acc;
      }, {});
      
    case 'special-rules':
      return data.reduce((acc: Record<string, string>, rule) => {
        acc[rule.name] = rule.description;
        return acc;
      }, {});
      
    case 'characteristics':
      return data.reduce((acc: Record<string, string>, char) => {
        acc[char.name] = char.description;
        return acc;
      }, {});
      
    default:
      return data;
  }
};
