
import { useQuery } from '@tanstack/react-query';
import { units } from '@/data/factions';
import { Unit, ApiUnit, Faction } from '@/types/army';
import { removeDuplicateUnits, normalizeUnits, normalizeFactionId } from '@/utils/unitManagement';
import { factions as fallbackFactions } from '@/data/factions';
import { translations } from '@/i18n/translations';

// First normalize all units before using them as fallback data
const normalizedLocalUnits = normalizeUnits(units);

// Define missing key units to ensure they're included
const missingKeyUnits: Unit[] = [
  // Add Marhael The Refused if missing
  {
    id: "marhael_the_refused",
    name: "Marhael The Refused",
    faction: "scions-of-yaldabaoth",
    pointsCost: 275,
    availability: 1,
    highCommand: true,
    command: 2,
    keywords: [
      { name: "Character", description: "" },
      { name: "Infantry", description: "" },
      { name: "Undead", description: "" }
    ],
    specialRules: ["Unbreakable", "Regeneration", "Beyond Death"],
    imageUrl: "/art/card/marhael_the_refused_card.jpg"
  },
  // Update Nadezhda Lazard's point cost to 30 (from 275/285)
  {
    id: "nadezhda_lazard_champion_of_embersig",
    name: "Nadezhda Lazard, Champion of Embersig",
    faction: "hegemony-of-embersig",
    pointsCost: 30, // Updated from 275 to 30 to match the reference CSV data
    availability: 1,
    highCommand: true,
    command: 2,
    keywords: [
      { name: "Character", description: "" },
      { name: "Human", description: "" }
    ],
    specialRules: ["Join (Infantry)"],
    imageUrl: "/art/card/nadezhda_lazard_champion_of_embersig_card.jpg"
  }
];

// Check if key units are already in the normalized units
const marhaelExists = normalizedLocalUnits.some(unit => unit.id === "marhael_the_refused");
const lazardExists = normalizedLocalUnits.some(unit => unit.id === "nadezhda_lazard_champion_of_embersig");

// Add the missing units to our local data if they don't exist, or update them if they need correction
if (!marhaelExists) {
  normalizedLocalUnits.push(missingKeyUnits[0]);
  console.log("[useUnitData] Added missing unit: Marhael The Refused");
} else {
  // If Marhael exists but might be in wrong faction, update it
  const marhaelIndex = normalizedLocalUnits.findIndex(unit => unit.id === "marhael_the_refused");
  if (marhaelIndex >= 0) {
    normalizedLocalUnits[marhaelIndex] = {
      ...normalizedLocalUnits[marhaelIndex],
      ...missingKeyUnits[0]
    };
    console.log("[useUnitData] Updated existing unit: Marhael The Refused");
  }
}

if (!lazardExists) {
  normalizedLocalUnits.push(missingKeyUnits[1]);
  console.log("[useUnitData] Added missing unit: Nadezhda Lazard");
} else {
  // If Lazard exists but has wrong points cost, update it
  const lazardIndex = normalizedLocalUnits.findIndex(unit => unit.id === "nadezhda_lazard_champion_of_embersig");
  if (lazardIndex >= 0) {
    normalizedLocalUnits[lazardIndex] = {
      ...normalizedLocalUnits[lazardIndex],
      pointsCost: 30 // Fix points cost to 30
    };
    console.log("[useUnitData] Updated Nadezhda Lazard points cost to 30");
  }
}

// Now convert to ApiUnit format for consistency
const localUnits: ApiUnit[] = normalizedLocalUnits.map(unit => ({
  id: unit.id,
  name: unit.name,
  faction: unit.faction,
  faction_display: unit.faction,
  points: unit.pointsCost,
  keywords: unit.keywords.map(k => typeof k === 'string' ? k : k.name),
  special_rules: unit.specialRules || [],
  characteristics: {
    availability: unit.availability || 0,
    command: unit.command || 0,
    highCommand: unit.highCommand || false
  },
  type: 'unit'
}));

