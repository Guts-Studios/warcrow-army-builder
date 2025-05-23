
import { supabase } from '@/integrations/supabase/client';

/**
 * Translate an array of strings to a target language using DeepL API via Supabase Edge Function
 * @param texts Array of strings to translate
 * @param targetLang Target language code (e.g., 'es', 'fr')
 * @returns Promise resolving to an array of translated strings or error object
 */
export async function batchTranslate(texts: string[], targetLang: 'es' | 'fr'): Promise<string[] | { error: string }> {
  try {
    if (!texts || texts.length === 0) {
      return [];
    }
    
    console.log(`Translating ${texts.length} text(s) to ${targetLang}`);
    
    const { data, error } = await supabase.functions.invoke('translate', {
      body: {
        texts,
        targetLang
      }
    });
    
    if (error) {
      console.error('Translation API error:', error);
      throw new Error(`Translation failed: ${error.message}`);
    }
    
    if (!data || !data.translations) {
      console.error('Translation returned invalid data', data);
      throw new Error('Invalid response from translation service');
    }
    
    return data.translations;
  } catch (error: any) {
    console.error('Translation error:', error);
    return { error: error.message || 'Translation failed' };
  }
}

/**
 * Translate a single string to a target language
 * @param text String to translate
 * @param targetLang Target language code (e.g., 'es', 'fr')
 * @returns Promise resolving to the translated string or error message
 */
export async function translateText(text: string, targetLang: 'es' | 'fr'): Promise<string> {
  if (!text || text.trim() === '') {
    return '';
  }
  
  const result = await batchTranslate([text], targetLang);
  
  if (Array.isArray(result)) {
    return result[0] || '';
  }
  
  // Handle error case but return a string to conform to the return type
  console.error('Translation error:', result.error);
  return ''; // Return empty string on error instead of an error object
}

/**
 * Convenience function to translate a string to French
 * @param text String to translate
 * @returns Promise resolving to the translated string
 */
export async function translateToFrench(text: string): Promise<string> {
  return translateText(text, 'fr');
}

/**
 * Convenience function to translate a string to Spanish
 * @param text String to translate
 * @returns Promise resolving to the translated string
 */
export async function translateToSpanish(text: string): Promise<string> {
  return translateText(text, 'es');
}
