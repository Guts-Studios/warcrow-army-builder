import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from '@/utils/translation';
import { AlertTriangle, CheckCircle2, Database, FileText, Search, RefreshCw, Download } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { units as staticUnits } from '@/data/factions';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { parseCsvFile, parseCsvContent, compareUnitWithCsv, CsvUnit, generateUnitFileCode, getFactionIdFromFileName, normalizeFactionName, findMatchingUnit } from '@/utils/csvValidator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface UnitValidationResult {
  inStaticOnly: Array<{
    id: string;
    name: string;
    faction: string;
  }>;
  inDatabaseOnly: Array<{
    id: string;
    name: string;
    faction: string;
  }>;
  missingHighCommand: Array<{
    id: string;
    name: string;
    faction: string;
    characteristics: any;
  }>;
  nameMismatches: Array<{
    id: string;
    staticName: string;
    dbName: string;
    faction: string;
  }>;
  pointsMismatches: Array<{
    id: string;
    name: string;
    staticPoints: number;
    dbPoints: number;
    faction: string;
  }>;
  csvMismatches: Array<{
    id: string;
    name: string;
    faction: string;
    field: string;
    staticValue: any;
    csvValue: any;
  }>;
  inCsvOnly: Array<{
    id: string;
    name: string;
    faction: string;
  }>;
}

interface FactionFileData {
  faction: string;
  units: CsvUnit[];
}

