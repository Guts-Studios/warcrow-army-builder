import { useArmyList } from "@/hooks/use-army-list";
import ListManagement from "./ListManagement";
import HighCommandAlert from "./army/HighCommandAlert";
import TotalPoints from "./army/TotalPoints";
import FactionSelector from "./FactionSelector";
import { useIsMobile } from "@/hooks/use-mobile";
import UnitListSection from "./army/UnitListSection";
import SelectedUnitsSection from "./army/SelectedUnitsSection";
import { Loader2 } from "lucide-react";

interface ArmyListProps {
  selectedFaction: string;
  onFactionChange: (faction: string) => void;
}

const ArmyList = ({ selectedFaction, onFactionChange }: ArmyListProps) => {
  const {
    quantities,
    selectedUnits,
    listName,
    currentListName,
    savedLists,
    showHighCommandAlert,
    setShowHighCommandAlert,
    setListName,
    handleAdd,
    handleRemove,
    handleNewList,
    handleSaveList,
    handleLoadList,
    factionUnits,
    isLoading,
  } = useArmyList(selectedFaction);

  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-warcrow-gold" />
      </div>
    );
  }

  return (
    <>
      <HighCommandAlert 
        open={showHighCommandAlert} 
        onOpenChange={setShowHighCommandAlert} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-20 md:pb-16">
        <div className="space-y-4 order-2 md:order-1">
          <UnitListSection
            factionUnits={factionUnits}
            quantities={quantities}
            onAdd={handleAdd}
            onRemove={handleRemove}
          />
        </div>

        <div className="space-y-4 order-1 md:order-2">
          <div className="flex items-center justify-between gap-2">
            <ListManagement
              listName={listName}
              currentListName={currentListName}
              onListNameChange={setListName}
              onSaveList={handleSaveList}
              onLoadList={handleLoadList}
              onNewList={handleNewList}
              savedLists={savedLists}
              selectedFaction={selectedFaction}
              selectedUnits={selectedUnits}
            />
          </div>
          
          {isMobile && (
            <FactionSelector
              selectedFaction={selectedFaction}
              onFactionChange={onFactionChange}
            />
          )}
          
          <SelectedUnitsSection
            selectedUnits={selectedUnits}
            currentListName={currentListName}
            onRemove={handleRemove}
          />
        </div>
      </div>

      <TotalPoints selectedUnits={selectedUnits} />
    </>
  );
};

export default ArmyList;