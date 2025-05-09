
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
  const { translateKeyword, translateKeywordDescription } = useTranslateKeyword();
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
  const translatedKeywords = processedKeywords.map(keyword => {
    if (language === 'en') {
      // For English, return the original keyword
      return { ...keyword };
    } else if (language === 'es' || language === 'fr') {
      // For other languages, translate the keyword
      const originalName = typeof keyword.name === 'string' ? keyword.name : '';
      return {
        name: translateKeyword(originalName, language),
        description: keyword.description ? translateKeywordDescription(originalName, language) : ''
      };
    }
    return keyword;
  });

  // For special rules, we'll let the SpecialRulesSection handle translations
  return (
    <div className="space-y-2">
      <KeywordsSection keywords={translatedKeywords} />
      <SpecialRulesSection specialRules={specialRules} />
    </div>
  );
};

export default UnitKeywords;
