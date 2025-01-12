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
    console.log('Email Request:', {
      functionName: 'send-email',
      payload: { to, subject, html, ...options }
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
        errorMessage: error.message,
        errorDetails: error.details,
        statusCode: error.status
      });
      throw error;
    }

    console.log('Edge Function Response:', {
      success: true,
      data,
      timestamp: new Date().toISOString()
    });
    
    return data;
  } catch (error) {
    console.error('Email Send Failure:', {
      error,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
    throw error;
  }
};