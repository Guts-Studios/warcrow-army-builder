
import React from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';

const Activity = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-warcrow-background text-warcrow-text">
      <PageHeader title="Activity Feed">
        <LanguageSwitcher />
      </PageHeader>
      
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-warcrow-gold mb-4">Activity Feed</h2>
          <p className="text-warcrow-text/70">
            Your activity feed will appear here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Activity;
