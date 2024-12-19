import { Button } from "./ui/button";
import { Minus } from "lucide-react";
import { SelectedUnit } from "@/types/army";

interface SelectedUnitsProps {
  selectedUnits: SelectedUnit[];
  onRemove: (unitId: string) => void;
}

const SelectedUnits = ({ selectedUnits, onRemove }: SelectedUnitsProps) => {
  return (
    <div className="bg-warcrow-accent rounded-lg p-4 space-y-2">
      {selectedUnits.map((unit) => (
        <div
          key={unit.id}
          className="flex items-center justify-between bg-warcrow-background p-2 rounded"
        >
          <div className="flex items-center gap-2">
            <span className="text-warcrow-text">
              {unit.name} x{unit.quantity}
            </span>
            <span className="text-warcrow-muted">
              ({unit.pointsCost * unit.quantity} pts)
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(unit.id)}
            className="h-8 w-8 text-warcrow-gold hover:text-warcrow-gold/80"
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>
      ))}
      {selectedUnits.length === 0 && (
        <p className="text-warcrow-muted text-center py-4">No units selected</p>
      )}
    </div>
  );
};

export default SelectedUnits;