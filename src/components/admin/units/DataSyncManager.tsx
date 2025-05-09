
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Database, Download, FileJson } from 'lucide-react';
import { toast } from 'sonner';
import { syncUnitDataToFiles, SyncStats } from '@/utils/admin/syncUnitData';
import { Progress } from '@/components/ui/progress';

const DataSyncManager: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStats | null>(null);
  const [progress, setProgress] = useState(0);

  const handleSync = async () => {
    setIsSyncing(true);
    setProgress(10);
    
    try {
      // Simulate progress steps
      const timer = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 300);
      
      // Execute the actual sync
      const results = await syncUnitDataToFiles();
      
      clearInterval(timer);
      setProgress(100);
      setSyncStatus(results);
      
      if (results.errors.length > 0) {
        toast.error(`Sync completed with ${results.errors.length} errors`);
      } else {
        toast.success('Unit data sync completed successfully!');
      }
    } catch (error: any) {
      toast.error(`Sync failed: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSyncing(false);
    }
  };
  
  return (
    <Card className="p-4 space-y-4 bg-black border-warcrow-gold/30">
      <h2 className="text-lg font-semibold text-warcrow-gold flex items-center">
        <Database className="mr-2 h-5 w-5" />
        Database to Static Files Sync
      </h2>
      
      <div className="space-y-4">
        <p className="text-sm text-warcrow-text/80">
          This utility syncs unit data from the database to static data files for improved performance.
          Use this after making updates to units, keywords, special rules, or characteristics.
        </p>
        
        {syncStatus && !isSyncing && (
          <div className="rounded p-3 bg-black/50 border border-warcrow-gold/20 text-sm">
            <h3 className="font-medium text-warcrow-gold mb-2">Sync Results</h3>
            <ul className="space-y-1 text-warcrow-text">
              <li><span className="opacity-70">Units:</span> {syncStatus.units}</li>
              <li><span className="opacity-70">Keywords:</span> {syncStatus.keywords}</li>
              <li><span className="opacity-70">Special Rules:</span> {syncStatus.specialRules}</li>
              <li><span className="opacity-70">Characteristics:</span> {syncStatus.characteristics}</li>
            </ul>
            
            {syncStatus.errors.length > 0 && (
              <div className="mt-2 text-red-400">
                <p className="font-medium">Errors:</p>
                <ul className="list-disc pl-4 text-xs space-y-1">
                  {syncStatus.errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        
        {isSyncing && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Syncing data...</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        )}
        
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={handleSync}
            disabled={isSyncing}
            className="border-warcrow-gold/30 text-warcrow-gold hover:bg-warcrow-gold/10"
          >
            <Database className="h-4 w-4 mr-2" />
            {isSyncing ? 'Syncing...' : 'Sync Unit Data'}
          </Button>
          
          <Button
            variant="outline"
            disabled={!syncStatus || isSyncing}
            className="border-warcrow-gold/30 text-warcrow-text hover:bg-black/50"
          >
            <FileJson className="h-4 w-4 mr-2" />
            Preview Data Files
          </Button>
        </div>
        
        <p className="text-xs text-warcrow-text/50">
          Note: This feature simulates the generation of static data files. In a complete implementation, 
          this would write files directly to your codebase.
        </p>
      </div>
    </Card>
  );
};

export default DataSyncManager;
