
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
    return (
      <div className="w-full mt-2">
        <AspectRatio 
          ratio={16 / 9} 
          className={`bg-black/20 overflow-hidden rounded-md ${isMobile ? 'max-h-[200px]' : 'max-h-[300px]'}`}
        >
          <img
            src="/art/card/lady_telia_card.jpg"
            alt={displayName}
            className="h-full w-full object-contain"
            onError={(e) => {
              console.error('Image load error for Lady Télia');
              // Try localized version as fallback
              if (language === 'es') {
                (e.target as HTMLImageElement).src = "/art/card/lady_telia_card_sp.jpg";
              } else if (language === 'fr') {
                (e.target as HTMLImageElement).src = "/art/card/lady_telia_card_fr.jpg";
              }
            }}
          />
        </AspectRatio>
      </div>
    );
  }

  // Function to generate the appropriate URL based on language
  const getLanguageSpecificUrl = (baseUrl: string): string => {
    // Check if we've already adjusted the URL with language suffix
    if (baseUrl.endsWith(`_${language}.jpg`) || baseUrl.endsWith(`_${language}.png`)) {
      return baseUrl;
    }
    
    // Special case for Lady Télia who has a different naming pattern
    if (baseUrl.includes('lady_telia')) {
      // Handle Lady Telia's special case
      if (language === 'es') {
        return baseUrl.replace('.jpg', '_sp.jpg').replace('_card', '_card');
      } else if (language === 'fr') {
        return baseUrl.replace('.jpg', '_fr.jpg').replace('_card', '_card');
      }
      return baseUrl;
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
      
      // Add language suffix if needed
      if (language === 'es') {
        return `${newBaseUrl}_sp.jpg`;
      } else if (language === 'fr') {
        return `${newBaseUrl}_fr.jpg`;
      }
      
      return `${newBaseUrl}.jpg`;
    }

    // For standard URLs, add language suffix for non-English versions
    if (language === 'es' && !baseUrl.includes('_sp.')) {
      // For Spanish
      return baseUrl.replace('_card.jpg', '_card_sp.jpg')
                    .replace('_card.png', '_card_sp.jpg');
    } else if (language === 'fr' && !baseUrl.includes('_fr.')) {
      // For French
      return baseUrl.replace('_card.jpg', '_card_fr.jpg')
                    .replace('_card.png', '_card_fr.jpg');
    }
    
    return baseUrl;
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
              
              // If this is a language specific URL that failed, try English version
              const currentSrc = (e.target as HTMLImageElement).src;
              if ((language === 'es' && currentSrc.includes('_sp')) || 
                  (language === 'fr' && currentSrc.includes('_fr'))) {
                // Try the English version
                const englishUrl = unit.imageUrl.replace('_sp.jpg', '.jpg').replace('_fr.jpg', '.jpg');
                console.log(`Trying English version: ${englishUrl}`);
                
                if (!fallbackAttempted) {
                  setFallbackAttempted(true);
                  (e.target as HTMLImageElement).src = englishUrl;
                  return; // Don't set error yet
                }
              }
              
              // If this is a first attempt for an image format failure, try another format
              if (!alternateErrorShown) {
                setAlternateErrorShown(true);
                
                // Try alternate extension
                const altFormat = unit.imageUrl.endsWith('.jpg') 
                  ? unit.imageUrl.replace('.jpg', '.png') 
                  : unit.imageUrl.replace('.png', '.jpg');
                  
                console.log(`Trying alternate format: ${altFormat}`);
                (e.target as HTMLImageElement).src = altFormat;
                return; // Don't set error yet
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
