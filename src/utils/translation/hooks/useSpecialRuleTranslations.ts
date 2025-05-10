import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useSpecialRuleTranslations = () => {
  const [specialRuleTranslations, setSpecialRuleTranslations] = useState<Record<string, Record<string, string>>>({});
  const [specialRuleDescriptions, setSpecialRuleDescriptions] = useState<Record<string, Record<string, string>>>({});

  useEffect(() => {
    const fetchSpecialRules = async () => {
      const { data: rulesData, error: rulesError } = await supabase
        .from('special_rules')
        .select('*');
      
      if (!rulesError && rulesData) {
        const translations: Record<string, Record<string, string>> = {};
        const descriptions: Record<string, Record<string, string>> = {};
        
        rulesData.forEach(item => {
          if (!translations[item.name]) {
            translations[item.name] = { 'en': item.name };
          }
          
          // Use the same name for all languages if translations not available
          // This ensures we don't lose the special rule name
          translations[item.name]['es'] = item.name;
          translations[item.name]['fr'] = item.name;
          
          // Store descriptions separately
          if (!descriptions[item.name]) {
            descriptions[item.name] = { 'en': item.description || '' };
          }
          
          if (item.description_es) descriptions[item.name]['es'] = item.description_es;
          if (item.description_fr) descriptions[item.name]['fr'] = item.description_fr;
        });
        
        setSpecialRuleTranslations(translations);
        setSpecialRuleDescriptions(descriptions);
      }
    };

    fetchSpecialRules();
  }, []);

  const translateSpecialRule = (rule: string, language: string): string => {
    if (!rule || language === 'en') return rule;
    return specialRuleTranslations[rule]?.[language] || rule;
  };

  const translateSpecialRuleDescription = (rule: string, language: string): string => {
    if (!rule) return '';
    
    // First try to get the English description as the base
    const englishDescription = specialRuleDescriptions[rule]?.['en'] || '';
    
    // If language is English or no translation exists, return the English description
    if (language === 'en') {
      return englishDescription;
    }
    
    // Otherwise, return the requested language if available or default to English
    return specialRuleDescriptions[rule]?.[language] || englishDescription || '';
  };

  return {
    translateSpecialRule,
    translateSpecialRuleDescription
  };
};
