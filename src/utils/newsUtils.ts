
import { supabase } from "@/integrations/supabase/client";
import { NewsItem } from "@/data/newsArchive";
import { translations } from "@/i18n/translations";

interface NewsTranslation {
  en: string;
  es: string;
}

interface UpdateNewsRequest {
  id: string;
  date: string;
  key: string;
  content: NewsTranslation;
}

// Function to auto-translate English text to Spanish (mock implementation)
export const translateToSpanish = (englishText: string): string => {
  // This is a simplified mock translation function
  // In a real application, you would use a translation service like Google Translate API
  
  // For now, we'll just do some basic word replacements as an example
  const commonTranslations: Record<string, string> = {
    'News': 'Noticias',
    'update': 'actualización',
    'unit': 'unidad',
    'units': 'unidades',
    'added': 'añadido',
    'profiles': 'perfiles',
    'for': 'para',
    'have': 'han',
    'been': 'sido',
    'The': 'El',
    'next': 'próximo',
    'include': 'incluirá',
    'will': 'va a',
    'Play': 'Modo de Juego',
    'Mode': 'Modo',
    'now': 'ahora',
    'includes': 'incluye',
    'tournament': 'torneo',
    'missions': 'misiones',
    'Try': 'Prueba',
    'them': 'las',
    'out': '',
    'and': 'y',
    'share': 'comparte',
    'your': 'tu',
    'feedback': 'opinión'
  };
  
  let translatedText = englishText;
  
  // Replace words based on our simple dictionary
  Object.keys(commonTranslations).forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'g');
    translatedText = translatedText.replace(regex, commonTranslations[word]);
  });
  
  return translatedText;
};

export const updateNewsItem = async (newsData: UpdateNewsRequest): Promise<boolean> => {
  try {
    // In a real implementation, you would update the database
    // and update the translations object
    
    // For now, this is a simulation - we're updating the in-memory translations
    if (translations[newsData.key]) {
      translations[newsData.key].en = newsData.content.en;
      translations[newsData.key].es = newsData.content.es;
      console.log("Updated translations for key:", newsData.key, translations[newsData.key]);
    } else {
      // Create new translation entry if it doesn't exist
      translations[newsData.key] = {
        en: newsData.content.en,
        es: newsData.content.es
      };
      console.log("Created new translation key:", newsData.key, translations[newsData.key]);
    }
    
    // Simulate successful update
    return true;
  } catch (error) {
    console.error("Error updating news item:", error);
    return false;
  }
};

export const createNewsItem = async (newsData: UpdateNewsRequest): Promise<boolean> => {
  try {
    // In a real implementation, you would add to the database
    // and update the translations object
    
    // Add the translation
    translations[newsData.key] = {
      en: newsData.content.en,
      es: newsData.content.es
    };
    
    console.log("Creating new news item with translations:", newsData);
    
    // Simulate successful creation
    return true;
  } catch (error) {
    console.error("Error creating news item:", error);
    return false;
  }
};

export const deleteNewsItem = async (id: string): Promise<boolean> => {
  try {
    // In a real implementation, you would delete from the database
    // and remove from translations object if needed
    
    // For now, this is a simulation
    console.log("Deleting news item:", id);
    
    // Simulate successful deletion
    return true;
  } catch (error) {
    console.error("Error deleting news item:", error);
    return false;
  }
};

export const getAllNews = async (): Promise<NewsItem[]> => {
  try {
    // In a real implementation, you would fetch from the database
    // For now, return the static data
    return [];
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
};
