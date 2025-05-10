
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useTranslateKeyword = () => {
  const [keywordTranslations, setKeywordTranslations] = useState<Record<string, Record<string, string>>>({});
  const [keywordDescriptions, setKeywordDescriptions] = useState<Record<string, Record<string, string>>>({});
  const [specialRuleTranslations, setSpecialRuleTranslations] = useState<Record<string, Record<string, string>>>({});
  const [unitNameTranslations, setUnitNameTranslations] = useState<Record<string, Record<string, string>>>({});
  const [characteristicTranslations, setCharacteristicTranslations] = useState<Record<string, Record<string, string>>>({});
  
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
        setKeywordDescriptions(descriptions);
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
    
    // Load characteristics
    const fetchCharacteristics = async () => {
      const { data: characteristicsData, error: characteristicsError } = await supabase
        .from('unit_characteristics')
        .select('*');
      
      if (!characteristicsError && characteristicsData) {
        const translations: Record<string, Record<string, string>> = {};
        const descriptions: Record<string, Record<string, string>> = {};
        
        characteristicsData.forEach(item => {
          if (!translations[item.name]) {
            translations[item.name] = { 'en': item.name };
          }
          
          // Characteristics usually don't have name translations, just keep the name
          // We'll add proper name translations when available
          translations[item.name]['es'] = item.name;
          translations[item.name]['fr'] = item.name;
          
          // Store descriptions
          if (!descriptions[item.name]) {
            descriptions[item.name] = { 'en': item.description || '' };
          }
          
          if (item.description_es) descriptions[item.name]['es'] = item.description_es;
          if (item.description_fr) descriptions[item.name]['fr'] = item.description_fr;
        });
        
        setCharacteristicTranslations(descriptions);
      }
    };

    fetchKeywords();
    fetchSpecialRules();
    fetchUnitNames();
    fetchCharacteristics();
  }, []);

  const translateKeyword = (keyword: string, language: string): string => {
    if (!keyword || language === 'en') return keyword;
    return keywordTranslations[keyword]?.[language] || keyword;
  };

  const translateSpecialRule = (rule: string, language: string): string => {
    if (!rule || language === 'en') return rule;
    return specialRuleTranslations[rule]?.[language] || rule;
  };

  const translateCharacteristic = (characteristic: string, language: string): string => {
    if (!characteristic || language === 'en') return characteristic;
    return characteristicTranslations[characteristic]?.[language] || characteristic;
  };

  const translateKeywordDescription = (keyword: string, language: string): string => {
    // First try to get the description in the requested language
    const descriptionInRequestedLanguage = keywordDescriptions[keyword]?.[language];
    
    // If not found, fall back to English
    const descriptionInEnglish = keywordDescriptions[keyword]?.['en'];
    
    // Return whichever is available, or empty string if neither
    return descriptionInRequestedLanguage || descriptionInEnglish || '';
  };

  const translateSpecialRuleDescription = (rule: string, language: string): string => {
    // First try to get the description in the requested language
    const descriptionInRequestedLanguage = specialRuleTranslations[rule]?.[language];
    
    // If not found, fall back to English
    const descriptionInEnglish = specialRuleTranslations[rule]?.['en'];
    
    // Return whichever is available, or empty string if neither
    return descriptionInRequestedLanguage || descriptionInEnglish || '';
  };
  
  const translateCharacteristicDescription = (characteristic: string, language: string): string => {
    // First try to get the description in the requested language
    const descriptionInRequestedLanguage = characteristicTranslations[characteristic]?.[language];
    
    // If not found, fall back to English
    const descriptionInEnglish = characteristicTranslations[characteristic]?.['en'];
    
    // Return whichever is available, or empty string if neither
    return descriptionInRequestedLanguage || descriptionInEnglish || '';
  };
  
  const translateUnitName = (name: string, language: string = 'en'): string => {
    if (!name || language === 'en') return name;
    return unitNameTranslations[name]?.[language] || name;
  };

  return {
    translateKeyword,
    translateSpecialRule,
    translateCharacteristic,
    translateKeywordDescription,
    translateSpecialRuleDescription,
    translateCharacteristicDescription,
    translateUnitName
  };
};
