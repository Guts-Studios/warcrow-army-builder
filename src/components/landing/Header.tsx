
import { getLatestVersion } from "@/utils/version";
import { useLanguage } from "@/contexts/LanguageContext";
import NewsArchiveDialog from "./NewsArchiveDialog";
import { Button } from "@/components/ui/button";
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
import { newsItems, initializeNewsItems, NewsItem } from "@/data/newsArchive";

interface HeaderProps {
  latestVersion: string;
  userCount: number | null;
  isLoadingUserCount: boolean;
}

export const Header = ({ latestVersion, userCount, isLoadingUserCount }: HeaderProps) => {
  const { t } = useLanguage();
  const todaysDate = format(new Date(), 'MM/dd/yy');
  const [latestNewsItem, setLatestNewsItem] = useState<NewsItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadNews = async () => {
      setIsLoading(true);
      const items = await initializeNewsItems();
      if (items && items.length > 0) {
        setLatestNewsItem(items[0]); // Get the most recent news item
      }
      setIsLoading(false);
    };
    
    loadNews();
  }, []);
  
  // Function to format news content with highlighted date, same as in NewsArchiveDialog
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
      <p className="text-md md:text-lg text-warcrow-gold/80">
        {isLoadingUserCount ? (
          t('loadingUserCount')
        ) : (
          t('userCountMessage').replace('{count}', String(userCount))
        )}
      </p>
      <div className="bg-warcrow-accent/50 p-3 md:p-4 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <p className="text-warcrow-gold font-semibold text-sm md:text-base">News {todaysDate}</p>
          <NewsArchiveDialog triggerClassName="text-xs text-warcrow-gold/70 hover:text-warcrow-gold" />
        </div>
        {isLoading ? (
          <p className="text-warcrow-text/70 text-sm">Loading latest news...</p>
        ) : latestNewsItem ? (
          <p className="text-warcrow-text text-sm md:text-base">
            {formatNewsContent(t(latestNewsItem.key))}
          </p>
        ) : (
          <p className="text-warcrow-text/70 text-sm">No recent news available.</p>
        )}
        
        {/* Changelog button and dialog - moved from Landing.tsx */}
        <div className="mt-3 pt-3 border-t border-warcrow-gold/20">
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
