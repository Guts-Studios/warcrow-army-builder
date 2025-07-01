
import { APP_VERSION } from '@/constants/version';

// Environment-specific prefixes to prevent cross-contamination
const ENV_PREFIX = typeof window !== 'undefined' && window.location.hostname.includes('lovable') ? 'preview_' : 'prod_';

const VERSION_STORAGE_KEY = `${ENV_PREFIX}appVersion`;
const TOKEN_VERSION_KEY = `${ENV_PREFIX}tokenVersion`;
const ARMY_LIST_PREFIX = `${ENV_PREFIX}armyList_`;

// Keys that should be preserved (auth, user preferences, etc.)
const PRESERVED_KEYS = [
  `${ENV_PREFIX}sb-`, // Supabase auth tokens
  `${ENV_PREFIX}supabase.auth.token`,
  `${ENV_PREFIX}language`,
  `${ENV_PREFIX}theme`,
  `${ENV_PREFIX}user-preferences`,
  `${ENV_PREFIX}auth-token`,
  `${ENV_PREFIX}session`
];

/**
 * One-time migration to clear old global keys that might be causing conflicts
 */
export function clearOldGlobalKeys(): void {
  console.log('[Storage] 🧹 Clearing old global keys to prevent environment conflicts...');
  
  const oldGlobalKeys = [
    'appVersion',
    'tokenVersion', 
    'supabase.auth.token',
    'sb-odqyoncwqawdzhquxcmh-auth-token',
    'language',
    'theme'
  ];
  
  // Also clear any armyList_ keys without prefix
  const allKeys = Object.keys(localStorage);
  const oldArmyListKeys = allKeys.filter(key => key.startsWith('armyList_') && !key.startsWith(ENV_PREFIX));
  
  [...oldGlobalKeys, ...oldArmyListKeys].forEach(key => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      console.log(`[Storage] 🗑️ Removed old global key: ${key}`);
    }
  });
}

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

    // Clear all storage but preserve cross-environment data
    const keysToPreserve: Record<string, string> = {};
    
    // In production, preserve preview data and vice versa
    const otherEnvPrefix = ENV_PREFIX === 'preview_' ? 'prod_' : 'preview_';
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(otherEnvPrefix)) {
        const value = localStorage.getItem(key);
        if (value !== null) {
          keysToPreserve[key] = value;
        }
      }
    }
    
    localStorage.clear();
    sessionStorage.clear();
    
    // Restore other environment's data
    Object.entries(keysToPreserve).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });

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
    // Find all Supabase auth-related keys for this environment
    const authKeysToRemove = Object.keys(localStorage).filter(key => 
      key.includes('supabase.auth') || 
      key.startsWith(`${ENV_PREFIX}sb-`) ||
      key === `${ENV_PREFIX}supabase.auth.token`
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
 * Force clear unit cache to ensure fresh data loads
 */
export function clearUnitCache(): void {
  console.log('[Storage] 🎯 Clearing unit data cache...');
  
  try {
    // Clear any cached unit data
    const unitCacheKeys = Object.keys(localStorage).filter(key => 
      key.includes('army-builder-units') ||
      key.includes('unit-data') ||
      key.includes('faction-units')
    );
    
    unitCacheKeys.forEach(key => {
      localStorage.removeItem(key);
      console.log(`[Storage] 🗑️ Removed unit cache key: ${key}`);
    });
    
    // Also clear any cached queries from React Query
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          if (cacheName.includes('unit') || cacheName.includes('army')) {
            caches.delete(cacheName);
            console.log(`[Storage] 🗑️ Deleted unit cache: ${cacheName}`);
          }
        });
      });
    }
    
    console.log('[Storage] ✅ Unit cache cleared');
  } catch (error) {
    console.error('[Storage] ❌ Error clearing unit cache:', error);
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
    
    // Gather keys to preserve for this environment
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

    console.log(`[Storage] 📦 Preserving ${Object.keys(keysToPreserve).length} important keys for ${ENV_PREFIX} environment`);

    // Clear all localStorage
    localStorage.clear();

    // Restore preserved keys
    Object.entries(keysToPreserve).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });

    // Update version to current
    localStorage.setItem(VERSION_STORAGE_KEY, APP_VERSION);
    localStorage.setItem(TOKEN_VERSION_KEY, APP_VERSION);
    
    // Force clear unit cache after version update
    clearUnitCache();

    console.log(`[Storage] ✅ Selective purge complete for ${ENV_PREFIX} environment. Preserved auth tokens and army lists.`);
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
    
    console.log(`[Storage] 🔐 Token version check (${ENV_PREFIX}): stored=${storedTokenVersion}, current=${APP_VERSION}`);
    
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
    // First, clear old global keys that might cause conflicts
    clearOldGlobalKeys();
    
    const storedVersion = localStorage.getItem(VERSION_STORAGE_KEY);
    
    console.log(`[Storage] 🔍 Version check (${ENV_PREFIX}): stored=${storedVersion}, current=${APP_VERSION}`);
    console.log(`[Storage] 🔐 Cache purge runs for ALL users (authenticated and guest)`);
    
    if (storedVersion !== APP_VERSION) {
      console.log(`[Storage] 🔄 Version change detected: ${storedVersion} → ${APP_VERSION}`);
      console.log(`[Storage] 🧹 Purging cache for ALL users regardless of auth status`);
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
      
      // Even if version is the same, force clear unit cache if in production
      // to ensure fresh unit data loads
      if (ENV_PREFIX === 'prod_') {
        clearUnitCache();
      }
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

// Expose helper for development/testing
if (typeof window !== 'undefined') {
  (window as any).__resetPreview = () => {
    console.log('[Storage] 🔄 Manual preview reset triggered');
    for (let key in localStorage) {
      if (key.startsWith('preview_')) {
        localStorage.removeItem(key);
        console.log(`[Storage] 🗑️ Removed preview key: ${key}`);
      }
    }
    clearUnitCache();
    location.reload();
  };
  
  (window as any).__resetProd = () => {
    console.log('[Storage] 🔄 Manual production reset triggered');
    for (let key in localStorage) {
      if (key.startsWith('prod_')) {
        localStorage.removeItem(key);
        console.log(`[Storage] 🗑️ Removed production key: ${key}`);
      }
    }
    clearUnitCache();
    location.reload();
  };
}
