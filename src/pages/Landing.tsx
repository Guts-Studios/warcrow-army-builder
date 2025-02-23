
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
import changelogContent from '../../CHANGELOG.md?raw';
import { Header } from "@/components/landing/Header";
import { MainActions } from "@/components/landing/MainActions";
import { SecondaryActions } from "@/components/landing/SecondaryActions";
import { Footer } from "@/components/landing/Footer";
import { getLatestVersion } from "@/utils/version";

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
  const latestVersion = getLatestVersion(changelogContent);

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

  return (
    <div className="min-h-screen bg-warcrow-background text-warcrow-text flex flex-col items-center justify-center relative overflow-x-hidden px-4 pb-32">
      <div className="text-center space-y-6 md:space-y-8 max-w-xl mx-auto">
        <Header 
          latestVersion={latestVersion} 
          userCount={userCount} 
          isLoadingUserCount={isLoadingUserCount} 
        />
        <MainActions />
        <SecondaryActions isGuest={isGuest} onSignOut={handleSignOut} />

        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="link"
              className="text-warcrow-gold hover:text-warcrow-gold/80"
            >
              View Changelog
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-warcrow-gold">Changelog</DialogTitle>
            </DialogHeader>
            <div className="whitespace-pre-wrap font-mono text-sm">
              {changelogContent}
            </div>
          </DialogContent>
        </Dialog>

        <AlertDialog open={showTesterDialog} onOpenChange={setShowTesterDialog}>
          <AlertDialogContent className="bg-warcrow-background border border-warcrow-gold">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-warcrow-gold">Testers Only</AlertDialogTitle>
              <AlertDialogDescription className="text-warcrow-text">
                This feature is currently only available to testers. Please contact us if you'd like to become a tester.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogCancel className="border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black">
              Close
            </AlertDialogCancel>
          </AlertDialogContent>
        </AlertDialog>

        <div className="mt-6 md:mt-8 text-sm text-warcrow-text/80">
          <p>Have ideas, issues, love, or hate to share?</p>
          <a 
            href="mailto:warcrowarmy@gmail.com"
            className="text-warcrow-gold hover:text-warcrow-gold/80 underline"
          >
            Contact us at warcrowarmy@gmail.com
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Landing;
