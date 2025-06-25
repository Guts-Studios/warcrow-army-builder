
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { cacheManager } from '@/utils/cacheManager';
import { toast } from 'sonner';

export const useStaleDataDetection = () => {
  const [staleDataDetected, setStaleDataDetected] = useState(false);
  const [hasShownWarning, setHasShownWarning] = useState(false);

  // Check for stale data periodically
  useQuery({
    queryKey: ['stale-data-check'],
    queryFn: async () => {
      const isStale = cacheManager.detectStaleData();
      setStaleDataDetected(isStale);
      
      if (isStale && !hasShownWarning) {
        console.warn('[StaleDataDetection] 🚨 Stale data detected, showing warning');
        toast.warning(
          'Old data detected! Click "Refresh Data" to get the latest unit information.',
          {
            duration: 8000,
            action: {
              label: 'Refresh Data',
              onClick: async () => {
                await cacheManager.refreshUnitData();
                setStaleDataDetected(false);
                setHasShownWarning(false);
              }
            }
          }
        );
        setHasShownWarning(true);
      }
      
      return { isStale };
    },
    refetchInterval: 30000, // Check every 30 seconds
    refetchOnWindowFocus: true,
    staleTime: 0
  });

  const refreshData = async () => {
    await cacheManager.refreshUnitData();
    setStaleDataDetected(false);
    setHasShownWarning(false);
  };

  const performNuclearReset = async () => {
    await cacheManager.performNuclearReset();
  };

  return {
    staleDataDetected,
    refreshData,
    performNuclearReset
  };
};
