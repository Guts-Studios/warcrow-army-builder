import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { specialRuleDefinitions } from "@/data/specialRuleDefinitions";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

interface SpecialRulesSectionProps {
  specialRules?: string[];
}

const SpecialRulesSection = ({ specialRules }: SpecialRulesSectionProps) => {
  const isMobile = useIsMobile();
  const [openDialogRule, setOpenDialogRule] = useState<string | null>(null);

  if (!specialRules?.length) return null;

  const getBaseRule = (rule: string) => {
    return rule.split('(')[0].trim();
  };

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
            <button 
              key={rule}
              type="button"
              className="px-2.5 py-1 text-xs rounded bg-warcrow-gold/10 border border-warcrow-gold hover:bg-warcrow-gold/20 transition-colors text-warcrow-text"
              onClick={() => setOpenDialogRule(rule)}
            >
              {rule}
            </button>
          ) : (
            <TooltipProvider key={rule}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    type="button"
                    className="px-2.5 py-1 text-xs rounded bg-warcrow-gold/10 border border-warcrow-gold hover:bg-warcrow-gold/20 transition-colors text-warcrow-text"
                  >
                    {rule}
                  </button>
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

      {openDialogRule && (
        <div 
          role="dialog" 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setOpenDialogRule(null)}
        >
          <div 
            className="bg-warcrow-background border border-warcrow-gold text-warcrow-text p-6 rounded-lg max-w-lg w-full mx-4 relative"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setOpenDialogRule(null)}
              className="absolute right-4 top-4 text-warcrow-text/70 hover:text-warcrow-text"
            >
              ✕
            </button>
            <div className="pt-6">
              <RuleContent rule={openDialogRule} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpecialRulesSection;