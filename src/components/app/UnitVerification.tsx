
import { useEffect } from "react";
import { initializeUnitVerification } from "@/utils/unitVerification";
import { useArmyBuilderUnits } from "@/components/stats/unit-explorer/useUnitData";

/**
 * Component that runs unit verification checks on app initialization
 */
export const UnitVerification = () => {
  // Load units for the Scions of Yaldabaoth faction to verify Master Keorl
  const { data: scionsUnits, isSuccess } = useArmyBuilderUnits("scions-of-yaldabaoth");
  
  useEffect(() => {
    if (isSuccess) {
      // Only initialize once units are loaded
      initializeUnitVerification();
      
      // Check if Master Keorl exists and has correct data
      const masterKeorl = scionsUnits.find(unit => unit.id === "master-keorl");
      if (masterKeorl) {
        console.log("Master Keorl found in Scions units:", masterKeorl);
        
        // Verify expected properties
        const hasCorrectPointCost = masterKeorl.pointsCost === 55;
        const hasCorrectKeywords = masterKeorl.keywords.some(k => 
          (typeof k === 'string' ? k : k.name) === "Intimidating (3)"
        );
        const hasCorrectSpecialRules = masterKeorl.specialRules && 
          masterKeorl.specialRules.includes("Place (5)") &&
          masterKeorl.specialRules.includes("Imbue");
          
        console.log("Master Keorl validation:", {
          points: hasCorrectPointCost ? "✅" : "❌",
          keywords: hasCorrectKeywords ? "✅" : "❌",
          specialRules: hasCorrectSpecialRules ? "✅" : "❌"
        });
      } else {
        console.error("Master Keorl not found in Scions units");
      }
    }
  }, [isSuccess, scionsUnits]);
  
  // This component doesn't render anything
  return null;
};

export default UnitVerification;
