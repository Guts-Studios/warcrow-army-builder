
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
  const { translateKeyword, translateSpecialRule } = useTranslateKeyword();
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

  // If we're in Spanish, translate the keywords
  if (language === 'es') {
    processedKeywords.forEach(keyword => {
      if (typeof keyword.name === 'string') {
        // Store original name for reference if needed
        const originalName = keyword.name;
        // Translate the keyword name
        keyword.name = translateKeyword(keyword.name);
      }
    });
  }

  // Translate special rules if in Spanish
  const translatedSpecialRules = specialRules && language === 'es'
    ? specialRules.map(rule => translateSpecialRule(rule))
    : specialRules;

  return (
    <div className="space-y-2">
      <KeywordsSection keywords={processedKeywords} />
      <SpecialRulesSection specialRules={translatedSpecialRules} />
    </div>
  );
};

export default UnitKeywords;
