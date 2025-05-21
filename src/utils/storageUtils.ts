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
      
      // Preserve important data before clearing
      const savedArmyLists = localStorage.getItem('armyLists');
      const authData = preserveAuthData();
      const isTokenInvalid = checkTokenValidity();
      
      console.log(`[Storage] Saved army lists before purge: ${savedArmyLists ? 'Found' : 'None found'}`);
      console.log(`[Storage] Auth data preserved: ${Object.keys(authData).length} items`);
      console.log(`[Storage] Auth token validity check: ${isTokenInvalid ? 'Invalid/Expired' : 'Valid'}`);
      
      try {
        if (isTokenInvalid) {
          // If token is invalid or expired, do a complete clear
          console.log('[Storage] Invalid token detected, performing complete clear');
          localStorage.clear();
          console.log('[Storage] All localStorage cleared due to invalid token');
        } else {
          // Otherwise, preserve auth data during the clearing process
          const keysToKeep = new Set([...Object.keys(authData)]);
          if (savedArmyLists) keysToKeep.add('armyLists');
          
          // Get all current keys
          const allKeys = getAllLocalStorageKeys();
          
          // Remove keys not in the keysToKeep set
          for (const key of allKeys) {
            if (!keysToKeep.has(key)) {
              localStorage.removeItem(key);
              console.log(`[Storage] Removed item: ${key}`);
            }
          }
          
          console.log('[Storage] Selective localStorage purge completed');
        }
        
        // Restore important data
        if (savedArmyLists) {
          localStorage.setItem('armyLists', savedArmyLists);
          console.log('[Storage] Restored army lists');
        }
        
        // Only restore auth data if the token wasn't invalid
        if (!isTokenInvalid) {
          restoreAuthData(authData);
        }
        
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
            
            if (!isTokenInvalid) {
              restoreAuthData(authData);
            }
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
    
    // Check if there's an invalid token that needs to be cleared
    const isTokenInvalid = checkTokenValidity();
    
    // In preview mode, we don't actually need to purge as often since data is more ephemeral
    // and auth is often simulated. But we'll still log the appropriate messages.
    if (isPreviewEnv && !isTokenInvalid) {
      console.log('[Storage] Preview environment detected, performing minimal purge');
      // For preview, just clean up any non-critical storage items
      cleanNonEssentialStorage();
      return true;
    }
    
    // Save important data before clearing
    const savedArmyLists = localStorage.getItem('armyLists');
    const authData = isTokenInvalid ? {} : preserveAuthData();
    
    console.log(`[Storage] Saved army lists before purge: ${savedArmyLists ? 'Found' : 'None found'}`);
    console.log(`[Storage] Auth data preserved: ${Object.keys(authData).length} items`);
    console.log(`[Storage] Auth token validity check: ${isTokenInvalid ? 'Invalid/Expired' : 'Valid'}`);
    
    // Get current app version to preserve
    const currentVersion = localStorage.getItem('app_version');
    
    try {
      if (isTokenInvalid) {
        // If token is invalid, do a complete clear
        localStorage.clear();
        console.log('[Storage] All localStorage cleared due to invalid token');
      } else {
        // Otherwise do a selective clear
        const keysToKeep = new Set([...Object.keys(authData)]);
        if (savedArmyLists) keysToKeep.add('armyLists');
        if (currentVersion) keysToKeep.add('app_version');
        
        // Get all current keys
        const allKeys = getAllLocalStorageKeys();
        
        // Remove keys not in the keysToKeep set
        for (const key of allKeys) {
          if (!keysToKeep.has(key)) {
            localStorage.removeItem(key);
            console.log(`[Storage] Removed item: ${key}`);
          }
        }
        
        console.log('[Storage] Selective localStorage purge completed');
      }
      
      // Restore important data
      if (savedArmyLists) {
        localStorage.setItem('armyLists', savedArmyLists);
        console.log('[Storage] Restored army lists');
      }
      
      // Restore auth data if it wasn't invalid
      if (!isTokenInvalid) {
        restoreAuthData(authData);
      }
      
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
 * Helper function to get all keys in localStorage
 * @returns Array of localStorage keys
 */
const getAllLocalStorageKeys = (): string[] => {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      keys.push(key);
    }
  }
  return keys;
};

/**
 * Check if an auth token is invalid, expired, or malformed
 * @returns boolean True if the token is invalid, false otherwise
 */
const checkTokenValidity = (): boolean => {
  try {
    // First try to find any supabase auth tokens
    const allKeys = getAllLocalStorageKeys();
    const authTokenKey = allKeys.find(key => 
      key.startsWith('sb-') && key.endsWith('-auth-token')
    );
    
    if (!authTokenKey) {
      return false; // No token found, so nothing to validate
    }
    
    // Get the token data
    const tokenData = localStorage.getItem(authTokenKey);
    if (!tokenData) {
      return true; // Token key exists but has no data, consider invalid
    }
    
    try {
      // Try to parse the JSON data
      const parsedToken = JSON.parse(tokenData);
      
      // Check if token is expired
      if (parsedToken.expires_at) {
        const expiresAt = parsedToken.expires_at * 1000; // Convert to milliseconds if needed
        const now = Date.now();
        
        if (expiresAt < now) {
          console.log('[Storage] Auth token has expired');
          return true;
        }
      }
      
      // Check for missing critical parts
      if (!parsedToken.access_token || !parsedToken.refresh_token) {
        console.log('[Storage] Auth token is missing critical fields');
        return true;
      }
      
      return false; // Token appears valid
    } catch (error) {
      console.error('[Storage] Error parsing auth token:', error);
      return true; // JSON parse error, consider token invalid
    }
  } catch (error) {
    console.error('[Storage] Error checking token validity:', error);
    return false; // Default to assuming valid in case of error
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
    const allKeys = getAllLocalStorageKeys();
    
    // Remove only non-essential items that are not related to auth or user data
    for (const key of allKeys) {
      // Skip auth-related or essential keys
      if (key === 'armyLists' || 
          key === 'app_version' || 
          key.startsWith('supabase.auth.') || 
          key.startsWith('sb-') ||
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
    // Get all keys to efficiently search through them once
    const allKeys = getAllLocalStorageKeys();
    
    // Find and preserve all Supabase auth related items
    for (const key of allKeys) {
      // Enhanced check for auth-related keys
      if (key.startsWith('supabase.auth.') || 
          key.startsWith('sb-') ||
          key.includes('auth') || 
          key === 'guestSession') {
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
    
    // For preview mode, ensure we're also preserving any mock auth data
    if (isPreviewEnvironment()) {
      const mockAuthKeys = ['isAuthenticated', 'userRole', 'preview_auth_data'];
      mockAuthKeys.forEach(key => {
        try {
          if (allKeys.includes(key)) {
            const value = localStorage.getItem(key);
            if (value) {
              authData[key] = value;
              console.log(`[Storage] Preserved preview auth data: ${key}`);
            }
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
