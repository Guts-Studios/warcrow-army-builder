
import { SelectedUnit } from "@/types/army";
import SelectedUnits from "../SelectedUnits";
import ExportDialog from "./ExportDialog";

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
  return (
    <div className="sticky top-4 z-10 flex flex-col space-y-4 bg-warcrow-background/95 backdrop-blur-sm rounded-lg md:h-[calc(100vh-8rem)]">
      <div className="block md:hidden">
        <ExportDialog selectedUnits={selectedUnits} listName={currentListName} />
      </div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-warcrow-gold">Selected Units</h2>
        <div className="hidden md:block">
          <ExportDialog selectedUnits={selectedUnits} listName={currentListName} />
        </div>
      </div>
      <div className="flex-grow overflow-auto pb-20">
        <SelectedUnits selectedUnits={selectedUnits} onRemove={onRemove} />
      </div>
    </div>
  );
};

export default SelectedUnitsSection;
