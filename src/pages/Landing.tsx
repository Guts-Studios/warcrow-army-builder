import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState, lazy, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Header } from "@/components/landing/Header";
import { MainActions } from "@/components/landing/MainActions";
import { SecondaryActions } from "@/components/landing/SecondaryActions";
import { Footer } from "@/components/landing/Footer";
import { getLatestVersion } from "@/utils/version";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { NavDropdown } from "@/components/ui/NavDropdown";
import { getBuildFailureNotifications } from "@/utils/notificationUtils";
import { AlertTriangle, PlayCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useEnvironment } from "@/hooks/useEnvironment";
import { SupportButton } from "@/components/landing/SupportButton";

// Lazy load admin-only components
const AuthStateDemo = lazy(() => import("@/components/auth/AuthStateDemo"));

const fetchUserCount = async (useLocalData: boolean) => {
  if (useLocalData) {
    console.log("[Landing] Using fallback user count for local/preview environment");
    return 470;
  }
  
  try {
    console.log("[Landing] Fetching user count from database...");
    
    const { count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('banned', false)
      .eq('deactivated', false);
    
    if (error) {
      console.error('[Landing] Error fetching user count:', error);
      console.log('[Landing] Falling back to default count due to error');
      return 470; // Fallback on error
    }
    
    const userCount = count || 470;
    console.log('[Landing] Retrieved user count from database:', userCount);
    return userCount;
  } catch (error) {
    console.error('[Landing] Error in fetchUserCount:', error);
    console.log('[Landing] Falling back to default count due to exception');
    return 470; // Fallback on exception
  }
};

const checkLatestBuildStatus = async () => {
  try {
    console.log("[Landing] Checking latest build status...");
    const { data, error } = await supabase.functions.invoke('get-netlify-deployments', {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
    if (error || !data || !data.deployments || data.deployments.length === 0) {
      console.error('[Landing] Error fetching deployments:', error);
      return null;
    }
    
    const sortedDeployments = [...data.deployments].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    const latestDeployment = sortedDeployments[0];
    
    const isWarcrowSite = (site) => {
      return site === "warcrow-army-builder" || site === "warcrowarmy.com";
    };
    
    if (latestDeployment.state !== 'error' || !isWarcrowSite(latestDeployment.site_name)) {
      console.log('[Landing] Latest warcrow deployment was successful or not a warcrow site, not showing failure alert');
      return null;
    }
    
    console.log('[Landing] Latest warcrow deployment failed, showing failure alert:', latestDeployment);
    return latestDeployment;
  } catch (err) {
    console.error('[Landing] Error checking latest build status:', err);
    return null;
  }
};

const fetchChangelogContent = async () => {
  try {
    const timestamp = new Date().getTime();
    const response = await fetch(`/CHANGELOG.md?t=${timestamp}`, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Accept': 'text/plain, text/markdown'
      },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch changelog: ${response.status}`);
    }
    
    const content = await response.text();
    return content;
  } catch (error) {
    console.error('[Landing] Failed to fetch changelog content:', error);
    return "# Changelog\n\nFailed to load changelog content.";
  }
};

const Landing = () => {
  console.log('[Landing] Component rendering...');
  
  const navigate = useNavigate();
  const [isGuest, setIsGuest] = useState(false);
  const [showTesterDialog, setShowTesterDialog] = useState(false);
  const [buildFailures, setBuildFailures] = useState<any[]>([]);
  const [latestFailedBuild, setLatestFailedBuild] = useState<any>(null);
  const [changelogContent, setChangelogContent] = useState<string>("");
  
  const { t } = useLanguage();
  const { isWabAdmin, isAuthenticated, isTester, isLoading: authLoading, authReady } = useAuth();
  const { isPreview, isProduction, useLocalContentData } = useEnvironment();
  
  console.log('[Landing] Auth state:', { 
    authLoading,
    isAuthenticated, 
    authReady,
    isWabAdmin, 
    isTester, 
    isPreview,
    isProduction,
    useLocalContentData,
    timestamp: new Date().toISOString()
  });
  
  // Fetch changelog content on mount
  useEffect(() => {
    const loadChangelog = async () => {
      const content = await fetchChangelogContent();
      setChangelogContent(content);
    };
    loadChangelog();
  }, []);
  
  // Get latest version from changelog
  let latestVersion;
  try {
    latestVersion = getLatestVersion(changelogContent);
    console.log('[Landing] Latest version loaded:', latestVersion);
  } catch (error) {
    console.error('[Landing] Error loading version:', error);
    latestVersion = '1.0.0';
  }
  
  // Check if user has permission to see the Play Mode - Ensure guest users can't see it
  const canAccessPlayMode = (isTester || isWabAdmin || isPreview) && !isGuest;

  useEffect(() => {
    console.log('[Landing] Current hostname:', window.location.hostname);
    console.log('[Landing] Is preview environment:', isPreview);
    console.log('[Landing] Is production environment:', isProduction);
    console.log('[Landing] Use local content data:', useLocalContentData);
  }, [isPreview, isProduction, useLocalContentData]);

  // Updated user count fetch to properly use environment settings
  const { 
    data: userCount = 470,
    isLoading: isLoadingUserCount,
    refetch: refetchUserCount 
  } = useQuery({
    queryKey: ['userCount', useLocalContentData],
    queryFn: () => {
      console.log("[Landing] ✅ Starting user count fetch - authReady:", authReady, "useLocal:", useLocalContentData);
      return fetchUserCount(useLocalContentData);
    },
    staleTime: 0,
    gcTime: 0,
    retry: (failureCount, error) => {
      // Only retry in production, and limit retries
      if (!useLocalContentData && failureCount < 2) {
        console.log(`[Landing] Retrying user count fetch (attempt ${failureCount + 1})`);
        return true;
      }
      return false;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    // Wait for auth state to be determined before fetching
    enabled: authReady,
    meta: {
      onError: (error: any) => {
        console.error('[Landing] Failed to fetch user count:', error);
        if (!useLocalContentData) {
          console.log('[Landing] Production environment - this should not happen');
        }
      }
    }
  });

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      console.log("[Landing] ✅ Starting profile fetch - authReady:", authReady);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('tester, wab_admin')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error('[Landing] Error fetching profile:', error);
        throw error;
      }
      return data;
    },
    // Only fetch profile if authenticated and not guest and auth is ready
    enabled: authReady && isAuthenticated === true && isGuest === false,
    staleTime: 0,
    retry: 2
  });

  // Fetch build status immediately when auth is ready and user is admin
  useEffect(() => {
    const fetchBuildStatus = async () => {
      if ((isWabAdmin || isPreview) && authReady) {
        console.log("[Landing] ✅ Starting build status fetch - authReady:", authReady);
        try {
          const { notifications, error } = await getBuildFailureNotifications();
          if (!error && notifications.length > 0) {
            setBuildFailures(notifications);
          }
          
          const latestFailure = await checkLatestBuildStatus();
          console.log('[Landing] checkLatestBuildStatus returned:', latestFailure);
          setLatestFailedBuild(latestFailure);
        } catch (err) {
          console.error('[Landing] Error checking build status:', err);
        }
      }
    };
    
    console.log('[Landing] isWabAdmin value:', isWabAdmin);
    
    fetchBuildStatus();
    
    // Set up a refresh interval only if user is admin and auth is ready
    const intervalId = ((isWabAdmin || isPreview) && authReady) ? 
      setInterval(fetchBuildStatus, 120000) : null;
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isWabAdmin, isPreview, authReady]); // Trigger immediately when authReady changes

  useEffect(() => {
    const checkAuthStatus = async () => {
      if (authReady) {
        const { data: { session } } = await supabase.auth.getSession();
        setIsGuest(!session);
      }
    };

    checkAuthStatus();
  }, [authReady]);

  console.log('[Landing] Rendering Landing page with userCount:', userCount, 'useLocal:', useLocalContentData);

  return (
    <div className="min-h-screen bg-warcrow-background text-warcrow-text flex flex-col items-center relative overflow-x-hidden px-4">
      <div className="absolute top-4 w-full max-w-4xl mx-auto px-4 flex justify-between">
        <SupportButton className="z-50" />
        <div className="flex items-center gap-2">
          <NavDropdown iconOnly />
          <LanguageSwitcher iconOnly />
        </div>
      </div>
      
      {/* Latest Build Failure Alert - only shown if the latest build failed AND user is admin AND it's a warcrow site */}
      {(!!isWabAdmin || isPreview) && latestFailedBuild && (
        <div className="fixed top-16 inset-x-0 mx-auto z-50 max-w-3xl w-full px-4">
          <Alert variant="destructive" className="mb-4 bg-red-900/90 border-red-600 backdrop-blur-sm animate-pulse">
            <AlertTriangle className="h-5 w-5 text-red-300" />
            <AlertTitle className="text-red-100 text-lg font-bold">Latest Site Deployment Failed</AlertTitle>
            <AlertDescription className="text-red-200">
              <p className="mb-1">Site may be experiencing issues. {isWabAdmin ? "Please check deployment status." : "The team has been notified."}</p>
              {isWabAdmin && (
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-blue-300 hover:text-blue-200"
                  onClick={() => latestFailedBuild && window.open(latestFailedBuild.deploy_url, '_blank')}
                >
                  View deployment details
                </Button>
              )}
            </AlertDescription>
          </Alert>
        </div>
      )}
      
      <div className="text-center space-y-6 md:space-y-8 max-w-xl mx-auto mt-16 mb-16">
        <Header 
          latestVersion={latestVersion} 
          userCount={userCount} 
          isLoadingUserCount={isLoadingUserCount} 
          latestFailedBuild={latestFailedBuild}
          authReady={authReady}
        />
        <MainActions />
        
        {/* Play Mode Button - Only shown to testers or admins who are not guests */}
        {canAccessPlayMode && (
          <div className="flex justify-center">
            <Button 
              variant="outline"
              className="border-warcrow-gold/30 text-warcrow-gold hover:bg-warcrow-gold/10 flex items-center gap-2"
              onClick={() => navigate('/play')}
            >
              <PlayCircle className="h-5 w-5" />
              <span>{t('playMode')}</span>
            </Button>
          </div>
        )}
        
        <SecondaryActions isGuest={isGuest} />

        <AlertDialog open={showTesterDialog} onOpenChange={setShowTesterDialog}>
          <AlertDialogContent className="bg-warcrow-background border border-warcrow-gold">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-warcrow-gold">
                {t('testersOnly')}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-warcrow-text">
                {t('testersOnlyDescription')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogCancel className="border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black">
              {t('cancel')}
            </AlertDialogCancel>
          </AlertDialogContent>
        </AlertDialog>

        <div className="mt-6 md:mt-8 text-sm text-warcrow-text/80">
          <p>
            {t('haveFeedback')}
          </p>
          <a 
            href="mailto:warcrowarmy@gmail.com"
            className="text-warcrow-gold hover:text-warcrow-gold/80 underline"
          >
            {t('contactEmail')}
          </a>
        </div>
      </div>
      <div className="mt-auto w-full">
        <Footer />
      </div>
    </div>
  );
};

export default Landing;
