import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { units as staticUnits } from '@/data/factions';
import { parseCsvContent, compareUnitWithCsv, CsvUnit, findMatchingUnit } from '@/utils/csvValidator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { normalizeFactionId } from '@/utils/unitManagement';

interface ValidationProps {
  faction: string;
}

interface MismatchDetail {
  unitId: string;
  unitName: string;
  field: string;
  staticValue: any;
  csvValue: any;
}

const UnitCsvValidator: React.FC<ValidationProps> = ({ faction }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mismatches, setMismatches] = useState<MismatchDetail[]>([]);
  const [matchedUnits, setMatchedUnits] = useState<number>(0);
  const [totalCsvUnits, setTotalCsvUnits] = useState<number>(0);
  const [totalStaticUnits, setTotalStaticUnits] = useState<number>(0);
  const [missingUnits, setMissingUnits] = useState<string[]>([]);

  // Map faction IDs to CSV file names
  const getFactionFileName = (factionId: string): string => {
    const normalized = normalizeFactionId(factionId);
    const factionFileMap: Record<string, string> = {
      'syenann': 'The Syenann.csv',
      'northern-tribes': 'Northern Tribes.csv',
      'hegemony-of-embersig': 'Hegemony of Embersig.csv',
      'scions-of-yaldabaoth': 'Scions of Taldabaoth.csv'
    };
    return factionFileMap[normalized] || '';
  };

  // Get all static units for this faction
  const getStaticUnitsForFaction = (factionId: string) => {
    const normalized = normalizeFactionId(factionId);
    return staticUnits.filter(unit => {
      // First check for faction_id match if available
      if (unit.faction_id) {
        return normalizeFactionId(unit.faction_id) === normalized;
      }
      // Fall back to faction field
      return normalizeFactionId(unit.faction) === normalized;
    });
  };

  useEffect(() => {
    const validateUnits = async () => {
      setIsLoading(true);
      setError(null);
      setMismatches([]);
      setMissingUnits([]);
      
      try {
        const fileName = getFactionFileName(faction);
        if (!fileName) {
          throw new Error(`No CSV file found for faction: ${faction}`);
        }

        // 1. Fetch CSV file content
        const filePath = `/data/reference-csv/units/${fileName}`;
        const response = await fetch(filePath);
        if (!response.ok) {
          throw new Error(`Failed to load CSV file: ${response.status} ${response.statusText}`);
        }

        // 2. Parse CSV content
        const csvContent = await response.text();
        const csvUnits = await parseCsvContent(csvContent);
        setTotalCsvUnits(csvUnits.length);

        // 3. Get static units for this faction
        const staticFactionUnits = getStaticUnitsForFaction(faction);
        setTotalStaticUnits(staticFactionUnits.length);

        // 4. Compare CSV data with static data
        const newMismatches: MismatchDetail[] = [];
        const notFoundUnits: string[] = [];
        let matched = 0;

        for (const csvUnit of csvUnits) {
          // Try to match this CSV unit with a static unit - now with faction_id support
          const staticUnit = findMatchingUnit(csvUnit, staticFactionUnits);
          
          if (staticUnit) {
            // We found a match, check for differences
            const unitMismatches = compareUnitWithCsv(staticUnit, csvUnit);
            
            if (unitMismatches.length > 0) {
              // There are mismatches between CSV and static data
              unitMismatches.forEach(mismatch => {
                newMismatches.push({
                  unitId: staticUnit.id,
                  unitName: staticUnit.name,
                  field: mismatch.field,
                  staticValue: mismatch.staticValue,
                  csvValue: mismatch.csvValue
                });
              });
            } else {
              matched++;
            }
          } else {
            // CSV unit not found in static data
            notFoundUnits.push(csvUnit.name);
          }
        }

        // 5. Check for static units that don't have a CSV entry - now with faction_id support
        const csvUnitNames = csvUnits.map(u => u.name.toLowerCase());
        const staticOnlyUnits = staticFactionUnits
          .filter(unit => !csvUnitNames.includes(unit.name.toLowerCase()))
          .map(unit => unit.name);

        setMismatches(newMismatches);
        setMissingUnits([...notFoundUnits, ...staticOnlyUnits]);
        setMatchedUnits(matched);
      } catch (err) {
        console.error('Error validating units:', err);
        setError(err instanceof Error ? err.message : 'Unknown error validating units');
      } finally {
        setIsLoading(false);
      }
    };

    validateUnits();
  }, [faction]);

  return (
    <Card className="bg-black/50 border-warcrow-gold/30">
      <CardHeader>
        <CardTitle className="text-warcrow-gold">CSV Unit Data Validation: {faction}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-warcrow-gold/70">Loading and validating unit data...</p>
        ) : error ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-warcrow-accent/20 rounded-lg border border-warcrow-gold/20">
                <div className="text-2xl font-bold text-warcrow-gold">{matchedUnits}</div>
                <div className="text-sm text-warcrow-gold/70">Perfect Matches</div>
              </div>
              
              <div className="p-4 bg-warcrow-accent/20 rounded-lg border border-warcrow-gold/20">
                <div className="text-2xl font-bold text-warcrow-gold">{mismatches.length}</div>
                <div className="text-sm text-warcrow-gold/70">Field Mismatches</div>
              </div>
              
              <div className="p-4 bg-warcrow-accent/20 rounded-lg border border-warcrow-gold/20">
                <div className="text-2xl font-bold text-warcrow-gold">{missingUnits.length}</div>
                <div className="text-sm text-warcrow-gold/70">Missing Units</div>
              </div>
            </div>
            
            <Alert className={mismatches.length === 0 && missingUnits.length === 0 ? "bg-green-900/20" : "bg-amber-900/20"}>
              {mismatches.length === 0 && missingUnits.length === 0 ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <AlertTitle className="text-green-500">All data valid!</AlertTitle>
                  <AlertDescription className="text-green-300">
                    All {matchedUnits} units match perfectly between CSV and code.
                  </AlertDescription>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <AlertTitle className="text-amber-500">Data mismatches found</AlertTitle>
                  <AlertDescription className="text-amber-300">
                    Found {mismatches.length} field mismatches and {missingUnits.length} missing units.
                  </AlertDescription>
                </>
              )}
            </Alert>

            {mismatches.length > 0 && (
              <>
                <h3 className="font-semibold text-warcrow-gold mt-6">Field Mismatches</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-warcrow-gold">Unit</TableHead>
                      <TableHead className="text-warcrow-gold">Field</TableHead>
                      <TableHead className="text-warcrow-gold">Code Value</TableHead>
                      <TableHead className="text-warcrow-gold">CSV Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mismatches.map((mismatch, index) => (
                      <TableRow key={index} className="hover:bg-warcrow-background">
                        <TableCell className="font-medium">{mismatch.unitName}</TableCell>
                        <TableCell>{mismatch.field}</TableCell>
                        <TableCell>
                          {typeof mismatch.staticValue === 'object' 
                            ? JSON.stringify(mismatch.staticValue)
                            : String(mismatch.staticValue)
                          }
                        </TableCell>
                        <TableCell>
                          {typeof mismatch.csvValue === 'object'
                            ? JSON.stringify(mismatch.csvValue)
                            : String(mismatch.csvValue)
                          }
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            )}

            {missingUnits.length > 0 && (
              <>
                <h3 className="font-semibold text-warcrow-gold mt-6">Missing Units</h3>
                <div className="flex flex-wrap gap-2">
                  {missingUnits.map((unit, index) => (
                    <Badge key={index} variant="outline" className="border-amber-500/50 text-amber-300">
                      {unit}
                    </Badge>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UnitCsvValidator;
