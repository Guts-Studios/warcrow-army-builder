import { Keyword } from "@/types/army";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { keywordDefinitions } from "@/data/keywordDefinitions";

interface KeywordsSectionProps {
  keywords: Keyword[];
}

const KeywordsSection = ({ keywords }: KeywordsSectionProps) => {
  // Show all keywords except characteristics
  const filteredKeywords = keywords.filter(k => 
    !["Infantry", "Character", "Companion", "Colossal Company", "Orc", "Human", 
      "Dwarf", "Ghent", "Aestari", "Elf", "Varank", "Nemorous", "Beast", 
      "Construct", "Undead", "Mounted"].includes(k.name)
  );

  if (filteredKeywords.length === 0) return null;

  const getBaseKeyword = (keyword: string) => {
    return keyword.split('(')[0].trim();
  };

  return (
    <div className="space-y-2">
      <span className="text-xs font-semibold text-warcrow-text">Keywords:</span>
      <div className="flex flex-wrap gap-1.5">
        {filteredKeywords.map((keyword) => (
          <TooltipProvider key={keyword.name} delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  type="button"
                  className="px-2.5 py-1 text-xs rounded bg-warcrow-gold/20 border border-warcrow-gold hover:bg-warcrow-gold/30 transition-colors text-warcrow-text"
                >
                  {keyword.name}
                </button>
              </TooltipTrigger>
              <TooltipContent 
                side="top" 
                sideOffset={5}
                className="bg-warcrow-background border-warcrow-gold text-warcrow-text max-w-[250px] whitespace-normal"
              >
                <p className="text-sm leading-relaxed">{keywordDefinitions[getBaseKeyword(keyword.name)] || keyword.description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
};

export default KeywordsSection;