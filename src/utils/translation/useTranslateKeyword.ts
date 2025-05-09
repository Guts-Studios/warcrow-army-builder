
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useTranslateKeyword = () => {
  const [keywordTranslations, setKeywordTranslations] = useState<Record<string, Record<string, string>>>({});
  const [specialRuleTranslations, setSpecialRuleTranslations] = useState<Record<string, Record<string, string>>>({});
  const [unitNameTranslations, setUnitNameTranslations] = useState<Record<string, Record<string, string>>>({});
  
  useEffect(() => {
    // Load keywords
    const fetchKeywords = async () => {
      const { data: keywordData, error: keywordError } = await supabase
        .from('unit_keywords')
        .select('*');
      
      if (!keywordError && keywordData) {
        const translations: Record<string, Record<string, string>> = {};
        const descriptions: Record<string, Record<string, string>> = {};
        
        keywordData.forEach(item => {
          if (!translations[item.name]) {
            translations[item.name] = { 'en': item.name };
          }
          
          if (item.name_es) translations[item.name]['es'] = item.name_es;
          if (item.name_fr) translations[item.name]['fr'] = item.name_fr;
          
          // Store descriptions separately
          if (!descriptions[item.name]) {
            descriptions[item.name] = { 'en': item.description || '' };
          }
          
          if (item.description_es) descriptions[item.name]['es'] = item.description_es;
          if (item.description_fr) descriptions[item.name]['fr'] = item.description_fr;
        });
        
        setKeywordTranslations(translations);
      }
    };
    
    // Load special rules
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
          
          // Special rules might not have name_es/name_fr columns
          // Just keep the rule name as is for non-English languages
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
      }
    };
    
    // Load unit names
    const fetchUnitNames = async () => {
      const { data: unitsData, error: unitsError } = await supabase
        .from('unit_data')
        .select('*');
      
      if (!unitsError && unitsData) {
        const translations: Record<string, Record<string, string>> = {};
        
        unitsData.forEach(item => {
          if (!translations[item.name]) {
            translations[item.name] = { 'en': item.name };
          }
          
          if (item.name_es) translations[item.name]['es'] = item.name_es;
          if (item.name_fr) translations[item.name]['fr'] = item.name_fr;
        });
        
        setUnitNameTranslations(translations);
      }
    };

    fetchKeywords();
    fetchSpecialRules();
    fetchUnitNames();
  }, []);

  const translateKeyword = (keyword: string, language: string): string => {
    if (!keyword || language === 'en') return keyword;
    return keywordTranslations[keyword]?.[language] || keyword;
  };

  const translateSpecialRule = (rule: string, language: string): string => {
    if (!rule || language === 'en') return rule;
    return specialRuleTranslations[rule]?.[language] || rule;
  };

  const translateKeywordDescription = (keyword: string, language: string): string => {
    if (!keyword || language === 'en') return keywordTranslations[keyword]?.['en'] || '';
    return keywordTranslations[keyword]?.[language] || keywordTranslations[keyword]?.['en'] || '';
  };

  const translateSpecialRuleDescription = (rule: string, language: string): string => {
    if (!rule || language === 'en') return specialRuleTranslations[rule]?.['en'] || '';
    return specialRuleTranslations[rule]?.[language] || specialRuleTranslations[rule]?.['en'] || '';
  };
  
  const translateUnitName = (name: string, language: string = 'en'): string => {
    if (!name || language === 'en') return name;
    return unitNameTranslations[name]?.[language] || name;
  };

  return {
    translateKeyword,
    translateSpecialRule,
    translateKeywordDescription,
    translateSpecialRuleDescription,
    translateUnitName
  };
};
