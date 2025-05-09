
import { supabase } from "@/integrations/supabase/client";
import { TranslationItem, TranslatedText, AdminTranslationItem, AdminTranslatedText } from "@/utils/types/translationTypes";

// Helper function to handle translation with variegated parameter signatures
export async function batchTranslate(
  items: TranslationItem[] | string[] | AdminTranslationItem[], 
  targetLanguage?: string,
  sendProgress?: boolean,
  tableName?: string
): Promise<TranslatedText[] | string[] | AdminTranslatedText[]> {
  try {
    // Handle different input formats
    let textsToTranslate: string[] = [];
    let isStringArray = false;
    let isAdminItems = false;
    
    if (Array.isArray(items) && items.length > 0) {
      if (typeof items[0] === 'string') {
        textsToTranslate = items as string[];
        isStringArray = true;
      } else if ('key' in items[0] && 'source' in items[0]) {
        // Handle admin translation items
        isAdminItems = true;
        textsToTranslate = (items as AdminTranslationItem[]).map(item => item.source || '');
      } else {
        // Standard TranslationItem array
        textsToTranslate = (items as TranslationItem[]).map(item => item.text);
      }
    }
    
    // Determine target language, with fallbacks
    const targetLang = targetLanguage || 
      (!isStringArray && !isAdminItems && (items[0] as TranslationItem).targetLang) || 
      (isAdminItems ? 'ES' : 'ES');

    // Call the DeepL API via Supabase edge function
    const { data, error } = await supabase.functions.invoke('deepl-translate', {
      body: {
        texts: textsToTranslate,
        targetLanguage: targetLang.toUpperCase(),
        formality: 'more',
        ...(tableName && { tableName })
      }
    });

    if (error) {
      console.error("Translation API error:", error);
      throw new Error(`Failed to translate: ${error.message}`);
    }

    if (!data || !data.translations) {
      throw new Error("No translation data returned");
    }

    // If input was string array, return string array
    if (isStringArray) {
      return data.translations as string[];
    }
    
    // If input was admin items, map back with translation
    if (isAdminItems) {
      return (items as AdminTranslationItem[]).map((item, index) => ({
        ...item,
        translation: data.translations[index] || ''
      })) as AdminTranslatedText[];
    }

    // Otherwise map the translated texts back to the original items with their translation
    return (items as TranslationItem[]).map((item, index) => ({
      ...item,
      translation: data.translations[index] || ''
    })) as TranslatedText[];

  } catch (error) {
    console.error("Error in batchTranslate:", error);
    throw error;
  }
}

// Helper function for simplifying translation calls
export async function translateText(text: string, targetLang: string = 'es'): Promise<string> {
  if (!text) return '';
  
  const items: TranslationItem[] = [{ text, targetLang }];
  const result = await batchTranslate(items) as TranslatedText[];
  return result[0]?.translation || '';
}

// Helper function for translating text to French specifically
export async function translateToFrench(text: string): Promise<string> {
  return translateText(text, 'fr');
}

// Legacy function to maintain backward compatibility with existing code
export async function translateKeyword(text: string): Promise<string> {
  return translateText(text, 'es');
}
