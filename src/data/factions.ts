
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

// Map for normalizing faction names
const factionNameMap: Record<string, string> = {
  'Hegemony of Embersig': 'hegemony-of-embersig',
  'Northern Tribes': 'northern-tribes',
  'Scions of Yaldabaoth': 'scions-of-yaldabaoth',
  'Sÿenann': 'syenann',
  'Syenann': 'syenann',
  'hegemony': 'hegemony-of-embersig',
  'tribes': 'northern-tribes',
  'scions': 'scions-of-yaldabaoth'
};

// Normalize and deduplicate units
const normalizeUnits = () => {
  const allUnits = [...northernTribesUnits, ...hegemonyOfEmbersigUnits, ...scionsOfYaldabaothUnits, ...syenannUnits];
  const uniqueUnits = [];
  const seen = new Set();
  
  for (const unit of allUnits) {
    // Normalize faction name
    let normalizedFaction = unit.faction.toLowerCase();
    
    // Check if faction name needs normalization
    if (factionNameMap[unit.faction]) {
      normalizedFaction = factionNameMap[unit.faction];
    }
    // Check if it's a space-separated name that needs conversion
    else if (unit.faction.includes(' ')) {
      const kebabName = unit.faction.toLowerCase().replace(/\s+/g, '-');
      normalizedFaction = factionNameMap[kebabName] || kebabName;
    }
    
    const normalizedUnit = {
      ...unit,
      faction: normalizedFaction
    };
    
    // Create a unique key for each unit
    const key = `${normalizedUnit.name}_${normalizedUnit.faction}`;
    
    // Only add if we haven't seen this key before
    if (!seen.has(key)) {
      seen.add(key);
      uniqueUnits.push(normalizedUnit);
    }
  }
  
  return uniqueUnits;
};

// Export normalized and deduplicated units
export const units = normalizeUnits();
