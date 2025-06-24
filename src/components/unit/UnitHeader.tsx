
import { Unit, Keyword } from "@/types/army";
import AvatarPortrait from "./header/AvatarPortrait";
import UnitTitle from "./header/UnitTitle";
import CharacteristicsSection from "./keyword-sections/CharacteristicsSection";
import { useLanguage } from "@/contexts/LanguageContext";

interface UnitHeaderProps {
  unit: Unit;
  mainName: string;
  subtitle?: string;
  portraitUrl?: string;
}

const UnitHeader = ({ unit, mainName, subtitle, portraitUrl }: UnitHeaderProps) => {
  const { language } = useLanguage();
  
  // Normalize keywords to ensure they're all Keyword objects
  const normalizedKeywords: Keyword[] = unit.keywords.map(keyword => {
    if (typeof keyword === 'string') {
      return { name: keyword, description: "" };
    }
    return keyword;
  });

  // Use the passed mainName which should already be the correct display name
  console.log(`UnitHeader - Unit: ${unit.name}, Spanish name: ${unit.name_es}, Language: ${language}, Display name: ${mainName}`);

  return (
    <div className="flex items-start gap-2">
      <AvatarPortrait portraitUrl={portraitUrl} name={mainName} />
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
