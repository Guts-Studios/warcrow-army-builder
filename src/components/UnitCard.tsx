import { useState } from "react";
import { Plus, Minus, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Unit } from "@/types/army";
import UnitHeader from "./unit/UnitHeader";
import UnitKeywords from "./unit/UnitKeywords";
import UnitControls from "./unit/UnitControls";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

interface UnitCardProps {
  unit: Unit;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}

const UnitCard = ({ unit, quantity, onAdd, onRemove }: UnitCardProps) => {
  const isMobile = useIsMobile();
  const [isKeywordsOpen, setIsKeywordsOpen] = useState(false);

  const KeywordsContent = () => (
    <div className="space-y-4">
      <UnitKeywords unit={unit} />
    </div>
  );

  return (
    <div className="bg-warcrow-accent rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <UnitHeader unit={unit} />
        <UnitControls quantity={quantity} onAdd={onAdd} onRemove={onRemove} />
      </div>

      {/* Desktop View */}
      {!isMobile && (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full border-warcrow-gold text-warcrow-gold hover:bg-warcrow-gold hover:text-black"
            >
              View Keywords & Special Rules
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-warcrow-background border-warcrow-accent max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogTitle className="text-warcrow-gold">
              {unit.name} - Keywords & Special Rules
            </DialogTitle>
            <KeywordsContent />
          </DialogContent>
        </Dialog>
      )}

      {/* Mobile View */}
      {isMobile && (
        <Sheet open={isKeywordsOpen} onOpenChange={setIsKeywordsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="w-full border-warcrow-gold text-warcrow-gold hover:bg-warcrow-gold hover:text-black"
            >
              View Keywords & Special Rules
            </Button>
          </SheetTrigger>
          <SheetContent 
            side="bottom" 
            className="h-[80vh] bg-warcrow-background border-t border-warcrow-accent"
          >
            <SheetHeader>
              <SheetTitle className="text-warcrow-gold">
                {unit.name} - Keywords & Special Rules
              </SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto h-full pb-20">
              <KeywordsContent />
            </div>
          </SheetContent>
        </Sheet>
      )}

      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="w-full border border-warcrow-gold text-warcrow-gold hover:bg-warcrow-gold hover:text-black"
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
    </div>
  );
};

export default UnitCard;