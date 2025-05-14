
/**
 * Utils for the unit explorer component
 */

// Format faction name for display
export const formatFactionName = (faction: string): string => {
  if (!faction) return 'Unknown';
  
  // Replace hyphens with spaces and capitalize each word
  return faction
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Normalize faction name (lowercase, replace spaces with hyphens)
export const normalizeFactionName = (faction: string): string => {
  if (!faction) return '';
  return faction.toLowerCase().replace(/\s+/g, '-');
};

// Get unit type display
export const getUnitType = (unit: any): string => {
  if (!unit) return 'Unknown';
  return unit.type || unit.characteristics?.type || 'Unknown';
};

// Format keywords for display
export const formatKeywords = (unit: any, translateFn?: (keyword: string) => string): string => {
  if (!unit) return '';
  
  const keywords = unit.keywords || [];
  if (!keywords.length) return '-';
  
  // Apply translation function if provided
  if (translateFn) {
    return keywords.map(translateFn).join(', ');
  }
  
  return keywords.join(', ');
};
