import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
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
import changelogContent from '../../CHANGELOG.md?raw';
import { Header } from "@/components/landing/Header";
import { MainActions } from "@/components/landing/MainActions";
import { SecondaryActions } from "@/components/landing/SecondaryActions";
import { Footer } from "@/components/landing/Footer";
import { getLatestVersion } from "@/utils/version";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { getBuildFailureNotifications } from "@/utils/notificationUtils";
import { AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useEnvironment } from "@/hooks/useEnvironment";

const fetchUserCount = async () => {
  try {
    console.log("Fetching user count with fresh query...");
    
    // Add timestamp to bust cache completely
    const timestamp = new Date().getTime();
    
    // Use a direct count query with explicit cache busting
    const { count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('banned', false)
      .eq('deactivated', false)
      .then(response => {
        console.log('User count response:', response);
        return response;
      });
    
    if (error) {
      console.error('Error fetching user count:', error);
      throw error;
    }
    
    console.log('Retrieved user count:', count);
    return count || 470; // Default to 470 if count is null
  } catch (error) {
    console.error('Error in fetchUserCount:', error);
    // Return a default value to prevent UI issues
    return 470;
  }
};

// Function to check if the latest deployment is a failure
const checkLatestBuildStatus = async () => {
  try {
    console.log("Checking latest build status...");
    const { data, error } = await supabase.functions.invoke('get-netlify-deployments', {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
    if (error || !data || !data.deployments || data.deployments.length === 0) {
      console.error('Error fetching deployments:', error);
      return null;
    }
    
    // Sort deployments by creation date to ensure we get the most recent first
    const sortedDeployments = [...data.deployments].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    // Check if the latest deployment is a failure
    const latestDeployment = sortedDeployments[0];
    
    // Only return warcrow site failures (not other sites)
    const isWarcrowSite = (site) => {
      return site === "warcrow-army-builder" || site === "warcrowarmy.com";
    };
    
    // If the latest deployment was successful or not a warcrow site, we should return null (no failure)
    if (latestDeployment.state !== 'error' || !isWarcrowSite(latestDeployment.site_name)) {
      console.log('Latest warcrow deployment was successful or not a warcrow site, not showing failure alert');
      return null;
    }
    
    console.log('Latest warcrow deployment failed, showing failure alert:', latestDeployment);
    return latestDeployment;
  } catch (err) {
    console.error('Error checking latest build status:', err);
    return null;
  }
};

const Landing = () => {
  const navigate = useNavigate();
  const [isGuest, setIsGuest] = useState(false);
  const [showTesterDialog, setShowTesterDialog] = useState(false);
  const [buildFailures, setBuildFailures] = useState<any[]>([]);
  const [latestFailedBuild, setLatestFailedBuild] = useState<any>(null);
  const latestVersion = getLatestVersion(changelogContent);
  const { t } = useLanguage();
  const { isWabAdmin, isAuthenticated } = useAuth();
  const { isPreview } = useEnvironment();

  useEffect(() => {
    console.log('Landing.tsx: Current hostname:', window.location.hostname);
    console.log('Landing.tsx: Is preview environment:', isPreview);
  }, [isPreview]);

  const { 
    data: userCount = 470, // Provide a default value here
    isLoading: isLoadingUserCount,
    refetch: refetchUserCount 
  } = useQuery({
    queryKey: ['userCount'],
    queryFn: fetchUserCount,
    staleTime: 0, // No caching
    gcTime: 0, // Don't cache at all
    retry: 2, // Retry twice to ensure we get the data
    refetchOnMount: true, // Always refetch on mount
    refetchOnWindowFocus: true, // Refetch when window gets focus
    enabled: true, // Always enable this query
    meta: {
      onError: (error: any) => {
        console.error('Failed to fetch user count:', error);
        toast.error('Failed to fetch user statistics');
      }
    }
  });

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('tester, wab_admin')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
      return data;
    },
    enabled: isAuthenticated === true && isGuest === false,
    staleTime: 0, // No caching
    retry: 2
  });

  // Only fetch build status if user is admin
  useEffect(() => {
    const fetchBuildStatus = async () => {
      if (isWabAdmin || isPreview) {
        try {
          // Get build failure notifications for the notification system
          const { notifications, error } = await getBuildFailureNotifications();
          if (!error && notifications.length > 0) {
            setBuildFailures(notifications);
          }
          
          // Check if the latest build specifically has failed
          const latestFailure = await checkLatestBuildStatus();
          console.log('checkLatestBuildStatus returned:', latestFailure);
          setLatestFailedBuild(latestFailure);
        } catch (err) {
          console.error('Error checking build status:', err);
        }
      }
    };
    
    // Always log isWabAdmin value for debugging
    console.log('isWabAdmin value:', isWabAdmin);
    
    fetchBuildStatus();
    
    // Set up a refresh interval only if user is admin
    const intervalId = (isWabAdmin || isPreview) ? setInterval(fetchBuildStatus, 120000) : null; // Refresh every 2 minutes
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isWabAdmin, isPreview]);

  useEffect(() => {
    const checkAuthStatus = async () => {
      // Force refresh the auth state on mount
      const { data: { session } } = await supabase.auth.getSession();
      setIsGuest(!session);
    };

    checkAuthStatus();
  }, []);

  const handleRefreshUserCount = () => {
    // Force refetch from database with fresh query
    refetchUserCount();
    toast.info("Refreshing user count...");
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-warcrow-background text-warcrow-text flex flex-col items-center justify-center relative overflow-x-hidden px-4 pb-32">
      <div className="absolute top-4 right-4 z-50">
        <LanguageSwitcher />
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
      
      <div className="text-center space-y-6 md:space-y-8 max-w-xl mx-auto">
        <Header 
          latestVersion={latestVersion} 
          userCount={userCount} 
          isLoadingUserCount={isLoadingUserCount} 
          latestFailedBuild={latestFailedBuild}
          onRefreshUserCount={handleRefreshUserCount}
        />
        <MainActions />
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
      <Footer />
    </div>
  );
};

export default Landing;
