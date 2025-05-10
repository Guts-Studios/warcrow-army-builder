
import { supabase } from "@/integrations/supabase/client";

export const factionTranslations = {
  'hegemony-of-embersig': {
    en: 'Hegemony',
    es: 'Hegemonía',
    fr: 'Hégémonie'
  },
  'northern-tribes': {
    en: 'Northern Tribes',
    es: 'Tribus del Norte',
    fr: 'Tribus du Nord'
  },
  'scions-of-yaldabaoth': {
    en: 'Scions',
    es: 'Vástagos',
    fr: 'Rejetons'
  },
  'syenann': {
    en: 'Syenann',
    es: 'Syenann',
    fr: 'Syenann'
  },
  // Add backward compatibility for old keys
  hegemony: {
    en: 'Hegemony',
    es: 'Hegemonía',
    fr: 'Hégémonie'
  },
  tribes: {
    en: 'Northern Tribes',
    es: 'Tribus del Norte',
    fr: 'Tribus du Nord'
  },
  scions: {
    en: 'Scions',
    es: 'Vástagos',
    fr: 'Rejetons'
  }
};

// Function to get faction translations from Supabase
export const getFactionTranslationsFromDb = async () => {
  try {
    const { data, error } = await supabase
      .from('factions')
      .select('*');
      
    if (error) {
      console.error('Error fetching faction translations:', error);
      return factionTranslations; // Return default translations if there's an error
    }
    
    if (data && data.length > 0) {
      // Create a new translations object
      const dbTranslations: Record<string, Record<string, string>> = {};
      
      // Populate translations from database
      data.forEach(faction => {
        dbTranslations[faction.id] = {
          en: faction.name,
          es: faction.name_es || faction.name,
          fr: faction.name_fr || faction.name
        };
      });
      
      // Merge with backwards compatibility entries
      return { ...dbTranslations, ...factionTranslations };
    }
    
    return factionTranslations;
  } catch (error) {
    console.error('Failed to fetch faction translations:', error);
    return factionTranslations;
  }
};
