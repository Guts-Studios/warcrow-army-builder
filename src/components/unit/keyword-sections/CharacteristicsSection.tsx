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
  const characteristics = keywords.filter(k => 
    Object.keys(characteristicDefinitions).includes(k.name)
  );

  if (characteristics.length === 0) return null;

  return (
    <div className="space-y-1">
      <span className="text-xs text-warcrow-muted">Characteristics:</span>
      <div className="flex flex-wrap gap-1">
        {characteristics.map((keyword) => (
          <TooltipProvider key={keyword.name}>
            <Tooltip>
              <TooltipTrigger className="px-2 py-0.5 text-xs rounded bg-warcrow-accent/20 border border-warcrow-accent">
                {keyword.name}
              </TooltipTrigger>
              <TooltipContent>
                <p>{characteristicDefinitions[keyword.name] || keyword.description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
};

export default CharacteristicsSection;