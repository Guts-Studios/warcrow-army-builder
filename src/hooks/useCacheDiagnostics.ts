import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { clearStaleAuthTokens, clearAllCachesAndSW } from '@/utils/versionPurge';
import { toast } from 'sonner';

export const useCacheDiagnostics = (enableDiagnostics: boolean = false) => {
  const [cacheHealth, setCacheHealth] = useState<'good' | 'poor' | 'checking'>('checking');

  useEffect(() => {
    if (enableDiagnostics) {
      runDiagnostics();
    }
  }, [enableDiagnostics]);

  const runDiagnostics = async () => {
    console.log('[CacheDiagnostics] 🔍 Running cache health check...');
    
    const diagnostics = {
      localStorage: {
        size: JSON.stringify(localStorage).length,
        keys: Object.keys(localStorage).length,
        authKeys: Object.keys(localStorage).filter(k => 
          k.includes('auth') || k.includes('supabase') || k.startsWith('sb-')
        ).length,
        armyKeys: Object.keys(localStorage).filter(k => k.startsWith('armyList_')).length
      },
      sessionStorage: {
        size: JSON.stringify(sessionStorage).length,
        keys: Object.keys(sessionStorage).length
      },
      caches: 0
    };

    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        diagnostics.caches = cacheNames.length;
      }
    } catch (error) {
      console.error('[CacheDiagnostics] Error checking caches:', error);
    }

    console.log('[CacheDiagnostics] 📊 Cache diagnostics:', diagnostics);

    // Determine cache health
    const isUnhealthy = 
      diagnostics.localStorage.size > 5 * 1024 * 1024 || // > 5MB
      diagnostics.localStorage.keys > 100 ||
      diagnostics.localStorage.authKeys > 5;

    setCacheHealth(isUnhealthy ? 'poor' : 'good');

    if (isUnhealthy) {
      console.warn('[CacheDiagnostics] ⚠️ Poor cache health detected');
      toast.warning('Large cache detected - this may be slowing down your app');
    }
  };

  const clearStaleAuthData = async () => {
    console.log('[CacheDiagnostics] 🧹 Clearing stale auth data...');
    try {
      clearStaleAuthTokens();
      
      // Also clear any invalid session data
      sessionStorage.clear();
      
      // Force refresh auth state
      await supabase.auth.getSession();
      
      toast.success('Stale auth data cleared successfully');
    } catch (error) {
      console.error('[CacheDiagnostics] Error clearing auth data:', error);
      toast.error('Failed to clear auth data');
    }
  };

  const clearAllCachesAndReload = async () => {
    console.log('[CacheDiagnostics] 🧹 Performing nuclear cache clear...');
    try {
      await clearAllCachesAndSW();
      toast.success('All caches cleared, reloading...');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('[CacheDiagnostics] Error clearing caches:', error);
      toast.error('Failed to clear caches');
    }
  };

  const quickCacheOptimization = () => {
    console.log('[CacheDiagnostics] ⚡ Running quick cache optimization...');
    
    // Clear temporary session data
    sessionStorage.clear();
    
    // Remove old/duplicate auth tokens
    const authKeys = Object.keys(localStorage).filter(key => 
      key.includes('auth') || key.includes('supabase') || key.startsWith('sb-')
    );
    
    // Keep only the most recent auth token
    if (authKeys.length > 1) {
      authKeys.slice(0, -1).forEach(key => {
        localStorage.removeItem(key);
        console.log(`[CacheDiagnostics] Removed duplicate auth key: ${key}`);
      });
    }
    
    // Clear any cached query data that might be stale
    Object.keys(localStorage).forEach(key => {
      if (key.includes('query') || key.includes('cache') || key.includes('fetch')) {
        localStorage.removeItem(key);
        console.log(`[CacheDiagnostics] Removed stale query cache: ${key}`);
      }
    });
    
    toast.success('Quick optimization complete - refresh page for best results');
  };

  return {
    cacheHealth,
    runDiagnostics,
    clearStaleAuthData,
    clearAllCachesAndReload,
    quickCacheOptimization
  };
};
