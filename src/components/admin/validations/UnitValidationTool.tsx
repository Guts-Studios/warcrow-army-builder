
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import Papa from 'papaparse';
import { ChevronDown, Search, RefreshCw, AlertCircle } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Alert, AlertDescription } from '@/components/ui/alert';

// Type definitions for comparison results
interface ValidationResult {
  inStaticOnly: UnitComparison[];
  inDatabaseOnly: UnitComparison[];
  missingHighCommand: UnitComparison[];
  nameMismatches: UnitNameMismatch[];
  pointsMismatches: UnitPointsMismatch[];
  keywordMismatches: UnitKeywordMismatch[];
  specialRuleMismatches: UnitSpecialRuleMismatch[];
}

interface UnitComparison {
  faction: string;
  unitName: string;
  staticPath?: string;
}

interface UnitNameMismatch {
  faction: string;
  csvName: string;
  staticName: string;
}

interface UnitPointsMismatch {
  faction: string;
  unitName: string;
  csvPoints: number;
  staticPoints: number;
}

interface UnitKeywordMismatch {
  faction: string;
  unitName: string;
  csvKeywords: string[];
  staticKeywords: string[];
}

interface UnitSpecialRuleMismatch {
  faction: string;
  unitName: string;
  csvSpecialRules: string[];
  staticSpecialRules: string[];
}

