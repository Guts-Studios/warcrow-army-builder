
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { AdminOnly } from "@/utils/adminUtils";
import { toast } from "sonner";
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminTabContent from "@/components/admin/AdminTabContent";

const Admin = () => {
  const navigate = useNavigate();
  const { isWabAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

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
          <AdminNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
          <AdminTabContent activeTab={activeTab} />
        </div>
      </div>
    </AdminOnly>
  );
};

export default Admin;
