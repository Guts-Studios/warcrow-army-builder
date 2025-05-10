
import React, { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useLanguage } from '@/contexts/LanguageContext';
import { specialRuleDefinitions } from "@/data/specialRuleDefinitions";
import { useIsMobile } from "@/hooks/use-mobile";

interface SpecialRuleTooltipProps {
  ruleName: string;
  className?: string;
}

const SpecialRuleTooltip: React.FC<SpecialRuleTooltipProps> = ({ ruleName, className }) => {
  const { language } = useLanguage();
  const isMobile = useIsMobile();
  const [openDialog, setOpenDialog] = useState(false);
  
  // Extract the rule name without any parameters in parentheses
  const basicRuleName = ruleName.split('(')[0].trim();
  
  // Get the definition from our static definitions
  const getDescription = (): string => {
    // For now, we only have English definitions
    return specialRuleDefinitions[basicRuleName] || 'Description coming soon';
  };

  const RuleContent = () => {
    const definition = getDescription();
    const paragraphs = definition.split('\n').filter(p => p.trim());

    return (
      <div className="space-y-2">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="text-sm leading-relaxed">{paragraph}</p>
        ))}
      </div>
    );
  };
  
  return isMobile ? (
    <>
      <span 
        className={`cursor-help border-b border-dotted border-warcrow-gold/50 hover:border-warcrow-gold ${className || ''}`}
        onClick={() => setOpenDialog(true)}
      >
        {ruleName}
      </span>

      {openDialog && (
        <div 
          role="dialog" 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setOpenDialog(false)}
        >
          <div 
            className="bg-warcrow-background border border-warcrow-gold text-warcrow-text p-6 rounded-lg max-w-lg w-full mx-4 relative max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setOpenDialog(false)}
              className="absolute right-4 top-4 text-warcrow-text/70 hover:text-warcrow-text"
            >
              ✕
            </button>
            <h3 className="text-lg font-semibold mb-4">{ruleName}</h3>
            <div className="pt-2">
              <RuleContent />
            </div>
          </div>
        </div>
      )}
    </>
  ) : (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={`cursor-help border-b border-dotted border-warcrow-gold/50 hover:border-warcrow-gold ${className || ''}`}>
            {ruleName}
          </span>
        </TooltipTrigger>
        <TooltipContent 
          className="bg-warcrow-accent border-warcrow-gold/30 text-warcrow-text max-w-md"
          side="top"
          align="center"
        >
          <p className="font-medium text-warcrow-gold">{ruleName}</p>
          <div className="text-sm mt-1">
            <RuleContent />
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SpecialRuleTooltip;
