
import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { aboutTranslations } from '@/i18n/about';
import { ExternalLink } from 'lucide-react';
import { formatRelativeTime } from '@/utils/dateUtils';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  date: string;
}

// Mock data for latest posts - in a real implementation, this would come from an API
const mockPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Warcrow Army Builder v1.2 Released',
    excerpt: 'New features include improved list sharing and support for the latest units.',
    url: 'https://warcrow-army-builder.com/blog/v1.2-release',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    title: 'Northern Tribes Update',
    excerpt: 'All Northern Tribes units are now available in the builder with full stats.',
    url: 'https://warcrow-army-builder.com/blog/northern-tribes-update',
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: 'Community Feature: Custom Missions',
    excerpt: 'Create and share custom missions with the community.',
    url: 'https://warcrow-army-builder.com/blog/custom-missions',
    date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export default function LatestPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    // Simulate API call to fetch posts
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        // In a real implementation, you would fetch posts from an API
        // const response = await fetch('your-api-endpoint');
        // const data = await response.json();
        
        // Using mock data for now
        setTimeout(() => {
          setPosts(mockPosts);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

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
                  <span className="text-xs text-warcrow-text/60">
                    {formatRelativeTime(new Date(post.date), language)}
                  </span>
                  <a 
                    href={post.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs flex items-center text-warcrow-gold hover:text-warcrow-gold/80"
                  >
                    {aboutTranslations.readMore[language]}
                    <ExternalLink className="ml-1" size={12} />
                  </a>
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
