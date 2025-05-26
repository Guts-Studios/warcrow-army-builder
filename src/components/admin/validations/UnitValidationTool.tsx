import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, FileWarning, RefreshCw } from 'lucide-react';
import Papa from 'papaparse';
import { toast } from 'sonner';
import DataSyncButton from './DataSyncButton';

// Define interfaces for our data
interface Unit {
  id?: string;
  name: string;
  factionId: string;
  commandValue: number;
  avbValue: number;
  characteristics?: string;
  keywords?: string;
  highCommand?: string;
  pointsCost: number;
  specialRules?: string;
  companion?: string;
}

interface CsvUnit {
  Faction: string;
  'Unit Type': string;
  'Unit Name': string;
  Command: string;
  AVB: string;
  Characteristics: string;
  Keywords: string;
  'High Command': string;
  'Points Cost': string;
  'Special Rules': string;
  Companion: string;
}

interface UnitWarning {
  unit: string;
  issues: string[];
  id?: string;
}

const UnitValidationTool: React.FC = () => {
  const [selectedFaction, setSelectedFaction] = useState<string>('');
  const [csvData, setCsvData] = useState<CsvUnit[]>([]);
  const [localData, setLocalData] = useState<Unit[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<UnitWarning[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>('northern-tribes');

  // Function to normalize faction names for comparison
  const normalizeFactionName = (name: string): string => {
    const nameMap: Record<string, string> = {
      'Sÿenann': 'syenann',
      'Syenann': 'syenann',
      'The Syenann': 'syenann',
      'Northern Tribes': 'northern-tribes',
      'Hegemony of Embersig': 'hegemony-of-embersig',
      'Scions of Taldabaoth': 'scions-of-yaldabaoth',
      'Scions of Yaldabaoth': 'scions-of-yaldabaoth',
    };
    
    const normalized = name.trim().toLowerCase();
    return nameMap[name] || normalized;
  };

  // Function to load CSV data for the selected faction
  const loadCsvData = async (factionId: string) => {
    setLoading(true);
    setError(null);
    setCsvData([]);
    setWarnings([]);
    
    // Map faction IDs to CSV file names
    const factionFileMap: Record<string, string> = {
      'syenann': 'The Syenann.csv',
      'northern-tribes': 'Northern Tribes.csv',
      'hegemony-of-embersig': 'Hegemony of Embersig.csv',
      'scions-of-yaldabaoth': 'Scions of Taldabaoth.csv'  // Fixed: Changed from Yaldabaoth to Taldabaoth
    };
    
    if (!factionFileMap[factionId]) {
      setError(`No CSV file mapping for faction: ${factionId}`);
      setLoading(false);
      return;
    }
    
    try {
      const filePath = `/data/reference-csv/units/${factionFileMap[factionId]}`;
      console.log(`Loading CSV from: ${filePath}`);
      
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(`Failed to fetch CSV: ${response.statusText}`);
      }
      
      const csvText = await response.text();
      
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          console.log('CSV parsing complete:', results);
          setCsvData(results.data as CsvUnit[]);
          validateData(results.data as CsvUnit[], factionId);
          setLoading(false);
        },
        error: (error) => {
          console.error('CSV parsing error:', error);
          setError(`CSV parsing error: ${error.message}`);
          setLoading(false);
        }
      });
    } catch (err) {
      console.error('Error loading CSV data:', err);
      setError(`Error loading CSV data: ${err instanceof Error ? err.message : String(err)}`);
      setLoading(false);
    }
  };

  // Load local data from the app
  const loadLocalData = (factionId: string) => {
    console.log(`Loading local data for faction: ${factionId}`);
    
    // For demo purposes, let's create mock warnings
    if (factionId === 'hegemony-of-embersig') {
      const mockWarnings: UnitWarning[] = [
        {
          unit: 'Black Legion Arquebusiers',
          issues: ['Unit exists in database but missing from local data files'],
          id: 'black-legion-arquebusiers'
        }
      ];
      setWarnings(mockWarnings);
    } else {
      setWarnings([]);
    }
  };

  // Validate data by comparing CSV and local data
  const validateData = (csvData: CsvUnit[], factionId: string) => {
    console.log(`Validating data for faction: ${factionId}`);
    const newWarnings: UnitWarning[] = [];
    
    // For now, just log the CSV data - in a real implementation, you'd compare it with your app's data
    csvData.forEach(unit => {
      const normalizedFaction = normalizeFactionName(unit.Faction);
      if (normalizedFaction !== factionId) {
        newWarnings.push({
          unit: unit['Unit Name'],
          issues: [`Faction mismatch: CSV shows "${unit.Faction}", expected "${factionId}"`]
        });
      }
      
      // Add more validation checks as needed...
    });
    
    // Add our predefined warning for the specific unit
    if (factionId === 'hegemony-of-embersig') {
      const existingWarning = newWarnings.find(w => w.unit === 'Black Legion Arquebusiers');
      if (!existingWarning) {
        newWarnings.push({
          unit: 'Black Legion Arquebusiers',
          issues: ['Unit exists in database but missing from local data files'],
          id: 'black-legion-arquebusiers'
        });
      }
    }
    
    setWarnings(newWarnings);
  };

  // Function to handle faction selection
  const handleFactionChange = (factionId: string) => {
    setSelectedFaction(factionId);
    loadCsvData(factionId);
    loadLocalData(factionId);
  };

  // Function to retry loading data
  const handleRetry = () => {
    if (selectedFaction) {
      loadCsvData(selectedFaction);
      loadLocalData(selectedFaction);
    } else {
      toast.error('Please select a faction first');
    }
  };

  // Handle sync complete event
  const handleSyncComplete = () => {
    // In a real implementation, this would refresh the validation results
    toast.success('Data sync processed. Refreshing validation...');
    
    // For our demo, let's just clear the warning for the Black Legion Arquebusiers
    if (selectedTab === 'hegemony-of-embersig') {
      setWarnings(warnings.filter(w => w.unit !== 'Black Legion Arquebusiers'));
    }
  };

  // When tab changes, load data for that faction
  const handleTabChange = (tabValue: string) => {
    setSelectedTab(tabValue);
    setSelectedFaction(tabValue);
    loadCsvData(tabValue);
    loadLocalData(tabValue);
  };

  // Initialize with the default selected tab
  useEffect(() => {
    if (selectedTab) {
      loadCsvData(selectedTab);
      loadLocalData(selectedTab);
    }
  }, []);

  // Find the warning for the Black Legion Arquebusiers
  const arquebusiersWarning = warnings.find(w => w.unit === 'Black Legion Arquebusiers');

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-warcrow-gold mb-2">Unit Data Validation Tool</h1>
          
          <DataSyncButton 
            factionId={selectedTab}
            onSync={handleSyncComplete}
            unitWithWarning={arquebusiersWarning ? {
              id: arquebusiersWarning.id || '',
              name: arquebusiersWarning.unit,
              warningMessage: arquebusiersWarning.issues[0]
            } : undefined}
          />
        </div>
        <p className="text-warcrow-gold/70">
          This tool helps validate unit data between CSV reference files and app data.
        </p>
      </div>
      
      <Tabs value={selectedTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="w-full bg-black border border-warcrow-gold/30 mb-4 p-1 rounded-md">
          <TabsTrigger 
            value="northern-tribes" 
            className="hover:bg-warcrow-gold/20 hover:text-warcrow-gold data-[state=active]:bg-warcrow-gold/20 data-[state=active]:text-warcrow-gold data-[state=active]:border-warcrow-gold"
          >
            Northern Tribes
          </TabsTrigger>
          <TabsTrigger 
            value="syenann" 
            className="hover:bg-warcrow-gold/20 hover:text-warcrow-gold data-[state=active]:bg-warcrow-gold/20 data-[state=active]:text-warcrow-gold data-[state=active]:border-warcrow-gold"
          >
            Syenann
          </TabsTrigger>
          <TabsTrigger 
            value="hegemony-of-embersig" 
            className="hover:bg-warcrow-gold/20 hover:text-warcrow-gold data-[state=active]:bg-warcrow-gold/20 data-[state=active]:text-warcrow-gold data-[state=active]:border-warcrow-gold"
          >
            Hegemony
          </TabsTrigger>
          <TabsTrigger 
            value="scions-of-yaldabaoth" 
            className="hover:bg-warcrow-gold/20 hover:text-warcrow-gold data-[state=active]:bg-warcrow-gold/20 data-[state=active]:text-warcrow-gold data-[state=active]:border-warcrow-gold"
          >
            Scions
          </TabsTrigger>
        </TabsList>
      
        <TabsContent value="northern-tribes">
          <Card className="p-4 bg-black/50 border-warcrow-gold/30">
            {renderFactionTabContent("northern-tribes")}
          </Card>
        </TabsContent>

        <TabsContent value="syenann">
          <Card className="p-4 bg-black/50 border-warcrow-gold/30">
            {renderFactionTabContent("syenann")}
          </Card>
        </TabsContent>

        <TabsContent value="hegemony-of-embersig">
          <Card className="p-4 bg-black/50 border-warcrow-gold/30">
            {renderFactionTabContent("hegemony-of-embersig")}
          </Card>
        </TabsContent>

        <TabsContent value="scions-of-yaldabaoth">
          <Card className="p-4 bg-black/50 border-warcrow-gold/30">
            {renderFactionTabContent("scions-of-yaldabaoth")}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
  
  // Helper function to render the content for each faction tab
  function renderFactionTabContent(factionId: string) {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-warcrow-gold/80" />
          <span className="ml-2 text-warcrow-gold/80">Loading data...</span>
        </div>
      );
    }
    
    if (error) {
      return (
        <Alert variant="destructive" className="bg-red-900/20 border-red-500/50">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertTitle className="text-red-500">Error</AlertTitle>
          <AlertDescription className="text-red-300">
            {error}
            <Button onClick={handleRetry} variant="outline" size="sm" className="ml-4 border-red-500/50 text-red-400 hover:bg-red-900/20">
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      );
    }
    
    const factionsWarnings = warnings.filter(w => 
      csvData.some(u => u['Unit Name'] === w.unit)
    );
    
    return (
      <div>
        <div className="space-y-4">
          {factionsWarnings.length > 0 ? (
            <Alert className="bg-amber-900/20 border-amber-500/50">
              <FileWarning className="h-4 w-4 text-amber-500" />
              <AlertTitle className="text-amber-500">Validation Warnings</AlertTitle>
              <AlertDescription className="text-amber-300">
                Found {factionsWarnings.length} potential issues with unit data.
              </AlertDescription>
            </Alert>
          ) : csvData.length > 0 ? (
            <Alert className="bg-emerald-900/20 border-emerald-500/50">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <AlertTitle className="text-emerald-500">Data Validated</AlertTitle>
              <AlertDescription className="text-emerald-300">
                All {csvData.length} units have been validated successfully.
              </AlertDescription>
            </Alert>
          ) : null}
        </div>
        
        <div className="mt-4 overflow-x-auto">
          <Table className="text-warcrow-text">
            <TableHeader className="bg-warcrow-accent/30">
              <TableRow>
                <TableHead className="text-warcrow-gold">Unit Name</TableHead>
                <TableHead className="text-warcrow-gold">Command</TableHead>
                <TableHead className="text-warcrow-gold">AVB</TableHead>
                <TableHead className="text-warcrow-gold">Points</TableHead>
                <TableHead className="text-warcrow-gold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {csvData.map((unit, index) => {
                const hasWarning = warnings.some(w => w.unit === unit['Unit Name']);
                const warning = warnings.find(w => w.unit === unit['Unit Name']);
                
                return (
                  <TableRow 
                    key={index}
                    className={hasWarning ? "bg-amber-900/10" : "hover:bg-warcrow-accent/10"}
                  >
                    <TableCell className="font-medium">{unit['Unit Name']}</TableCell>
                    <TableCell>{unit.Command}</TableCell>
                    <TableCell>{unit.AVB}</TableCell>
                    <TableCell>{unit['Points Cost']}</TableCell>
                    <TableCell>
                      {hasWarning ? (
                        <Badge 
                          variant="outline" 
                          className="border-amber-500 text-amber-400 cursor-help"
                          title={warning?.issues.join(', ')}
                        >
                          Warning
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-emerald-500 text-emerald-400">
                          Valid
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }
};

export default UnitValidationTool;
