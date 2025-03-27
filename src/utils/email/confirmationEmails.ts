
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ResendConfirmationResult } from "./types";

/**
 * Test if a specific email account can receive Supabase confirmation emails
 * @param email The email address to test
 * @returns Promise with the result of the operation
 */
export const testConfirmationEmail = async (email: string): Promise<ResendConfirmationResult> => {
  if (!email || !email.includes('@')) {
    return {
      success: false,
      message: 'Please provide a valid email address',
      details: null
    };
  }
  
  try {
    console.log(`Testing confirmation email for: ${email}`);
    
    // First, send a direct test email using our edge function to verify Resend is working correctly
    const { data: directEmailData, error: directEmailError } = await supabase.functions.invoke('send-resend-email', {
      body: {
        testConfirmationEmail: true,
        email: email,
        to: [email],
        subject: 'Warcrow - Email Delivery Test',
        html: `
          <h1>Email Delivery Test</h1>
          <p>This is a direct test email to verify that we can use Resend to deliver emails to your account.</p>
          <p>If you are seeing this, it means our direct email system works.</p>
          <p>You should also receive a separate Supabase authentication email.</p>
          <p>If you don't receive the authentication email, it's likely because:</p>
          <ul>
            <li>The Resend API key in Supabase SMTP settings is outdated or incorrect</li>
            <li>The SMTP settings in Supabase need to be reconfigured</li>
            <li>Authentication emails are disabled in Supabase settings</li>
          </ul>
          <p>Try updating your SMTP password in Supabase by:</p>
          <ol>
            <li>Going to Authentication → Email Templates → SMTP Settings</li>
            <li>Toggle OFF and then back ON "Enable Custom SMTP"</li>
            <li>Re-enter your current Resend API key as the password</li>
          </ol>
        `
      }
    });
    
    if (directEmailError) {
      console.error('Error sending direct test email:', directEmailError);
      
      if (directEmailError.message?.includes('API key is invalid')) {
        toast.error('Invalid Resend API key detected. Please update it in Supabase SMTP settings.');
        return {
          success: false,
          message: 'Your Resend API key is invalid. Please generate a new key at resend.com and update it in Supabase SMTP settings.',
          details: {
            errorType: 'invalid_api_key',
            errorMessage: directEmailError.message
          }
        };
      }
      
      toast.error(`Failed to send direct test email: ${directEmailError.message}`);
      return {
        success: false,
        message: `Error with direct email: ${directEmailError.message}`,
        details: directEmailError
      };
    }
    
    console.log('Direct test email result:', directEmailData);
    toast.success(`Direct test email sent to ${email}. Check your inbox.`);
    
    // Now, use Supabase's built-in email resend functionality
    console.log('Attempting to send Supabase authentication email via auth.resend...');
    
    // Let's log any relevant auth settings for debugging, but don't try to call a non-existent RPC
    console.log('Supabase auth settings: This would normally show auth settings if we had an RPC function for it');
    
    const { data: resendData, error: resendError } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });
    
    console.log('Supabase auth.resend response:', { data: resendData, error: resendError });
    
    if (resendError) {
      console.error('Error sending Supabase authentication email:', resendError);
      toast.error(`Failed to send Supabase authentication email: ${resendError.message}`);
      return {
        success: false,
        message: `Direct email sent but Supabase auth email failed: ${resendError.message}`,
        details: {
          directEmail: directEmailData,
          resendError
        }
      };
    }
    
    toast.success(`Supabase authentication email requested for ${email}. Check both inbox and spam folders.`);
    return {
      success: true,
      message: `Both test emails sent to ${email}. If you only received the direct test email but not the authentication email, your Supabase SMTP settings likely need updating.`,
      details: {
        directEmail: directEmailData,
        resendData
      }
    };
  } catch (error) {
    console.error('Error in testConfirmationEmail:', error);
    return {
      success: false,
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: null
    };
  }
};

/**
 * Resend confirmation emails to all users with unconfirmed email addresses
 * This functionality will be handled by Supabase directly if you use
 * the admin interface. This is just a placeholder for now.
 */
export const resendAllPendingConfirmationEmails = async (): Promise<ResendConfirmationResult> => {
  toast.info('This functionality should be handled in the Supabase Dashboard under Authentication > Users.');
  
  // Add some guidance for SMTP settings
  toast.info('If confirmation emails are not being received, check your SMTP settings in Authentication > Email Templates.');
  
  return {
    success: true,
    message: 'For email delivery issues, try updating your SMTP password (Resend API key) in Supabase Authentication settings.',
    details: null
  };
};
