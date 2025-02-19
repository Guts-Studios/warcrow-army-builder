
import { useState, useCallback } from "react";
import { Session } from "@supabase/supabase-js";
import { Unit, SelectedUnit } from "@/types/army";
import { units } from "@/data/factions";
import FactionSelector from "@/components/FactionSelector";
import ArmyList from "@/components/ArmyList";

interface ArmyBuilderProps {
  session: Session | null;
}

const ArmyBuilder = ({ session }: ArmyBuilderProps) => {
  const [selectedFaction, setSelectedFaction] = useState("northern-tribes");
  const [selectedUnits, setSelectedUnits] = useState<SelectedUnit[]>([]);

  const handleFactionChange = (factionId: string) => {
    setSelectedFaction(factionId);
    setSelectedUnits([]);
  };

  const handleListLoad = useCallback((name: string) => {
    // This will be handled by the ArmyList component
  }, []);

  const handleListClear = useCallback(() => {
    setSelectedUnits([]);
  }, []);

  return (
    <div className="space-y-8">
      <div className="hidden md:block">
        <FactionSelector
          selectedFaction={selectedFaction}
          onFactionChange={handleFactionChange}
        />
      </div>

      <ArmyList
        selectedFaction={selectedFaction}
        onFactionChange={handleFactionChange}
      />
    </div>
  );
};

export default ArmyBuilder;
