import { Button } from "@/components/ui/button";
import { Minus } from "lucide-react";
import { SelectedUnit } from "@/types/army";
import CommandPoints from "./CommandPoints";
import HighCommandBadge from "./HighCommandBadge";
import UnitCardPreview from "./UnitCardPreview";

interface SelectedUnitCardProps {
  unit: SelectedUnit;
  onRemove: (unitId: string) => void;
}

const SelectedUnitCard = ({ unit, onRemove }: SelectedUnitCardProps) => {
  const formatUnitDisplay = (name: string, quantity: number | undefined) => {
    if (!name || typeof quantity !== 'number') return "";
    const displayQuantity = Math.min(quantity, 9);
    return `${name} x${displayQuantity}`;
  };

  return (
    <div className="flex items-center justify-between bg-warcrow-background p-2 rounded">
      <div className="flex items-center gap-2">
        <div className="text-warcrow-text flex items-center gap-1">
          <span>{formatUnitDisplay(unit.name, unit.quantity)}</span>
          {unit.command && <CommandPoints command={unit.command} />}
          {unit.highCommand && <HighCommandBadge />}
        </div>
        <span className="text-warcrow-muted">
          ({unit.pointsCost * unit.quantity} pts)
        </span>
      </div>
      <div className="flex items-center gap-1">
        <UnitCardPreview name={unit.name} imageUrl={unit.imageUrl} />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(unit.id)}
          className="h-8 w-8 text-warcrow-gold hover:text-warcrow-gold/80"
        >
          <Minus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default SelectedUnitCard;