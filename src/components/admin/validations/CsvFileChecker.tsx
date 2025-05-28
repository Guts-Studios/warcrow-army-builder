
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle2, XCircle, RefreshCw, FileX, Info } from 'lucide-react';
import { getFactionCsvPath, checkCsvFileExists, loadCsvFile } from '@/utils/csvValidator';

interface FileStatus {
  faction: string;
  factionName: string;
  expectedPath: string;
  exists: boolean;
  size?: number;
  error?: string;
  lastChecked: Date;
}

const CsvFileChecker: React.FC = () => {
  const [fileStatuses, setFileStatuses] = useState<FileStatus[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const factions = [
    { id: 'northern-tribes', name: 'Northern Tribes' },
    { id: 'syenann', name: 'Syenann' },
    { id: 'hegemony-of-embersig', name: 'Hegemony of Embersig' },
    { id: 'scions-of-yaldabaoth', name: 'Scions of Yaldabaoth' }
  ];

  const checkAllFiles = async () => {
    setIsChecking(true);
    const statuses: FileStatus[] = [];

    for (const faction of factions) {
      const expectedPath = getFactionCsvPath(faction.id);
      const status: FileStatus = {
        faction: faction.id,
        factionName: faction.name,
        expectedPath,
        exists: false,
        lastChecked: new Date()
      };

      try {
        console.log(`Checking CSV file for ${faction.name} at ${expectedPath}`);
        
        // Try to load the file to get more detailed information
        const fileContent = await loadCsvFile(expectedPath);
        status.exists = true;
        status.size = fileContent.length;
        
        console.log(`✓ Found CSV file for ${faction.name}, size: ${status.size} bytes`);
      } catch (error: any) {
        console.error(`✗ Failed to load CSV file for ${faction.name}:`, error.message);
        status.exists = false;
        status.error = error.message;
      }

      statuses.push(status);
    }

    setFileStatuses(statuses);
    setLastCheck(new Date());
    setIsChecking(false);
  };

  useEffect(() => {
    checkAllFiles();
  }, []);

  const allFilesExist = fileStatuses.every(status => status.exists);
  const missingFiles = fileStatuses.filter(status => !status.exists);

  return (
    <Card className="bg-black/50 border-warcrow-gold/30">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-warcrow-gold">CSV File Verification</CardTitle>
          <Button
            onClick={checkAllFiles}
            disabled={isChecking}
            variant="outline"
            size="sm"
            className="border-warcrow-gold/30 text-warcrow-gold hover:bg-warcrow-gold/10"
          >
            {isChecking ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Recheck Files
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {lastCheck && (
          <p className="text-sm text-warcrow-text/70">
            Last checked: {lastCheck.toLocaleString()}
          </p>
        )}

        {allFilesExist ? (
          <Alert className="bg-emerald-900/20 border-emerald-500/50">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <AlertTitle className="text-emerald-500">All CSV Files Found</AlertTitle>
            <AlertDescription className="text-emerald-300">
              All expected CSV reference files are accessible and loaded successfully.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="bg-red-900/20 border-red-500/50">
            <FileX className="h-4 w-4 text-red-500" />
            <AlertTitle className="text-red-500">Missing CSV Files</AlertTitle>
            <AlertDescription className="text-red-300">
              {missingFiles.length} out of {fileStatuses.length} CSV files are missing or inaccessible.
            </AlertDescription>
          </Alert>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-warcrow-gold">Faction</TableHead>
              <TableHead className="text-warcrow-gold">Expected Path</TableHead>
              <TableHead className="text-warcrow-gold">Status</TableHead>
              <TableHead className="text-warcrow-gold">Size</TableHead>
              <TableHead className="text-warcrow-gold">Error</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fileStatuses.map((status) => (
              <TableRow key={status.faction} className="hover:bg-warcrow-accent/10">
                <TableCell className="font-medium">{status.factionName}</TableCell>
                <TableCell>
                  <code className="text-xs bg-black/50 px-1 rounded">
                    {status.expectedPath}
                  </code>
                </TableCell>
                <TableCell>
                  {status.exists ? (
                    <Badge variant="outline" className="border-emerald-500 text-emerald-400">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Found
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-red-500 text-red-400">
                      <XCircle className="mr-1 h-3 w-3" />
                      Missing
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {status.size ? `${status.size.toLocaleString()} bytes` : '-'}
                </TableCell>
                <TableCell>
                  {status.error && (
                    <span className="text-red-400 text-xs">{status.error}</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Alert className="bg-blue-900/20 border-blue-500/50">
          <Info className="h-4 w-4 text-blue-500" />
          <AlertTitle className="text-blue-500">File Location Information</AlertTitle>
          <AlertDescription className="text-blue-300">
            <div className="space-y-2">
              <p>CSV files should be located in the <code className="bg-black/50 px-1 rounded">/public/data/reference-csv/units/</code> directory.</p>
              <p>Expected file names:</p>
              <ul className="list-disc list-inside text-sm space-y-1 mt-2">
                <li>Northern Tribes.csv</li>
                <li>The Syenann.csv</li>
                <li>Hegemony of Embersig.csv</li>
                <li>Scions of Taldabaoth.csv</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default CsvFileChecker;
