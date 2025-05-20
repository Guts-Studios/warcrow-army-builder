
import { useState, useEffect } from 'react';
import { keywordTranslations } from '@/data/keywordTranslations';
import { keywordDefinitions } from '@/data/keywordDefinitions';

export const useKeywordTranslations = () => {
  // Pre-populated state with local data
  const [loadedKeywords, setLoadedKeywords] = useState(true);

  const translateKeyword = (keyword: string, language: string = 'en'): string => {
    if (!keyword || language === 'en') return keyword;
    
    // For keywords, handle parameter sections separately
    const basePart = keyword.split('(')[0].trim();
    const params = keyword.includes('(') ? keyword.substring(keyword.indexOf('(')) : '';
    
    // Get the translated base part
    const translatedBase = keywordTranslations[basePart]?.[language as 'en' | 'es' | 'fr'] || basePart;
    
    // Return the translated base with parameters if they exist
    return translatedBase + (params ? ' ' + params : '');
  };

  const translateKeywordDescription = (keyword: string, language: string = 'en'): string => {
    if (!keyword) return '';
    
    // Extract base keyword name without parameters
    const baseKeyword = keyword.split('(')[0].trim();
    
    // Get the description based on language
    const descriptionKey = `description_${language}` as 'description_en' | 'description_es' | 'description_fr';
    const fallbackKey = 'description_en';
    
    // Try from translations first
    const description = keywordTranslations[baseKeyword]?.[descriptionKey] || 
                         keywordTranslations[baseKeyword]?.[fallbackKey] ||
                         keywordDefinitions[baseKeyword] || '';
    
    return description;
  };

  return {
    translateKeyword,
    translateKeywordDescription
  };
};
