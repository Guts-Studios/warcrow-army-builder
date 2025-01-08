import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Login = () => {
  const navigate = useNavigate();
  const [showGuestDialog, setShowGuestDialog] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate('/builder');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleGuestAccess = () => {
    setShowGuestDialog(true);
  };

  const confirmGuestAccess = () => {
    setShowGuestDialog(false);
    navigate('/landing');
  };

  return (
    <div className="min-h-screen bg-warcrow-background text-warcrow-text flex flex-col items-center justify-center relative overflow-x-hidden">
      <div className="w-full max-w-md p-8 bg-warcrow-accent rounded-lg shadow-lg">
        <img 
          src="https://assets.corvusbelli.net/warcrow/web/logo_warcrow.png" 
          alt="Warcrow Logo" 
          className="h-24 mx-auto mb-8"
        />
        <div className="mb-6 flex justify-center gap-4">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="border-warcrow-gold text-warcrow-gold hover:bg-warcrow-gold hover:text-black"
          >
            Back to Home
          </Button>
          <Button
            onClick={handleGuestAccess}
            variant="outline"
            className="border-warcrow-gold text-warcrow-gold hover:bg-warcrow-gold hover:text-black"
          >
            Continue as Guest
          </Button>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#B8860B',
                  brandAccent: '#8B6508',
                }
              }
            }
          }}
          providers={[]}
        />
      </div>

      <AlertDialog open={showGuestDialog} onOpenChange={setShowGuestDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Guest Access</AlertDialogTitle>
            <AlertDialogDescription>
              While using the app as a guest, some features like saving army lists and cloud synchronization will be disabled. Sign in to access all features.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmGuestAccess}>Continue as Guest</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Login;