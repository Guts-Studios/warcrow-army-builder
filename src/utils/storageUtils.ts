
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
      
      // Save important data before clearing
      const savedArmyLists = localStorage.getItem('armyLists');
      const authData = preserveAuthData();
      
      console.log(`[Storage] Saved army lists before purge: ${savedArmyLists ? 'Found' : 'None found'}`);
      console.log(`[Storage] Auth data preserved: ${Object.keys(authData).length} items`);
      
      try {
        // Force clear all localStorage first
        localStorage.clear();
        console.log('[Storage] All localStorage cleared');
        
        // Restore important data
        if (savedArmyLists) {
          localStorage.setItem('armyLists', savedArmyLists);
          console.log('[Storage] Restored army lists');
        }
        
        // Restore auth data
        restoreAuthData(authData);
        
        // Save the new version
        localStorage.setItem('app_version', currentVersion);
        console.log(`[Storage] Set new version in storage: ${currentVersion}`);
        
        // Show notification if enabled
        if (showNotification && currentVersion !== '0.0.0') {
          toast.success(`App updated to version ${currentVersion}`, {
            description: 'Your local data has been refreshed. Your army lists and login session have been preserved.',
            duration: 5000
          });
        }
        
        console.log(`[Storage] Storage purged successfully. New version stored: ${currentVersion}`);
        return true;
      } catch (error) {
        console.error('[Storage] Error during storage purge:', error);
        
        // Fall back to a simpler approach if needed
        try {
          if (savedArmyLists || Object.keys(authData).length > 0) {
            localStorage.clear();
            localStorage.setItem('app_version', currentVersion);
            
            if (savedArmyLists) {
              localStorage.setItem('armyLists', savedArmyLists);
            }
            
            restoreAuthData(authData);
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
 * Purges all localStorage data except for armyLists and authentication data
 * This function is called on every app load
 * @param showNotification Whether to show a toast notification when storage is purged
 * @returns Boolean indicating whether storage was purged (true) or not (false)
 */
export const purgeStorageExceptLists = (showNotification: boolean = false): boolean => {
  try {
    console.log('[Storage] Performing automatic data purge except army lists and auth data');
    
    // Check if we're in preview mode
    const isPreviewEnv = isPreviewEnvironment();
    
    // In preview mode, we don't actually need to purge as often since data is more ephemeral
    // and auth is often simulated. But we'll still log the appropriate messages.
    if (isPreviewEnv) {
      console.log('[Storage] Preview environment detected, performing minimal purge');
      // For preview, just clean up any non-critical storage items
      cleanNonEssentialStorage();
      return true;
    }
    
    // Save important data before clearing
    const savedArmyLists = localStorage.getItem('armyLists');
    const authData = preserveAuthData();
    
    console.log(`[Storage] Saved army lists before purge: ${savedArmyLists ? 'Found' : 'None found'}`);
    console.log(`[Storage] Auth data preserved: ${Object.keys(authData).length} items`);
    
    // Get current app version to preserve
    const currentVersion = localStorage.getItem('app_version');
    
    try {
      // Clear all localStorage
      localStorage.clear();
      console.log('[Storage] All localStorage cleared');
      
      // Restore important data
      if (savedArmyLists) {
        localStorage.setItem('armyLists', savedArmyLists);
        console.log('[Storage] Restored army lists');
      }
      
      // Restore auth data
      restoreAuthData(authData);
      
      // Restore app version if it existed
      if (currentVersion) {
        localStorage.setItem('app_version', currentVersion);
        console.log(`[Storage] Restored app version: ${currentVersion}`);
      }
      
      // Show notification if enabled
      if (showNotification) {
        toast.success('App data refreshed', {
          description: 'Your local data has been refreshed. Your army lists and login session have been preserved.',
          duration: 3000
        });
      }
      
      console.log('[Storage] Storage purged successfully (except army lists and auth data)');
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

/**
 * Check if we're in a preview environment
 */
const isPreviewEnvironment = (): boolean => {
  const hostname = window.location.hostname;
  return hostname === 'lovableproject.com' || 
         hostname.includes('.lovableproject.com') ||
         hostname.includes('localhost') ||
         hostname.includes('127.0.0.1') ||
         hostname.includes('netlify.app');
};

/**
 * Cleans only non-essential storage items, preserving authentication and user data
 */
const cleanNonEssentialStorage = (): void => {
  try {
    // Get a list of all keys in localStorage
    const allKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        allKeys.push(key);
      }
    }
    
    // Remove only non-essential items that are not related to auth or user data
    for (const key of allKeys) {
      // Skip auth-related or essential keys
      if (key === 'armyLists' || 
          key === 'app_version' || 
          key.startsWith('supabase.auth.') || 
          key.includes('auth') || 
          key === 'guestSession') {
        continue;
      }
      
      // Remove non-essential items
      localStorage.removeItem(key);
      console.log(`[Storage] Removed non-essential item: ${key}`);
    }
    
    console.log('[Storage] Completed non-essential storage cleanup');
  } catch (error) {
    console.error('[Storage] Error during non-essential storage cleanup:', error);
  }
};

/**
 * Preserves authentication data from localStorage before purging
 * @returns Object containing authentication data
 */
const preserveAuthData = (): Record<string, string> => {
  const authData: Record<string, string> = {};
  
  try {
    // Find and preserve all Supabase auth related items
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      
      // Enhanced check for auth-related keys
      if (key.startsWith('supabase.auth.') || 
          key.includes('auth') || 
          key === 'sb-') {
        try {
          const value = localStorage.getItem(key);
          if (value) {
            authData[key] = value;
            console.log(`[Storage] Preserved auth data: ${key}`);
          }
        } catch (err) {
          console.error(`[Storage] Error preserving auth data for key ${key}:`, err);
        }
      }
    }
    
    // Specifically check for Supabase tokens with the sb- prefix
    // This is necessary because Supabase often stores tokens with this prefix
    const sbKeys = Object.keys(localStorage).filter(key => 
      key.startsWith('sb-') || 
      key.includes('access-token') || 
      key.includes('refresh-token')
    );
    
    sbKeys.forEach(key => {
      try {
        const value = localStorage.getItem(key);
        if (value && !authData[key]) {
          authData[key] = value;
          console.log(`[Storage] Preserved Supabase token: ${key}`);
        }
      } catch (err) {
        console.error(`[Storage] Error preserving Supabase token for key ${key}:`, err);
      }
    });
    
    // For preview mode, ensure we're also preserving any mock auth data
    if (isPreviewEnvironment()) {
      const mockAuthKeys = ['isAuthenticated', 'userRole', 'preview_auth_data'];
      mockAuthKeys.forEach(key => {
        try {
          const value = localStorage.getItem(key);
          if (value) {
            authData[key] = value;
            console.log(`[Storage] Preserved preview auth data: ${key}`);
          }
        } catch (err) {
          console.error(`[Storage] Error preserving preview auth data for key ${key}:`, err);
        }
      });
    }
    
    console.log(`[Storage] Total auth items preserved: ${Object.keys(authData).length}`);
  } catch (error) {
    console.error('[Storage] Error in preserveAuthData:', error);
  }
  
  return authData;
};

/**
 * Restores authentication data to localStorage after purging
 * @param authData Object containing authentication data
 */
const restoreAuthData = (authData: Record<string, string>): void => {
  try {
    const authKeys = Object.keys(authData);
    console.log(`[Storage] Restoring ${authKeys.length} auth items`);
    
    authKeys.forEach(key => {
      try {
        localStorage.setItem(key, authData[key]);
        console.log(`[Storage] Restored auth data: ${key}`);
      } catch (err) {
        console.error(`[Storage] Error restoring auth data for key ${key}:`, err);
      }
    });
    
    // Special handling for preview environment - ensure auth state is properly restored
    if (isPreviewEnvironment() && authKeys.length > 0) {
      console.log('[Storage] Preview environment detected, setting additional auth indicators');
      // These might be redundant but help ensure preview auth works
      if (!localStorage.getItem('preview_auth_initialized')) {
        localStorage.setItem('preview_auth_initialized', 'true');
      }
    }
  } catch (error) {
    console.error('[Storage] Error in restoreAuthData:', error);
  }
};
