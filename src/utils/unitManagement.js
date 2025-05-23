// Add this function if it doesn't exist yet
export const normalizeFactionId = (factionId) => {
  if (!factionId) return '';
  
  // Convert the faction ID to lowercase and trim spaces
  const normalized = factionId.toLowerCase().trim();
  
  // Map variations to standardized IDs
  const factionMap = {
    'syenann': 'syenann',
    'sÿenann': 'syenann',
    'the syenann': 'syenann',
    'northern tribes': 'northern-tribes',
    'hegemony of embersig': 'hegemony-of-embersig',
    'scions of yaldabaoth': 'scions-of-yaldabaoth',
    'scions of taldabaoth': 'scions-of-yaldabaoth',  // Handle Taldabaoth vs Yaldabaoth variations
  };
  
  // Return the mapped value if exists, otherwise standardize the format
  return factionMap[normalized] || normalized.replace(/\s+/g, '-');
};

// Other existing functions...
export const removeDuplicateUnits = (units) => {
  const uniqueUnits = [];
  const idMap = {};
  
  for (const unit of units) {
    if (!idMap[unit.id]) {
      uniqueUnits.push(unit);
      idMap[unit.id] = true;
    }
  }
  
  return uniqueUnits;
};

export const normalizeUnits = (units) => {
  return units.map(unit => {
    // Make sure faction_id exists
    if (!unit.faction_id) {
      unit.faction_id = unit.faction;
    }
    return unit;
  });
};

// Any other existing functions...
