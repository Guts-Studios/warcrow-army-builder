
import { queryClient } from '@/components/providers/ProvidersWrapper';
import { clearAllCachesAndSW } from '@/utils/versionPurge';
import { toast } from 'sonner';

// Enhanced cache manager for handling stale data issues
export class CacheManager {
  private static instance: CacheManager;
  
  static getInstance(): CacheManager {
    if (!this.instance) {
      this.instance = new CacheManager();
    }
    return this.instance;
  }

  // Force refresh all unit-related queries
  async refreshUnitData(): Promise<void> {
    console.log('[CacheManager] 🔄 Force refreshing all unit data...');
    
    try {
      // Invalidate all unit-related queries
      await queryClient.invalidateQueries({
        predicate: (query) => {
          const key = query.queryKey[0] as string;
          return key.includes('units') || 
                 key.includes('army-builder-units') || 
                 key.includes('faction');
        }
      });

      // Clear all cached unit data from localStorage more aggressively
      const allLocalStorageKeys = Object.keys(localStorage);
      const unitCacheKeys = allLocalStorageKeys.filter(key => 
        key.includes('unit') || 
        key.includes('army') || 
        key.includes('faction') ||
        key.includes('warcrow') // Clear any app-specific cache
      );
      
      unitCacheKeys.forEach(key => {
        localStorage.removeItem(key);
        console.log(`[CacheManager] 🗑️ Cleared cache key: ${key}`);
      });

      // Clear React Query cache completely
      queryClient.clear();

      console.log('[CacheManager] ✅ Unit data refresh complete');
      toast.success('Unit data refreshed successfully - reloading page...');
      
    } catch (error) {
      console.error('[CacheManager] ❌ Error refreshing unit data:', error);
      toast.error('Failed to refresh unit data');
    }
  }

  // Enhanced stale data detection with more specific checks
  detectStaleData(): boolean {
    try {
      // Check if we can access current unit data
      const cachedQueries = queryClient.getQueriesData({
        predicate: (query) => query.queryKey[0] === 'army-builder-units'
      });

      // Look for signs of stale data in cached queries
      for (const [queryKey, data] of cachedQueries) {
        if (data && Array.isArray(data)) {
          // Check for the specific Aide unit issue (should be 25 points, 1 command)
          const aideUnit = data.find((unit: any) => unit.name === 'Aide');
          if (aideUnit && (aideUnit.pointsCost === 15 || aideUnit.command === 0)) {
            console.warn('[CacheManager] 🚨 Detected stale Aide unit data - should be 25 points, 1 command');
            return true;
          }

          // Check for other known stale data patterns
          // Add more specific checks here as issues are discovered
          const knownIssues = data.filter((unit: any) => {
            // Add more specific stale data checks here
            return false; // Placeholder for future checks
          });

          if (knownIssues.length > 0) {
            console.warn('[CacheManager] 🚨 Detected other stale unit data');
            return true;
          }
        }
      }

      return false;
    } catch (error) {
      console.error('[CacheManager] Error detecting stale data:', error);
      return false;
    }
  }

  // Nuclear option - clear everything and reload
  async performNuclearReset(): Promise<void> {
    console.log('[CacheManager] 💥 Performing nuclear cache reset...');
    toast.info('Clearing all cached data and reloading...', { duration: 2000 });
    
    try {
      await clearAllCachesAndSW();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('[CacheManager] Error in nuclear reset:', error);
      toast.error('Failed to clear cache. Please refresh manually.');
    }
  }
}

export const cacheManager = CacheManager.getInstance();
