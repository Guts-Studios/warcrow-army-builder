
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
import { newsItems, initializeNewsItems, NewsItem, defaultNewsItems } from "@/data/newsArchive";
import { Loader2 } from "lucide-react";
import { translations } from "@/i18n/translations";

interface NewsArchiveDialogProps {
  triggerClassName?: string;
}

const NewsArchiveDialog = ({ triggerClassName }: NewsArchiveDialogProps) => {
  const { t } = useLanguage();
  const [items, setItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadNews = async () => {
      setIsLoading(true);
      try {
        console.log("NewsArchiveDialog: Loading news items...");
        
        // First check if there are already news items available in memory
        if (newsItems.length > 0) {
          console.log("NewsArchiveDialog: Using existing items:", newsItems.length);
          setItems(newsItems);
          setIsLoading(false);
        } else {
          // If not, use default items temporarily
          console.log("NewsArchiveDialog: No existing items, using defaults temporarily");
          setItems(defaultNewsItems);
        }
        
        // Try to refresh the items
        const refreshedItems = await initializeNewsItems();
        if (refreshedItems.length > 0) {
          console.log("NewsArchiveDialog: Got refreshed items:", refreshedItems.length);
          setItems(refreshedItems);
        } else if (items.length === 0) {
          // If we still have nothing, use defaults as last resort
          console.log("NewsArchiveDialog: No refreshed items, using defaults");
          setItems(defaultNewsItems);
        }
      } catch (error) {
        console.error("Error loading news items:", error);
        // If we have nothing at this point, use defaults
        if (items.length === 0) {
          setItems(defaultNewsItems);
        }
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
