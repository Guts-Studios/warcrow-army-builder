
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from '@/utils/translation';
import { AlertTriangle, CheckCircle2, Database, FileText, Search } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { units as staticUnits } from '@/data/factions';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { parseCsvFile, compareUnitWithCsv, CsvUnit } from '@/utils/csvValidator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

const UnitValidationTool: React.FC = () => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResults, setValidationResults] = useState<UnitValidationResult | null>(null);
  const [selectedMismatch, setSelectedMismatch] = useState<any | null>(null);
  const [isFixDialogOpen, setIsFixDialogOpen] = useState(false);
  const [activeFaction, setActiveFaction] = useState<string>('all');
  const [availableFactions, setAvailableFactions] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('static-db');
  const { t } = useLanguage();
  
  // Load available factions from CSV files
  useEffect(() => {
    const fetchAvailableFactions = async () => {
      try {
        // Using dynamic imports to scan the reference-csv/units directory
        const csvFolderModules = import.meta.glob('/data/reference-csv/units/*.csv', { as: 'raw' });
        
        const factions = Object.keys(csvFolderModules).map(path => {
          // Extract faction name from path
          const fileName = path.split('/').pop() || '';
          const faction = fileName.replace('.csv', '');
          return faction;
        });
        
        setAvailableFactions(['all', ...factions]);
      } catch (error) {
        console.error('Error loading faction CSV files:', error);
      }
    };
    
    fetchAvailableFactions();
  }, []);
  
  const validateUnits = async () => {
    setIsValidating(true);
    
    try {
      // 1. Get all units from the database
      const { data: dbUnits, error } = await supabase
        .from('unit_data')
        .select('*')
        .order('faction')
        .order('name');
        
      if (error) throw error;
      
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
      
      // 3. Load CSV data for the selected faction
      let csvUnits: CsvUnit[] = [];
      
      try {
        // Filter units to the selected faction if not "all"
        const factionsToLoad = activeFaction === 'all' 
          ? availableFactions.filter(f => f !== 'all')
          : [activeFaction];
        
        for (const faction of factionsToLoad) {
          try {
            const csvModule = await import(`/data/reference-csv/units/${faction}.csv?raw`);
            const csvContent = csvModule.default;
            
            // Parse the CSV content
            const parser = new DOMParser();
            const doc = parser.parseFromString(csvContent, 'text/html');
            const csvText = doc.body.textContent || '';
            
            // Use Papa Parse to parse the CSV content
            const parsedUnits = await new Promise<CsvUnit[]>((resolve) => {
              const Papa = require('papaparse');
              Papa.parse(csvText, {
                header: true,
                complete: (results: any) => {
                  // Map the parsed data to our CsvUnit type
                  const units = results.data.map((row: any) => ({
                    id: row.id || '',
                    name: row['Unit Name'] || row.name || '',
                    faction: row.Faction || row.faction || faction,
                    type: row['Unit Type'] || row.type || '',
                    pointsCost: parseInt(row['Points Cost'] || row.pointsCost || '0', 10),
                    availability: parseInt(row.AVB || row.availability || '0', 10),
                    keywords: (row.Keywords || row.keywords || '').split(',').map((k: string) => k.trim()),
                    specialRules: (row['Special Rules'] || row.specialRules || '').split(',').map((r: string) => r.trim()).filter((r: string) => r),
                    highCommand: (row['High Command'] || row.highCommand || '').toLowerCase() === 'yes',
                    command: parseInt(row.Command || row.command || '0', 10) || 0
                  }));
                  resolve(units.filter((unit: any) => unit.name)); // Filter out empty rows
                },
                error: (error: any) => {
                  console.error(`Error parsing CSV for faction ${faction}:`, error);
                  resolve([]);
                }
              });
            });
            
            csvUnits = [...csvUnits, ...parsedUnits];
          } catch (err) {
            console.error(`Failed to load CSV for faction ${faction}:`, err);
          }
        }
      } catch (err) {
        console.error('Error loading CSV files:', err);
      }
      
      // 4. Check for mismatches between static data and database
      const inStaticOnly = flatStaticUnits.filter(
        staticUnit => !dbUnits.some(dbUnit => dbUnit.id === staticUnit.id)
      );
      
      const inDatabaseOnly = dbUnits.filter(
        dbUnit => !flatStaticUnits.some(staticUnit => staticUnit.id === dbUnit.id)
      );
      
      const missingHighCommand = dbUnits.filter(
        dbUnit => {
          const staticUnit = flatStaticUnits.find(su => su.id === dbUnit.id);
          // Safely check if characteristics exists and if highCommand property is true
          const hasHighCommandChar = dbUnit.characteristics && 
            typeof dbUnit.characteristics === 'object' && 
            typeof dbUnit.characteristics !== 'string' && 
            !Array.isArray(dbUnit.characteristics) &&
            'highCommand' in dbUnit.characteristics &&
            dbUnit.characteristics.highCommand === true;
          
          return staticUnit && hasHighCommandChar && !staticUnit.highCommand;
        }
      );
      
      const nameMismatches = dbUnits
        .filter(dbUnit => {
          const staticUnit = flatStaticUnits.find(su => su.id === dbUnit.id);
          return staticUnit && staticUnit.name !== dbUnit.name;
        })
        .map(dbUnit => {
          const staticUnit = flatStaticUnits.find(su => su.id === dbUnit.id)!;
          return {
            id: dbUnit.id,
            staticName: staticUnit.name,
            dbName: dbUnit.name,
            faction: dbUnit.faction
          };
        });
      
      const pointsMismatches = dbUnits
        .filter(dbUnit => {
          const staticUnit = flatStaticUnits.find(su => su.id === dbUnit.id);
          return staticUnit && staticUnit.pointsCost !== dbUnit.points;
        })
        .map(dbUnit => {
          const staticUnit = flatStaticUnits.find(su => su.id === dbUnit.id)!;
          return {
            id: dbUnit.id,
            name: dbUnit.name,
            staticPoints: staticUnit.pointsCost,
            dbPoints: dbUnit.points,
            faction: dbUnit.faction
          };
        });
      
      // 5. Check for mismatches between static data and CSV data
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
        csvUnit => !flatStaticUnits.some(staticUnit => 
          staticUnit.name.toLowerCase() === csvUnit.name.toLowerCase() && 
          staticUnit.faction.toLowerCase() === csvUnit.faction.toLowerCase()
        )
      ).map(csvUnit => ({
        id: csvUnit.id || '',
        name: csvUnit.name,
        faction: csvUnit.faction
      }));
      
      // Compare each static unit with its CSV counterpart
      flatStaticUnits.forEach(staticUnit => {
        const matchingCsvUnit = csvUnits.find(
          csvUnit => csvUnit.name.toLowerCase() === staticUnit.name.toLowerCase() && 
                    csvUnit.faction.toLowerCase() === staticUnit.faction.toLowerCase()
        );
        
        if (matchingCsvUnit) {
          // Compare the two units and collect mismatches
          const mismatches = compareUnitWithCsv(staticUnit, matchingCsvUnit);
          
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
        }
      });
      
      // 6. Set validation results
      setValidationResults({
        inStaticOnly,
        inDatabaseOnly,
        missingHighCommand,
        nameMismatches,
        pointsMismatches,
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
                  {faction.charAt(0).toUpperCase() + faction.slice(1)}
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
    </div>
  );
};

export default UnitValidationTool;
