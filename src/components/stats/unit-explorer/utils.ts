/**
 * Format a faction name from kebab-case to title case
 */
export const formatFactionName = (faction: string): string => {
  if (!faction) return '';
  
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
  if (unit.characteristics?.highCommand) {
    return 'High Command';
  }

  // Return formatted unit type
  return unit.type ? unit.type.charAt(0).toUpperCase() + unit.type.slice(1) : '';
};

/**
 * Format keywords array to display string
 */
export const formatKeywords = (unit: any, translateFn?: (keyword: string) => string): string => {
  if (!unit.keywords) return '';
  
  const keywords = Array.isArray(unit.keywords) 
    ? unit.keywords 
    : typeof unit.keywords === 'string' 
      ? unit.keywords.split(',').map(k => k.trim())
      : [];
  
  return keywords
    .map(keyword => {
      const keywordStr = typeof keyword === 'object' && keyword.name 
        ? keyword.name 
        : keyword;
        
      return translateFn ? translateFn(keywordStr) : keywordStr;
    })
    .join(', ');
};
