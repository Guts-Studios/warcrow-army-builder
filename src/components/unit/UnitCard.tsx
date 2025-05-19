
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
      // Use language-specific version
      if (language === 'es') {
        return "/art/card/lady_telia_card_sp.jpg";
      } else if (language === 'fr') {
        return "/art/card/lady_telia_card_fr.jpg";
      } else {
        return "/art/card/lady_telia_card_en.jpg";
      }
    }
    
    // Base URL pointing to the card directory
    const baseUrl = `/art/card/${baseNameForUrl}_card`;
    
    // Add language suffix for the current language
    let suffix = '';
    if (language === 'es') {
      suffix = '_sp';
    } else if (language === 'fr') {
      suffix = '_fr';
    } else {
      suffix = '_en'; // Now adding _en for English
    }
    
    // Generate full URL with language suffix
    const fullUrl = `${baseUrl}${suffix}.jpg`;
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
        
        // If language-specific version fails, try without suffix
        img.onerror = () => {
          const currentUrl = url;
          
          // Try without language suffix
          if (currentUrl.includes('_sp.jpg') || currentUrl.includes('_fr.jpg') || currentUrl.includes('_en.jpg')) {
            const baseUrl = currentUrl
              .replace('_sp.jpg', '.jpg')
              .replace('_fr.jpg', '.jpg')
              .replace('_en.jpg', '.jpg');
              
            console.log(`Language-specific version failed, trying without suffix: ${baseUrl}`);
            
            // Set the fallback URL
            setCardUrl(baseUrl);
            
            // Preload the base version
            const fallbackImg = new Image();
            fallbackImg.src = baseUrl;
            
            // If base version fails too, try with PNG extension
            fallbackImg.onerror = () => {
              const pngUrl = baseUrl.replace('.jpg', '.png');
              console.log(`Base version failed, trying PNG format: ${pngUrl}`);
              setCardUrl(pngUrl);
              
              // If PNG fails, try with unit ID as last resort
              const finalFallbackImg = new Image();
              finalFallbackImg.src = pngUrl;
              finalFallbackImg.onerror = () => {
                const idBasedUrl = `/art/card/${unit.id}_card.jpg`;
                console.log(`All standard formats failed, trying ID-based URL: ${idBasedUrl}`);
                setCardUrl(idBasedUrl);
              };
            };
          }
        };
        
        console.log(`Preloading image for ${unit.name}: ${url}`);
      }
    };
    
    preloadImage();
  }, [language, unit.name, unit.id, unit.imageUrl]);

  // Function to handle view card button click
  const handleViewCardClick = () => {
    // For Lady Télia, use a specific hardcoded path that we know exists
    let url;
    if (unit.id === "lady-telia") {
      if (language === 'es') {
        url = "/art/card/lady_telia_card_sp.jpg";
      } else if (language === 'fr') {
        url = "/art/card/lady_telia_card_fr.jpg";
      } else {
        url = "/art/card/lady_telia_card_en.jpg";
      }
    } else {
      url = getCardUrl();
    }
    
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
