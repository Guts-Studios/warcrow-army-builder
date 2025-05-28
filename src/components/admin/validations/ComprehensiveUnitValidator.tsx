
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UnitValidationTool from '@/components/admin/validations/UnitValidationTool';
import CsvUnitValidationPage from '@/components/admin/validations/CsvUnitValidationPage';
import CsvFileChecker from '@/components/admin/validations/CsvFileChecker';

const ComprehensiveUnitValidator: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-warcrow-gold">Unit Data Validation Suite</h1>
        <p className="text-warcrow-text/70 mt-2">
          Comprehensive tools for validating unit data consistency across different sources
        </p>
      </div>

      <Tabs defaultValue="csv-files" className="w-full">
        <TabsList className="bg-black border border-warcrow-gold/30 mb-6">
          <TabsTrigger 
            value="csv-files"
            className="data-[state=active]:bg-warcrow-accent/20 data-[state=active]:text-warcrow-gold"
          >
            CSV File Status
          </TabsTrigger>
          <TabsTrigger 
            value="csv-validation"
            className="data-[state=active]:bg-warcrow-accent/20 data-[state=active]:text-warcrow-gold"
          >
            CSV vs Static Validation
          </TabsTrigger>
          <TabsTrigger 
            value="db-validation"
            className="data-[state=active]:bg-warcrow-accent/20 data-[state=active]:text-warcrow-gold"
          >
            Database vs Static Validation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="csv-files">
          <CsvFileChecker />
        </TabsContent>

        <TabsContent value="csv-validation">
          <CsvUnitValidationPage />
        </TabsContent>

        <TabsContent value="db-validation">
          <UnitValidationTool />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComprehensiveUnitValidator;
