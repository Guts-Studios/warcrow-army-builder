
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthError, AuthApiError } from "@supabase/supabase-js";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/auth/AuthProvider";

interface LoginProps {
  onGuestAccess?: () => void;
}

const Login = ({ onGuestAccess }: LoginProps) => {
  const navigate = useNavigate();
  const [showGuestDialog, setShowGuestDialog] = useState(false);
  const [showHomeGuestDialog, setShowHomeGuestDialog] = useState(false);
  const [showResendDialog, setShowResendDialog] = useState(false);
  const [resendEmail, setResendEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { resendConfirmationEmail } = useAuth();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event triggered:', {
        event,
        sessionExists: !!session,
        userId: session?.user?.id,
        userEmail: session?.user?.email,
        eventType: event,
        emailConfirmed: session?.user?.email_confirmed_at ? 'Yes' : 'No'
      });
      
      setIsLoading(true);
      
      try {
        if (event === 'PASSWORD_RECOVERY') {
          navigate('/reset-password');
        } else if (event === 'SIGNED_IN') {
          toast.success('Successfully signed in!');
          navigate('/landing');
        } else if (event === 'SIGNED_UP') {
          // Check if email confirmation is required
          if (!session?.user?.email_confirmed_at) {
            toast.info('Please check your email to verify your account before signing in');
          } else {
            toast.success('Account created successfully!');
            navigate('/landing');
          }
        } else if (event === 'USER_UPDATED') {
          toast.success('Your profile has been updated successfully');
          navigate('/landing');
        } else if (event === 'SIGNED_OUT') {
          setError(null);
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed, checking session validity...');
          const { data: { session: currentSession } } = await supabase.auth.getSession();
          if (currentSession) {
            toast.success('Successfully signed in!');
            navigate('/landing');
          }
        }

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
                setError('Please verify your email address before signing in. Click "Resend Confirmation Email" below.');
                break;
              case 'Too many requests':
                setError('Too many login attempts. Please try again later.');
                break;
              case 'User not found':
                setError('No account found with this email. Please sign up first.');
                break;
              default:
                if (authError.error.message?.includes('rate_limit')) {
                  const waitTime = authError.error.message.match(/\d+/)?.[0] || '60';
                  setError(`Too many attempts. Please wait ${waitTime} seconds before trying again.`);
                  setTimeout(() => setError(null), parseInt(waitTime) * 1000);
                } else {
                  setError(authError.error.message);
                  toast.error('Login failed. Please try again.');
                  setTimeout(() => setError(null), 5000);
                }
            }
          }
        }
      } finally {
        setIsLoading(false);
      }
    });

    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get('message');
    if (message === 'password_reset') {
      toast.success('Password has been reset successfully. Please sign in with your new password.');
    }

    return () => subscription.unsubscribe();
  }, [navigate, resendConfirmationEmail]);

  const handleGuestAccess = () => {
    setShowGuestDialog(true);
  };

  const handleHomeClick = () => {
    setShowHomeGuestDialog(true);
  };

  const handleResendEmail = () => {
    setShowResendDialog(true);
  };

  const handleResendConfirmation = async () => {
    if (!resendEmail) {
      toast.error('Please enter your email address');
      return;
    }

    setIsResending(true);
    try {
      await resendConfirmationEmail(resendEmail);
      setShowResendDialog(false);
      setResendEmail('');
    } catch (error) {
      console.error('Failed to resend confirmation:', error);
    } finally {
      setIsResending(false);
    }
  };

  const confirmGuestAccess = () => {
    setShowGuestDialog(false);
    setShowHomeGuestDialog(false);
    if (onGuestAccess) {
      onGuestAccess();
    }
    navigate('/landing');
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
            - 3/25/2025 Major updates coming right before we go to Adepticon!!! Hopefully all the features even in rough form but working! 
          </AlertDescription>
        </Alert>
        <div className="mb-6 flex justify-center gap-4">
          <Button
            onClick={handleHomeClick}
            className="bg-warcrow-accent hover:bg-warcrow-gold hover:text-warcrow-background border border-warcrow-gold text-warcrow-gold transition-all duration-300"
          >
            Back to Home
          </Button>
          <Button
            onClick={handleGuestAccess}
            className="bg-warcrow-accent hover:bg-warcrow-gold hover:text-warcrow-background border border-warcrow-gold text-warcrow-gold transition-all duration-300"
            disabled={isLoading}
          >
            Continue as Guest
          </Button>
        </div>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
            {error.includes('verify your email') && (
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 bg-warcrow-accent hover:bg-warcrow-gold hover:text-warcrow-background border border-warcrow-gold text-warcrow-gold transition-all duration-300"
                onClick={handleResendEmail}
              >
                Resend Confirmation Email
              </Button>
            )}
          </Alert>
        )}
        {isLoading && (
          <Alert className="mb-4 border-warcrow-gold bg-warcrow-gold/10">
            <AlertDescription>Signing you in...</AlertDescription>
          </Alert>
        )}
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#ffd700',
                  brandAccent: '#2a2d34',
                  brandButtonText: "black",
                },
                borderWidths: {
                  buttonBorderWidth: '1px',
                },
                radii: {
                  borderRadiusButton: '6px',
                },
              }
            },
            className: {
              button: 'bg-warcrow-gold hover:bg-warcrow-accent hover:text-warcrow-gold border border-warcrow-gold text-warcrow-background transition-all duration-300',
              input: 'bg-warcrow-background border-warcrow-gold text-warcrow-text',
              label: 'text-warcrow-text',
              anchor: 'text-warcrow-gold hover:text-warcrow-gold/80',
            },
          }}
          providers={[]}
        />
        <div className="mt-4 text-center">
          <Button 
            variant="link" 
            className="text-warcrow-gold hover:text-warcrow-gold/80"
            onClick={handleResendEmail}
          >
            Didn't receive confirmation email?
          </Button>
        </div>
      </div>

      <AlertDialog open={showGuestDialog} onOpenChange={setShowGuestDialog}>
        <AlertDialogContent className="bg-warcrow-accent border-warcrow-gold">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-warcrow-text">Guest Access</AlertDialogTitle>
            <AlertDialogDescription className="text-warcrow-text/80">
              While using the app as a guest, some features like saving army lists and cloud synchronization will be disabled. Sign in to access all features.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-warcrow-accent hover:bg-warcrow-gold hover:text-warcrow-background border border-warcrow-gold text-warcrow-gold">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => confirmGuestAccess()}
              className="bg-warcrow-gold hover:bg-warcrow-accent hover:text-warcrow-gold text-warcrow-background border border-warcrow-gold"
            >
              Continue as Guest
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showHomeGuestDialog} onOpenChange={setShowHomeGuestDialog}>
        <AlertDialogContent className="bg-warcrow-accent border-warcrow-gold">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-warcrow-text">Continuing as Guest</AlertDialogTitle>
            <AlertDialogDescription className="text-warcrow-text/80">
              You'll be continuing to the home page as a guest user. Some features will be limited. You can sign in anytime to access all features.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-warcrow-accent hover:bg-warcrow-gold hover:text-warcrow-background border border-warcrow-gold text-warcrow-gold">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmGuestAccess}
              className="bg-warcrow-gold hover:bg-warcrow-accent hover:text-warcrow-gold text-warcrow-background border border-warcrow-gold"
            >
              Continue to Home
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showResendDialog} onOpenChange={setShowResendDialog}>
        <AlertDialogContent className="bg-warcrow-accent border-warcrow-gold">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-warcrow-text">Resend Confirmation Email</AlertDialogTitle>
            <AlertDialogDescription className="text-warcrow-text/80">
              Enter your email address to receive a new confirmation email.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input 
              type="email" 
              placeholder="Your email address" 
              value={resendEmail} 
              onChange={(e) => setResendEmail(e.target.value)}
              className="bg-warcrow-background border-warcrow-gold text-warcrow-text"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-warcrow-accent hover:bg-warcrow-gold hover:text-warcrow-background border border-warcrow-gold text-warcrow-gold">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleResendConfirmation}
              className="bg-warcrow-gold hover:bg-warcrow-accent hover:text-warcrow-gold text-warcrow-background border border-warcrow-gold"
              disabled={isResending || !resendEmail}
            >
              {isResending ? 'Sending...' : 'Send Confirmation Email'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Login;
