
import { getLatestVersion, isNewerVersion } from './version';
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
    
    // If versions don't match or stored version doesn't exist or current version is newer
    if (!storedVersion || isNewerVersion(currentVersion, storedVersion)) {
      console.log(`[Storage] Version change detected: ${storedVersion || 'none'} -> ${currentVersion}. Purging storage...`);
      
      // Save army lists before clearing
      const savedArmyLists = localStorage.getItem('armyLists');
      console.log(`[Storage] Saved army lists before purge: ${savedArmyLists ? 'Found' : 'None found'}`);
      
      try {
        // Force clear all localStorage first
        localStorage.clear();
        console.log('[Storage] All localStorage cleared');
        
        // Restore army lists if needed
        if (savedArmyLists) {
          localStorage.setItem('armyLists', savedArmyLists);
          console.log('[Storage] Restored army lists');
        }
        
        // Save the new version
        localStorage.setItem('app_version', currentVersion);
        console.log(`[Storage] Set new version in storage: ${currentVersion}`);
        
        // Show notification if enabled
        if (showNotification && currentVersion !== '0.0.0') {
          toast.success(`App updated to version ${currentVersion}`, {
            description: 'Your local data has been refreshed. Your army lists have been preserved.',
            duration: 5000
          });
        }
        
        console.log(`[Storage] Storage purged successfully. New version stored: ${currentVersion}`);
        return true;
      } catch (error) {
        console.error('[Storage] Error during storage purge:', error);
        
        // Fall back to a simpler approach if needed
        try {
          if (savedArmyLists) {
            localStorage.clear();
            localStorage.setItem('armyLists', savedArmyLists);
            localStorage.setItem('app_version', currentVersion);
            return true;
          }
        } catch (fallbackError) {
          console.error('[Storage] Fallback storage operation failed:', fallbackError);
        }
      }
    } else {
      console.log('[Storage] Version is the same, no purge needed');
    }
    
    return false;
  } catch (error) {
    console.error('[Storage] Error checking version or purging storage:', error);
    return false;
  }
};

/**
 * Purges all localStorage data except for armyLists
 * This function is called on every app load
 * @param showNotification Whether to show a toast notification when storage is purged
 * @returns Boolean indicating whether storage was purged (true) or not (false)
 */
export const purgeStorageExceptLists = (showNotification: boolean = false): boolean => {
  try {
    console.log('[Storage] Performing automatic data purge except army lists');
    
    // Save army lists before clearing
    const savedArmyLists = localStorage.getItem('armyLists');
    console.log(`[Storage] Saved army lists before purge: ${savedArmyLists ? 'Found' : 'None found'}`);
    
    // Get current app version to preserve
    const currentVersion = localStorage.getItem('app_version');
    
    try {
      // Clear all localStorage
      localStorage.clear();
      console.log('[Storage] All localStorage cleared');
      
      // Restore army lists if needed
      if (savedArmyLists) {
        localStorage.setItem('armyLists', savedArmyLists);
        console.log('[Storage] Restored army lists');
      }
      
      // Restore app version if it existed
      if (currentVersion) {
        localStorage.setItem('app_version', currentVersion);
        console.log(`[Storage] Restored app version: ${currentVersion}`);
      }
      
      // Show notification if enabled
      if (showNotification) {
        toast.success('App data refreshed', {
          description: 'Your local data has been refreshed. Your army lists have been preserved.',
          duration: 3000
        });
      }
      
      console.log('[Storage] Storage purged successfully (except army lists)');
      return true;
    } catch (error) {
      console.error('[Storage] Error during storage purge:', error);
      return false;
    }
  } catch (error) {
    console.error('[Storage] Error during automatic purge:', error);
    return false;
  }
};
