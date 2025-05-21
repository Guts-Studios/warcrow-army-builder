
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
      console.log(`[Storage] Version mismatch detected. Selectively purging local storage.`);
      
      // Save army lists before clearing
      const savedArmyLists = localStorage.getItem('armyLists');
      console.log(`[Storage] Saved army lists before purge: ${savedArmyLists ? 'Found' : 'None found'}`);
      
      // Clear all local storage
      localStorage.clear();
      console.log(`[Storage] Local storage cleared`);
      
      // Restore army lists
      if (savedArmyLists) {
        localStorage.setItem('armyLists', savedArmyLists);
        console.log(`[Storage] Preserved user's army lists during storage purge: ${savedArmyLists.substring(0, 50)}...`);
      }
      
      // Save the new version
      localStorage.setItem('app_version', currentVersion);
      console.log(`[Storage] Set new version in storage: ${currentVersion}`);
      
      // Show notification if enabled
      if (showNotification) {
        toast.info('App updated to version ' + currentVersion, {
          description: 'Your local data has been refreshed for the new version. Your army lists have been preserved.',
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
