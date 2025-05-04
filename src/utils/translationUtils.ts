
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
      const paramStart = keyword.indexOf('(');
      const paramEnd = keyword.lastIndexOf(')') + 1;
      const parameters = keyword.substring(paramStart, paramEnd);
      
      // Extract parameters to translate them individually
      const paramContent = parameters.substring(1, parameters.length - 1);
      const paramItems = paramContent.split('|').map(item => item.trim());
      
      // Translate each parameter item
      const translatedParams = paramItems.map(item => {
        const paramParts = item.split(',').map(part => part.trim());
        const translatedParts = paramParts.map(part => t(part.toLowerCase()));
        return translatedParts.join(', ');
      }).join(' | ');
      
      // Translate the base keyword
      const translatedBase = t(baseKeyword);
      
      // Return translated keyword with parameters
      return `${translatedBase} (${translatedParams})`;
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
  
  const translateUnitName = (name: string): string => {
    // Check if this is a character name that needs translation
    // Character names are often proper nouns and might not need translation,
    // but titles and descriptive parts might need to be translated
    
    // First check if there's a direct translation for the full name
    const directTranslation = t(`unit.${name.toLowerCase().replace(/\s+/g, '_')}`);
    if (directTranslation !== `unit.${name.toLowerCase().replace(/\s+/g, '_')}`) {
      return directTranslation;
    }
    
    // Check for common titles or descriptors that might need translation
    const titlePatterns = [
      "the", "of", "champion", "master", "lord", "lady", "commander", 
      "captain", "hero", "warrior", "guardian", "protector"
    ];
    
    let translatedName = name;
    
    // For names with commas (like "Character Name, Title")
    if (name.includes(',')) {
      const [baseName, title] = name.split(',').map(part => part.trim());
      const translatedTitle = t(title.toLowerCase());
      translatedName = `${baseName}, ${translatedTitle}`;
    } 
    // For names with "the" or other common patterns
    else {
      titlePatterns.forEach(pattern => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes(` ${pattern} `) || lowerName.startsWith(`${pattern} `)) {
          const regex = new RegExp(`(^|\\s)${pattern}(\\s|$)`, 'i');
          translatedName = name.replace(regex, (match) => ` ${t(pattern.toLowerCase())} `).trim();
        }
      });
    }
    
    return translatedName;
  };
  
  return { translateKeyword, translateSpecialRule, translateUnitName };
};
