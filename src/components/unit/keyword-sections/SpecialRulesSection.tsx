import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { specialRuleDefinitions } from "@/data/specialRuleDefinitions";

interface SpecialRulesSectionProps {
  specialRules?: string[];
}

const SpecialRulesSection = ({ specialRules }: SpecialRulesSectionProps) => {
  if (!specialRules?.length) return null;

  const getBaseRule = (rule: string) => {
    return rule.split('(')[0].trim();
  };

  return (
    <div className="space-y-2">
      <span className="text-xs font-semibold text-warcrow-text">Special Rules:</span>
      <div className="flex flex-wrap gap-1.5">
        {specialRules.map((rule) => (
          <TooltipProvider key={rule} delayDuration={0}>
            <Tooltip>
              <TooltipTrigger className="px-2.5 py-1 text-xs rounded bg-warcrow-gold/10 border border-warcrow-gold hover:bg-warcrow-gold/20 transition-colors text-warcrow-text">
                {rule}
              </TooltipTrigger>
              <TooltipContent 
                className="bg-warcrow-background border-warcrow-gold text-warcrow-text max-h-[200px] overflow-y-auto max-w-[300px] whitespace-normal"
              >
                <p className="text-sm leading-relaxed">{specialRuleDefinitions[getBaseRule(rule)] || "Description coming soon"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
};

export default SpecialRulesSection;