
import { supabase } from "@/integrations/supabase/client";
import { NewsItem } from "@/data/newsArchive";
import { translations } from "@/i18n/translations";

interface NewsTranslation {
  en: string;
  es: string;
}

interface NewsItemDB {
  id: string;
  news_id: string;
  date: string;
  translation_key: string;
  content_en: string;
  content_es: string;
  created_at: string;
  updated_at: string;
}

interface UpdateNewsRequest {
  id: string;
  date: string;
  key: string;
  content: NewsTranslation;
}

// Function to convert database item to app format
const convertToNewsItem = (dbItem: NewsItemDB): NewsItem => {
  return {
    id: dbItem.news_id,
    date: dbItem.date,
    key: dbItem.translation_key
  };
};

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

// Function to fetch all news items from the database
export const fetchNewsItems = async (): Promise<NewsItem[]> => {
  try {
    const { data, error } = await supabase
      .from('news_items')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching news items:', error);
      return [];
    }
    
    // Update the in-memory translations for each news item
    data.forEach(item => {
      translations[item.translation_key] = {
        en: item.content_en,
        es: item.content_es
      };
    });
    
    // Convert to app format
    return data.map(convertToNewsItem);
  } catch (error) {
    console.error('Error in fetchNewsItems:', error);
    return [];
  }
};

// Function to update a news item
export const updateNewsItem = async (newsData: UpdateNewsRequest): Promise<boolean> => {
  try {
    // Update the database
    const { error } = await supabase
      .from('news_items')
      .update({
        date: newsData.date,
        translation_key: newsData.key,
        content_en: newsData.content.en,
        content_es: newsData.content.es,
      })
      .eq('news_id', newsData.id);
    
    if (error) {
      console.error('Error updating news item in database:', error);
      return false;
    }
    
    // Also update local translations cache
    translations[newsData.key] = {
      en: newsData.content.en,
      es: newsData.content.es
    };
    
    console.log('Updated news item successfully:', newsData);
    return true;
  } catch (error) {
    console.error('Error updating news item:', error);
    return false;
  }
};

// Function to create a new news item
export const createNewsItem = async (newsData: UpdateNewsRequest): Promise<boolean> => {
  try {
    // Add to the database
    const { error } = await supabase
      .from('news_items')
      .insert({
        news_id: newsData.id,
        date: newsData.date,
        translation_key: newsData.key,
        content_en: newsData.content.en,
        content_es: newsData.content.es
      });
    
    if (error) {
      console.error('Error creating news item in database:', error);
      return false;
    }
    
    // Also update local translations cache
    translations[newsData.key] = {
      en: newsData.content.en,
      es: newsData.content.es
    };
    
    console.log('Created new news item successfully:', newsData);
    return true;
  } catch (error) {
    console.error('Error creating news item:', error);
    return false;
  }
};

// Function to delete a news item
export const deleteNewsItem = async (id: string): Promise<boolean> => {
  try {
    // Delete from the database
    const { error } = await supabase
      .from('news_items')
      .delete()
      .eq('news_id', id);
    
    if (error) {
      console.error('Error deleting news item from database:', error);
      return false;
    }
    
    console.log('Deleted news item successfully:', id);
    return true;
  } catch (error) {
    console.error('Error deleting news item:', error);
    return false;
  }
};

// Function to get a single news item
export const getNewsItem = async (id: string): Promise<NewsItem | null> => {
  try {
    const { data, error } = await supabase
      .from('news_items')
      .select('*')
      .eq('news_id', id)
      .single();
    
    if (error || !data) {
      console.error('Error fetching news item:', error);
      return null;
    }
    
    return convertToNewsItem(data);
  } catch (error) {
    console.error('Error in getNewsItem:', error);
    return null;
  }
};
