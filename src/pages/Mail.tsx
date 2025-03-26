
import * as React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  InfoIcon, 
  AlertTriangleIcon, 
  MailIcon, 
  RefreshCw, 
  ArrowLeft,
  CheckCircle,
  Settings,
  MailWarning 
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { resendAllPendingConfirmationEmails } from "@/utils/emailUtils";
import { useNavigate } from "react-router-dom";

const Mail = () => {
  const navigate = useNavigate();
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
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto p-4 md:p-8">
        <div className="flex items-center mb-6">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigate('/admin')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
            Email Management
          </h1>
        </div>
        
        <Tabs defaultValue="resend" className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <TabsList className="w-full md:w-auto grid grid-cols-2 md:flex md:flex-wrap gap-2">
              <TabsTrigger value="resend" className="md:flex-1">
                <MailIcon className="mr-2 h-4 w-4" />
                Resend API
              </TabsTrigger>
              <TabsTrigger value="supabase" className="md:flex-1">
                <MailIcon className="mr-2 h-4 w-4" />
                Supabase Auth Email
              </TabsTrigger>
              <TabsTrigger value="config" className="md:flex-1">
                <Settings className="mr-2 h-4 w-4" />
                Configuration
              </TabsTrigger>
              <TabsTrigger value="advanced" className="md:flex-1">
                <MailWarning className="mr-2 h-4 w-4" />
                Troubleshooting
              </TabsTrigger>
              <TabsTrigger value="admin" className="md:flex-1">
                <RefreshCw className="mr-2 h-4 w-4" />
                Admin Actions
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="resend">
            <Card className="bg-white dark:bg-gray-800 shadow-sm border-0">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800 dark:text-white">
                  <MailIcon className="mr-2 h-5 w-5 text-blue-500" />
                  Send Test Email (Resend Edge Function)
                </h2>
                
                {domainStatus && domainStatus.includes('not verified') && (
                  <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
                    <AlertTriangleIcon className="h-4 w-4" />
                    <AlertTitle className="font-semibold">Domain Not Verified</AlertTitle>
                    <AlertDescription className="mt-2">
                      {domainStatus}. This will cause email sending to fail.
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="mt-2 bg-white dark:bg-gray-800"
                        onClick={() => window.open('https://resend.com/domains', '_blank')}
                      >
                        Go to Resend Domains
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <Label htmlFor="testEmail" className="text-sm font-medium mb-1.5 block">
                        Test Email Address
                      </Label>
                      <Input
                        id="testEmail"
                        type="email"
                        placeholder="Enter test email address"
                        value={testEmail}
                        onChange={(e) => setTestEmail(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="customSubject" className="text-sm font-medium mb-1.5 block">
                        Email Subject
                      </Label>
                      <Input
                        id="customSubject"
                        type="text"
                        placeholder="Email subject"
                        value={customSubject}
                        onChange={(e) => setCustomSubject(e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="customHtml" className="text-sm font-medium mb-1.5 block">
                      Email HTML Content
                    </Label>
                    <Textarea
                      id="customHtml"
                      placeholder="Enter HTML content for the email"
                      value={customHtml}
                      onChange={(e) => setCustomHtml(e.target.value)}
                      className="w-full h-40 font-mono text-sm"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-2">
                    <Checkbox 
                      id="useDifferentSender" 
                      checked={useDifferentSender}
                      onCheckedChange={(checked) => {
                        setUseDifferentSender(checked === true);
                      }}
                    />
                    <Label 
                      htmlFor="useDifferentSender"
                      className="text-sm font-medium"
                    >
                      Use Resend's default domain instead (for testing)
                    </Label>
                  </div>
                  
                  {useDifferentSender && (
                    <div className="p-4 border rounded-md border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 space-y-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertTriangleIcon className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        <span className="text-sm font-medium text-amber-800 dark:text-amber-300">Using alternative sender</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="customFromEmail" className="text-sm font-medium mb-1.5 block">
                            From Email
                          </Label>
                          <Input
                            id="customFromEmail"
                            type="email"
                            placeholder="sender@example.com"
                            value={customFromEmail}
                            onChange={(e) => setCustomFromEmail(e.target.value)}
                            className="w-full"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="customFromName" className="text-sm font-medium mb-1.5 block">
                            From Name
                          </Label>
                          <Input
                            id="customFromName"
                            type="text"
                            placeholder="Sender Name"
                            value={customFromName}
                            onChange={(e) => setCustomFromName(e.target.value)}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    onClick={handleSendTestEmail}
                    disabled={!testEmail || isSending}
                    className="w-full md:w-auto"
                  >
                    {isSending ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <MailIcon className="mr-2 h-4 w-4" />
                        Send Test Email
                      </>
                    )}
                  </Button>
                  
                  <Alert className="mt-4 bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300">
                    <InfoIcon className="h-4 w-4 text-blue-500" />
                    <AlertDescription className="ml-2 text-sm">
                      This uses the Edge Function to send emails via the Resend API directly.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="supabase">
            <Card className="bg-white dark:bg-gray-800 shadow-sm border-0">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800 dark:text-white">
                  <MailIcon className="mr-2 h-5 w-5 text-blue-500" />
                  Test Supabase Auth Email (SMTP)
                </h2>
                <div className="space-y-5">
                  <div>
                    <Label htmlFor="supabaseTestEmail" className="text-sm font-medium mb-1.5 block">
                      Test Email Address
                    </Label>
                    <Input
                      id="supabaseTestEmail"
                      type="email"
                      placeholder="Enter test email address"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleSendSupabaseTest}
                    disabled={!testEmail || isSending}
                    className="w-full md:w-auto"
                  >
                    {isSending ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <MailIcon className="mr-2 h-4 w-4" />
                        Send Supabase Password Reset
                      </>
                    )}
                  </Button>
                  
                  <Alert className="mt-4 bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300">
                    <InfoIcon className="h-4 w-4 text-blue-500" />
                    <AlertDescription className="ml-2 text-sm">
                      This sends a password reset email using Supabase Auth, which will use your custom SMTP settings.
                      This is useful to test if your SMTP configuration is working correctly.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="config">
            <Card className="bg-white dark:bg-gray-800 shadow-sm border-0">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800 dark:text-white">
                  <Settings className="mr-2 h-5 w-5 text-blue-500" />
                  Email Configuration
                </h2>
                <div className="space-y-5">
                  <Alert className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-sm">
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-800 dark:text-white">Your Current SMTP Configuration:</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                        <p><span className="font-medium">Sender Email:</span> warcrowbuilderteam@updates.warcrowarmy.com</p>
                        <p><span className="font-medium">Sender Name:</span> Warcrow Army Builder</p>
                        <p><span className="font-medium">SMTP Host:</span> smtp.resend.com</p>
                        <p><span className="font-medium">SMTP Port:</span> 465</p>
                        <p><span className="font-medium">Username:</span> resend</p>
                        <p><span className="font-medium">Rate Limit:</span> One email every 60 seconds</p>
                      </div>
                    </div>
                  </Alert>
                  
                  <div className="space-y-3 mt-6">
                    <h3 className="font-semibold text-gray-800 dark:text-white">Troubleshooting Steps:</h3>
                    <ol className="list-decimal ml-5 space-y-2 text-sm">
                      <li className="pl-2">Verify your domain in Resend dashboard</li>
                      <li className="pl-2">Ensure the password is correct in Supabase SMTP settings</li>
                      <li className="pl-2">Check that port 465 is not blocked by your hosting provider</li>
                      <li className="pl-2">Test both methods (Resend API and Supabase SMTP) to isolate the issue</li>
                    </ol>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 mt-6">
                    <Button 
                      variant="outline"
                      onClick={() => window.open('https://supabase.com/dashboard/project/odqyoncwqawdzhquxcmh/auth/templates', '_blank')}
                      className="bg-white dark:bg-gray-800"
                    >
                      Supabase Email Templates
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => window.open('https://resend.com/domains', '_blank')}
                      className="bg-white dark:bg-gray-800"
                    >
                      Verify Domain in Resend
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => window.open('https://resend.com/logs', '_blank')}
                      className="bg-white dark:bg-gray-800"
                    >
                      Resend Email Logs
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="advanced">
            <Card className="bg-white dark:bg-gray-800 shadow-sm border-0">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800 dark:text-white">
                  <MailWarning className="mr-2 h-5 w-5 text-blue-500" />
                  Advanced Troubleshooting
                </h2>
                <div className="space-y-5">
                  <Alert className="bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300">
                    <InfoIcon className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                    <AlertTitle className="font-semibold">Resend Domain Status</AlertTitle>
                    <AlertDescription className="mt-2">
                      {domainStatus ? domainStatus : 'Checking domain status...'}
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-800 dark:text-white">Common Issues and Solutions:</h3>
                    <div className="space-y-4 mt-3">
                      <div className="p-4 border rounded-md bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 shadow-sm">
                        <h4 className="font-medium text-gray-800 dark:text-white">Domain Verification Issues</h4>
                        <p className="text-sm mt-1 text-gray-600 dark:text-gray-300">
                          If your domain shows as verified in Resend dashboard but you still get verification errors, try:
                        </p>
                        <ul className="list-disc ml-5 text-sm mt-2 space-y-1 text-gray-600 dark:text-gray-300">
                          <li>Checking that the API key you're using has access to this domain</li>
                          <li>Verifying DNS records are correctly set up (TXT and DKIM records)</li>
                          <li>Testing with Resend's default domain as a workaround (see Advanced Settings tab)</li>
                        </ul>
                      </div>
                      
                      <div className="p-4 border rounded-md bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 shadow-sm">
                        <h4 className="font-medium text-gray-800 dark:text-white">API Key Issues</h4>
                        <p className="text-sm mt-1 text-gray-600 dark:text-gray-300">
                          If you're experiencing API key errors:
                        </p>
                        <ul className="list-disc ml-5 text-sm mt-2 space-y-1 text-gray-600 dark:text-gray-300">
                          <li>Check that your API key is correctly set in Supabase edge function secrets</li>
                          <li>Ensure your API key has the necessary permissions</li>
                          <li>Create a new API key if the current one isn't working</li>
                        </ul>
                      </div>
                      
                      <div className="p-4 border rounded-md bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 shadow-sm">
                        <h4 className="font-medium text-gray-800 dark:text-white">SMTP vs. API Diagnostic</h4>
                        <p className="text-sm mt-1 text-gray-600 dark:text-gray-300">
                          If one method works but the other doesn't:
                        </p>
                        <ul className="list-disc ml-5 text-sm mt-2 space-y-1 text-gray-600 dark:text-gray-300">
                          <li>If Supabase Auth emails work but Resend API doesn't: Issue with Resend API key or domain verification</li>
                          <li>If Resend API works but Supabase Auth doesn't: Issue with SMTP configuration in Supabase</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 mt-6">
                    <Button 
                      variant="outline"
                      onClick={checkDomainStatus}
                      className="bg-white dark:bg-gray-800"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Refresh Domain Status
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => window.open('https://resend.com/api-keys', '_blank')}
                      className="bg-white dark:bg-gray-800"
                    >
                      Manage Resend API Keys
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => window.open('https://supabase.com/dashboard/project/odqyoncwqawdzhquxcmh/settings/functions', '_blank')}
                      className="bg-white dark:bg-gray-800"
                    >
                      Supabase Secrets
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="admin">
            <Card className="bg-white dark:bg-gray-800 shadow-sm border-0">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800 dark:text-white">
                  <RefreshCw className="mr-2 h-5 w-5 text-blue-500" />
                  Admin Email Actions
                </h2>
                <div className="space-y-5">
                  <Alert className="bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300 mb-4">
                    <InfoIcon className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <AlertTitle className="font-semibold">Mass Email Operations</AlertTitle>
                    <AlertDescription className="mt-2">
                      These operations affect multiple users. Use with caution.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="border rounded-md p-5 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 shadow-sm">
                    <h3 className="font-medium mb-3 flex items-center text-gray-800 dark:text-white">
                      <MailIcon className="h-4 w-4 mr-2 text-blue-500" />
                      Resend Confirmation Emails
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
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
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="mt-8 bg-white dark:bg-gray-800 shadow-sm border-0">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
              <InfoIcon className="mr-2 h-5 w-5 text-blue-500" />
              Understanding Email Flow
            </h2>
            <div className="space-y-5">
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <h3 className="font-medium text-gray-800 dark:text-white">Supabase Authentication Emails</h3>
                <p className="text-sm mt-1 text-gray-600 dark:text-gray-300">
                  Authentication emails (signup confirmation, password reset) use your custom SMTP settings in Supabase.
                  These emails are sent directly through smtp.resend.com using the credentials you provided.
                </p>
              </div>
              
              <div className="border-l-4 border-green-500 pl-4 py-2">
                <h3 className="font-medium text-gray-800 dark:text-white">Application Custom Emails</h3>
                <p className="text-sm mt-1 text-gray-600 dark:text-gray-300">
                  Custom emails from your application use the Resend API via Edge Functions.
                  These are sent using the API key, not the SMTP credentials.
                </p>
              </div>
              
              <Alert className="mt-4 bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300">
                <InfoIcon className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <AlertDescription className="ml-2 text-sm">
                  If Supabase authentication emails aren't working but the Edge Function emails are,
                  the issue is likely with your SMTP configuration in Supabase.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Mail;
