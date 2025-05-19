
import { specialRuleDefinitions } from "@/data/specialRuleDefinitions";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslateKeyword } from "@/utils/translationUtils";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

interface SpecialRuleTooltipProps {
  ruleName: string;
}

const SpecialRuleTooltip = ({ ruleName }: SpecialRuleTooltipProps) => {
  const { language } = useLanguage();
  const { translateSpecialRuleDescription } = useTranslateKeyword();
  const [dbRuleDescription, setDbRuleDescription] = useState<string | null>(null);
  
  // Extract the base rule name without parameters
  const baseRuleName = ruleName.split('(')[0].trim();
  
  // Fetch the rule from the database when the component mounts or ruleName changes
  useEffect(() => {
    const fetchRuleFromDb = async () => {
      try {
        const { data, error } = await supabase
          .from('special_rules')
          .select(`description, description_${language === 'en' ? 'en' : language}`)
          .eq('name', baseRuleName)
          .single();
        
        if (error) {
          console.error(`Error fetching rule ${baseRuleName}:`, error);
          return;
        }
        
        if (data) {
          const translatedDescription = language !== 'en' 
            ? data[`description_${language}`] || data.description 
            : data.description;
            
          if (translatedDescription) {
            setDbRuleDescription(translatedDescription);
          }
        }
      } catch (err) {
        console.error(`Error in fetchRuleFromDb for ${baseRuleName}:`, err);
      }
    };
    
    fetchRuleFromDb();
  }, [baseRuleName, language]);
  
  // Use the database description if available, otherwise use translation or static definition
  const translateDescription = translateSpecialRuleDescription(baseRuleName);
  const staticDescription = specialRuleDefinitions[baseRuleName] || "Description coming soon";
  
  // Use dbRuleDescription if available, otherwise fall back to translated or static description
  const description = dbRuleDescription || translateDescription || staticDescription;
  
  // Split by newlines to create paragraphs
  const paragraphs = (description).split('\n').filter(p => p.trim());

  return (
    <div className="space-y-2">
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="text-sm leading-relaxed">{paragraph}</p>
      ))}
    </div>
  );
};

export default SpecialRuleTooltip;
