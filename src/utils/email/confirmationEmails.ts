
import { supabase } from "@/integrations/supabase/client";
import { ResendConfirmationResult } from "./types";

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
      throw error;
    }

    console.log('Confirmation emails resend result:', data);
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
