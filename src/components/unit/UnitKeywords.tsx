import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Keyword } from "@/types/army";
import { specialRuleDefinitions } from "@/data/specialRuleDefinitions";

interface UnitKeywordsProps {
  keywords: Keyword[];
  specialRules?: string[];
}

const UnitKeywords = ({ keywords, specialRules }: UnitKeywordsProps) => {
  const getDefinition = (name: string): string => {
    // First try exact match
    if (specialRuleDefinitions[name]) {
      return specialRuleDefinitions[name];
    }
    
    // If no match, try removing parameters in parentheses
    const baseKeyword = name.replace(/\s*\([^)]*\)/, '').trim();
    return specialRuleDefinitions[baseKeyword] || "No definition available";
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1">
        {keywords.map((keyword, index) => (
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  className="px-1.5 py-0.5 bg-warcrow-background text-warcrow-text text-xs rounded cursor-help"
                >
                  {keyword.name}
                </span>
              </TooltipTrigger>
              <TooltipContent className="max-w-[300px] text-sm">
                <p className="whitespace-pre-wrap">{keyword.description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
      {specialRules && specialRules.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {specialRules.map((rule, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    className="px-1.5 py-0.5 bg-warcrow-gold/20 text-warcrow-gold text-xs rounded cursor-help"
                  >
                    {rule}
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-[300px] text-sm">
                  <p className="whitespace-pre-wrap">
                    {getDefinition(rule)}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      )}
    </div>
  );
};

export default UnitKeywords;