
import { useState } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Unit } from "@/types/army";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslateKeyword } from "@/utils/translationUtils";

interface UnitCardImageProps {
  unit: Unit;
}

const UnitCardImage = ({ unit }: UnitCardImageProps) => {
  const [imageError, setImageError] = useState(false);
  const [alternateErrorShown, setAlternateErrorShown] = useState(false);
  const [fallbackAttempted, setFallbackAttempted] = useState(false);
  const { language } = useLanguage();
  const isMobile = useIsMobile();
  const { translateUnitName } = useTranslateKeyword();

  // If no image URL is provided, don't render the image section
  if (!unit.imageUrl) {
    return null;
  }
  
  // Get translated unit name for display
  const displayName = translateUnitName(unit.name);

  // Special handling for Lady Télia
  if (unit.id === "lady-telia") {
    const ladyTeliaUrl = language === 'es' ? "/art/card/lady_telia_card_sp.jpg" :
                          language === 'fr' ? "/art/card/lady_telia_card_fr.jpg" :
                          "/art/card/lady_telia_card_en.jpg";
    
    return (
      <div className="w-full mt-2">
        <AspectRatio 
          ratio={16 / 9} 
          className={`bg-black/20 overflow-hidden rounded-md ${isMobile ? 'max-h-[200px]' : 'max-h-[300px]'}`}
        >
          <img
            src={ladyTeliaUrl}
            alt={displayName}
            className="h-full w-full object-contain"
            onError={(e) => {
              console.error('Image load error for Lady Télia');
              // Try fallback without language suffix
              const fallbackUrl = "/art/card/lady_telia_card.jpg";
              console.log(`Trying fallback for Lady Télia: ${fallbackUrl}`);
              (e.target as HTMLImageElement).src = fallbackUrl;
            }}
          />
        </AspectRatio>
      </div>
    );
  }

  // Function to generate the appropriate URL based on language
  const getLanguageSpecificUrl = (baseUrl: string): string => {
    // If already has a language suffix, return as-is
    if (baseUrl.endsWith(`_${language}.jpg`) || 
        baseUrl.endsWith(`_en.jpg`) ||
        baseUrl.endsWith(`_sp.jpg`) ||
        baseUrl.endsWith(`_fr.jpg`)) {
      return baseUrl;
    }
    
    // Extract the base URL without extension for consistent handling
    const baseWithoutExt = baseUrl.replace(/\.jpg$|\.png$/, '');
    
    // Special case for Lady Télia who has a different naming pattern
    if (baseUrl.includes('lady_telia')) {
      // Handle Lady Telia's special case
      if (language === 'es') {
        return "/art/card/lady_telia_card_sp.jpg";
      } else if (language === 'fr') {
        return "/art/card/lady_telia_card_fr.jpg";
      } else {
        return "/art/card/lady_telia_card_en.jpg";
      }
    }
    
    // Check if the URL is a UUID-based URL and try to convert it to a name-based URL
    if (baseUrl && (baseUrl.length > 60 || baseUrl.includes('-') && baseUrl.includes('card'))) {
      const cleanUnitName = unit.name
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^\w-]/g, '')
        .replace(/é|è|ê|ë/g, 'e')
        .replace(/á|à|â|ä/g, 'a')
        .replace(/í|ì|î|ï/g, 'i')
        .replace(/ó|ò|ô|ö/g, 'o')
        .replace(/ú|ù|û|ü/g, 'u');
      
      const newBaseUrl = `/art/card/${cleanUnitName}_card`;
      
      // Add language suffix
      if (language === 'es') {
        return `${newBaseUrl}_sp.jpg`;
      } else if (language === 'fr') {
        return `${newBaseUrl}_fr.jpg`;
      } else {
        return `${newBaseUrl}_en.jpg`;
      }
    }

    // For standard URLs, add appropriate language suffix
    if (language === 'es') {
      return `${baseWithoutExt}_sp.jpg`;
    } else if (language === 'fr') {
      return `${baseWithoutExt}_fr.jpg`;
    } else {
      return `${baseWithoutExt}_en.jpg`;
    }
  };
  
  return (
    <div className="w-full mt-2">
      <AspectRatio 
        ratio={16 / 9} 
        className={`bg-black/20 overflow-hidden rounded-md ${isMobile ? 'max-h-[200px]' : 'max-h-[300px]'}`}
      >
        {!imageError ? (
          <img
            src={getLanguageSpecificUrl(unit.imageUrl)}
            alt={displayName}
            className="h-full w-full object-contain"
            onError={(e) => {
              console.error('Image load error:', unit.imageUrl);
              
              const currentSrc = (e.target as HTMLImageElement).src;
              console.log(`Current src that failed: ${currentSrc}`);
              
              // Series of fallback attempts
              
              // 1. If this is a language-specific URL that failed, try base version without language suffix
              if (currentSrc.includes('_en.jpg') || currentSrc.includes('_sp.jpg') || currentSrc.includes('_fr.jpg')) {
                const baseUrl = currentSrc
                  .replace('_en.jpg', '.jpg')
                  .replace('_sp.jpg', '.jpg')
                  .replace('_fr.jpg', '.jpg');
                  
                console.log(`Trying without language suffix: ${baseUrl}`);
                
                if (!fallbackAttempted) {
                  setFallbackAttempted(true);
                  (e.target as HTMLImageElement).src = baseUrl;
                  return;
                }
              }
              
              // 2. If this is a JPG that failed, try PNG
              if (currentSrc.endsWith('.jpg') && !alternateErrorShown) {
                setAlternateErrorShown(true);
                
                // Try alternate extension
                const pngUrl = currentSrc.replace('.jpg', '.png');
                  
                console.log(`Trying PNG format: ${pngUrl}`);
                (e.target as HTMLImageElement).src = pngUrl;
                return;
              }
              
              // 3. Try with unit ID as last resort
              if (alternateErrorShown && fallbackAttempted) {
                const idUrl = `/art/card/${unit.id}_card`;
                let finalUrl;
                
                // Add appropriate language suffix
                if (language === 'es') {
                  finalUrl = `${idUrl}_sp.jpg`;
                } else if (language === 'fr') {
                  finalUrl = `${idUrl}_fr.jpg`;
                } else {
                  finalUrl = `${idUrl}.jpg`;  // Fallback to base ID format
                }
                
                console.log(`Trying ID-based URL with language: ${finalUrl}`);
                (e.target as HTMLImageElement).src = finalUrl;
                return;
              }
              
              // Finally give up and show error state
              setImageError(true);
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-warcrow-text/70 text-sm p-4 text-center">
            Image not available
          </div>
        )}
      </AspectRatio>
    </div>
  );
}

export default UnitCardImage;
