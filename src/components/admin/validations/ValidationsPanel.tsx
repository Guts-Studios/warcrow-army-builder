import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileCheck, Database } from 'lucide-react';
import { Link } from 'react-router-dom';
import UnitValidationTool from './UnitValidationTool';
import DataSyncButton from './DataSyncButton';

const ValidationsPanel: React.FC = () => {
  // Add state to keep track of selected faction
  const [selectedFaction, setSelectedFaction] = useState<string>("syenann"); // Default to a faction
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CSV Validation Card */}
        <Card className="bg-black/30 border-warcrow-gold/30">
          <CardHeader>
            <CardTitle className="text-warcrow-gold flex items-center">
              <FileCheck className="mr-2 h-5 w-5" /> CSV Unit Validation
            </CardTitle>
            <CardDescription className="text-warcrow-gold/70">
              Validate unit data against reference CSV files
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-warcrow-gold/80">
              Compare unit data in the application against the reference CSV files to find discrepancies or missing units.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="border-warcrow-gold/50 text-warcrow-gold hover:bg-warcrow-gold/10">
              <Link to="/admin/validate-csv">
                Open CSV Validator
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        {/* Data Sync Card */}
        <Card className="bg-black/30 border-warcrow-gold/30">
          <CardHeader>
            <CardTitle className="text-warcrow-gold flex items-center">
              <Database className="mr-2 h-5 w-5" /> Data Synchronization
            </CardTitle>
            <CardDescription className="text-warcrow-gold/70">
              Sync unit data and configurations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-warcrow-gold/80">
              Synchronize unit data across the application and ensure consistent data handling for all factions.
            </p>
          </CardContent>
          <CardFooter>
            {/* Pass the selectedFaction to DataSyncButton */}
            <DataSyncButton factionId={selectedFaction} />
          </CardFooter>
        </Card>
      </div>
      
      {/* Unit Validation Tool */}
      <Card className="bg-black/30 border-warcrow-gold/30">
        <CardHeader>
          <CardTitle className="text-warcrow-gold">Unit Validation</CardTitle>
          <CardDescription className="text-warcrow-gold/70">
            Validate unit composition and completeness
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UnitValidationTool />
        </CardContent>
      </Card>
    </div>
  );
};

export default ValidationsPanel;
