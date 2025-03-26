
import React from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mail, ArrowLeft } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { AdminOnly } from "@/utils/adminUtils";
import { toast } from "sonner";

const Admin = () => {
  const navigate = useNavigate();
  const { isWabAdmin } = useAuth();

  React.useEffect(() => {
    // Redirect non-admin users who directly access this URL
    if (!isWabAdmin) {
      toast.error("You don't have permission to access this page");
      navigate('/');
    }
  }, [isWabAdmin, navigate]);

  return (
    <AdminOnly isWabAdmin={isWabAdmin} fallback={null}>
      <div className="min-h-screen bg-warcrow-background text-warcrow-text p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate('/')}
              className="mr-4 border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold text-warcrow-gold">Admin Dashboard</h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-black/50 border border-warcrow-gold/30 rounded-lg p-6 flex flex-col items-center">
              <h2 className="text-xl font-semibold text-warcrow-gold mb-4">Email Management</h2>
              <p className="text-sm text-gray-300 mb-4 text-center">
                Send emails and manage email templates for users
              </p>
              <Button 
                onClick={() => navigate('/mail')}
                className="w-full bg-warcrow-gold hover:bg-warcrow-gold/80 text-black font-medium transition-colors"
              >
                <Mail className="mr-2 h-4 w-4" />
                Go to Mail
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AdminOnly>
  );
};

export default Admin;
