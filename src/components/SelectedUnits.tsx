import { Button } from "./ui/button";
import { Minus, Eye } from "lucide-react";
import { SelectedUnit } from "@/types/army";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

  return (
    <div className="bg-warcrow-accent rounded-lg p-4 space-y-2">
      {sortedUnits.map((unit) => (
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
          <div className="flex items-center gap-1">
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8 text-warcrow-gold hover:text-warcrow-gold/80"
                >
                  <Eye className="h-4 w-4" />
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
      ))}
      {selectedUnits.length === 0 && (
        <p className="text-warcrow-muted text-center py-4">No units selected</p>
      )}
    </div>
  );
};

export default SelectedUnits;