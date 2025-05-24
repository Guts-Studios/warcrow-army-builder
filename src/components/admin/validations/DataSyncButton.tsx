
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Database, RefreshCw, Github } from 'lucide-react';
import { findMissingUnits, generateUnitCode } from '@/utils/unitSyncUtility';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { TableCell, TableRow } from '@/components/ui/table';

type SyncStatus = {
  statusMessage: string;
  progress: number;
  syncedUnits: { id: string; name: string; faction: string }[];
  errors: string[];
};

interface DataSyncButtonProps {
  factionId: string;
  onSync?: () => void;
  unitWithWarning?: {
    id: string;
    name: string;
    warningMessage: string;
  };
}

const DataSyncButton: React.FC<DataSyncButtonProps> = ({ 
  factionId, 
  onSync,
  unitWithWarning 
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [codePreview, setCodePreview] = useState<string>('');

  const handleSync = async () => {
    if (!factionId) {
      toast.error('Please select a faction first');
      return;
    }

    setIsSyncing(true);
    setSyncStatus({ 
      statusMessage: 'Connecting to database...',
      progress: 10,
      syncedUnits: [],
      errors: []
    });

    try {
      // First, find missing or mismatched units
      setSyncStatus(prev => prev ? { 
        ...prev, 
        statusMessage: 'Comparing data with GitHub source...',
        progress: 30 
      } : null);
      
      const comparisonResult = await findMissingUnits(factionId);
      
      // Check if everything is in sync - no missing units in either direction
      if (comparisonResult.onlyInDatabase.length === 0 && 
          comparisonResult.onlyInLocalData.length === 0) {
        
        setSyncStatus(prev => prev ? { 
          ...prev, 
          statusMessage: 'All data is in sync!',
          progress: 100 
        } : null);
        
        toast.success('All unit data is already in sync!');
        setIsSyncing(false);
        return;
      }

      // Handle missing units or mismatches
      setSyncStatus(prev => prev ? { 
        ...prev, 
        statusMessage: 'Processing data differences...',
        progress: 60,
        syncedUnits: [...(comparisonResult.onlyInDatabase || [])],
      } : null);

      // For demo purposes we're not actually syncing, just showing what would be synced
      // In a real implementation, you would sync the data here
      
      if (unitWithWarning) {
        // Generate code for the unit with warning
        const unitInDbOnly = comparisonResult.onlyInDatabase.find(
          u => u.name === unitWithWarning.name
        );
        
        if (unitInDbOnly) {
          const generatedCode = generateUnitCode(unitInDbOnly);
          setCodePreview(generatedCode);
        }
      }

      setTimeout(() => {
        setSyncStatus(prev => prev ? { 
          ...prev, 
          statusMessage: 'Sync completed with differences found',
          progress: 100 
        } : null);
        
        toast.success('Data comparison completed!');
        setDialogOpen(true);
        if (onSync) onSync();
      }, 1500);
      
    } catch (error: any) {
      console.error('Sync error:', error);
      toast.error(`Sync failed: ${error.message || 'Unknown error'}`);
      setSyncStatus(prev => prev ? { 
        ...prev, 
        statusMessage: 'Sync failed',
        progress: 100,
        errors: [...(prev?.errors || []), error.message || 'Unknown error'] 
      } : null);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={handleSync}
        disabled={isSyncing || !factionId}
        className="border-warcrow-gold/30 text-warcrow-gold hover:bg-warcrow-gold/10 flex"
        size="sm"
      >
        {isSyncing ? (
          <>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Syncing...
          </>
        ) : (
          <>
            <Database className="h-4 w-4 mr-2" />
            Sync with GitHub
          </>
        )}
      </Button>

      {syncStatus && isSyncing && (
        <div className="mt-2 space-y-2">
          <div className="flex justify-between text-xs">
            <span>{syncStatus.statusMessage}</span>
            <span className="font-medium">{syncStatus.progress}%</span>
          </div>
          <Progress value={syncStatus.progress} className="h-1.5" />
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl bg-black border-warcrow-gold/30">
          <DialogHeader>
            <DialogTitle className="text-warcrow-gold flex items-center">
              <Github className="mr-2 h-5 w-5" />
              GitHub Data Comparison Results
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {unitWithWarning && (
              <div className="border border-amber-500/30 bg-amber-900/10 p-3 rounded-md">
                <h3 className="text-amber-400 font-medium mb-2 flex items-center">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Warning Details for {unitWithWarning.name}
                </h3>
                <p className="text-sm text-amber-300/80">
                  This unit exists in the database but is missing from your local data files.
                  Add the following code to your faction unit files to resolve this warning:
                </p>
                
                <div className="mt-3">
                  <Textarea 
                    value={codePreview} 
                    readOnly 
                    className="font-mono text-xs h-48 bg-black/80 border-amber-500/20 text-warcrow-text"
                  />
                </div>
                
                <p className="mt-2 text-xs text-amber-300/60">
                  Add this unit to your local data file at <code>src/data/factions/{factionId}.ts</code>
                </p>
              </div>
            )}
            
            <div>
              <h3 className="text-warcrow-gold font-medium mb-2">Next Steps:</h3>
              <ol className="list-decimal ml-5 space-y-1 text-sm text-warcrow-text/80">
                <li>Copy the generated code above</li>
                <li>Add it to your local faction unit file</li>
                <li>Commit and push the changes to GitHub</li>
                <li>Run the validation again to verify the warning is resolved</li>
              </ol>
            </div>
            
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(codePreview);
                  toast.success('Code copied to clipboard!');
                }}
                className="mr-2 border-warcrow-gold/30 text-warcrow-gold"
                size="sm"
              >
                Copy Code
              </Button>
              
              <DialogClose asChild>
                <Button variant="outline" size="sm">
                  Close
                </Button>
              </DialogClose>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DataSyncButton;
