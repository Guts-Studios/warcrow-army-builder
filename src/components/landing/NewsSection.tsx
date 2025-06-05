
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { NewsItem, defaultNewsItems } from "@/data/newsArchive";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { translations } from "@/i18n/translations";
import { supabase } from "@/integrations/supabase/client";
import { useEnvironment } from "@/hooks/useEnvironment";
import { SafeHtmlRenderer } from "@/components/ui/safe-html-renderer";
import { useLanguage } from "@/contexts/LanguageContext";
import NewsArchiveDialog from "@/components/landing/NewsArchiveDialog";

interface NewsSectionProps {
  authReady: boolean;
}

export const NewsSection = ({ authReady }: NewsSectionProps) => {
  const { t } = useLanguage();
  const { isPreview } = useEnvironment();
  const [latestNewsItem, setLatestNewsItem] = useState<NewsItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  
  console.log("[NewsSection] Received authReady prop:", {
    authReady,
    timestamp: new Date().toISOString()
  });
  
  // Function to directly fetch news from the database
  const fetchNewsFromDatabase = async () => {
    try {
      console.log("[NewsSection] Starting database fetch - authReady:", authReady);
      
      if (isPreview) {
        console.log("[NewsSection] Preview environment detected, trying to fetch real data first");
      }
      
      const { data, error } = await supabase
        .from('news_items')
        .select('*')
        .order('date', { ascending: false })
        .limit(1)
        .throwOnError();
      
      if (error) {
        console.error("[NewsSection] Error fetching news from database:", error);
        
        if (isPreview) {
          console.log("[NewsSection] Using mock news data in preview mode after fetch failure");
          return {
            id: "preview-news-1",
            date: format(new Date(), 'yyyy-MM-dd'),
            key: "previewNewsKey"
          };
        }
        
        return null;
      }
      
      if (!data || data.length === 0) {
        console.log("[NewsSection] No news items found in database");
        
        if (isPreview) {
          console.log("[NewsSection] Using mock news data in preview mode because no real data found");
          return {
            id: "preview-news-1",
            date: format(new Date(), 'yyyy-MM-dd'),
            key: "previewNewsKey"
          };
        }
        
        return null;
      }
      
      console.log("[NewsSection] Fetched latest news item from database:", data[0]);
      
      const item = data[0];
      translations[item.translation_key] = {
        en: item.content_en || "No content available",
        es: item.content_es || "No content available",
        fr: item.content_fr || "No content available"
      };
      
      return {
        id: item.news_id || item.id,
        date: item.date,
        key: item.translation_key
      };
    } catch (error) {
      console.error("[NewsSection] Error in fetchNewsFromDatabase:", error);
      
      if (isPreview) {
        console.log("[NewsSection] Using mock news data in preview mode after exception");
        return {
          id: "preview-news-1",
          date: format(new Date(), 'yyyy-MM-dd'),
          key: "previewNewsKey"
        };
      }
      
      return null;
    }
  };
  
  // In preview mode, set up some default translations
  useEffect(() => {
    if (isPreview) {
      const todaysDateFormatted = format(new Date(), 'MM/dd/yy');
      translations["previewNewsKey"] = {
        en: `News ${todaysDateFormatted}: Welcome to the preview environment! This is where you can test the latest features before they go live.`,
        es: `Noticias ${todaysDateFormatted}: ¡Bienvenido al entorno de vista previa! Aquí puedes probar las últimas funciones antes de que se publiquen.`,
        fr: `Nouvelles ${todaysDateFormatted}: Bienvenue dans l'environnement de prévisualisation! C'est ici que vous pouvez tester les dernières fonctionnalités avant leur mise en ligne.`
      };
    }
  }, [isPreview]);
  
  // Load news immediately when auth is ready
  useEffect(() => {
    const loadNews = async () => {
      if (!authReady) {
        console.log("[NewsSection] Auth not ready yet, waiting to load news");
        return;
      }

      console.log("[NewsSection] ✅ Auth ready, starting to load news immediately");
      setIsLoading(true);
      setLoadingError(null);
      try {
        console.log("[NewsSection] Loading news items with timestamp:", new Date().toISOString());
        
        const newsItem = await fetchNewsFromDatabase();
        
        if (!newsItem) {
          if (isPreview) {
            console.log("[NewsSection] No news found in database, using preview data");
            const previewNewsItem = {
              id: "preview-news-1",
              date: format(new Date(), 'yyyy-MM-dd'),
              key: "previewNewsKey"
            };
            setLatestNewsItem(previewNewsItem);
          } else {
            console.log("[NewsSection] No news found, using default item");
            setLatestNewsItem(defaultNewsItems[0]);
            
            if (!translations[defaultNewsItems[0].key]) {
              translations[defaultNewsItems[0].key] = {
                en: 'Latest news will appear here...',
                es: 'Las últimas noticias aparecerán aquí...',
                fr: 'Les dernières nouvelles apparaîtront ici...'
              };
            }
          }
        } else {
          setLatestNewsItem(newsItem);
          console.log("[NewsSection] Set latest news item:", newsItem);
        }
      } catch (error) {
        console.error("[NewsSection] Error loading news items:", error);
        setLoadingError("Failed to load news");
        setLatestNewsItem(defaultNewsItems[0]);
        
        if (!translations[defaultNewsItems[0].key]) {
          translations[defaultNewsItems[0].key] = {
            en: 'Latest news will appear here...',
            es: 'Las últimas noticias aparecerán aquí...',
            fr: 'Les dernières nouvelles apparaîtront ici...'
          };
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    loadNews();
  }, [authReady, isPreview]);
  
  // Fix the refresh function to always fetch from the database
  const handleRefreshNews = async () => {
    if (!authReady) {
      console.log("[NewsSection] Auth not ready, cannot refresh news");
      return;
    }

    console.log("[NewsSection] Auth ready, refreshing news");
    setIsLoading(true);
    setLoadingError(null);
    try {
      console.log("[NewsSection] Refreshing news with timestamp:", new Date().toISOString());
      
      const newsItem = await fetchNewsFromDatabase();
      
      if (!newsItem) {
        if (isPreview) {
          const previewNewsItem = {
            id: "preview-news-1",
            date: format(new Date(), 'yyyy-MM-dd'),
            key: "previewNewsKey"
          };
          setLatestNewsItem(previewNewsItem);
          toast.success("News refreshed (preview mode)");
        } else {
          setLoadingError("No news items found");
          toast.info("No news items found");
        }
      } else {
        setLatestNewsItem(newsItem);
        toast.success("News refreshed");
      }
    } catch (error) {
      console.error("[NewsSection] Error refreshing news:", error);
      setLoadingError("Failed to refresh news");
      toast.error("Failed to refresh news");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to format news content with HTML support and simplified date highlighting
  const formatNewsContent = (content: string): React.ReactNode => {
    if (!content) return 'Latest news will appear here...';

    // Check if content contains HTML tags
    const hasHtmlTags = /<[^>]*>/.test(content);
    
    if (hasHtmlTags) {
      // Render as HTML with sanitization - let SafeHtmlRenderer handle all formatting
      return (
        <SafeHtmlRenderer 
          html={content} 
          className="text-sm md:text-base" 
        />
      );
    } else {
      // Handle plain text with date highlighting only
      const dateRegex = /(News\s+\d{1,2}\/\d{1,2}\/\d{2,4}:)|(Noticias\s+\d{1,2}\/\d{1,2}\/\d{2,4}:)/;
      
      if (dateRegex.test(content)) {
        const parts = content.split(dateRegex);
        const filteredParts = parts.filter(part => part !== undefined && part !== '');
        
        return (
          <div>
            {filteredParts.map((part, i) => {
              if (dateRegex.test(part)) {
                return (
                  <span key={i} className="text-warcrow-gold font-bold bg-warcrow-accent/70 px-2 py-0.5 rounded">
                    {part}
                  </span>
                );
              }
              return <span key={i}>{part}</span>;
            })}
          </div>
        );
      }
      
      return <div>{content}</div>;
    }
  };
  
  // Safe translation getter
  const getTranslatedContent = (key: string | undefined): string => {
    if (!key) return "Latest news will appear here...";
    
    try {
      if (translations[key]) {
        const translation = t(key);
        return translation || "Latest news will appear here...";
      }
      
      console.warn(`Translation key not found in NewsSection: ${key}`);
      return "Latest news will appear here...";
    } catch (error) {
      console.error(`Error getting translation for key ${key}:`, error);
      return "Latest news will appear here...";
    }
  };
  
  // Get the formatted news date
  const getNewsDateDisplay = () => {
    if (!latestNewsItem?.date) return format(new Date(), 'MM/dd/yy');
    return format(new Date(latestNewsItem.date), 'MM/dd/yy');
  };

  return (
    <div className="bg-warcrow-accent/50 p-3 md:p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <p className="text-warcrow-gold font-semibold text-sm md:text-base">News as of {getNewsDateDisplay()}</p>
        <NewsArchiveDialog 
          triggerClassName="text-warcrow-gold hover:text-warcrow-gold/80 text-sm" 
          authReady={authReady}
        />
      </div>
      {!authReady ? (
        <div className="flex justify-center items-center py-3">
          <Loader2 className="h-5 w-5 animate-spin text-warcrow-gold/70" />
          <span className="ml-2 text-warcrow-text/70 text-sm">Waiting for authentication...</span>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center items-center py-3">
          <Loader2 className="h-5 w-5 animate-spin text-warcrow-gold/70" />
          <span className="ml-2 text-warcrow-text/70 text-sm">Loading latest news...</span>
        </div>
      ) : loadingError ? (
        <div className="text-center py-3">
          <p className="text-warcrow-text/70 text-sm mb-2">{loadingError}</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefreshNews}
            className="text-warcrow-gold border-warcrow-gold/40"
          >
            Try Again
          </Button>
        </div>
      ) : latestNewsItem ? (
        <div className="text-warcrow-text text-sm md:text-base">
          {formatNewsContent(getTranslatedContent(latestNewsItem.key))}
        </div>
      ) : (
        <p className="text-warcrow-text/70 text-sm">No recent news available.</p>
      )}
    </div>
  );
};
