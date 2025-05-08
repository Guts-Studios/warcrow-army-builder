
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { AdminOnly } from "@/utils/adminUtils";
import { toast } from "sonner";
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminTabContent from "@/components/admin/AdminTabContent";
import { NavDropdown } from "@/components/ui/NavDropdown";

interface LocationState {
  initialTab?: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isWabAdmin } = useAuth();
  const locationState = location.state as LocationState | null;
  const [activeTab, setActiveTab] = useState(locationState?.initialTab || 'dashboard');

  React.useEffect(() => {
    // Redirect non-admin users who directly access this URL
    if (!isWabAdmin) {
      toast.error("You don't have permission to access this page");
      navigate('/');
    }
    
    // Set active tab if provided in location state
    if (locationState?.initialTab) {
      setActiveTab(locationState.initialTab);
    }
  }, [isWabAdmin, navigate, locationState]);

  return (
    <AdminOnly isWabAdmin={isWabAdmin} fallback={null}>
      <div className="min-h-screen bg-warcrow-background text-warcrow-text p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-warcrow-gold">Admin Dashboard</h1>
            <NavDropdown />
          </div>
          <AdminNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
          <AdminTabContent activeTab={activeTab} />
        </div>
      </div>
    </AdminOnly>
  );
};

export default Admin;
