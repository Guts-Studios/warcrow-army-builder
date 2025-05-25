
import React from 'react';
import { NavDropdown } from '@/components/ui/NavDropdown';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import { PageHeader } from '@/components/common/PageHeader';
import UnitExplorer from '@/components/stats/unit-explorer';

const UnitExplorerPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-warcrow-background">
      <PageHeader title={t('ui.unitExplorer')}>
        <LanguageSwitcher />
        <NavDropdown />
      </PageHeader>

      <div className="container mx-auto py-8 px-4 md:px-8">
        <div className="animate-fade-in">
          <UnitExplorer />
        </div>
      </div>
    </div>
  );
};

export default UnitExplorerPage;
