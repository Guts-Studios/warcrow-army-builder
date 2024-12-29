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
    <div className="space-y-1">
      <span className="text-xs text-warcrow-muted">Special Rules:</span>
      <div className="flex flex-wrap gap-1">
        {specialRules.map((rule) => (
          <TooltipProvider key={rule}>
            <Tooltip>
              <TooltipTrigger className="px-2 py-0.5 text-xs rounded bg-warcrow-gold/10 border border-warcrow-gold">
                {rule}
              </TooltipTrigger>
              <TooltipContent>
                <p>{specialRuleDefinitions[getBaseRule(rule)] || "Description coming soon"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
};

export default SpecialRulesSection;