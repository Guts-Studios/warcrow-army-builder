import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { sendEmail } from "@/utils/emailUtils";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
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
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event);
      console.log('Session:', session);
      
      if (event === 'PASSWORD_RECOVERY') {
        console.log('Password recovery event triggered');
        const userEmail = session?.user?.email;
        if (userEmail) {
          try {
            await sendEmail(
              [userEmail],
              'Password Reset Instructions',
              `<h1>Password Reset</h1>
              <p>Click the link below to reset your password:</p>
              <p><a href="${window.location.origin}/reset-password">Reset Password</a></p>`
            );
            toast.info('Password reset instructions have been sent to your email');
          } catch (error) {
            console.error('Failed to send password reset email:', error);
            toast.error('Failed to send password reset email');
          }
        }
      } else if (event === 'SIGNED_IN') {
        navigate('/builder');
      } else if (event === 'USER_UPDATED') {
        toast.success('Your password has been updated successfully');
        navigate('/builder');
      } else if (event === 'SIGNED_OUT') {
        setError(null);
      }

      if (session?.user === null) {
        const authError = (session as unknown as { error?: AuthError }).error;
        if (authError) {
          console.error('Auth error:', authError);
          
          if (authError.message?.includes('rate_limit')) {
            const waitTime = authError.message.match(/\d+/)?.[0] || '60';
            setError(`Please wait ${waitTime} seconds before requesting another password reset.`);
            setTimeout(() => setError(null), parseInt(waitTime) * 1000);
          } else {
            setError(authError.message);
            setTimeout(() => setError(null), 5000);
          }
        }
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
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
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