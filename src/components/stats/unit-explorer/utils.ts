
/**
 * Format a faction name from kebab-case to title case
 */
export const formatFactionName = (faction: string): string => {
  if (!faction) return '';
  
  // Special case for Syenann with the diacritical mark
  if (faction.toLowerCase() === 'syenann') {
    return 'Sÿenann';
  }
  
  // If the faction is already in a readable format (contains spaces), return it as is
  if (faction.includes(' ')) return faction;
  
  // Otherwise, convert from kebab-case to title case
  return faction
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Get the unit type label in a user-friendly format
 */
export const getUnitType = (unit: any): string => {
  if (!unit) return '';

  // Check for high command first
  if (unit.characteristics?.highCommand || unit.highCommand) {
    return 'High Command';
  }

  // Return formatted unit type
  return unit.type ? unit.type.charAt(0).toUpperCase() + unit.type.slice(1) : '';
};

/**
 * Format keywords array to display string
 */
export const formatKeywords = (unit: any, translateFn?: (keyword: string) => string): string => {
  // Handle different types of keyword storage from Supabase vs. static data
  let keywords: string[] = [];
  
  if (unit.keywords) {
    // If keywords is an array of strings (from Supabase)
    if (Array.isArray(unit.keywords) && typeof unit.keywords[0] === 'string') {
      keywords = unit.keywords;
    }
    // If keywords is an array of objects with name property (from static data)
    else if (Array.isArray(unit.keywords) && typeof unit.keywords[0] === 'object') {
      keywords = unit.keywords.map(k => k.name);
    }
    // If keywords is a comma-separated string
    else if (typeof unit.keywords === 'string') {
      keywords = unit.keywords.split(',').map(k => k.trim());
    }
  }
  
  // If there are no keywords, return empty string
  if (keywords.length === 0) return '';
  
  // Apply translation if a translation function is provided
  return keywords
    .map(keyword => translateFn ? translateFn(keyword) : keyword)
    .join(', ');
};
