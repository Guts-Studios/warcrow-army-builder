
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
 * CRITICAL: Force complete cache invalidation for production data issues
 */
export async function emergencyCacheClear(): Promise<void> {
  console.log('[EMERGENCY] 🚨 Starting emergency cache clear for data inconsistency');

  try {
    // 1. Clear all browser storage
    localStorage.clear();
    sessionStorage.clear();
    console.log('[EMERGENCY] 🗑️ Cleared all browser storage');

    // 2. Unregister all service workers
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
        console.log('[EMERGENCY] 🗑️ Unregistered service worker');
      }
    }

    // 3. Clear all browser caches
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      for (const cacheName of cacheNames) {
        await caches.delete(cacheName);
        console.log(`[EMERGENCY] 🗑️ Deleted cache: ${cacheName}`);
      }
    }

    // 4. Clear IndexedDB (if used by React Query or other libraries)
    if ('indexedDB' in window) {
      try {
        const databases = await indexedDB.databases();
        for (const db of databases) {
          if (db.name) {
            indexedDB.deleteDatabase(db.name);
            console.log(`[EMERGENCY] 🗑️ Deleted IndexedDB: ${db.name}`);
          }
        }
      } catch (error) {
        console.warn('[EMERGENCY] ⚠️ Could not clear IndexedDB:', error);
      }
    }

    console.log('[EMERGENCY] ✅ Emergency cache clear complete');
  } catch (error) {
    console.error('[EMERGENCY] ❌ Error during emergency cache clear:', error);
  }
}

/**
 * Clear stale auth tokens (alias for emergency cache clear)
 */
export async function clearStaleAuthTokens(): Promise<void> {
  console.log('[AUTH] 🧹 Clearing stale auth tokens');
  
  // Clear auth-specific keys
  const authKeys = Object.keys(localStorage).filter(key => 
    key.includes('auth') || key.includes('supabase') || key.startsWith('sb-')
  );
  
  authKeys.forEach(key => {
    localStorage.removeItem(key);
    console.log(`[AUTH] 🗑️ Removed auth key: ${key}`);
  });
  
  // Also clear session storage
  sessionStorage.clear();
  console.log('[AUTH] ✅ Auth tokens cleared');
}

/**
 * Clear all caches and service workers (alias for emergency cache clear)
 */
export async function clearAllCachesAndSW(): Promise<void> {
  console.log('[CACHE] 🧹 Clearing all caches and service workers');
  await emergencyCacheClear();
}

/**
 * Add data version checking and validation
 */
export function validateCriticalUnitData(): void {
  console.log('[VALIDATION] 🔍 Starting critical unit data validation');
  
  // Create a data timestamp for cache busting
  const dataTimestamp = Date.now();
  localStorage.setItem(`${ENV_PREFIX}dataValidationTime`, dataTimestamp.toString());
  
  console.log(`[VALIDATION] ⏰ Data validation timestamp: ${dataTimestamp}`);
}

/**
 * Force reload with cache busting
 */
export function forceReloadWithCacheBust(): void {
  console.log('[CACHE-BUST] 🔄 Forcing reload with cache busting');
  
  // Add timestamp to force cache bypass
  const timestamp = Date.now();
  const url = new URL(window.location.href);
  url.searchParams.set('cacheBust', timestamp.toString());
  url.searchParams.set('dataRefresh', 'true');
  
  // Force hard reload
  window.location.href = url.toString();
}

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
 * Checks if we need to purge stale cache based on version change
 */
export function checkAndPurgeIfNeeded(): void {
  try {
    // First, clear old global keys that might cause conflicts
    clearOldGlobalKeys();
    
    const storedVersion = localStorage.getItem(VERSION_STORAGE_KEY);
    
    console.log(`[Storage] 🔍 Version check (${ENV_PREFIX}): stored=${storedVersion}, current=${APP_VERSION}`);
    
    if (storedVersion !== APP_VERSION) {
      console.log(`[Storage] 🔄 Version change detected: ${storedVersion} → ${APP_VERSION}`);
      
      // For critical data issues, do emergency cache clear
      emergencyCacheClear();
      
      // Set new version
      localStorage.setItem(VERSION_STORAGE_KEY, APP_VERSION);
      localStorage.setItem(TOKEN_VERSION_KEY, APP_VERSION);
      
      // Validate critical data
      validateCriticalUnitData();
    } else {
      console.log('[Storage] ✅ Version unchanged, but clearing unit cache for data consistency');
      // Even if version is the same, force clear unit cache for data issues
      clearUnitCache();
      validateCriticalUnitData();
    }
  } catch (error) {
    console.error('[Storage] ❌ Error checking version:', error);
  }
}

// Expose emergency functions for development/testing
if (typeof window !== 'undefined') {
  (window as any).__emergencyDataFix = () => {
    console.log('[EMERGENCY] 🚨 Manual emergency data fix triggered');
    emergencyCacheClear().then(() => {
      forceReloadWithCacheBust();
    });
  };
  
  (window as any).__validateData = () => {
    console.log('[VALIDATION] 🔍 Manual data validation triggered');
    validateCriticalUnitData();
    clearUnitCache();
  };
}
