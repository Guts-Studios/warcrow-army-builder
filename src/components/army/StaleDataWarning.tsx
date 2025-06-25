
import React from 'react';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useStaleDataDetection } from '@/hooks/useStaleDataDetection';

export const StaleDataWarning: React.FC = () => {
  const { staleDataDetected, refreshData, performNuclearReset } = useStaleDataDetection();

  if (!staleDataDetected) return null;

  return (
    <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 mb-4">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
              Old Data Detected
            </h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
              Some units may be showing outdated information (like incorrect point costs or stats). 
              This can happen when new updates are released.
            </p>
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={refreshData}
                size="sm"
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh Data
              </Button>
              <Button
                onClick={performNuclearReset}
                size="sm"
                variant="outline"
                className="border-yellow-600 text-yellow-700 hover:bg-yellow-100"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Clear All & Reload
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
