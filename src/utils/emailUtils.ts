import { supabase } from "@/integrations/supabase/client";

export const sendEmail = async (to: string[], subject: string, html: string) => {
  try {
    console.log('Attempting to send email with:', { to, subject, html });
    
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        to,
        subject,
        html
      }
    });

    if (error) {
      console.error('Error sending email:', error);
      throw error;
    }

    console.log('Email sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};