
import { Unit } from "@/types/army";

export const normalizeUnits = (units: any[]): Unit[] => {
  console.log('[normalizeUnits] 🔄 Starting unit normalization with', units.length, 'units');
  
  return units.map((unit, index) => {
    // Enhanced tournament legal processing
    let tournamentLegal = true; // Default to tournament legal
    
    // Handle various formats from CSV data
    if (unit.tournamentLegal !== undefined) {
      if (typeof unit.tournamentLegal === 'boolean') {
        tournamentLegal = unit.tournamentLegal;
      } else if (typeof unit.tournamentLegal === 'string') {
        const lowerValue = unit.tournamentLegal.toLowerCase().trim();
        tournamentLegal = lowerValue !== 'false' && lowerValue !== 'no' && lowerValue !== '0' && lowerValue !== 'n';
      }
    }
    
    // Also check for 'Tournament Legal' field (with space) which might exist in CSV
    if (unit['Tournament Legal'] !== undefined) {
      if (typeof unit['Tournament Legal'] === 'string') {
        const lowerValue = unit['Tournament Legal'].toLowerCase().trim();
        tournamentLegal = lowerValue !== 'false' && lowerValue !== 'no' && lowerValue !== '0' && lowerValue !== 'n';
      }
    }
    
    const unitName = unit.name || unit['Unit Name EN'] || 'Unknown Unit';
    const pointsCost = parseInt(unit.pointsCost || unit['Points Cost'] || '0');
    const availability = parseInt(unit.availability || unit.AVB || '1');
    const command = parseInt(unit.command || unit.Command || '0') || undefined;
    
    console.log(`[normalizeUnits] Processing ${unitName} - Cost: ${pointsCost}, Availability: ${availability}, Command: ${command}, Tournament Legal: ${tournamentLegal}`);
    
    // CRITICAL: Validate known problematic units
    if (unitName === 'Aide') {
      console.log(`[normalizeUnits] 🔍 AIDE UNIT VALIDATION:`, {
        source: unit,
        normalized: { pointsCost, availability, command, tournamentLegal }
      });
      
      // Alert if Aide unit has wrong data
      if (pointsCost !== 25) {
        console.error(`[normalizeUnits] ❌ AIDE COST ERROR: Expected 25, got ${pointsCost}`);
      }
      if (availability !== 1) {
        console.error(`[normalizeUnits] ❌ AIDE AVAILABILITY ERROR: Expected 1, got ${availability}`);
      }
      if (command !== 1) {
        console.error(`[normalizeUnits] ❌ AIDE COMMAND ERROR: Expected 1, got ${command}`);
      }
    }
    
    const normalizedUnit: Unit = {
      id: unit.id || `${unitName}-${unit.faction || unit.Faction}`.replace(/\s+/g, '-').toLowerCase(),
      name: unitName,
      name_es: unit.name_es || unit['Unit Name SP'] || undefined,
      name_fr: unit.name_fr || unit['Unit Name FR'] || undefined,
      faction: unit.faction || unit.Faction || '',
      faction_id: unit.faction_id || unit['Faction ID'] || unit['faction_id'] || undefined,
      pointsCost,
      availability,
      command,
      keywords: Array.isArray(unit.keywords) ? unit.keywords : (unit.Keywords ? unit.Keywords.split(',').map((k: string) => k.trim()) : []),
      specialRules: Array.isArray(unit.specialRules) ? unit.specialRules : (unit['Special Rules'] ? unit['Special Rules'].split(',').map((r: string) => r.trim()) : []),
      highCommand: unit.highCommand === true || unit['High Command'] === 'Yes' || unit['High Command'] === true,
      imageUrl: unit.imageUrl,
      companion: unit.companion || unit.Companion || undefined,
      type: unit.type || unit['Unit Type'] || undefined,
      tournamentLegal
    };
    
    return normalizedUnit;
  });
};

export const removeDuplicateUnits = (units: Unit[]): Unit[] => {
  const seen = new Set<string>();
  return units.filter(unit => {
    const key = `${unit.name}-${unit.faction}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

export const normalizeFactionId = (factionId: string): string => {
  if (!factionId) return '';
  return factionId.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
};

export const getUpdatedQuantities = (unitId: string, quantities: Record<string, number>, isAdding: boolean): Record<string, number> => {
  const newQuantities = { ...quantities };
  const currentQuantity = newQuantities[unitId] || 0;
  
  if (isAdding) {
    newQuantities[unitId] = currentQuantity + 1;
  } else {
    if (currentQuantity > 0) {
      newQuantities[unitId] = currentQuantity - 1;
      if (newQuantities[unitId] === 0) {
        delete newQuantities[unitId];
      }
    }
  }
  
  return newQuantities;
};

export const updateSelectedUnits = (selectedUnits: any[], unit: any, isAdding: boolean): any[] => {
  if (isAdding) {
    const existingUnit = selectedUnits.find(u => u.id === unit.id);
    if (existingUnit) {
      return selectedUnits.map(u => 
        u.id === unit.id 
          ? { ...u, quantity: u.quantity + 1 }
          : u
      );
    } else {
      return [...selectedUnits, { ...unit, quantity: 1 }];
    }
  } else {
    return selectedUnits.map(u => 
      u.id === unit.id 
        ? { ...u, quantity: u.quantity - 1 }
        : u
    ).filter(u => u.quantity > 0);
  }
};
