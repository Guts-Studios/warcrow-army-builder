import { Keyword } from "@/types/army";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CharacteristicsSectionProps {
  keywords: Keyword[];
}

const CharacteristicsSection = ({ keywords }: CharacteristicsSectionProps) => {
  // Show characteristics (Infantry, Character, etc.)
  const characteristics = keywords.filter(k => 
    ["Infantry", "Character", "Companion", "Colossal Company"].includes(k.name)
  );

  if (characteristics.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {characteristics.map((keyword) => (
        <TooltipProvider key={keyword.name}>
          <Tooltip>
            <TooltipTrigger className="px-2 py-0.5 text-xs rounded bg-warcrow-background/50 border border-warcrow-gold/50">
              {keyword.name}
            </TooltipTrigger>
            <TooltipContent>
              <p>{keyword.description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};

export default CharacteristicsSection;