
import { APP_VERSION } from '@/constants/version';

const VERSION_STORAGE_KEY = 'appVersion';
const ARMY_LIST_PREFIX = 'armyList_';

/**
 * Checks if the app version has changed and purges storage if needed.
 * Preserves all keys starting with 'armyList_' during the purge.
 * This should run before any other app logic to prevent stale state issues.
 * 
 * @returns Promise<boolean> - true if storage was purged and page will reload, false if not
 */
export async function checkVersionAndPurgeStorage(): Promise<boolean> {
  try {
    console.log(`[VersionPurge] 🚀 Starting version check - Current app version: ${APP_VERSION}`);
    
    // Get stored version from localStorage
    const storedVersion = localStorage.getItem(VERSION_STORAGE_KEY);
    console.log(`[VersionPurge] 📋 Stored version: ${storedVersion || 'none'}`);
    
    // Check if versions match
    if (storedVersion === APP_VERSION) {
      console.log('[VersionPurge] ✅ Version matches, no purge needed');
      return false;
    }
    
    // Versions don't match - need to purge storage while preserving army lists
    console.warn(`[VersionPurge] 🔄 Version mismatch detected! Old: ${storedVersion || 'none'} -> New: ${APP_VERSION}`);
    console.log(`[VersionPurge] 💾 Preserving army lists during purge...`);
    
    // Step 1: Preserve all army list keys and their values
    const armyListData: Record<string, string> = {};
    let armyListCount = 0;
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(ARMY_LIST_PREFIX)) {
        const value = localStorage.getItem(key);
        if (value) {
          armyListData[key] = value;
          armyListCount++;
        }
      }
    }
    
    console.log(`[VersionPurge] 📂 Found ${armyListCount} army lists to preserve:`, Object.keys(armyListData));
    
    // Step 2: Clear all storage
    try {
      console.log('[VersionPurge] 🧹 Clearing localStorage...');
      localStorage.clear();
      console.log('[VersionPurge] 🧹 Clearing sessionStorage...');
      sessionStorage.clear();
      console.log('[VersionPurge] ✅ Storage cleared successfully');
    } catch (storageError) {
      console.error('[VersionPurge] ❌ Error clearing storage:', storageError);
      // Continue anyway - we'll still restore army lists and set new version
    }
    
    // Step 3: Restore preserved army lists
    try {
      Object.entries(armyListData).forEach(([key, value]) => {
        localStorage.setItem(key, value);
        console.log(`[VersionPurge] 📝 Restored army list: ${key}`);
      });
      console.log(`[VersionPurge] ✅ Restored ${armyListCount} army lists successfully`);
    } catch (restoreError) {
      console.error('[VersionPurge] ❌ Error restoring army lists:', restoreError);
    }
    
    // Step 4: Set new version
    try {
      localStorage.setItem(VERSION_STORAGE_KEY, APP_VERSION);
      console.log(`[VersionPurge] 📌 New version stored: ${APP_VERSION}`);
    } catch (setError) {
      console.error('[VersionPurge] ❌ Error setting new version:', setError);
    }
    
    // Step 5: Reload the page to start fresh
    console.log('[VersionPurge] 🔄 Reloading page to apply changes...');
    window.location.reload();
    
    return true;
  } catch (error) {
    console.error('[VersionPurge] ❌ Unexpected error during version check:', error);
    // Don't block app loading on unexpected errors
    return false;
  }
}

/**
 * Synchronous version of the purge check for immediate execution
 * Preserves army lists during purge operation
 */
export function checkVersionAndPurgeStorageSync(): boolean {
  try {
    console.log(`[VersionPurge] 🚀 Sync version check - Current app version: ${APP_VERSION}`);
    
    const storedVersion = localStorage.getItem(VERSION_STORAGE_KEY);
    console.log(`[VersionPurge] 📋 Stored version: ${storedVersion || 'none'}`);
    
    if (storedVersion === APP_VERSION) {
      console.log('[VersionPurge] ✅ Version matches, no purge needed');
      return false;
    }
    
    console.warn(`[VersionPurge] 🔄 Sync version mismatch! Old: ${storedVersion || 'none'} -> New: ${APP_VERSION}`);
    
    // Preserve army lists
    const armyListData: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(ARMY_LIST_PREFIX)) {
        const value = localStorage.getItem(key);
        if (value) {
          armyListData[key] = value;
        }
      }
    }
    
    console.log(`[VersionPurge] 📂 Preserving ${Object.keys(armyListData).length} army lists`);
    
    // Clear and restore
    localStorage.clear();
    sessionStorage.clear();
    
    Object.entries(armyListData).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });
    
    localStorage.setItem(VERSION_STORAGE_KEY, APP_VERSION);
    console.log('[VersionPurge] 🔄 Reloading page...');
    window.location.reload();
    
    return true;
  } catch (error) {
    console.error('[VersionPurge] ❌ Error in sync version check:', error);
    return false;
  }
}
