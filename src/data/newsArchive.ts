
import { supabase } from "@/integrations/supabase/client";
import { translations } from "@/i18n/translations";

export interface NewsItem {
  id: string;
  date: string;
  key: string;
}

// Default news items as fallback
export const defaultNewsItems: NewsItem[] = [
  {
    id: "news-default-1",
    date: new Date().toISOString(),
    key: "news.default.latest"
  },
  {
    id: "news-default-2",
    date: new Date(Date.now() - 86400000).toISOString(), // yesterday
    key: "news.default.previous"
  }
];

// Start with an empty array, will be populated by initializeNewsItems
export let newsItems: NewsItem[] = [];

// Make sure default translations exist immediately
// This ensures we always have something to display
if (typeof window !== 'undefined') {
  defaultNewsItems.forEach(item => {
    if (!translations[item.key]) {
      translations[item.key] = {
        en: 'Latest news will appear here...',
        es: 'Las últimas noticias aparecerán aquí...',
        fr: 'Les dernières nouvelles apparaîtront ici...'
      };
    }
  });
}

// Function to initialize news items from the database - no caching
export const initializeNewsItems = async (): Promise<NewsItem[]> => {
  try {
    console.log("Initializing news items from database (no caching)...");
    
    // Direct database fetch with no caching
    try {
      console.log("Starting direct database fetch for news items");
      const { data, error } = await supabase
        .from('news_items')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) {
        console.error('Error fetching news items:', error);
        return defaultNewsItems; // Return defaults on error
      }
      
      if (!data || data.length === 0) {
        console.log('No news items found in database');
        return defaultNewsItems; // Return defaults if no data
      }
      
      console.log(`Fetched ${data.length} news items from database`);
      
      const items: NewsItem[] = data.map(item => {
        // Add translations to the translations object
        try {
          translations[item.translation_key] = {
            en: item.content_en || 'No content available',
            es: item.content_es || 'No content available',
            fr: item.content_fr || 'No content available'
          };
        } catch (e) {
          console.error('Error updating translation for:', item.translation_key, e);
        }
        
        return {
          id: item.news_id || item.id,
          date: item.date,
          key: item.translation_key
        };
      });
      
      // Update the module-level newsItems variable
      newsItems = [...items];
      return items;
    } catch (fetchError) {
      console.error('Error in database fetch:', fetchError);
      return defaultNewsItems; // Return defaults on error
    }
    
  } catch (error) {
    console.error('Error initializing news items:', error);
    return defaultNewsItems; // Return defaults on error
  }
};

// Initialize news items on module load
if (typeof window !== 'undefined') {
  // Use default items for immediate display
  newsItems = [...defaultNewsItems];
  
  // Add default translations
  defaultNewsItems.forEach(item => {
    translations[item.key] = {
      en: 'Loading latest news...',
      es: 'Cargando las últimas noticias...',
      fr: 'Chargement des dernières nouvelles...'
    };
  });
  
  // Then asynchronously load from database
  initializeNewsItems().catch(err => {
    console.error('Error initializing news items during module load:', err);
  });
}
