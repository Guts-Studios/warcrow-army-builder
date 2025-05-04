import { useLanguage } from '@/contexts/LanguageContext';

/**
 * This function takes a keyword or special rule string and returns the translated version
 * It handles both single keywords and complex ones with parameters like "Join (Infantry, Orc)"
 */
export const useTranslateKeyword = () => {
  const { t } = useLanguage();
  
  const translateKeyword = (keyword: string): string => {
    // Handle keywords with parameters like "Join (Infantry, Orc)"
    if (keyword.includes('(') && keyword.includes(')')) {
      const baseKeyword = keyword.substring(0, keyword.indexOf('(')).trim().toLowerCase();
      const parameters = keyword.substring(keyword.indexOf('('));
      
      // Translate the base keyword
      const translatedBase = t(baseKeyword);
      
      // For parameters, we'd need more complex logic to translate each component
      // This is a simplified approach that keeps parameters as-is
      return `${translatedBase} ${parameters}`;
    }
    
    // Simple keyword translation
    return t(keyword.toLowerCase());
  };
  
  const translateSpecialRule = (rule: string): string => {
    // Some special rules might have parameters like "Displace (4)"
    if (rule.includes('(') && rule.includes(')')) {
      const baseRule = rule.substring(0, rule.indexOf('(')).trim().toLowerCase();
      const parameters = rule.substring(rule.indexOf('('));
      
      return `${t(baseRule)} ${parameters}`;
    }
    
    return t(rule.toLowerCase());
  };
  
  return { translateKeyword, translateSpecialRule };
};
