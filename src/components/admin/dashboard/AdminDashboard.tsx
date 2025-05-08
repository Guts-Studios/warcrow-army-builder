
import React from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mail, AlertTriangle, Code, Shield, Users, Package, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import NetlifyDeployments from './NetlifyDeployments';

const AdminDashboard = () => {
  const navigate = useNavigate();

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
          <Button 
            onClick={() => navigate('/admin', { state: { initialTab: 'users' } })}
            className="w-full bg-warcrow-gold hover:bg-warcrow-gold/80 text-black font-medium transition-colors mt-4"
          >
            <Users className="mr-2 h-4 w-4" />
            Manage Users
          </Button>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Netlify Deployments Module - Preview */}
        <NetlifyDeployments />
        
        {/* Deployment Management Link */}
        <Card className="bg-black/50 border border-warcrow-gold/30 h-full">
          <div className="p-6 flex flex-col items-center justify-between h-full">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-warcrow-gold mb-4">Deployment Management</h2>
              <p className="text-sm text-gray-300 mb-4 text-center">
                Manually trigger deployments and view complete build history
              </p>
            </div>
            <Button 
              onClick={() => navigate('/admin/deployment')}
              className="w-full bg-warcrow-gold hover:bg-warcrow-gold/80 text-black font-medium transition-colors mt-4"
            >
              <Package className="mr-2 h-4 w-4" />
              Manage Deployments
            </Button>
          </div>
        </Card>

        {/* Changelog Editor Link - NEW */}
        <Card className="bg-black/50 border border-warcrow-gold/30 h-full">
          <div className="p-6 flex flex-col items-center justify-between h-full">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-warcrow-gold mb-4">Changelog Management</h2>
              <p className="text-sm text-gray-300 mb-4 text-center">
                Edit the project changelog to document version updates and features
              </p>
            </div>
            <Button 
              onClick={() => navigate('/admin/changelog')}
              className="w-full bg-warcrow-gold hover:bg-warcrow-gold/80 text-black font-medium transition-colors mt-4"
            >
              <FileText className="mr-2 h-4 w-4" />
              Edit Changelog
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
};

export default AdminDashboard;
