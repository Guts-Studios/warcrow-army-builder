
import React from 'react';
import AdminDashboard from './dashboard/AdminDashboard';
import { RulesVerifier } from '../admin/RulesVerifier';
import FAQTranslationManager from './FAQTranslationManager';
import UserManagement from './UserManagement';
import { NewsManager } from './NewsManager';
import { DeepLTest } from './rules/DeepLTest';
import ApiStatus from './ApiStatus';

interface AdminTabContentProps {
  activeTab: string;
}

const AdminTabContent: React.FC<AdminTabContentProps> = ({ activeTab }) => {
  // Add console logging to help with debugging
  console.log('AdminTabContent rendering with activeTab:', activeTab);
  
  return (
    <div className="mt-6">
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <AdminDashboard />
          <ApiStatus />
        </div>
      )}
      {activeTab === 'rules' && <RulesVerifier />}
      {activeTab === 'faq' && <FAQTranslationManager />}
      {activeTab === 'users' && <UserManagement />}
      {activeTab === 'news' && <NewsManager />}
      {activeTab === 'translations' && (
        <div className="space-y-6">
          <DeepLTest />
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-warcrow-gold mb-4">Translation Tools</h2>
            <p className="text-warcrow-text/80">
              These tools help you manage translations for the entire application. 
              You can test the DeepL API integration above, and also verify the Rules and FAQ translations.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTabContent;
