
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import AdminNavbar from '@/components/admin/AdminNavbar';
import AdminTabContent from '@/components/admin/AdminTabContent';
import UnitDataManager from '@/components/admin/UnitDataManager';
import ApiStatus from '@/components/admin/ApiStatus';
import FAQTranslationManager from '@/components/admin/FAQTranslationManager';
import UserManagement from '@/components/admin/UserManagement';
import NewsManager from '@/components/admin/NewsManager';
import RulesVerifier from '@/components/admin/RulesVerifier';
import AdminDashboard from '@/components/admin/dashboard/AdminDashboard';
import TranslationManagerPanel from '@/components/admin/TranslationManagerPanel';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      setIsCheckingAdmin(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/login');
          return;
        }
        
        const { data, error } = await supabase
          .from('profiles')
          .select('wab_admin')
          .eq('id', session.user.id)
          .single();
          
        if (error || !data || !data.wab_admin) {
          navigate('/');
          return;
        }
        
        setIsAdmin(true);
      } catch (error) {
        console.error('Error checking admin status:', error);
        navigate('/');
      } finally {
        setIsCheckingAdmin(false);
      }
    };
    
    checkAdminStatus();
  }, [navigate]);
  
  if (isCheckingAdmin) {
    return (
      <div className="flex items-center justify-center h-screen bg-warcrow-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-warcrow-gold"></div>
      </div>
    );
  }
  
  if (!isAdmin) {
    return null; // Redirect is handled in useEffect
  }
  
  return (
    <div className="min-h-screen bg-warcrow-background text-warcrow-text">
      <AdminNavbar />
      
      <div className="container mx-auto py-6 px-4">
        <Tabs 
          defaultValue="dashboard" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid grid-cols-4 md:grid-cols-8 mb-6">
            <TabsTrigger value="dashboard" className="text-xs md:text-sm">Dashboard</TabsTrigger>
            <TabsTrigger value="users" className="text-xs md:text-sm">Users</TabsTrigger>
            <TabsTrigger value="units" className="text-xs md:text-sm">Units</TabsTrigger>
            <TabsTrigger value="rules" className="text-xs md:text-sm">Rules</TabsTrigger>
            <TabsTrigger value="faq" className="text-xs md:text-sm">FAQ</TabsTrigger>
            <TabsTrigger value="news" className="text-xs md:text-sm">News</TabsTrigger>
            <TabsTrigger value="translation" className="text-xs md:text-sm">Translation</TabsTrigger>
            <TabsTrigger value="api" className="text-xs md:text-sm">API Status</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <AdminDashboard />
          </TabsContent>
          
          <TabsContent value="users">
            <AdminTabContent title="User Management">
              <UserManagement />
            </AdminTabContent>
          </TabsContent>
          
          <TabsContent value="units">
            <AdminTabContent title="Unit Data Management">
              <UnitDataManager />
            </AdminTabContent>
          </TabsContent>
          
          <TabsContent value="rules">
            <AdminTabContent title="Rules Management">
              <RulesVerifier />
            </AdminTabContent>
          </TabsContent>
          
          <TabsContent value="faq">
            <AdminTabContent title="FAQ Management">
              <FAQTranslationManager />
            </AdminTabContent>
          </TabsContent>
          
          <TabsContent value="news">
            <AdminTabContent title="News Management">
              <NewsManager />
            </AdminTabContent>
          </TabsContent>

          <TabsContent value="translation">
            <AdminTabContent title="Translation Management">
              <TranslationManagerPanel />
            </AdminTabContent>
          </TabsContent>
          
          <TabsContent value="api">
            <AdminTabContent title="API Status">
              <ApiStatus />
            </AdminTabContent>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
