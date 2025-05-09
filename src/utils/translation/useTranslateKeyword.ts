
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

type SupportedLanguage = 'es' | 'fr';

/**
 * Hook to translate keywords, special rules and unit names
 */
export const useTranslateKeyword = () => {
  const [keywordDescriptions, setKeywordDescriptions] = useState<Record<string, Record<SupportedLanguage, string>>>({});
  const [keywordNames, setKeywordNames] = useState<Record<string, Record<SupportedLanguage, string>>>({});
  const [specialRules, setSpecialRules] = useState<Record<string, Record<SupportedLanguage, string>>>({});
  const [unitNames, setUnitNames] = useState<Record<string, Record<SupportedLanguage, string>>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTranslations = async () => {
      setIsLoading(true);
      try {
        // Load keyword translations
        const { data: keywordData } = await supabase
          .from('unit_keywords')
          .select('name, name_es, name_fr, description_es, description_fr');
        
        if (keywordData) {
          const descriptionMap: Record<string, Record<SupportedLanguage, string>> = {};
          const nameMap: Record<string, Record<SupportedLanguage, string>> = {};
          
          keywordData.forEach(item => {
            // Initialize maps for this keyword if not exist
            if (item.name) {
              if (!descriptionMap[item.name]) {
                descriptionMap[item.name] = { es: '', fr: '' };
              }
              if (!nameMap[item.name]) {
                nameMap[item.name] = { es: '', fr: '' };
              }
              
              // Populate description translations
              if (item.description_es) {
                descriptionMap[item.name].es = item.description_es;
              }
              if (item.description_fr) {
                descriptionMap[item.name].fr = item.description_fr;
              }
              
              // Populate name translations
              if (item.name_es) {
                nameMap[item.name].es = item.name_es;
              }
              if (item.name_fr) {
                nameMap[item.name].fr = item.name_fr;
              }
            }
          });
          
          setKeywordDescriptions(descriptionMap);
          setKeywordNames(nameMap);
        }

        // Load special rule translations
        const { data: ruleData } = await supabase
          .from('special_rules')
          .select('name, description_es, description_fr');
        
        if (ruleData) {
          const rulesMap: Record<string, Record<SupportedLanguage, string>> = {};
          ruleData.forEach(item => {
            if (item.name) {
              if (!rulesMap[item.name]) {
                rulesMap[item.name] = { es: '', fr: '' };
              }
              if (item.description_es) {
                rulesMap[item.name].es = item.description_es;
              }
              if (item.description_fr) {
                rulesMap[item.name].fr = item.description_fr;
              }
            }
          });
          setSpecialRules(rulesMap);
        }

        // Load unit name translations
        const { data: unitData } = await supabase
          .from('unit_data')
          .select('name, name_es, name_fr');
        
        if (unitData) {
          const namesMap: Record<string, Record<SupportedLanguage, string>> = {};
          unitData.forEach(item => {
            if (item.name) {
              if (!namesMap[item.name]) {
                namesMap[item.name] = { es: '', fr: '' };
              }
              if (item.name_es) {
                namesMap[item.name].es = item.name_es;
              }
              if (item.name_fr) {
                namesMap[item.name].fr = item.name_fr;
              }
            }
          });
          setUnitNames(namesMap);
        }

      } catch (error) {
        console.error("Error loading translations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();
  }, []);

  const translateKeyword = (keyword: string, language: string = 'es'): string => {
    // Check if we have a name translation for this language
    if (language === 'es' || language === 'fr') {
      if (keywordNames[keyword]?.[language as SupportedLanguage]) {
        return keywordNames[keyword][language as SupportedLanguage];
      }
    }
    // Otherwise return the original keyword
    return keyword;
  };
  
  const translateKeywordDescription = (keyword: string, language: string = 'es'): string => {
    if (language === 'es' || language === 'fr') {
      if (keywordDescriptions[keyword]?.[language as SupportedLanguage]) {
        return keywordDescriptions[keyword][language as SupportedLanguage];
      }
    }
    return keyword;
  };

  const translateSpecialRule = (rule: string, language: string = 'es'): string => {
    if (language === 'es' || language === 'fr') {
      if (specialRules[rule]?.[language as SupportedLanguage]) {
        return specialRules[rule][language as SupportedLanguage];
      }
    }
    return rule;
  };

  const translateUnitName = (name: string, language: string = 'es'): string => {
    if (language === 'es' || language === 'fr') {
      if (unitNames[name]?.[language as SupportedLanguage]) {
        return unitNames[name][language as SupportedLanguage];
      }
    }
    return name;
  };

  return {
    translateKeyword,
    translateKeywordDescription,
    translateSpecialRule,
    translateUnitName,
    isLoading
  };
};
