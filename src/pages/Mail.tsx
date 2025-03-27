
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  testResendEmail, 
  checkDomainVerificationStatus, 
  resendAllPendingConfirmationEmails, 
  DomainVerificationResult,
  testConfirmationEmail
} from "@/utils/email";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/common/PageHeader";

const Mail = () => {
  const navigate = useNavigate();
  const [domainStatus, setDomainStatus] = useState<DomainVerificationResult>({ 
    verified: false, 
    status: 'Checking...', 
    domains: [] 
  });
  const [testEmail, setTestEmail] = useState('');
  const [confirmationEmail, setConfirmationEmail] = useState('');
  const [isResendingAll, setIsResendingAll] = useState(false);
  const [isTestingConfirmation, setIsTestingConfirmation] = useState(false);
  const [isAPIKeyValid, setIsAPIKeyValid] = useState<boolean | null>(null);

  useEffect(() => {
    checkDomainStatus();
  }, []);

  const checkDomainStatus = async () => {
    try {
      const status = await checkDomainVerificationStatus();
      setDomainStatus(status);
      
      // If we got a valid response, assume the API key is valid
      setIsAPIKeyValid(true);
    } catch (error: any) {
      console.error("Failed to check domain status:", error);
      
      if (error.message?.includes('API key is invalid')) {
        setIsAPIKeyValid(false);
        toast.error('Invalid Resend API key detected. Please update it in Supabase.');
      } else {
        toast.error(`Failed to check domain status: ${error.message}`);
      }
      
      setDomainStatus({ verified: false, status: `Error: ${error.message}`, domains: [] });
    }
  };

  const handleTestEmail = async () => {
    try {
      const emailToUse = testEmail.trim() || undefined;
      await testResendEmail(emailToUse);
      toast.success(`Test email sent successfully${emailToUse ? ` to ${emailToUse}` : ''}!`);
    } catch (error: any) {
      console.error("Failed to send test email:", error);
      
      if (error.message?.includes('API key is invalid')) {
        setIsAPIKeyValid(false);
        toast.error('Invalid Resend API key detected. Please update it in Supabase.');
      } else {
        toast.error(`Failed to send test email: ${error.message}`);
      }
    }
  };

  const handleResendConfirmations = async () => {
    try {
      setIsResendingAll(true);
      const result = await resendAllPendingConfirmationEmails();
      if (!result.success) {
        toast.error(result.message);
      }
    } catch (error: any) {
      console.error("Failed to resend confirmation emails:", error);
      toast.error(`Failed to resend confirmation emails: ${error.message}`);
    } finally {
      setIsResendingAll(false);
    }
  };

  const handleTestConfirmationEmail = async () => {
    if (!confirmationEmail) {
      toast.error("Please enter an email address");
      return;
    }
    
    try {
      setIsTestingConfirmation(true);
      const result = await testConfirmationEmail(confirmationEmail);
      console.log("Test confirmation email result:", result);
      
      if (!result.success) {
        if (result.details?.errorType === 'invalid_api_key') {
          setIsAPIKeyValid(false);
        }
        toast.error(result.message);
      } else {
        setIsAPIKeyValid(true);
        toast.success("Test emails requested. Check your inbox for delivery results.");
        
        setTimeout(() => {
          toast.info("If you only received the direct test email but not the Supabase authentication email, your SMTP settings likely need updating.");
        }, 1000);
        
        setTimeout(() => {
          toast.info("Try updating your SMTP password in Authentication → Email Templates by toggling SMTP OFF then ON again.");
        }, 2000);
      }
    } catch (error: any) {
      console.error("Failed to test confirmation email:", error);
      
      if (error.message?.includes('API key is invalid')) {
        setIsAPIKeyValid(false);
        toast.error('Invalid Resend API key detected. Please update it in Supabase.');
      } else {
        toast.error(`Failed to test confirmation email: ${error.message}`);
      }
    } finally {
      setIsTestingConfirmation(false);
    }
  };

  return (
    <div className="min-h-screen bg-warcrow-background text-warcrow-text">
      <PageHeader title="Mail Management" />
      
      <div className="container mx-auto p-6">
        <div className="flex items-center mb-6">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigate('/admin')}
            className="mr-4 border-warcrow-gold/30 bg-black text-warcrow-gold hover:bg-warcrow-accent/30 hover:border-warcrow-gold/50"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold text-warcrow-gold">Mail Management</h1>
        </div>
        
        {isAPIKeyValid === false && (
          <Card className="p-6 border border-red-500 shadow-sm bg-red-900/20 mb-6">
            <h2 className="text-lg font-semibold mb-2 text-red-400">⚠️ Invalid Resend API Key Detected</h2>
            <p className="text-sm text-warcrow-text mb-4">
              Your Resend API key appears to be invalid. This will prevent email delivery.
              Please update it by following these steps:
            </p>
            <ol className="text-sm text-warcrow-text list-decimal pl-5 space-y-1 mb-4">
              <li>Go to <a href="https://resend.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-warcrow-gold underline">Resend.com API Keys</a> and generate a new API key</li>
              <li>Open your <a href="https://supabase.com/dashboard/project/odqyoncwqawdzhquxcmh/settings/functions" target="_blank" rel="noopener noreferrer" className="text-warcrow-gold underline">Supabase Edge Functions Settings</a></li>
              <li>Update the RESEND_API_KEY with your new API key</li>
              <li>Then go to <a href="https://supabase.com/dashboard/project/odqyoncwqawdzhquxcmh/auth/templates" target="_blank" rel="noopener noreferrer" className="text-warcrow-gold underline">Auth Templates</a> in Supabase</li>
              <li>Toggle OFF and back ON the "Enable Custom SMTP" setting</li>
              <li>Update the SMTP password with your new Resend API key</li>
            </ol>
            <Button 
              onClick={checkDomainStatus}
              className="w-full border-red-400 bg-red-900/30 text-red-400 hover:bg-red-900/50 hover:border-red-300"
            >
              Verify API Key Again
            </Button>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 border border-warcrow-gold/40 shadow-sm bg-black">
            <h2 className="text-lg font-semibold mb-4 text-warcrow-gold">Domain Verification Status</h2>
            <div className="space-y-2 mb-4">
              <p className="text-warcrow-text">Status: <span className={domainStatus.verified ? "text-green-400" : "text-yellow-400"}>{domainStatus.status}</span></p>
              <p className="text-warcrow-text">Verified: <span className={domainStatus.verified ? "text-green-400" : "text-yellow-400"}>{domainStatus.verified ? 'Yes' : 'No'}</span></p>
              <p className="text-warcrow-text">API Key: <span className={isAPIKeyValid === true ? "text-green-400" : isAPIKeyValid === false ? "text-red-400" : "text-yellow-400"}>{isAPIKeyValid === true ? 'Valid' : isAPIKeyValid === false ? 'Invalid' : 'Unknown'}</span></p>
            </div>
            <Button 
              onClick={checkDomainStatus} 
              className="border-warcrow-gold/30 bg-black text-warcrow-gold hover:bg-warcrow-accent/30 hover:border-warcrow-gold/50"
            >
              Check Again
            </Button>
          </Card>

          <Card className="p-6 border border-warcrow-gold/40 shadow-sm bg-black">
            <h2 className="text-lg font-semibold mb-4 text-warcrow-gold">Send Test Email</h2>
            <p className="text-sm text-warcrow-muted mb-4 text-center">
              Send a test email to verify your email configuration is working correctly.
            </p>
            <div className="space-y-4">
              <div>
                <label htmlFor="testEmail" className="block text-sm font-medium text-warcrow-text mb-1">
                  Email Address (optional)
                </label>
                <Input
                  id="testEmail"
                  type="email"
                  placeholder="Enter email address"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="w-full mb-4 bg-black border-warcrow-gold/30 text-warcrow-text"
                />
              </div>
              <Button 
                onClick={handleTestEmail}
                className="w-full border-warcrow-gold/30 bg-black text-warcrow-gold hover:bg-warcrow-accent/30 hover:border-warcrow-gold/50"
              >
                Send Test Email
              </Button>
            </div>
          </Card>

          <Card className="p-6 border border-warcrow-gold/40 shadow-sm bg-black">
            <h2 className="text-lg font-semibold mb-4 text-warcrow-gold">Test Authentication Emails</h2>
            <p className="text-sm text-warcrow-muted mb-4 text-center">
              Test Supabase's authentication email system by sending both a direct test email and 
              a Supabase authentication email. This helps diagnose SMTP configuration issues.
            </p>
            <div className="space-y-4">
              <div>
                <label htmlFor="confirmationEmail" className="block text-sm font-medium text-warcrow-text mb-1">
                  Email Address
                </label>
                <Input
                  id="confirmationEmail"
                  type="email"
                  placeholder="Enter email address"
                  value={confirmationEmail}
                  onChange={(e) => setConfirmationEmail(e.target.value)}
                  className="w-full mb-4 bg-black border-warcrow-gold/30 text-warcrow-text"
                />
              </div>
              <Button 
                onClick={handleTestConfirmationEmail}
                className="w-full border-warcrow-gold/30 bg-black text-warcrow-gold hover:bg-warcrow-accent/30 hover:border-warcrow-gold/50"
                disabled={isTestingConfirmation || !confirmationEmail}
              >
                {isTestingConfirmation ? 'Sending...' : 'Test Authentication Emails'}
              </Button>
              <div className="space-y-2 mt-4">
                <p className="text-xs text-warcrow-muted">
                  <strong>Troubleshooting:</strong> If you receive only the direct test email but not the authentication email:
                </p>
                <ol className="text-xs text-warcrow-muted list-decimal pl-5 space-y-1">
                  <li>Go to <a href="https://supabase.com/dashboard/project/odqyoncwqawdzhquxcmh/auth/templates" target="_blank" rel="noopener noreferrer" className="text-warcrow-gold underline">Supabase Auth Templates</a></li>
                  <li>Scroll down to SMTP Settings</li>
                  <li>Toggle "Enable Custom SMTP" OFF</li>
                  <li>Save changes, then toggle it back ON</li>
                  <li>Re-enter your current Resend API key as the password</li>
                  <li>Save changes and test again</li>
                </ol>
              </div>
            </div>
          </Card>

          <Card className="p-6 border border-warcrow-gold/40 shadow-sm bg-black">
            <h2 className="text-lg font-semibold mb-4 text-warcrow-gold">Resend All Pending Confirmation Emails</h2>
            <p className="text-sm text-warcrow-muted mb-4">Resend confirmation emails to all users who haven't confirmed their accounts.</p>
            <Button 
              onClick={handleResendConfirmations}
              className="border-warcrow-gold/30 bg-black text-warcrow-gold hover:bg-warcrow-accent/30 hover:border-warcrow-gold/50"
              disabled={isResendingAll}
            >
              {isResendingAll ? 'Sending...' : 'Resend Confirmations'}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Mail;
