
import { units } from "@/data/factions";
import { Unit } from "@/types/army";

/**
 * Utility to help identify potential issues with unit data
 */
export const auditUnits = () => {
  console.log("Beginning unit audit...");
  
  // Track units by ID to find duplicates
  const unitIds = new Map<string, Unit[]>();
  const unitNames = new Map<string, Unit[]>();
  const results = {
    totalUnits: units.length,
    duplicateIds: [] as string[],
    duplicateNames: [] as string[],
    missingImages: [] as string[],
    missingKeywords: [] as string[],
    missingSpecialRules: [] as string[],
    inconsistentPointCosts: [] as Array<{id: string, name: string, variants: number[]}>,
    suspiciousUnits: [] as Array<{unit: Unit, issues: string[]}>
  };
  
  // Process all units
  units.forEach(unit => {
    // Track by ID
    if (!unitIds.has(unit.id)) {
      unitIds.set(unit.id, [unit]);
    } else {
      unitIds.get(unit.id)!.push(unit);
      if (!results.duplicateIds.includes(unit.id)) {
        results.duplicateIds.push(unit.id);
      }
    }
    
    // Track by name
    if (!unitNames.has(unit.name)) {
      unitNames.set(unit.name, [unit]);
    } else {
      unitNames.get(unit.name)!.push(unit);
      if (!results.duplicateNames.includes(unit.name)) {
        results.duplicateNames.push(unit.name);
      }
    }
    
    // Check for missing image URL
    if (!unit.imageUrl) {
      results.missingImages.push(unit.id);
    }
    
    // Check for missing keywords
    if (!unit.keywords || unit.keywords.length === 0) {
      results.missingKeywords.push(unit.id);
    }
    
    // Check for common issues
    const issues: string[] = [];
    
    if (!unit.faction) issues.push("Missing faction");
    if (unit.pointsCost <= 0) issues.push("Invalid point cost");
    if (unit.highCommand && (!unit.command || unit.command < 2)) issues.push("High Command with low command value");
    
    if (issues.length > 0) {
      results.suspiciousUnits.push({unit, issues});
    }
  });
  
  // Find inconsistent point costs
  for (const [name, variants] of unitNames.entries()) {
    if (variants.length > 1) {
      const pointCosts = [...new Set(variants.map(u => u.pointsCost))];
      if (pointCosts.length > 1) {
        results.inconsistentPointCosts.push({
          id: variants[0].id,
          name,
          variants: pointCosts
        });
      }
    }
  }
  
  // Print the audit report
  console.log("Unit Audit Complete:", results);
  
  // Focus on any high command units with issues
  const highCommandIssues = results.suspiciousUnits.filter(item => 
    item.unit.highCommand || item.unit.command === 3
  );
  
  if (highCommandIssues.length > 0) {
    console.warn("High Command units with issues detected:", highCommandIssues);
  }
  
  // Look for issues with "Master Keorl" specifically
  const masterKeorlUnits = units.filter(u => u.name === "Master Keorl" || u.id === "master-keorl");
  if (masterKeorlUnits.length > 0) {
    console.log("Master Keorl units found:", masterKeorlUnits);
  } else {
    console.warn("No Master Keorl units found in the data");
  }
  
  return results;
};

// Utility to compare specific units by ID
export const compareUnitById = (unitId: string) => {
  const matchingUnits = units.filter(u => u.id === unitId);
  
  if (matchingUnits.length <= 1) {
    console.log(`Found ${matchingUnits.length} instances of unit with ID ${unitId}`);
    return matchingUnits[0];
  }
  
  console.warn(`Found ${matchingUnits.length} different instances of unit with ID ${unitId}`);
  
  // Compare the units
  const differences = matchingUnits.map((unit, index) => {
    if (index === 0) return null; // Skip first unit
    
    // Compare current unit with first one
    const diffs: Record<string, any> = {};
    
    if (unit.name !== matchingUnits[0].name) diffs.name = { first: matchingUnits[0].name, current: unit.name };
    if (unit.pointsCost !== matchingUnits[0].pointsCost) diffs.pointsCost = { first: matchingUnits[0].pointsCost, current: unit.pointsCost };
    if (unit.faction !== matchingUnits[0].faction) diffs.faction = { first: matchingUnits[0].faction, current: unit.faction };
    if (unit.highCommand !== matchingUnits[0].highCommand) diffs.highCommand = { first: matchingUnits[0].highCommand, current: unit.highCommand };
    if (unit.command !== matchingUnits[0].command) diffs.command = { first: matchingUnits[0].command, current: unit.command };
    
    return diffs;
  }).filter(Boolean);
  
  console.log("Differences between instances:", differences);
  
  return matchingUnits;
};
