
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { newsItems, initializeNewsItems, NewsItem } from "@/data/newsArchive";
import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";

const NewsArchiveDialog = ({ triggerClassName = "" }) => {
  const { t, language } = useLanguage();
  const [items, setItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadNews = async () => {
      setIsLoading(true);
      const loadedItems = await initializeNewsItems();
      if (loadedItems && loadedItems.length > 0) {
        setItems(loadedItems);
      }
      setIsLoading(false);
    };
    
    loadNews();
  }, []);

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
        <DialogHeader>
          <DialogTitle className="text-warcrow-gold">
            {t('newsArchive')}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-5 py-4">
          {isLoading ? (
            <p className="text-center">{t('loading')}</p>
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
