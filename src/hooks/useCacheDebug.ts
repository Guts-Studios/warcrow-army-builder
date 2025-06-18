
import { useEffect } from 'react';
import { APP_VERSION } from '@/constants/version';

export const useCacheDebug = (enabled: boolean = false) => {
  useEffect(() => {
    if (!enabled) return;

    console.group('[Cache Debug] Application Cache Status');
    console.log('App Version:', APP_VERSION);
    console.log('Stored Version:', localStorage.getItem('appVersion'));
    console.log('Local Storage Keys:', Object.keys(localStorage));
    console.log('Session Storage Keys:', Object.keys(sessionStorage));
    
    // Check service worker status
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        console.log('Service Worker Registrations:', registrations.length);
        registrations.forEach((reg, index) => {
          console.log(`SW ${index + 1}:`, {
            scope: reg.scope,
            active: !!reg.active,
            waiting: !!reg.waiting,
            installing: !!reg.installing
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
            });
          });
        });
      });
    }
    
    console.groupEnd();
  }, [enabled]);

  const clearAllCaches = async () => {
    console.log('[Cache Debug] Starting manual cache clear...');
    
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
      }
    }
    
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      for (const cacheName of cacheNames) {
        await caches.delete(cacheName);
      }
    }
    
    localStorage.clear();
    sessionStorage.clear();
    
    console.log('[Cache Debug] Manual cache clear complete. Reloading...');
    window.location.reload();
  };

  return { clearAllCaches };
};
