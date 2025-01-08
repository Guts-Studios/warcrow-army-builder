import { SelectedUnit } from "@/types/army";
import SelectedUnitCard from "./unit/selected/SelectedUnitCard";

interface SelectedUnitsProps {
  selectedUnits: SelectedUnit[];
  onRemove: (unitId: string) => void;
}

const SelectedUnits = ({ selectedUnits, onRemove }: SelectedUnitsProps) => {
  // Sort units to put High Command first
  const sortedUnits = [...selectedUnits].sort((a, b) => {
    if (a.highCommand && !b.highCommand) return -1;
    if (!a.highCommand && b.highCommand) return 1;
    return 0;
  });

  // Calculate total points
  const totalPoints = selectedUnits.reduce((total, unit) => {
    return total + (unit.pointsCost * unit.quantity);
  }, 0);

  // Calculate total command points
  const totalCommand = selectedUnits.reduce((total, unit) => {
    return total + ((unit.command || 0) * unit.quantity);
  }, 0);

  return (
    <div className="bg-warcrow-accent rounded-lg p-4 space-y-2">
      {sortedUnits.map((unit) => (
        <SelectedUnitCard
          key={unit.id}
          unit={unit}
          onRemove={onRemove}
        />
      ))}
      {selectedUnits.length === 0 ? (
        <p className="text-warcrow-muted text-center py-4">No units selected</p>
      ) : (
        <div className="flex justify-end pt-2 gap-4">
          <span className="text-warcrow-gold">
            Command: {totalCommand}
          </span>
          <span className="text-warcrow-gold">
            Total Points: {totalPoints}
          </span>
        </div>
      )}
    </div>
  );
};

export default SelectedUnits;