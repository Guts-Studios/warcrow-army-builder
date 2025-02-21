
import { useState, useCallback, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { SavedList } from "@/types/army";
import FactionSelector from "@/components/FactionSelector";
import ArmyList from "@/components/ArmyList";
import { useLocation } from "react-router-dom";

interface ArmyBuilderProps {
  session: Session | null;
}

const ArmyBuilder = ({ session }: ArmyBuilderProps) => {
  const location = useLocation();
  const [selectedFaction, setSelectedFaction] = useState("northern-tribes");
  const state = location.state as { selectedFaction?: string; loadList?: SavedList };

  useEffect(() => {
    // If we have a faction from the navigation state, use it
    if (state?.selectedFaction) {
      setSelectedFaction(state.selectedFaction);
    }
  }, [state]);

  const handleFactionChange = (factionId: string) => {
    setSelectedFaction(factionId);
  };

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
        initialList={state?.loadList}
      />
    </div>
  );
};

export default ArmyBuilder;
