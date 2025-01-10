import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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
import { AuthError } from "@supabase/supabase-js";

interface LoginProps {
  onGuestAccess?: () => void;
}

const Login = ({ onGuestAccess }: LoginProps) => {
  const navigate = useNavigate();
  const [showGuestDialog, setShowGuestDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event) => {
      console.log('Auth event:', event);
      if (event === 'PASSWORD_RECOVERY') {
        toast.info('Check your email for the password reset link');
      } else if (event === 'SIGNED_IN') {
        navigate('/builder');
      } else if (event === 'USER_UPDATED') {
        toast.success('Your password has been updated successfully');
        navigate('/builder');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleGuestAccess = () => {
    setShowGuestDialog(true);
  };

  const confirmGuestAccess = () => {
    setShowGuestDialog(false);
    if (onGuestAccess) {
      onGuestAccess();
    }
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
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
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
          onError={(error) => {
            console.error('Auth error:', error);
            if (error.message.includes('missing email')) {
              setError('Please enter your email address');
            } else {
              setError(error.message);
            }
            // Clear error after 5 seconds
            setTimeout(() => setError(null), 5000);
          }}
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