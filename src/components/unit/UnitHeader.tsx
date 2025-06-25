
import { Unit, Keyword } from "@/types/army";
import AvatarPortrait from "./header/AvatarPortrait";
import UnitTitle from "./header/UnitTitle";
import CharacteristicsSection from "./keyword-sections/CharacteristicsSection";

interface UnitHeaderProps {
  unit: Unit;
  mainName: string;
  subtitle?: string;
  portraitUrl?: string;
}

const UnitHeader = ({ unit, mainName, subtitle, portraitUrl }: UnitHeaderProps) => {
  // Normalize keywords to ensure they're all Keyword objects
  const normalizedKeywords: Keyword[] = unit.keywords.map(keyword => {
    if (typeof keyword === 'string') {
      return { name: keyword, description: "" };
    }
    return keyword;
  });

  return (
    <div className="flex items-start gap-2">
      <AvatarPortrait 
        portraitUrl={portraitUrl} 
        name={unit.name}
        fallback={mainName.split(' ').map(word => word[0]).join('')}
      />
      <div className="space-y-1">
        <UnitTitle 
          mainName={mainName}
          subtitle={subtitle}
          command={unit.command || Boolean(unit.command)}
        />
        <div className="mt-0.5">
          <CharacteristicsSection 
            keywords={normalizedKeywords}
            highCommand={unit.highCommand}
          />
        </div>
      </div>
    </div>
  );
};

export default UnitHeader;
