
import * as React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Mail = () => {
  const [testEmail, setTestEmail] = React.useState('');
  const [isSending, setIsSending] = React.useState(false);

  const handleSendTestEmail = async () => {
    if (!testEmail) {
      toast.error('Please enter an email address');
      return;
    }

    try {
      setIsSending(true);
      const { data, error } = await supabase.functions.invoke('send-resend-email', {
        body: {
          to: [testEmail],
          subject: 'Test Email from Warcrow Army',
          html: `
            <h1>Test Email from Warcrow Army</h1>
            <p>This is a test email sent via Resend to verify the email service is working.</p>
            <p>Time sent: ${new Date().toLocaleString()}</p>
          `
        }
      });

      if (error) {
        console.error('Supabase Function Error:', error);
        toast.error(`Failed to send email: ${error.message}`);
        return;
      }

      if (data?.error) {
        console.error('Resend API Error:', data.error);
        toast.error(`Resend error: ${data.error}`);
        return;
      }

      toast.success('Test email sent successfully! Check your inbox.');
      console.log('Email sent successfully:', data);
    } catch (error) {
      console.error('Failed to send test email:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send test email');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Email Testing Dashboard</h1>
      
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Send Test Email (Resend)</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="testEmail">Test Email Address</Label>
            <Input
              id="testEmail"
              type="email"
              placeholder="Enter test email address"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="mt-1"
            />
          </div>
          <Button 
            onClick={handleSendTestEmail}
            disabled={!testEmail || isSending}
          >
            {isSending ? 'Sending...' : 'Send Test Email'}
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Email Configuration</h2>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Account confirmation emails are sent directly by Supabase Authentication service.
          </p>
          <p className="text-sm text-gray-500">
            Verify Supabase email templates and settings in the Supabase dashboard.
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.open('https://supabase.com/dashboard/project/odqyoncwqawdzhquxcmh/auth/templates', '_blank')}
          >
            Supabase Email Templates
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Mail;
