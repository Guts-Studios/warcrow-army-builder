
import React from 'react';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useStaleDataDetection } from '@/hooks/useStaleDataDetection';

export const StaleDataWarning: React.FC = () => {
  const { staleDataDetected, refreshData, performNuclearReset } = useStaleDataDetection();

  if (!staleDataDetected) return null;

  return (
    <Card className="border-red-500 bg-red-50 dark:bg-red-900/20 mb-4 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0 animate-pulse" />
          <div className="flex-1">
            <h4 className="font-bold text-red-800 dark:text-red-200 mb-2 text-lg">
              ⚠️ OUTDATED DATA DETECTED
            </h4>
            <p className="text-sm text-red-700 dark:text-red-300 mb-3 font-medium">
              Your browser is showing old unit information with incorrect point costs and stats. 
              This happens when new updates are released. <strong>Please refresh your data immediately to see the correct values.</strong>
            </p>
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={refreshData}
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white font-medium shadow-md"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Fix Now - Refresh Data
              </Button>
              <Button
                onClick={performNuclearReset}
                size="sm"
                variant="outline"
                className="border-red-600 text-red-700 hover:bg-red-100 font-medium"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Everything & Reload
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
