import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { specialRuleDefinitions } from "@/data/specialRuleDefinitions";
import { useIsMobile } from "@/hooks/use-mobile";

interface UnitKeywordsProps {
  keywords?: Array<{ name: string; description: string }>;
  specialRules?: string[];
}

const UnitKeywords = ({ keywords = [], specialRules = [] }: UnitKeywordsProps) => {
  const [openTooltip, setOpenTooltip] = useState<string | null>(null);
  const isMobile = useIsMobile();

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

  const handleTooltipInteraction = (tooltipId: string, isOpen: boolean) => {
    if (isMobile) {
      // On mobile, only close if clicking the same tooltip that's already open
      if (isOpen && openTooltip !== tooltipId) {
        setOpenTooltip(tooltipId);
      } else if (!isOpen && openTooltip === tooltipId) {
        setOpenTooltip(null);
      }
    } else {
      // On desktop, follow normal hover behavior
      setOpenTooltip(isOpen ? tooltipId : null);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1">
        {keywords.map((keyword, index) => (
          <TooltipProvider key={index} delayDuration={0}>
            <Tooltip 
              open={openTooltip === `keyword-${index}`}
              onOpenChange={(open) => handleTooltipInteraction(`keyword-${index}`, open)}
            >
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="px-1.5 py-0.5 bg-warcrow-background text-warcrow-text text-xs rounded cursor-help active:bg-warcrow-accent touch-none"
                  onClick={() => {
                    if (isMobile) {
                      handleTooltipInteraction(`keyword-${index}`, true);
                    }
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
                onOpenChange={(open) => handleTooltipInteraction(`rule-${index}`, open)}
              >
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="px-1.5 py-0.5 bg-warcrow-gold/20 text-warcrow-gold text-xs rounded cursor-help active:bg-warcrow-gold/30 touch-none"
                    onClick={() => {
                      if (isMobile) {
                        handleTooltipInteraction(`rule-${index}`, true);
                      }
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