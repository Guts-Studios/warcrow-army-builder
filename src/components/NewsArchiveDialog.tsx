
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, Globe } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';

interface NewsItem {
  id: string;
  news_id: string;
  date: string;
  translation_key: string;
  content_en: string;
  content_es?: string;
  content_fr?: string;
  created_at: string;
  updated_at: string;
}

interface NewsArchiveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NewsArchiveDialog: React.FC<NewsArchiveDialogProps> = ({ open, onOpenChange }) => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { t, language } = useLanguage();
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  
  // Wait for auth to be resolved before fetching
  const isAuthResolved = !authLoading && isAuthenticated !== null;

  const fetchNewsItems = async () => {
    if (!isAuthResolved) {
      console.log("NewsArchiveDialog: Skipping news fetch - auth not resolved yet");
      return;
    }

    setIsLoading(true);
    try {
      console.log("NewsArchiveDialog: Fetching news items...");
      const { data, error } = await supabase
        .from('news_items')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error('NewsArchiveDialog: Error fetching news items:', error);
        return;
      }

      if (data) {
        console.log(`NewsArchiveDialog: Fetched ${data.length} news items from database`);
        setNewsItems(data);
      }
    } catch (error) {
      console.error('NewsArchiveDialog: Error in fetchNewsItems:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch news when dialog opens and auth is resolved
  useEffect(() => {
    if (open && isAuthResolved) {
      console.log("NewsArchiveDialog: Dialog opened and auth resolved, fetching news");
      fetchNewsItems();
    }
  }, [open, isAuthResolved]);

  // Subscribe to auth changes and refetch if needed
  useEffect(() => {
    if (!authLoading) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        console.log("NewsArchiveDialog: Auth state changed:", event, { hasUser: !!session?.user });
        
        // Refetch if user signs in and dialog is open
        if (event === 'SIGNED_IN' && open) {
          setTimeout(() => fetchNewsItems(), 100);
        }
      });

      return () => subscription.unsubscribe();
    }
  }, [authLoading, open]);

  const getContent = (item: NewsItem): string => {
    switch (language) {
      case 'es':
        return item.content_es || item.content_en;
      case 'fr':
        return item.content_fr || item.content_en;
      default:
        return item.content_en;
    }
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(language === 'es' ? 'es-ES' : language === 'fr' ? 'fr-FR' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-warcrow-background border-warcrow-gold/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-warcrow-gold flex items-center gap-2">
            <Globe className="h-6 w-6" />
            {t('newsArchive')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-6">
          {!isAuthResolved ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-warcrow-gold mx-auto mb-4"></div>
              <p className="text-warcrow-text/70">Waiting for authentication...</p>
            </div>
          ) : isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-warcrow-gold mx-auto mb-4"></div>
              <p className="text-warcrow-text/70">{t('loadingNews')}</p>
            </div>
          ) : newsItems.length > 0 ? (
            newsItems.map((item) => (
              <div key={item.id} className="border border-warcrow-gold/20 rounded-lg p-6 bg-black/40">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-warcrow-gold" />
                    <span className="text-warcrow-gold font-medium">
                      {formatDate(item.date)}
                    </span>
                  </div>
                  <Badge variant="outline" className="border-warcrow-gold/30 text-warcrow-gold/80">
                    {item.news_id}
                  </Badge>
                </div>
                
                <div className="prose prose-invert prose-orange max-w-none">
                  <p className="text-warcrow-text leading-relaxed whitespace-pre-wrap">
                    {getContent(item)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-warcrow-text/70">{t('noNewsItems')}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewsArchiveDialog;
