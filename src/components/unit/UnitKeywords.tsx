
import { Keyword } from "@/types/army";
import KeywordsSection from "./keyword-sections/KeywordsSection";
import SpecialRulesSection from "./keyword-sections/SpecialRulesSection";
import CharacteristicsSection from "./keyword-sections/CharacteristicsSection";

interface UnitKeywordsProps {
  keywords: Keyword[] | string[];
  specialRules?: string[];
  highCommand?: boolean;
}

const UnitKeywords = ({ keywords, specialRules, highCommand }: UnitKeywordsProps) => {
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

  return (
    <div className="space-y-2">
      <CharacteristicsSection keywords={processedKeywords} highCommand={highCommand} />
      <KeywordsSection keywords={processedKeywords} />
      <SpecialRulesSection specialRules={specialRules} />
    </div>
  );
};

export default UnitKeywords;
