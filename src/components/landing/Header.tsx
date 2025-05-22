import { getLatestVersion } from "@/utils/version";
import { useLanguage } from "@/contexts/LanguageContext";
import NewsArchiveDialog from "./NewsArchiveDialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import changelogContent from '../../../CHANGELOG.md?raw';
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { NewsItem, defaultNewsItems } from "@/data/newsArchive";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { translations } from "@/i18n/translations";
import { supabase } from "@/integrations/supabase/client";
import { useEnvironment } from "@/hooks/useEnvironment";

interface HeaderProps {
  latestVersion: string;
  userCount: number | null;
  isLoadingUserCount: boolean;
  latestFailedBuild?: any;
  onRefreshUserCount?: () => void;
}

export const Header = ({ 
  latestVersion, 
  userCount, 
  isLoadingUserCount, 
  latestFailedBuild,
  onRefreshUserCount 
}: HeaderProps) => {
  const { t } = useLanguage();
  const { isWabAdmin } = useAuth();
  const { isPreview } = useEnvironment();
  const todaysDate = format(new Date(), 'MM/dd/yy');
  const [latestNewsItem, setLatestNewsItem] = useState<NewsItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shownBuildFailureId, setShownBuildFailureId] = useState<string | null>(null);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  
  // Function to directly fetch news from the database
  const fetchNewsFromDatabase = async () => {
    try {
      console.log("Header: Directly fetching news from database with timestamp:", new Date().toISOString());
      
      // Use mock data in preview mode, BUT only as fallback
      if (isPreview) {
        console.log("Header: Preview environment detected, trying to fetch real data first");
        // Try to fetch real data first, use mock only as fallback
      }
      
      // Direct database fetch with cache busting
      const timestamp = new Date().getTime();
      
      const { data, error } = await supabase
        .from('news_items')
        .select('*')
        .order('date', { ascending: false })
        .limit(1)
        .throwOnError();
      
      if (error) {
        console.error("Error fetching news from database:", error);
        
        // If in preview mode and fetch failed, use mock data
        if (isPreview) {
          console.log("Header: Using mock news data in preview mode after fetch failure");
          return {
            id: "preview-news-1",
            date: format(new Date(), 'yyyy-MM-dd'),
            key: "previewNewsKey"
          };
        }
        
        return null;
      }
      
      if (!data || data.length === 0) {
        console.log("No news items found in database");
        
        // If in preview mode and no data, use mock data
        if (isPreview) {
          console.log("Header: Using mock news data in preview mode because no real data found");
          return {
            id: "preview-news-1",
            date: format(new Date(), 'yyyy-MM-dd'),
            key: "previewNewsKey"
          };
        }
        
        return null;
      }
      
      console.log("Fetched latest news item from database:", data[0]);
      
      // Add translations for the news item
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
      console.error("Error in fetchNewsFromDatabase:", error);
      
      // If in preview mode and fetch failed, use mock data
      if (isPreview) {
        console.log("Header: Using mock news data in preview mode after exception");
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
      // Add a default preview translation
      translations["previewNewsKey"] = {
        en: `News ${todaysDate}: Welcome to the preview environment! This is where you can test the latest features before they go live.`,
        es: `Noticias ${todaysDate}: ¡Bienvenido al entorno de vista previa! Aquí puedes probar las últimas funciones antes de que se publiquen.`,
        fr: `Nouvelles ${todaysDate}: Bienvenue dans l'environnement de prévisualisation! C'est ici que vous pouvez tester les dernières fonctionnalités avant leur mise en ligne.`
      };
    }
  }, [todaysDate, isPreview]);
  
  useEffect(() => {
    const loadNews = async () => {
      setIsLoading(true);
      setLoadingError(null);
      try {
        console.log("Header: Loading news items with timestamp:", new Date().toISOString());
        
        // Force a fresh request each time to avoid caching issues
        const newsItem = await fetchNewsFromDatabase();
        
        if (!newsItem) {
          // If no news found in database, use preview data only as fallback
          if (isPreview) {
            console.log("Header: No news found in database, using preview data");
            const previewNewsItem = {
              id: "preview-news-1",
              date: format(new Date(), 'yyyy-MM-dd'),
              key: "previewNewsKey"
            };
            setLatestNewsItem(previewNewsItem);
          } else {
            console.log("Header: No news found, using default item");
            setLatestNewsItem(defaultNewsItems[0]);
            
            // Add default translation if not already present
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
          console.log("Header: Set latest news item:", newsItem);
        }
      } catch (error) {
        console.error("Header: Error loading news items:", error);
        setLoadingError("Failed to load news");
        setLatestNewsItem(defaultNewsItems[0]);
        
        // Add default translation if not already present
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
  }, [isPreview]);
  
  // Update the shown build failure ID when a new one comes in
  useEffect(() => {
    if (shouldShowBuildFailure && latestFailedBuild?.id) {
      setShownBuildFailureId(latestFailedBuild.id);
    }
  }, [latestFailedBuild]);
  
  // Only show build failure alert if certain conditions are met
  const shouldShowBuildFailure = 
    isWabAdmin && 
    latestFailedBuild && 
    latestFailedBuild.id && 
    latestFailedBuild.id !== shownBuildFailureId && 
    latestFailedBuild.created_at && 
    (new Date().getTime() - new Date(latestFailedBuild.created_at).getTime() < 24 * 60 * 60 * 1000) &&
    (latestFailedBuild.site_name === "warcrow-army-builder" || latestFailedBuild.site_name === "warcrowarmy.com");

  // Function to handle viewing a deployment
  const handleViewDeployment = (deployUrl: string) => {
    if (deployUrl) {
      window.open(deployUrl, '_blank');
    }
  };
  
  // Fix the refresh function to always fetch from the database
  const handleRefreshNews = async () => {
    setIsLoading(true);
    setLoadingError(null);
    try {
      console.log("Header: Refreshing news with timestamp:", new Date().toISOString());
      
      // Always try to fetch from the database
      const newsItem = await fetchNewsFromDatabase();
      
      if (!newsItem) {
        // Only use preview data as fallback if no real data exists
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
      console.error("Error refreshing news:", error);
      setLoadingError("Failed to refresh news");
      toast.error("Failed to refresh news");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to format news content with highlighted date
  const formatNewsContent = (content: string): React.ReactNode => {
    if (!content) return 'Latest news will appear here...';

    // Look for date patterns like "News 5/3/25:" or similar date formats with the word "News" before
    const dateRegex = /(News\s+\d{1,2}\/\d{1,2}\/\d{2,4}:)|(Noticias\s+\d{1,2}\/\d{1,2}\/\d{2,4}:)/;
    
    if (dateRegex.test(content)) {
      const parts = content.split(dateRegex);
      
      // Filter out empty strings and undefined values
      const filteredParts = parts.filter(part => part !== undefined && part !== '');
      
      return (
        <>
          {filteredParts.map((part, i) => {
            // If this part matches the date pattern, highlight it
            if (dateRegex.test(part)) {
              return (
                <span key={i} className="text-warcrow-gold font-bold bg-warcrow-accent/70 px-2 py-0.5 rounded">
                  {part}
                </span>
              );
            }
            return <span key={i}>{part}</span>;
          })}
        </>
      );
    }
    
    // If no date found, just return the content
    return content;
  };
  
  // Safe translation getter
  const getTranslatedContent = (key: string | undefined): string => {
    if (!key) return "Latest news will appear here...";
    
    try {
      // If the translation exists, use it
      if (translations[key]) {
        const translation = t(key);
        return translation || "Latest news will appear here...";
      }
      
      // If not found, provide a default message
      console.warn(`Translation key not found in Header: ${key}`);
      return "Latest news will appear here...";
    } catch (error) {
      console.error(`Error getting translation for key ${key}:`, error);
      return "Latest news will appear here...";
    }
  };
  
  return (
    <div className="text-center space-y-6 md:space-y-8">
      <img 
        src="https://odqyoncwqawdzhquxcmh.supabase.co/storage/v1/object/public/images/Logo.png?t=2024-12-31T22%3A06%3A03.113Z" 
        alt={t('logoAlt')} 
        className="w-64 md:w-[32rem] mx-auto"
      />
      <h1 className="text-2xl md:text-4xl font-bold text-warcrow-gold">
        {t('welcomeMessage')}
      </h1>
      <div className="text-warcrow-gold/80 text-xs md:text-sm">{t('version')} {latestVersion}</div>
      <p className="text-lg md:text-xl text-warcrow-text">
        {t('appDescription')}
      </p>
      <div>
        <p className="text-md md:text-lg text-warcrow-gold/80">
          {isLoadingUserCount ? (
            t('loadingUserCount')
          ) : (
            userCount !== null ? t('userCountMessage').replace('{count}', String(userCount)) : t('loadingUserCount')
          )}
        </p>
      </div>
      
      {/* Admin-only Build Failure Alert - Only for Warcrow sites */}
      {shouldShowBuildFailure && (
        <Alert variant="destructive" className="bg-red-900/80 border-red-600 backdrop-blur-sm">
          <AlertTriangle className="h-4 w-4 text-red-400" />
          <AlertTitle className="text-red-200">
            Latest Build Failed
          </AlertTitle>
          <AlertDescription className="text-red-300 mt-1">
            <div className="mb-2">
              <p className="mb-1">{latestFailedBuild.site_name} ({latestFailedBuild.branch})</p>
              <Button 
                variant="link" 
                className="p-0 h-auto text-blue-300 hover:text-blue-200"
                onClick={() => handleViewDeployment(latestFailedBuild.deploy_url)}
              >
                View deployment details
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="bg-warcrow-accent/50 p-3 md:p-4 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <p className="text-warcrow-gold font-semibold text-sm md:text-base">News {todaysDate}</p>
          <div className="hidden">
            <NewsArchiveDialog triggerClassName="text-xs text-warcrow-gold/70 hover:text-warcrow-gold" />
          </div>
        </div>
        {isLoading ? (
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
          <p className="text-warcrow-text text-sm md:text-base">
            {formatNewsContent(getTranslatedContent(latestNewsItem.key))}
          </p>
        ) : (
          <p className="text-warcrow-text/70 text-sm">No recent news available.</p>
        )}
        
        {/* Changelog button and dialog - kept in Header.tsx but hidden on the page */}
        <div className="mt-3 pt-3 border-t border-warcrow-gold/20 hidden">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="link"
                className="text-warcrow-gold hover:text-warcrow-gold/80 text-sm"
              >
                {t('viewChangelog')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-warcrow-gold">
                  {t('changelog')}
                </DialogTitle>
              </DialogHeader>
              <div className="whitespace-pre-wrap font-mono text-sm">
                {changelogContent}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};
