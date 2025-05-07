
import React from 'react';
import { useNavigate } from "react-router-dom";
import { AdminOnly } from "@/utils/adminUtils";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import NetlifyDeployments from '@/components/admin/dashboard/NetlifyDeployments';

const DeploymentManagement = () => {
  const navigate = useNavigate();
  const { isWabAdmin } = useAuth();

  return (
    <AdminOnly isWabAdmin={isWabAdmin} fallback={null}>
      <div className="min-h-screen bg-warcrow-background text-warcrow-text p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/admin')}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold text-warcrow-gold">Deployment Management</h1>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-black/50 border border-warcrow-gold/30 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-warcrow-gold mb-4">Manual Deployment</h2>
              <p className="text-sm text-gray-300 mb-6">
                Trigger manual deployments or access the Netlify dashboard for advanced deployment options.
              </p>
              <Button 
                onClick={() => window.open('https://app.netlify.com', '_blank')}
                className="w-full md:w-auto bg-warcrow-gold hover:bg-warcrow-gold/80 text-black font-medium transition-colors"
              >
                Open Netlify Dashboard
              </Button>
            </div>
            
            <NetlifyDeployments />
          </div>
        </div>
      </div>
    </AdminOnly>
  );
};

export default DeploymentManagement;
