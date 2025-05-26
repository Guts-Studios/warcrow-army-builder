
import { Unit } from "@/types/army";
import CharacteristicsSection from "./keyword-sections/CharacteristicsSection";

interface UnitHeaderProps {
  unit: Unit;
  mainName?: string;
  portraitUrl?: string;
}

const UnitHeader = ({ unit, mainName, portraitUrl }: UnitHeaderProps) => {
  const displayName = mainName || unit.name;

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-3">
        {portraitUrl && (
          <img 
            src={portraitUrl} 
            alt={`${displayName} portrait`}
            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-warcrow-text truncate">
            {displayName}
          </h3>
          {unit.availability > 1 && (
            <p className="text-xs text-warcrow-text/70">
              Max {unit.availability}
            </p>
          )}
        </div>
      </div>
      
      <CharacteristicsSection 
        characteristics={unit.characteristics}
        highCommand={unit.highCommand}
      />
    </div>
  );
};

export default UnitHeader;
