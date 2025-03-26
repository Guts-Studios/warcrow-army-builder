
import { supabase } from "@/integrations/supabase/client";

interface EmailOptions {
  type?: 'welcome' | 'reset_password';
  token?: string;
  fromEmail?: string; // Add support for custom sender email
  fromName?: string;  // Add support for custom sender name
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
        token: options.token,
        fromEmail: options.fromEmail,
        fromName: options.fromName
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
export const testResendEmail = async (useDefaultDomain = false) => {
  try {
    const options: EmailOptions = {};
    
    // Use Resend's default domain for testing if specified
    if (useDefaultDomain) {
      options.fromEmail = 'onboarding@resend.dev';
      options.fromName = 'Warcrow Test';
    }
    
    await sendEmail(
      ['caldwejf@gmail.com'],
      'Resend Test Email',
      '<h1>Test Email from Warcrow Army</h1><p>This is a test email sent via Resend to verify the email service is working.</p>',
      options
    );
    console.log('Test email sent successfully via Resend');
    return true;
  } catch (error) {
    console.error('Failed to send test email via Resend:', error);
    throw error;
  }
};

// Add function to check domain verification status
export const checkDomainVerificationStatus = async () => {
  try {
    console.log('Checking domain verification status...');
    const { data, error } = await supabase.functions.invoke('send-resend-email', {
      body: {
        checkDomainOnly: true,
        // Include minimal required fields even though they won't be used
        to: ['check@example.com'],
        subject: 'Domain Check',
        html: '<p>Domain verification check</p>'
      }
    });

    if (error) {
      console.error('Error checking domain status:', error);
      return {
        verified: false,
        status: `Error: ${error.message}`,
        domains: []
      };
    }

    console.log('Domain status check result:', data);
    return data;
  } catch (error) {
    console.error('Failed to check domain status:', error);
    return {
      verified: false,
      status: `Exception: ${error instanceof Error ? error.message : 'Unknown error'}`,
      domains: []
    };
  }
};

// Function to resend confirmation emails to unconfirmed users
export const resendAllPendingConfirmationEmails = async () => {
  try {
    console.log('Fetching users with unconfirmed emails...');
    
    // Fetch users who need confirmation
    const { data: users, error } = await supabase.functions.invoke('send-resend-email', {
      body: {
        resendAllPendingConfirmations: true
      }
    });

    if (error) {
      console.error('Error fetching unconfirmed users:', error);
      throw error;
    }

    console.log('Confirmation emails resend result:', users);
    return {
      success: true,
      message: `Confirmation emails sent to ${users.count} users`,
      details: users
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

// Make functions available globally for testing
if (typeof window !== 'undefined') {
  window.testResendEmail = testResendEmail;
  window.checkDomainVerificationStatus = checkDomainVerificationStatus;
  window.resendAllPendingConfirmationEmails = resendAllPendingConfirmationEmails;
}

// Explicitly define the global interface
declare global {
  interface Window {
    testResendEmail: typeof testResendEmail;
    checkDomainVerificationStatus: typeof checkDomainVerificationStatus;
    resendAllPendingConfirmationEmails: typeof resendAllPendingConfirmationEmails;
  }
}
