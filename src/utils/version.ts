
export const getLatestVersion = (content: string): string => {
  try {
    if (!content || typeof content !== 'string' || content.trim() === '') {
      console.error('[Version] Empty or invalid changelog content');
      return '0.0.0';
    }

    // First check if we're getting an HTML document rather than the changelog
    if (content.trim().startsWith('<!DOCTYPE html>') || content.includes('<html')) {
      console.error('[Version] Received HTML instead of markdown content');
      // Use fallback hardcoded version
      return '0.5.8'; // Return current version
    }

    // Improved regex to better match version patterns in different formats
    const versionRegex = /\[(\d+\.\d+\.\d+)\]/;
    const matches = content.match(new RegExp(versionRegex, 'g'));
    
    if (!matches || matches.length === 0) {
      console.error('[Version] No version found in changelog content');
      console.log('[Version] Changelog content sample:', content.substring(0, 100) + '...');
      return '0.5.8'; // Return current version as fallback
    }
    
    // The versions appear in descending order in the changelog, so the first one is the most recent
    const latestVersionMatch = matches[0].match(versionRegex);
    if (!latestVersionMatch || latestVersionMatch.length < 2) {
      console.error('[Version] Failed to extract version number from match:', matches[0]);
      return '0.5.8';
    }
    
    const version = latestVersionMatch[1];
    console.log('[Version] Extracted latest version from changelog:', version);
    return version;
  } catch (error) {
    console.error('[Version] Error extracting version from changelog:', error);
    return '0.5.8';  // Return current version as fallback
  }
};

// Helper function to determine if one version is newer than another
export const isNewerVersion = (current: string, stored: string | null): boolean => {
  if (!stored) return true;
  
  try {
    const currentParts = current.split('.').map(Number);
    const storedParts = stored.split('.').map(Number);
    
    // Compare major version
    if (currentParts[0] > storedParts[0]) return true;
    if (currentParts[0] < storedParts[0]) return false;
    
    // Compare minor version
    if (currentParts[1] > storedParts[1]) return true;
    if (currentParts[1] < storedParts[1]) return false;
    
    // Compare patch version
    if (currentParts[2] > storedParts[2]) return true;
    
    return false;
  } catch (error) {
    console.error('[Version] Error comparing versions:', error);
    return true; // Default to true on error to ensure update happens
  }
}
