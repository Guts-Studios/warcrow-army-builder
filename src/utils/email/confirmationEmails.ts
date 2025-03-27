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
    
    // Use Supabase's built-in email resend functionality, which should
    // use the configured SMTP settings (Resend in this case)
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });
    
    if (error) {
      console.error('Error sending confirmation email:', error);
      toast.error(`Failed to send confirmation email: ${error.message}`);
      return {
        success: false,
        message: `Error: ${error.message}`,
        details: error
      };
    }
    
    toast.success(`Confirmation email sent to ${email}. Please check both inbox and spam folders.`);
    return {
      success: true,
      message: `Confirmation email sent to ${email}`,
      details: null
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
