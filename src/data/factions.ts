
import { Unit, Faction } from '@/types/army';
import { loadAllFactionData } from '@/utils/csvToStaticGenerator';

// Faction definitions
export const factions: Faction[] = [
  {
    id: "syenann",
    name: "Sÿenann",
    name_es: "Sÿenann",
    name_fr: "Sÿenann"
  },
  {
    id: "northern-tribes",
    name: "Northern Tribes",
    name_es: "Tribus del Norte",
    name_fr: "Tribus du Nord"
  },
  {
    id: "hegemony-of-embersig",
    name: "Hegemony of Embersig",
    name_es: "Hegemonía de Embersig",
    name_fr: "Hégémonie d'Embersig"
  },
  {
    id: "scions-of-yaldabaoth",
    name: "Scions of Yaldabaoth",
    name_es: "Vástagos de Yaldabaoth",
    name_fr: "Rejetons de Yaldabaoth"
  }
];

// Load units from CSV files
let unitsCache: Unit[] | null = null;

export const loadUnits = async (): Promise<Unit[]> => {
  if (unitsCache) {
    return unitsCache;
  }

  try {
    console.log('[loadUnits] Loading units from CSV files...');
    const staticUnits = await loadAllFactionData();
    
    // Convert to Unit format
    const convertedUnits: Unit[] = staticUnits.map(staticUnit => ({
      id: staticUnit.id,
      name: staticUnit.name,
      name_es: staticUnit.name_es,
      name_fr: staticUnit.name_fr,
      faction: staticUnit.faction,
      faction_id: staticUnit.faction_id,
      pointsCost: staticUnit.pointsCost,
      availability: staticUnit.availability,
      command: staticUnit.command,
      keywords: staticUnit.keywords,
      specialRules: staticUnit.specialRules,
      highCommand: staticUnit.highCommand,
      tournamentLegal: staticUnit.tournamentLegal,
      imageUrl: staticUnit.imageUrl
    }));

    // Log tournament legal status for debugging
    const tournamentIllegalUnits = convertedUnits.filter(u => !u.tournamentLegal);
    console.log(`[loadUnits] Loaded ${convertedUnits.length} total units`);
    console.log(`[loadUnits] Found ${tournamentIllegalUnits.length} tournament illegal units:`);
    tournamentIllegalUnits.forEach(unit => {
      console.log(`  - ${unit.name} (${unit.faction}): ${unit.tournamentLegal}`);
    });

    unitsCache = convertedUnits;
    return convertedUnits;
  } catch (error) {
    console.error('[loadUnits] Error loading units:', error);
    return [];
  }
};

// Export units - this will be populated by the loadUnits function
export let units: Unit[] = [];

// Initialize units on module load
loadUnits().then(loadedUnits => {
  units.length = 0; // Clear array
  units.push(...loadedUnits); // Add loaded units
}).catch(error => {
  console.error('Failed to initialize units:', error);
});
