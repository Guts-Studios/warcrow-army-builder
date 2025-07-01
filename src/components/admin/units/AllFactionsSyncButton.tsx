import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Database, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { syncAllFactionsToDatabase, SyncResults } from '@/utils/syncAllFactionsToDatabase';

const AllFactionsSyncButton: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string>('');
  const [syncResults, setSyncResults] = useState<SyncResults | null>(null);

  const handleSyncAll = async () => {
    setIsSyncing(true);
    setProgress(0);
    setStatus('');
    setSyncResults(null);

    try {
      const results = await syncAllFactionsToDatabase((progress, status) => {
        setProgress(progress);
        setStatus(status);
      });

      setSyncResults(results);

      if (results.errorCount > 0) {
        toast.error(`Sync completed with ${results.errorCount} errors out of ${results.totalProcessed} units`);
      } else {
        toast.success(`Successfully synced all ${results.successCount} units from CSV to database!`);
      }

    } catch (error: any) {
      console.error('Sync error:', error);
      toast.error(`Sync failed: ${error.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Card className="p-4 space-y-4 bg-black border-warcrow-gold/30">
      <h2 className="text-lg font-semibold text-warcrow-gold flex items-center">
        <Database className="mr-2 h-5 w-5" />
        Sync All Factions from CSV
      </h2>
      
      <div className="space-y-4">
        <p className="text-sm text-warcrow-text/80">
          This will sync all faction data from CSV files to the database, including tournament legal status.
          Existing data will be cleared and replaced with CSV data.
        </p>

        {isSyncing && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-warcrow-text">{status}</span>
              <span className="font-medium text-warcrow-gold">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <Button
          onClick={handleSyncAll}
          disabled={isSyncing}
          className="bg-warcrow-gold hover:bg-warcrow-gold/80 text-black w-full"
        >
          {isSyncing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Syncing All Factions...
            </>
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" />
              Sync All Factions to Database
            </>
          )}
        </Button>

        {syncResults && (
          <div className="space-y-3">
            <Alert className={syncResults.errorCount > 0 ? "bg-orange-900/20 border-orange-500/50" : "bg-emerald-900/20 border-emerald-500/50"}>
              {syncResults.errorCount > 0 ? (
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              ) : (
                <CheckCircle className="h-4 w-4 text-emerald-500" />
              )}
              <AlertTitle className={syncResults.errorCount > 0 ? "text-orange-500" : "text-emerald-500"}>
                Sync Results
              </AlertTitle>
              <AlertDescription className={syncResults.errorCount > 0 ? "text-orange-300" : "text-emerald-300"}>
                <div className="space-y-1">
                  <p>Total units processed: {syncResults.totalProcessed}</p>
                  <p>Successful: {syncResults.successCount}</p>
                  <p>Errors: {syncResults.errorCount}</p>
                </div>
              </AlertDescription>
            </Alert>

            {/* Faction breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(syncResults.factionResults).map(([factionId, result]) => (
                <div key={factionId} className="p-3 bg-black/50 border border-warcrow-gold/20 rounded">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-warcrow-gold capitalize">
                      {factionId.replace(/-/g, ' ')}
                    </span>
                    <span className="text-sm text-warcrow-text">
                      {result.processed} units
                    </span>
                  </div>
                  {result.errors.length > 0 && (
                    <div className="text-xs text-red-400 mt-1">
                      {result.errors.length} errors
                    </div>
                  )}
                </div>
              ))}
            </div>

            {syncResults.errors.length > 0 && (
              <Alert className="bg-red-900/20 border-red-500/50">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <AlertTitle className="text-red-500">Errors Details</AlertTitle>
                <AlertDescription className="text-red-300">
                  <div className="max-h-32 overflow-y-auto text-xs">
                    {syncResults.errors.slice(0, 10).map((error, index) => (
                      <div key={index} className="mb-1">{error}</div>
                    ))}
                    {syncResults.errors.length > 10 && (
                      <div className="text-red-200">...and {syncResults.errors.length - 10} more errors</div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <div className="text-xs text-warcrow-text/60 space-y-1">
          <p>• Syncs data from: Northern Tribes, Syenann, Hegemony of Embersig, Scions of Yaldabaoth</p>
          <p>• Includes tournament legal status from CSV Tournament Legal column</p>
          <p>• Clears existing faction data before importing new data</p>
        </div>
      </div>
    </Card>
  );
};

export default AllFactionsSyncButton;