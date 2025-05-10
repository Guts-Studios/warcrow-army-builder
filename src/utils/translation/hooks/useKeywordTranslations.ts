
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useKeywordTranslations = () => {
  const [keywordTranslations, setKeywordTranslations] = useState<Record<string, Record<string, string>>>({});
  const [keywordDescriptions, setKeywordDescriptions] = useState<Record<string, Record<string, string>>>({});

  useEffect(() => {
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

    fetchKeywords();
  }, []);

  const translateKeyword = (keyword: string, language: string): string => {
    if (!keyword || language === 'en') return keyword;
    return keywordTranslations[keyword]?.[language] || keyword;
  };

  const translateKeywordDescription = (keyword: string, language: string): string => {
    // First try to get the description in the requested language
    const descriptionInRequestedLanguage = keywordDescriptions[keyword]?.[language];
    
    // If not found, fall back to English
    const descriptionInEnglish = keywordDescriptions[keyword]?.['en'];
    
    // Return whichever is available, or empty string if neither
    return descriptionInRequestedLanguage || descriptionInEnglish || '';
  };

  return {
    translateKeyword,
    translateKeywordDescription
  };
};
