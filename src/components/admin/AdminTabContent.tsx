
import React from 'react';
import AdminDashboard from '@/components/admin/dashboard/AdminDashboard';
import RulesVerifier from '@/components/admin/RulesVerifier';
import UserManagement from '@/components/admin/UserManagement';
import NewsManager from '@/components/admin/NewsManager';
import FAQTranslationManager from '@/components/admin/FAQTranslationManager';
import UnitDataManager from '@/components/admin/units/UnitDataManager';

interface AdminTabContentProps {
  activeTab: string;
}

const AdminTabContent = ({ activeTab }: AdminTabContentProps) => {
  return (
    <div className="py-6">
      {activeTab === 'dashboard' && <AdminDashboard />}
      {activeTab === 'rules' && <RulesVerifier />}
      {activeTab === 'faq' && <FAQTranslationManager />}
      {activeTab === 'users' && <UserManagement />}
      {activeTab === 'alerts' && <div>Admin alerts coming soon</div>}
      {activeTab === 'news' && <NewsManager />}
      {activeTab === 'units' && <UnitDataManager />}
    </div>
  );
};

export default AdminTabContent;
