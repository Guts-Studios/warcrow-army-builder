
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

    // Only apply language suffix if it's Spanish or French
    if (language === 'es' || language === 'fr') {
      const langSuffix = language === 'es' ? '_sp' : '_fr';
      
      // Handle the different file naming conventions
      if (baseUrl.endsWith('.jpg')) {
        return baseUrl.replace('.jpg', `${langSuffix}.jpg`);
      } else if (baseUrl.endsWith('.png')) {
        return baseUrl.replace('.png', `${langSuffix}.png`);
      } else if (baseUrl.endsWith('_card.jpg')) {
        return baseUrl.replace('_card.jpg', `_card${langSuffix}.jpg`);
      } else if (baseUrl.endsWith('_card.png')) {
        return baseUrl.replace('_card.png', `_card${langSuffix}.png`);
      }
    }
    
    return baseUrl;
  };

  // Start with the original URL from the unit
  let imageUrl = unit.imageUrl;
  
  // Apply language-specific changes if not in error state
  if (!imageError) {
    imageUrl = getLanguageSpecificUrl(imageUrl);
  } else if (!alternateErrorShown) {
    // If first attempt failed, try with a different extension
    if (imageUrl.endsWith('.jpg')) {
      imageUrl = imageUrl.replace('.jpg', '.png');
    } else if (imageUrl.endsWith('.png')) {
      imageUrl = imageUrl.replace('.png', '.jpg');
    } else if (imageUrl.endsWith('_sp.jpg') || imageUrl.endsWith('_fr.jpg')) {
      // If language-specific version failed, try the default English version
      imageUrl = imageUrl.replace('_sp.jpg', '.jpg').replace('_fr.jpg', '.jpg');
    } else if (imageUrl.endsWith('_sp.png') || imageUrl.endsWith('_fr.png')) {
      imageUrl = imageUrl.replace('_sp.png', '.png').replace('_fr.png', '.png');
    }
  }

  return (
    <div className="w-full mt-2">
      <AspectRatio 
        ratio={16 / 9} 
        className={`bg-black/20 overflow-hidden rounded-md ${isMobile ? 'max-h-[200px]' : 'max-h-[300px]'}`}
      >
        <img
          src={imageUrl}
          alt={displayName}
          className="h-full w-full object-contain"
          onError={(e) => {
            console.error('Image load error:', imageUrl);
            
            // If first error and not yet attempted a fallback
            if (!imageError && !fallbackAttempted) {
              setFallbackAttempted(true);
              
              // Try name-based URL as fallback
              const cleanNameId = unit.name
                .toLowerCase()
                .replace(/\s+/g, '_')
                .replace(/[^\w-]/g, '')
                .replace(/é|è|ê|ë/g, 'e')
                .replace(/á|à|â|ä/g, 'a');
                
              let fallbackUrl = `/art/card/${cleanNameId}_card`;
              
              // Add language suffix if needed
              if (language === 'es') {
                fallbackUrl += '_sp.jpg';
              } else if (language === 'fr') {
                fallbackUrl += '_fr.jpg';
              } else {
                fallbackUrl += '.jpg';
              }
              
              if (fallbackUrl !== imageUrl) {
                console.log(`Trying alternative card URL: ${fallbackUrl}`);
                (e.target as HTMLImageElement).src = fallbackUrl;
                return; // Don't set error state yet
              }
            }
            
            if (!imageError) {
              setImageError(true);
            } else if (!alternateErrorShown) {
              setAlternateErrorShown(true);
            }
          }}
        />
      </AspectRatio>
    </div>
  );
};

export default UnitCardImage;