// Updated to use local data instead of database queries
export function useUnitData(selectedFaction: string) {
  const normalizedSelectedFaction = selectedFaction ? normalizeFactionId(selectedFaction) : 'all';
  
  return useQuery({
    queryKey: ['units', normalizedSelectedFaction],
    queryFn: async () => {
      console.log(`[useUnitData] Fetching units for faction: ${normalizedSelectedFaction}`);
      
      // Filter units by faction if needed
      let filteredUnits = localUnits;
      if (normalizedSelectedFaction !== 'all') {
        filteredUnits = localUnits.filter(unit => {
          // Make sure we normalize both factions for comparison
          const unitFaction = normalizeFactionId(unit.faction);
          return unitFaction === normalizedSelectedFaction;
        });
      }
      
      console.log(`[useUnitData] Found ${filteredUnits.length} units for faction: ${normalizedSelectedFaction}`);
      
      // Log unit names for debugging
      if (filteredUnits.length > 0) {
        console.log(`[useUnitData] Units for ${normalizedSelectedFaction}:`, 
          filteredUnits.map((u: any) => u.name).slice(0, 5), 
          `... (${filteredUnits.length} total)`
        );
      }
      
      return filteredUnits;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

// Updated to use local factions data
export function useFactions(language: string = 'en') {
  return useQuery({
    queryKey: ['factions', language],
    queryFn: async () => {
      console.log("[useFactions] Using local faction data");
      
      // Create language-specific faction names
      const localizedFactions: Faction[] = fallbackFactions.map(faction => {
        const baseKey = `faction_${faction.id.replace(/-/g, '_')}`;
        
        return {
          id: faction.id,
          name: language === 'en' ? faction.name : 
                language === 'es' ? translations[baseKey]?.es || faction.name : 
                language === 'fr' ? translations[baseKey]?.fr || faction.name : 
                faction.name,
          name_es: translations[baseKey]?.es || faction.name,
          name_fr: translations[baseKey]?.fr || faction.name
        };
      });
      
      return localizedFactions;
    },
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
  });
}

// Fixed mapApiUnitToUnit function to be more reliable
export function mapApiUnitToUnit(apiUnit: ApiUnit): Unit {
  // Safely access characteristics as an object and handle nullability
  const characteristics = apiUnit.characteristics && 
    typeof apiUnit.characteristics === 'object' ? 
    apiUnit.characteristics as Record<string, any> : {};
    
  // Normalize the faction ID to ensure it matches our expected format
  let normalizedFaction = normalizeFactionId(apiUnit.faction);
  
  return {
    id: apiUnit.id,
    name: apiUnit.name,
    faction: normalizedFaction,
    pointsCost: apiUnit.points,
    availability: characteristics?.availability || 0,
    command: characteristics?.command || 0,
    keywords: (apiUnit.keywords || []).map(k => ({ name: k })),
    specialRules: apiUnit.special_rules || [],
    highCommand: Boolean(characteristics?.highCommand) || false,
    imageUrl: characteristics?.imageUrl || `/art/card/${apiUnit.id}_card.jpg`
  };
}

// Updated to use local data for army builder with improved error handling for key units
export const useArmyBuilderUnits = (factionId: string) => {
  // Normalize the faction ID before making the query
  const normalizedFactionId = factionId ? normalizeFactionId(factionId) : '';
  
  return useQuery({
    queryKey: ['units', normalizedFactionId],
    queryFn: async () => {
      console.log(`[useArmyBuilderUnits] Fetching units for faction: ${normalizedFactionId}`);
      
      // Get normalized units from local data with matching faction
      const factionUnits = normalizedLocalUnits.filter(unit => {
        // We normalize both the unit's faction and the selected faction for comparison
        return normalizeFactionId(unit.faction) === normalizedFactionId;
      });
      
      console.log(`[useArmyBuilderUnits] Found ${factionUnits.length} units in local data`);
      
      // Force add key units if missing to ensure critical units are always available
      if (normalizedFactionId === 'scions-of-yaldabaoth') {
        const hasMarhael = factionUnits.some(u => u.id === 'marhael_the_refused');
        if (!hasMarhael) {
          console.warn("[useArmyBuilderUnits] Marhael is missing from Scions faction!");
          // Force add Marhael if missing
          const marhael = missingKeyUnits[0];
          factionUnits.push(marhael);
          console.log("[useArmyBuilderUnits] Force added missing unit: Marhael The Refused");
        }
      }
      
      if (normalizedFactionId === 'hegemony-of-embersig') {
        const hasLazard = factionUnits.some(u => u.id === 'nadezhda_lazard_champion_of_embersig');
        if (!hasLazard) {
          console.warn("[useArmyBuilderUnits] Lazard is missing from Hegemony faction!");
          // Force add Lazard if missing
          const lazard = missingKeyUnits[1];
          factionUnits.push(lazard);
          console.log("[useArmyBuilderUnits] Force added missing unit: Nadezhda Lazard");
        } else {
          // Make sure Lazard has the correct points cost
          const lazardUnit = factionUnits.find(u => u.id === 'nadezhda_lazard_champion_of_embersig');
          if (lazardUnit && lazardUnit.pointsCost !== 30) {
            console.log(`[useArmyBuilderUnits] Correcting Lazard's points from ${lazardUnit.pointsCost} to 30`);
            lazardUnit.pointsCost = 30;
          }
        }
      }
      
      return removeDuplicateUnits(factionUnits);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
