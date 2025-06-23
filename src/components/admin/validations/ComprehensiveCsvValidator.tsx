
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, FileWarning, RefreshCw, Info, Search } from 'lucide-react';
import { useCsvValidation } from '@/hooks/useCsvValidation';

interface FactionConfig {
  id: string;
  name: string;
  csvFile: string;
}

const ComprehensiveCsvValidator: React.FC = () => {
  const [selectedFaction, setSelectedFaction] = useState<string>('all');
  const [isValidatingAll, setIsValidatingAll] = useState(false);

  const factions: FactionConfig[] = [
    { id: 'northern-tribes', name: 'Northern Tribes', csvFile: 'Northern Tribes.csv' },
    { id: 'syenann', name: 'Syenann', csvFile: 'The Syenann.csv' },
    { id: 'hegemony-of-embersig', name: 'Hegemony of Embersig', csvFile: 'Hegemony of Embersig.csv' },
    { id: 'scions-of-yaldabaoth', name: 'Scions of Yaldabaoth', csvFile: 'Scions of Taldabaoth.csv' }
  ];

  // Create validation hooks for each faction
  const validationHooks = factions.reduce((acc, faction) => {
    acc[faction.id] = useCsvValidation(faction.id, faction.csvFile);
    return acc;
  }, {} as Record<string, ReturnType<typeof useCsvValidation>>);

  // Validate all factions
  const validateAllFactions = async () => {
    setIsValidatingAll(true);
    console.log('Starting comprehensive CSV validation');
    
    // Trigger validation for all factions
    const validationPromises = factions.map(faction => 
      validationHooks[faction.id].validateFaction()
    );
    
    await Promise.all(validationPromises);
    setIsValidatingAll(false);
    console.log('Comprehensive validation completed');
  };

  // Get validation summary
  const getValidationSummary = () => {
    const validations = factions.map(f => validationHooks[f.id].validationResult);
    const completedValidations = validations.filter(v => !v.isLoading && !v.error && !v.csvNotFound);
    
    const totalMissingInBuilder = completedValidations.reduce((sum, v) => sum + v.missingInBuilder.length, 0);
    const totalExtraInBuilder = completedValidations.reduce((sum, v) => sum + v.extraInBuilder.length, 0);
    const totalCsvUnits = completedValidations.reduce((sum, v) => sum + v.csvUnits.length, 0);
    const totalBuilderUnits = completedValidations.reduce((sum, v) => sum + v.builderUnits.length, 0);

    return {
      totalMissingInBuilder,
      totalExtraInBuilder,
      totalCsvUnits,
      totalBuilderUnits,
      factionsValidated: completedValidations.length,
      hasIssues: totalMissingInBuilder > 0 || totalExtraInBuilder > 0
    };
  };

  const summary = getValidationSummary();
  const anyLoading = factions.some(f => validationHooks[f.id].validationResult.isLoading) || isValidatingAll;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-warcrow-gold">Comprehensive CSV Unit Validation</h1>
          <p className="text-warcrow-gold/70 mt-2">
            Compare CSV reference data with army builder units to identify missing units like Mounted Hetman.
          </p>
        </div>
        <Button 
          onClick={validateAllFactions}
          disabled={anyLoading}
          className="bg-warcrow-gold hover:bg-warcrow-gold/90 text-black"
        >
          <Search className="h-4 w-4 mr-2" />
          {anyLoading ? 'Validating...' : 'Validate All Factions'}
        </Button>
      </div>

      {/* Summary Card */}
      {summary.factionsValidated > 0 && (
        <Card className="bg-black/50 border-warcrow-gold/30">
          <CardHeader>
            <CardTitle className="text-warcrow-gold flex items-center gap-2">
              {summary.hasIssues ? (
                <AlertCircle className="h-5 w-5 text-amber-500" />
              ) : (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              )}
              Validation Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-warcrow-accent/20 rounded-lg border border-warcrow-gold/20">
                <div className="text-2xl font-bold text-amber-400">{summary.totalMissingInBuilder}</div>
                <div className="text-sm text-warcrow-gold/70">Missing in Builder</div>
              </div>
              <div className="p-3 bg-warcrow-accent/20 rounded-lg border border-warcrow-gold/20">
                <div className="text-2xl font-bold text-blue-400">{summary.totalExtraInBuilder}</div>
                <div className="text-sm text-warcrow-gold/70">Extra in Builder</div>
              </div>
              <div className="p-3 bg-warcrow-accent/20 rounded-lg border border-warcrow-gold/20">
                <div className="text-2xl font-bold text-warcrow-gold">{summary.totalCsvUnits}</div>
                <div className="text-sm text-warcrow-gold/70">Total CSV Units</div>
              </div>
              <div className="p-3 bg-warcrow-accent/20 rounded-lg border border-warcrow-gold/20">
                <div className="text-2xl font-bold text-warcrow-gold">{summary.factionsValidated}</div>
                <div className="text-sm text-warcrow-gold/70">Factions Validated</div>
              </div>
            </div>
            
            {summary.hasIssues && (
              <Alert className="mt-4 bg-amber-900/20 border-amber-500/50">
                <FileWarning className="h-4 w-4 text-amber-500" />
                <AlertTitle className="text-amber-500">Issues Found</AlertTitle>
                <AlertDescription className="text-amber-300">
                  Found {summary.totalMissingInBuilder} units missing from the army builder and {summary.totalExtraInBuilder} extra units.
                  {summary.totalMissingInBuilder > 0 && " This could explain why some users can't see certain units like Mounted Hetman."}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Faction Tabs */}
      <Tabs value={selectedFaction} onValueChange={setSelectedFaction} className="w-full">
        <TabsList className="w-full bg-black border border-warcrow-gold/30 mb-4 p-1 rounded-md">
          <TabsTrigger value="all" className="hover:bg-warcrow-gold/20 hover:text-warcrow-gold data-[state=active]:bg-warcrow-gold/20 data-[state=active]:text-warcrow-gold">
            All Factions
          </TabsTrigger>
          {factions.map(faction => (
            <TabsTrigger 
              key={faction.id}
              value={faction.id}
              className="hover:bg-warcrow-gold/20 hover:text-warcrow-gold data-[state=active]:bg-warcrow-gold/20 data-[state=active]:text-warcrow-gold"
            >
              {faction.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all">
          <div className="grid gap-4">
            {factions.map(faction => {
              const validation = validationHooks[faction.id].validationResult;
              
              return (
                <Card key={faction.id} className="bg-black/50 border-warcrow-gold/30">
                  <CardHeader>
                    <CardTitle className="text-warcrow-gold flex items-center justify-between">
                      {faction.name}
                      <div className="flex items-center gap-2">
                        {validation.isLoading && <RefreshCw className="h-4 w-4 animate-spin" />}
                        {validation.missingInBuilder.length > 0 && (
                          <Badge variant="outline" className="border-amber-500 text-amber-400">
                            {validation.missingInBuilder.length} Missing
                          </Badge>
                        )}
                        {validation.csvNotFound && (
                          <Badge variant="outline" className="border-blue-500 text-blue-400">
                            No CSV
                          </Badge>
                        )}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {validation.csvNotFound ? (
                      <Alert className="bg-blue-900/20 border-blue-500/50">
                        <Info className="h-4 w-4 text-blue-500" />
                        <AlertTitle className="text-blue-500">CSV File Not Available</AlertTitle>
                        <AlertDescription className="text-blue-300">
                          CSV reference file not found for this faction.
                        </AlertDescription>
                      </Alert>
                    ) : validation.error ? (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{validation.error}</AlertDescription>
                      </Alert>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex gap-4 text-sm">
                          <span>CSV Units: <strong>{validation.csvUnits.length}</strong></span>
                          <span>Builder Units: <strong>{validation.builderUnits.length}</strong></span>
                          <span className="text-amber-400">Missing: <strong>{validation.missingInBuilder.length}</strong></span>
                        </div>
                        
                        {validation.missingInBuilder.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-amber-400 mb-1">Missing Units:</p>
                            <div className="flex flex-wrap gap-1">
                              {validation.missingInBuilder.slice(0, 5).map((unit, index) => (
                                <Badge key={index} variant="outline" className="border-amber-500/50 text-amber-300 text-xs">
                                  {unit.name}
                                </Badge>
                              ))}
                              {validation.missingInBuilder.length > 5 && (
                                <Badge variant="outline" className="border-amber-500/50 text-amber-300 text-xs">
                                  +{validation.missingInBuilder.length - 5} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {factions.map(faction => (
          <TabsContent key={faction.id} value={faction.id}>
            <FactionValidationDetail 
              validation={validationHooks[faction.id].validationResult}
              onRevalidate={() => validationHooks[faction.id].validateFaction()}
              factionName={faction.name}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

// Component for detailed faction validation view
const FactionValidationDetail: React.FC<{
  validation: any;
  onRevalidate: () => void;
  factionName: string;
}> = ({ validation, onRevalidate, factionName }) => {
  if (validation.isLoading) {
    return (
      <Card className="bg-black/50 border-warcrow-gold/30">
        <CardContent className="p-8 text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-warcrow-gold/80 mx-auto mb-2" />
          <p className="text-warcrow-gold/80">Loading and validating data...</p>
        </CardContent>
      </Card>
    );
  }

  if (validation.csvNotFound) {
    return (
      <Card className="bg-black/50 border-warcrow-gold/30">
        <CardContent className="p-6">
          <Alert className="bg-blue-900/20 border-blue-500/50">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertTitle className="text-blue-500">CSV File Not Available</AlertTitle>
            <AlertDescription className="text-blue-300">
              <p className="mb-2">The CSV reference file for {factionName} is not available in the project.</p>
              <div className="mt-3 p-3 bg-black/30 rounded border border-blue-500/20">
                <p className="text-sm font-medium text-blue-400 mb-2">Builder Units Available:</p>
                <p className="text-lg font-bold text-blue-300">{validation.builderUnits.length} units</p>
                <p className="text-xs text-blue-200 mt-1">
                  Unit data is loaded from static files in the codebase.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (validation.error) {
    return (
      <Card className="bg-black/50 border-warcrow-gold/30">
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {validation.error}
              <Button onClick={onRevalidate} variant="outline" size="sm" className="ml-4">
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-black/50 border-warcrow-gold/30">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-warcrow-gold">{validation.csvUnits.length}</div>
            <div className="text-sm text-warcrow-gold/70">Units in CSV</div>
          </CardContent>
        </Card>
        <Card className="bg-black/50 border-warcrow-gold/30">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-warcrow-gold">{validation.builderUnits.length}</div>
            <div className="text-sm text-warcrow-gold/70">Units in Builder</div>
          </CardContent>
        </Card>
        <Card className="bg-black/50 border-warcrow-gold/30">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-amber-400">{validation.missingInBuilder.length}</div>
            <div className="text-sm text-warcrow-gold/70">Missing in Builder</div>
          </CardContent>
        </Card>
      </div>

      {/* Missing Units Table */}
      {validation.missingInBuilder.length > 0 && (
        <Card className="bg-black/50 border-warcrow-gold/30">
          <CardHeader>
            <CardTitle className="text-warcrow-gold flex items-center gap-2">
              <FileWarning className="h-5 w-5 text-amber-500" />
              Missing Units in Army Builder ({validation.missingInBuilder.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-warcrow-gold">Unit Name</TableHead>
                  <TableHead className="text-warcrow-gold">Points Cost</TableHead>
                  <TableHead className="text-warcrow-gold">High Command</TableHead>
                  <TableHead className="text-warcrow-gold">Keywords</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {validation.missingInBuilder.map((unit: any, index: number) => (
                  <TableRow key={index} className="hover:bg-warcrow-background">
                    <TableCell className="font-medium">{unit.name}</TableCell>
                    <TableCell>{unit.pointsCost}</TableCell>
                    <TableCell>
                      {unit.highCommand ? (
                        <Badge variant="outline" className="border-amber-500 text-amber-400">Yes</Badge>
                      ) : (
                        <Badge variant="outline" className="border-gray-500 text-gray-400">No</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {unit.keywords.slice(0, 3).map((keyword: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-xs border-warcrow-gold/30 text-warcrow-gold/70">
                            {keyword}
                          </Badge>
                        ))}
                        {unit.keywords.length > 3 && (
                          <Badge variant="outline" className="text-xs border-warcrow-gold/30 text-warcrow-gold/70">
                            +{unit.keywords.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Success message if no missing units */}
      {validation.missingInBuilder.length === 0 && validation.csvUnits.length > 0 && (
        <Alert className="bg-green-900/20 border-green-500/50">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertTitle className="text-green-500">All Units Present</AlertTitle>
          <AlertDescription className="text-green-300">
            All {validation.csvUnits.length} units from the CSV file are available in the army builder.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ComprehensiveCsvValidator;
