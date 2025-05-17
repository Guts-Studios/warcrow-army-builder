
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

// Function to initialize news items from the database
export const initializeNewsItems = async (): Promise<NewsItem[]> => {
  try {
    console.log("Initializing news items from database...");
    
    // Set a timeout to avoid long waiting time
    const timeoutPromise = new Promise<NewsItem[]>((resolve) => {
      setTimeout(() => {
        console.log("Database fetch timeout after 1500ms");
        
        // Use cached items first if available
        const cachedItems = getCachedNewsItems();
        if (cachedItems.length > 0) {
          resolve(cachedItems);
          return;
        }
        
        // Fall back to defaults if no cached items
        resolve([...defaultNewsItems]);
      }, 1500); // 1.5 seconds timeout for faster response
    });
    
    // Database fetch promise
    const fetchPromise = (async (): Promise<NewsItem[]> => {
      const { data, error } = await supabase
        .from('news_items')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) {
        console.error('Error fetching news items:', error);
        
        // Try to use cached items
        const cachedItems = getCachedNewsItems();
        if (cachedItems.length > 0) return cachedItems;
        
        return [...defaultNewsItems];
      }
      
      if (!data || data.length === 0) {
        console.log('No news items found in database');
        
        // Try to use cached items
        const cachedItems = getCachedNewsItems();
        if (cachedItems.length > 0) return cachedItems;
        
        return [...defaultNewsItems];
      }
      
      console.log(`Fetched ${data.length} news items from database`);
      
      const items: NewsItem[] = data.map(item => {
        // Update translations with available content
        try {
          translations[item.translation_key] = {
            en: item.content_en || '',
            es: item.content_es || '',
            fr: item.content_fr || ''
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
    })();
    
    // Race between timeout and actual fetch
    return Promise.race([fetchPromise, timeoutPromise]).then(items => {
      newsItems = [...items]; // Update the module variable
      return items;
    });
    
  } catch (error) {
    console.error('Error initializing news items:', error);
    
    // Try to use cached items first
    const cachedItems = getCachedNewsItems();
    if (cachedItems.length > 0) {
      newsItems = [...cachedItems];
      return cachedItems;
    }
    
    // Fallback to defaults
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
  }
  
  // Then asynchronously load from database
  initializeNewsItems().catch(err => {
    console.error('Error initializing news items during module load:', err);
  });
}
