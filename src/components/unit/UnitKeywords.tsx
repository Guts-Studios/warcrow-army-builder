
import { Keyword } from "@/types/army";
import KeywordsSection from "./keyword-sections/KeywordsSection";
import SpecialRulesSection from "./keyword-sections/SpecialRulesSection";

interface UnitKeywordsProps {
  keywords: Keyword[] | string[];
  specialRules?: string[];
  highCommand?: boolean;
}

const UnitKeywords = ({ keywords, specialRules, highCommand }: UnitKeywordsProps) => {
  // Convert string[] to Keyword[] if needed and remove duplicates
  const processedKeywords: Keyword[] = Array.from(new Set(
    keywords.map(keyword => {
      if (typeof keyword === 'string') {
        return keyword;
      }
      return keyword.name;
    })
  )).map(keywordName => {
    return { 
      name: keywordName, 
      description: "" 
    };
  });

  // Remove duplicates from special rules if any
  const uniqueSpecialRules = specialRules ? [...new Set(specialRules)] : undefined;

  return (
    <div className="space-y-2">
      {/* CharacteristicsSection is now only rendered in UnitHeader */}
      <KeywordsSection keywords={processedKeywords} />
      <SpecialRulesSection specialRules={uniqueSpecialRules} />
    </div>
  );
};

export default UnitKeywords;
