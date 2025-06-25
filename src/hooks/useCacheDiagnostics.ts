
import { useQueryClient } from '@tanstack/react-query';
import { clearStaleAuthTokens, clearAllCachesAndSW } from '@/utils/versionPurge';

export const useCacheDiagnostics = () => {
  const queryClient = useQueryClient();

  const clearAllCachesAndReload = async () => {
    console.log('[useCacheDiagnostics] Starting complete cache clear...');
    
    // Clear React Query cache
    queryClient.clear();
    queryClient.invalidateQueries();
    
    // Clear all browser caches and storage
    await clearAllCachesAndSW();
    
    // Force reload after a short delay
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const clearAuthTokens = async () => {
    console.log('[useCacheDiagnostics] Clearing auth tokens...');
    await clearStaleAuthTokens();
  };

  const clearStaleAuthData = async () => {
    console.log('[useCacheDiagnostics] Clearing stale auth data...');
    await clearStaleAuthTokens();
  };

  const quickCacheOptimization = () => {
    console.log('[useCacheDiagnostics] Quick cache optimization...');
    queryClient.invalidateQueries();
  };

  const invalidateUnitData = () => {
    console.log('[useCacheDiagnostics] Invalidating unit data...');
    queryClient.invalidateQueries({ queryKey: ['army-builder-units'] });
    queryClient.invalidateQueries({ queryKey: ['units'] });
  };

  return {
    clearAllCachesAndReload,
    clearAuthTokens,
    clearStaleAuthData,
    quickCacheOptimization,
    invalidateUnitData,
  };
};
