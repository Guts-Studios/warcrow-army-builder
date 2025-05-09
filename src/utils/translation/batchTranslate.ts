
import { supabase } from "@/integrations/supabase/client";
import { TranslationItem, TranslatedText } from "@/utils/types/translationTypes";

export async function batchTranslate(items: TranslationItem[]): Promise<TranslatedText[]> {
  try {
    const textsToTranslate = items.map(item => item.text);
    const targetLanguage = items[0]?.targetLang?.toUpperCase() || 'ES';

    // Call the DeepL API via Supabase edge function
    const { data, error } = await supabase.functions.invoke('deepl-translate', {
      body: {
        texts: textsToTranslate,
        targetLanguage,
        formality: 'more'
      }
    });

    if (error) {
      console.error("Translation API error:", error);
      throw new Error(`Failed to translate: ${error.message}`);
    }

    if (!data || !data.translations) {
      throw new Error("No translation data returned");
    }

    // Map the translated texts back to the original items with their translation
    return items.map((item, index) => ({
      ...item,
      translation: data.translations[index] || ''
    }));

  } catch (error) {
    console.error("Error in batchTranslate:", error);
    throw error;
  }
}

// Helper function for simplifying translation calls
export async function translateText(text: string, targetLang: string): Promise<string> {
  if (!text) return '';
  
  const items: TranslationItem[] = [{ text, targetLang }];
  const result = await batchTranslate(items);
  return result[0]?.translation || '';
}
