
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
      // Special cases mapping for tricky unit names
      const specialCases: Record<string, string> = {
        "Agressors": "aggressors",
        "Dragoslav Bjelogrc": "dragoslav_bjelogrc_drago_the_anvil",
        "Lady Telia": "lady_telia",
        "Nayra Caladren": "nayra_caladren",
        "Naergon Caladren": "naergon_caladren",
        // Add any more special cases as needed
      };

      // First check if we have a special case mapping for this unit
      let baseNameForUrl = specialCases[unit.name];
      
      // If no special mapping exists, create the URL-friendly name
      if (!baseNameForUrl) {
        baseNameForUrl = unit.name
          .toLowerCase()
          .replace(/[\s-]+/g, '_')  // Replace spaces and hyphens with underscores
          .replace(/[']/g, '')      // Remove apostrophes
          .replace(/[^a-z0-9_]/g, ''); // Remove any other non-alphanumeric characters except underscores
      }
      
      // Base URL pointing to the card directory
      const baseUrl = `/art/card/${baseNameForUrl}_card`;
      
      // Add language suffix if not English
      let suffix = '';
      if (language === 'es') {
        suffix = '_sp';
      } else if (language === 'fr') {
        suffix = '_fr';
      }
      
      // Log the generated URL for debugging
      const fullUrl = `${baseUrl}${suffix}.jpg`;
      console.log(`Generated card URL for ${unit.name}: ${fullUrl}`);
      return fullUrl;
    } catch (error) {
      console.error("Error generating card URL:", error);
      return "";
    }
  };

  // Update card URL when language changes
  useEffect(() => {
    const url = getCardUrl();
    setCardUrl(url);
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
