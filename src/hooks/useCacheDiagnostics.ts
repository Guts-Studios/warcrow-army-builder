
import { useEffect } from 'react';
import { APP_VERSION } from '@/constants/version';

export const useCacheDiagnostics = (enabled: boolean = false) => {
  useEffect(() => {
    if (!enabled) return;

    console.group('[Cache Diagnostics] Full System Status');
    
    // Check app version and storage
    console.log('App Version:', APP_VERSION);
    console.log('Stored Version:', localStorage.getItem('appVersion'));
    
    // Check all storage keys
    console.log('Local Storage Keys:', Object.keys(localStorage));
    console.log('Session Storage Keys:', Object.keys(sessionStorage));
    
    // Check for Supabase auth tokens specifically
    const supabaseKeys = Object.keys(localStorage).filter(key => key.includes('supabase'));
    console.log('Supabase Storage Keys:', supabaseKeys);
    
    // Check stored token details
    supabaseKeys.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) {
        try {
          const parsed = JSON.parse(value);
          console.log(`Supabase Token "${key}":`, {
            hasAccessToken: !!parsed.access_token,
            hasRefreshToken: !!parsed.refresh_token,
            expiresAt: parsed.expires_at,
            isExpired: parsed.expires_at ? new Date(parsed.expires_at * 1000) < new Date() : 'unknown',
            userId: parsed.user?.id
          });
        } catch (err) {
          console.log(`Supabase Token "${key}": Failed to parse`, err);
        }
      }
    });
    
    // Check service worker status
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        console.log('Service Worker Registrations:', registrations.length);
        registrations.forEach((reg, index) => {
          console.log(`SW ${index + 1}:`, {
            scope: reg.scope,
            active: !!reg.active,
            waiting: !!reg.waiting,
            installing: !!reg.installing,
            scriptURL: reg.active?.scriptURL
          });
        });
      });
    }

    // Check cache storage
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        console.log('Available Caches:', cacheNames);
        cacheNames.forEach(cacheName => {
          caches.open(cacheName).then(cache => {
            cache.keys().then(keys => {
              console.log(`Cache "${cacheName}" contains ${keys.length} entries`);
              // Log a few sample entries for debugging
              if (keys.length > 0) {
                const sampleKeys = keys.slice(0, 3).map(req => req.url);
                console.log(`Sample entries from "${cacheName}":`, sampleKeys);
              }
            });
          });
        });
      });
    }
    
    console.groupEnd();
  }, [enabled]);

  const clearStaleAuthData = () => {
    console.log('[Cache Diagnostics] Clearing stale auth data...');
    
    // Remove Supabase auth tokens
    const keysToRemove = Object.keys(localStorage).filter(key => 
      key.includes('supabase.auth') || 
      key.includes('sb-') ||
      key === 'supabase.auth.token'
    );
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      console.log(`Removed localStorage key: ${key}`);
    });
    
    // Clear session storage
    sessionStorage.clear();
    console.log('Cleared sessionStorage');
    
    console.log('[Cache Diagnostics] Stale auth data cleared');
  };

  const clearAllCachesAndReload = async () => {
    console.log('[Cache Diagnostics] Starting nuclear cache clear...');
    
    try {
      // Clear all service workers
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.unregister();
          console.log('Unregistered service worker:', registration.scope);
        }
      }
      
      // Clear all caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        for (const cacheName of cacheNames) {
          await caches.delete(cacheName);
          console.log(`Deleted cache: ${cacheName}`);
        }
      }
      
      // Clear all storage
      localStorage.clear();
      sessionStorage.clear();
      
      console.log('[Cache Diagnostics] Nuclear cache clear complete. Reloading...');
      window.location.reload();
    } catch (error) {
      console.error('[Cache Diagnostics] Error during nuclear cache clear:', error);
    }
  };

  return { 
    clearStaleAuthData, 
    clearAllCachesAndReload 
  };
};
