
// Map to normalize older faction naming to canonical kebab-case versions
export const factionNameMap: Record<string, string> = {
  'Hegemony of Embersig': 'hegemony-of-embersig',
  'Northern Tribes': 'northern-tribes',
  'Scions of Yaldabaoth': 'scions-of-yaldabaoth',
  'Sÿenann': 'syenann',
  'Syenann': 'syenann',
  'hegemony': 'hegemony-of-embersig',
  'tribes': 'northern-tribes',
  'scions': 'scions-of-yaldabaoth'
};

// Format faction name for display (convert kebab-case to Title Case)
export const formatFactionName = (faction: string): string => {
  return faction.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

// Format unit type for display
export const getUnitType = (unit: any): string => {
  if (unit.highCommand) {
    return 'High Command';
  } else if (unit.keywords?.some((k: any) => {
    const keywordName = typeof k === 'string' ? k : k.name;
    return keywordName === 'Character';
  })) {
    return 'Character';
  } else {
    return 'Troop';
  }
};

// Format keywords for display
export const formatKeywords = (unit: any, translateKeyword: (key: string, lang: string) => string): string => {
  if (!unit.keywords || unit.keywords.length === 0) return '-';
  
  return unit.keywords.map((k: any) => {
    const keywordName = typeof k === 'string' ? k : k.name;
    return translateKeyword(keywordName, 'en');
  }).join(', ');
};

// Normalize and deduplicate units
export const normalizeAndDeduplicate = (units: any[]) => {
  // Normalize all units to ensure consistent faction values
  const normalizedUnits = units.map(unit => {
    // Normalize faction name if needed
    const normalizedFaction = factionNameMap[unit.faction] || unit.faction;
    
    return {
      ...unit,
      faction: normalizedFaction,
    };
  });
  
  // Deduplicate units based on name and faction
  const seen = new Map();
  const deduplicatedUnits = normalizedUnits.filter(unit => {
    const key = `${unit.name}_${unit.faction}`;
    if (seen.has(key)) {
      return false;
    }
    seen.set(key, true);
    return true;
  });

  // Get unique factions
  const uniqueFactions = new Set(deduplicatedUnits.map(unit => unit.faction));
  const factions = Array.from(uniqueFactions).sort();

  // Get unique unit types
  const types = new Set<string>();
  deduplicatedUnits.forEach(unit => {
    if (unit.highCommand) {
      types.add('high-command');
    } else if (unit.keywords?.some(k => {
      const keywordName = typeof k === 'string' ? k : k.name;
      return keywordName === 'Character';
    })) {
      types.add('character');
    } else {
      types.add('troop');
    }
  });
  const unitTypes = Array.from(types).sort();

  return { deduplicatedUnits, factions, unitTypes };
};
