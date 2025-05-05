
import React from 'react';
import AdminDashboard from './dashboard/AdminDashboard';
import NewsManager from './NewsManager';
import { RulesVerifier } from './RulesVerifier';
import FAQTranslationManager from './FAQTranslationManager';

interface AdminTabContentProps {
  activeTab: string;
}

const AdminTabContent = ({ activeTab }: AdminTabContentProps) => {
  switch (activeTab) {
    case 'news':
      return <NewsManager />;
    case 'rules':
      return <RulesVerifier />;
    case 'faq':
      return <FAQTranslationManager />;
    case 'dashboard':
    default:
      return <AdminDashboard />;
  }
};

export default AdminTabContent;
