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
 * DeepL API wrapper for translating text
 * This function handles translation using the DeepL API
 */
export const translateWithDeepL = async (
  text: string,
  targetLanguage: string = 'ES',
  formality: 'default' | 'more' | 'less' = 'default'
): Promise<string> => {
  try {
    const DEEPL_API_KEY = process.env.DEEPL_API_KEY || '';
    
    if (!DEEPL_API_KEY) {
      console.error('DeepL API key is not configured');
      return text;
    }
    
    // Ensure proper language formatting (DeepL uses ES not es)
    const formattedLang = targetLanguage.toUpperCase();
    
    const response = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: [text],
        target_lang: formattedLang,
        formality: formality
      })
    });

    if (!response.ok) {
      throw new Error(`DeepL API returned ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.translations[0].text;
  } catch (error) {
    console.error('Error in DeepL translation:', error);
    return text; // Return original text as fallback
  }
};

/**
 * Batch translation utility for handling mass translations
 * This can be used to translate multiple items at once and optionally save to database
 * It now supports DeepL translation when available
 */
export const batchTranslate = async (
  items: Array<{id: string, key: string, source: string}>,
  targetLanguage: string,
  saveToDatabase: boolean = false,
  tableType: 'rules_chapters' | 'rules_sections' | 'faq_sections' = 'rules_sections',
  useDeepL: boolean = true
): Promise<Array<{id: string, key: string, source: string, translation: string}>> => {
  try {
    console.log(`Starting batch translation of ${items.length} items to ${targetLanguage}`);
    const results = [];
    
    // Process items in batches to avoid overloading the translation API
    const batchSize = 10;
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      console.log(`Processing batch ${Math.floor(i/batchSize) + 1} of ${Math.ceil(items.length/batchSize)}`);
      
      // Translate each item in the batch
      const batchResults = await Promise.all(
        batch.map(async (item) => {
          let translation = '';
          
          if (useDeepL) {
            // Try to use DeepL for translation
            try {
              const { data, error } = await supabase.functions.invoke('deepl-translate', {
                body: {
                  texts: [item.source],
                  targetLanguage: targetLanguage.toUpperCase(),
                  formality: 'more'
                }
              });
              
              if (error) {
                throw error;
              }
              
              if (data && data.translations && data.translations.length > 0) {
                translation = data.translations[0];
                console.log(`DeepL translation successful for item ${item.id}`);
              } else {
                throw new Error('No translation returned from DeepL');
              }
            } catch (error) {
              console.error(`DeepL translation failed for item ${item.id}:`, error);
              translation = `[${targetLanguage}] ${item.source}`; // Fallback
            }
          } else {
            // Use placeholder translation if DeepL is not enabled
            translation = `[${targetLanguage}] ${item.source}`;
          }
          
          return {
            ...item,
            translation
          };
        })
      );
      
      results.push(...batchResults);
      
      // Add a small delay between batches to avoid rate limiting
      if (i + batchSize < items.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Dispatch progress event for other components to track
      if (typeof window !== 'undefined') {
        const progressEvent = new CustomEvent('translation-progress', {
          detail: { completed: i + batch.length }
        });
        window.dispatchEvent(progressEvent);
      }
    }

    if (saveToDatabase && tableType) {
      // Determine which fields to update based on the item key and table type
      for (const item of results) {
        let columnPrefix = targetLanguage.toLowerCase();
        let columnName = '';
        
        if (tableType === 'rules_chapters') {
          columnName = `title_${columnPrefix}`;
        } else {
          // For either rules_sections or faq_sections
          // Use 'key' to determine whether to update section/title or content 
          if (item.key === 'section' || item.key === 'title') {
            columnName = tableType === 'faq_sections' ? `section_${columnPrefix}` : `title_${columnPrefix}`;
          } else {
            columnName = `content_${columnPrefix}`;
          }
        }
        
        // Update the database with the translation
        try {
          const { error } = await supabase
            .from(tableType)
            .update({ [columnName]: item.translation })
            .eq('id', item.id);
            
          if (error) {
            console.error(`Error updating translation for ${item.id}:`, error);
          }
        } catch (updateError) {
          console.error(`Database update error for ${item.id}:`, updateError);
        }
      }
      
      console.log(`Saved ${results.length} translations to database`);
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
