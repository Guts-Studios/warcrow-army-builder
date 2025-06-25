
import { Unit, Keyword } from "@/types/army";
import UnitHeader from "./unit/UnitHeader";
import UnitControls from "./unit/UnitControls";
import { useIsMobile } from "@/hooks/use-mobile";
import UnitCardKeywords from "./unit/card/UnitCardKeywords";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslateKeyword } from "@/utils/translationUtils";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useState, useEffect, memo } from "react";
import UnitCardDialog from "./stats/unit-explorer/UnitCardDialog";

interface UnitCardProps {
  unit: Unit;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}

// Memoize the component to prevent unnecessary re-renders
const UnitCard = memo(({ unit, quantity, onAdd, onRemove }: UnitCardProps) => {
  const isMobile = useIsMobile();
  const { language } = useLanguage();
  const { translateUnitName } = useTranslateKeyword();
  const [isCardDialogOpen, setIsCardDialogOpen] = useState<boolean>(false);
  const [cardUrl, setCardUrl] = useState<string>("");
  
  // Get the appropriate unit name based on language - prioritize CSV data over translations
  const getUnitName = () => {
    if (language === 'es' && unit.name_es) {
      return unit.name_es;
    }
    if (language === 'fr' && unit.name_fr) {
      return unit.name_fr;
    }
    // Fallback to translation system if no CSV translation available
    if (language !== 'en') {
      return translateUnitName(unit.name);
    }
    return unit.name;
  };

  const displayName = getUnitName();

  // Normalize keywords to ensure they're all Keyword objects
  const normalizedUnit: Unit = {
    ...unit,
    keywords: unit.keywords.map(keyword => {
      if (typeof keyword === 'string') {
        return { name: keyword, description: "" };
      }
      return keyword;
    })
  };

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
      "Darach Wilding": "darach_wildling",
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
            unit={normalizedUnit} 
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

      {/* Tournament Legal Status - Show for all non-tournament legal units */}
      {unit.tournamentLegal === false && (
        <div className="flex justify-center">
          <Badge variant="destructive" className="text-xs">
            {language === 'en' ? "Not Tournament Legal" : 
             language === 'es' ? "No Legal para Torneo" : "Not Tournament Legal"}
          </Badge>
        </div>
      )}

      <UnitCardKeywords 
        unit={normalizedUnit}
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
});

// Display name for debugging
UnitCard.displayName = "UnitCard";

export default UnitCard;
