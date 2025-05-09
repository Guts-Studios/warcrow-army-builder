
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { specialRuleDefinitions } from "@/data/specialRuleDefinitions";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslateKeyword } from "@/utils/translationUtils";

interface SpecialRulesSectionProps {
  specialRules?: string[];
}

const SpecialRulesSection = ({ specialRules }: SpecialRulesSectionProps) => {
  const isMobile = useIsMobile();
  const { language } = useLanguage();
  const { translateSpecialRule } = useTranslateKeyword();
  const [openDialogRule, setOpenDialogRule] = useState<string | null>(null);

  if (!specialRules?.length) return null;

  const getBaseRule = (rule: string) => {
    return rule.split('(')[0].trim();
  };

  // Get only the rule name, not the description
  const getTranslatedRuleName = (rule: string, lang: string) => {
    const baseRule = getBaseRule(rule);
    if (lang === 'en') return rule; // Keep original for English
    
    // Extract just the name from original rule (to handle any parameters in parentheses)
    const ruleParams = rule.includes('(') ? rule.substring(rule.indexOf('(')) : '';
    
    // Get translated base rule name
    let translatedName = translateSpecialRule(baseRule, lang);
    
    // If translatedName contains description text (like a sentence with spaces),
    // it's likely returning the full description instead of just the name
    if (translatedName.includes(' ') && translatedName.length > 30) {
      // Fall back to the original rule name
      return baseRule + ruleParams;
    }
    
    // Append any parameters that were in the original rule
    return translatedName + ruleParams;
  };

  const RuleContent = ({ rule }: { rule: string }) => {
    const baseRule = getBaseRule(rule);
    
    // Try to get a translated definition if available
    let definition = specialRuleDefinitions[baseRule] || "Description coming soon";
    
    const paragraphs = definition.split('\n').filter(p => p.trim());

    return (
      <div className="space-y-2">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="text-sm leading-relaxed">{paragraph}</p>
        ))}
      </div>
    );
  };

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
              {getTranslatedRuleName(rule, language)}
            </button>
          ) : (
            <TooltipProvider key={rule} delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    type="button"
                    className="px-2.5 py-1 text-xs rounded bg-warcrow-gold/10 border border-warcrow-gold hover:bg-warcrow-gold/20 transition-colors text-warcrow-text"
                  >
                    {getTranslatedRuleName(rule, language)}
                  </button>
                </TooltipTrigger>
                <TooltipContent 
                  side="top"
                  sideOffset={5}
                  className="bg-warcrow-background border-warcrow-gold text-warcrow-text max-h-[300px] overflow-y-auto max-w-[400px] whitespace-normal p-4"
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
            className="bg-warcrow-background border border-warcrow-gold text-warcrow-text p-6 rounded-lg max-w-lg w-full mx-4 relative max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setOpenDialogRule(null)}
              className="absolute right-4 top-4 text-warcrow-text/70 hover:text-warcrow-text"
            >
              ✕
            </button>
            <h3 className="text-lg font-semibold mb-4">{getTranslatedRuleName(openDialogRule, language)}</h3>
            <div className="pt-2">
              <RuleContent rule={openDialogRule} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpecialRulesSection;
