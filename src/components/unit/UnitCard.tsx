
import { Unit } from "@/types/army";
import UnitHeader from "@/components/unit/UnitHeader";
import UnitControls from "@/components/unit/UnitControls";
import { useIsMobile } from "@/hooks/use-mobile";
import UnitCardKeywords from "@/components/unit/card/UnitCardKeywords";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslateKeyword } from "@/utils/translationUtils";
import { generateCardUrl } from "@/utils/imageUtils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import UnitCardDialog from "@/components/stats/unit-explorer/UnitCardDialog";

interface UnitCardProps {
  unit: Unit;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}

const UnitCard = ({ unit, quantity, onAdd, onRemove }: UnitCardProps) => {
  const isMobile = useIsMobile();
  const { language } = useLanguage();
  const { translateUnitName } = useTranslateKeyword();
  const [isCardDialogOpen, setIsCardDialogOpen] = useState<boolean>(false);
  
  // Debug: Log the raw unit data
  console.log(`Raw unit data for ${unit.name}:`, {
    name: unit.name,
    name_es: unit.name_es,
    language: language,
    hasSpanishName: !!unit.name_es
  });
  
  // Use Spanish name from CSV if available and language is Spanish, otherwise use translation system
  const displayName = language === 'es' && unit.name_es 
    ? unit.name_es 
    : translateUnitName(unit.name);

  console.log(`Unit: ${unit.name}, Spanish name: ${unit.name_es}, Language: ${language}, Display name: ${displayName}`);

  // Function to handle view card button click
  const handleViewCardClick = () => {
    const url = generateCardUrl(unit.name, language);
    console.log("Opening card dialog with URL:", url);
    setIsCardDialogOpen(true);
  };

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
