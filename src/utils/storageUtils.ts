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

// Enhanced function to clear invalid tokens
export const clearInvalidTokens = () => {
  try {
    // Check for Supabase auth tokens that might be invalid
    const tokenKeys = Object.keys(localStorage).filter(key => 
      key.startsWith('sb-') || 
      key.includes('auth') || 
      key.includes('supabase')
    );

    console.log(`[storageUtils] Found ${tokenKeys.length} potential auth tokens to check`);
    
    // Check the current domain
    const currentDomain = window.location.hostname;
    console.log(`[storageUtils] Current domain: ${currentDomain}`);
    
    // If we're on warcrowarmy.com but have tokens from netlify domain or vice versa
    // Clear all auth tokens as they won't be valid across domains
    const isCustomDomain = !currentDomain.includes('netlify.app') && !currentDomain.includes('lovableproject.com');
    const hasTokens = tokenKeys.length > 0;
    
    if (isCustomDomain && hasTokens) {
      console.log(`[storageUtils] Custom domain detected (${currentDomain}). Checking auth tokens for cross-domain issues.`);
      
      // Look for tokens that might be from another domain
      const potentialCrossDomainTokens = tokenKeys.filter(key => {
        const value = localStorage.getItem(key);
        // Look for netlify URLs in the token data
        return value && (
          value.includes('netlify.app') || 
          (isCustomDomain && !value.includes(currentDomain))
        );
      });
      
      if (potentialCrossDomainTokens.length > 0) {
        console.warn(`[storageUtils] Detected ${potentialCrossDomainTokens.length} potential cross-domain auth tokens.`);
        console.log(`[storageUtils] Removing all auth tokens to prevent authentication issues`);
        
        // Remove all auth-related tokens
        tokenKeys.forEach(key => {
          localStorage.removeItem(key);
          console.log(`[storageUtils] Removed token: ${key}`);
        });
        
        console.log(`[storageUtils] Auth storage cleanup complete`);
        return true;
      }
    }

    // Check for malformed tokens
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
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('[storageUtils] Error clearing invalid tokens:', error);
    return false;
  }
};
