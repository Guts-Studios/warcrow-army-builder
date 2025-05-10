
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const DEEPL_API_KEY = Deno.env.get('DEEPL_API_KEY');

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle DeepL translation
async function translateWithDeepL(
  texts: string[],
  targetLanguage: string = 'ES',
  formality: 'default' | 'more' | 'less' = 'default'
) {
  try {
    if (!DEEPL_API_KEY) {
      throw new Error('DeepL API key is not configured');
    }
    
    // Ensure proper language formatting (DeepL uses ES not es)
    const formattedLang = targetLanguage.toUpperCase();
    
    console.log(`Translating ${texts.length} items to ${formattedLang}`);
    
    const response = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: texts,
        target_lang: formattedLang,
        formality: formality
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`DeepL API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data.translations.map((t: any) => t.text);
  } catch (error) {
    console.error('Error in DeepL translation:', error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { characteristics, targetLanguage } = await req.json();
    
    if (!characteristics || !Array.isArray(characteristics) || characteristics.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid request: characteristics array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing ${characteristics.length} characteristics for translation to ${targetLanguage}`);

    // Extract name strings for translation
    const textsToTranslate = characteristics.map(char => char.name);
    
    // Translate names
    const translatedNames = await translateWithDeepL(
      textsToTranslate,
      targetLanguage || 'ES',
      'more'
    );
    
    // Map translations back to characteristics with IDs
    const translatedCharacteristics = characteristics.map((char, index) => ({
      id: char.id,
      name: char.name,
      translation: translatedNames[index]
    }));

    return new Response(
      JSON.stringify({ 
        translations: translatedCharacteristics,
        count: translatedCharacteristics.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in translate-characteristics function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An error occurred during translation' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
