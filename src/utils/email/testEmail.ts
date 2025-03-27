
import { sendEmail } from "./sendEmail";
import { EmailOptions } from "./types";
import { toast } from "sonner";

export const testResendEmail = async (email?: string, useDefaultDomain = false) => {
  try {
    const options: EmailOptions = {};
    
    if (useDefaultDomain) {
      options.fromEmail = 'onboarding@resend.dev';
      options.fromName = 'Warcrow Test';
    }
    
    const result = await sendEmail(
      [email || 'caldwejf@gmail.com'],
      'Resend Test Email',
      '<h1>Test Email from Warcrow Army</h1><p>This is a test email sent via Resend to verify the email service is working.</p>',
      options
    );
    
    // Check if the response contains an error about invalid API key
    if (result?.error?.message?.includes('API key is invalid')) {
      toast.error('Invalid Resend API key detected. Please update it in Supabase Edge Functions settings.');
      throw new Error('Invalid Resend API key. Please update it in the Supabase dashboard.');
    }
    
    console.log('Test email sent successfully via Resend');
    return true;
  } catch (error) {
    console.error('Failed to send test email via Resend:', error);
    throw error;
  }
};
