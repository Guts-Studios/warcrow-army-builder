
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
    
    // First, send a direct test email using our edge function
    const { data, error } = await supabase.functions.invoke('send-resend-email', {
      body: {
        testConfirmationEmail: true,
        email: email,
        to: [email],
        subject: 'Test Confirmation Email',
        html: '<p>Test confirmation email</p>'
      }
    });
    
    if (error) {
      console.error('Error sending test confirmation email:', error);
      toast.error(`Failed to send test confirmation email: ${error.message}`);
      return {
        success: false,
        message: error.message,
        details: error
      };
    }
    
    console.log('Test confirmation email result:', data);
    
    // Now, use Supabase's built-in email resend functionality
    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });
      
      if (resendError) {
        console.warn('Supabase resend gave an error, but direct email was sent:', resendError);
        toast.warning(`Direct test email sent, but there was an issue with Supabase's confirmation email: ${resendError.message}`);
        return {
          success: true,
          message: `Direct test email sent to ${email}, but there was an issue with the confirmation email. Please check your Supabase SMTP settings.`,
          details: {
            directEmail: data,
            confirmationError: resendError
          }
        };
      }
      
      toast.success(`Test emails sent to ${email}. Please check both inbox and spam folders.`);
      return {
        success: true,
        message: `Test emails sent to ${email}`,
        details: data
      };
    } catch (resendError) {
      console.warn('Failed to trigger Supabase confirmation email, but direct email was sent:', resendError);
      toast.warning(`Direct test email sent, but there was an issue with Supabase's confirmation email system.`);
      return {
        success: true,
        message: `Direct test email sent to ${email}, but there was an issue with the confirmation email system.`,
        details: data
      };
    }
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
