
import { specialRuleDefinitions } from "@/data/specialRuleDefinitions";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslateKeyword } from "@/utils/translationUtils";

interface SpecialRuleTooltipProps {
  ruleName: string;
}

const SpecialRuleTooltip = ({ ruleName }: SpecialRuleTooltipProps) => {
  const { language } = useLanguage();
  const { translateSpecialRuleDescription } = useTranslateKeyword();
  
  // Get translated rule description
  const ruleDescription = translateSpecialRuleDescription(ruleName);
  
  // Fall back to static definitions if translations aren't available
  const staticDescription = specialRuleDefinitions[ruleName] || "Description coming soon";
  const paragraphs = (ruleDescription || staticDescription).split('\n').filter(p => p.trim());

  return (
    <div className="space-y-2">
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="text-sm leading-relaxed">{paragraph}</p>
      ))}
    </div>
  );
};

export default SpecialRuleTooltip;
