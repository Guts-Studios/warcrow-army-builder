
import { APP_VERSION } from '@/constants/version';

const VERSION_STORAGE_KEY = 'appVersion';
const TOKEN_VERSION_KEY = 'tokenVersion';
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
 * Clears only stale authentication tokens while preserving other data
 */
export function clearStaleAuthTokens(): void {
  console.log('[Storage] 🔐 Clearing stale authentication tokens...');
  
  try {
    // Find all Supabase auth-related keys
    const authKeysToRemove = Object.keys(localStorage).filter(key => 
      key.includes('supabase.auth') || 
      key.startsWith('sb-') ||
      key === 'supabase.auth.token'
    );
    
    authKeysToRemove.forEach(key => {
      localStorage.removeItem(key);
      console.log(`[Storage] 🗑️ Removed auth key: ${key}`);
    });
    
    // Clear session storage (may contain temporary auth data)
    sessionStorage.clear();
    
    // Update token version to current app version
    localStorage.setItem(TOKEN_VERSION_KEY, APP_VERSION);
    
    console.log(`[Storage] ✅ Cleared ${authKeysToRemove.length} stale auth tokens`);
  } catch (error) {
    console.error('[Storage] ❌ Error clearing stale auth tokens:', error);
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
          key === VERSION_STORAGE_KEY ||
          key === TOKEN_VERSION_KEY;
          
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
    localStorage.setItem(TOKEN_VERSION_KEY, APP_VERSION);

    console.log(`[Storage] ✅ Selective purge complete. Preserved auth tokens and army lists.`);
  } catch (error) {
    console.error('[Storage] ❌ Error during selective purge:', error);
  }
}

/**
 * Checks if authentication tokens need to be cleared due to version changes
 */
export function checkTokenVersionAndClear(): void {
  try {
    const storedTokenVersion = localStorage.getItem(TOKEN_VERSION_KEY);
    
    console.log(`[Storage] 🔐 Token version check: stored=${storedTokenVersion}, current=${APP_VERSION}`);
    
    if (storedTokenVersion !== APP_VERSION) {
      console.log(`[Storage] 🔄 Token version change detected: ${storedTokenVersion} → ${APP_VERSION}`);
      clearStaleAuthTokens();
    } else {
      console.log('[Storage] ✅ Token version unchanged, no token clear needed');
    }
  } catch (error) {
    console.error('[Storage] ❌ Error checking token version:', error);
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
    
    // Also check token version separately
    checkTokenVersionAndClear();
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
