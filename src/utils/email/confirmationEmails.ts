
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ResendConfirmationResult } from "./types";

/**
 * Resend confirmation emails to all users with unconfirmed email addresses
 * @returns Promise with the result of the operation
 */
export const resendAllPendingConfirmationEmails = async (): Promise<ResendConfirmationResult> => {
  try {
    console.log('Fetching users with unconfirmed emails...');
    
    const { data, error } = await supabase.functions.invoke('send-resend-email', {
      body: {
        resendAllPendingConfirmations: true,
        // Adding minimal required fields for the edge function
        to: ['placeholder@example.com'],
        subject: 'Confirmation',
        html: '<p>Confirmation</p>'
      }
    });

    if (error) {
      console.error('Error fetching unconfirmed users:', error);
      toast.error(`Failed to resend confirmation emails: ${error.message}`);
      throw error;
    }

    console.log('Confirmation emails resend result:', data);
    
    // Show success toast with count of emails sent
    if (data?.count) {
      toast.success(`Sent ${data.count} confirmation emails successfully!`);
    } else {
      toast.info('No pending email confirmations found');
    }
    
    return {
      success: true,
      message: `Confirmation emails sent to ${data?.count || 0} users`,
      details: data
    };
  } catch (error) {
    console.error('Failed to resend confirmation emails:', error);
    return {
      success: false,
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: null
    };
  }
};

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
    
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
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
    
    console.log('Test confirmation email sent successfully');
    toast.success(`Test confirmation email sent to ${email}`);
    
    return {
      success: true,
      message: `Test confirmation email sent to ${email}`,
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
