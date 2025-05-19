
import { specialRuleDefinitions } from "@/data/specialRuleDefinitions";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslateKeyword } from "@/utils/translationUtils";

interface SpecialRuleTooltipProps {
  ruleName: string;
}

const SpecialRuleTooltip = ({ ruleName }: SpecialRuleTooltipProps) => {
  const { language } = useLanguage();
  const { translateSpecialRuleDescription } = useTranslateKeyword();
  
  // Extract the base rule name without parameters
  const baseRuleName = ruleName.split('(')[0].trim();
  
  // Get translated rule description
  const ruleDescription = translateSpecialRuleDescription(baseRuleName);
  
  // Fall back to static definitions if translations aren't available
  const staticDescription = specialRuleDefinitions[baseRuleName] || "Description coming soon";
  const description = ruleDescription || staticDescription;
  
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
