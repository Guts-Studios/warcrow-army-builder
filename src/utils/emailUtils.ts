import { supabase } from "@/integrations/supabase/client";

interface EmailOptions {
  type?: 'welcome' | 'reset_password';
  token?: string;
}

export const sendEmail = async (
  to: string[], 
  subject: string, 
  html: string, 
  options: EmailOptions = {}
) => {
  try {
    console.log('Preparing to send email:', {
      to,
      subject,
      options
    });
    
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        to,
        subject,
        html,
        type: options.type,
        token: options.token
      }
    });

    if (error) {
      console.error('Edge Function Error:', {
        error,
        message: error.message,
        details: error.details,
        status: error.status
      });
      throw error;
    }

    console.log('Email sent successfully:', {
      data,
      timestamp: new Date().toISOString()
    });
    
    return data;
  } catch (error) {
    console.error('Email Send Failure:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
    throw error;
  }
};