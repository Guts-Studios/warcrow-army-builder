
import React from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mail, AlertTriangle, Code, Shield, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { updateUserWabAdminStatus, getWabAdmins } from "@/utils/email/adminManagement";
import { WabAdmin } from "@/utils/email/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminList, setAdminList] = React.useState<WabAdmin[]>([]);
  const [userId, setUserId] = React.useState('');
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    // Fetch admin list when component mounts
    fetchAdminList();
  }, []);

  const fetchAdminList = async () => {
    try {
      const admins = await getWabAdmins();
      setAdminList(admins);
    } catch (error: any) {
      console.error("Failed to fetch admin list:", error);
      toast.error(`Failed to fetch admin list: ${error.message}`);
    }
  };

  const handleUpdateAdminStatus = async () => {
    if (!userId) {
      toast.error("Please enter a User ID.");
      return;
    }

    try {
      setIsLoading(true);
      const result = await updateUserWabAdminStatus(userId, isAdmin);
      toast.success(result.message);
      fetchAdminList(); // Refresh the admin list after update
    } catch (error: any) {
      console.error("Failed to update admin status:", error);
      toast.error(`Failed to update admin status: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-black/50 border border-warcrow-gold/30 rounded-lg p-6 flex flex-col items-center justify-between h-full">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-warcrow-gold mb-4">Email Management</h2>
            <p className="text-sm text-gray-300 mb-4 text-center">
              Send emails and manage email templates for users
            </p>
          </div>
          <Button 
            onClick={() => navigate('/mail')}
            className="w-full bg-warcrow-gold hover:bg-warcrow-gold/80 text-black font-medium transition-colors mt-4"
          >
            <Mail className="mr-2 h-4 w-4" />
            Go to Mail
          </Button>
        </div>
        
        <div className="bg-black/50 border border-warcrow-gold/30 rounded-lg p-6 flex flex-col items-center justify-between h-full">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-warcrow-gold mb-4">Admin Alerts</h2>
            <p className="text-sm text-gray-300 mb-4 text-center">
              Send alert notifications to administrators
            </p>
          </div>
          <Button 
            onClick={() => navigate('/admin/alerts')}
            className="w-full bg-warcrow-gold hover:bg-warcrow-gold/80 text-black font-medium transition-colors mt-4"
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            Manage Alerts
          </Button>
        </div>
        
        <div className="bg-black/50 border border-warcrow-gold/30 rounded-lg p-6 flex flex-col items-center justify-between h-full">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-warcrow-gold mb-4">User Management</h2>
            <p className="text-sm text-gray-300 mb-4 text-center">
              Manage user permissions and admin status
            </p>
          </div>
          <div className="w-full text-center">
            <Shield className="h-5 w-5 mx-auto mb-2 text-warcrow-gold/80" />
          </div>
        </div>
        
        <div className="bg-black/50 border border-warcrow-gold/30 rounded-lg p-6 flex flex-col items-center justify-between h-full">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-warcrow-gold mb-4">Developer Tools</h2>
            <p className="text-sm text-gray-300 mb-4 text-center">
              Advanced options for system configuration
            </p>
          </div>
          <Button 
            onClick={() => navigate('/admin/dev-options')}
            className="w-full bg-warcrow-gold hover:bg-warcrow-gold/80 text-black font-medium transition-colors mt-4"
          >
            <Code className="mr-2 h-4 w-4" />
            Developer Options
          </Button>
        </div>
      </div>

      {/* Admin User Management Section */}
      <Card className="p-6 border border-warcrow-gold/40 shadow-sm bg-black mb-6">
        <h2 className="text-lg font-semibold mb-4 text-warcrow-gold flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Update User Admin Status
        </h2>
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="text-warcrow-text">User ID</label>
            <Input
              type="text"
              placeholder="User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="border border-warcrow-gold/30 bg-black text-warcrow-text focus:border-warcrow-gold focus:outline-none"
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
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update Status'}
          </Button>
        </div>
      </Card>

      {/* Current Admins Section */}
      <Card className="p-6 border border-warcrow-gold/40 shadow-sm bg-black">
        <h2 className="text-lg font-semibold mb-4 text-warcrow-gold">Current Admins</h2>
        {adminList.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow className="border-warcrow-gold/20">
                <TableHead className="text-warcrow-gold/80">Username</TableHead>
                <TableHead className="text-warcrow-gold/80">Email</TableHead>
                <TableHead className="text-warcrow-gold/80">ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adminList.map((admin) => (
                <TableRow key={admin.id} className="border-warcrow-gold/20">
                  <TableCell className="font-medium text-warcrow-gold">{admin.username}</TableCell>
                  <TableCell className="text-warcrow-muted">{admin.email}</TableCell>
                  <TableCell className="text-warcrow-muted truncate max-w-[120px]">{admin.id}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-warcrow-muted italic">No admins found</p>
        )}
      </Card>
    </>
  );
};

export default AdminDashboard;
