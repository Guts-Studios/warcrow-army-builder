
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useLanguage } from '@/contexts/LanguageContext';

interface SpecialRuleTooltipProps {
  ruleName: string;
  className?: string;
}

interface SpecialRule {
  name: string;
  description: string;
  description_es?: string;
  description_fr?: string;
}

const SpecialRuleTooltip: React.FC<SpecialRuleTooltipProps> = ({ ruleName, className }) => {
  const [rules, setRules] = useState<SpecialRule[]>([]);
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  
  // Extract the rule name without any parameters in parentheses
  const basicRuleName = ruleName.split('(')[0].trim();
  
  useEffect(() => {
    const fetchSpecialRule = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('special_rules')
          .select('*')
          .ilike('name', basicRuleName)
          .limit(1);
          
        if (error) throw error;
        if (data && data.length > 0) {
          setRules(data);
        }
      } catch (error) {
        console.error("Error fetching special rule:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSpecialRule();
  }, [basicRuleName]);
  
  const getDescription = (): string => {
    if (rules.length === 0) return 'No description available';
    const rule = rules[0];
    
    // Return the description based on the current language
    if (language === 'es' && rule.description_es) {
      return rule.description_es;
    } else if (language === 'fr' && rule.description_fr) {
      return rule.description_fr;
    }
    return rule.description || 'No description available';
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={`cursor-help border-b border-dotted border-warcrow-gold/50 hover:border-warcrow-gold ${className || ''}`}>
            {ruleName}
          </span>
        </TooltipTrigger>
        <TooltipContent 
          className="bg-warcrow-accent border-warcrow-gold/30 text-warcrow-text max-w-xs"
          side="top"
          align="center"
        >
          {isLoading ? (
            <p className="text-sm">Loading...</p>
          ) : (
            <>
              <p className="font-medium text-warcrow-gold">{ruleName}</p>
              <p className="text-sm mt-1">{getDescription()}</p>
            </>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SpecialRuleTooltip;
