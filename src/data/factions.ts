
import { Faction } from "../types/army";
import { northernTribesUnits } from "./factions/northern-tribes";
import { hegemonyOfEmbersigUnits } from "./factions/hegemony-of-embersig";
import { scionsOfYaldabaothUnits } from "./factions/scions-of-yaldabaoth";
import { syenannUnits } from "./factions/syenann";

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

// Improved normalize and deduplicate units function
const normalizeUnits = () => {
  // Explicitly pre-normalize the Northern Tribes units to ensure consistent faction property
  const normalizedNorthernTribesUnits = northernTribesUnits.map(unit => ({
    ...unit,
    faction: 'northern-tribes'
  }));
  
  const allUnits = [
    ...normalizedNorthernTribesUnits,
    ...hegemonyOfEmbersigUnits, 
    ...scionsOfYaldabaothUnits, 
    ...syenannUnits
  ];
  
  const uniqueUnits = [];
  const seen = new Set();
  const namesByFaction: Record<string, Set<string>> = {};
  
  // Debug info about units before normalization
  console.log(`Normalizing ${allUnits.length} total units:`);
  console.log(`- Northern Tribes: ${normalizedNorthernTribesUnits.length}`);
  console.log(`- Hegemony: ${hegemonyOfEmbersigUnits.length}`);
  console.log(`- Scions: ${scionsOfYaldabaothUnits.length}`);
  console.log(`- Syenann: ${syenannUnits.length}`);
  
  // Keep track of faction distribution
  const factionCounts = {
    'northern-tribes': 0,
    'hegemony-of-embersig': 0,
    'scions-of-yaldabaoth': 0,
    'syenann': 0,
    'unknown': 0
  };
  
  // First pass: initialize namesByFaction sets
  Object.keys(factionCounts).forEach(faction => {
    namesByFaction[faction] = new Set();
  });
  
  for (const unit of allUnits) {
    // Skip units without an ID (should never happen but just in case)
    if (!unit.id) {
      console.warn("Found unit without ID:", unit.name);
      continue;
    }
    
    // Normalize faction name
    let normalizedFaction = unit.faction?.toLowerCase() || "";
    
    // Check if faction name needs normalization from the map
    if (factionNameMap[unit.faction]) {
      normalizedFaction = factionNameMap[unit.faction];
    }
    // Check if it's a space-separated name that needs conversion
    else if (unit.faction && unit.faction.includes(' ')) {
      const kebabName = unit.faction.toLowerCase().replace(/\s+/g, '-');
      normalizedFaction = factionNameMap[kebabName] || kebabName;
    }
    
    // Special case for Northern Tribes - ensure faction consistency
    if (unit.name.toLowerCase().includes('northern') || 
        (unit.faction && unit.faction.toLowerCase().includes('northern')) ||
        (unit.faction && unit.faction.toLowerCase().includes('tribe'))) {
      normalizedFaction = 'northern-tribes';
    }
    
    // Create a normalized unit with consistent faction naming
    const normalizedUnit = {
      ...unit,
      faction: normalizedFaction
    };
    
    // Create a unique key including both ID and faction to guarantee uniqueness
    const key = `${normalizedUnit.id}`;
    const nameKey = `${normalizedFaction}:${normalizedUnit.name.toLowerCase()}`;
    
    // Check for duplicates based on ID or name within same faction
    if (seen.has(key)) {
      console.warn(`Found duplicate unit ID: ${normalizedUnit.name} with ID ${normalizedUnit.id}`);
      continue;
    }
    
    // Check for duplicate names within the same faction
    if (namesByFaction[normalizedFaction] && namesByFaction[normalizedFaction].has(normalizedUnit.name.toLowerCase())) {
      console.warn(`Found duplicate unit name in ${normalizedFaction}: ${normalizedUnit.name}`);
      continue;
    }
    
    // Only add if we haven't seen this key before
    seen.add(key);
    if (namesByFaction[normalizedFaction]) {
      namesByFaction[normalizedFaction].add(normalizedUnit.name.toLowerCase());
    }
    
    uniqueUnits.push(normalizedUnit);
    
    // Count by faction
    if (factionCounts[normalizedFaction]) {
      factionCounts[normalizedFaction]++;
    } else {
      factionCounts['unknown']++;
      console.warn(`Unit ${normalizedUnit.name} has unknown faction: ${normalizedFaction}`);
    }
  }
  
  // Log faction distribution after normalization
  console.log('Final faction distribution:');
  Object.entries(factionCounts).forEach(([faction, count]) => {
    console.log(`- ${faction}: ${count} units`);
  });
  
  return uniqueUnits;
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
