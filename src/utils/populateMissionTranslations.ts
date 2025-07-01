
import { translateText } from './translation/batchTranslate';

interface Mission {
  title: string;
  details: string;
}

interface Feat {
  name: string;
  details: string;
}

export async function populateMissionTranslations(missions: Mission[], language: 'es' | 'fr') {
  const translations: Record<string, Record<string, string>> = {};
  
  console.log(`Starting translation of ${missions.length} missions to ${language}...`);
  
  for (const mission of missions) {
    try {
      console.log(`Translating mission: ${mission.title}`);
      const translatedDetails = await translateText(mission.details, language);
      
      if (!translations[mission.title]) {
        translations[mission.title] = {};
      }
      translations[mission.title][language] = translatedDetails;
      
      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Failed to translate mission ${mission.title}:`, error);
      translations[mission.title] = { [language]: mission.details }; // Use original as fallback
    }
  }
  
  console.log(`Translation completed. Results:`, translations);
  return translations;
}

export async function populateFeatTranslations(feats: Feat[], language: 'es' | 'fr') {
  const translations: Record<string, Record<string, string>> = {};
  
  console.log(`Starting translation of ${feats.length} feats to ${language}...`);
  
  for (const feat of feats) {
    try {
      console.log(`Translating feat: ${feat.name}`);
      const translatedDetails = await translateText(feat.details, language);
      
      if (!translations[feat.name]) {
        translations[feat.name] = {};
      }
      translations[feat.name][language] = translatedDetails;
      
      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Failed to translate feat ${feat.name}:`, error);
      translations[feat.name] = { [language]: feat.details }; // Use original as fallback
    }
  }
  
  console.log(`Translation completed. Results:`, translations);
  return translations;
}

// Helper function to download translations as JSON
export function downloadTranslationsAsJSON(translations: any, filename: string) {
  const dataStr = JSON.stringify(translations, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = filename;
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}
