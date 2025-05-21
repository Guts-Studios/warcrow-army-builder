
import { useState } from 'react';
import { specialRuleTranslations } from '@/data/specialRuleTranslations';
import { specialRuleDefinitions } from "@/data/specialRuleDefinitions";
import { supabase } from '@/integrations/supabase/client';

export const useSpecialRuleTranslations = () => {
  const [dbTranslations, setDbTranslations] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  const fetchTranslations = async () => {
    if (Object.keys(dbTranslations).length > 0) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('special_rules')
        .select('name, name_es, name_fr, description, description_es, description_fr');
      
      if (error) {
        console.error('Error fetching special rule translations:', error);
        return;
      }
      
      const translations: Record<string, any> = {};
      if (data) {
        data.forEach((rule) => {
          translations[rule.name] = rule;
        });
      }
      
      setDbTranslations(translations);
    } catch (err) {
      console.error('Failed to fetch special rule translations:', err);
    } finally {
      setLoading(false);
    }
  };

  const translateSpecialRule = (rule: string, language: string = 'en'): string => {
    if (!rule || language === 'en') return rule;
    
    // For special rules, handle parameter sections separately
    const basePart = rule.split('(')[0].trim();
    const params = rule.includes('(') ? rule.substring(rule.indexOf('(')) : '';
    
    // First try to get translation from database
    if (Object.keys(dbTranslations).length > 0 && dbTranslations[basePart]) {
      const dbRule = dbTranslations[basePart];
      const translatedName = language === 'es' ? dbRule.name_es : dbRule.name_fr;
      if (translatedName) {
        return translatedName + (params ? ' ' + params : '');
      }
    }
    
    // Fall back to static translations
    const translatedBase = specialRuleTranslations[basePart]?.[language as 'en' | 'es' | 'fr'] || basePart;
    
    // Return the translated base with parameters if they exist
    return translatedBase + (params ? ' ' + params : '');
  };

  const translateSpecialRuleDescription = (rule: string, language: string = 'en'): string => {
    if (!rule) return '';
    
    // Extract base rule name without parameters
    const baseRule = rule.split('(')[0].trim();
    
    // First try to get description from database
    if (Object.keys(dbTranslations).length > 0 && dbTranslations[baseRule]) {
      const dbRule = dbTranslations[baseRule];
      const descKey = language === 'es' ? 'description_es' : language === 'fr' ? 'description_fr' : 'description';
      if (dbRule[descKey]) {
        return dbRule[descKey];
      }
    }
    
    // Get the description based on language from static translations
    const descriptionKey = `description_${language}` as 'description_en' | 'description_es' | 'description_fr';
    const fallbackKey = 'description_en';
    
    // Try from translations first, then fall back to English description or definition
    const description = specialRuleTranslations[baseRule]?.[descriptionKey] || 
                        specialRuleTranslations[baseRule]?.[fallbackKey] ||
                        specialRuleDefinitions[baseRule] || '';
    
    return description;
  };

  return {
    translateSpecialRule,
    translateSpecialRuleDescription,
    fetchTranslations,
    loading
  };
};
