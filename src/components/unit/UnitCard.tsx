
import { Unit } from "@/types/army";
import UnitHeader from "@/components/unit/UnitHeader";
import UnitControls from "@/components/unit/UnitControls";
import { useIsMobile } from "@/hooks/use-mobile";
import UnitCardKeywords from "@/components/unit/card/UnitCardKeywords";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslateKeyword } from "@/utils/translationUtils";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
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
  const [cardUrl, setCardUrl] = useState<string>("");
  
  // Translate unit name based on the selected language for display only
  const displayName = translateUnitName(unit.name);

  // Generate the correct card URL based on your actual file structure
  const getCardUrl = () => {
    console.log(`Getting card URL for: ${unit.name} (${unit.id})`);
  
    // Special cases mapping for units with non-standard naming
    const specialCases: Record<string, string> = {
      "Lady Télia": "lady_telia",
      "Lady Telia": "lady_telia",
      "Dragoslav Bjelogrc": "dragoslav_bjelogrc_drago_the_anvil",
      "Mk-Os Automata": "mk-os_automata",
      "MK-OS Automata": "mk-os_automata",
      "Battle-Scarred": "battle-scarred",
      "Battle Scarred": "battle-scarred",
      "Eskold The Executioner": "eskold_the_executioner",
      "Njord The Merciless": "njord_the_merciless",
      "Marhael The Refused": "marhael_the_refused",
    };
    
    // Check for special case mapping
    let baseNameForUrl = specialCases[unit.name];
    
    // If no special mapping, create URL-friendly name from unit name
    if (!baseNameForUrl) {
      baseNameForUrl = unit.name
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[-]/g, '_')
        .replace(/[']/g, '')
        .replace(/[^a-z0-9_]/g, '');
    }
    
    // Always use language suffixes to match your file structure
    const langSuffix = language === 'es' ? '_sp' : (language === 'fr' ? '_fr' : '_en');
    const fullUrl = `/art/card/${baseNameForUrl}_card${langSuffix}.jpg`;
    
    console.log(`Generated card URL for ${unit.name}: ${fullUrl}`);
    return fullUrl;
  };

  // Update card URL when language changes
  useEffect(() => {
    if (unit) {
      const url = getCardUrl();
      setCardUrl(url);
      console.log(`Updated card URL for ${unit.name}: ${url}`);
    }
  }, [language, unit.name, unit.id]);

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
