import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '@/components/admin/AdminNavbar';
import AdminTabContent from '@/components/admin/AdminTabContent';
import ApiStatus from '@/components/admin/ApiStatus';
import FAQTranslationManager from '@/components/admin/FAQTranslationManager';
import UserManagement from '@/components/admin/UserManagement';
import NewsManager from '@/components/admin/NewsManager';
import RulesVerifier from '@/components/admin/RulesVerifier';
import AdminDashboard from '@/components/admin/dashboard/AdminDashboard';
import TranslationManagerPanel from '@/components/admin/TranslationManagerPanel';
import UnitImagesManager from '@/components/admin/units/UnitImagesManager';
import ValidationsPanel from '@/components/admin/validations/ValidationsPanel';
import DebugPanel from '@/components/admin/DebugPanel';
import CsvSyncManager from '@/components/admin/CsvSyncManager';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Home, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { useEnsureDefaultFactions } from '@/hooks/useEnsureDefaultFactions';
import FactionManager from '@/components/admin/units/FactionManager';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { isAuthenticated, isWabAdmin, isLoading } = useAuth();
  
  // Use our hook to ensure default factions exist
  useEnsureDefaultFactions();
  
  useEffect(() => {
    // Don't redirect while authentication is still loading
    if (isLoading) {
      console.log("Admin page: Auth still loading, waiting...");
      return;
    }

    const checkAdminAccess = () => {
      console.log("Admin page: Checking access with:", {
        isAuthenticated,
        isWabAdmin,
        isLoading
      });

      // ACCESS CONTROL: Only allow access if user is authenticated AND has admin privileges
      const hasAccess = isAuthenticated === true && isWabAdmin === true;
      
      if (!hasAccess) {
        console.log("Admin page: Access denied, user is not authenticated admin");
        return;
      }
      
      console.log("Admin page: Access granted");
    };
    
    checkAdminAccess();
  }, [navigate, isAuthenticated, isWabAdmin, isLoading]);
  
  // Show loading spinner while authentication is being determined
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-warcrow-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-warcrow-gold mx-auto"></div>
          <p className="text-warcrow-gold">Checking admin access...</p>
        </div>
      </div>
    );
  }
  
  // If user is not authenticated or not an admin, show access denied
  if (isAuthenticated !== true || !isWabAdmin) {
    return (
      <div className="min-h-screen bg-warcrow-background text-warcrow-text flex items-center justify-center">
        <div className="max-w-md mx-auto text-center space-y-6">
          <Alert variant="destructive" className="bg-red-900/50 border-red-600">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-red-200">
              Access Denied: Administrator privileges required
            </AlertDescription>
          </Alert>
          
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-warcrow-gold">Restricted Area</h1>
            <p className="text-warcrow-text/80">
              You need to be logged in with administrator privileges to access this page.
            </p>
            
            <div className="flex gap-4 justify-center">
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="border-warcrow-gold/50 text-warcrow-gold hover:bg-warcrow-gold/10"
              >
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
              
              {isAuthenticated !== true && (
                <Button
                  variant="gold"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Show admin content only for authenticated admins
  return (
    <div className="min-h-screen bg-warcrow-background text-warcrow-text">
      {/* Main navigation bar */}
      <div className="bg-black/70 border-b border-warcrow-gold/30 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
              className="border-warcrow-gold/50 text-warcrow-gold hover:bg-warcrow-gold/10"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              {t('backToSite')}
            </Button>
            <h1 className="text-xl font-bold text-warcrow-gold">Admin Panel</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
              className="border-warcrow-gold/50 text-warcrow-gold hover:bg-warcrow-gold/10"
            >
              <Home className="h-4 w-4 mr-2" />
              {t('home')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/builder')}
              className="border-warcrow-gold/50 text-warcrow-gold hover:bg-warcrow-gold/10"
            >
              {t('builder')}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-6 px-4">
        <AdminNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          
          <TabsContent value="dashboard">
            <AdminTabContent title="Dashboard">
              <AdminDashboard />
            </AdminTabContent>
          </TabsContent>
          
          <TabsContent value="users">
            <AdminTabContent title="User Management">
              <UserManagement />
            </AdminTabContent>
          </TabsContent>
          
          <TabsContent value="validations">
            <AdminTabContent title="Data Validations">
              <ValidationsPanel />
            </AdminTabContent>
          </TabsContent>
          
          <TabsContent value="csv-sync">
            <AdminTabContent title="CSV Synchronization Manager">
              <CsvSyncManager />
            </AdminTabContent>
          </TabsContent>
          
          <TabsContent value="unit-images">
            <AdminTabContent title="Unit Images">
              <UnitImagesManager />
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
          
          <TabsContent value="factions">
            <AdminTabContent title="Faction Management">
              <FactionManager />
            </AdminTabContent>
          </TabsContent>
          
          <TabsContent value="debug">
            <AdminTabContent title="Debug Tools">
              <DebugPanel />
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
