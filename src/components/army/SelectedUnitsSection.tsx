
import { SelectedUnit, SavedList } from "@/types/army";
import SelectedUnits from "../SelectedUnits";
import ExportDialog from "./ExportDialog";
import ShareListButton from "./ShareListButton";

interface SelectedUnitsSectionProps {
  selectedUnits: SelectedUnit[];
  currentListName: string | null;
  onRemove: (unitId: string) => void;
}

const SelectedUnitsSection = ({
  selectedUnits,
  currentListName,
  onRemove,
}: SelectedUnitsSectionProps) => {
  // Create a temporary SavedList object for the share button
  const currentList: SavedList = {
    id: `temp-${Date.now()}`,
    name: currentListName || "Untitled List",
    faction: selectedUnits.length > 0 ? selectedUnits[0].faction : "",
    units: selectedUnits,
    created_at: new Date().toISOString()
  };

  return (
    <div className="sticky top-4 z-10 flex flex-col space-y-4 bg-warcrow-background/95 backdrop-blur-sm rounded-lg md:h-[calc(100vh-8rem)]">
      <div className="block md:hidden">
        <ExportDialog selectedUnits={selectedUnits} listName={currentListName} />
      </div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-warcrow-gold">Selected Units</h2>
        <div className="hidden md:flex gap-2">
          {selectedUnits.length > 0 && currentListName && (
            <ShareListButton list={currentList} />
          )}
          <ExportDialog selectedUnits={selectedUnits} listName={currentListName} />
        </div>
      </div>
      <div className="flex-grow overflow-auto pb-4">
        <SelectedUnits selectedUnits={selectedUnits} onRemove={onRemove} />
      </div>
    </div>
  );
};

export default SelectedUnitsSection;
