
import { Unit, Keyword } from "@/types/army";
import UnitKeywords from "../UnitKeywords";

interface UnitCardKeywordsProps {
  unit: Unit;
  isMobile: boolean;
}

const UnitCardKeywords = ({ unit, isMobile }: UnitCardKeywordsProps) => {
  // Normalize keywords to ensure they're all Keyword objects
  const normalizedKeywords: Keyword[] = unit.keywords.map(keyword => {
    if (typeof keyword === 'string') {
      return { name: keyword, description: "" };
    }
    return keyword;
  });

  return (
    <div className="space-y-4">
      <UnitKeywords 
        keywords={normalizedKeywords} 
        specialRules={unit.specialRules} 
        highCommand={unit.highCommand}
      />
    </div>
  );
};

export default UnitCardKeywords;
