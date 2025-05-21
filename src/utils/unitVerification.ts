
import { units } from "@/data/factions";
import { Unit, Keyword } from "@/types/army";
import { toast } from "sonner";

// Create hash for unit to use as integrity check
const createUnitHash = (unit: Unit): string => {
  const keywordStr = unit.keywords
    .map(k => typeof k === 'string' ? k : k.name)
    .sort()
    .join('|');
  
  const specialRulesStr = (unit.specialRules || []).sort().join('|');
  
  // Create a simple hash of important unit properties
  const hashString = `${unit.id}|${unit.name}|${unit.pointsCost}|${unit.faction}|${keywordStr}|${specialRulesStr}|${unit.highCommand}|${unit.command}|${unit.availability}`;
  
  // Simple hash function for verification purposes
  let hash = 0;
  for (let i = 0; i < hashString.length; i++) {
    const char = hashString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return hash.toString(36); // Convert to base36 for shorter string
};

// Store reference hashes for units that should be protected
const PROTECTED_UNITS: Record<string, string> = {
  // Scions of Yaldabaoth High Command
  "master-nepharim": createUnitHash(units.find(u => u.id === "master-nepharim")!),
  "master-keorl": createUnitHash(units.find(u => u.id === "master-keorl")!)
  // Add more protected units as needed
};

// Compare unit against stored reference hash
export const verifyUnitIntegrity = (unit: Unit): boolean => {
  // Skip verification for units that aren't protected
  if (!PROTECTED_UNITS[unit.id]) return true;
  
  // Create hash of current unit state
  const currentHash = createUnitHash(unit);
  
  // Compare to reference hash
  const isValid = currentHash === PROTECTED_UNITS[unit.id];
  
  // Log problem if invalid
  if (!isValid) {
    console.error(`Unit integrity check failed for ${unit.name} (${unit.id})`, {
      currentHash,
      expectedHash: PROTECTED_UNITS[unit.id]
    });
    
    toast.error(`Unit data verification failed for ${unit.name}`, {
      description: "The unit may have been modified incorrectly. Please report this to the administrator."
    });
  }
  
  return isValid;
};

// Additional utility function to help debug unit differences
export const compareUnits = (unitA: Unit, unitB: Unit): Record<string, any> => {
  const differences: Record<string, any> = {};
  
  // Check basic properties
  if (unitA.name !== unitB.name) differences.name = { a: unitA.name, b: unitB.name };
  if (unitA.pointsCost !== unitB.pointsCost) differences.pointsCost = { a: unitA.pointsCost, b: unitB.pointsCost };
  if (unitA.faction !== unitB.faction) differences.faction = { a: unitA.faction, b: unitB.faction };
  if (unitA.highCommand !== unitB.highCommand) differences.highCommand = { a: unitA.highCommand, b: unitB.highCommand };
  if (unitA.command !== unitB.command) differences.command = { a: unitA.command, b: unitB.command };
  if (unitA.availability !== unitB.availability) differences.availability = { a: unitA.availability, b: unitB.availability };
  
  // Compare keywords
  const keywordsA = new Set(unitA.keywords.map(k => typeof k === 'string' ? k : k.name));
  const keywordsB = new Set(unitB.keywords.map(k => typeof k === 'string' ? k : k.name));
  
  if (keywordsA.size !== keywordsB.size || 
      [...keywordsA].some(k => !keywordsB.has(k))) {
    differences.keywords = {
      a: [...keywordsA],
      b: [...keywordsB],
      onlyInA: [...keywordsA].filter(k => !keywordsB.has(k)),
      onlyInB: [...keywordsB].filter(k => !keywordsA.has(k))
    };
  }
  
  // Compare special rules
  const specialRulesA = new Set(unitA.specialRules || []);
  const specialRulesB = new Set(unitB.specialRules || []);
  
  if (specialRulesA.size !== specialRulesB.size || 
      [...specialRulesA].some(r => !specialRulesB.has(r))) {
    differences.specialRules = {
      a: [...specialRulesA],
      b: [...specialRulesB],
      onlyInA: [...specialRulesA].filter(r => !specialRulesB.has(r)),
      onlyInB: [...specialRulesB].filter(r => !specialRulesA.has(r))
    };
  }
  
  return differences;
};

// Add a function to initialize validators in the main app
export const initializeUnitVerification = () => {
  console.log("Unit verification system initialized");
  
  // Verify the integrity of Master Keorl specifically
  const masterKeorl = units.find(unit => unit.id === "master-keorl");
  
  if (masterKeorl) {
    const isValid = verifyUnitIntegrity(masterKeorl);
    console.log(`Master Keorl verification: ${isValid ? "PASSED" : "FAILED"}`);
  } else {
    console.error("Master Keorl not found in units data");
  }
};
