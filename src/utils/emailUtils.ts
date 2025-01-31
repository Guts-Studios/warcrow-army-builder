import { supabase } from "@/integrations/supabase/client";

interface EmailOptions {
  type?: 'welcome' | 'reset_password';
  token?: string;
  useResend?: boolean;
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
      provider: options.useResend ? 'Resend' : 'Mailgun'
    });
    
    const functionName = options.useResend ? 'send-resend-email' : 'send-email';
    
    const { data, error } = await supabase.functions.invoke(functionName, {
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
      provider: options.useResend ? 'Resend' : 'Mailgun'
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
      { useResend: true }
    );
    console.log('Test email sent successfully via Resend');
    return true;
  } catch (error) {
    console.error('Failed to send test email via Resend:', error);
    throw error;
  }
};

// Test function to verify Mailgun functionality
export const testMailgunEmail = async () => {
  try {
    await sendEmail(
      ['caldwejf@gmail.com'],
      'Mailgun Test Email',
      '<h1>Test Email from Warcrow Army</h1><p>This is a test email sent via Mailgun to verify the email service is working.</p>'
    );
    console.log('Test email sent successfully via Mailgun');
    return true;
  } catch (error) {
    console.error('Failed to send test email via Mailgun:', error);
    throw error;
  }
};

// Make test functions available globally for testing
declare global {
  interface Window {
    testMailgunEmail: () => Promise<boolean>;
    testResendEmail: () => Promise<boolean>;
  }
}

// Ensure we're in a browser environment before adding to window
if (typeof window !== 'undefined') {
  window.testMailgunEmail = testMailgunEmail;
  window.testResendEmail = testResendEmail;
}