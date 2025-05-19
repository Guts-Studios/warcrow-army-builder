
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogClose, DialogDescription } from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { Loader2, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface UnitCardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  unitName: string;
  cardUrl: string;
}

const UnitCardDialog: React.FC<UnitCardDialogProps> = ({
  isOpen,
  onClose,
  unitName,
  cardUrl,
}) => {
  const [imageError, setImageError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isMobile = useIsMobile();
  const { language, t } = useLanguage();
  
  // Reset state when dialog opens or URL changes
  useEffect(() => {
    if (isOpen) {
      setImageError(false);
      setIsLoading(true);
      console.log(`Dialog opened with card URL: ${cardUrl}, language: ${language}`);
    }
  }, [isOpen, cardUrl, language]);

  // Determine the correct URL to use
  let actualCardUrl = cardUrl;
  
  // Special case handling for Lady Télia - use the card version not the unit version
  if (unitName.includes("Lady Télia") || unitName.includes("Lady Telia")) {
    // Updated path using language-specific suffix
    if (language === 'es') {
      actualCardUrl = "/art/card/lady_telia_card_sp.jpg";
    } else if (language === 'fr') {
      actualCardUrl = "/art/card/lady_telia_card_fr.jpg";
    } else {
      actualCardUrl = "/art/card/lady_telia_card_en.jpg";
    }
  }
  
  // Handle cases where UUID is in the URL instead of a meaningful name
  if (cardUrl && cardUrl.includes('/art/card/') && cardUrl.includes('-') && 
      (cardUrl.length > 60 || cardUrl.includes('uuid'))) {
    // Attempt to generate a name-based path from the unitName
    const cleanName = unitName
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^\w-]/g, '')
      .replace(/é|è|ê|ë/g, 'e')
      .replace(/á|à|â|ä/g, 'a')
      .replace(/í|ì|î|ï/g, 'i')
      .replace(/ó|ò|ô|ö/g, 'o')
      .replace(/ú|ù|û|ü/g, 'u');
      
    // Try a standard naming pattern with language suffix
    const langSuffix = language === 'es' ? '_sp' : (language === 'fr' ? '_fr' : '_en');
    actualCardUrl = `/art/card/${cleanName}_card${langSuffix}.jpg`;
    console.log(`Converting UUID-based URL to name-based URL: ${actualCardUrl}`);
  } else if (language === 'es' && !actualCardUrl.includes('_sp')) {
    // Convert to Spanish version
    actualCardUrl = actualCardUrl.replace('_en.jpg', '_sp.jpg').replace('.jpg', '_sp.jpg');
  } else if (language === 'fr' && !actualCardUrl.includes('_fr')) {
    // Convert to French version
    actualCardUrl = actualCardUrl.replace('_en.jpg', '_fr.jpg').replace('.jpg', '_fr.jpg');
  } else if (language === 'en' && !actualCardUrl.includes('_en') && 
            !actualCardUrl.includes('_sp') && !actualCardUrl.includes('_fr')) {
    // Add English suffix if no language suffix exists
    actualCardUrl = actualCardUrl.replace('.jpg', '_en.jpg');
  }
  
  console.log(`Final card URL: ${actualCardUrl}`);
  
  // Use direct translation rather than looking up keys
  const getCardText = () => {
    if (language === 'en') return 'Unit Card';
    if (language === 'es') return 'Tarjeta de Unidad';
    return 'Carte d\'Unité';
  };

  const getNotAvailableText = () => {
    if (language === 'en') return 'Image not available';
    if (language === 'es') return 'Imagen no disponible';
    return 'Image non disponible';
  };

  const getTryAgainText = () => {
    if (language === 'en') return 'Please try again later';
    if (language === 'es') return 'Por favor, inténtelo más tarde';
    return 'Veuillez réessayer plus tard';
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className="p-0 border-warcrow-gold/30 bg-black/95 overflow-hidden max-w-[90vw] md:max-w-[600px] max-h-[90vh]"
      >
        <DialogTitle className="sr-only">{unitName} {getCardText()}</DialogTitle>
        <DialogDescription className="sr-only">
          Detailed card for {unitName} unit
        </DialogDescription>
        
        <DialogClose className="absolute right-2 top-2 z-50 rounded-full bg-black/70 p-1 text-warcrow-gold hover:bg-black/90">
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </DialogClose>
        
        <div className="relative flex items-center justify-center w-full h-full overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/30">
              <Loader2 className="h-8 w-8 animate-spin text-warcrow-gold/70" />
            </div>
          )}
          
          {!imageError && (
            <img
              src={actualCardUrl}
              alt={`${unitName} ${getCardText()}`}
              className={`w-auto max-h-[80vh] transition-opacity duration-200 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
              onLoad={() => {
                console.log(`Image loaded successfully: ${actualCardUrl}`);
                setIsLoading(false);
              }}
              onError={(e) => {
                console.error(`Image load error: ${actualCardUrl}`);
                
                const currentSrc = (e.target as HTMLImageElement).src;
                
                // Try a series of fallbacks
                if (currentSrc.includes('_sp.jpg') || currentSrc.includes('_fr.jpg') || currentSrc.includes('_en.jpg')) {
                  // If language-specific version failed, try without language suffix
                  const baseUrl = currentSrc
                    .replace('_sp.jpg', '.jpg')
                    .replace('_fr.jpg', '.jpg')
                    .replace('_en.jpg', '.jpg');
                    
                  console.log(`Trying without language suffix: ${baseUrl}`);
                  (e.target as HTMLImageElement).src = baseUrl;
                  return;
                }
                
                // If no language suffix and still failed, try with .png extension
                if (currentSrc.endsWith('.jpg')) {
                  const pngUrl = currentSrc.replace('.jpg', '.png');
                  console.log(`Trying PNG format: ${pngUrl}`);
                  (e.target as HTMLImageElement).src = pngUrl;
                  return;
                }
                
                // If all fallbacks failed
                setImageError(true);
                setIsLoading(false);
                
                // Log the failure for debugging
                console.log(`All fallbacks failed for card: ${unitName}`);
              }}
            />
          )}
          
          {imageError && !isLoading && (
            <div className="p-8 flex flex-col items-center justify-center gap-2 text-warcrow-gold/70 text-center">
              <div className="text-sm">{getNotAvailableText()}</div>
              <div className="text-xs opacity-70">{getTryAgainText()}</div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UnitCardDialog;
