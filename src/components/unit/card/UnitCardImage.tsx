import { Unit } from "@/types/army";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface UnitCardImageProps {
  unit: Unit;
}

const UnitCardImage = ({ unit }: UnitCardImageProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="w-full border border-warcrow-gold text-warcrow-gold hover:bg-warcrow-gold hover:text-black h-auto py-2"
        >
          <Eye className="h-4 w-4 mr-2" />
          View Card
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-warcrow-background border-warcrow-accent max-w-4xl w-[95vw] p-0">
        <DialogTitle className="sr-only">{unit.name} Card Image</DialogTitle>
        {unit.imageUrl ? (
          <img
            src={unit.imageUrl}
            alt={unit.name}
            className="w-full h-auto rounded-lg object-contain max-h-[90vh]"
            loading="eager"
          />
        ) : (
          <div className="w-full aspect-[2/3] bg-warcrow-background/50 rounded-lg flex items-center justify-center text-warcrow-muted">
            Card image coming soon
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UnitCardImage;