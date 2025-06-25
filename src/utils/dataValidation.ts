
import { Unit } from "@/types/army";

// Critical unit data validation for production issues
export const validateCriticalUnitData = (units: Unit[]): void => {
  console.log('[DATA-VALIDATION] 🔍 Starting critical unit data validation...');
  
  const criticalUnits = {
    'aide': { 
      expectedCost: 25, 
      expectedAvailability: 1, 
      expectedCommand: 1,
      name: 'Aide'
    }
  };
  
  units.forEach(unit => {
    const expected = criticalUnits[unit.id];
    if (expected) {
      const hasCorrectData = unit.pointsCost === expected.expectedCost && 
                            unit.availability === expected.expectedAvailability &&
                            unit.command === expected.expectedCommand;
      
      if (!hasCorrectData) {
        console.error(`[DATA-VALIDATION] ❌ CRITICAL DATA MISMATCH for ${unit.id}:`, {
          current: { 
            cost: unit.pointsCost, 
            availability: unit.availability, 
            command: unit.command 
          },
          expected: { 
            cost: expected.expectedCost, 
            availability: expected.expectedAvailability, 
            command: expected.expectedCommand 
          }
        });
        
        // Alert for immediate production detection
        console.error('🚨 PRODUCTION DATA ERROR: Users seeing incorrect unit stats!', {
          unitId: unit.id,
          unitName: unit.name,
          wrongData: unit,
          correctData: expected
        });
      } else {
        console.log(`[DATA-VALIDATION] ✅ ${unit.id} data is correct`);
      }
    }
  });
  
  console.log(`[DATA-VALIDATION] ✅ Validated ${units.length} units`);
};

// Emergency data fix - force correct values for critical units
export const emergencyDataFix = (units: Unit[]): Unit[] => {
  console.log('[EMERGENCY-FIX] 🚨 Applying emergency data corrections...');
  
  return units.map(unit => {
    if (unit.id === 'aide') {
      console.log('[EMERGENCY-FIX] 🔧 Correcting Aide unit data');
      return {
        ...unit,
        pointsCost: 25,
        availability: 1,
        command: 1,
        tournamentLegal: true
      };
    }
    return unit;
  });
};
