import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { specialRuleDefinitions } from "@/data/specialRuleDefinitions";

interface UnitKeywordsProps {
  keywords?: Array<{ name: string; description: string }>;
  specialRules?: string[];
}

const UnitKeywords = ({ keywords = [], specialRules = [] }: UnitKeywordsProps) => {
  const [openTooltip, setOpenTooltip] = useState<string | null>(null);

  const getDefinition = (ruleName: string): string => {
    // First try exact match
    let definition = specialRuleDefinitions[ruleName];
    
    // If not found, try removing everything after the first parenthesis
    if (!definition) {
      const baseRuleName = ruleName.split('(')[0].trim();
      definition = specialRuleDefinitions[baseRuleName];
    }
    
    return definition || "Definition not found";
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1">
        {keywords.map((keyword, index) => (
          <TooltipProvider key={index} delayDuration={0}>
            <Tooltip 
              open={openTooltip === `keyword-${index}`}
              onOpenChange={(open) => {
                if (open) {
                  setOpenTooltip(`keyword-${index}`);
                } else if (openTooltip === `keyword-${index}`) {
                  setOpenTooltip(null);
                }
              }}
            >
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="px-1.5 py-0.5 bg-warcrow-background text-warcrow-text text-xs rounded cursor-help touch-none"
                  onTouchStart={(e) => {
                    e.preventDefault();
                    setOpenTooltip(`keyword-${index}`);
                  }}
                >
                  {keyword.name}
                </button>
              </TooltipTrigger>
              <TooltipContent 
                className="max-w-[300px] text-sm bg-warcrow-background border-warcrow-gold text-warcrow-text"
                sideOffset={5}
              >
                <p className="whitespace-pre-wrap">{keyword.description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>

      {specialRules && specialRules.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {specialRules.map((rule, index) => (
            <TooltipProvider key={index} delayDuration={0}>
              <Tooltip 
                open={openTooltip === `rule-${index}`}
                onOpenChange={(open) => {
                  if (open) {
                    setOpenTooltip(`rule-${index}`);
                  } else if (openTooltip === `rule-${index}`) {
                    setOpenTooltip(null);
                  }
                }}
              >
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="px-1.5 py-0.5 bg-warcrow-gold/20 text-warcrow-gold text-xs rounded cursor-help touch-none"
                    onTouchStart={(e) => {
                      e.preventDefault();
                      setOpenTooltip(`rule-${index}`);
                    }}
                  >
                    {rule}
                  </button>
                </TooltipTrigger>
                <TooltipContent 
                  className="max-w-[300px] text-sm bg-warcrow-background border-warcrow-gold text-warcrow-text"
                  sideOffset={5}
                >
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