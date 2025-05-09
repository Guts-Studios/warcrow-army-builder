
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Custom hook for translating keywords and special rules
 */
export const useTranslateKeyword = () => {
  const [keywordTranslations, setKeywordTranslations] = useState<Record<string, Record<string, string>>>({});
  const [specialRuleTranslations, setSpecialRuleTranslations] = useState<Record<string, Record<string, string>>>({});

  // Fetch translations on mount
  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        // Fetch keyword translations
        const { data: keywordData, error: keywordError } = await supabase
          .from('keywords')
          .select('name, name_es, name_fr, description, description_es, description_fr');
        
        if (keywordError) {
          console.error('Error fetching keyword translations:', keywordError);
        } else if (keywordData) {
          const translations: Record<string, Record<string, string>> = {};
          
          keywordData.forEach(keyword => {
            if (keyword.name) {
              translations[keyword.name] = {
                es: keyword.name_es || keyword.name,
                fr: keyword.name_fr || keyword.name,
                description_en: keyword.description || '',
                description_es: keyword.description_es || keyword.description || '',
                description_fr: keyword.description_fr || keyword.description || ''
              };
            }
          });
          
          setKeywordTranslations(translations);
        }
        
        // Fetch special rule translations
        const { data: specialRuleData, error: specialRuleError } = await supabase
          .from('special_rules')
          .select('name, name_es, name_fr, description, description_es, description_fr');
        
        if (specialRuleError) {
          console.error('Error fetching special rule translations:', specialRuleError);
        } else if (specialRuleData) {
          const translations: Record<string, Record<string, string>> = {};
          
          specialRuleData.forEach(rule => {
            if (rule.name) {
              translations[rule.name] = {
                es: rule.name_es || rule.name,
                fr: rule.name_fr || rule.name,
                description_en: rule.description || '',
                description_es: rule.description_es || rule.description || '',
                description_fr: rule.description_fr || rule.description || ''
              };
            }
          });
          
          setSpecialRuleTranslations(translations);
        }
      } catch (error) {
        console.error('Error in translation fetch:', error);
      }
    };
    
    fetchTranslations();
  }, []);

  // Function to translate a keyword to the specified language
  const translateKeyword = useCallback((keyword: string, language: string): string => {
    if (language === 'en' || !keyword) return keyword;
    
    const translation = keywordTranslations[keyword]?.[language];
    return translation || keyword;
  }, [keywordTranslations]);

  // Function to translate a special rule to the specified language
  const translateSpecialRule = useCallback((rule: string, language: string): string => {
    if (language === 'en' || !rule) return rule;
    
    // Handle rule names that might have parameters (e.g., "Rule Name (X)")
    const baseRuleName = rule.split('(')[0].trim();
    const params = rule.includes('(') ? rule.substring(rule.indexOf('(')) : '';
    
    const translation = specialRuleTranslations[baseRuleName]?.[language];
    return translation ? translation + params : rule;
  }, [specialRuleTranslations]);

  // Function to get the translated description of a keyword
  const translateKeywordDescription = useCallback((keyword: string, language: string): string => {
    if (!keyword) return '';
    
    const key = `description_${language}`;
    return keywordTranslations[keyword]?.[key] || '';
  }, [keywordTranslations]);

  // Function to get the translated description of a special rule
  const translateSpecialRuleDescription = useCallback((rule: string, language: string): string => {
    if (!rule) return '';
    
    // Extract just the name from rule that might have parameters
    const baseRuleName = rule.split('(')[0].trim();
    
    const key = `description_${language}`;
    return specialRuleTranslations[baseRuleName]?.[key] || '';
  }, [specialRuleTranslations]);

  return {
    translateKeyword,
    translateSpecialRule,
    translateKeywordDescription,
    translateSpecialRuleDescription
  };
};

export default useTranslateKeyword;
