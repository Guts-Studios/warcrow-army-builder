import { useState, useEffect } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Unit } from "@/types/army";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslateKeyword } from "@/utils/translationUtils";
import { useProfileSession } from '@/hooks/useProfileSession';

interface UnitCardImageProps {
  unit: Unit;
}

const UnitCardImage = ({ unit }: UnitCardImageProps) => {
  const [imageError, setImageError] = useState(false);
  const [alternateErrorShown, setAlternateErrorShown] = useState(false);
  const [fallbackAttempted, setFallbackAttempted] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string>("");
  const { language } = useLanguage();
  const isMobile = useIsMobile();
  const { translateUnitName } = useTranslateKeyword();
  const { isPreview } = useProfileSession();

  // If no image URL is provided, don't render the image section
  if (!unit.imageUrl) {
    return null;
  }
  
  // Get translated unit name for display
  const displayName = translateUnitName(unit.name);
  
  // Effect to update image URL when language changes or component mounts
  useEffect(() => {
    setImageError(false);
    setAlternateErrorShown(false);
    setFallbackAttempted(false);
    
    let imageUrl: string;
    
    // Special handling for Lady Télia
    if (unit.id === "lady-telia" || unit.name.includes("Lady Télia") || unit.name.includes("Lady Telia")) {
      imageUrl = language === 'es' ? "/art/card/lady_telia_card_sp.jpg" :
                language === 'fr' ? "/art/card/lady_telia_card_fr.jpg" :
                "/art/card/lady_telia_card_en.jpg";
      console.log(`[UnitCardImage] Using special Lady Télia URL: ${imageUrl}`);
    } else {
      // Get language-specific URL for other units
      imageUrl = getLanguageSpecificUrl(unit.imageUrl);
      console.log(`[UnitCardImage] Using language-specific URL: ${imageUrl}`);
    }
    
    setCurrentUrl(imageUrl);
  }, [unit, language, isPreview]);

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
    
    // Special handling for Northern Tribes units
    if (unit.name.toLowerCase().includes('northern') || 
        unit.name.toLowerCase().includes('tribe') ||
        unit.faction?.toLowerCase().includes('northern')) {
      const cleanName = unit.name
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^\w-]/g, '');
      
      const tribesUrl = `/art/card/northern_tribes_${cleanName}_card`;
      
      // Add language suffix
      if (language === 'es') {
        return `${tribesUrl}_sp.jpg`;
      } else if (language === 'fr') {
        return `${tribesUrl}_fr.jpg`;
      } else {
        return `${tribesUrl}_en.jpg`;
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

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    const failedSrc = target.src;
    console.error(`[UnitCardImage] Image load error for ${unit.name}:`, failedSrc);
    
    // Series of fallback attempts
    
    // 1. If this is a language-specific URL that failed, try base version without language suffix
    if (failedSrc.includes('_en.jpg') || failedSrc.includes('_sp.jpg') || failedSrc.includes('_fr.jpg')) {
      const baseUrl = failedSrc
        .replace('_en.jpg', '.jpg')
        .replace('_sp.jpg', '.jpg')
        .replace('_fr.jpg', '.jpg');
        
      console.log(`[UnitCardImage] Trying without language suffix: ${baseUrl}`);
      
      if (!fallbackAttempted) {
        setFallbackAttempted(true);
        target.src = baseUrl;
        return;
      }
    }
    
    // 2. If this is a JPG that failed, try PNG
    if (failedSrc.endsWith('.jpg') && !alternateErrorShown) {
      setAlternateErrorShown(true);
      
      // Try alternate extension
      const pngUrl = failedSrc.replace('.jpg', '.png');
        
      console.log(`[UnitCardImage] Trying PNG format: ${pngUrl}`);
      target.src = pngUrl;
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
      
      console.log(`[UnitCardImage] Trying ID-based URL with language: ${finalUrl}`);
      target.src = finalUrl;
      return;
    }
    
    // 4. Special handling for Northern Tribes as a last resort
    if (unit.name.toLowerCase().includes('northern') || 
        unit.faction?.toLowerCase().includes('northern') || 
        unit.name.toLowerCase().includes('tribe')) {
      
      const cleanName = unit.name
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^\w-]/g, '');
      
      const ntUrl = `/art/card/northern_tribes_${cleanName}_card.jpg`;
      console.log(`[UnitCardImage] Trying Northern Tribes specific URL: ${ntUrl}`);
      target.src = ntUrl;
      return;
    }
    
    // Finally give up and show error state
    setImageError(true);
  };
  
  return (
    <div className="w-full mt-2">
      <AspectRatio 
        ratio={16 / 9} 
        className={`bg-black/20 overflow-hidden rounded-md ${isMobile ? 'max-h-[200px]' : 'max-h-[300px]'}`}
      >
        {!imageError ? (
          <img
            src={currentUrl}
            alt={displayName}
            className="h-full w-full object-contain"
            onError={handleImageError}
            width="800" 
            height="450" 
            loading="lazy" 
            decoding="async"
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
