
const CURRENT_VERSION = "0.5.8";

// Function to get the last purged version from localStorage
const getLastPurgedVersion = (): string | null => {
  try {
    return localStorage.getItem('lastPurgedVersion');
  } catch (error) {
    console.error('Error getting last purged version from localStorage:', error);
    return null;
  }
};

// Function to set the last purged version in localStorage
const setLastPurgedVersion = (version: string): void => {
  try {
    localStorage.setItem('lastPurgedVersion', version);
  } catch (error) {
    console.error('Error setting last purged version in localStorage:', error);
  }
};

// Function to extract the latest version from the changelog
const extractLatestVersion = (changelog: string): string | null => {
  const versionRegex = /## \[(\d+\.\d+\.\d+)\]/m;
  const match = changelog.match(versionRegex);
  return match ? match[1] : null;
};

// Function to purge all storage
const purgeStorage = (): void => {
  try {
    localStorage.clear();
    console.log('All localStorage purged');
  } catch (error) {
    console.error('Error purging localStorage:', error);
  }
};

// Function to purge storage except army lists
export const purgeStorageExceptLists = (): void => {
  try {
    const armyListKeys = Object.keys(localStorage).filter(key => key.startsWith('armyList_'));
    const armyLists = armyListKeys.reduce((obj: Record<string, string>, key: string) => {
      obj[key] = localStorage.getItem(key) || '';
      return obj;
    }, {});

    localStorage.clear();
    console.log('All localStorage purged except army lists');

    Object.keys(armyLists).forEach(key => {
      localStorage.setItem(key, armyLists[key]);
    });
  } catch (error) {
    console.error('Error purging localStorage except army lists:', error);
  }
};

// Function to check version and purge storage if needed
export const checkVersionAndPurgeStorage = (changelog: string, forcePurge: boolean = false): boolean => {
  try {
    const latestVersion = extractLatestVersion(changelog);
    const lastPurgedVersion = getLastPurgedVersion();

    console.log(`Current version: ${CURRENT_VERSION}, Latest version: ${latestVersion}, Last purged version: ${lastPurgedVersion}`);

    if (!latestVersion) {
      console.warn('Could not extract latest version from changelog. Skipping purge check.');
      return false;
    }

    if (forcePurge || lastPurgedVersion !== latestVersion) {
      console.warn('New version detected or force purge enabled. Purging storage.');
      purgeStorageExceptLists();
      setLastPurgedVersion(latestVersion);
      console.log('Storage purge completed.');
      return true;
    } else {
      console.log('No version change detected. Skipping storage purge.');
      return false;
    }
  } catch (error) {
    console.error('Error checking version and purging storage:', error);
    return false;
  }
};

// Enhanced function to clear invalid tokens - UPDATED to only clear tokens that are provably invalid
export const clearInvalidTokens = async (): Promise<boolean> => {
  try {
    // Check for Supabase auth tokens
    const tokenKeys = Object.keys(localStorage).filter(key => 
      key.startsWith('sb-') || 
      key.includes('auth') || 
      key.includes('supabase')
    );

    if (tokenKeys.length === 0) {
      console.log(`[storageUtils] No auth tokens found to check.`);
      return false;
    }

    console.log(`[storageUtils] Found ${tokenKeys.length} potential auth tokens to check`);
    
    // Instead of checking domain, let's verify if the tokens actually work
    let tokenCleared = false;
    
    // Check for malformed tokens first - these are definitely invalid
    const malformedTokens = tokenKeys.filter(key => {
      const value = localStorage.getItem(key);
      return !value || value === 'undefined' || value === 'null';
    });
    
    if (malformedTokens.length > 0) {
      console.warn(`[storageUtils] Found ${malformedTokens.length} malformed tokens`);
      
      malformedTokens.forEach(key => {
        localStorage.removeItem(key);
        console.log(`[storageUtils] Removed malformed token: ${key}`);
      });
      
      tokenCleared = true;
    }
    
    // Now let's try to validate the session with Supabase
    // This is imported dynamically to avoid circular dependencies
    const { supabase } = await import('../integrations/supabase/client');
    
    try {
      // Test if the current session is valid by checking the user
      const { error } = await supabase.auth.getUser();
      
      if (error) {
        // We have a confirmed invalid session, clear all auth tokens
        console.warn(`[storageUtils] Invalid session detected: ${error.message}`);
        
        tokenKeys.forEach(key => {
          localStorage.removeItem(key);
          console.log(`[storageUtils] Removed invalid auth token: ${key}`);
        });
        
        console.log(`[storageUtils] Auth storage cleanup complete due to invalid session`);
        return true;
      } else {
        // Session is valid, don't clear anything
        console.log(`[storageUtils] Session validated successfully, keeping auth tokens`);
      }
    } catch (validationError) {
      console.error(`[storageUtils] Error validating session: ${validationError}`);
      // Don't clear tokens on validation errors - they might still be valid
      // Only clear tokens when we have a confirmed invalid session
    }
    
    return tokenCleared;
  } catch (error) {
    console.error('[storageUtils] Error clearing invalid tokens:', error);
    return false;
  }
};
