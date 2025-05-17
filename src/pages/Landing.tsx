
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { Sword, Book, Target, UserCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { MainActions } from '@/components/landing/MainActions';
import { SecondaryActions } from '@/components/landing/SecondaryActions';
import { toast } from 'sonner';

const Landing = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, isGuest, setIsGuest, userId } = useAuth();
  const [userCount, setUserCount] = useState<number | null>(null);
  const [isCountLoaded, setIsCountLoaded] = useState(false);

  // Try to get user count from localStorage first for immediate display
  useEffect(() => {
    const cachedCount = localStorage.getItem('cached_user_count');
    if (cachedCount) {
      setUserCount(parseInt(cachedCount, 10));
      setIsCountLoaded(true);
    }
  }, []);

  // Then fetch from server
  const { data: fetchedCount } = useQuery({
    queryKey: ['userCount'],
    queryFn: async () => {
      try {
        // Count users from profiles table
        const { count, error } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        
        if (error) throw error;
        
        // Cache the result
        if (count !== null) {
          localStorage.setItem('cached_user_count', count.toString());
        }
        
        return count;
      } catch (error) {
        console.error("Error fetching user count:", error);
        return null;
      }
    },
    meta: {
      onError: (err: Error) => {
        console.error("Query error:", err);
        toast.error(t('errorLoadingUserCount'));
      }
    },
    retry: 1,
    retryDelay: 1000,
    refetchOnWindowFocus: false
  });

  // Update state when fetched count is available
  useEffect(() => {
    if (fetchedCount !== undefined) {
      setUserCount(fetchedCount);
      setIsCountLoaded(true);
    }
  }, [fetchedCount]);

  const handleContinueAsGuest = () => {
    setIsGuest(true);
    navigate('/builder');
  };

  const handleSignOut = async () => {
    try {
      if (isGuest) {
        setIsGuest(false);
        toast.success(t('signedOutAsGuest'));
      } else {
        await supabase.auth.signOut();
        toast.success(t('signedOut'));
      }
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error(t('errorSigningOut'));
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-warcrow-background text-warcrow-text">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-10 flex flex-col items-center">
        <div className="w-full max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-warcrow-gold">
            {t('welcomeTitle')}
          </h2>
          
          <div className="text-lg font-light mb-8">
            <p className="mb-4">{t('welcomeDescription')}</p>
            <p className="text-sm text-warcrow-text/70">
              {t('version')} 0.5.3
            </p>
          </div>
          
          <div className="py-2 text-warcrow-text/80 text-sm">
            {isCountLoaded
              ? userCount !== null
                ? t('userCount').replace('{count}', userCount.toString())
                : t('errorLoadingUserCount')
              : t('loadingUserCount')}
          </div>
          
          {!isLoading && (
            <div className="space-y-8">
              {!isAuthenticated && !isGuest ? (
                <MainActions onContinueAsGuest={handleContinueAsGuest} />
              ) : (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      variant="default"
                      className="h-14 bg-warcrow-gold hover:bg-warcrow-gold/80 text-black"
                      onClick={() => navigate('/builder')}
                    >
                      <Sword className="h-5 w-5 mr-3" />
                      {t('startBuilding')}
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="h-14 border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors"
                      onClick={() => navigate('/rules')}
                    >
                      <Book className="h-5 w-5 mr-3" />
                      {t('rulesReference')}
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="h-14 border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors"
                      onClick={() => navigate('/missions')}
                    >
                      <Target className="h-5 w-5 mr-3" />
                      {t('missions')}
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="h-14 border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors"
                      onClick={() => navigate('/profile')}
                    >
                      <UserCircle className="h-5 w-5 mr-3" />
                      {t('profile')}
                    </Button>
                  </div>
                  
                  <SecondaryActions 
                    isGuest={isGuest} 
                    onSignOut={handleSignOut}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Landing;
