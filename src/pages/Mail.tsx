import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  testResendEmail, 
  checkDomainVerificationStatus, 
  resendAllPendingConfirmationEmails, 
  updateUserWabAdminStatus, 
  getWabAdmins
} from "@/utils/email";

const Mail = () => {
  const [domainStatus, setDomainStatus] = useState({ verified: false, status: 'Checking...' });
  const [adminList, setAdminList] = useState([]);
  const [userId, setUserId] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

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
      await testResendEmail();
      toast.success("Test email sent successfully!");
    } catch (error: any) {
      console.error("Failed to send test email:", error);
      toast.error(`Failed to send test email: ${error.message}`);
    }
  };

  const handleResendConfirmations = async () => {
    try {
      const result = await resendAllPendingConfirmationEmails();
      toast.success(result.message);
    } catch (error: any) {
      console.error("Failed to resend confirmation emails:", error);
      toast.error(`Failed to resend confirmation emails: ${error.message}`);
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mail Management</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Domain Verification Status</h2>
        <p>Status: {domainStatus.status}</p>
        <p>Verified: {domainStatus.verified ? 'Yes' : 'No'}</p>
        <Button onClick={checkDomainStatus} className="mt-2">Check Again</Button>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Send Test Email</h2>
        <Button onClick={handleTestEmail}>Send Test Email</Button>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Resend All Pending Confirmation Emails</h2>
        <Button onClick={handleResendConfirmations}>Resend Confirmations</Button>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Update User Admin Status</h2>
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="border p-2 mr-2"
        />
        <label>
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
            className="mr-1"
          />
          Is Admin
        </label>
        <Button onClick={handleUpdateAdminStatus} className="ml-2">Update Status</Button>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Current Admins</h2>
        <ul>
          {adminList.map((admin) => (
            <li key={admin.id}>
              {admin.username} ({admin.email}) - ID: {admin.id}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Mail;
