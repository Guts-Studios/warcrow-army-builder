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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-warcrow-gold">Selected Units</h2>
        <ExportDialog selectedUnits={selectedUnits} listName={currentListName} />
      </div>
      <SelectedUnits selectedUnits={selectedUnits} onRemove={onRemove} />
    </div>
  );
};

export default SelectedUnitsSection;