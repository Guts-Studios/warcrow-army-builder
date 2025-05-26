
import { Keyword } from "@/types/army";
import KeywordsSection from "./keyword-sections/KeywordsSection";
import SpecialRulesSection from "./keyword-sections/SpecialRulesSection";

interface UnitKeywordsProps {
  keywords: Keyword[];
  specialRules?: string[];
  highCommand?: boolean;
}

const UnitKeywords = ({ keywords, specialRules, highCommand }: UnitKeywordsProps) => {
  // Remove duplicates from keywords based on name
  const uniqueKeywords: Keyword[] = keywords.reduce((acc: Keyword[], current) => {
    const exists = acc.find(keyword => keyword.name === current.name);
    if (!exists) {
      acc.push(current);
    }
    return acc;
  }, []);

  // Remove duplicates from special rules if any
  const uniqueSpecialRules = specialRules ? [...new Set(specialRules)] : undefined;

  return (
    <div className="space-y-2">
      {/* CharacteristicsSection is now only rendered in UnitHeader */}
      <KeywordsSection keywords={uniqueKeywords} />
      <SpecialRulesSection specialRules={uniqueSpecialRules} />
    </div>
  );
};

export default UnitKeywords;
