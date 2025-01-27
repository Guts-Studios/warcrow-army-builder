import * as React from 'react';
import { Button } from "@/components/ui/button";
import { sendEmail } from "@/utils/emailUtils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

const ExampleUsage = () => {
  const [isTester, setIsTester] = React.useState(false);
  const [showDialog, setShowDialog] = React.useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = React.useState(false);

  React.useEffect(() => {
    const checkTesterStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Current session:', session);
        
        if (session?.user) {
          console.log('Checking tester status for user:', session.user.id);
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('tester')
            .eq('id', session.user.id)
            .single();
          
          if (error) {
            console.error('Error fetching profile:', error);
            return;
          }
          
          console.log('Profile data:', profile);
          setIsTester(profile?.tester || false);
          console.log('Tester status set to:', profile?.tester);
        } else {
          console.log('No active session found');
        }
      } catch (error) {
        console.error('Error in checkTesterStatus:', error);
      }
    };

    checkTesterStatus();
  }, []);

  const handleSendTestEmail = React.useCallback(async () => {
    console.log('Current tester status:', isTester);
    
    if (!isTester) {
      console.log('User is not a tester, showing dialog');
      setShowDialog(true);
      return;
    }

    try {
      console.log('Attempting to send test email');
      const logoUrl = "https://odqyoncwqawdzhquxcmh.supabase.co/storage/v1/object/public/images/Logo.png?t=2024-12-31T22%3A06%3A03.113Z";
      
      const emailTemplate = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="${logoUrl}" alt="Warcrow Logo" style="height: 80px; margin: 0 auto;">
          </div>
          <div style="background-color: #1a1a1a; padding: 30px; border-radius: 8px; color: #ffffff;">
            <h1 style="color: #FFD700; margin-bottom: 20px; text-align: center;">Test Email from Warcrow Army Builder</h1>
            <p style="margin-bottom: 20px; line-height: 1.6;">
              This is a test email to verify that our email system is working correctly.
            </p>
            <p style="margin-bottom: 20px; line-height: 1.6;">
              If you received this email, it means our email system is functioning properly!
            </p>
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://warcrow-army.netlify.app" 
                 style="background-color: #FFD700; color: #000000; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                Visit Warcrow Army Builder
              </a>
            </div>
          </div>
          <div style="text-align: center; margin-top: 20px; color: #666666; font-size: 12px;">
            <p>© 2024 Warcrow Army Builder. All rights reserved.</p>
          </div>
        </div>
      `;

      await sendEmail(
        ['caldwejf@gmail.com'],
        'Warcrow Army Builder - Email System Test',
        emailTemplate
      );
      setShowSuccessDialog(true);
      toast.success('Test email sent successfully');
      console.log('Test email sent successfully');
    } catch (error) {
      console.error('Failed to send test email:', error);
      toast.error('Failed to send test email');
    }
  }, [isTester]);

  return (
    <div className="p-4">
      <Button 
        onClick={handleSendTestEmail}
        variant="outline"
        className="bg-warcrow-accent text-warcrow-text hover:bg-warcrow-accent/80 transition-colors border border-warcrow-gold/30"
      >
        Send Test Email
      </Button>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tester Access Only</AlertDialogTitle>
            <AlertDialogDescription>
              Sorry, only users with the Tester role can use this feature currently.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Success!</AlertDialogTitle>
            <AlertDialogDescription>
              The test email has been sent successfully. Please check your inbox.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ExampleUsage;