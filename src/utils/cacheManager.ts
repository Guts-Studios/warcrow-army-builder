
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

      // Also clear any cached unit data from localStorage
      const unitCacheKeys = Object.keys(localStorage).filter(key => 
        key.includes('unit') || 
        key.includes('army') || 
        key.includes('faction')
      );
      
      unitCacheKeys.forEach(key => {
        localStorage.removeItem(key);
        console.log(`[CacheManager] 🗑️ Cleared cache key: ${key}`);
      });

      console.log('[CacheManager] ✅ Unit data refresh complete');
      toast.success('Unit data refreshed successfully');
      
    } catch (error) {
      console.error('[CacheManager] ❌ Error refreshing unit data:', error);
      toast.error('Failed to refresh unit data');
    }
  }

  // Detect if user might have stale data by checking known unit values
  detectStaleData(): boolean {
    try {
      // Check if we can access current unit data
      const cachedQueries = queryClient.getQueriesData({
        predicate: (query) => query.queryKey[0] === 'army-builder-units'
      });

      // Look for signs of stale data in cached queries
      for (const [queryKey, data] of cachedQueries) {
        if (data && Array.isArray(data)) {
          // Check for the specific Aide unit issue
          const aideUnit = data.find((unit: any) => unit.name === 'Aide');
          if (aideUnit && (aideUnit.pointsCost === 15 || aideUnit.command === 0)) {
            console.warn('[CacheManager] 🚨 Detected stale Aide unit data');
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
    toast.info('Clearing all cached data and reloading...');
    
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
