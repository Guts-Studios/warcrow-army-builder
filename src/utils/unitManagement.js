
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

// Add the missing functions that are imported by use-army-list.ts
export const getUpdatedQuantities = (
  unitId,
  currentQuantities,
  isAdding
) => {
  const newQuantities = { ...currentQuantities };
  const currentQty = currentQuantities[unitId] || 0;
  
  if (isAdding) {
    newQuantities[unitId] = currentQty + 1;
  } else if (currentQty > 0) {
    newQuantities[unitId] = currentQty - 1;
    // Remove the entry if quantity becomes zero
    if (newQuantities[unitId] === 0) {
      delete newQuantities[unitId];
    }
  }
  
  return newQuantities;
};

export const updateSelectedUnits = (
  selectedUnits,
  unit,
  isAdding
) => {
  if (!unit) return selectedUnits;
  
  const existingUnitIndex = selectedUnits.findIndex(u => u.id === unit.id);
  
  if (isAdding) {
    if (existingUnitIndex >= 0) {
      // Unit already exists, increment quantity
      const updatedUnits = [...selectedUnits];
      updatedUnits[existingUnitIndex] = {
        ...updatedUnits[existingUnitIndex],
        quantity: updatedUnits[existingUnitIndex].quantity + 1
      };
      return updatedUnits;
    } else {
      // Add new unit with quantity 1
      return [...selectedUnits, { ...unit, quantity: 1 }];
    }
  } else {
    // Removing a unit
    if (existingUnitIndex >= 0) {
      const updatedUnits = [...selectedUnits];
      const currentQty = updatedUnits[existingUnitIndex].quantity;
      
      if (currentQty > 1) {
        // Decrease quantity if more than 1
        updatedUnits[existingUnitIndex] = {
          ...updatedUnits[existingUnitIndex],
          quantity: currentQty - 1
        };
        return updatedUnits;
      } else {
        // Remove unit completely if quantity is 1
        return updatedUnits.filter(u => u.id !== unit.id);
      }
    }
  }
  
  return selectedUnits;
};

// Any other existing functions...
