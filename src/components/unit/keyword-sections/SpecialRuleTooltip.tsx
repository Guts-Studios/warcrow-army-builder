
import React, { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useLanguage } from '@/contexts/LanguageContext';
import { specialRuleDefinitions } from "@/data/specialRuleDefinitions";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslateKeyword } from '@/utils/translationUtils';

interface SpecialRuleTooltipProps {
  ruleName: string;
  originalName?: string; // Original untranslated name for looking up descriptions
  className?: string;
}

const SpecialRuleTooltip: React.FC<SpecialRuleTooltipProps> = ({ ruleName, originalName, className }) => {
  const { language } = useLanguage();
  const isMobile = useIsMobile();
  const [openDialog, setOpenDialog] = useState(false);
  const { translateSpecialRuleDescription } = useTranslateKeyword();
  
  // Extract the rule name without any parameters in parentheses
  const lookupName = originalName || ruleName; // Use original name for lookup if provided
  const basicRuleName = lookupName.split('(')[0].trim();
  
  // Get the description based on language
  const getDescription = (): string => {
    return translateSpecialRuleDescription(basicRuleName, language) || 
           specialRuleDefinitions[basicRuleName] || 
           'Description coming soon';
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
      <button 
        type="button"
        className={className || ''}
        onClick={() => setOpenDialog(true)}
      >
        {ruleName}
      </button>

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
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button 
            type="button"
            className={className || ''}
          >
            {ruleName}
          </button>
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          sideOffset={5}
          className="bg-warcrow-background border-warcrow-gold text-warcrow-text max-h-[300px] overflow-y-auto max-w-[400px] whitespace-normal p-4"
        >
          <p className="font-medium text-warcrow-gold mb-1">{ruleName}</p>
          <RuleContent />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SpecialRuleTooltip;
