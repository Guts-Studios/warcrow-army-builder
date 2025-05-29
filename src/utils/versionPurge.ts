
import { APP_VERSION } from '@/constants/version';

/**
 * Checks if the app version has changed and purges storage if needed.
 * This should run before any other app logic to prevent stale state issues.
 * 
 * @returns Promise<boolean> - true if storage was purged, false if not
 */
export async function checkVersionAndPurgeStorage(): Promise<boolean> {
  const STORAGE_VERSION_KEY = 'appVersion';
  
  try {
    console.log(`[VersionPurge] Current app version: ${APP_VERSION}`);
    
    // Get stored version
    const storedVersion = localStorage.getItem(STORAGE_VERSION_KEY);
    console.log(`[VersionPurge] Stored version: ${storedVersion || 'none'}`);
    
    // Check if versions match
    if (storedVersion === APP_VERSION) {
      console.log('[VersionPurge] Version matches, continuing normal app load');
      return false;
    }
    
    // Versions don't match - purge storage
    console.warn(`[VersionPurge] Version mismatch detected. Purging storage and reloading...`);
    console.warn(`[VersionPurge] Old: ${storedVersion || 'none'} -> New: ${APP_VERSION}`);
    
    // Clear all storage
    try {
      localStorage.clear();
      sessionStorage.clear();
      console.log('[VersionPurge] Storage cleared successfully');
    } catch (storageError) {
      console.error('[VersionPurge] Error clearing storage:', storageError);
      // Continue anyway - we'll still set the new version
    }
    
    // Set new version
    try {
      localStorage.setItem(STORAGE_VERSION_KEY, APP_VERSION);
      console.log('[VersionPurge] New version stored');
    } catch (setError) {
      console.error('[VersionPurge] Error setting new version:', setError);
    }
    
    // Reload the page to start fresh
    console.log('[VersionPurge] Reloading page...');
    window.location.reload();
    
    return true;
  } catch (error) {
    console.error('[VersionPurge] Unexpected error during version check:', error);
    // Don't block app loading on unexpected errors
    return false;
  }
}

/**
 * Synchronous version of the purge check for immediate execution
 */
export function checkVersionAndPurgeStorageSync(): boolean {
  const STORAGE_VERSION_KEY = 'appVersion';
  
  try {
    const storedVersion = localStorage.getItem(STORAGE_VERSION_KEY);
    
    if (storedVersion === APP_VERSION) {
      return false;
    }
    
    // Clear storage and reload
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem(STORAGE_VERSION_KEY, APP_VERSION);
    window.location.reload();
    
    return true;
  } catch (error) {
    console.error('[VersionPurge] Error in sync version check:', error);
    return false;
  }
}
