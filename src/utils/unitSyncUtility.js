
// Add this function to your unitSyncUtility.js file

// Generate unit code from database unit data
export const generateUnitCode = (unit) => {
  // Function to clean and format string arrays
  const formatStringArray = (arr) => {
    if (!Array.isArray(arr) || arr.length === 0) return '[]';
    return `[${arr.map(item => `"${item.trim()}"`).join(', ')}]`;
  };

  // Start building the unit object code
  let code = `  {\n`;
  code += `    id: "${unit.id}",\n`;
  code += `    name: "${unit.name}",\n`;
  code += `    faction: "${unit.faction}",\n`;
  
  // Include faction_id if available
  if (unit.faction_id && unit.faction_id !== unit.faction) {
    code += `    faction_id: "${unit.faction_id}",\n`;
  }
  
  code += `    pointsCost: ${unit.pointsCost || unit.points || 0},\n`;
  code += `    availability: ${unit.availability || 0},\n`;
  
  // Add command if available
  if (unit.command) {
    code += `    command: ${unit.command},\n`;
  }
  
  // Format keywords as array of objects
  const keywordsArr = Array.isArray(unit.keywords) ? unit.keywords : [];
  code += `    keywords: [\n`;
  code += keywordsArr.map(keyword => {
    return `      { name: "${keyword}", description: "" }`;
  }).join(',\n');
  code += `\n    ],\n`;
  
  // Add highCommand if true
  if (unit.highCommand) {
    code += `    highCommand: true,\n`;
  }
  
  // Add special rules if available
  if (unit.specialRules && unit.specialRules.length > 0) {
    code += `    specialRules: ${formatStringArray(unit.specialRules)},\n`;
  } else if (unit.special_rules && unit.special_rules.length > 0) {
    code += `    specialRules: ${formatStringArray(unit.special_rules)},\n`;
  }
  
  // Add imageUrl
  code += `    imageUrl: "/art/card/${unit.id}_card.jpg"\n`;
  code += `  }`;
  
  return code;
};

// Mock implementation of findMissingUnits for DataSyncButton.tsx
export const findMissingUnits = async (factionId) => {
  // This is a mock implementation that returns simulated data
  // In a real implementation, this would compare local data with database data
  console.log('Mock findMissingUnits called for faction:', factionId);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock comparison result
  return {
    onlyInDatabase: [
      { 
        id: `${factionId}_unit_1`, 
        name: "Example Unit 1", 
        faction: factionId,
        faction_id: factionId,
        pointsCost: 30,
        availability: 1,
        keywords: ["Keyword1", "Keyword2"],
        specialRules: ["Rule1", "Rule2"],
      }
    ],
    onlyInLocalData: [
      { 
        id: `${factionId}_unit_local`, 
        name: "Local Unit", 
        faction: factionId 
      }
    ],
    inBoth: [],
    nameMismatches: [],
    pointsMismatches: []
  };
};

// Rest of your existing utility functions...

