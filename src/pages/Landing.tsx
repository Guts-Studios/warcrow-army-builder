
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsArchiveDialog from '@/components/NewsArchiveDialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useEnvironment } from '@/hooks/useEnvironment';

interface NewsItem {
  id: string;
  date: string;
  key: string;
}

const Landing = () => {
  const navigate = useNavigate();
  const [userCount, setUserCount] = useState<number>(0);
  const [latestNews, setLatestNews] = useState<NewsItem | null>(null);
  const [newsDialogOpen, setNewsDialogOpen] = useState(false);
  const [isLoadingUserCount, setIsLoadingUserCount] = useState(false);
  const [isLoadingNews, setIsLoadingNews] = useState(false);
  
  const { isAuthenticated, isWabAdmin, isLoading: authLoading } = useAuth();
  const { isPreview } = useEnvironment();

  console.log("Landing Auth state:", { isWabAdmin, isAuthenticated, isPreview, authLoading });

  // Wait for auth to be resolved before fetching data
  const isAuthResolved = !authLoading && isAuthenticated !== null;

  const fetchUserCount = async () => {
    if (!isAuthResolved) {
      console.log("Landing: Skipping user count fetch - auth not resolved yet");
      return;
    }

    setIsLoadingUserCount(true);
    try {
      console.log("Landing: Fetching user count...");
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.error('Error fetching user count:', error);
        setUserCount(489); // Fallback
      } else {
        setUserCount(count || 489);
        console.log(`Landing: User count fetched: ${count}`);
      }
    } catch (error) {
      console.error('Error in fetchUserCount:', error);
      setUserCount(489); // Fallback
    } finally {
      setIsLoadingUserCount(false);
    }
  };

  const fetchLatestNews = async () => {
    if (!isAuthResolved) {
      console.log("Landing: Skipping news fetch - auth not resolved yet");
      return;
    }

    setIsLoadingNews(true);
    try {
      console.log("Landing: Fetching latest news...");
      const { data, error } = await supabase
        .from('news_items')
        .select('*')
        .order('date', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Landing: Error fetching latest news:', error);
      } else if (data) {
        console.log("Landing: Fetched latest news item from database:", data);
        setLatestNews({
          id: data.news_id,
          date: data.date,
          key: data.translation_key
        });
      }
    } catch (error) {
      console.error('Landing: Error in fetchLatestNews:', error);
    } finally {
      setIsLoadingNews(false);
    }
  };

  // Fetch data when auth is resolved
  useEffect(() => {
    if (isAuthResolved) {
      console.log("Landing: Auth resolved, fetching data...");
      fetchUserCount();
      fetchLatestNews();
    }
  }, [isAuthResolved]);

  // Subscribe to auth state changes and refetch data
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Landing: Auth state changed:", event, { hasUser: !!session?.user });
      
      // Refetch data when user signs in/out, but only if auth is no longer loading
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        setTimeout(() => {
          if (!authLoading) {
            console.log("Landing: Refetching data after auth change");
            fetchUserCount();
            fetchLatestNews();
          }
        }, 100);
      }
    });

    return () => subscription.unsubscribe();
  }, [authLoading]);

  console.log(`Landing: Rendering with userCount: ${userCount}, authResolved: ${isAuthResolved}`);

  return (
    <div className="min-h-screen bg-warcrow-background text-warcrow-text flex flex-col">
      <Header 
        latestNewsItem={latestNews} 
        onNewsClick={() => setNewsDialogOpen(true)}
      />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold text-warcrow-gold mb-8 tracking-wider">
            WARCROW
          </h1>
          <h2 className="text-2xl md:text-4xl font-semibold text-warcrow-text mb-6">
            Army Builder
          </h2>
          <p className="text-lg md:text-xl text-warcrow-text/80 mb-12 max-w-2xl mx-auto leading-relaxed">
            Build competitive armies, explore unit synergies, and dominate the battlefield in the world of Warcrow.
          </p>
          
          <div className="space-y-4 mb-8">
            <Button 
              onClick={() => navigate('/army-builder')}
              className="bg-warcrow-gold text-black hover:bg-warcrow-gold/90 text-lg px-8 py-4 font-semibold tracking-wide"
              size="lg"
            >
              START BUILDING
            </Button>
          </div>

          <div className="text-center text-warcrow-text/70">
            <p className="text-sm">
              {!isAuthResolved ? 'Loading user data...' : 
               isLoadingUserCount ? 'Loading...' : 
               `Join ${userCount.toLocaleString()} commanders`} already building their armies
            </p>
          </div>
        </div>
      </main>

      <Footer />
      
      <NewsArchiveDialog 
        open={newsDialogOpen} 
        onOpenChange={setNewsDialogOpen}
      />
    </div>
  );
};

export default Landing;
