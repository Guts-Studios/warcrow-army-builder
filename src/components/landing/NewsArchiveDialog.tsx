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
import { NewsItem, initializeNewsItems, defaultNewsItems } from "@/data/newsArchive";
import { Loader2 } from "lucide-react";
import { translations } from "@/i18n/translations";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface NewsArchiveDialogProps {
  triggerClassName?: string;
}

const NewsArchiveDialog = ({ triggerClassName }: NewsArchiveDialogProps) => {
  const { t } = useLanguage();
  const [items, setItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const isPreviewEnvironment = () => {
    const hostname = window.location.hostname;
    // Check for specific production domain - adjust this to match your actual production domain
    const isProduction = hostname === 'warcrow-army-builder.netlify.app' || 
                         hostname === 'wab.warcrow.com';
    
    if (isProduction) {
      return false;
    }
    
    // Otherwise, check if it's a preview/development environment
    return hostname === 'lovableproject.com' || 
           hostname.includes('.lovableproject.com') ||
           hostname.includes('localhost') ||
           hostname.includes('127.0.0.1') ||
           hostname.includes('netlify.app');
  };
  
  // Directly fetch news items from the database - no caching
  const fetchNewsItemsDirectly = async () => {
    try {
      console.log("NewsArchiveDialog: Fetching news items directly from database");
      const { data, error } = await supabase
        .from('news_items')
        .select('*')
        .order('date', { ascending: false });
        
      if (error) {
        console.error('Error directly fetching news items:', error);
        return null;
      }
      
      if (!data || data.length === 0) {
        console.log('No news items found in direct database fetch');
        return null;
      }
      
      console.log(`Directly fetched ${data.length} news items from database`);
      
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
      console.error("Error in direct database fetch:", error);
      return null;
    }
  };
  
  useEffect(() => {
    const loadNews = async () => {
      setIsLoading(true);
      try {
        console.log("NewsArchiveDialog: Loading news items...");
        
        // Use default items temporarily while loading
        setItems(defaultNewsItems);
        
        // Refresh the items through either method
        const refreshedItems = await initializeNewsItems();
        if (refreshedItems.length > 0) {
          console.log("NewsArchiveDialog: Got news items:", refreshedItems.length);
          setItems(refreshedItems);
        } else {
          // If that fails, try direct fetch
          console.log("NewsArchiveDialog: No items from initialize, trying direct fetch");
          const directItems = await fetchNewsItemsDirectly();
          if (directItems && directItems.length > 0) {
            console.log("NewsArchiveDialog: Got direct items:", directItems.length);
            setItems(directItems);
          } else {
            // If we still have nothing, use defaults
            console.log("NewsArchiveDialog: No direct items, using defaults");
            setItems(defaultNewsItems);
          }
        }
      } catch (error) {
        console.error("Error loading news items:", error);
        // If we have nothing at this point, use defaults
        setItems(defaultNewsItems);
        toast.error("Failed to load news archive");
      } finally {
        setIsLoading(false);
      }
    };

    loadNews();
  }, []);
  
  // Safe translation retrieval function - ensure we always return something
  const getTranslatedContent = (key: string) => {
    if (!key) return "No content available";
    
    try {
      // If the translation exists, use it
      if (translations[key]) {
        return t(key);
      }
      
      // Fall back to showing the key if translation is missing
      console.warn(`Translation key not found: ${key}`);
      
      // Add a fallback translation to prevent future failures
      translations[key] = {
        en: `Missing translation: ${key}`,
        es: `Traducción faltante: ${key}`,
        fr: `Traduction manquante: ${key}`
      };
      
      // Return something meaningful to the user
      return `Missing translation: ${key}`;
    } catch (error) {
      console.error(`Error getting translation for key ${key}:`, error);
      return "Translation error";
    }
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className={triggerClassName}>
          {t('viewNewsArchive')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-warcrow-gold">
            {t('newsArchive')}
          </DialogTitle>
        </DialogHeader>
        <div className="pt-4 space-y-4">
          {isLoading ? (
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
