import { Unit } from "@/types/army";
import UnitKeywords from "../UnitKeywords";

interface UnitCardKeywordsProps {
  unit: Unit;
  isKeywordsOpen?: boolean;
  setIsKeywordsOpen?: (open: boolean) => void;
  isMobile: boolean;
}

const UnitCardKeywords = ({ unit, isKeywordsOpen, setIsKeywordsOpen, isMobile }: UnitCardKeywordsProps) => {
  const KeywordsContent = () => (
    <div className="space-y-4">
      <UnitKeywords keywords={unit.keywords} specialRules={unit.specialRules} />
    </div>
  );

  if (isMobile) {
    return (
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
    );
  }

  return (
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
  );
};

export default UnitCardKeywords;