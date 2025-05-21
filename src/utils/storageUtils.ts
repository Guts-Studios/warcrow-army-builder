
import { getLatestVersion } from './version';
import { toast } from "sonner";

/**
 * Checks the current app version against the stored version and purges local storage if they don't match
 * @param changelog The content of the CHANGELOG.md file
 * @param showNotification Whether to show a toast notification when storage is purged
 * @returns Boolean indicating whether storage was purged (true) or not (false)
 */
export const checkVersionAndPurgeStorage = (changelog: string, showNotification: boolean = true): boolean => {
  try {
    // Extract current version from the changelog
    const currentVersion = getLatestVersion(changelog);
    
    // Get the stored version (if any)
    const storedVersion = localStorage.getItem('app_version');
    
    console.log(`[Storage] Checking versions - Current: ${currentVersion}, Stored: ${storedVersion || 'none'}`);
    
    // If versions don't match or stored version doesn't exist, purge storage
    if (!storedVersion || storedVersion !== currentVersion) {
      console.log(`[Storage] Version mismatch detected. Purging local storage.`);
      
      // Clear all local storage
      localStorage.clear();
      
      // Save the new version
      localStorage.setItem('app_version', currentVersion);
      
      // Show notification if enabled
      if (showNotification) {
        toast.info('App updated to version ' + currentVersion, {
          description: 'Your local data has been refreshed for the new version.',
          duration: 5000
        });
      }
      
      console.log(`[Storage] Local storage purged. New version stored: ${currentVersion}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('[Storage] Error checking version or purging storage:', error);
    return false;
  }
};
