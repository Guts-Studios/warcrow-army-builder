import { Unit } from "@/types/army";
import UnitHeader from "./unit/UnitHeader";
import UnitKeywords from "./unit/UnitKeywords";
import UnitControls from "./unit/UnitControls";

interface UnitCardProps {
  unit: Unit;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}

const UnitCard = ({ unit, quantity, onAdd, onRemove }: UnitCardProps) => {
  const portraitUrl = unit.imageUrl?.replace('card', 'portrait');

  return (
    <div className="relative bg-warcrow-card rounded-lg p-4 shadow-md border border-warcrow-gold/20">
      <div className="space-y-4">
        <UnitHeader
          unit={unit}
          mainName={unit.name}
          portraitUrl={portraitUrl}
        />
        
        <UnitKeywords 
          keywords={unit.keywords} 
          specialRules={unit.specialRules}
          companion={unit.companion}
        />

        <UnitControls
          pointsCost={unit.pointsCost}
          quantity={quantity}
          availability={unit.availability}
          onAdd={onAdd}
          onRemove={onRemove}
        />
      </div>
    </div>
  );
};

export default UnitCard;