import { Keyword } from "@/types/army";
import KeywordsSection from "./keyword-sections/KeywordsSection";
import SpecialRulesSection from "./keyword-sections/SpecialRulesSection";

interface UnitKeywordsProps {
  keywords: Keyword[];
  specialRules?: string[];
}

const UnitKeywords = ({ keywords, specialRules }: UnitKeywordsProps) => {
  return (
    <div className="space-y-2">
      <KeywordsSection keywords={keywords} />
      <SpecialRulesSection specialRules={specialRules} />
    </div>
  );
};

export default UnitKeywords;