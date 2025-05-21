
import { useState, useEffect } from "react";
import ArmyList from "@/components/army/ArmyList";
import { useArmyBuilderUnits } from "@/components/stats/unit-explorer/useUnitData";
import { Unit } from "@/types/army";
import { removeDuplicateUnits } from "@/utils/unitManagement";
import { verifyUnitIntegrity } from "@/utils/unitVerification";
import UnitVerification from "@/components/app/UnitVerification";

const ArmyBuilder = () => {
  const [selectedFaction, setSelectedFaction] = useState<string | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(false);

  const { data: factionUnits, isLoading, error } = useArmyBuilderUnits(selectedFaction || "");

  useEffect(() => {
    if (isLoading) {
      setLoading(true);
    }

    if (factionUnits && !isLoading) {
      // Add integrity verification for all units being loaded
      const verifiedUnits = factionUnits.map(unit => {
        // Verify unit integrity
        verifyUnitIntegrity(unit);
        return unit;
      });
      
      setUnits(removeDuplicateUnits(verifiedUnits));
      setLoading(false);
    }
  }, [factionUnits, isLoading]);

  return (
    <>
      {/* Silent component that verifies unit integrity */}
      <UnitVerification />
      
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <ArmyList
          selectedFaction={selectedFaction}
          onFactionChange={(faction) => setSelectedFaction(faction)}
          initialList={undefined}
        />
      </div>
    </>
  );
};

export default ArmyBuilder;
