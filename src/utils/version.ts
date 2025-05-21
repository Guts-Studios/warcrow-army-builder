
export const getLatestVersion = (content: string): string => {
  try {
    const versionRegex = /\[(\d+\.\d+\.\d+)\]/;
    const matches = content.match(new RegExp(versionRegex, 'g'));
    
    if (!matches || matches.length === 0) {
      console.error('[Version] No version found in changelog content');
      return '0.0.0';
    }
    
    // The versions appear in descending order in the changelog, so the first one is the most recent
    const latestVersionMatch = matches[0].match(versionRegex);
    if (!latestVersionMatch || latestVersionMatch.length < 2) {
      console.error('[Version] Failed to extract version number from match:', matches[0]);
      return '0.0.0';
    }
    
    const version = latestVersionMatch[1];
    console.log('[Version] Extracted latest version from changelog:', version);
    return version;
  } catch (error) {
    console.error('[Version] Error extracting version from changelog:', error);
    return '0.0.0';
  }
};
