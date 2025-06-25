import { Faction } from "@/types/army";
import { northernTribesUnits } from "@/data/factions/northern-tribes";
import { hegemonyOfEmbersigUnits } from "@/data/factions/hegemony-of-embersig";
import { scionsOfYaldabaothUnits } from "@/data/factions/scions-of-yaldabaoth";
import { syenannUnits } from "@/data/factions/syenann";

// Define fallback factions in case the database fetch fails
export const factions: Faction[] = [
  { id: "northern-tribes", name: "Northern Tribes" },
  { id: "hegemony-of-embersig", name: "Hegemony of Embersig" },
  { id: "scions-of-yaldabaoth", name: "Scions of Yaldabaoth" },
  { id: "syenann", name: "Sÿenann" }
];

// Expanded map for normalizing faction names with more variations
export const factionNameMap: Record<string, string> = {
  // Display names to IDs
  'Hegemony of Embersig': 'hegemony-of-embersig',
  'Northern Tribes': 'northern-tribes',
  'Scions of Yaldabaoth': 'scions-of-yaldabaoth',
  'Sÿenann': 'syenann',
  'Syenann': 'syenann',
  
  // Short names and common variations
  'hegemony': 'hegemony-of-embersig',
  'tribes': 'northern-tribes',
  'northern': 'northern-tribes',
  'scions': 'scions-of-yaldabaoth',
  'yaldabaoth': 'scions-of-yaldabaoth',
  
  // Handle potential database inconsistencies
  'hegemony-embersig': 'hegemony-of-embersig',
  'hegemony_of_embersig': 'hegemony-of-embersig',
  'northern_tribes': 'northern-tribes',
  'scions_of_yaldabaoth': 'scions-of-yaldabaoth',
  'syenann_': 'syenann'
};

// Function to get all units for a faction
export const getAllFactionUnits = (factionId: string) => {
  switch (factionId) {
    case 'northern-tribes':
      return northernTribesUnits;
    case 'hegemony-of-embersig':
      return hegemonyOfEmbersigUnits;
    case 'scions-of-yaldabaoth':
      return scionsOfYaldabaothUnits;
    case 'syenann':
      return syenannUnits;
    default:
      return [];
  }
};

// Fixed normalize function to properly assign faction IDs
const normalizeUnits = () => {
  console.log('Starting unit normalization with explicit faction assignment...');
  
  // Explicitly assign correct faction IDs to each unit collection
  const factionUnitsMap = [
    { units: northernTribesUnits, factionId: 'northern-tribes', name: 'Northern Tribes' },
    { units: hegemonyOfEmbersigUnits, factionId: 'hegemony-of-embersig', name: 'Hegemony' },
    { units: scionsOfYaldabaothUnits, factionId: 'scions-of-yaldabaoth', name: 'Scions' },
    { units: syenannUnits, factionId: 'syenann', name: 'Syenann' }
  ];
  
  const allUnits = [];
  const seen = new Set();
  const factionCounts = {
    'northern-tribes': 0,
    'hegemony-of-embersig': 0,
    'scions-of-yaldabaoth': 0,
    'syenann': 0,
    'unknown': 0
  };
  
  // Process each faction's units with explicit faction assignment
  for (const factionGroup of factionUnitsMap) {
    console.log(`Processing ${factionGroup.name} units: ${factionGroup.units.length} units`);
    
    for (const unit of factionGroup.units) {
      // Skip units without an ID
      if (!unit.id) {
        console.warn(`Found unit without ID in ${factionGroup.name}:`, unit.name);
        continue;
      }
      
      // Check for duplicates
      if (seen.has(unit.id)) {
        console.warn(`Found duplicate unit ID: ${unit.name} with ID ${unit.id}`);
        continue;
      }
      
      // Create normalized unit with explicit faction assignment
      const normalizedUnit = {
        ...unit,
        faction: factionGroup.factionId,
        faction_id: factionGroup.factionId
      };
      
      seen.add(unit.id);
      allUnits.push(normalizedUnit);
      factionCounts[factionGroup.factionId]++;
    }
  }
  
  // Log final faction distribution
  console.log('Final faction distribution:');
  Object.entries(factionCounts).forEach(([faction, count]) => {
    console.log(`- ${faction}: ${count} units`);
  });
  
  console.log(`Total normalized units: ${allUnits.length}`);
  return allUnits;
};

// Export normalized and deduplicated units
export const units = normalizeUnits();

// Add a helper function to normalize faction IDs (can be used throughout the app)
export const normalizeFactionId = (factionId: string): string => {
  if (!factionId) return 'northern-tribes'; // Default faction
  
  // Handle direct match in map
  if (factionNameMap[factionId]) {
    return factionNameMap[factionId];
  }
  
  // Handle case insensitive match
  const lowercaseFactionId = factionId.toLowerCase();
  for (const [key, value] of Object.entries(factionNameMap)) {
    if (key.toLowerCase() === lowercaseFactionId) {
      return value;
    }
  }
  
  // If no match found, attempt to normalize kebab-case
  if (factionId.includes(' ')) {
    const kebabFactionId = factionId.toLowerCase().replace(/\s+/g, '-');
    if (factionNameMap[kebabFactionId]) {
      return factionNameMap[kebabFactionId];
    }
  }
  
  // If all else fails, return the original (but ensure it's lowercase and kebab-case)
  return factionId.toLowerCase().replace(/\s+/g, '-').replace(/_/g, '-');
};
