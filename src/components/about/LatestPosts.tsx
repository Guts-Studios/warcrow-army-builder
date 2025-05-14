
import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { aboutTranslations } from '@/i18n/about';
import { ExternalLink, CalendarIcon } from 'lucide-react';
import { formatRelativeTime } from '@/utils/dateUtils';
import { getPatreonPosts, type PatreonPost, DEFAULT_CAMPAIGN_ID } from '@/utils/patreonUtils';
import { toast } from '@/components/ui/use-toast';

export default function LatestPosts() {
  const [posts, setPosts] = useState<PatreonPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching posts from Patreon API...');
        const fetchedPosts = await getPatreonPosts(DEFAULT_CAMPAIGN_ID);
        
        console.log(`Posts received: ${JSON.stringify(fetchedPosts)}`);
        setPosts(fetchedPosts);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        toast({
          title: language === 'en' ? 'Error' : language === 'es' ? 'Error' : 'Erreur',
          description: language === 'en' ? 'Could not fetch latest posts'
            : language === 'es' ? 'No se pudieron obtener las últimas publicaciones'
            : 'Impossible de récupérer les dernières publications',
          variant: 'destructive',
        });
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [language]);

  if (isLoading) {
    return (
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle>{aboutTranslations.latestPostsTitle[language]}</CardTitle>
          <CardDescription>{aboutTranslations.latestPostsSubtitle[language]}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleReadMoreClick = (url: string) => {
    // Open the URL in a new tab
    window.open(url, '_blank', 'noopener noreferrer');
    
    // Log for debugging purposes
    console.log(`Opening Patreon post: ${url}`);
  };

  return (
    <Card className="w-full h-full border-warcrow-gold/30 bg-black/60">
      <CardHeader>
        <CardTitle className="text-warcrow-gold">{aboutTranslations.latestPostsTitle[language]}</CardTitle>
        <CardDescription>{aboutTranslations.latestPostsSubtitle[language]}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="border-b border-warcrow-gold/20 pb-3 last:border-b-0">
                <h3 className="text-lg font-semibold text-warcrow-gold mb-1">
                  {post.title}
                </h3>
                <p className="text-sm text-warcrow-text/80 mb-2">{post.excerpt}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs flex items-center text-warcrow-text/60">
                    <CalendarIcon className="mr-1" size={12} />
                    {formatRelativeTime(new Date(post.date), language)}
                  </span>
                  <button 
                    onClick={() => handleReadMoreClick(post.url)}
                    className="text-xs flex items-center text-warcrow-gold hover:text-warcrow-gold/80"
                    aria-label={`Read more about ${post.title}`}
                  >
                    {aboutTranslations.readMore[language]}
                    <ExternalLink className="ml-1" size={12} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-warcrow-text/80 py-4">
              {aboutTranslations.noPostsAvailable[language]}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
