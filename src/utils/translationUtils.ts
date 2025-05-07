
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from "@/integrations/supabase/client";

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
    // First check if there's a direct translation for the full unit name
    const unitKey = `unit.${name.toLowerCase().replace(/\s+/g, '_')}`;
    const directTranslation = t(unitKey);
    
    // If we have a direct translation that isn't just returning the key, use it
    if (directTranslation !== unitKey) {
      return directTranslation;
    }
    
    // Check for a specific translation of the full name
    const fullNameKey = name.toLowerCase();
    const fullNameTranslation = t(fullNameKey);
    if (fullNameTranslation !== fullNameKey) {
      return fullNameTranslation;
    }
    
    // Otherwise, try to translate common parts of the name
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

/**
 * Batch translation utility for handling mass translations
 * This can be used to translate multiple items at once and optionally save to database
 */
export const batchTranslate = async (
  items: Array<{id: string, key: string, source: string}>,
  targetLanguage: string,
  saveToDatabase: boolean = false,
  tableType: 'rules_chapters' | 'rules_sections' | 'faq_sections' = 'rules_sections'
): Promise<Array<{id: string, key: string, source: string, translation: string}>> => {
  try {
    // For now, we're providing a manual batch translation approach
    // A more advanced version could use a translation API

    const results = items.map(item => ({
      ...item,
      translation: `[${targetLanguage}] ${item.source}` // Placeholder translation
    }));

    if (saveToDatabase && tableType) {
      // Example of how you could save these to a database
      // This would need to be customized based on your schema
      for (const item of results) {
        const columnName = `${targetLanguage}_content`;
        
        // Update the record with the translation using the correct table type
        const { error } = await supabase
          .from(tableType)
          .update({ [columnName]: item.translation })
          .eq('id', item.id);
          
        if (error) {
          console.error(`Error updating translation for ${item.id}:`, error);
        }
      }
    }
    
    return results;
  } catch (error) {
    console.error("Error in batch translation:", error);
    return items.map(item => ({...item, translation: ''}));
  }
};

/**
 * Utility to find missing translations in the translations object
 */
export const findMissingTranslations = (translations: any, targetLanguage: string = 'es'): string[] => {
  const missingKeys: string[] = [];
  
  Object.entries(translations).forEach(([key, value]: [string, any]) => {
    // If the value doesn't have the target language or it's empty
    if (!value[targetLanguage] || value[targetLanguage].trim() === '') {
      missingKeys.push(key);
    }
  });
  
  return missingKeys;
};
