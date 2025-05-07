
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
import { useAuth } from "@/components/auth/AuthProvider";

const fetchUserCount = async () => {
  const { count, error } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });
  
  if (error) {
    console.error('Error fetching user count:', error);
    throw error;
  }
  
  return count || 0;
};

const Landing = () => {
  const navigate = useNavigate();
  const [isGuest, setIsGuest] = useState(false);
  const [showTesterDialog, setShowTesterDialog] = useState(false);
  const [buildFailures, setBuildFailures] = useState<any[]>([]);
  const latestVersion = getLatestVersion(changelogContent);
  const { t } = useLanguage();
  const { isWabAdmin } = useAuth();

  const { data: userCount, isLoading: isLoadingUserCount } = useQuery({
    queryKey: ['userCount'],
    queryFn: fetchUserCount,
    refetchOnWindowFocus: false,
  });

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('tester')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !isGuest,
  });

  // Fetch build failures if user is admin
  useEffect(() => {
    const fetchBuildFailures = async () => {
      if (isWabAdmin) {
        const { notifications, error } = await getBuildFailureNotifications();
        if (!error && notifications.length > 0) {
          setBuildFailures(notifications);
        }
      }
    };
    
    fetchBuildFailures();
    
    // Set up a refresh interval
    const intervalId = setInterval(fetchBuildFailures, 120000); // Refresh every 2 minutes
    
    return () => clearInterval(intervalId);
  }, [isWabAdmin]);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsGuest(!session);
    };

    checkAuthStatus();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleViewDeployment = (deployUrl: string) => {
    if (deployUrl) {
      window.open(deployUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-warcrow-background text-warcrow-text flex flex-col items-center justify-center relative overflow-x-hidden px-4 pb-32">
      <div className="absolute top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>
      
      {/* Build Failure Alerts for Admins */}
      {isWabAdmin && buildFailures.length > 0 && (
        <div className="fixed top-20 right-4 z-50 max-w-md w-full">
          {buildFailures.map((failure, index) => {
            // Parse content if it's a string
            const content = typeof failure.content === 'string' 
              ? JSON.parse(failure.content) 
              : failure.content;
            
            return (
              <Alert key={failure.id} variant="destructive" className="mb-2 bg-red-900/80 border-red-600 backdrop-blur-sm animate-pulse">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <AlertTitle className="text-red-200">Build Failed: {content?.site_name || 'Unknown site'}</AlertTitle>
                <AlertDescription className="text-red-300 mt-1">
                  <p className="mb-1">Branch: {content?.branch || 'unknown'}</p>
                  <p className="mb-1 text-sm">{content?.error_message || 'Unknown error'}</p>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-blue-300 hover:text-blue-200 text-sm"
                    onClick={() => handleViewDeployment(content?.deploy_url)}
                  >
                    View details
                  </Button>
                </AlertDescription>
              </Alert>
            );
          })}
        </div>
      )}
      
      <div className="text-center space-y-6 md:space-y-8 max-w-xl mx-auto">
        <Header 
          latestVersion={latestVersion} 
          userCount={userCount} 
          isLoadingUserCount={isLoadingUserCount} 
          buildFailures={isWabAdmin ? buildFailures : []}
        />
        <MainActions />
        <SecondaryActions isGuest={isGuest} onSignOut={handleSignOut} />

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
