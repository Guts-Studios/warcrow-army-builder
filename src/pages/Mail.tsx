import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  testResendEmail, 
  checkDomainVerificationStatus, 
  resendAllPendingConfirmationEmails, 
  updateUserWabAdminStatus, 
  getWabAdmins,
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
  const [adminList, setAdminList] = useState([]);
  const [userId, setUserId] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [confirmationEmail, setConfirmationEmail] = useState('');
  const [isResendingAll, setIsResendingAll] = useState(false);
  const [isTestingConfirmation, setIsTestingConfirmation] = useState(false);

  useEffect(() => {
    checkDomainStatus();
    fetchAdminList();
  }, []);

  const checkDomainStatus = async () => {
    try {
      const status = await checkDomainVerificationStatus();
      setDomainStatus(status);
    } catch (error: any) {
      console.error("Failed to check domain status:", error);
      toast.error(`Failed to check domain status: ${error.message}`);
      setDomainStatus({ verified: false, status: `Error: ${error.message}`, domains: [] });
    }
  };

  const fetchAdminList = async () => {
    try {
      const admins = await getWabAdmins();
      setAdminList(admins);
    } catch (error: any) {
      console.error("Failed to fetch admin list:", error);
      toast.error(`Failed to fetch admin list: ${error.message}`);
    }
  };

  const handleTestEmail = async () => {
    try {
      const emailToUse = testEmail.trim() || undefined;
      await testResendEmail(emailToUse);
      toast.success(`Test email sent successfully${emailToUse ? ` to ${emailToUse}` : ''}!`);
    } catch (error: any) {
      console.error("Failed to send test email:", error);
      toast.error(`Failed to send test email: ${error.message}`);
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
      if (!result.success) {
        toast.error(result.message);
      }
    } catch (error: any) {
      console.error("Failed to test confirmation email:", error);
      toast.error(`Failed to test confirmation email: ${error.message}`);
    } finally {
      setIsTestingConfirmation(false);
    }
  };

  const handleUpdateAdminStatus = async () => {
    if (!userId) {
      toast.error("Please enter a User ID.");
      return;
    }

    try {
      const result = await updateUserWabAdminStatus(userId, isAdmin);
      toast.success(result.message);
      fetchAdminList(); // Refresh the admin list after update
    } catch (error: any) {
      console.error("Failed to update admin status:", error);
      toast.error(`Failed to update admin status: ${error.message}`);
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 border border-warcrow-gold/40 shadow-sm bg-black">
            <h2 className="text-lg font-semibold mb-4 text-warcrow-gold">Domain Verification Status</h2>
            <div className="space-y-2 mb-4">
              <p className="text-warcrow-text">Status: <span className={domainStatus.verified ? "text-green-400" : "text-yellow-400"}>{domainStatus.status}</span></p>
              <p className="text-warcrow-text">Verified: <span className={domainStatus.verified ? "text-green-400" : "text-yellow-400"}>{domainStatus.verified ? 'Yes' : 'No'}</span></p>
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
            <p className="text-sm text-warcrow-muted mb-4">Send a test email to verify your email configuration is working correctly.</p>
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
            <h2 className="text-lg font-semibold mb-4 text-warcrow-gold">Test Confirmation Email</h2>
            <p className="text-sm text-warcrow-muted mb-4">Test Supabase's confirmation email system by sending a test confirmation email to a specific address.</p>
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
                {isTestingConfirmation ? 'Sending...' : 'Send Test Confirmation Email'}
              </Button>
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

          <Card className="p-6 border border-warcrow-gold/40 shadow-sm bg-black">
            <h2 className="text-lg font-semibold mb-4 text-warcrow-gold">Update User Admin Status</h2>
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label className="text-warcrow-text">User ID</label>
                <input
                  type="text"
                  placeholder="User ID"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="border border-warcrow-gold/30 bg-black text-warcrow-text p-2 rounded-md focus:border-warcrow-gold focus:outline-none"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isAdmin"
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                  className="rounded border-warcrow-gold/30 bg-black text-warcrow-gold focus:ring-warcrow-gold"
                />
                <label htmlFor="isAdmin" className="text-warcrow-text">Is Admin</label>
              </div>
              
              <Button 
                onClick={handleUpdateAdminStatus}
                className="w-full border-warcrow-gold/30 bg-black text-warcrow-gold hover:bg-warcrow-accent/30 hover:border-warcrow-gold/50"
              >
                Update Status
              </Button>
            </div>
          </Card>
        </div>

        <Card className="mt-6 p-6 border border-warcrow-gold/40 shadow-sm bg-black">
          <h2 className="text-lg font-semibold mb-4 text-warcrow-gold">Current Admins</h2>
          {adminList.length > 0 ? (
            <ul className="space-y-2">
              {adminList.map((admin) => (
                <li key={admin.id} className="border-b border-warcrow-gold/20 pb-2">
                  <span className="font-medium text-warcrow-gold">{admin.username}</span> 
                  <span className="text-warcrow-muted"> ({admin.email})</span> 
                  <span className="text-warcrow-muted"> - ID: {admin.id}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-warcrow-muted italic">No admins found</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Mail;
