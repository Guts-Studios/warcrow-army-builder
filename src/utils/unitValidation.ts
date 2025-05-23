
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
      'marhael_the_refused', // Added Marhael to Hegemony expected units
      'intact',
      'battle-scarred',
      'bulwarks',
      'pioneers',
      'grand_captain'
    ],
    'scions-of-yaldabaoth': [
      // Removed Marhael from Scions expected units
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
