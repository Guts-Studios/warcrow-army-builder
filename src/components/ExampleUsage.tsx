import * as React from 'react';
import { Button } from "@/components/ui/button";
import { sendEmail } from "@/utils/emailUtils";
import { toast } from "sonner";

const ExampleUsage = () => {
  const handleSendTestEmail = React.useCallback(async () => {
    try {
      console.log('Attempting to send test email');
      const logoUrl = "https://odqyoncwqawdzhquxcmh.supabase.co/storage/v1/object/public/images/Logo.png?t=2024-12-31T22%3A06%3A03.113Z";
      
      const emailTemplate = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="${logoUrl}" alt="Warcrow Logo" style="height: 80px; margin: 0 auto;">
          </div>
          <div style="background-color: #1a1a1a; padding: 30px; border-radius: 8px; color: #ffffff;">
            <h1 style="color: #FFD700; margin-bottom: 20px; text-align: center;">Test Email from Warcrow Army Builder</h1>
            <p style="margin-bottom: 20px; line-height: 1.6;">
              This is a test email to verify that our email system is working correctly.
            </p>
            <p style="margin-bottom: 20px; line-height: 1.6;">
              If you received this email, it means our email system is functioning properly!
            </p>
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://warcrow-army.netlify.app" 
                 style="background-color: #FFD700; color: #000000; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                Visit Warcrow Army Builder
              </a>
            </div>
          </div>
          <div style="text-align: center; margin-top: 20px; color: #666666; font-size: 12px;">
            <p>© 2024 Warcrow Army Builder. All rights reserved.</p>
          </div>
        </div>
      `;

      await sendEmail(
        ['jakeballasch@gmail.com'], // Testing with the user's email
        'Warcrow Army Builder - Email System Test',
        emailTemplate
      );
      toast.success('Test email sent successfully');
      console.log('Test email sent successfully');
    } catch (error) {
      console.error('Failed to send test email:', error);
      toast.error('Failed to send test email');
    }
  }, []);

  return (
    <div className="p-4">
      <Button onClick={handleSendTestEmail}>
        Send Test Email
      </Button>
    </div>
  );
};

export default ExampleUsage;