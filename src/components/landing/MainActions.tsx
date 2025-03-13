
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

export const MainActions = () => {
  const navigate = useNavigate();
  const [showTesterDialog, setShowTesterDialog] = useState(false);
  const isPreview = window.location.hostname === 'lovableproject.com' || 
                    window.location.hostname.endsWith('.lovableproject.com');

  // Check if user is a tester
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // In preview mode, consider user as tester
      if (isPreview) {
        return { tester: true };
      }
      
      if (!session) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('tester')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handlePlayModeClick = () => {
    // Allow access in preview mode or if the user is a tester
    if (isPreview || profile?.tester) {
      navigate('/playmode');
    } else {
      setShowTesterDialog(true);
    }
  };

  return (
    <>
      <div className="flex justify-center">
        <Button
          onClick={() => navigate('/builder')}
          className="w-full md:w-auto bg-warcrow-gold hover:bg-warcrow-gold/80 text-black font-medium transition-colors px-8 py-2 text-lg"
        >
          Start Building
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-center justify-center">
        <Button
          onClick={() => navigate('/rules')}
          variant="outline"
          className="w-full md:w-auto border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black"
        >
          Rules Reference
        </Button>
        <Button
          onClick={() => navigate('/missions')}
          variant="outline"
          className="w-full md:w-auto border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black"
        >
          Missions
        </Button>
        <Button
          onClick={handlePlayModeClick}
          variant="outline"
          className="w-full md:w-auto border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black"
        >
          Play Mode
        </Button>
        <Button
          onClick={() => navigate('/profile')}
          variant="outline"
          className="w-full md:w-auto border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black"
        >
          Profile
        </Button>
      </div>

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
    </>
  );
};
