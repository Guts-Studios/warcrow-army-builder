import { supabase } from "@/integrations/supabase/client";
import { TranslationItem, TranslatedText } from "@/utils/types/translationTypes";

// Helper function to handle translation with variegated parameter signatures
export async function batchTranslate(
  items: TranslationItem[] | string[], 
  targetLanguage?: string,
  sendProgress?: boolean,
  tableName?: string
): Promise<TranslatedText[] | string[]> {
  try {
    // Handle string array input format (legacy support)
    const textsToTranslate: string[] = Array.isArray(items) && typeof items[0] === 'string' 
      ? items as string[]
      : (items as TranslationItem[]).map(item => item.text);
    
    // Determine target language, with fallbacks
    const targetLang = targetLanguage || 
      (typeof items[0] !== 'string' && (items[0] as TranslationItem).targetLang) || 
      'ES';

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
    if (typeof items[0] === 'string') {
      return data.translations;
    }

    // Otherwise map the translated texts back to the original items with their translation
    return (items as TranslationItem[]).map((item, index) => ({
      ...item,
      translation: data.translations[index] || ''
    }));

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

// Legacy function to maintain backward compatibility with existing code
export async function translateKeyword(text: string): Promise<string> {
  return translateText(text, 'es');
}