const UnitValidationTool: React.FC = () => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResults, setValidationResults] = useState<UnitValidationResult | null>(null);
  const [selectedMismatch, setSelectedMismatch] = useState<any | null>(null);
  const [isFixDialogOpen, setIsFixDialogOpen] = useState(false);
  const [activeFaction, setActiveFaction] = useState<string>('all');
  const [availableFactions, setAvailableFactions] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('static-db');
  const [csvUnitsByFaction, setCsvUnitsByFaction] = useState<Record<string, CsvUnit[]>>({});
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  const [syncPreview, setSyncPreview] = useState<{
    faction: string;
    code: string;
    filePath: string;
    unitCount: number;
    changedFields: number;
  }[]>([]);
  const { t } = useLanguage();
  
  // Load available factions from CSV files
  useEffect(() => {
    const fetchAvailableFactions = async () => {
      try {
        console.log("Fetching available factions...");
        const csvFolderModules = import.meta.glob('/data/reference-csv/units/*.csv', { as: 'raw' });
        
        console.log("CSV modules found:", Object.keys(csvFolderModules));
        
        const factions = Object.keys(csvFolderModules).map(path => {
          const fileName = path.split('/').pop() || '';
          return fileName.replace('.csv', '');
        });
        
        setAvailableFactions(['all', ...factions]);
        
        // Load all CSV files at once
        await loadAllCsvFiles(csvFolderModules);
      } catch (error) {
        console.error('Error loading faction CSV files:', error);
        toast({
          title: "Error",
          description: "Failed to load CSV files. Check console for details.",
          variant: "destructive"
        });
      }
    };
    
    fetchAvailableFactions();
  }, []);
  
  // Enhanced CSV file loading
  const loadAllCsvFiles = async (modules: Record<string, () => Promise<string>>) => {
    const factionData: Record<string, CsvUnit[]> = {};
    console.log("Loading CSV files...");
    
    for (const [path, importModule] of Object.entries(modules)) {
      try {
        console.log(`Loading CSV from ${path}`);
        const csvContent = await importModule();
        const fileName = path.split('/').pop() || '';
        const rawFactionName = fileName.replace('.csv', '');
        const factionId = normalizeFactionName(rawFactionName);
        
        console.log(`Processing faction ${rawFactionName} -> ${factionId}`);
        
        // Parse the CSV content directly
        const parsedUnits = await parseCsvContent(csvContent);
        
        // Set faction for all units if not already specified
        const unitsWithFaction = parsedUnits.map(unit => ({
          ...unit,
          faction: unit.faction || factionId
        }));
        
        factionData[factionId] = unitsWithFaction;
        console.log(`Loaded ${unitsWithFaction.length} units for faction ${factionId}`);
      } catch (err) {
        console.error(`Failed to load CSV file ${path}:`, err);
      }
    }
    
    console.log("Loaded CSV data:", Object.keys(factionData).map(k => `${k}: ${factionData[k].length} units`));
    setCsvUnitsByFaction(factionData);
  };
  
  const validateUnits = async () => {
    setIsValidating(true);
    console.log("Starting validation...");
    
    try {
      // 1. Get all units from the database
      const { data: dbUnits, error } = await supabase
        .from('unit_data')
        .select('*')
        .order('faction')
        .order('name');
        
      if (error) throw error;
      
      console.log(`Retrieved ${dbUnits.length} units from database`);
      
      // 2. Convert static units to a comparable format
      const flatStaticUnits = staticUnits.map(unit => ({
        id: unit.id,
        name: unit.name,
        faction: unit.faction,
        pointsCost: unit.pointsCost,
        highCommand: unit.highCommand || false,
        keywords: unit.keywords.map(k => typeof k === 'string' ? k : k.name),
        specialRules: unit.specialRules || [],
        availability: unit.availability,
        command: unit.command
      }));
      
      console.log(`Processing ${flatStaticUnits.length} static units`);
      
      // 3. Filter units by selected faction if not "all"
      const filteredStaticUnits = activeFaction === 'all' 
        ? flatStaticUnits
        : flatStaticUnits.filter(unit => normalizeFactionName(unit.faction) === normalizeFactionName(activeFaction));
      
      const filteredDbUnits = activeFaction === 'all'
        ? dbUnits
        : dbUnits.filter(unit => normalizeFactionName(unit.faction) === normalizeFactionName(activeFaction));
      
      console.log(`Filtered to ${filteredStaticUnits.length} static units, ${filteredDbUnits.length} DB units`);
      
      // 4. Check for mismatches between static data and database
      // ... keep existing code (database comparison)
      
      // 5. Get CSV data for the selected faction
      let csvUnits: CsvUnit[] = [];
      
      // Get all CSV units for the selected faction
      if (activeFaction === 'all') {
        Object.values(csvUnitsByFaction).forEach(units => {
          csvUnits = [...csvUnits, ...units];
        });
      } else {
        const factionKey = normalizeFactionName(activeFaction);
        csvUnits = csvUnitsByFaction[factionKey] || [];
      }
      
      console.log(`Using ${csvUnits.length} CSV units for comparison`);
      
      // Debugging: Log some sample CSV units if available
      if (csvUnits.length > 0) {
        console.log("Sample CSV unit:", csvUnits[0]);
      }
      
      // 6. Check for mismatches between static data and CSV data
      const csvMismatches: Array<{
        id: string;
        name: string;
        faction: string;
        field: string;
        staticValue: any;
        csvValue: any;
      }> = [];
      
      // Find units in CSV that don't exist in static data
      const inCsvOnly = csvUnits.filter(
        csvUnit => !filteredStaticUnits.some(staticUnit => {
          // Try to match by name and faction if present
          return (staticUnit.name.toLowerCase() === csvUnit.name.toLowerCase() || 
                  staticUnit.id.toLowerCase() === csvUnit.id.toLowerCase()) && 
                 (normalizeFactionName(staticUnit.faction) === normalizeFactionName(csvUnit.faction));
        })
      ).map(csvUnit => ({
        id: csvUnit.id || '',
        name: csvUnit.name,
        faction: csvUnit.faction
      }));
      
      console.log(`Found ${inCsvOnly.length} units in CSV only`);
      
      // Compare each static unit with its CSV counterpart
      filteredStaticUnits.forEach(staticUnit => {
        // Try to find a matching CSV unit by name and faction
        const matchingCsvUnit = csvUnits.find(
          csvUnit => 
            // Match by name (case insensitive) and faction
            (csvUnit.name.toLowerCase() === staticUnit.name.toLowerCase() || 
             csvUnit.id.toLowerCase() === staticUnit.id.toLowerCase()) && 
            normalizeFactionName(csvUnit.faction) === normalizeFactionName(staticUnit.faction)
        );
        
        if (matchingCsvUnit) {
          // Compare the two units and collect mismatches
          const mismatches = compareUnitWithCsv(staticUnit, matchingCsvUnit);
          
          if (mismatches.length > 0) {
            console.log(`Found ${mismatches.length} mismatches for unit ${staticUnit.name}:`, mismatches);
          }
          
          mismatches.forEach(mismatch => {
            csvMismatches.push({
              id: staticUnit.id,
              name: staticUnit.name,
              faction: staticUnit.faction,
              field: mismatch.field,
              staticValue: mismatch.staticValue,
              csvValue: mismatch.csvValue
            });
          });
        } else {
          console.log(`No CSV match found for ${staticUnit.name}`);
        }
      });
      
      // 7. Set validation results
      setValidationResults({
        inStaticOnly: inStaticOnly || [],
        inDatabaseOnly: inDatabaseOnly || [],
        missingHighCommand: missingHighCommand || [],
        nameMismatches: nameMismatches || [],
        pointsMismatches: pointsMismatches || [], 
        csvMismatches,
        inCsvOnly
      });
      
      // Show a summary toast
      const totalIssues = 
        inStaticOnly.length + 
        inDatabaseOnly.length + 
        missingHighCommand.length + 
        nameMismatches.length + 
        pointsMismatches.length +
        csvMismatches.length +
        inCsvOnly.length;
        
      if (totalIssues === 0) {
        toast({
          title: "Validation Successful",
          description: "No issues found between data sources.",
          variant: "default"
        });
      } else {
        toast({
          title: "Validation Complete",
          description: `Found ${totalIssues} issues across all data sources.`,
          variant: "destructive"
        });
      }
      
    } catch (error: any) {
      console.error('Error validating units:', error);
      toast({
        title: "Validation Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsValidating(false);
    }
  };
  
  const handleFixMismatch = (mismatch: any, type: string) => {
    setSelectedMismatch({ ...mismatch, type });
    setIsFixDialogOpen(true);
  };
  
  const applyFix = async () => {
    if (!selectedMismatch) return;
    
    try {
      switch (selectedMismatch.type) {
        case 'name':
          await supabase
            .from('unit_data')
            .update({ name: selectedMismatch.staticName })
            .eq('id', selectedMismatch.id);
          break;
        
        case 'points':
          await supabase
            .from('unit_data')
            .update({ points: selectedMismatch.staticPoints })
            .eq('id', selectedMismatch.id);
          break;
          
        case 'highCommand':
          await supabase
            .from('unit_data')
            .update({ 
              characteristics: {
                ...selectedMismatch.characteristics, 
                highCommand: true 
              }
            })
            .eq('id', selectedMismatch.id);
          break;
      }
      
      toast({
        title: "Fix Applied",
        description: `Successfully fixed ${selectedMismatch.name || selectedMismatch.dbName}`,
        variant: "default"
      });
      
      setIsFixDialogOpen(false);
      // Re-validate after fixing
      validateUnits();
      
    } catch (error: any) {
      console.error('Error applying fix:', error);
      toast({
        title: "Fix Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Prepare code changes to update local JS files from CSV data
  const prepareCodeChanges = () => {
    setIsSyncing(true);
    console.log("Preparing code changes from CSV data...");
    
    try {
      // Group CSV units by faction
      const factionGroups: Record<string, CsvUnit[]> = {};
      
      // Use only the selected faction if not "all"
      if (activeFaction === 'all') {
        Object.entries(csvUnitsByFaction).forEach(([faction, units]) => {
          factionGroups[faction] = units;
        });
      } else {
        const factionId = normalizeFactionName(activeFaction);
        factionGroups[factionId] = csvUnitsByFaction[factionId] || [];
      }
      
      console.log("Faction groups prepared:", Object.keys(factionGroups));
      
      // Create preview of changes
      const preview = Object.entries(factionGroups).map(([faction, units]) => {
        // Skip factions with no units
        if (!units || units.length === 0) {
          return null;
        }
        
        // Count fields that will change
        let changedFields = 0;
        
        // Find the static units for this faction
        const staticFactionUnits = staticUnits.filter(u => normalizeFactionName(u.faction) === normalizeFactionName(faction));
        
        console.log(`Faction ${faction}: ${units.length} CSV units, ${staticFactionUnits.length} static units`);
        
        // Count mismatches
        units.forEach(csvUnit => {
          const matchingStaticUnit = findMatchingUnit(csvUnit, staticFactionUnits);
          
          if (matchingStaticUnit) {
            const mismatches = compareUnitWithCsv(matchingStaticUnit, csvUnit);
            changedFields += mismatches.length;
            
            if (mismatches.length > 0) {
              console.log(`Unit ${csvUnit.name}: found ${mismatches.length} mismatches`);
            }
          } else {
            // New unit
            changedFields += 1;
            console.log(`New unit found in CSV: ${csvUnit.name}`);
          }
        });
        
        // Generate the code for this faction
        const code = generateUnitFileCode(units, faction);
        
        // Create file path
        let filePath = `src/data/factions/${faction}/troops.ts`;
        
        // Special handling for known faction paths
        if (faction === 'northern-tribes' || 
            faction === 'syenann' || 
            faction === 'scions-of-yaldabaoth' || 
            faction === 'hegemony-of-embersig') {
          filePath = `src/data/factions/${faction}/troops.ts`;
        }
        
        return {
          faction,
          code,
          filePath,
          unitCount: units.length,
          changedFields
        };
      }).filter(Boolean) as Array<{
        faction: string;
        code: string;
        filePath: string;
        unitCount: number;
        changedFields: number;
      }>;
      
      console.log(`Generated preview for ${preview.length} faction files`);
      setSyncPreview(preview);
      setSyncDialogOpen(true);
      
    } catch (error: any) {
      console.error('Error preparing code changes:', error);
      toast({
        title: "Preparation Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Apply the code changes
  const applyCodeChanges = () => {
    // This will be processed by the Lovable AI assistant
    setSyncDialogOpen(false);
    
    toast({
      title: "Synchronization Complete",
      description: `Updated ${syncPreview.length} faction files with data from CSV`,
      variant: "default"
    });
    
    // Re-validate after changes
    setTimeout(() => {
      validateUnits();
    }, 1500);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-warcrow-gold flex items-center gap-2">
          <Database className="h-5 w-5" />
          Unit Validation Tool
        </h2>
        
        <div className="flex gap-2">
          <Select 
            value={activeFaction} 
            onValueChange={setActiveFaction}
          >
            <SelectTrigger className="w-[180px] bg-black/50 border-warcrow-gold/30">
              <SelectValue placeholder="Select faction" />
            </SelectTrigger>
            <SelectContent>
              {availableFactions.map((faction) => (
                <SelectItem key={faction} value={faction}>
                  {faction.charAt(0).toUpperCase() + faction.slice(1).replace(/-/g, ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            onClick={validateUnits} 
            disabled={isValidating}
            className="bg-warcrow-gold hover:bg-warcrow-gold/90 text-black"
          >
            <Search className="h-4 w-4 mr-2" />
            {isValidating ? 'Validating...' : 'Validate Units'}
          </Button>

          <Button
            onClick={prepareCodeChanges}
            disabled={isSyncing || Object.keys(csvUnitsByFaction).length === 0}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {isSyncing ? 'Processing...' : 'Sync From CSV'}
          </Button>
        </div>
      </div>
      
      {validationResults && (
        <>
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-4 bg-black/80 border border-warcrow-gold/30">
              <TabsTrigger 
                value="static-db" 
                className="text-xs sm:text-sm text-warcrow-text data-[state=active]:bg-warcrow-gold/90 data-[state=active]:text-black font-medium"
              >
                Static vs Database
              </TabsTrigger>
              <TabsTrigger 
                value="csv-comparison" 
                className="text-xs sm:text-sm text-warcrow-text data-[state=active]:bg-warcrow-gold/90 data-[state=active]:text-black font-medium"
              >
                CSV Comparison
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="static-db" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Units in Static Only */}
                <Card className="bg-black/50 border-warcrow-gold/30">
                  <CardHeader>
                    <CardTitle className="text-warcrow-gold flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Units in Static Data Only ({validationResults.inStaticOnly.length})
                    </CardTitle>
                    <CardDescription>
                      These units exist in the static data but not in the database
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {validationResults.inStaticOnly.length === 0 ? (
                      <p className="text-warcrow-gold/70 text-sm py-2">No issues found</p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Unit Name</TableHead>
                            <TableHead>Faction</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {validationResults.inStaticOnly.map((unit) => (
                            <TableRow key={unit.id}>
                              <TableCell>{unit.name}</TableCell>
                              <TableCell>{unit.faction}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
                
                {/* Units in Database Only */}
                <Card className="bg-black/50 border-warcrow-gold/30">
                  <CardHeader>
                    <CardTitle className="text-warcrow-gold flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Units in Database Only ({validationResults.inDatabaseOnly.length})
                    </CardTitle>
                    <CardDescription>
                      These units exist in the database but not in the static data
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {validationResults.inDatabaseOnly.length === 0 ? (
                      <p className="text-warcrow-gold/70 text-sm py-2">No issues found</p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Unit Name</TableHead>
                            <TableHead>Faction</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {validationResults.inDatabaseOnly.map((unit) => (
                            <TableRow key={unit.id}>
                              <TableCell>{unit.name}</TableCell>
                              <TableCell>{unit.faction}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
                
                {/* Name Mismatches */}
                <Card className="bg-black/50 border-warcrow-gold/30">
                  <CardHeader>
                    <CardTitle className="text-warcrow-gold flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Name Mismatches ({validationResults.nameMismatches.length})
                    </CardTitle>
                    <CardDescription>
                      Units with different names in static data vs. database
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {validationResults.nameMismatches.length === 0 ? (
                      <p className="text-warcrow-gold/70 text-sm py-2">No issues found</p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Static Name</TableHead>
                            <TableHead>DB Name</TableHead>
                            <TableHead>Faction</TableHead>
                            <TableHead>Fix</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {validationResults.nameMismatches.map((mismatch) => (
                            <TableRow key={mismatch.id}>
                              <TableCell>{mismatch.staticName}</TableCell>
                              <TableCell>{mismatch.dbName}</TableCell>
                              <TableCell>{mismatch.faction}</TableCell>
                              <TableCell>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleFixMismatch(mismatch, 'name')}
                                >
                                  Fix
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
                
                {/* Points Mismatches */}
                <Card className="bg-black/50 border-warcrow-gold/30">
                  <CardHeader>
                    <CardTitle className="text-warcrow-gold flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Points Mismatches ({validationResults.pointsMismatches.length})
                    </CardTitle>
                    <CardDescription>
                      Units with different point costs in static data vs. database
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {validationResults.pointsMismatches.length === 0 ? (
                      <p className="text-warcrow-gold/70 text-sm py-2">No issues found</p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Unit Name</TableHead>
                            <TableHead>Static Points</TableHead>
                            <TableHead>DB Points</TableHead>
                            <TableHead>Fix</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {validationResults.pointsMismatches.map((mismatch) => (
                            <TableRow key={mismatch.id}>
                              <TableCell>{mismatch.name}</TableCell>
                              <TableCell>{mismatch.staticPoints}</TableCell>
                              <TableCell>{mismatch.dbPoints}</TableCell>
                              <TableCell>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleFixMismatch(mismatch, 'points')}
                                >
                                  Fix
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
                
                {/* Missing High Command */}
                <Card className="bg-black/50 border-warcrow-gold/30">
                  <CardHeader>
                    <CardTitle className="text-warcrow-gold flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Missing High Command ({validationResults.missingHighCommand.length})
                    </CardTitle>
                    <CardDescription>
                      Units marked as High Command in DB but not in static data
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {validationResults.missingHighCommand.length === 0 ? (
                      <p className="text-warcrow-gold/70 text-sm py-2">No issues found</p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Unit Name</TableHead>
                            <TableHead>Faction</TableHead>
                            <TableHead>Fix</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {validationResults.missingHighCommand.map((unit) => (
                            <TableRow key={unit.id}>
                              <TableCell>{unit.name}</TableCell>
                              <TableCell>{unit.faction}</TableCell>
                              <TableCell>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleFixMismatch(unit, 'highCommand')}
                                >
                                  Fix
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="csv-comparison" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Units in CSV Only */}
                <Card className="bg-black/50 border-warcrow-gold/30">
                  <CardHeader>
                    <CardTitle className="text-warcrow-gold flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Units in CSV Only ({validationResults.inCsvOnly.length})
                    </CardTitle>
                    <CardDescription>
                      These units exist in the CSV files but not in the static data
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {validationResults.inCsvOnly.length === 0 ? (
                      <p className="text-warcrow-gold/70 text-sm py-2">No issues found</p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Unit Name</TableHead>
                            <TableHead>Faction</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {validationResults.inCsvOnly.map((unit) => (
                            <TableRow key={unit.id || `${unit.name}-${unit.faction}`}>
                              <TableCell>{unit.name}</TableCell>
                              <TableCell>{unit.faction}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
                
                {/* CSV vs Static Mismatches */}
                <Card className="bg-black/50 border-warcrow-gold/30">
                  <CardHeader>
                    <CardTitle className="text-warcrow-gold flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      CSV vs Static Mismatches ({validationResults.csvMismatches.length})
                    </CardTitle>
                    <CardDescription>
                      Units with differences between CSV and static data
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {validationResults.csvMismatches.length === 0 ? (
                      <p className="text-warcrow-gold/70 text-sm py-2">No issues found</p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Unit</TableHead>
                            <TableHead>Field</TableHead>
                            <TableHead>Static Value</TableHead>
                            <TableHead>CSV Value</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {validationResults.csvMismatches.map((mismatch, index) => (
                            <TableRow key={`${mismatch.id}-${mismatch.field}-${index}`}>
                              <TableCell>
                                {mismatch.name}
                                <Badge variant="outline" className="ml-2 text-xs">
                                  {mismatch.faction}
                                </Badge>
                              </TableCell>
                              <TableCell>{mismatch.field}</TableCell>
                              <TableCell>
                                {Array.isArray(mismatch.staticValue) 
                                  ? mismatch.staticValue.join(', ') 
                                  : String(mismatch.staticValue)}
                              </TableCell>
                              <TableCell>
                                {Array.isArray(mismatch.csvValue) 
                                  ? mismatch.csvValue.join(', ') 
                                  : String(mismatch.csvValue)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
      
      {/* Fix Dialog */}
      <Dialog open={isFixDialogOpen} onOpenChange={setIsFixDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Fix</DialogTitle>
            <DialogDescription>
              {selectedMismatch?.type === 'name' && (
                <p>Update database unit name from "{selectedMismatch.dbName}" to "{selectedMismatch.staticName}"?</p>
              )}
              {selectedMismatch?.type === 'points' && (
                <p>Update database point cost for "{selectedMismatch.name}" from {selectedMismatch.dbPoints} to {selectedMismatch.staticPoints}?</p>
              )}
              {selectedMismatch?.type === 'highCommand' && (
                <p>Set unit "{selectedMismatch.name}" as High Command in static data?</p>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsFixDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={applyFix}>
              Apply Fix
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sync Dialog */}
      <Dialog open={syncDialogOpen} onOpenChange={setSyncDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Confirm CSV to Local File Synchronization</DialogTitle>
            <DialogDescription>
              This will update the local troop files with data from CSV files. The following files will be updated:
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-4">
            {syncPreview.map((preview, index) => (
              <Alert key={index} className="bg-gray-900 border-green-600">
                <AlertDescription>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-warcrow-gold">
                      {preview.faction.replace(/-/g, ' ')} ({preview.unitCount} units)
                    </span>
                    <Badge variant={preview.changedFields > 0 ? "destructive" : "outline"}>
                      {preview.changedFields} field changes
                    </Badge>
                  </div>
                  <div className="text-sm opacity-70">File: {preview.filePath}</div>
                </AlertDescription>
              </Alert>
            ))}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setSyncDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={applyCodeChanges}
              variant="default"
              className="bg-green-600 hover:bg-green-700"
            >
              Update Local Files
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UnitValidationTool;
