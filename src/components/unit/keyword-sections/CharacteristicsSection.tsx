import { Keyword } from "@/types/army";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { characteristicDefinitions } from "@/data/characteristicDefinitions";

interface CharacteristicsSectionProps {
  keywords: Keyword[];
}

const CharacteristicsSection = ({ keywords }: CharacteristicsSectionProps) => {
  // Show characteristics (Infantry, Character, races, etc.)
  const characteristics = keywords.filter(k => 
    ["Infantry", "Character", "Companion", "Colossal Company", "Orc", "Human", 
     "Dwarf", "Ghent", "Aestari", "Elf", "Varank", "Nemorous", "Beast", 
     "Construct", "Undead", "Mounted"].includes(k.name)
  );

  if (characteristics.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {characteristics.map((keyword) => (
        <TooltipProvider key={keyword.name}>
          <Tooltip>
            <TooltipTrigger className="px-2 py-0.5 text-xs rounded bg-warcrow-background/50 border border-warcrow-gold/50 text-warcrow-text">
              {keyword.name}
            </TooltipTrigger>
            <TooltipContent className="bg-warcrow-background border-warcrow-gold text-warcrow-text max-w-[250px] whitespace-normal">
              <p className="text-sm leading-relaxed">{characteristicDefinitions[keyword.name] || keyword.description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};

export default CharacteristicsSection;