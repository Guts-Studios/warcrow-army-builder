
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { format } from "date-fns";
import { NewsItem, defaultNewsItems } from "@/data/newsArchive";
import { Loader2 } from "lucide-react";
import { translations } from "@/i18n/translations";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface NewsArchiveDialogProps {
  triggerClassName?: string;
}

const NewsArchiveDialog = ({ triggerClassName }: NewsArchiveDialogProps) => {
  const { t } = useLanguage();
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const [items, setItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Determine if auth is ready
  const authReady = !authLoading && isAuthenticated !== null;
  
  console.log("[NewsArchiveDialog] Component state:", {
    authReady,
    isAuthenticated,
    timestamp: new Date().toISOString()
  });
  
  // Direct fetch news items from the database with no caching
  const fetchNewsItemsDirectly = async () => {
    try {
      console.log("[NewsArchiveDialog] About to fetch news items - auth ready:", authReady);
      console.log("[NewsArchiveDialog] Fetching news items directly from database");
      
      const { data, error } = await supabase
        .from('news_items')
        .select('*')
        .order('date', { ascending: false });
        
      if (error) {
        console.error('[NewsArchiveDialog] Error directly fetching news items:', error);
        return null;
      }
      
      if (!data || data.length === 0) {
        console.log('[NewsArchiveDialog] No news items found in direct database fetch');
        return null;
      }
      
      console.log(`[NewsArchiveDialog] Directly fetched ${data.length} news items from database`);
      
      const formattedItems: NewsItem[] = data.map(item => {
        // Add translations to the translations object
        translations[item.translation_key] = {
          en: item.content_en || 'No content available',
          es: item.content_es || 'No content available',
          fr: item.content_fr || 'No content available'
        };
        
        return {
          id: item.news_id || item.id,
          date: item.date,
          key: item.translation_key
        };
      });
      
      return formattedItems;
    } catch (error) {
      console.error("[NewsArchiveDialog] Error in direct database fetch:", error);
      return null;
    }
  };
  
  useEffect(() => {
    const loadNews = async () => {
      if (!authReady) {
        console.log("[NewsArchiveDialog] Auth not ready yet, waiting to load news");
        return;
      }

      console.log("[NewsArchiveDialog] Auth ready, starting to load news");
      setIsLoading(true);
      try {
        console.log("[NewsArchiveDialog] Loading news items...");
        
        // Try direct fetch first (fastest path)
        const directItems = await fetchNewsItemsDirectly();
        if (directItems && directItems.length > 0) {
          console.log("[NewsArchiveDialog] Got direct items:", directItems.length);
          setItems(directItems);
        } else {
          // Use defaults if nothing else works
          console.log("[NewsArchiveDialog] No items found, using defaults");
          setItems(defaultNewsItems);
        }
      } catch (error) {
        console.error("[NewsArchiveDialog] Error loading news items:", error);
        setItems(defaultNewsItems);
        toast.error("Failed to load news archive");
      } finally {
        setIsLoading(false);
      }
    };

    loadNews();
  }, [authReady]);
  
  // Safe translation retrieval function
  const getTranslatedContent = (key: string) => {
    if (!key) return "No content available";
    
    try {
      // If the translation exists, use it
      if (translations[key]) {
        return t(key);
      }
      
      // Fall back to showing the key if translation is missing
      console.warn(`[NewsArchiveDialog] Translation key not found: ${key}`);
      
      // Add a fallback translation to prevent future failures
      translations[key] = {
        en: `Missing translation: ${key}`,
        es: `Traducción faltante: ${key}`,
        fr: `Traduction manquante: ${key}`
      };
      
      // Return something meaningful to the user
      return `Missing translation: ${key}`;
    } catch (error) {
      console.error(`[NewsArchiveDialog] Error getting translation for key ${key}:`, error);
      return "Translation error";
    }
  };
  
  return (
    <Dialog>
      <DialogTrigger className={triggerClassName}>
        {t('viewNewsArchive')}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-warcrow-gold">
            {t('newsArchive')}
          </DialogTitle>
        </DialogHeader>
        <div className="pt-4 space-y-4">
          {!authReady ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-5 w-5 animate-spin text-warcrow-gold/70" />
              <span className="ml-2 text-warcrow-text/70">Waiting for authentication...</span>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-5 w-5 animate-spin text-warcrow-gold/70" />
              <span className="ml-2 text-warcrow-text/70">Loading news archive...</span>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-warcrow-text/70">No news items found in the archive.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="border border-warcrow-gold/20 rounded-md p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-warcrow-gold font-semibold">
                      {format(new Date(item.date), 'MMM dd, yyyy')}
                    </h3>
                  </div>
                  <p className="text-warcrow-text">{getTranslatedContent(item.key)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewsArchiveDialog;
