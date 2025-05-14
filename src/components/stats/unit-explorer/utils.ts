/**
 * Normalizes faction names for consistent display and filtering
 */
export const normalizeFactionName = (faction: string): string => {
  if (!faction) return '';

  // Handle common variations and typos
  const normalized = faction.toLowerCase().trim();
  
  if (normalized.includes('syenann') || normalized === 'syennan' || normalized === 'syena') {
    return 'Sÿenann';
  }
  
  if (normalized.includes('hegemony') || normalized === 'embersig') {
    return 'Hegemony of Embersig';
  }
  
  if (normalized.includes('scions') || normalized.includes('yalda')) {
    return 'Scions of Yaldabaoth';
  }
  
  if (normalized.includes('tribe') || normalized.includes('northern')) {
    return 'Northern Tribes';
  }
  
  // Capitalize first letter of each word for display
  return faction
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Format faction name for display
 */
export const formatFactionName = (faction: string): string => {
  return normalizeFactionName(faction);
};

/**
 * Get unit type based on unit data
 */
export const getUnitType = (unit: any): string => {
  if (!unit) return '';
  
  if (unit.type) {
    return unit.type.charAt(0).toUpperCase() + unit.type.slice(1).toLowerCase();
  }
  
  if (unit.characteristics && unit.characteristics.character) {
    return 'Character';
  }
  
  return 'Unit';
};

/**
 * Format keywords for display with optional translation
 */
export const formatKeywords = (unit: any, translateFn?: (keyword: string) => string): string => {
  if (!unit || !unit.keywords) return '-';
  
  const keywords = Array.isArray(unit.keywords) ? unit.keywords : [];
  
  if (keywords.length === 0) {
    return '-';
  }
  
  return keywords
    .map(keyword => translateFn ? translateFn(keyword) : keyword)
    .join(', ');
};

/**
 * Filter units based on search text
 */
export const filterUnitsByText = (units: any[], searchText: string): any[] => {
  if (!searchText) return units;
  
  const search = searchText.toLowerCase().trim();
  
  return units.filter(unit => 
    (unit.name && unit.name.toLowerCase().includes(search)) || 
    (unit.description && unit.description.toLowerCase().includes(search))
  );
};

/**
 * Filter units based on faction
 */
export const filterUnitsByFaction = (units: any[], faction: string): any[] => {
  if (!faction || faction === 'all') return units;
  
  return units.filter(unit => 
    normalizeFactionName(unit.faction) === faction
  );
};

/**
 * Filter units based on characteristic
 */
export const filterUnitsByCharacteristic = (units: any[], characteristic: string): any[] => {
  if (!characteristic || characteristic === 'all') return units;
  
  return units.filter(unit => 
    unit.characteristics && 
    typeof unit.characteristics === 'object' && 
    unit.characteristics[characteristic]
  );
};

/**
 * Filter units based on keyword
 */
export const filterUnitsByKeyword = (units: any[], keyword: string): any[] => {
  if (!keyword || keyword === 'all') return units;
  
  return units.filter(unit => 
    unit.keywords && 
    Array.isArray(unit.keywords) && 
    unit.keywords.some((k: string) => k.toLowerCase() === keyword.toLowerCase())
  );
};

/**
 * Get unique factions from unit data
 */
export const getUniqueFactions = (units: any[]): string[] => {
  const factionSet = new Set<string>();
  
  units.forEach(unit => {
    if (unit.faction) {
      factionSet.add(normalizeFactionName(unit.faction));
    }
  });
  
  return Array.from(factionSet).sort();
};

/**
 * Get unique characteristics from unit data
 */
export const getUniqueCharacteristics = (units: any[]): string[] => {
  const characteristicSet = new Set<string>();
  
  units.forEach(unit => {
    if (unit.characteristics && typeof unit.characteristics === 'object') {
      Object.keys(unit.characteristics).forEach(key => {
        if (unit.characteristics[key]) {
          characteristicSet.add(key);
        }
      });
    }
  });
  
  return Array.from(characteristicSet).sort();
};

/**
 * Get unique keywords from unit data
 */
export const getUniqueKeywords = (units: any[]): string[] => {
  const keywordSet = new Set<string>();
  
  units.forEach(unit => {
    if (unit.keywords && Array.isArray(unit.keywords)) {
      unit.keywords.forEach((keyword: string) => {
        keywordSet.add(keyword);
      });
    }
  });
  
  return Array.from(keywordSet).sort();
};
