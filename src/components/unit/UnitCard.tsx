
import { Unit } from "@/types/army";
import UnitHeader from "@/components/unit/UnitHeader";
import UnitControls from "@/components/unit/UnitControls";
import { useIsMobile } from "@/hooks/use-mobile";
import UnitCardKeywords from "@/components/unit/card/UnitCardKeywords";
import { useLanguage } from "@/contexts/LanguageContext";
import { generateCardUrl } from "@/utils/imageUtils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import UnitCardDialog from "@/components/stats/unit-explorer/UnitCardDialog";
import { Badge } from "@/components/ui/badge";

interface UnitCardProps {
  unit: Unit;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}

const UnitCard = ({ unit, quantity, onAdd, onRemove }: UnitCardProps) => {
  const isMobile = useIsMobile();
  const { language } = useLanguage();
  const [isCardDialogOpen, setIsCardDialogOpen] = useState<boolean>(false);
  
  // Get the appropriate unit name based on language
  const getUnitName = () => {
    if (language === 'es' && unit.name_es) {
      return unit.name_es;
    }
    return unit.name;
  };

  const displayName = getUnitName();

  // Function to handle view card button click
  const handleViewCardClick = () => {
    const url = generateCardUrl(unit.name, language);
    console.log("Opening card dialog with URL:", url);
    setIsCardDialogOpen(true);
  };

  // Enhanced tournament legal check with better debugging
  const isNotTournamentLegal = unit.tournamentLegal === false || String(unit.tournamentLegal).toLowerCase() === "false";
  
  // Debug logging for production troubleshooting - Always log to help with cache issues
  console.log(`[UnitCard DEBUG v2] ${unit.name}:`);
  console.log(`  - tournamentLegal value:`, unit.tournamentLegal);
  console.log(`  - tournamentLegal type:`, typeof unit.tournamentLegal);
  console.log(`  - isNotTournamentLegal:`, isNotTournamentLegal);
  console.log(`  - unit data source check:`, unit);

  return (
    <div className="bg-warcrow-accent rounded-lg p-3 md:p-4 space-y-2 md:space-y-3 relative flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex-1">
          <UnitHeader 
            unit={unit} 
            mainName={displayName}
            portraitUrl={unit.imageUrl}
          />
        </div>
        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
          <span className="text-warcrow-gold font-semibold">
            {unit.pointsCost} {language === 'en' ? "points" : (language === 'es' ? "puntos" : "points")}
          </span>
          <UnitControls 
            quantity={quantity} 
            onAdd={onAdd} 
            onRemove={onRemove}
            availability={unit.availability}
            pointsCost={unit.pointsCost}
          />
        </div>
      </div>

      {/* Tournament Legal Status - Enhanced visibility and debugging */}
      {isNotTournamentLegal && (
        <div className="flex justify-center">
          <Badge variant="destructive" className="text-xs font-semibold bg-red-600 text-white border-red-700">
            {language === 'en' ? "Not Tournament Legal" : 
             language === 'es' ? "No Legal para Torneo" : "Not Tournament Legal"}
          </Badge>
        </div>
      )}

      <UnitCardKeywords 
        unit={unit}
        isMobile={isMobile}
      />
      
      <div className="mt-auto pt-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handleViewCardClick}
          className="text-xs w-full border-warcrow-gold/30 hover:bg-warcrow-gold/10"
        >
          {language === 'en' ? "Unit Card" : (language === 'es' ? "Tarjeta de Unidad" : "Carte d'Unité")}
        </Button>
      </div>

      <UnitCardDialog 
        isOpen={isCardDialogOpen}
        onClose={() => setIsCardDialogOpen(false)}
        unitName={displayName}
        cardUrl={generateCardUrl(unit.name, language)}
      />
    </div>
  );
};

export default UnitCard;
