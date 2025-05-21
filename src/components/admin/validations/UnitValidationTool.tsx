
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from '@/utils/translation';
import { AlertTriangle, CheckCircle2, Database, Search, FileText, GitCompare, Upload } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { units as staticUnits } from '@/data/factions';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import * as Papa from 'papaparse';

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
  csvMismatches?: Array<{
    id: string;
    field: string;
    staticValue: any;
    csvValue: any;
    dbValue?: any;
    faction: string;
  }>;
}

interface CsvUnit {
  id: string;
  name: string;
  faction: string;
  type: string;
  pointsCost: number;
  availability: number;
  keywords: string;
  specialRules: string;
  highCommand: string;
  command?: string;
}

const UnitValidationTool: React.FC = () => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResults, setValidationResults] = useState<UnitValidationResult | null>(null);
  const [selectedMismatch, setSelectedMismatch] = useState<any | null>(null);
  const [isFixDialogOpen, setIsFixDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("static-db");
  const [selectedFaction, setSelectedFaction] = useState("all");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvUnits, setCsvUnits] = useState<CsvUnit[]>([]);
  const [availableFactions, setAvailableFactions] = useState<string[]>([]);
  const { t } = useLanguage();
  
  // Fetch available factions on component mount
  useEffect(() => {
    const fetchFactions = async () => {
      const { data: factions, error } = await supabase
        .from('factions')
        .select('id');
        
      if (!error && factions) {
        setAvailableFactions(factions.map(f => f.id));
      }
    };
    
    fetchFactions();
  }, []);
  
  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setCsvFile(files[0]);
      
      // Parse the CSV
      Papa.parse(files[0], {
        header: true,
        complete: (results) => {
          // Type casting the results data
          const parsedUnits = results.data as CsvUnit[];
          setCsvUnits(parsedUnits);
          toast({
            title: "CSV Loaded",
            description: `Loaded ${parsedUnits.length} units from CSV file`,
            variant: "default"
          });
        },
        error: (error) => {
          toast({
            title: "CSV Parse Error",
            description: error.message,
            variant: "destructive"
          });
        }
      });
    }
  };
  
  const validateUnitsAgainstStatic = async () => {
    setIsValidating(true);
    
    try {
      // 1. Get all units from the database
      const { data: dbUnits, error } = await supabase
        .from('unit_data')
        .select('*')
        .order('faction')
        .order('name');
        
      if (error) throw error;
      
      // Filter by selected faction if not "all"
      let filteredDbUnits = dbUnits;
      let filteredStaticUnits = staticUnits;
      
      if (selectedFaction !== "all") {
        filteredDbUnits = dbUnits.filter(unit => unit.faction === selectedFaction);
        filteredStaticUnits = staticUnits.filter(unit => unit.faction === selectedFaction);
      }
      
      // 2. Convert static units to a comparable format
      const flatStaticUnits = filteredStaticUnits.map(unit => ({
        id: unit.id,
        name: unit.name,
        faction: unit.faction,
        pointsCost: unit.pointsCost,
        highCommand: unit.highCommand || false,
      }));
      
      // 3. Check for mismatches
      const inStaticOnly = flatStaticUnits.filter(
        staticUnit => !filteredDbUnits.some(dbUnit => dbUnit.id === staticUnit.id)
      );
      
      const inDatabaseOnly = filteredDbUnits.filter(
        dbUnit => !flatStaticUnits.some(staticUnit => staticUnit.id === dbUnit.id)
      );
      
      const missingHighCommand = filteredDbUnits.filter(
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
      
      const nameMismatches = filteredDbUnits
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
      
      const pointsMismatches = filteredDbUnits
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
            
      setValidationResults({
        inStaticOnly,
        inDatabaseOnly,
        missingHighCommand,
        nameMismatches,
        pointsMismatches
      });
      
      // Show a summary toast
      const totalIssues = 
        inStaticOnly.length + 
        inDatabaseOnly.length + 
        missingHighCommand.length + 
        nameMismatches.length + 
        pointsMismatches.length;
        
      if (totalIssues === 0) {
        toast({
          title: "Validation Successful",
          description: "No issues found between static data and database.",
          variant: "default"
        });
      } else {
        toast({
          title: "Validation Complete",
          description: `Found ${totalIssues} issues between static data and database.`,
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

  const validateAgainstCsv = () => {
    if (csvUnits.length === 0) {
      toast({
        title: "No CSV Data",
        description: "Please upload a CSV file first",
        variant: "destructive"
      });
      return;
    }
    
    setIsValidating(true);
    
    try {
      // Filter static units by selected faction if not "all"
      let filteredStaticUnits = staticUnits;
      let filteredCsvUnits = csvUnits;
      
      if (selectedFaction !== "all") {
        filteredStaticUnits = staticUnits.filter(unit => unit.faction === selectedFaction);
        filteredCsvUnits = csvUnits.filter(unit => unit.faction === selectedFaction);
      }
      
      const csvMismatches: any[] = [];
      
      // Compare static units with CSV data
      filteredStaticUnits.forEach(staticUnit => {
        const csvUnit = filteredCsvUnits.find(cu => cu.id === staticUnit.id);
        
        if (csvUnit) {
          // Check name match
          if (staticUnit.name !== csvUnit.name) {
            csvMismatches.push({
              id: staticUnit.id,
              field: 'name',
              staticValue: staticUnit.name,
              csvValue: csvUnit.name,
              faction: staticUnit.faction
            });
          }
          
          // Check points cost match
          const csvPoints = Number(csvUnit.pointsCost);
          if (!isNaN(csvPoints) && staticUnit.pointsCost !== csvPoints) {
            csvMismatches.push({
              id: staticUnit.id,
              field: 'pointsCost',
              staticValue: staticUnit.pointsCost,
              csvValue: csvPoints,
              faction: staticUnit.faction
            });
          }
          
          // Check availability match
          const csvAvailability = Number(csvUnit.availability);
          if (!isNaN(csvAvailability) && staticUnit.availability !== csvAvailability) {
            csvMismatches.push({
              id: staticUnit.id,
              field: 'availability',
              staticValue: staticUnit.availability,
              csvValue: csvAvailability,
              faction: staticUnit.faction
            });
          }
          
          // Check high command match
          const csvHighCommand = csvUnit.highCommand.toLowerCase() === 'yes';
          if (Boolean(staticUnit.highCommand) !== csvHighCommand) {
            csvMismatches.push({
              id: staticUnit.id,
              field: 'highCommand',
              staticValue: Boolean(staticUnit.highCommand),
              csvValue: csvHighCommand,
              faction: staticUnit.faction
            });
          }
          
          // Check keywords (this is a simplified comparison, might need refinement)
          const staticKeywords = staticUnit.keywords.map(k => typeof k === 'string' ? k : k.name).sort().join(',');
          const csvKeywordsList = csvUnit.keywords.split(',').map(k => k.trim()).sort().join(',');
          
          if (staticKeywords !== csvKeywordsList) {
            csvMismatches.push({
              id: staticUnit.id,
              field: 'keywords',
              staticValue: staticKeywords,
              csvValue: csvKeywordsList,
              faction: staticUnit.faction
            });
          }
          
          // Check special rules
          const staticRules = (staticUnit.specialRules || []).sort().join(',');
          const csvRules = csvUnit.specialRules ? csvUnit.specialRules.split(',').map(r => r.trim()).sort().join(',') : '';
          
          if (staticRules !== csvRules) {
            csvMismatches.push({
              id: staticUnit.id,
              field: 'specialRules',
              staticValue: staticRules,
              csvValue: csvRules,
              faction: staticUnit.faction
            });
          }
        }
      });
      
      // Units in CSV but not in static files
      const inCsvOnly = filteredCsvUnits.filter(
        csvUnit => !filteredStaticUnits.some(su => su.id === csvUnit.id)
      ).map(csvUnit => ({
        id: csvUnit.id,
        name: csvUnit.name,
        faction: csvUnit.faction
      }));
      
      // Units in static files but not in CSV
      const inStaticOnly = filteredStaticUnits.filter(
        staticUnit => !filteredCsvUnits.some(cu => cu.id === staticUnit.id)
      ).map(staticUnit => ({
        id: staticUnit.id,
        name: staticUnit.name,
        faction: staticUnit.faction
      }));
      
      setValidationResults(prev => ({
        ...prev || {
          inStaticOnly: [],
          inDatabaseOnly: [],
          missingHighCommand: [],
          nameMismatches: [],
          pointsMismatches: []
        },
        inStaticOnly,
        csvMismatches
      }));
      
      // Show summary toast
      const totalIssues = csvMismatches.length + inCsvOnly.length + inStaticOnly.length;
      
      if (totalIssues === 0) {
        toast({
          title: "CSV Validation Successful",
          description: "No issues found between static data and CSV file.",
          variant: "default"
        });
      } else {
        toast({
          title: "CSV Validation Complete",
          description: `Found ${totalIssues} issues between static data and CSV file.`,
          variant: "destructive"
        });
      }
      
    } catch (error: any) {
      console.error('Error validating against CSV:', error);
      toast({
        title: "CSV Validation Failed",
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
      validateUnitsAgainstStatic();
      
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
        
        <div className="flex items-center gap-2">
          <Select value={selectedFaction} onValueChange={setSelectedFaction}>
            <SelectTrigger className="w-[180px] bg-black border-warcrow-gold/30">
              <SelectValue placeholder="Select Faction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Factions</SelectItem>
              {availableFactions.map(faction => (
                <SelectItem key={faction} value={faction}>{faction}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue="static-db" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4 bg-black/80 border border-warcrow-gold/30">
          <TabsTrigger 
            value="static-db" 
            className="text-xs sm:text-sm text-warcrow-text data-[state=active]:bg-warcrow-gold/90 data-[state=active]:text-black font-medium"
          >
            Static vs Database
          </TabsTrigger>
          <TabsTrigger 
            value="csv-validation" 
            className="text-xs sm:text-sm text-warcrow-text data-[state=active]:bg-warcrow-gold/90 data-[state=active]:text-black font-medium"
          >
            CSV Validation
          </TabsTrigger>
        </TabsList>
        
        {/* Static vs DB Tab */}
        <TabsContent value="static-db">
          <div className="flex justify-end mb-4">
            <Button 
              onClick={validateUnitsAgainstStatic} 
              disabled={isValidating}
              className="bg-warcrow-gold hover:bg-warcrow-gold/90 text-black"
            >
              <Search className="h-4 w-4 mr-2" />
              {isValidating ? 'Validating...' : 'Validate Static vs DB'}
            </Button>
          </div>
          
          {validationResults && (
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
          )}
        </TabsContent>
        
        {/* CSV Validation Tab */}
        <TabsContent value="csv-validation">
          <div className="mb-6 space-y-4">
            <Card className="bg-black/50 border-warcrow-gold/30">
              <CardHeader>
                <CardTitle className="text-warcrow-gold flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  CSV Data Source
                </CardTitle>
                <CardDescription>
                  Upload a CSV file to compare with static data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <Input 
                      type="file" 
                      accept=".csv" 
                      onChange={handleCsvUpload}
                      className="max-w-md bg-black/50 border-warcrow-gold/30"
                    />
                    <Button 
                      onClick={validateAgainstCsv} 
                      disabled={!csvFile || isValidating}
                      className="bg-warcrow-gold hover:bg-warcrow-gold/90 text-black"
                    >
                      <GitCompare className="h-4 w-4 mr-2" />
                      {isValidating ? 'Validating...' : 'Compare with Static Data'}
                    </Button>
                  </div>
                  
                  <div className="text-sm text-warcrow-text/70">
                    <p>Expected CSV format: id, name, faction, type, pointsCost, availability, keywords, specialRules, highCommand, command</p>
                    <p className="mt-1">CSV files can be stored in the /data/reference-csv/ directory in your repository</p>
                  </div>
                  
                  {csvFile && (
                    <div className="text-sm text-warcrow-gold mt-2">
                      Loaded: {csvFile.name} ({csvUnits.length} units)
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {validationResults?.csvMismatches && validationResults.csvMismatches.length > 0 && (
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
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Unit ID</TableHead>
                        <TableHead>Field</TableHead>
                        <TableHead>Static Value</TableHead>
                        <TableHead>CSV Value</TableHead>
                        <TableHead>Faction</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {validationResults.csvMismatches.map((mismatch, index) => (
                        <TableRow key={`${mismatch.id}-${mismatch.field}-${index}`}>
                          <TableCell>{mismatch.id}</TableCell>
                          <TableCell>{mismatch.field}</TableCell>
                          <TableCell>{String(mismatch.staticValue)}</TableCell>
                          <TableCell>{String(mismatch.csvValue)}</TableCell>
                          <TableCell>{mismatch.faction}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFixDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={applyFix}>
              Apply Fix
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UnitValidationTool;
