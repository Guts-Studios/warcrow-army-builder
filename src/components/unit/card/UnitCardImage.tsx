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
          size="icon"
          className="w-full border border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5] hover:text-[#1A1F2C]"
        >
          <Eye className="h-4 w-4 mr-2" />
          View Card
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-warcrow-background border-warcrow-accent max-w-2xl">
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
  );
};

export default UnitCardImage;