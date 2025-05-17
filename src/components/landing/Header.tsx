
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NewsItem, newsItems } from '@/data/newsArchive';
import { translations } from '@/i18n/translations';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { 
  Info, 
  Book, 
  Menu, 
  RefreshCcw, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  HelpCircle 
} from 'lucide-react';
import { initializeNewsItems } from '@/data/newsArchive';

// Import NewsArchiveDialog as default export
import NewsArchiveDialog from './NewsArchiveDialog';

export const Header = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { isAuthenticated } = useAuth();
  
  const [newsIndex, setNewsIndex] = useState(0);
  const [showNewsArchiveDialog, setShowNewsArchiveDialog] = useState(false);
  const [currentNewsItems, setCurrentNewsItems] = useState<NewsItem[]>(newsItems);
  const [isRefreshingNews, setIsRefreshingNews] = useState(false);

  useEffect(() => {
    // Initialize news items when component mounts
    const loadNewsItems = async () => {
      try {
        const items = await initializeNewsItems();
        setCurrentNewsItems(items);
      } catch (error) {
        console.error("Error loading news items:", error);
        // Keep using the current items (which might be from static data)
      }
    };
    
    loadNewsItems();
  }, []);

  const handleRefreshNews = async () => {
    try {
      setIsRefreshingNews(true);
      // Clear the localStorage cache
      localStorage.removeItem('cached_news_items');
      // Re-fetch from database
      const items = await initializeNewsItems();
      
      setCurrentNewsItems(items);
      toast.success(t('newsRefreshed'));
    } catch (error) {
      console.error("Error refreshing news:", error);
      toast.error(t('errorRefreshingNews'));
    } finally {
      setIsRefreshingNews(false);
    }
  };

  const navigateToPreviousNews = () => {
    if (newsIndex < currentNewsItems.length - 1) {
      setNewsIndex(newsIndex + 1);
    }
  };

  const navigateToNextNews = () => {
    if (newsIndex > 0) {
      setNewsIndex(newsIndex - 1);
    }
  };

  const currentNewsItem = currentNewsItems[newsIndex];
  
  // Provide a default news key that we know exists in translations
  let newsTranslationKey = 'loading';
  if (currentNewsItem && currentNewsItem.key) {
    newsTranslationKey = currentNewsItem.key;
  }

  // Use a safer approach to access translations - check if the key exists first
  // Also ensure we have a fallback if the translation doesn't exist
  const newsText = translations[newsTranslationKey] ? 
    (translations[newsTranslationKey][language] || translations[newsTranslationKey]['en'] || 'News update') :
    translations['loading'][language] || 'Loading...';
  
  // Format the news date
  const formattedDate = currentNewsItem?.date 
    ? new Date(currentNewsItem.date).toLocaleDateString(
        language === 'es' ? 'es-ES' : language === 'fr' ? 'fr-FR' : 'en-US', 
        { year: 'numeric', month: '2-digit', day: '2-digit' }
      )
    : new Date().toLocaleDateString(
        language === 'es' ? 'es-ES' : language === 'fr' ? 'fr-FR' : 'en-US', 
        { year: 'numeric', month: '2-digit', day: '2-digit' }
      );
  
  return (
    <header className="bg-black text-white py-4 px-4 border-b border-warcrow-gold/20">
      <div className="container mx-auto flex flex-col gap-4">
        {/* Logo and Title */}
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center mb-4 sm:mb-0">
            <Link to="/" className="flex items-center">
              <h1 className="text-3xl font-bold text-warcrow-gold">
                Warcrow Army Builder
              </h1>
            </Link>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/faq')}
              className="border-warcrow-gold/30 text-warcrow-gold"
            >
              <HelpCircle className="mr-2 h-4 w-4" />
              FAQ
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/changelog')}
              className="border-warcrow-gold/30 text-warcrow-gold"
            >
              <Info className="mr-2 h-4 w-4" />
              {t('changelog')}
            </Button>
          </div>
        </div>
        
        {/* News Section */}
        <div className="p-4 border border-warcrow-gold/30 rounded-md bg-black/60 backdrop-blur">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <h2 className="text-lg font-bold text-warcrow-gold flex items-center">
                {t('news')} {formattedDate}
              </h2>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRefreshNews}
                disabled={isRefreshingNews}
                className={`h-8 w-8 text-warcrow-gold/70 hover:text-warcrow-gold ${isRefreshingNews ? 'animate-spin' : ''}`}
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNewsArchiveDialog(true)}
                className="h-8 text-warcrow-gold/70 hover:text-warcrow-gold"
              >
                <Clock className="h-4 w-4 mr-1" />
                {t('newsArchive')}
              </Button>
            </div>
          </div>
          
          <div className="relative min-h-[60px]">
            <div className="py-1 text-sm text-warcrow-text">
              {newsText}
            </div>
            
            {currentNewsItems.length > 1 && (
              <div className="flex justify-between mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={navigateToPreviousNews}
                  disabled={newsIndex >= currentNewsItems.length - 1}
                  className={`h-8 px-2 ${newsIndex >= currentNewsItems.length - 1 ? 'text-warcrow-gold/30' : 'text-warcrow-gold/70 hover:text-warcrow-gold'}`}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  {t('older')}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={navigateToNextNews}
                  disabled={newsIndex <= 0}
                  className={`h-8 px-2 ${newsIndex <= 0 ? 'text-warcrow-gold/30' : 'text-warcrow-gold/70 hover:text-warcrow-gold'}`}
                >
                  {t('newer')}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* News Archive Dialog - Using the controlled component API */}
      <NewsArchiveDialog 
        open={showNewsArchiveDialog} 
        onOpenChange={setShowNewsArchiveDialog}
      />
    </header>
  );
};
