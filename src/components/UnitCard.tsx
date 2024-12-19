import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Unit } from "@/types/army";
import { Plus, Minus, BadgeCheck } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UnitCardProps {
  unit: Unit;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}

const UnitCard = ({ unit, quantity, onAdd, onRemove }: UnitCardProps) => {
  return (
    <Card className="bg-warcrow-accent border-warcrow-gold animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-warcrow-gold flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span>{unit.name}</span>
            {unit.highCommand && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <BadgeCheck className="h-5 w-5 text-warcrow-gold" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>High Command</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <span className="text-sm">{unit.pointsCost} pts</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {unit.keywords.map((keyword, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-warcrow-background text-warcrow-text text-sm rounded"
                title={keyword.description}
              >
                {keyword.name}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={onRemove}
                disabled={quantity === 0}
                className="h-8 w-8 border-warcrow-gold text-warcrow-gold hover:bg-warcrow-gold hover:text-warcrow-background"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-warcrow-text min-w-[2rem] text-center">
                {quantity}/{unit.availability}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={onAdd}
                disabled={quantity >= unit.availability}
                className="h-8 w-8 border-warcrow-gold text-warcrow-gold hover:bg-warcrow-gold hover:text-warcrow-background"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <span className="text-warcrow-muted text-sm">
              Total: {unit.pointsCost * quantity} pts
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UnitCard;