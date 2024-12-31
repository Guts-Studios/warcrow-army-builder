import { Keyword } from "@/types/army";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { characteristicDefinitions } from "@/data/characteristicDefinitions";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

interface CharacteristicsSectionProps {
  keywords: Keyword[];
  highCommand?: boolean;
}

const CharacteristicsSection = ({ keywords, highCommand }: CharacteristicsSectionProps) => {
  const isMobile = useIsMobile();
  const [openDialog, setOpenDialog] = useState<string | null>(null);

  const characteristics = keywords.filter(k => 
    ["Infantry", "Character", "Companion", "Colossal Company", "Orc", "Human", 
     "Dwarf", "Ghent", "Aestari", "Elf", "Varank", "Nemorous", "Beast", 
     "Construct", "Undead", "Mounted"].includes(k.name)
  );

  if (characteristics.length === 0 && !highCommand) return null;

  const CharacteristicButton = ({ text, className }: { text: string; className: string }) => (
    <button 
      type="button"
      className={className}
    >
      {text}
    </button>
  );

  const CharacteristicContent = ({ text }: { text: string }) => (
    <p className="text-sm leading-relaxed">{characteristicDefinitions[text] || "Description coming soon"}</p>
  );

  return (
    <div className="flex flex-wrap gap-1">
      {highCommand && (
        isMobile ? (
          <Dialog 
            open={openDialog === "High Command"}
            onOpenChange={(isOpen) => {
              console.log('Dialog state changing for High Command to:', isOpen);
              setOpenDialog(isOpen ? "High Command" : null);
            }}
          >
            <DialogTrigger asChild>
              <CharacteristicButton 
                text="High Command"
                className="px-2 py-0.5 text-xs rounded bg-warcrow-gold text-black"
              />
            </DialogTrigger>
            <DialogContent 
              className="bg-warcrow-background border-warcrow-gold text-warcrow-text"
            >
              <div className="pt-6">
                <CharacteristicContent text="High Command" />
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <CharacteristicButton 
                  text="High Command"
                  className="px-2 py-0.5 text-xs rounded bg-warcrow-gold text-black"
                />
              </TooltipTrigger>
              <TooltipContent 
                className="bg-warcrow-background border-warcrow-gold text-warcrow-text max-w-[250px] whitespace-normal"
              >
                <CharacteristicContent text="High Command" />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      )}
      {characteristics.map((keyword) => (
        isMobile ? (
          <Dialog 
            key={keyword.name}
            open={openDialog === keyword.name}
            onOpenChange={(isOpen) => {
              console.log('Dialog state changing for:', keyword.name, 'to:', isOpen);
              setOpenDialog(isOpen ? keyword.name : null);
            }}
          >
            <DialogTrigger asChild>
              <CharacteristicButton 
                text={keyword.name}
                className="px-2 py-0.5 text-xs rounded bg-warcrow-background/50 border border-warcrow-gold/50 text-warcrow-text"
              />
            </DialogTrigger>
            <DialogContent 
              className="bg-warcrow-background border-warcrow-gold text-warcrow-text"
            >
              <div className="pt-6">
                <CharacteristicContent text={keyword.name} />
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <TooltipProvider key={keyword.name}>
            <Tooltip>
              <TooltipTrigger asChild>
                <CharacteristicButton 
                  text={keyword.name}
                  className="px-2 py-0.5 text-xs rounded bg-warcrow-background/50 border border-warcrow-gold/50 text-warcrow-text"
                />
              </TooltipTrigger>
              <TooltipContent 
                className="bg-warcrow-background border-warcrow-gold text-warcrow-text max-w-[250px] whitespace-normal"
              >
                <CharacteristicContent text={keyword.name} />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      ))}
    </div>
  );
};

export default CharacteristicsSection;