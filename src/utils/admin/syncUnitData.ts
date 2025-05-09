
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface SyncStats {
  units: number;
  keywords: number;
  specialRules: number;
  characteristics: number;
  errors: string[];
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
    errors: []
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

    // Generate files for different faction units
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
      
      // In a full implementation, we would write to the file system here
      // Since we can't directly write to the filesystem in the browser,
      // we can provide downloadable files or a preview

      console.log("Unit data sync complete:", stats);
      console.log("Faction groups:", factionGroups);
    }

    return stats;
  } catch (error: any) {
    stats.errors.push(`Sync failed: ${error.message || 'Unknown error'}`);
    console.error("Data sync error:", error);
    return stats;
  }
};

/**
 * In a real application, we would properly generate and write files
 * This function is a placeholder for that functionality
 */
export const generateStaticDataFiles = (data: any, type: 'units' | 'keywords' | 'special-rules' | 'characteristics') => {
  // This would generate the file content and write it to the file system
  // For now, we'll just return the data as JSON
  return JSON.stringify(data, null, 2);
};
