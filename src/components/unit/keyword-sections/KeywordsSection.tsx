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
    !["Infantry", "Character", "Companion", "Colossal Company"].includes(k.name)
  );

  if (filteredKeywords.length === 0) return null;

  return (
    <div className="space-y-1">
      <span className="text-xs text-warcrow-muted">Keywords:</span>
      <div className="flex flex-wrap gap-1">
        {filteredKeywords.map((keyword) => (
          <TooltipProvider key={keyword.name}>
            <Tooltip>
              <TooltipTrigger className="px-2 py-0.5 text-xs rounded bg-warcrow-background border border-warcrow-gold">
                {keyword.name}
              </TooltipTrigger>
              <TooltipContent>
                <p>{keywordDefinitions[keyword.name] || keyword.description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
};

export default KeywordsSection;