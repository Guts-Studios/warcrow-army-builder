
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
          <p>If you don't receive the authentication email, please check your Supabase SMTP settings.</p>
        `
      }
    });
    
    if (directEmailError) {
      console.error('Error sending direct test email:', directEmailError);
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
      message: `Both test emails sent to ${email}. If you only received the direct test email but not the authentication email, check your Supabase SMTP settings.`,
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
  return {
    success: true,
    message: 'Please use the Supabase Dashboard to manage confirmation emails for all users.',
    details: null
  };
};
