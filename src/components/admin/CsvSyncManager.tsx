import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { 
  Database, 
  RefreshCw, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Download,
  Loader2,
  Copy,
  Folder,
  Save,
  FileDown,
  Github,
  CloudUpload,
  Info
} from 'lucide-react';
import { 
  generateFactionFiles, 
  validateCsvStaticSync, 
  loadFactionCsvData 
} from '@/utils/csvToStaticGenerator';
import { units as localUnits } from '@/data/factions';
import { normalizeFactionId } from '@/utils/unitManagement';
import { supabase } from '@/integrations/supabase/client';

interface FilePathInfo {
  key: string;
  label: string;
  path: string;
  description: string;
}

const CsvSyncManager: React.FC = () => {
  const [selectedFaction, setSelectedFaction] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [generatedFiles, setGeneratedFiles] = useState<any>(null);
  const [validationResults, setValidationResults] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [csvNotFound, setCsvNotFound] = useState(false);
  
  const factions = [
    { id: 'northern-tribes', name: 'Northern Tribes' },
    { id: 'syenann', name: 'Syenann' },
    { id: 'hegemony-of-embersig', name: 'Hegemony of Embersig' },
    { id: 'scions-of-yaldabaoth', name: 'Scions of Yaldabaoth' }
  ];

  // Generate file path information for the selected faction
  const getFilePathInfo = (factionId: string): FilePathInfo[] => {
    if (!factionId) return [];
    
    const baseFiles = [
      {
        key: 'troops',
        label: 'Troops',
        path: `src/data/factions/${factionId}/troops.ts`,
        description: 'Contains all troop units for this faction'
      },
      {
        key: 'characters',
        label: 'Characters', 
        path: `src/data/factions/${factionId}/characters.ts`,
        description: 'Contains all character units for this faction'
      },
      {
        key: 'highCommand',
        label: 'High Command',
        path: `src/data/factions/${factionId}/highCommand.ts`,
        description: 'Contains all high command units for this faction'
      }
    ];

    // Add companions file if it exists in generated files
    if (generatedFiles?.companions && generatedFiles.companions.trim() !== `import { Unit } from "@/types/army";

export const ${factionId.replace(/-/g, '')}Companions: Unit[] = [
];
`) {
      baseFiles.push({
        key: 'companions',
        label: 'Companions',
        path: `src/data/factions/${factionId}/companions.ts`,
        description: 'Contains all companion units for this faction'
      });
    }

    baseFiles.push({
      key: 'index',
      label: 'Index',
      path: `src/data/factions/${factionId}/index.ts`,
      description: 'Main faction file that exports all units combined'
    });

    return baseFiles;
  };

  const copyToClipboard = (content: string, fileName: string) => {
    navigator.clipboard.writeText(content);
    toast.success(`${fileName} copied to clipboard!`);
  };

  const copyPathToClipboard = (path: string) => {
    navigator.clipboard.writeText(path);
    toast.success(`File path copied to clipboard!`);
  };

  const downloadFile = (content: string, fileName: string) => {
    try {
      const blob = new Blob([content], { type: 'text/typescript' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(`${fileName} downloaded successfully!`);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error(`Failed to download ${fileName}`);
    }
  };

  const downloadAllFiles = () => {
    if (!generatedFiles) {
      toast.error('No files to download');
      return;
    }

    const filePathInfo = getFilePathInfo(selectedFaction);
    
    filePathInfo.forEach((fileInfo) => {
      if (generatedFiles[fileInfo.key]) {
        const fileName = fileInfo.path.split('/').pop() || `${fileInfo.key}.ts`;
        downloadFile(generatedFiles[fileInfo.key], fileName);
      }
    });

    toast.success('All files downloaded!');
  };

  const handleGenerateFiles = async () => {
    if (!selectedFaction) {
      toast.error('Please select a faction first');
      return;
    }

    setIsLoading(true);
    setProgress(0);
    setGeneratedFiles(null);
    setValidationResults(null);
    setCsvNotFound(false);

    try {
      setProgress(25);
      toast.info('Loading CSV data...');
      
      const files = await generateFactionFiles(selectedFaction);
      setGeneratedFiles(files);
      setProgress(75);
      
      toast.info('Validating against current static data...');
      
      // Get current static units for validation
      const normalizedFactionId = normalizeFactionId(selectedFaction);
      const currentStaticUnits = localUnits.filter(unit => {
        const unitFactionId = unit.faction_id ? normalizeFactionId(unit.faction_id) : normalizeFactionId(unit.faction);
        return unitFactionId === normalizedFactionId;
      });
      
      const validation = await validateCsvStaticSync(selectedFaction, currentStaticUnits);
      setValidationResults(validation);
      setProgress(100);
      
      toast.success('Files generated and validated successfully!');
    } catch (error: any) {
      console.error('Error generating files:', error);
      if (error.message?.includes('404') || error.message?.includes('Failed to fetch CSV')) {
        setCsvNotFound(true);
        toast.warning('CSV reference file not found - validation disabled');
      } else {
        toast.error(`Failed to generate files: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidateOnly = async () => {
    if (!selectedFaction) {
      toast.error('Please select a faction first');
      return;
    }

    setIsLoading(true);
    setValidationResults(null);
    setCsvNotFound(false);

    try {
      const normalizedFactionId = normalizeFactionId(selectedFaction);
      const currentStaticUnits = localUnits.filter(unit => {
        const unitFactionId = unit.faction_id ? normalizeFactionId(unit.faction_id) : normalizeFactionId(unit.faction);
        return unitFactionId === normalizedFactionId;
      });
      
      const validation = await validateCsvStaticSync(selectedFaction, currentStaticUnits);
      setValidationResults(validation);
      
      const totalIssues = validation.missingInStatic.length + validation.extraInStatic.length + validation.mismatches.length;
      
      if (totalIssues === 0) {
        toast.success('All data is in sync!');
      } else {
        toast.warning(`Found ${totalIssues} synchronization issues`);
      }
    } catch (error: any) {
      console.error('Error validating:', error);
      if (error.message?.includes('404') || error.message?.includes('Failed to fetch CSV')) {
        setCsvNotFound(true);
        toast.warning('CSV reference file not found - validation disabled');
      } else {
        toast.error(`Validation failed: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncToGithub = async () => {
    if (!generatedFiles || !selectedFaction) {
      toast.error('No files to sync. Generate files first.');
      return;
    }

    setIsSyncing(true);
    
    try {
      toast.info('Syncing files to GitHub...');
      
      const { data, error } = await supabase.functions.invoke('sync-files-to-github', {
        body: {
          files: generatedFiles,
          factionId: selectedFaction
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.errors && data.errors.length > 0) {
        console.warn('Some files had errors:', data.errors);
        toast.warning(`Synced ${data.updatedFiles.length} files with ${data.errors.length} errors`);
      } else {
        toast.success(`Successfully synced ${data.updatedFiles.length} files to GitHub!`);
      }

    } catch (error: any) {
      console.error('Error syncing to GitHub:', error);
      toast.error(`Failed to sync to GitHub: ${error.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const filePathInfo = getFilePathInfo(selectedFaction);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-warcrow-gold">CSV to Static File Synchronization</h1>
          <p className="text-warcrow-text/70 mt-1">
            Generate TypeScript files from CSV data and validate synchronization
          </p>
        </div>
      </div>

      {csvNotFound && (
        <Alert className="bg-blue-900/20 border-blue-500/50">
          <Info className="h-4 w-4 text-blue-500" />
          <AlertTitle className="text-blue-500">CSV Reference Files Not Available</AlertTitle>
          <AlertDescription className="text-blue-300">
            <p className="mb-2">CSV reference files are not available in this project.</p>
            <p className="text-sm">
              This tool is designed to work with CSV files located in <code className="bg-black/50 px-1 rounded">/data/reference-csv/units/</code>
            </p>
            <p className="text-xs text-blue-200 mt-2">
              Unit data is currently managed through static TypeScript files in the codebase.
            </p>
          </AlertDescription>
        </Alert>
      )}

      <Card className="p-6 bg-black/50 border-warcrow-gold/30">
        <div className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-warcrow-gold mb-2">
                Select Faction
              </label>
              <Select value={selectedFaction} onValueChange={setSelectedFaction}>
                <SelectTrigger className="bg-warcrow-accent/50 border-warcrow-gold/30">
                  <SelectValue placeholder="Choose a faction to sync" />
                </SelectTrigger>
                <SelectContent className="bg-warcrow-accent border-warcrow-gold/30">
                  {factions.map((faction) => (
                    <SelectItem key={faction.id} value={faction.id}>
                      {faction.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={handleValidateOnly}
                disabled={!selectedFaction || isLoading}
                variant="outline"
                className="border-warcrow-gold/30 text-warcrow-gold hover:bg-warcrow-gold/10"
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <AlertTriangle className="mr-2 h-4 w-4" />}
                Validate Only
              </Button>
              
              <Button
                onClick={handleGenerateFiles}
                disabled={!selectedFaction || isLoading}
                className="bg-warcrow-gold hover:bg-warcrow-gold/80 text-black"
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
                Generate Files
              </Button>
            </div>
          </div>

          {isLoading && progress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-warcrow-text/70">Processing...</span>
                <span className="text-warcrow-gold">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </div>
      </Card>

      {/* File Path Information Panel */}
      {selectedFaction && filePathInfo.length > 0 && (
        <Card className="p-6 bg-black/50 border-warcrow-gold/30">
          <h2 className="text-lg font-semibold text-warcrow-gold mb-4 flex items-center">
            <Folder className="mr-2 h-5 w-5" />
            Target File Paths for {factions.find(f => f.id === selectedFaction)?.name}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filePathInfo.map((fileInfo) => (
              <div key={fileInfo.key} className="p-3 bg-black/30 border border-warcrow-gold/20 rounded">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium text-warcrow-gold">{fileInfo.label}</div>
                    <div className="text-xs text-warcrow-text/70">{fileInfo.description}</div>
                  </div>
                  <Button
                    onClick={() => copyPathToClipboard(fileInfo.path)}
                    variant="ghost"
                    size="sm"
                    className="text-warcrow-gold hover:bg-warcrow-gold/10 p-1"
                    title="Copy file path"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <div className="font-mono text-xs text-warcrow-text bg-black/50 p-2 rounded border border-warcrow-gold/10">
                  {fileInfo.path}
                </div>
              </div>
            ))}
          </div>
          
          <Alert className="mt-4 bg-blue-900/20 border-blue-500/50">
            <AlertTriangle className="h-4 w-4 text-blue-500" />
            <AlertTitle className="text-blue-500">File Update Instructions</AlertTitle>
            <AlertDescription className="text-blue-300">
              After generating files, you can either download them individually or use the "Download All Files" button. 
              Then replace the corresponding files at the paths shown above. Note: Companions file is only generated if companion units exist in the CSV.
            </AlertDescription>
          </Alert>
        </Card>
      )}

      {/* Validation Results Panel */}
      {validationResults && !csvNotFound && (
        <Card className="p-6 bg-black/50 border-warcrow-gold/30">
          <h2 className="text-lg font-semibold text-warcrow-gold mb-4 flex items-center">
            <Database className="mr-2 h-5 w-5" />
            Validation Results
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">
                {validationResults.missingInStatic.length}
              </div>
              <div className="text-sm text-warcrow-text/70">Missing in Static</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {validationResults.extraInStatic.length}
              </div>
              <div className="text-sm text-warcrow-text/70">Extra in Static</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">
                {validationResults.mismatches.length}
              </div>
              <div className="text-sm text-warcrow-text/70">Field Mismatches</div>
            </div>
          </div>

          <Tabs defaultValue="missing" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-black border-warcrow-gold/30">
              <TabsTrigger value="missing">Missing in Static</TabsTrigger>
              <TabsTrigger value="extra">Extra in Static</TabsTrigger>
              <TabsTrigger value="mismatches">Mismatches</TabsTrigger>
            </TabsList>
            
            <TabsContent value="missing" className="space-y-2">
              {validationResults.missingInStatic.length === 0 ? (
                <Alert className="bg-emerald-900/20 border-emerald-500/50">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <AlertTitle className="text-emerald-500">No Missing Units</AlertTitle>
                  <AlertDescription className="text-emerald-300">
                    All CSV units are present in static files.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-2">
                  {validationResults.missingInStatic.map((unit: any) => (
                    <div key={unit.id} className="p-3 bg-red-900/20 border border-red-500/30 rounded">
                      <div className="font-medium text-red-300">{unit.name}</div>
                      <div className="text-sm text-red-400/70">
                        ID: {unit.id} | Points: {unit.pointsCost} | Type: {unit.type}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="extra" className="space-y-2">
              {validationResults.extraInStatic.length === 0 ? (
                <Alert className="bg-emerald-900/20 border-emerald-500/50">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <AlertTitle className="text-emerald-500">No Extra Units</AlertTitle>
                  <AlertDescription className="text-emerald-300">
                    No units exist in static files that aren't in CSV.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-2">
                  {validationResults.extraInStatic.map((unit: any) => (
                    <div key={unit.id} className="p-3 bg-yellow-900/20 border border-yellow-500/30 rounded">
                      <div className="font-medium text-yellow-300">{unit.name}</div>
                      <div className="text-sm text-yellow-400/70">
                        ID: {unit.id} | Points: {unit.pointsCost}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="mismatches" className="space-y-2">
              {validationResults.mismatches.length === 0 ? (
                <Alert className="bg-emerald-900/20 border-emerald-500/50">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <AlertTitle className="text-emerald-500">No Field Mismatches</AlertTitle>
                  <AlertDescription className="text-emerald-300">
                    All unit fields match between CSV and static data.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-2">
                  {validationResults.mismatches.map((mismatch: any, index: number) => (
                    <div key={index} className="p-3 bg-orange-900/20 border border-orange-500/30 rounded">
                      <div className="font-medium text-orange-300">{mismatch.unit}</div>
                      <div className="text-sm text-orange-400/70">
                        Field: <span className="font-mono">{mismatch.field}</span> | 
                        CSV: <span className="font-mono">{String(mismatch.csvValue)}</span> | 
                        Static: <span className="font-mono">{String(mismatch.staticValue)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      )}

      {/* Generated Files Panel */}
      {generatedFiles && (
        <Card className="p-6 bg-black/50 border-warcrow-gold/30">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-warcrow-gold flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Generated Files
            </h2>
            
            <div className="flex gap-2">
              <Button
                onClick={handleSyncToGithub}
                disabled={isSyncing}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isSyncing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Github className="mr-2 h-4 w-4" />
                )}
                {isSyncing ? 'Syncing...' : 'Sync to GitHub'}
              </Button>
              
              <Button
                onClick={downloadAllFiles}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <FileDown className="mr-2 h-4 w-4" />
                Download All Files
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="troops" className="w-full">
            <TabsList className={`grid w-full ${filePathInfo.length === 4 ? 'grid-cols-4' : filePathInfo.length === 5 ? 'grid-cols-5' : 'grid-cols-4'} bg-black border-warcrow-gold/30`}>
              {filePathInfo.map((fileInfo) => (
                <TabsTrigger key={fileInfo.key} value={fileInfo.key}>
                  {fileInfo.label}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {filePathInfo.map((fileInfo) => (
              <TabsContent key={fileInfo.key} value={fileInfo.key} className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1 flex-1">
                    <h3 className="text-warcrow-gold font-medium flex items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      {fileInfo.label}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-warcrow-text/70">Path:</span>
                      <code className="text-xs bg-black/50 px-2 py-1 rounded border border-warcrow-gold/20 text-warcrow-text">
                        {fileInfo.path}
                      </code>
                      <Button
                        onClick={() => copyPathToClipboard(fileInfo.path)}
                        variant="ghost"
                        size="sm"
                        className="text-warcrow-gold hover:bg-warcrow-gold/10 p-1"
                        title="Copy file path"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-warcrow-text/60">{fileInfo.description}</p>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button
                      onClick={() => copyToClipboard(generatedFiles[fileInfo.key], `${fileInfo.key}.ts`)}
                      variant="outline"
                      size="sm"
                      className="border-warcrow-gold/30 text-warcrow-gold hover:bg-warcrow-gold/10"
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Code
                    </Button>
                    
                    <Button
                      onClick={() => {
                        const fileName = fileInfo.path.split('/').pop() || `${fileInfo.key}.ts`;
                        downloadFile(generatedFiles[fileInfo.key], fileName);
                      }}
                      variant="default"
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
                
                <Textarea
                  value={generatedFiles[fileInfo.key]}
                  readOnly
                  className="font-mono text-xs h-96 bg-black/80 border-warcrow-gold/20 text-warcrow-text"
                />
              </TabsContent>
            ))}
          </Tabs>
          
          <Alert className="mt-4 bg-blue-900/20 border-blue-500/50">
            <AlertTriangle className="h-4 w-4 text-blue-500" />
            <AlertTitle className="text-blue-500">Implementation Options</AlertTitle>
            <AlertDescription className="text-blue-300">
              <div className="space-y-2">
                <p><strong>Option 1 - GitHub Sync:</strong> Use "Sync to GitHub" to automatically commit files to your repository at the correct paths.</p>
                <p><strong>Option 2 - Manual Download:</strong> Use "Download All Files" to get files locally, then manually replace the corresponding files at the paths shown above.</p>
                <p className="text-xs text-blue-200 mt-2">
                  Always update CSV files first, then regenerate static files. Run validation again after syncing to confirm synchronization. The companions file is only generated when companion units exist.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        </Card>
      )}
    </div>
  );
};

export default CsvSyncManager;
