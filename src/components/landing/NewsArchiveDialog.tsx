
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { newsItems, initializeNewsItems, NewsItem } from "@/data/newsArchive";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const NewsArchiveDialog = ({ triggerClassName = "" }) => {
  const { t, language } = useLanguage();
  const [items, setItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  
  const loadNews = async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      console.log("NewsArchiveDialog: Loading news items...");
      const loadedItems = await initializeNewsItems();
      if (loadedItems && loadedItems.length > 0) {
        setItems(loadedItems);
        console.log("NewsArchiveDialog: Loaded", loadedItems.length, "news items");
      } else {
        console.log("NewsArchiveDialog: No news items found");
        setLoadError("No news items found");
      }
    } catch (error) {
      console.error("NewsArchiveDialog: Error loading news:", error);
      setLoadError("Failed to load news archive");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadNews();
  }, []);

  const handleRefresh = async () => {
    await loadNews();
    toast.success("News archive refreshed");
  };

  // Function to format news content with highlighted date
  const formatNewsContent = (content: string): React.ReactNode => {
    if (!content) return '';

    // Look for date patterns
    const dateRegex = /(News\s+\d{1,2}\/\d{1,2}\/\d{2,4}:)|(Noticias\s+\d{1,2}\/\d{1,2}\/\d{2,4}:)/;
    
    if (dateRegex.test(content)) {
      const parts = content.split(dateRegex);
      return (
        <>
          {parts.map((part, i) => {
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
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className={triggerClassName}>
          {t('newsArchive')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-warcrow-gold">
            {t('newsArchive')}
          </DialogTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh} 
            disabled={isLoading}
            className="text-warcrow-gold border-warcrow-gold/40"
          >
            {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Refresh"}
          </Button>
        </DialogHeader>
        <div className="space-y-5 py-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-warcrow-gold/70" />
              <p className="ml-3 text-warcrow-text">{t('loading')}</p>
            </div>
          ) : loadError ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-4">{loadError}</p>
              <Button 
                variant="outline" 
                onClick={handleRefresh}
                className="text-warcrow-gold border-warcrow-gold/40"
              >
                Try Again
              </Button>
            </div>
          ) : items.length === 0 ? (
            <p className="text-center text-muted-foreground">{language === 'en' ? 'No news items found' : language === 'es' ? 'No se encontraron noticias' : 'Aucune nouvelle trouvée'}</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="border-b border-warcrow-gold/20 pb-4 last:border-b-0">
                <p className="text-xs text-warcrow-gold/60 mb-1">
                  {item.date ? format(parseISO(item.date), 'MMM d, yyyy') : ''}
                </p>
                <p className="text-sm text-warcrow-text">
                  {formatNewsContent(t(item.key))}
                </p>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewsArchiveDialog;
