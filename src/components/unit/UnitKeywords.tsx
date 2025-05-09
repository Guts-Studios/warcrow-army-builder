
import { Keyword } from "@/types/army";
import KeywordsSection from "./keyword-sections/KeywordsSection";
import SpecialRulesSection from "./keyword-sections/SpecialRulesSection";
import { useTranslateKeyword } from "@/utils/translationUtils";
import { useLanguage } from '@/contexts/LanguageContext';

interface UnitKeywordsProps {
  keywords: Keyword[] | string[];
  specialRules?: string[];
}

const UnitKeywords = ({ keywords, specialRules }: UnitKeywordsProps) => {
  const { translateKeyword, translateKeywordDescription, translateSpecialRule } = useTranslateKeyword();
  const { language } = useLanguage();
  
  // Convert string[] to Keyword[] if needed
  const processedKeywords: Keyword[] = keywords.map(keyword => {
    if (typeof keyword === 'string') {
      return { 
        name: keyword, 
        description: "" 
      };
    }
    return keyword;
  });

  // If we're in a non-English language, translate the keywords
  if (language === 'es' || language === 'fr') {
    processedKeywords.forEach(keyword => {
      if (typeof keyword.name === 'string') {
        // Store original name for reference if needed
        const originalName = keyword.name;
        // Translate the keyword name
        keyword.name = translateKeyword(keyword.name, language);
        // If there's a description, translate that too
        if (keyword.description) {
          keyword.description = translateKeywordDescription(originalName, language);
        }
      }
    });
  }

  // Translate special rules if in non-English language
  const translatedSpecialRules = specialRules && (language === 'es' || language === 'fr')
    ? specialRules.map(rule => translateSpecialRule(rule, language))
    : specialRules;

  return (
    <div className="space-y-2">
      <KeywordsSection keywords={processedKeywords} />
      <SpecialRulesSection specialRules={translatedSpecialRules} />
    </div>
  );
};

export default UnitKeywords;
