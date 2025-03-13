
import { ExtendedUnit } from "@/types/extended-unit";
import UnitStatBlock from "./UnitStatBlock";
import UnitProfileBlock from "./UnitProfileBlock";
import UnitAbilitiesBlock from "./UnitAbilitiesBlock";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import UnitHeader from "../unit/UnitHeader";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface ExtendedUnitCardProps {
  unit: ExtendedUnit;
}

const ExtendedUnitCard = ({ unit }: ExtendedUnitCardProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <Card className="bg-warcrow-background border-warcrow-accent w-full max-w-4xl mx-auto shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-warcrow-gold hover:text-warcrow-gold/80 hover:bg-warcrow-accent/50"
            onClick={() => navigate('/playmode')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Units
          </Button>
          <span className="text-warcrow-gold font-bold text-lg bg-warcrow-accent px-3 py-1 rounded">
            {unit.pointsCost} pts
          </span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <UnitHeader 
            unit={unit} 
            mainName={unit.name}
            portraitUrl={unit.imageUrl}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <UnitStatBlock stats={unit.stats} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UnitProfileBlock profile={unit.profile1} title="Primary Profile" />
          {unit.profile2 && (
            <UnitProfileBlock profile={unit.profile2} title="Secondary Profile" />
          )}
        </div>
        
        <div className="space-y-6">
          <UnitAbilitiesBlock title="Skills" abilities={unit.skills} />
          <UnitAbilitiesBlock title="Command Abilities" abilities={unit.commands} />
          <UnitAbilitiesBlock title="Passive Abilities" abilities={unit.passives} />
        </div>
      </CardContent>
    </Card>
  );
};

export default ExtendedUnitCard;
