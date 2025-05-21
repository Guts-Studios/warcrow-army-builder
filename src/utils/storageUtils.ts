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
    // First, find and preserve all army list data
    const armyListKeys = Object.keys(localStorage).filter(key => key.startsWith('armyList_'));
    const armyLists = armyListKeys.reduce((obj: Record<string, string>, key: string) => {
      obj[key] = localStorage.getItem(key) || '';
      return obj;
    }, {});

    // Also preserve auth tokens - we handle these separately with proper validation
    const authKeys = Object.keys(localStorage).filter(key => 
      key.startsWith('sb-') || 
      key.includes('auth') || 
      key.includes('supabase')
    );
    const authItems = authKeys.reduce((obj: Record<string, string>, key: string) => {
      const value = localStorage.getItem(key);
      if (value) obj[key] = value;
      return obj;
    }, {});

    localStorage.clear();
    console.log('All localStorage purged except army lists and auth tokens');

    // Restore army lists
    Object.keys(armyLists).forEach(key => {
      localStorage.setItem(key, armyLists[key]);
    });
    
    // Restore auth tokens
    Object.keys(authItems).forEach(key => {
      localStorage.setItem(key, authItems[key]);
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
      purgeStorageExceptLists(); // This now preserves auth tokens
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

// Enhanced function to clear invalid tokens - ONLY clears tokens that are confirmed invalid via API
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
    
    // First check for obviously malformed tokens - these are definitely invalid
    const malformedTokens = tokenKeys.filter(key => {
      const value = localStorage.getItem(key);
      return !value || value === 'undefined' || value === 'null';
    });
    
    let tokenCleared = false;
    
    if (malformedTokens.length > 0) {
      console.warn(`[storageUtils] Found ${malformedTokens.length} malformed tokens`);
      
      malformedTokens.forEach(key => {
        localStorage.removeItem(key);
        console.log(`[storageUtils] Removed malformed token: ${key}`);
      });
      
      tokenCleared = true;
    }
    
    // Import Supabase dynamically to avoid circular dependencies
    const { supabase } = await import('../integrations/supabase/client');
    
    try {
      // IMPORTANT: Validate the token with Supabase by making an actual API call
      // We use getUser() to check if the current session token is valid
      console.log(`[storageUtils] Validating token with Supabase API call...`);
      const { data, error } = await supabase.auth.getUser();
      
      if (error) {
        // Only clear tokens if there's an explicit authentication error from Supabase
        // Common error codes: 401 (Unauthorized), 403 (Forbidden), JWT expired, etc.
        console.warn(`[storageUtils] Token validation failed: ${error.message}`);
        
        if (error.message.includes('JWT') || 
            error.message.includes('token') || 
            error.message.includes('expired') || 
            error.message.includes('invalid') || 
            error.message.includes('unauthorized') ||
            error.status === 401) {
          
          console.warn(`[storageUtils] Confirmed invalid token. Clearing auth data.`);
          
          // Clear all auth tokens since we confirmed they're invalid
          tokenKeys.forEach(key => {
            localStorage.removeItem(key);
            console.log(`[storageUtils] Removed invalid auth token: ${key}`);
          });
          
          return true;
        } else {
          // Other types of errors (network, etc.) - don't clear tokens
          console.log(`[storageUtils] Error appears to be non-auth related: ${error.message}. Keeping tokens.`);
          return tokenCleared;
        }
      } else {
        // Token is valid! User data was successfully retrieved
        console.log(`[storageUtils] Session validated successfully for user: ${data.user?.id || 'unknown'}`);
        return tokenCleared;
      }
    } catch (validationError) {
      // Handle unexpected errors during validation
      console.error(`[storageUtils] Unexpected error validating session: ${validationError}`);
      // Don't clear tokens on unexpected errors - they might still be valid
      // Only clear when we have confidence the token is invalid
      return tokenCleared;
    }
  } catch (error) {
    console.error('[storageUtils] Error processing tokens:', error);
    return false;
  }
};
