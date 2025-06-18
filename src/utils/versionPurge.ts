
import { APP_VERSION } from '@/constants/version';

const VERSION_STORAGE_KEY = 'appVersion';
const ARMY_LIST_PREFIX = 'armyList_';

// Keys that should be preserved (auth, user preferences, etc.)
const PRESERVED_KEYS = [
  'sb-', // Supabase auth tokens
  'supabase.auth.token',
  'language',
  'theme',
  'user-preferences',
  'auth-token',
  'session'
];

/**
 * Clears all service workers and caches (nuclear option)
 */
export async function clearAllCachesAndSW(): Promise<void> {
  console.log('[Storage] 🧹 Performing nuclear cache clear...');

  try {
    // Clear all service workers
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
        console.log('[Storage] 🗑️ Unregistered service worker');
      }
    }

    // Clear all caches
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      for (const cacheName of cacheNames) {
        await caches.delete(cacheName);
        console.log(`[Storage] 🗑️ Deleted cache: ${cacheName}`);
      }
    }

    // Clear all storage
    localStorage.clear();
    sessionStorage.clear();

    console.log('[Storage] ✅ Nuclear cache clear complete');
  } catch (error) {
    console.error('[Storage] ❌ Error during nuclear cache clear:', error);
  }
}

/**
 * Selectively purges only stale app cache data while preserving:
 * - Army lists (armyList_ prefix)
 * - Authentication tokens and session data
 * - User preferences
 */
export function purgeStaleAppCache(): void {
  console.log('[Storage] 🧹 Selectively purging stale app cache...');

  try {
    const keysToPreserve: Record<string, string> = {};
    
    // Gather keys to preserve
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const shouldPreserve = 
          key.startsWith(ARMY_LIST_PREFIX) ||
          PRESERVED_KEYS.some(prefix => key.startsWith(prefix)) ||
          key === VERSION_STORAGE_KEY;
          
        if (shouldPreserve) {
          const value = localStorage.getItem(key);
          if (value !== null) {
            keysToPreserve[key] = value;
          }
        }
      }
    }

    console.log(`[Storage] 📦 Preserving ${Object.keys(keysToPreserve).length} important keys`);

    // Clear all localStorage
    localStorage.clear();

    // Restore preserved keys
    Object.entries(keysToPreserve).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });

    // Update version to current
    localStorage.setItem(VERSION_STORAGE_KEY, APP_VERSION);

    console.log(`[Storage] ✅ Selective purge complete. Preserved auth tokens and army lists.`);
  } catch (error) {
    console.error('[Storage] ❌ Error during selective purge:', error);
  }
}

/**
 * Checks if we need to purge stale cache based on version change
 */
export function checkAndPurgeIfNeeded(): void {
  try {
    const storedVersion = localStorage.getItem(VERSION_STORAGE_KEY);
    
    console.log(`[Storage] 🔍 Version check: stored=${storedVersion}, current=${APP_VERSION}`);
    
    if (storedVersion !== APP_VERSION) {
      console.log(`[Storage] 🔄 Version change detected: ${storedVersion} → ${APP_VERSION}`);
      purgeStaleAppCache();
      
      // Also clear any potential stale caches
      if ('caches' in window) {
        caches.keys().then(cacheNames => {
          cacheNames.forEach(cacheName => {
            if (cacheName.includes('html-cache') || cacheName.includes('version-cache') || cacheName.includes('assets-cache')) {
              caches.delete(cacheName);
              console.log(`[Storage] 🗑️ Deleted stale cache: ${cacheName}`);
            }
          });
        });
      }
    } else {
      console.log('[Storage] ✅ Version unchanged, no purge needed');
    }
  } catch (error) {
    console.error('[Storage] ❌ Error checking version:', error);
  }
}

/**
 * Adds version parameter to fetch requests for cache busting
 */
export function createVersionedFetch(baseUrl: string): string {
  const url = new URL(baseUrl, window.location.origin);
  url.searchParams.set('version', APP_VERSION);
  return url.toString();
}
