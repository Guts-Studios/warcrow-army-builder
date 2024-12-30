import { Unit } from "@/types/army";
import AvatarPortrait from "./header/AvatarPortrait";
import UnitTitle from "./header/UnitTitle";

interface UnitHeaderProps {
  unit: Unit;
  mainName: string;
  subtitle?: string;
  portraitUrl?: string;
}

const UnitHeader = ({ unit, mainName, subtitle, portraitUrl }: UnitHeaderProps) => {
  return (
    <div className="flex items-center gap-2">
      <AvatarPortrait portraitUrl={portraitUrl} name={mainName} />
      <UnitTitle 
        mainName={mainName}
        subtitle={subtitle}
        highCommand={unit.highCommand}
      />
    </div>
  );
};

export default UnitHeader;