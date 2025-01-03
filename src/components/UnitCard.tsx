import { Unit } from "@/types/army";
import UnitHeader from "./unit/UnitHeader";
import UnitControls from "./unit/UnitControls";
import { useIsMobile } from "@/hooks/use-mobile";
import UnitCardKeywords from "./unit/card/UnitCardKeywords";
import UnitCardImage from "./unit/card/UnitCardImage";

interface UnitCardProps {
  unit: Unit;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}

const UnitCard = ({ unit, quantity, onAdd, onRemove }: UnitCardProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="bg-warcrow-accent rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <UnitHeader 
            unit={unit} 
            mainName={unit.name}
            portraitUrl={unit.imageUrl}
          />
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="text-warcrow-gold font-semibold">
            {unit.pointsCost} pts
          </span>
          <UnitControls 
            quantity={quantity} 
            onAdd={onAdd} 
            onRemove={onRemove}
            availability={unit.availability}
            pointsCost={unit.pointsCost}
          />
        </div>
      </div>

      <UnitCardKeywords 
        unit={unit}
        isMobile={isMobile}
      />

      <UnitCardImage unit={unit} />
    </div>
  );
};

export default UnitCard;