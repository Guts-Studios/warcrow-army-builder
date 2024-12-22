import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Unit } from "@/types/army";
import { Plus, Minus, BadgeCheck, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  const unitType = unit.keywords.find(k => 
    ["Infantry", "Character"].includes(k.name)
  )?.name || "Unknown";

  return (
    <Card className="bg-warcrow-accent border-warcrow-gold animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-warcrow-gold flex justify-between items-center text-lg">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="truncate max-w-[200px]">{unit.name}</span>
              {unit.highCommand && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <BadgeCheck className="h-4 w-4 text-warcrow-gold" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>High Command</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-6 w-6 p-0.5 hover:bg-warcrow-gold/20"
                  >
                    <Eye className="h-4 w-4 text-warcrow-gold" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogTitle className="sr-only">{unit.name} Card Image</DialogTitle>
                  {unit.imageUrl ? (
                    <img 
                      src={unit.imageUrl} 
                      alt={unit.name} 
                      className="w-full h-auto rounded-lg"
                    />
                  ) : (
                    <div className="w-full aspect-[2/3] bg-warcrow-background/50 rounded-lg flex items-center justify-center text-warcrow-muted">
                      Card image coming soon
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
            <span className="text-xs text-warcrow-muted">{unitType}</span>
          </div>
          <span className="text-sm whitespace-nowrap">{unit.pointsCost} pts</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1">
            {unit.keywords.map((keyword, index) => (
              <span
                key={index}
                className="px-1.5 py-0.5 bg-warcrow-background text-warcrow-text text-xs rounded"
                title={keyword.description}
              >
                {keyword.name}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={onRemove}
                disabled={quantity === 0}
                className="h-7 w-7 bg-warcrow-background border-warcrow-gold text-warcrow-gold hover:bg-warcrow-gold hover:text-warcrow-background disabled:opacity-50 disabled:hover:bg-warcrow-background disabled:hover:text-warcrow-gold"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="text-warcrow-text min-w-[2rem] text-center text-sm">
                {quantity}/{unit.availability}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={onAdd}
                disabled={quantity >= unit.availability}
                className="h-7 w-7 bg-warcrow-background border-warcrow-gold text-warcrow-gold hover:bg-warcrow-gold hover:text-warcrow-background disabled:opacity-50 disabled:hover:bg-warcrow-background disabled:hover:text-warcrow-gold"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <span className="text-warcrow-muted text-xs">
              Total: {unit.pointsCost * quantity} pts
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UnitCard;