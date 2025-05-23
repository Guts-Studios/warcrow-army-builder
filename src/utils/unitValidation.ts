
import { Unit } from "@/types/army";
import { normalizeFactionId } from "@/utils/unitManagement";

/**
 * Validates that all expected units for a faction are present
 * Useful for debugging issues with missing units
 */
export function validateFactionUnits(factionUnits: Unit[], factionId: string): {
  missingUnits: string[];
  allUnitsPresent: boolean;
  totalExpectedUnits: number;
  actualUnitsCount: number;
} {
  // Normalize faction ID to ensure consistent comparison
  const normalizedFactionId = normalizeFactionId(factionId);
  
  // Expected key units for each faction
  const expectedKeyUnits: Record<string, string[]> = {
    'northern-tribes': [
      'njord_the_merciless',
      'hersir',
      'iriavik_restless_pup',
      'hetman',
      'ice_archers',
      'ahlwardt_ice_bear'
    ],
    'hegemony-of-embersig': [
      'nadezhda_lazard_champion_of_embersig', 
      'marhael_the_refused', // Marhael confirmed in Hegemony
      'intact',
      'battle-scarred',
      'bulwarks',
      'pioneers',
      'grand_captain'
    ],
    'scions-of-yaldabaoth': [
      // Marhael removed from Scions expected units
      'echoes',
      'marked',
      'darkmaster',
      'marked_marksmen',
      'progenitor_sculptor'
    ],
    'syenann': [
      'lioslaith_coic_caledhee',
      'nuada',
      'namaoin',
      'aoidos',
      'grove_curtailers',
      'protectors_of_the_forest'
    ]
  };
  
  // Get expected units for this faction
  const expectedUnits = expectedKeyUnits[normalizedFactionId] || [];
  const totalExpectedUnits = expectedUnits.length;
  const actualUnitsCount = factionUnits.length;
  
  // Find any key units that are missing
  const missingUnits = expectedUnits.filter(
    expectedUnitId => !factionUnits.some(unit => unit.id === expectedUnitId)
  );
  
  return {
    missingUnits,
    allUnitsPresent: missingUnits.length === 0,
    totalExpectedUnits,
    actualUnitsCount
  };
}

// Add a new function to validate specific key units
export function validateKeyUnits(factionUnits: Unit[]): {
  marhaelCorrect: boolean;
  lazardCorrect: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  
  // Check for Marhael
  const marhael = factionUnits.find(unit => unit.id === "marhael_the_refused");
  const marhaelCorrect = marhael && 
                        marhael.faction === "hegemony-of-embersig" && 
                        marhael.pointsCost === 35 &&
                        marhael.highCommand === true;
                        
  if (!marhael) {
    issues.push("Marhael The Refused is missing");
  } else if (marhael.faction !== "hegemony-of-embersig") {
    issues.push(`Marhael The Refused has wrong faction: ${marhael.faction}, should be hegemony-of-embersig`);
  } else if (marhael.pointsCost !== 35) {
    issues.push(`Marhael The Refused has wrong points cost: ${marhael.pointsCost}, should be 35`);
  } else if (marhael.highCommand !== true) {
    issues.push(`Marhael The Refused should be highCommand: true`);
  }
  
  // Check for Lazard
  const lazard = factionUnits.find(unit => unit.id === "nadezhda_lazard_champion_of_embersig");
  const lazardCorrect = lazard && 
                       lazard.faction === "hegemony-of-embersig" && 
                       lazard.pointsCost === 30;
                       
  if (!lazard) {
    issues.push("Nadezhda Lazard is missing");
  } else if (lazard.faction !== "hegemony-of-embersig") {
    issues.push(`Nadezhda Lazard has wrong faction: ${lazard.faction}, should be hegemony-of-embersig`);
  } else if (lazard.pointsCost !== 30) {
    issues.push(`Nadezhda Lazard has wrong points cost: ${lazard.pointsCost}, should be 30`);
  }
  
  return {
    marhaelCorrect,
    lazardCorrect,
    issues
  };
}
