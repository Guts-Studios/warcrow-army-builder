import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const unitType = unit.keywords.find(k => 
    ["Infantry", "Character"].includes(k.name)
  )?.name || "Unknown";

  // Convert the card image URL to a portrait URL
  const portraitUrl = unit.imageUrl?.replace('/card/', '/portrait/').replace('_card.jpg', '_portrait.jpg');

  // Split name into main name and subtitle if there's a comma
  const [mainName, subtitle] = unit.name.split(',').map(part => part.trim());

  return (
    <Card className="bg-warcrow-accent border-warcrow-gold animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-warcrow-gold flex justify-between items-center text-lg">
          <UnitHeader 
            unit={unit}
            mainName={mainName}
            subtitle={subtitle}
            portraitUrl={portraitUrl}
          />
          <span className="text-sm whitespace-nowrap">{unit.pointsCost} pts</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <UnitKeywords 
            keywords={unit.keywords}
            specialRules={unit.specialRules}
          />
          <UnitControls
            quantity={quantity}
            availability={unit.availability}
            pointsCost={unit.pointsCost}
            onAdd={onAdd}
            onRemove={onRemove}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default UnitCard;