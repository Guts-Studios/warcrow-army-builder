
export const getLatestVersion = (content: string): string => {
  try {
    console.log('[Version] getLatestVersion called with content length:', content?.length || 0);
    
    // If we're in a preview environment or the content is empty/invalid,
    // return a default version instead of trying to parse
    if (!content || typeof content !== 'string' || content.trim() === '') {
      console.log('[Version] Empty or invalid changelog content, using default version');
      return '0.5.11'; // Updated to match changelog
    }

    // Enhanced HTML detection - more comprehensive check
    if (content.trim().startsWith('<!DOCTYPE html>') || 
        content.includes('<html') || 
        content.includes('<head>') || 
        content.includes('<body>')) {
      console.log('[Version] Received HTML instead of markdown content, using default version');
      return '0.5.11'; // Updated to match changelog
    }

    // Improved regex to better match version patterns in different formats
    const versionRegex = /\[(\d+\.\d+\.\d+)\]/;
    const matches = content.match(new RegExp(versionRegex, 'g'));
    
    if (!matches || matches.length === 0) {
      console.log('[Version] No version found in changelog content, using default version');
      return '0.5.11'; // Updated to match changelog
    }
    
    // The versions appear in descending order in the changelog, so the first one is the most recent
    const latestVersionMatch = matches[0].match(versionRegex);
    if (!latestVersionMatch || latestVersionMatch.length < 2) {
      console.log('[Version] Failed to extract version number from match, using default version');
      return '0.5.11';
    }
    
    const version = latestVersionMatch[1];
    console.log('[Version] Extracted latest version from changelog:', version);
    return version;
  } catch (error) {
    console.error('[Version] Error extracting version from changelog:', error);
    return '0.5.11';  // Updated to match changelog
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
