
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { cacheManager } from '@/utils/cacheManager';
import { toast } from 'sonner';

export const useStaleDataDetection = () => {
  const [staleDataDetected, setStaleDataDetected] = useState(false);
  const [hasShownWarning, setHasShownWarning] = useState(false);

  // Check for stale data more frequently and aggressively
  useQuery({
    queryKey: ['stale-data-check'],
    queryFn: async () => {
      const isStale = cacheManager.detectStaleData();
      setStaleDataDetected(isStale);
      
      if (isStale && !hasShownWarning) {
        console.warn('[StaleDataDetection] 🚨 Stale data detected, showing warning');
        
        // Show a more persistent toast
        toast.error(
          'OUTDATED DATA DETECTED! Your unit data is from an older version. Click "Refresh Data" now to fix this issue.',
          {
            duration: 15000, // Longer duration
            action: {
              label: 'Refresh Data',
              onClick: async () => {
                await cacheManager.refreshUnitData();
                setStaleDataDetected(false);
                setHasShownWarning(false);
                // Force a page reload to ensure fresh data
                window.location.reload();
              }
            }
          }
        );
        setHasShownWarning(true);
      }
      
      return { isStale };
    },
    refetchInterval: 10000, // Check every 10 seconds instead of 30
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0
  });

  // Also check immediately when the hook mounts
  useEffect(() => {
    const checkImmediately = async () => {
      const isStale = cacheManager.detectStaleData();
      if (isStale) {
        setStaleDataDetected(true);
      }
    };
    checkImmediately();
  }, []);

  const refreshData = async () => {
    await cacheManager.refreshUnitData();
    setStaleDataDetected(false);
    setHasShownWarning(false);
    // Force reload to ensure completely fresh data
    window.location.reload();
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
