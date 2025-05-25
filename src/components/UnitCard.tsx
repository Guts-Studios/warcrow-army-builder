import { Unit, Keyword } from "@/types/army";
import UnitHeader from "./unit/UnitHeader";
import UnitControls from "./unit/UnitControls";
import { useIsMobile } from "@/hooks/use-mobile";
import UnitCardKeywords from "./unit/card/UnitCardKeywords";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslateKeyword } from "@/utils/translationUtils";
import { Button } from "./ui/button";
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
  
  // Translate unit name based on the selected language for display only
  const displayName = translateUnitName(unit.name);

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

  // Improved function to generate the correct GitHub card URL based on the unit name 
  // Always using English names for file paths regardless of selected language
  const getCardUrl = () => {
    // Debug the incoming unit name
    console.log(`Getting card URL for: ${unit.name} (${unit.id})`);
  
    // Special cases mapping for tricky unit names - expanded list
    const specialCases: Record<string, string> = {
      // Core cases for specific units
      "Aggressors": "aggressors",
      "Ahlwardt Ice Bear": "ahlwardt_ice_bear",
      "Battle-Scarred": "battle-scarred",
      "Battle Scarred": "battle-scarred", // Alternative spelling
      "BattleScarred": "battle-scarred", // Alternative spelling
      "Dragoslav Bjelogrc": "dragoslav_bjelogrc_drago_the_anvil",
      "Lady Télia": "lady_telia", // Special case for Lady Télia
      "Lady Telia": "lady_telia", // Alternative spelling without accent
      "Nayra Caladren": "nayra_caladren",
      "Naergon Caladren": "naergon_caladren",
      "Eskold The Executioner": "eskold_the_executioner",
      "Mk-Os Automata": "mk-os_automata",
      "MK-OS Automata": "mk-os_automata", // Alternative spelling
      "Iriavik Restless Pup": "iriavik_restless_pup",
      "Njord The Merciless": "njord_the_merciless",
      "Trabor Slepmund": "trabor_slepmund",
      "Darach Wildling": "darach_wildling",
      "Marhael The Refused": "marhael_the_refused",
      // Add more special cases here as needed
    };
    
    // First check if we have a special case mapping for this unit
    let baseNameForUrl = specialCases[unit.name];
    
    // If no special mapping exists, create the URL-friendly name
    if (!baseNameForUrl) {
      // Try to normalize the name first by checking for hyphenated versions
      const normalizedName = unit.name
        .replace(/([a-z])([A-Z])/g, '$1 $2') // Convert camelCase to space-separated
        .trim();
        
      // Check again with the normalized name
      baseNameForUrl = specialCases[normalizedName];
      
      // If still no match, create a URL-friendly version
      if (!baseNameForUrl) {
        baseNameForUrl = unit.name
          .toLowerCase()
          .replace(/\s+/g, '_')  // Replace spaces with underscores
          .replace(/[-]/g, '_')  // Replace hyphens with underscores for consistency
          .replace(/[']/g, '')   // Remove apostrophes
          .replace(/[^a-z0-9_-]/g, ''); // Remove any other non-alphanumeric characters
      }
    }
    
    // If a unit has its own imageUrl property, use that directly
    if (unit.imageUrl) {
      console.log(`Using provided imageUrl for ${unit.name}: ${unit.imageUrl}`);
      return unit.imageUrl;
    }
    
    // Special case for Lady Télia who has a different file name structure
    if (unit.name.includes("Lady Télia") || unit.id === "lady-telia") {
      return "/art/card/lady_telia_card.jpg";
    }
    
    // Base URL pointing to the card directory
    const baseUrl = `/art/card/${baseNameForUrl}_card`;
    
    // Generate full URL with English version, as we'll handle language-specific versions in the onError handler
    const fullUrl = `${baseUrl}.jpg`;
    console.log(`Generated card URL for ${unit.name}: ${fullUrl}`);
    return fullUrl;
  };

  // Preload image when component is mounted or language changes
  useEffect(() => {
    const preloadImage = () => {
      if (unit) {
        const url = getCardUrl();
        setCardUrl(url);
        
        // Create a new Image to preload
        const img = new Image();
        img.src = url;
        
        // If English version fails, try with unit ID as fallback
        img.onerror = () => {
          // If error, try using the ID as fallback
          const idBasedUrl = `/art/card/${unit.id}_card.jpg`;
          console.log(`Primary image failed, trying ID-based URL: ${idBasedUrl}`);
          setCardUrl(idBasedUrl);
          
          // Try loading the ID-based image
          const fallbackImg = new Image();
          fallbackImg.src = idBasedUrl;
          
          // If that fails too, use a final fallback URL that's based on cleaned name
          fallbackImg.onerror = () => {
            const cleanedName = unit.name
              .toLowerCase()
              .replace(/\s+/g, '_')
              .replace(/[^\w-]/g, '');
            const finalFallbackUrl = `/art/card/${cleanedName}_card.jpg`;
            console.log(`ID-based image failed, trying cleaned name URL: ${finalFallbackUrl}`);
            setCardUrl(finalFallbackUrl);
          };
        };
        
        console.log(`Preloading image for ${unit.name}: ${url}`);
      }
    };
    
    preloadImage();
  }, [language, unit.name, unit.id, unit.imageUrl]);

  // Function to handle view card button click
  const handleViewCardClick = () => {
    // For Lady Télia, use a specific hardcoded path that we know exists
    let url = unit.id === "lady-telia" ? "/art/card/lady_telia_card.jpg" : getCardUrl();
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
