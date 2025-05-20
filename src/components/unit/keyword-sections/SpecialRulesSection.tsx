
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslateKeyword } from "@/utils/translationUtils";
import SpecialRuleTooltip from "./SpecialRuleTooltip";
import { supabase } from "@/integrations/supabase/client";

interface SpecialRulesSectionProps {
  specialRules?: string[];
}

interface RuleTranslation {
  name: string;
  name_es?: string;
  name_fr?: string;
}

// Define a type for the database record to help with type safety
interface SpecialRuleRecord {
  name: string;
  name_es?: string;
  name_fr?: string;
  [key: string]: any; // Allow for additional properties
}

const SpecialRulesSection = ({ specialRules }: SpecialRulesSectionProps) => {
  const isMobile = useIsMobile();
  const [openDialogRule, setOpenDialogRule] = useState<string | null>(null);
  const { language } = useLanguage();
  const { translateSpecialRule } = useTranslateKeyword();
  const [dbTranslations, setDbTranslations] = useState<Record<string, RuleTranslation>>({});

  // Fetch all special rule translations from database
  useEffect(() => {
    const fetchSpecialRuleTranslations = async () => {
      try {
        const { data, error } = await supabase
          .from('special_rules')
          .select('name, name_es, name_fr');
          
        if (error) {
          console.error('Error fetching special rule translations:', error);
          return;
        }
        
        if (data && Array.isArray(data)) {
          // Convert array to record for easy lookup
          const translationsRecord: Record<string, RuleTranslation> = {};
          
          data.forEach(rule => {
            // Ensure rule is a proper object and has name property
            if (rule && typeof rule === 'object' && 'name' in rule) {
              const specialRule = rule as SpecialRuleRecord;
              translationsRecord[specialRule.name] = {
                name: specialRule.name,
                name_es: specialRule.name_es,
                name_fr: specialRule.name_fr
              };
            }
          });
          
          setDbTranslations(translationsRecord);
        }
      } catch (err) {
        console.error('Error in fetchSpecialRuleTranslations:', err);
      }
    };
    
    fetchSpecialRuleTranslations();
  }, []);

  if (!specialRules || specialRules.length === 0) return null;

  // Get section title based on language
  const sectionTitle = language === 'en' ? 'Special Rules' : 
                      (language === 'es' ? 'Reglas especiales' : 'Règles spéciales');

  // Function to get translated rule name, prioritizing database translations
  const getTranslatedRuleName = (ruleName: string) => {
    // Extract base rule name without parameters
    const baseRuleName = ruleName.split('(')[0].trim();
    
    // Get potential parameters
    const hasParams = ruleName.includes('(');
    const params = hasParams ? ruleName.substring(ruleName.indexOf('(')) : '';
    
    // Look for translation in database first
    if (dbTranslations[baseRuleName]) {
      const translation = language === 'es' ? 
        dbTranslations[baseRuleName].name_es : 
        (language === 'fr' ? 
          dbTranslations[baseRuleName].name_fr : 
          baseRuleName);
          
      if (translation) {
        return hasParams ? `${translation} ${params}` : translation;
      }
    }
    
    // Fall back to utility translation
    if (language !== 'en') {
      const utilityTranslation = translateSpecialRule(ruleName);
      if (utilityTranslation !== ruleName) {
        return utilityTranslation;
      }
    }
    
    // If no translation found, return original name
    return ruleName;
  };

  return (
    <div className="space-y-2">
      <span className="text-xs font-semibold text-warcrow-text">
        {sectionTitle}:
      </span>
      <div className="flex flex-wrap gap-1.5">
        {specialRules.map((rule) => {
          // Get translated rule name
          const displayName = getTranslatedRuleName(rule);
          
          return isMobile ? (
            <button 
              key={rule}
              type="button"
              className="px-2.5 py-1 text-xs rounded bg-warcrow-gold/50 border border-warcrow-gold hover:bg-warcrow-gold/60 transition-colors text-black"
              onClick={() => setOpenDialogRule(rule)}
            >
              {displayName}
            </button>
          ) : (
            <TooltipProvider key={rule} delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    type="button"
                    className="px-2.5 py-1 text-xs rounded bg-warcrow-gold/50 border border-warcrow-gold hover:bg-warcrow-gold/60 transition-colors text-black"
                  >
                    {displayName}
                  </button>
                </TooltipTrigger>
                <TooltipContent 
                  side="top" 
                  sideOffset={5}
                  className="bg-warcrow-background border-warcrow-gold text-warcrow-text max-h-[300px] overflow-y-auto max-w-[400px] whitespace-normal p-4"
                >
                  <p className="font-medium text-warcrow-gold mb-1">{displayName}</p>
                  <SpecialRuleTooltip ruleName={rule} />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
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
            <h3 className="text-lg font-semibold mb-4">
              {getTranslatedRuleName(openDialogRule)}
            </h3>
            <div className="pt-2">
              <SpecialRuleTooltip ruleName={openDialogRule} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpecialRulesSection;
