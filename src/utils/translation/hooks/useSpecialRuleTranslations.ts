
import { useState } from 'react';
import { specialRuleTranslations } from '@/data/specialRuleTranslations';
import { specialRuleDefinitions } from "@/data/specialRuleDefinitions";

export const useSpecialRuleTranslations = () => {
  const translateSpecialRule = (rule: string, language: string = 'en'): string => {
    if (!rule || language === 'en') return rule;
    
    // For special rules, handle parameter sections separately
    const basePart = rule.split('(')[0].trim();
    const params = rule.includes('(') ? rule.substring(rule.indexOf('(')) : '';
    
    // Get the translated base part
    const translatedBase = specialRuleTranslations[basePart]?.[language as 'en' | 'es' | 'fr'] || basePart;
    
    // Return the translated base with parameters if they exist
    return translatedBase + (params ? ' ' + params : '');
  };

  const translateSpecialRuleDescription = (rule: string, language: string = 'en'): string => {
    if (!rule) return '';
    
    // Extract base rule name without parameters
    const baseRule = rule.split('(')[0].trim();
    
    // Get the description based on language
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
    translateSpecialRuleDescription
  };
};
