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
import { AuthError, AuthApiError } from "@supabase/supabase-js";

interface LoginProps {
  onGuestAccess?: () => void;
}

const Login = ({ onGuestAccess }: LoginProps) => {
  const navigate = useNavigate();
  const [showGuestDialog, setShowGuestDialog] = useState(false);
  const [showHomeGuestDialog, setShowHomeGuestDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Login component mounted');
    
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event triggered:', {
        event,
        sessionExists: !!session,
        userId: session?.user?.id,
        userEmail: session?.user?.email
      });
      
      if (event === 'PASSWORD_RECOVERY') {
        console.log('Password recovery flow initiated');
        const userEmail = session?.user?.email;
        
        if (userEmail) {
          try {
            console.log('Attempting to send password reset email to:', userEmail);
            
            await sendEmail(
              [userEmail],
              'Password Reset Instructions',
              `<h1>Password Reset</h1>
              <p>Click the link below to reset your password:</p>
              <p><a href="${window.location.origin}/reset-password">Reset Password</a></p>`
            );
            
            console.log('Password reset email sent successfully');
            toast.success('Password reset instructions have been sent to your email');
          } catch (error) {
            console.error('Password reset email failed:', {
              error,
              errorMessage: error instanceof Error ? error.message : 'Unknown error'
            });
            toast.error('Failed to send password reset email. Please try again.');
          }
        } else {
          console.error('No user email available for password reset');
        }
      } else if (event === 'SIGNED_IN') {
        console.log('User signed in, navigating to builder');
        navigate('/builder');
      } else if (event === 'USER_UPDATED') {
        console.log('User profile updated');
        toast.success('Your password has been updated successfully');
        navigate('/builder');
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        setError(null);
      }

      // Handle errors from the auth state change
      const authError = session as unknown as { error?: AuthError };
      if (authError?.error) {
        console.error('Authentication error:', {
          message: authError.error.message,
          status: authError.error.status
        });

        if (authError.error instanceof AuthApiError) {
          switch (authError.error.message) {
            case 'Invalid login credentials':
              setError('Invalid email or password. Please check your credentials and try again.');
              break;
            case 'Email not confirmed':
              setError('Please verify your email address before signing in.');
              break;
            default:
              if (authError.error.message?.includes('rate_limit')) {
                const waitTime = authError.error.message.match(/\d+/)?.[0] || '60';
                setError(`Please wait ${waitTime} seconds before trying again.`);
                setTimeout(() => setError(null), parseInt(waitTime) * 1000);
              } else if (authError.error.message?.includes('Error sending confirmation email')) {
                setError('Account created successfully but confirmation email could not be sent. You can try signing in.');
                toast.success('Account created successfully!');
                toast.info('You may need to contact support to verify your email.');
              } else {
                setError(authError.error.message);
                setTimeout(() => setError(null), 5000);
              }
          }
        }
      }
    });

    return () => {
      console.log('Login component unmounting, cleaning up subscription');
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleGuestAccess = () => {
    console.log('Guest access requested');
    setShowGuestDialog(true);
  };

  const handleHomeClick = () => {
    console.log('Home button clicked');
    setShowHomeGuestDialog(true);
  };

  const confirmGuestAccess = (redirectPath: string = '/landing') => {
    console.log('Guest access confirmed, redirecting to:', redirectPath);
    setShowGuestDialog(false);
    setShowHomeGuestDialog(false);
    if (onGuestAccess) {
      onGuestAccess();
    }
    navigate('/landing');  // Always redirect to landing page
  };

  return (
    <div className="min-h-screen bg-warcrow-background text-warcrow-text flex flex-col items-center justify-center relative overflow-x-hidden">
      <div className="w-full max-w-md p-8 bg-warcrow-accent rounded-lg shadow-lg">
        <img 
          src="https://odqyoncwqawdzhquxcmh.supabase.co/storage/v1/object/public/images/Logo.png?t=2024-12-31T22%3A06%3A03.113Z" 
          alt="Warcrow Logo" 
          className="h-24 mx-auto mb-8"
        />
        <Alert className="mb-6 border-yellow-600 bg-yellow-900/20">
          <AlertDescription className="text-yellow-200 text-sm">
            Currently password reset is down after migrating servers, we are waiting on our domain to be verified. 
            Will update when fixed. If having issues, please email us at warcrowarmy@gmail.com or post in the Warcrow Discord
          </AlertDescription>
        </Alert>
        <div className="mb-6 flex justify-center gap-4">
          <Button
            onClick={handleHomeClick}
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
            <AlertDialogAction onClick={() => confirmGuestAccess()}>Continue as Guest</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showHomeGuestDialog} onOpenChange={setShowHomeGuestDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Continuing as Guest</AlertDialogTitle>
            <AlertDialogDescription>
              You'll be continuing to the home page as a guest user. Some features will be limited. You can sign in anytime to access all features.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => confirmGuestAccess('/')}>Continue to Home</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Login;