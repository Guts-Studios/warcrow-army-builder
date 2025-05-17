
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

// Enhanced preview detection with more robust hostname checking
const isPreviewEnvironment = () => {
  if (typeof window === 'undefined') return false;
  
  const hostname = window.location.hostname;
  
  // Include more preview hostnames to catch all possible preview environments
  const isPreviewEnv = hostname === 'lovableproject.com' || 
                      hostname.includes('.lovableproject.com') ||
                      hostname.includes('localhost') ||
                      hostname.includes('127.0.0.1') ||
                      hostname.includes('netlify.app') ||
                      hostname.includes('id-preview') ||
                      hostname.includes('lovable.app');
  
  console.log("Is preview environment in newsArchive:", isPreviewEnv, "hostname:", hostname);
  return isPreviewEnv;
};

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
    
    // Generate mock news data for preview environments
    if (isPreviewEnvironment()) {
      console.log("Preview environment detected, using mock news data");
      
      // Create mock news items with today's date
      const mockNewsItems = [
        {
          id: `news-preview-${Date.now()}`,
          date: new Date().toISOString(),
          key: "news.preview.latest"
        },
        {
          id: `news-preview-${Date.now() - 1000}`,
          date: new Date(Date.now() - 86400000).toISOString(),
          key: "news.preview.previous"
        }
      ];
      
      // Add translations for the mock news
      translations["news.preview.latest"] = {
        en: "News 5/17/25: Latest update for the preview environment. This is mock data that shows how news will appear.",
        es: "Noticias 17/5/25: Última actualización para el entorno de vista previa. Estos son datos simulados que muestran cómo aparecerán las noticias.",
        fr: "Nouvelles 17/5/25: Dernière mise à jour pour l'environnement de prévisualisation. Il s'agit de données simulées qui montrent comment les nouvelles apparaîtront."
      };
      
      translations["news.preview.previous"] = {
        en: "News 5/16/25: Previous update for testing purposes. The news system allows for multiple entries displayed in chronological order.",
        es: "Noticias 16/5/25: Actualización anterior para propósitos de prueba. El sistema de noticias permite múltiples entradas mostradas en orden cronológico.",
        fr: "Nouvelles 16/5/25: Mise à jour précédente à des fins de test. Le système de nouvelles permet d'afficher plusieurs entrées par ordre chronologique."
      };
      
      // Update the newsItems array with mock data
      newsItems = [...mockNewsItems];
      
      // Cache the mock items
      try {
        localStorage.setItem('cached_news_items', JSON.stringify(mockNewsItems));
        localStorage.setItem('cached_news_items_timestamp', Date.now().toString());
      } catch (e) {
        console.error('Error caching mock news items:', e);
      }
      
      return mockNewsItems;
    }
    
    // Set a timeout to avoid long waiting time for real data
    const timeoutPromise = new Promise<NewsItem[]>((resolve) => {
      setTimeout(() => {
        console.log("Database fetch timeout after 1500ms");
        
        // Return what we have so far - this could be cached items or defaultNewsItems
        resolve([...newsItems]);
      }, 1500); // 1.5s timeout for more lenient response time
    });
    
    // Database fetch promise
    const fetchPromise = (async (): Promise<NewsItem[]> => {
      try {
        console.log("Starting database fetch with isPreview:", isPreviewEnvironment());
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
