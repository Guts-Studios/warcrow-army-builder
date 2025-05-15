
import { Unit } from "@/types/army";
import UnitHeader from "./unit/UnitHeader";
import UnitControls from "./unit/UnitControls";
import { useIsMobile } from "@/hooks/use-mobile";
import UnitCardKeywords from "./unit/card/UnitCardKeywords";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslateKeyword } from "@/utils/translationUtils";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import UnitCardDialog from "./stats/unit-explorer/UnitCardDialog";

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
  const [cardUrl, setCardUrl] = useState<string>("");
  
  // Translate unit name based on the selected language
  const displayName = translateUnitName(unit.name, language);

  // Function to generate the correct GitHub card URL based on the unit name and language
  const getCardUrl = () => {
    try {
      // Convert unit name to snake_case format for file naming
      // Replace both spaces and hyphens with underscores
      const nameForUrl = unit.name.toLowerCase().replace(/[\s-]+/g, '_');
      
      // Base URL pointing to the GitHub art/card directory
      const baseUrl = `/art/card/${nameForUrl}_card`;
      
      // Add language suffix if needed (sp for Spanish, fr for French, none for English)
      let suffix = '';
      if (language === 'es') {
        suffix = '_sp';
      } else if (language === 'fr') {
        suffix = '_fr';
      }
      
      // Return the complete URL with file extension
      return `${baseUrl}${suffix}.jpg`;
    } catch (error) {
      console.error("Error generating card URL:", error);
      return "";
    }
  };

  // Update card URL when language changes
  useEffect(() => {
    setCardUrl(getCardUrl());
  }, [language, unit.name]);

  // Function to handle view card button click
  const handleViewCardClick = () => {
    const url = getCardUrl();
    console.log("Opening card dialog with URL:", url);
    setCardUrl(url);
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
        cardUrl={cardUrl}
      />
    </div>
  );
};

export default UnitCard;
