
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, FileWarning, RefreshCw } from 'lucide-react';
import { units as staticUnits } from '@/data/factions';
import { parseCsvContent, compareUnitWithCsv, findMatchingUnit, normalizeFactionName } from '@/utils/csvValidator';
import { normalizeFactionId } from '@/utils/unitManagement';

interface ValidationResult {
  faction: string;
  csvUnits: any[];
  localUnits: any[];
  mismatches: any[];
  missingInLocal: string[];
  missingInCsv: string[];
  perfectMatches: number;
}

const ComprehensiveUnitValidator: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [selectedFaction, setSelectedFaction] = useState<string>('all');

  const factionFileMap: Record<string, string> = {
    'syenann': 'The Syenann.csv',
    'northern-tribes': 'Northern Tribes.csv',
    'hegemony-of-embersig': 'Hegemony of Embersig.csv',
    'scions-of-yaldabaoth': 'Scions of Taldabaoth.csv'
  };

  const validateAllFactions = async () => {
    setIsLoading(true);
    setError(null);
    setValidationResults([]);
    
    const results: ValidationResult[] = [];
    
    try {
      for (const [factionId, fileName] of Object.entries(factionFileMap)) {
        console.log(`Validating faction: ${factionId}`);
        
        // Load CSV data
        const filePath = `/data/reference-csv/units/${fileName}`;
        const response = await fetch(filePath);
        
        if (!response.ok) {
          console.warn(`Failed to load CSV for ${factionId}: ${response.statusText}`);
          continue;
        }
        
        const csvContent = await response.text();
        const csvUnits = await parseCsvContent(csvContent);
        
        // Get local units for this faction
        const localUnits = staticUnits.filter(unit => {
          const unitFactionId = unit.faction_id ? normalizeFactionId(unit.faction_id) : normalizeFactionId(unit.faction);
          return unitFactionId === factionId;
        });
        
        console.log(`${factionId}: ${csvUnits.length} CSV units, ${localUnits.length} local units`);
        
        // Compare units
        const mismatches: any[] = [];
        const missingInLocal: string[] = [];
        const missingInCsv: string[] = [];
        let perfectMatches = 0;
        
        // Check CSV units against local units
        for (const csvUnit of csvUnits) {
          if (!csvUnit.name || csvUnit.name === 'null' || csvUnit.name === 'undefined') {
            continue;
          }
          
          const localUnit = findMatchingUnit(csvUnit, localUnits);
          
          if (localUnit) {
            const unitMismatches = compareUnitWithCsv(localUnit, csvUnit);
            
            if (unitMismatches.length > 0) {
              mismatches.push({
                unitName: localUnit.name,
                unitId: localUnit.id,
                issues: unitMismatches
              });
            } else {
              perfectMatches++;
            }
          } else {
            missingInLocal.push(csvUnit.name);
          }
        }
        
        // Check local units against CSV units
        const csvUnitNames = csvUnits
          .filter(u => u.name && u.name !== 'null' && u.name !== 'undefined')
          .map(u => u.name.toLowerCase());
        
        for (const localUnit of localUnits) {
          if (!csvUnitNames.includes(localUnit.name.toLowerCase())) {
            missingInCsv.push(localUnit.name);
          }
        }
        
        results.push({
          faction: factionId,
          csvUnits,
          localUnits,
          mismatches,
          missingInLocal,
          missingInCsv,
          perfectMatches
        });
      }
      
      setValidationResults(results);
      
      // Calculate totals
      const totalIssues = results.reduce((sum, result) => 
        sum + result.mismatches.length + result.missingInLocal.length + result.missingInCsv.length, 0
      );
      
      console.log(`Validation complete. Total issues found: ${totalIssues}`);
      
    } catch (err) {
      console.error('Error during validation:', err);
      setError(err instanceof Error ? err.message : 'Unknown error during validation');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    validateAllFactions();
  }, []);

  const filteredResults = selectedFaction === 'all' 
    ? validationResults 
    : validationResults.filter(r => r.faction === selectedFaction);

  const totalIssuesAcrossAllFactions = validationResults.reduce((sum, result) => 
    sum + result.mismatches.length + result.missingInLocal.length + result.missingInCsv.length, 0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-warcrow-gold">
          Comprehensive Unit Validation
        </h2>
        <Button 
          onClick={validateAllFactions} 
          disabled={isLoading}
          className="bg-warcrow-gold hover:bg-warcrow-gold/90 text-black"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Validating...' : 'Re-validate All'}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-warcrow-gold/80" />
          <span className="ml-2 text-warcrow-gold/80">Validating all factions...</span>
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Validation Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-black/50 border-warcrow-gold/30">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-warcrow-gold">
                  {validationResults.reduce((sum, r) => sum + r.perfectMatches, 0)}
                </div>
                <div className="text-sm text-warcrow-gold/70">Perfect Matches</div>
              </CardContent>
            </Card>
            
            <Card className="bg-black/50 border-warcrow-gold/30">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-warcrow-gold">
                  {validationResults.reduce((sum, r) => sum + r.mismatches.length, 0)}
                </div>
                <div className="text-sm text-warcrow-gold/70">Field Mismatches</div>
              </CardContent>
            </Card>
            
            <Card className="bg-black/50 border-warcrow-gold/30">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-warcrow-gold">
                  {validationResults.reduce((sum, r) => sum + r.missingInLocal.length, 0)}
                </div>
                <div className="text-sm text-warcrow-gold/70">Missing in Local</div>
              </CardContent>
            </Card>
            
            <Card className="bg-black/50 border-warcrow-gold/30">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-warcrow-gold">
                  {validationResults.reduce((sum, r) => sum + r.missingInCsv.length, 0)}
                </div>
                <div className="text-sm text-warcrow-gold/70">Extra in Local</div>
              </CardContent>
            </Card>
          </div>

          {/* Overall Status */}
          <Alert className={totalIssuesAcrossAllFactions === 0 ? "bg-green-900/20" : "bg-amber-900/20"}>
            {totalIssuesAcrossAllFactions === 0 ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <AlertTitle className="text-green-500">All factions validated successfully!</AlertTitle>
                <AlertDescription className="text-green-300">
                  All units match perfectly between local data and CSV files.
                </AlertDescription>
              </>
            ) : (
              <>
                <FileWarning className="h-4 w-4 text-amber-500" />
                <AlertTitle className="text-amber-500">Issues found across factions</AlertTitle>
                <AlertDescription className="text-amber-300">
                  Found {totalIssuesAcrossAllFactions} total issues across all factions.
                </AlertDescription>
              </>
            )}
          </Alert>

          {/* Faction Filter */}
          <div className="flex items-center gap-4">
            <label className="text-warcrow-gold">Filter by faction:</label>
            <select 
              value={selectedFaction} 
              onChange={(e) => setSelectedFaction(e.target.value)}
              className="bg-black border border-warcrow-gold/30 text-warcrow-gold px-3 py-1 rounded"
            >
              <option value="all">All Factions</option>
              <option value="syenann">Syenann</option>
              <option value="northern-tribes">Northern Tribes</option>
              <option value="hegemony-of-embersig">Hegemony of Embersig</option>
              <option value="scions-of-yaldabaoth">Scions of Yaldabaoth</option>
            </select>
          </div>

          {/* Detailed Results */}
          {filteredResults.map((result) => (
            <Card key={result.faction} className="bg-black/50 border-warcrow-gold/30">
              <CardHeader>
                <CardTitle className="text-warcrow-gold capitalize">
                  {result.faction.replace(/-/g, ' ')} Validation Results
                </CardTitle>
                <div className="text-sm text-warcrow-gold/70">
                  {result.csvUnits.length} CSV units | {result.localUnits.length} local units | 
                  {result.perfectMatches} perfect matches | 
                  {result.mismatches.length + result.missingInLocal.length + result.missingInCsv.length} issues
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Field Mismatches */}
                {result.mismatches.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-warcrow-gold mb-2">Field Mismatches ({result.mismatches.length})</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-warcrow-gold">Unit</TableHead>
                          <TableHead className="text-warcrow-gold">Issues</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {result.mismatches.map((mismatch, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{mismatch.unitName}</TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                {mismatch.issues.map((issue: any, issueIndex: number) => (
                                  <div key={issueIndex} className="text-sm">
                                    <Badge variant="outline" className="mr-2">{issue.field}</Badge>
                                    Local: {JSON.stringify(issue.staticValue)} → CSV: {JSON.stringify(issue.csvValue)}
                                  </div>
                                ))}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {/* Missing in Local */}
                {result.missingInLocal.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-warcrow-gold mb-2">Units in CSV but missing in Local ({result.missingInLocal.length})</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.missingInLocal.map((unitName, index) => (
                        <Badge key={index} variant="outline" className="border-red-500/50 text-red-300">
                          {unitName}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Extra in Local */}
                {result.missingInCsv.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-warcrow-gold mb-2">Units in Local but missing in CSV ({result.missingInCsv.length})</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.missingInCsv.map((unitName, index) => (
                        <Badge key={index} variant="outline" className="border-amber-500/50 text-amber-300">
                          {unitName}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Issues */}
                {result.mismatches.length === 0 && result.missingInLocal.length === 0 && result.missingInCsv.length === 0 && (
                  <div className="text-green-400 text-center py-4">
                    ✅ All units in this faction match perfectly!
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComprehensiveUnitValidator;
