
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { newsItems, initializeNewsItems, NewsItem } from "@/data/newsArchive";
import { format } from "date-fns";
import { useEffect, useState } from "react";

interface NewsArchiveDialogProps {
  triggerClassName?: string;
}

export const NewsArchiveDialog = ({ triggerClassName }: NewsArchiveDialogProps) => {
  const { t, language } = useLanguage();
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      const loadedItems = await initializeNewsItems();
      setItems(loadedItems);
      setLoading(false);
    };
    
    loadNews();
  }, []);
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    
    // Format the date based on the selected language without using locale imports
    if (language === 'es') {
      // Spanish date format (manually formatted)
      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();
      
      const monthNames = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
      ];
      
      return `${day} de ${monthNames[month]} de ${year}`;
    } else {
      // English date format using date-fns without locale
      return format(date, 'MMMM d, yyyy');
    }
  };

  // Function to format news content with highlighted date
  const formatNewsContent = (content: string): React.ReactNode => {
    if (!content) return '';

    // Look for date patterns like "News 5/3/25:" or similar date formats with the word "News" before
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
        <Button 
          variant="link" 
          className={triggerClassName || "text-warcrow-gold hover:text-warcrow-gold/80"}
        >
          {t('viewOlderNews')}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-warcrow-background border-warcrow-gold/30 max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-warcrow-gold">
            {t('newsArchive')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {loading ? (
            <div className="text-center p-4 text-warcrow-gold/60">Loading news...</div>
          ) : items.length > 0 ? (
            items.map((item) => (
              <div key={item.id} className="border border-warcrow-gold/30 rounded-lg p-4">
                <div className="text-warcrow-gold font-semibold mb-2">
                  {formatDate(item.date)}
                </div>
                <div className="text-warcrow-text text-sm">
                  {formatNewsContent(t(item.key))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-4 text-warcrow-gold/60">No news items found.</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewsArchiveDialog;
