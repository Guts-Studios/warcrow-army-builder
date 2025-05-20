
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogClose, DialogDescription } from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { Loader2, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProfileSession } from '@/hooks/useProfileSession';

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
  const [finalUrl, setFinalUrl] = useState<string>("");
  const [fallbackAttempts, setFallbackAttempts] = useState<number>(0);
  const isMobile = useIsMobile();
  const { language, t } = useLanguage();
  const { isPreview } = useProfileSession();
  
  // Reset state when dialog opens or URL changes
  useEffect(() => {
    if (isOpen) {
      setImageError(false);
      setIsLoading(true);
      setFallbackAttempts(0);
      
      // Process the URL to determine the best version to use
      let processedUrl = cardUrl;
      
      // Special case for Lady Télia
      if (unitName.includes("Lady Télia") || unitName.includes("Lady Telia")) {
        processedUrl = language === 'es' ? "/art/card/lady_telia_card_sp.jpg" :
                      language === 'fr' ? "/art/card/lady_telia_card_fr.jpg" :
                      "/art/card/lady_telia_card_en.jpg";
      } 
      // If URL is a UUID format or contains a dash
      else if (cardUrl.includes('-') && (cardUrl.length > 60 || cardUrl.includes('uuid'))) {
        // Clean the name for URL generation
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
        processedUrl = `/art/card/${cleanName}_card${langSuffix}.jpg`;
      }
      // Add language suffix if not present
      else if (!processedUrl.includes('_sp.jpg') && 
               !processedUrl.includes('_fr.jpg') && 
               !processedUrl.includes('_en.jpg')) {
        
        // Extract the base URL without extension
        const baseUrl = processedUrl.replace(/\.jpg$|\.png$/, '');
        
        if (language === 'es') {
          processedUrl = `${baseUrl}_sp.jpg`;
        } else if (language === 'fr') {
          processedUrl = `${baseUrl}_fr.jpg`;
        } else {
          processedUrl = `${baseUrl}_en.jpg`;
        }
      }
      
      console.log(`Dialog processing card URL - Original: ${cardUrl}, Processed: ${processedUrl}, Language: ${language}, isPreview: ${isPreview}`);
      setFinalUrl(processedUrl);
    }
  }, [isOpen, cardUrl, language, unitName, isPreview]);

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
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    const currentSrc = target.src;
    console.error(`Image load error: ${currentSrc}, attempt: ${fallbackAttempts + 1}`);
    
    // Prevent infinite loop of fallbacks
    if (fallbackAttempts >= 3) {
      setImageError(true);
      setIsLoading(false);
      return;
    }
    
    setFallbackAttempts(prev => prev + 1);
    
    // Series of fallbacks
    if (currentSrc.includes('_sp.jpg') || currentSrc.includes('_fr.jpg') || currentSrc.includes('_en.jpg')) {
      // Try without language suffix
      const baseUrl = currentSrc
        .replace('_sp.jpg', '.jpg')
        .replace('_fr.jpg', '.jpg')
        .replace('_en.jpg', '.jpg');
      
      console.log(`Trying without language suffix: ${baseUrl}`);
      target.src = baseUrl;
      return;
    }
    
    // Try PNG format
    if (currentSrc.endsWith('.jpg')) {
      const pngUrl = currentSrc.replace('.jpg', '.png');
      console.log(`Trying PNG format: ${pngUrl}`);
      target.src = pngUrl;
      return;
    }
    
    // Special fallback for Northern Tribes
    if (unitName.toLowerCase().includes('northern') || unitName.toLowerCase().includes('tribe')) {
      const cleanName = unitName.toLowerCase().replace(/\s+/g, '_').replace(/[^\w-]/g, '');
      const ntUrl = `/art/card/northern_tribes_${cleanName}_card.jpg`;
      console.log(`Trying Northern Tribes specific URL: ${ntUrl}`);
      target.src = ntUrl;
      return;
    }
    
    // If all fallbacks failed
    console.log("All fallbacks failed, showing error state");
    setImageError(true);
    setIsLoading(false);
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
          
          {!imageError && finalUrl && (
            <img
              src={finalUrl}
              alt={`${unitName} ${getCardText()}`}
              className={`w-auto max-h-[80vh] transition-opacity duration-200 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
              onLoad={() => {
                console.log(`Image loaded successfully: ${finalUrl}`);
                setIsLoading(false);
              }}
              onError={handleImageError}
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
