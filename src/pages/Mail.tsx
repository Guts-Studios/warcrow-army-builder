
import * as React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

const Mail = () => {
  const [testEmail, setTestEmail] = React.useState('');
  const [isSending, setIsSending] = React.useState(false);
  const [customSubject, setCustomSubject] = React.useState('Test Email from Warcrow Army');
  const [customHtml, setCustomHtml] = React.useState(
    `<h1>Test Email from Warcrow Army</h1>
<p>This is a test email sent via Resend to verify the email service is working.</p>
<p>Time sent: ${new Date().toLocaleString()}</p>`
  );

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
          subject: customSubject,
          html: customHtml
        }
      });

      if (error) {
        console.error('Supabase Function Error:', error);
        toast.error(`Failed to send email: ${error.message}`);
        return;
      }

      if (data?.error) {
        console.error('Resend API Error:', data.error);
        
        if (typeof data.error === 'string' && data.error.includes('domain is not verified')) {
          toast.error('Domain verification error. Please check the Resend dashboard.');
        } else if (typeof data.error === 'string' && data.error.includes('rate limit')) {
          toast.error('Rate limit exceeded. Please try again later.');
        } else {
          toast.error(`Resend error: ${typeof data.error === 'string' ? data.error : JSON.stringify(data.error)}`);
        }
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

  const handleSendSupabaseTest = async () => {
    if (!testEmail) {
      toast.error('Please enter an email address');
      return;
    }

    try {
      setIsSending(true);
      // Attempt to send a password recovery email using Supabase Auth
      const { error } = await supabase.auth.resetPasswordForEmail(testEmail, {
        redirectTo: window.location.origin + '/reset-password',
      });

      if (error) {
        console.error('Supabase Auth Email Error:', error);
        toast.error(`Failed to send Supabase test email: ${error.message}`);
        return;
      }

      toast.success('Supabase password reset email sent! Check your inbox to verify SMTP settings are working.');
    } catch (error) {
      console.error('Failed to send Supabase test email:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send Supabase test email');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Email Testing Dashboard</h1>
      
      <Tabs defaultValue="resend" className="mb-8">
        <TabsList>
          <TabsTrigger value="resend">Resend Edge Function</TabsTrigger>
          <TabsTrigger value="supabase">Supabase Auth Email</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
        </TabsList>
        
        <TabsContent value="resend">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Send Test Email (Resend Edge Function)</h2>
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
              
              <div>
                <Label htmlFor="customSubject">Email Subject</Label>
                <Input
                  id="customSubject"
                  type="text"
                  placeholder="Email subject"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="customHtml">Email HTML Content</Label>
                <textarea
                  id="customHtml"
                  placeholder="Enter HTML content for the email"
                  value={customHtml}
                  onChange={(e) => setCustomHtml(e.target.value)}
                  className="w-full h-40 mt-1 px-3 py-2 border rounded-md border-input bg-background"
                />
              </div>
              
              <Button 
                onClick={handleSendTestEmail}
                disabled={!testEmail || isSending}
              >
                {isSending ? 'Sending...' : 'Send Test Email'}
              </Button>
              
              <Alert className="mt-4 bg-muted">
                <InfoIcon className="h-4 w-4" />
                <AlertDescription className="ml-2 text-sm">
                  This uses the Edge Function to send emails via the Resend API directly.
                </AlertDescription>
              </Alert>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="supabase">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Test Supabase Auth Email (SMTP)</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="supabaseTestEmail">Test Email Address</Label>
                <Input
                  id="supabaseTestEmail"
                  type="email"
                  placeholder="Enter test email address"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <Button 
                onClick={handleSendSupabaseTest}
                disabled={!testEmail || isSending}
              >
                {isSending ? 'Sending...' : 'Send Supabase Password Reset'}
              </Button>
              
              <Alert className="mt-4 bg-muted">
                <InfoIcon className="h-4 w-4" />
                <AlertDescription className="ml-2 text-sm">
                  This sends a password reset email using Supabase Auth, which will use your custom SMTP settings.
                  This is useful to test if your SMTP configuration is working correctly.
                </AlertDescription>
              </Alert>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="config">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Email Configuration</h2>
            <div className="space-y-4">
              <Alert>
                <div className="space-y-2">
                  <h3 className="font-semibold">Your Current SMTP Configuration:</h3>
                  <p><strong>Sender Email:</strong> warcrowbuilderteam@updates.warcrowarmy.com</p>
                  <p><strong>Sender Name:</strong> Warcrow Army Builder</p>
                  <p><strong>SMTP Host:</strong> smtp.resend.com</p>
                  <p><strong>SMTP Port:</strong> 465</p>
                  <p><strong>Username:</strong> resend</p>
                  <p><strong>Rate Limit:</strong> One email every 60 seconds</p>
                </div>
              </Alert>
              
              <div className="space-y-2 mt-4">
                <h3 className="font-semibold">Troubleshooting Steps:</h3>
                <ol className="list-decimal ml-5 space-y-2">
                  <li>Verify your domain in Resend dashboard</li>
                  <li>Ensure the password is correct in Supabase SMTP settings</li>
                  <li>Check that port 465 is not blocked by your hosting provider</li>
                  <li>Test both methods (Resend API and Supabase SMTP) to isolate the issue</li>
                </ol>
              </div>
              
              <div className="flex space-x-4 mt-6">
                <Button 
                  variant="outline"
                  onClick={() => window.open('https://supabase.com/dashboard/project/odqyoncwqawdzhquxcmh/auth/templates', '_blank')}
                >
                  Supabase Email Templates
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.open('https://resend.com/domains', '_blank')}
                >
                  Verify Domain in Resend
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.open('https://resend.com/logs', '_blank')}
                >
                  Resend Email Logs
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Understanding Email Flow</h2>
        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4 py-2">
            <h3 className="font-medium">Supabase Authentication Emails</h3>
            <p className="text-sm mt-1">
              Authentication emails (signup confirmation, password reset) use your custom SMTP settings in Supabase.
              These emails are sent directly through smtp.resend.com using the credentials you provided.
            </p>
          </div>
          
          <div className="border-l-4 border-green-500 pl-4 py-2">
            <h3 className="font-medium">Application Custom Emails</h3>
            <p className="text-sm mt-1">
              Custom emails from your application use the Resend API via Edge Functions.
              These are sent using the API key, not the SMTP credentials.
            </p>
          </div>
          
          <Alert className="mt-4 bg-amber-50 text-amber-900 border-amber-200">
            <InfoIcon className="h-4 w-4 text-amber-500" />
            <AlertDescription className="ml-2 text-sm">
              If Supabase authentication emails aren't working but the Edge Function emails are,
              the issue is likely with your SMTP configuration in Supabase.
            </AlertDescription>
          </Alert>
        </div>
      </Card>
    </div>
  );
};

export default Mail;
