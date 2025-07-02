import { Faction } from "@/types/army";

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
