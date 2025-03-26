
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
      options,
      provider: 'Resend'
    });
    
    const { data, error } = await supabase.functions.invoke('send-resend-email', {
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
      timestamp: new Date().toISOString(),
      provider: 'Resend'
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

// Test function to verify Resend functionality
export const testResendEmail = async () => {
  try {
    await sendEmail(
      ['caldwejf@gmail.com'],
      'Resend Test Email',
      '<h1>Test Email from Warcrow Army</h1><p>This is a test email sent via Resend to verify the email service is working.</p>',
      {}
    );
    console.log('Test email sent successfully via Resend');
    return true;
  } catch (error) {
    console.error('Failed to send test email via Resend:', error);
    throw error;
  }
};

// Make test function available globally for testing
declare global {
  interface Window {
    testResendEmail: typeof testResendEmail;
  }
}

// Add test function to window object
if (typeof window !== 'undefined') {
  window.testResendEmail = testResendEmail;
}
