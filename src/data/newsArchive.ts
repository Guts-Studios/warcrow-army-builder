
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

// Function to initialize news items from the database
export const initializeNewsItems = async (): Promise<NewsItem[]> => {
  try {
    console.log("Initializing news items from database...");
    
    // First, try to use cached items for immediate display
    const cachedItems = getCachedNewsItems();
    if (cachedItems.length > 0) {
      console.log("Using cached news items initially:", cachedItems.length);
      newsItems = [...cachedItems];
    } else if (newsItems.length === 0) {
      // If no cached items and newsItems is empty, use default items
      console.log("No cached items, using default news items initially");
      newsItems = [...defaultNewsItems];
    }
    
    // Set a timeout to avoid long waiting time
    const timeoutPromise = new Promise<NewsItem[]>((resolve) => {
      setTimeout(() => {
        console.log("Database fetch timeout after 800ms");
        
        // Return what we have so far - this could be cached items or defaultNewsItems
        resolve([...newsItems]);
      }, 800); // 800ms timeout for faster response
    });
    
    // Database fetch promise
    const fetchPromise = (async (): Promise<NewsItem[]> => {
      try {
        const { data, error } = await supabase
          .from('news_items')
          .select('*')
          .order('date', { ascending: false });
        
        if (error) {
          console.error('Error fetching news items:', error);
          return [...newsItems]; // Return what we already have
        }
        
        if (!data || data.length === 0) {
          console.log('No news items found in database');
          return [...newsItems]; // Return what we already have
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
        
        // Cache the items for offline use
        try {
          localStorage.setItem('cached_news_items', JSON.stringify(items));
          localStorage.setItem('cached_news_items_timestamp', Date.now().toString());
          console.log('Cached news items in localStorage');
        } catch (e) {
          console.error('Error caching news items:', e);
        }
        
        // Update the module-level newsItems variable
        newsItems = [...items];
        return items;
      } catch (fetchError) {
        console.error('Error in database fetch:', fetchError);
        return [...newsItems]; // Return what we already have
      }
    })();
    
    // Race between timeout and actual fetch
    return Promise.race([fetchPromise, timeoutPromise]).then(items => {
      // Always update the module variable with whatever we get
      if (items.length > 0) {
        newsItems = [...items];
      } else if (newsItems.length === 0) {
        // If we still have nothing, use defaults as last resort
        newsItems = [...defaultNewsItems];
      }
      return newsItems;
    });
    
  } catch (error) {
    console.error('Error initializing news items:', error);
    
    // Try to use what we have already
    if (newsItems.length > 0) {
      return [...newsItems];
    }
    
    // Try to use cached items
    const cachedItems = getCachedNewsItems();
    if (cachedItems.length > 0) {
      newsItems = [...cachedItems];
      return cachedItems;
    }
    
    // Fallback to defaults as absolute last resort
    newsItems = [...defaultNewsItems];
    return [...defaultNewsItems];
  }
};

// Helper function to get cached news items
const getCachedNewsItems = (): NewsItem[] => {
  try {
    const cachedNews = localStorage.getItem('cached_news_items');
    const cachedTimestamp = localStorage.getItem('cached_news_items_timestamp');
    
    if (cachedNews && cachedTimestamp) {
      const items = JSON.parse(cachedNews);
      console.log(`Found ${items.length} cached news items from ${new Date(parseInt(cachedTimestamp)).toLocaleString()}`);
      
      // Add translations from cached items to the translations object
      items.forEach((item: NewsItem) => {
        // If translation doesn't exist, add a placeholder
        if (!translations[item.key]) {
          translations[item.key] = {
            en: 'Loading news...',
            es: 'Cargando noticias...',
            fr: 'Chargement des nouvelles...'
          };
        }
      });
      
      return items;
    }
  } catch (e) {
    console.error('Error retrieving cached news:', e);
  }
  
  return [];
};

// Initialize news items on module load
if (typeof window !== 'undefined') {
  // Try to load cached items first for immediate display
  const cachedItems = getCachedNewsItems();
  if (cachedItems.length > 0) {
    newsItems = cachedItems;
  } else {
    newsItems = [...defaultNewsItems];
    
    // Add default translations
    defaultNewsItems.forEach(item => {
      translations[item.key] = {
        en: 'Latest news will appear here...',
        es: 'Las últimas noticias aparecerán aquí...',
        fr: 'Les dernières nouvelles apparaîtront ici...'
      };
    });
  }
  
  // Then asynchronously load from database
  initializeNewsItems().catch(err => {
    console.error('Error initializing news items during module load:', err);
  });
}
