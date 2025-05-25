
import React from 'react';
import ComprehensiveUnitValidator from '@/components/admin/validations/ComprehensiveUnitValidator';

const UnitValidationPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-warcrow-background to-black p-6">
      <div className="max-w-7xl mx-auto">
        <ComprehensiveUnitValidator />
      </div>
    </div>
  );
};

export default UnitValidationPage;
