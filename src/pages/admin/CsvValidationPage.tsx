
import React from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { NavDropdown } from '@/components/ui/NavDropdown';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import ComprehensiveCsvValidator from '@/components/admin/validations/ComprehensiveCsvValidator';

const CsvValidationPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-warcrow-background">
      <PageHeader title="CSV Unit Validation">
        <LanguageSwitcher />
        <NavDropdown />
      </PageHeader>

      <div className="container mx-auto py-8 px-4 md:px-8">
        <div className="animate-fade-in">
          <ComprehensiveCsvValidator />
        </div>
      </div>
    </div>
  );
};

export default CsvValidationPage;
