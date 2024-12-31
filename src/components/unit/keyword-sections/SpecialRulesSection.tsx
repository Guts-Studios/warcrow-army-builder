import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { specialRuleDefinitions } from "@/data/specialRuleDefinitions";
import { useIsMobile } from "@/hooks/use-mobile";

interface SpecialRulesSectionProps {
  specialRules?: string[];
}

const SpecialRulesSection = ({ specialRules }: SpecialRulesSectionProps) => {
  const isMobile = useIsMobile();

  if (!specialRules?.length) return null;

  const getBaseRule = (rule: string) => {
    return rule.split('(')[0].trim();
  };

  const RuleButton = ({ rule }: { rule: string }) => (
    <button 
      type="button"
      className="px-2.5 py-1 text-xs rounded bg-warcrow-gold/10 border border-warcrow-gold hover:bg-warcrow-gold/20 transition-colors text-warcrow-text"
    >
      {rule}
    </button>
  );

  const RuleContent = ({ rule }: { rule: string }) => (
    <p className="text-sm leading-relaxed">
      {specialRuleDefinitions[getBaseRule(rule)] || "Description coming soon"}
    </p>
  );

  return (
    <div className="space-y-2">
      <span className="text-xs font-semibold text-warcrow-text">Special Rules:</span>
      <div className="flex flex-wrap gap-1.5">
        {specialRules.map((rule) => (
          isMobile ? (
            <Dialog key={rule}>
              <DialogTrigger asChild>
                <RuleButton rule={rule} />
              </DialogTrigger>
              <DialogContent className="bg-warcrow-background border-warcrow-gold text-warcrow-text">
                <RuleContent rule={rule} />
              </DialogContent>
            </Dialog>
          ) : (
            <TooltipProvider key={rule} delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <RuleButton rule={rule} />
                </TooltipTrigger>
                <TooltipContent 
                  className="bg-warcrow-background border-warcrow-gold text-warcrow-text max-h-[200px] overflow-y-auto max-w-[300px] whitespace-normal"
                >
                  <RuleContent rule={rule} />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        ))}
      </div>
    </div>
  );
};

export default SpecialRulesSection;