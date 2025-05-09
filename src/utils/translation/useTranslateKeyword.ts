import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook to translate keywords, special rules and unit names
 */
export const useTranslateKeyword = () => {
  const [keywordTranslations, setKeywordTranslations] = useState<Record<string, string>>({});
  const [keywordNameTranslations, setKeywordNameTranslations] = useState<Record<string, string>>({});
  const [specialRuleTranslations, setSpecialRuleTranslations] = useState<Record<string, string>>({});
  const [unitNameTranslations, setUnitNameTranslations] = useState<Record<string, string>>({});
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
          const keywordMap: Record<string, string> = {};
          const keywordNameMap: Record<string, string> = {};
          
          keywordData.forEach(item => {
            if (item.name && item.description_es) {
              keywordMap[item.name] = item.description_es;
            }
            if (item.name && item.name_es) {
              keywordNameMap[item.name] = item.name_es;
            }
          });
          
          setKeywordTranslations(keywordMap);
          setKeywordNameTranslations(keywordNameMap);
        }

        // Load special rule translations
        const { data: ruleData } = await supabase
          .from('special_rules')
          .select('name, description_es, description_fr');
        
        if (ruleData) {
          const ruleMap: Record<string, string> = {};
          ruleData.forEach(item => {
            if (item.name && item.description_es) {
              ruleMap[item.name] = item.description_es;
            }
          });
          setSpecialRuleTranslations(ruleMap);
        }

        // Load unit name translations
        const { data: unitData } = await supabase
          .from('unit_data')
          .select('name, name_es, name_fr');
        
        if (unitData) {
          const nameMap: Record<string, string> = {};
          unitData.forEach(item => {
            if (item.name && item.name_es) {
              nameMap[item.name] = item.name_es;
            }
          });
          setUnitNameTranslations(nameMap);
        }

      } catch (error) {
        console.error("Error loading translations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();
  }, []);

  const translateKeyword = (keyword: string): string => {
    // First check if we have a name translation
    if (keywordNameTranslations[keyword]) {
      return keywordNameTranslations[keyword];
    }
    // Otherwise return the original keyword
    return keyword;
  };
  
  const translateKeywordDescription = (keyword: string): string => {
    return keywordTranslations[keyword] || keyword;
  };

  const translateSpecialRule = (rule: string): string => {
    return specialRuleTranslations[rule] || rule;
  };

  const translateUnitName = (name: string): string => {
    return unitNameTranslations[name] || name;
  };

  return {
    translateKeyword,
    translateKeywordDescription,
    translateSpecialRule,
    translateUnitName,
    isLoading
  };
};
