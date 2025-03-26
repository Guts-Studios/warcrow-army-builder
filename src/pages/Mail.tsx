import * as React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, AlertTriangleIcon, MailIcon, RefreshCw } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { resendAllPendingConfirmationEmails } from "@/utils/emailUtils";

const Mail = () => {
  const [testEmail, setTestEmail] = React.useState('');
  const [isSending, setIsSending] = React.useState(false);
  const [customSubject, setCustomSubject] = React.useState('Test Email from Warcrow Army');
  const [customHtml, setCustomHtml] = React.useState(
    `<h1>Test Email from Warcrow Army</h1>
<p>This is a test email sent via Resend to verify the email service is working.</p>
<p>Time sent: ${new Date().toLocaleString()}</p>`
  );
  const [useDifferentSender, setUseDifferentSender] = React.useState(false);
  const [customFromEmail, setCustomFromEmail] = React.useState('onboarding@resend.dev');
  const [customFromName, setCustomFromName] = React.useState('Warcrow Test');
  const [domainStatus, setDomainStatus] = React.useState<string | null>(null);
  const [isResendingConfirmations, setIsResendingConfirmations] = React.useState(false);
  
  const checkDomainStatus = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('send-resend-email', {
        body: {
          to: [testEmail || 'test@example.com'],
          subject: 'Domain Check Only',
          html: '<p>Domain check</p>',
          checkDomainOnly: true
        }
      });

      if (error) {
        console.error('Failed to check domain status:', error);
        setDomainStatus('Failed to check domain status');
        return;
      }

      setDomainStatus(data?.domainStatus || 'Unknown status');
    } catch (error) {
      console.error('Error checking domain status:', error);
      setDomainStatus('Error checking domain status');
    }
  };

  React.useEffect(() => {
    checkDomainStatus();
  }, []);

  const handleResendConfirmationEmails = async () => {
    try {
      setIsResendingConfirmations(true);
      toast.info("Resending confirmation emails to unconfirmed users...");
      
      const result = await resendAllPendingConfirmationEmails();
      
      if (result.success) {
        toast.success(result.message);
        console.log('Confirmation emails resend details:', result.details);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Failed to resend confirmation emails:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to resend confirmation emails');
    } finally {
      setIsResendingConfirmations(false);
    }
  };

  const handleSendTestEmail = async () => {
    if (!testEmail) {
      toast.error('Please enter an email address');
      return;
    }

    try {
      setIsSending(true);
      
      const emailConfig: any = {
        to: [testEmail],
        subject: customSubject,
        html: customHtml,
      };
      
      if (useDifferentSender && customFromEmail) {
        emailConfig.fromEmail = customFromEmail;
        if (customFromName) {
          emailConfig.fromName = customFromName;
        }
      }
      
      const { data, error } = await supabase.functions.invoke('send-resend-email', {
        body: emailConfig
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
          <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
          <TabsTrigger value="admin">Admin Actions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="resend">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Send Test Email (Resend Edge Function)</h2>
            
            {domainStatus && domainStatus.includes('not verified') && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangleIcon className="h-4 w-4" />
                <AlertTitle>Domain Not Verified</AlertTitle>
                <AlertDescription>
                  {domainStatus}. This will cause email sending to fail.
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="mt-2"
                    onClick={() => window.open('https://resend.com/domains', '_blank')}
                  >
                    Go to Resend Domains
                  </Button>
                </AlertDescription>
              </Alert>
            )}
            
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
              
              {useDifferentSender && (
                <div className="p-3 border rounded-md border-yellow-200 bg-yellow-50">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangleIcon className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">Using alternative sender</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="customFromEmail">From Email</Label>
                      <Input
                        id="customFromEmail"
                        type="email"
                        placeholder="sender@example.com"
                        value={customFromEmail}
                        onChange={(e) => setCustomFromEmail(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="customFromName">From Name</Label>
                      <Input
                        id="customFromName"
                        type="text"
                        placeholder="Sender Name"
                        value={customFromName}
                        onChange={(e) => setCustomFromName(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="useDifferentSender" 
                  checked={useDifferentSender}
                  onCheckedChange={(checked) => {
                    setUseDifferentSender(checked === true);
                  }}
                />
                <Label 
                  htmlFor="useDifferentSender"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Use Resend's default domain instead (for testing)
                </Label>
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
        
        <TabsContent value="advanced">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Advanced Troubleshooting</h2>
            <div className="space-y-4">
              <Alert className="bg-blue-50 border-blue-200 text-blue-800">
                <InfoIcon className="h-4 w-4 text-blue-600" />
                <AlertTitle>Resend Domain Status</AlertTitle>
                <AlertDescription className="mt-2">
                  {domainStatus ? domainStatus : 'Checking domain status...'}
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                <h3 className="font-semibold">Common Issues and Solutions:</h3>
                <div className="space-y-3 mt-2">
                  <div className="p-3 border rounded-md">
                    <h4 className="font-medium">Domain Verification Issues</h4>
                    <p className="text-sm mt-1">
                      If your domain shows as verified in Resend dashboard but you still get verification errors, try:
                    </p>
                    <ul className="list-disc ml-5 text-sm mt-2 space-y-1">
                      <li>Checking that the API key you're using has access to this domain</li>
                      <li>Verifying DNS records are correctly set up (TXT and DKIM records)</li>
                      <li>Testing with Resend's default domain as a workaround (see Advanced Settings tab)</li>
                    </ul>
                  </div>
                  
                  <div className="p-3 border rounded-md">
                    <h4 className="font-medium">API Key Issues</h4>
                    <p className="text-sm mt-1">
                      If you're experiencing API key errors:
                    </p>
                    <ul className="list-disc ml-5 text-sm mt-2 space-y-1">
                      <li>Check that your API key is correctly set in Supabase edge function secrets</li>
                      <li>Ensure your API key has the necessary permissions</li>
                      <li>Create a new API key if the current one isn't working</li>
                    </ul>
                  </div>
                  
                  <div className="p-3 border rounded-md">
                    <h4 className="font-medium">SMTP vs. API Diagnostic</h4>
                    <p className="text-sm mt-1">
                      If one method works but the other doesn't:
                    </p>
                    <ul className="list-disc ml-5 text-sm mt-2 space-y-1">
                      <li>If Supabase Auth emails work but Resend API doesn't: Issue with Resend API key or domain verification</li>
                      <li>If Resend API works but Supabase Auth doesn't: Issue with SMTP configuration in Supabase</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-4 mt-6">
                <Button 
                  variant="outline"
                  onClick={checkDomainStatus}
                >
                  Refresh Domain Status
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.open('https://resend.com/api-keys', '_blank')}
                >
                  Manage Resend API Keys
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.open('https://supabase.com/dashboard/project/odqyoncwqawdzhquxcmh/settings/functions', '_blank')}
                >
                  Supabase Secrets
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="admin">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Admin Email Actions</h2>
            <div className="space-y-4">
              <Alert className="bg-amber-50 text-amber-800 border-amber-200 mb-4">
                <InfoIcon className="h-4 w-4 text-amber-600" />
                <AlertTitle>Mass Email Operations</AlertTitle>
                <AlertDescription className="mt-2">
                  These operations affect multiple users. Use with caution.
                </AlertDescription>
              </Alert>
              
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2 flex items-center">
                  <MailIcon className="h-4 w-4 mr-2" />
                  Resend Confirmation Emails
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  This will resend confirmation emails to all users who have not yet confirmed their email addresses.
                </p>
                <Button 
                  onClick={handleResendConfirmationEmails}
                  disabled={isResendingConfirmations}
                  className="w-full sm:w-auto"
                  variant="default"
                >
                  {isResendingConfirmations ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <MailIcon className="mr-2 h-4 w-4" />
                      Resend All Confirmation Emails
                    </>
                  )}
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