// CSV Unit structure
interface CSVUnit {
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

// Static data unit structure
interface StaticUnit {
  name: string;
  faction: string;
  command: number;
  avbLevel: number;
  characteristics: string[];
  keywords: string[];
  specialRules: string[];
  highCommand: boolean;
  pointsCost: number;
  companion?: string;
}

const UnitValidationTool: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFaction, setSelectedFaction] = useState<string | null>(null);
  const [availableFactions, setAvailableFactions] = useState<string[]>([]);
  const [csvFiles, setCsvFiles] = useState<Record<string, CSVUnit[]>>({});
  const [staticData, setStaticData] = useState<Record<string, StaticUnit[]>>({});
  const [validationResults, setValidationResults] = useState<ValidationResult | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState('discrepancies');

  // Load data when component mounts
  useEffect(() => {
    loadFactions();
  }, []);

  // Load available factions from CSV directory
  const loadFactions = async () => {
    setIsLoading(true);
    try {
      // In a real environment, we would fetch this list from the server
      // For now, we'll hardcode the factions we know exist in the /data/reference-csv/units directory
      const factions = [
        'The Syenann',
        'Northern Tribes',
        'Hegemony of Embersig',
        'Scions of Taldabaoth'
      ];
      
      setAvailableFactions(factions);
      console.log('Available factions:', factions);
      
      // Load all CSV files
      for (const faction of factions) {
        await loadCsvFile(faction);
      }
      
      // Load static data for all factions
      await loadStaticData();
      
    } catch (error) {
      console.error('Error loading factions:', error);
      toast.error('Failed to load factions');
    } finally {
      setIsLoading(false);
    }
  };

  // Normalize faction name for consistent comparison
  const normalizeFactionName = (name: string): string => {
    const nameMap: Record<string, string> = {
      'The Syenann': 'syenann',
      'Sÿenann': 'syenann',
      'Northern Tribes': 'northern-tribes',
      'Hegemony of Embersig': 'hegemony-of-embersig',
      'hegemony of Embersig': 'hegemony-of-embersig',
      'Scions of Taldabaoth': 'scions-of-yaldabaoth',
      'Scions of Yaldabaoth': 'scions-of-yaldabaoth'
    };
    
    return nameMap[name] || name.toLowerCase().replace(/\s+/g, '-');
  };

  // Load CSV file for a specific faction
  const loadCsvFile = async (faction: string) => {
    try {
      console.log(`Loading CSV for faction: ${faction}`);
      const csvPath = `/data/reference-csv/units/${faction}.csv`;
      
      const response = await fetch(csvPath);
      if (!response.ok) {
        throw new Error(`Failed to fetch CSV file: ${response.statusText}`);
      }
      
      const csvText = await response.text();
      const result = Papa.parse<CSVUnit>(csvText, {
        header: true,
        skipEmptyLines: true
      });
      
      console.log(`Parsed ${result.data.length} units from ${faction} CSV`);
      
      setCsvFiles(prev => ({
        ...prev,
        [normalizeFactionName(faction)]: result.data
      }));
      
    } catch (error) {
      console.error(`Error loading CSV for ${faction}:`, error);
      toast.error(`Failed to load CSV for ${faction}`);
    }
  };

  // Load static data from the application
  const loadStaticData = async () => {
    try {
      // This would normally load data from the app's static files
      // For now, let's simulate importing the faction data

      // Import Northern Tribes data
      const northernTribesModule = await import('@/data/factions/northern-tribes');
      const northernTribesUnits = Object.values(northernTribesModule)
        .filter(value => typeof value === 'object' && value !== null)
        .flatMap(value => Object.values(value))
        .filter(item => typeof item === 'object' && item !== null && 'name' in item)
        .map(item => ({
          name: item.name,
          faction: 'northern-tribes',
          command: item.command || 0,
          avbLevel: item.avbLevel || 1,
          characteristics: Array.isArray(item.characteristics) ? item.characteristics : [],
          keywords: Array.isArray(item.keywords) ? item.keywords.map(k => typeof k === 'string' ? k : k.toString()) : [],
          specialRules: Array.isArray(item.specialRules) ? item.specialRules : [],
          highCommand: !!item.highCommand,
          pointsCost: item.pointsCost || 0,
          companion: item.companion
        }));

      // Import Syenann data
      const syenannModule = await import('@/data/factions/syenann');
      const syenannUnits = Object.values(syenannModule)
        .filter(value => typeof value === 'object' && value !== null)
        .flatMap(value => Object.values(value))
        .filter(item => typeof item === 'object' && item !== null && 'name' in item)
        .map(item => ({
          name: item.name,
          faction: 'syenann',
          command: item.command || 0,
          avbLevel: item.avbLevel || 1,
          characteristics: Array.isArray(item.characteristics) ? item.characteristics : [],
          keywords: Array.isArray(item.keywords) ? item.keywords.map(k => typeof k === 'string' ? k : k.toString()) : [],
          specialRules: Array.isArray(item.specialRules) ? item.specialRules : [],
          highCommand: !!item.highCommand,
          pointsCost: item.pointsCost || 0,
          companion: item.companion
        }));

      // Import Hegemony data
      const hegemonyModule = await import('@/data/factions/hegemony-of-embersig');
      const hegemonyUnits = Object.values(hegemonyModule)
        .filter(value => typeof value === 'object' && value !== null)
        .flatMap(value => Object.values(value))
        .filter(item => typeof item === 'object' && item !== null && 'name' in item)
        .map(item => ({
          name: item.name,
          faction: 'hegemony-of-embersig',
          command: item.command || 0,
          avbLevel: item.avbLevel || 1,
          characteristics: Array.isArray(item.characteristics) ? item.characteristics : [],
          keywords: Array.isArray(item.keywords) ? item.keywords.map(k => typeof k === 'string' ? k : k.toString()) : [],
          specialRules: Array.isArray(item.specialRules) ? item.specialRules : [],
          highCommand: !!item.highCommand,
          pointsCost: item.pointsCost || 0,
          companion: item.companion
        }));

      // Import Scions data
      const scionsModule = await import('@/data/factions/scions-of-yaldabaoth');
      const scionsUnits = Object.values(scionsModule)
        .filter(value => typeof value === 'object' && value !== null)
        .flatMap(value => Object.values(value))
        .filter(item => typeof item === 'object' && item !== null && 'name' in item)
        .map(item => ({
          name: item.name,
          faction: 'scions-of-yaldabaoth',
          command: item.command || 0,
          avbLevel: item.avbLevel || 1,
          characteristics: Array.isArray(item.characteristics) ? item.characteristics : [],
          keywords: Array.isArray(item.keywords) ? item.keywords.map(k => typeof k === 'string' ? k : k.toString()) : [],
          specialRules: Array.isArray(item.specialRules) ? item.specialRules : [],
          highCommand: !!item.highCommand,
          pointsCost: item.pointsCost || 0,
          companion: item.companion
        }));

      const allStaticData: Record<string, StaticUnit[]> = {
        'northern-tribes': northernTribesUnits,
        'syenann': syenannUnits,
        'hegemony-of-embersig': hegemonyUnits,
        'scions-of-yaldabaoth': scionsUnits
      };

      console.log('Loaded static data:', allStaticData);
      setStaticData(allStaticData);

    } catch (error) {
      console.error('Error loading static data:', error);
      toast.error('Failed to load static data');
    }
  };

  // Compare CSV data with static data
  const compareData = () => {
    setIsComparing(true);
    
    try {
      const inStaticOnly: UnitComparison[] = [];
      const inDatabaseOnly: UnitComparison[] = [];
      const missingHighCommand: UnitComparison[] = [];
      const nameMismatches: UnitNameMismatch[] = [];
      const pointsMismatches: UnitPointsMismatch[] = [];
      const keywordMismatches: UnitKeywordMismatch[] = [];
      const specialRuleMismatches: UnitSpecialRuleMismatch[] = [];
      
      // Process each faction
      Object.entries(csvFiles).forEach(([factionKey, csvUnits]) => {
        const staticUnits = staticData[factionKey] || [];
        
        console.log(`Comparing ${factionKey}: ${csvUnits.length} CSV units vs ${staticUnits.length} static units`);
        
        // Check for units in CSV but not in static data
        csvUnits.forEach(csvUnit => {
          const csvUnitName = csvUnit['Unit Name'].trim();
          const csvPoints = parseInt(csvUnit['Points Cost'], 10);
          const csvHighCommand = csvUnit['High Command'].toLowerCase() === 'yes';
          const csvKeywords = csvUnit['Keywords'].split(',').map(k => k.trim()).filter(Boolean);
          const csvSpecialRules = csvUnit['Special Rules'].split(',').map(r => r.trim()).filter(Boolean);
          
          // Try to find matching unit in static data
          const staticUnit = staticUnits.find(unit => {
            // Try exact match first
            if (unit.name.toLowerCase() === csvUnitName.toLowerCase()) {
              return true;
            }
            
            // Try normalized match (remove special chars, normalize spaces)
            const normalizedStaticName = unit.name.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
            const normalizedCsvName = csvUnitName.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
            
            return normalizedStaticName === normalizedCsvName;
          });
          
          if (!staticUnit) {
            // Unit in CSV but not in static data
            inDatabaseOnly.push({
              faction: factionKey,
              unitName: csvUnitName
            });
            return;
          }
          
          // Check for name mismatches (if we found by normalized name)
          if (staticUnit.name.toLowerCase() !== csvUnitName.toLowerCase()) {
            nameMismatches.push({
              faction: factionKey,
              csvName: csvUnitName,
              staticName: staticUnit.name
            });
          }
          
          // Check for points cost mismatches
          if (csvPoints !== staticUnit.pointsCost) {
            pointsMismatches.push({
              faction: factionKey,
              unitName: csvUnitName,
              csvPoints: csvPoints,
              staticPoints: staticUnit.pointsCost
            });
          }
          
          // Check for high command status mismatches
          if (csvHighCommand && !staticUnit.highCommand) {
            missingHighCommand.push({
              faction: factionKey,
              unitName: csvUnitName
            });
          }
          
          // Check for keyword mismatches
          const staticKeywords = staticUnit.keywords.map(k => k.toLowerCase());
          const normalizedCsvKeywords = csvKeywords.map(k => k.toLowerCase());
          
          if (!arraysMatchIgnoreCase(normalizedCsvKeywords, staticKeywords)) {
            keywordMismatches.push({
              faction: factionKey,
              unitName: csvUnitName,
              csvKeywords: normalizedCsvKeywords,
              staticKeywords: staticKeywords
            });
          }
          
          // Check for special rules mismatches
          const staticSpecialRules = staticUnit.specialRules.map(r => r.toLowerCase());
          const normalizedCsvSpecialRules = csvSpecialRules.map(r => r.toLowerCase());
          
          if (!arraysMatchIgnoreCase(normalizedCsvSpecialRules, staticSpecialRules)) {
            specialRuleMismatches.push({
              faction: factionKey,
              unitName: csvUnitName,
              csvSpecialRules: normalizedCsvSpecialRules,
              staticSpecialRules: staticSpecialRules
            });
          }
        });
        
        // Check for units in static data but not in CSV
        staticUnits.forEach(staticUnit => {
          const foundInCsv = csvUnits.some(csvUnit => {
            const csvUnitName = csvUnit['Unit Name'].trim();
            return staticUnit.name.toLowerCase() === csvUnitName.toLowerCase() ||
                  staticUnit.name.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim() === 
                  csvUnitName.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
          });
          
          if (!foundInCsv) {
            inStaticOnly.push({
              faction: factionKey,
              unitName: staticUnit.name,
              staticPath: `data/factions/${factionKey}.ts`
            });
          }
        });
      });
      
      // Set validation results
      setValidationResults({
        inStaticOnly,
        inDatabaseOnly,
        missingHighCommand,
        nameMismatches,
        pointsMismatches,
        keywordMismatches,
        specialRuleMismatches
      });
      
      console.log('Validation results:', {
        inStaticOnly,
        inDatabaseOnly,
        missingHighCommand,
        nameMismatches,
        pointsMismatches,
        keywordMismatches,
        specialRuleMismatches
      });
      
      if (
        inStaticOnly.length === 0 && 
        inDatabaseOnly.length === 0 && 
        missingHighCommand.length === 0 && 
        nameMismatches.length === 0 && 
        pointsMismatches.length === 0 &&
        keywordMismatches.length === 0 &&
        specialRuleMismatches.length === 0
      ) {
        toast.success('No discrepancies found between CSV and static data');
      } else {
        toast.info('Finished comparing data - found discrepancies');
      }
      
    } catch (error) {
      console.error('Error comparing data:', error);
      toast.error('Failed to compare data');
    } finally {
      setIsComparing(false);
    }
  };

  // Helper function to compare arrays ignoring case and order
  const arraysMatchIgnoreCase = (arr1: string[], arr2: string[]): boolean => {
    if (arr1.length !== arr2.length) return false;
    
    const sortedArr1 = [...arr1].sort();
    const sortedArr2 = [...arr2].sort();
    
    for (let i = 0; i < sortedArr1.length; i++) {
      if (sortedArr1[i].toLowerCase() !== sortedArr2[i].toLowerCase()) {
        return false;
      }
    }
    
    return true;
  };

  // Sync data from CSV to local files
  const syncFromCsv = () => {
    // This would update the static data files based on CSV data
    // In a real implementation, this would write to actual files
    toast.info('Syncing would update local unit data files with CSV data');
    setIsSyncing(true);
    
    setTimeout(() => {
      toast.success('Sync operation would be completed here');
      setIsSyncing(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-black/50 border-warcrow-gold/30">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-warcrow-gold mb-4">Unit Data Validation</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <Select 
              value={selectedFaction || undefined} 
              onValueChange={(value) => setSelectedFaction(value || null)}
            >
              <SelectTrigger className="bg-black/70 border-warcrow-gold/30 text-warcrow-gold">
                <SelectValue placeholder="All Factions" />
              </SelectTrigger>
              <SelectContent className="bg-black border-warcrow-gold/30">
                <SelectItem value="all-factions">All Factions</SelectItem>
                {availableFactions.map(faction => (
                  <SelectItem key={faction} value={normalizeFactionName(faction)}>
                    {faction}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="border-warcrow-gold/50 text-warcrow-gold hover:bg-warcrow-gold/10 flex-1"
                onClick={compareData}
                disabled={isComparing || isLoading}
              >
                {isComparing ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Comparing...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Compare Data
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                className="border-warcrow-gold/50 text-warcrow-gold hover:bg-warcrow-gold/10 flex-1"
                onClick={syncFromCsv}
                disabled={isSyncing || isComparing || isLoading}
              >
                {isSyncing ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Sync From CSV
                  </>
                )}
              </Button>
            </div>
          </div>

          {validationResults && (
            <Tabs 
              defaultValue="discrepancies" 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="bg-warcrow-accent/20 mb-6 grid grid-cols-5 h-auto p-0">
                <TabsTrigger 
                  value="discrepancies" 
                  className="text-warcrow-gold/80 data-[state=active]:bg-warcrow-gold/20 data-[state=active]:text-warcrow-gold py-2"
                >
                  Discrepancies
                </TabsTrigger>
                <TabsTrigger 
                  value="missing" 
                  className="text-warcrow-gold/80 data-[state=active]:bg-warcrow-gold/20 data-[state=active]:text-warcrow-gold py-2"
                >
                  Missing Units
                </TabsTrigger>
                <TabsTrigger 
                  value="names" 
                  className="text-warcrow-gold/80 data-[state=active]:bg-warcrow-gold/20 data-[state=active]:text-warcrow-gold py-2"
                >
                  Name Mismatches
                </TabsTrigger>
                <TabsTrigger 
                  value="points" 
                  className="text-warcrow-gold/80 data-[state=active]:bg-warcrow-gold/20 data-[state=active]:text-warcrow-gold py-2"
                >
                  Points Mismatches
                </TabsTrigger>
                <TabsTrigger 
                  value="keywords" 
                  className="text-warcrow-gold/80 data-[state=active]:bg-warcrow-gold/20 data-[state=active]:text-warcrow-gold py-2"
                >
                  Keyword Mismatches
                </TabsTrigger>
              </TabsList>

              <TabsContent value="discrepancies">
                <ValidationSummary validationResults={validationResults} />
              </TabsContent>
              
              <TabsContent value="missing">
                <MissingUnitsTable 
                  inStaticOnly={validationResults.inStaticOnly}
                  inDatabaseOnly={validationResults.inDatabaseOnly}
                  missingHighCommand={validationResults.missingHighCommand}
                  selectedFaction={selectedFaction}
                />
              </TabsContent>
              
              <TabsContent value="names">
                <NameMismatchesTable 
                  nameMismatches={validationResults.nameMismatches}
                  selectedFaction={selectedFaction}
                />
              </TabsContent>
              
              <TabsContent value="points">
                <PointsMismatchesTable 
                  pointsMismatches={validationResults.pointsMismatches}
                  selectedFaction={selectedFaction}
                />
              </TabsContent>
              
              <TabsContent value="keywords">
                <KeywordMismatchesTable 
                  keywordMismatches={validationResults.keywordMismatches}
                  specialRuleMismatches={validationResults.specialRuleMismatches}
                  selectedFaction={selectedFaction}
                />
              </TabsContent>
            </Tabs>
          )}
          
          {isLoading && (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-warcrow-gold" />
            </div>
          )}
          
          {!validationResults && !isLoading && (
            <Alert className="bg-warcrow-accent/20 border-warcrow-gold/30">
              <AlertCircle className="h-4 w-4 text-warcrow-gold" />
              <AlertDescription className="text-warcrow-gold/70">
                Click "Compare Data" to validate unit data between CSV files and static files.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Component to display validation summary
const ValidationSummary: React.FC<{ validationResults: ValidationResult }> = ({ validationResults }) => {
  const totalIssues = 
    validationResults.inStaticOnly.length + 
    validationResults.inDatabaseOnly.length + 
    validationResults.missingHighCommand.length +
    validationResults.nameMismatches.length +
    validationResults.pointsMismatches.length +
    validationResults.keywordMismatches.length +
    validationResults.specialRuleMismatches.length;
    
  const hasIssues = totalIssues > 0;
  
  return (
    <div className="space-y-4">
      <Alert className={`${hasIssues ? 'bg-red-950/20' : 'bg-green-950/20'} border-${hasIssues ? 'red' : 'green'}-500/30`}>
        <AlertCircle className={`h-4 w-4 text-${hasIssues ? 'red' : 'green'}-500`} />
        <AlertDescription className={`text-${hasIssues ? 'red' : 'green'}-500`}>
          {hasIssues 
            ? `Found ${totalIssues} discrepancies between CSV and static data` 
            : 'All data is in sync! No discrepancies found.'}
        </AlertDescription>
      </Alert>

      {hasIssues && (
        <Collapsible className="space-y-2">
          <CollapsibleTrigger className="flex w-full justify-between items-center p-2 bg-black/70 border border-warcrow-gold/30 rounded-lg">
            <span className="text-warcrow-gold">Discrepancy Summary</span>
            <ChevronDown className="h-4 w-4 text-warcrow-gold transition-transform ui-open:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent className="bg-black/50 border border-warcrow-gold/20 rounded-lg p-4 space-y-2">
            <p className="text-warcrow-gold/80 text-sm">
              Units in static data only: <span className="text-warcrow-gold">{validationResults.inStaticOnly.length}</span>
            </p>
            <p className="text-warcrow-gold/80 text-sm">
              Units in CSV only: <span className="text-warcrow-gold">{validationResults.inDatabaseOnly.length}</span>
            </p>
            <p className="text-warcrow-gold/80 text-sm">
              Missing High Command: <span className="text-warcrow-gold">{validationResults.missingHighCommand.length}</span>
            </p>
            <p className="text-warcrow-gold/80 text-sm">
              Name mismatches: <span className="text-warcrow-gold">{validationResults.nameMismatches.length}</span>
            </p>
            <p className="text-warcrow-gold/80 text-sm">
              Points mismatches: <span className="text-warcrow-gold">{validationResults.pointsMismatches.length}</span>
            </p>
            <p className="text-warcrow-gold/80 text-sm">
              Keyword mismatches: <span className="text-warcrow-gold">{validationResults.keywordMismatches.length}</span>
            </p>
            <p className="text-warcrow-gold/80 text-sm">
              Special rule mismatches: <span className="text-warcrow-gold">{validationResults.specialRuleMismatches.length}</span>
            </p>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
};

// Component to display missing units
const MissingUnitsTable: React.FC<{ 
  inStaticOnly: UnitComparison[];
  inDatabaseOnly: UnitComparison[];
  missingHighCommand: UnitComparison[];
  selectedFaction: string | null;
}> = ({ inStaticOnly, inDatabaseOnly, missingHighCommand, selectedFaction }) => {
  // Filter by selected faction if any
  const filteredStaticOnly = selectedFaction && selectedFaction !== "all-factions"
    ? inStaticOnly.filter(unit => unit.faction === selectedFaction)
    : inStaticOnly;
    
  const filteredDatabaseOnly = selectedFaction && selectedFaction !== "all-factions"
    ? inDatabaseOnly.filter(unit => unit.faction === selectedFaction)
    : inDatabaseOnly;
    
  const filteredMissingHighCommand = selectedFaction && selectedFaction !== "all-factions"
    ? missingHighCommand.filter(unit => unit.faction === selectedFaction)
    : missingHighCommand;
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-warcrow-gold/90">
        Units in Static Files Only
      </h3>
      
      {filteredStaticOnly.length === 0 ? (
        <p className="text-warcrow-gold/70">No units found in static data only</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-black/50">
              <TableHead>Faction</TableHead>
              <TableHead>Unit Name</TableHead>
              <TableHead>Path</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStaticOnly.map((unit, index) => (
              <TableRow key={`static-${index}`} className="hover:bg-black/50">
                <TableCell className="text-warcrow-gold/80">{unit.faction}</TableCell>
                <TableCell className="text-warcrow-gold/80">{unit.unitName}</TableCell>
                <TableCell className="text-warcrow-gold/80">{unit.staticPath}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      
      <Separator className="bg-warcrow-gold/20 my-4" />
      
      <h3 className="text-lg font-medium text-warcrow-gold/90">
        Units in CSV Files Only
      </h3>
      
      {filteredDatabaseOnly.length === 0 ? (
        <p className="text-warcrow-gold/70">No units found in CSV data only</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-black/50">
              <TableHead>Faction</TableHead>
              <TableHead>Unit Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDatabaseOnly.map((unit, index) => (
              <TableRow key={`db-${index}`} className="hover:bg-black/50">
                <TableCell className="text-warcrow-gold/80">{unit.faction}</TableCell>
                <TableCell className="text-warcrow-gold/80">{unit.unitName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      
      <Separator className="bg-warcrow-gold/20 my-4" />
      
      <h3 className="text-lg font-medium text-warcrow-gold/90">
        Missing High Command Status
      </h3>
      
      {filteredMissingHighCommand.length === 0 ? (
        <p className="text-warcrow-gold/70">No High Command status mismatches found</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-black/50">
              <TableHead>Faction</TableHead>
              <TableHead>Unit Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMissingHighCommand.map((unit, index) => (
              <TableRow key={`high-${index}`} className="hover:bg-black/50">
                <TableCell className="text-warcrow-gold/80">{unit.faction}</TableCell>
                <TableCell className="text-warcrow-gold/80">{unit.unitName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

// Component to display name mismatches
const NameMismatchesTable: React.FC<{ 
  nameMismatches: UnitNameMismatch[];
  selectedFaction: string | null;
}> = ({ nameMismatches, selectedFaction }) => {
  // Filter by selected faction if any
  const filteredMismatches = selectedFaction && selectedFaction !== "all-factions" 
    ? nameMismatches.filter(unit => unit.faction === selectedFaction)
    : nameMismatches;
  
  return filteredMismatches.length === 0 ? (
    <p className="text-warcrow-gold/70">No name mismatches found</p>
  ) : (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-black/50">
          <TableHead>Faction</TableHead>
          <TableHead>CSV Name</TableHead>
          <TableHead>Static Name</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredMismatches.map((mismatch, index) => (
          <TableRow key={`name-${index}`} className="hover:bg-black/50">
            <TableCell className="text-warcrow-gold/80">{mismatch.faction}</TableCell>
            <TableCell className="text-warcrow-gold/80">{mismatch.csvName}</TableCell>
            <TableCell className="text-warcrow-gold/80">{mismatch.staticName}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

// Component to display points mismatches
const PointsMismatchesTable: React.FC<{ 
  pointsMismatches: UnitPointsMismatch[];
  selectedFaction: string | null;
}> = ({ pointsMismatches, selectedFaction }) => {
  // Filter by selected faction if any
  const filteredMismatches = selectedFaction && selectedFaction !== "all-factions" 
    ? pointsMismatches.filter(unit => unit.faction === selectedFaction)
    : pointsMismatches;
  
  return filteredMismatches.length === 0 ? (
    <p className="text-warcrow-gold/70">No points mismatches found</p>
  ) : (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-black/50">
          <TableHead>Faction</TableHead>
          <TableHead>Unit Name</TableHead>
          <TableHead>CSV Points</TableHead>
          <TableHead>Static Points</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredMismatches.map((mismatch, index) => (
          <TableRow key={`points-${index}`} className="hover:bg-black/50">
            <TableCell className="text-warcrow-gold/80">{mismatch.faction}</TableCell>
            <TableCell className="text-warcrow-gold/80">{mismatch.unitName}</TableCell>
            <TableCell className="text-warcrow-gold/80">{mismatch.csvPoints}</TableCell>
            <TableCell className="text-warcrow-gold/80">{mismatch.staticPoints}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

// Component to display keyword mismatches
const KeywordMismatchesTable: React.FC<{ 
  keywordMismatches: UnitKeywordMismatch[];
  specialRuleMismatches: UnitSpecialRuleMismatch[];
  selectedFaction: string | null;
}> = ({ keywordMismatches, specialRuleMismatches, selectedFaction }) => {
  // Filter by selected faction if any
  const filteredKeywordMismatches = selectedFaction && selectedFaction !== "all-factions" 
    ? keywordMismatches.filter(unit => unit.faction === selectedFaction)
    : keywordMismatches;
    
  const filteredSpecialRuleMismatches = selectedFaction && selectedFaction !== "all-factions"
    ? specialRuleMismatches.filter(unit => unit.faction === selectedFaction)
    : specialRuleMismatches;
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-warcrow-gold/90">
        Keyword Mismatches
      </h3>
      
      {filteredKeywordMismatches.length === 0 ? (
        <p className="text-warcrow-gold/70">No keyword mismatches found</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-black/50">
              <TableHead>Faction</TableHead>
              <TableHead>Unit Name</TableHead>
              <TableHead>CSV Keywords</TableHead>
              <TableHead>Static Keywords</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredKeywordMismatches.map((mismatch, index) => (
              <TableRow key={`keyword-${index}`} className="hover:bg-black/50">
                <TableCell className="text-warcrow-gold/80">{mismatch.faction}</TableCell>
                <TableCell className="text-warcrow-gold/80">{mismatch.unitName}</TableCell>
                <TableCell className="text-warcrow-gold/80">
                  {mismatch.csvKeywords.join(', ')}
                </TableCell>
                <TableCell className="text-warcrow-gold/80">
                  {mismatch.staticKeywords.join(', ')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      
      <Separator className="bg-warcrow-gold/20 my-4" />
      
      <h3 className="text-lg font-medium text-warcrow-gold/90">
        Special Rule Mismatches
      </h3>
      
      {filteredSpecialRuleMismatches.length === 0 ? (
        <p className="text-warcrow-gold/70">No special rule mismatches found</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-black/50">
              <TableHead>Faction</TableHead>
              <TableHead>Unit Name</TableHead>
              <TableHead>CSV Special Rules</TableHead>
              <TableHead>Static Special Rules</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSpecialRuleMismatches.map((mismatch, index) => (
              <TableRow key={`special-${index}`} className="hover:bg-black/50">
                <TableCell className="text-warcrow-gold/80">{mismatch.faction}</TableCell>
                <TableCell className="text-warcrow-gold/80">{mismatch.unitName}</TableCell>
                <TableCell className="text-warcrow-gold/80">
                  {mismatch.csvSpecialRules.join(', ')}
                </TableCell>
                <TableCell className="text-warcrow-gold/80">
                  {mismatch.staticSpecialRules.join(', ')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default UnitValidationTool;
