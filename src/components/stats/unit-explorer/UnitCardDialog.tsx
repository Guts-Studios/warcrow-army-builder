
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useLanguage } from '@/contexts/LanguageContext';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const { t, language } = useLanguage();
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);
  
  // Generate language-specific URL if needed
  const getLanguageSpecificUrl = (url: string): string => {
    if (imageError) return url; // Don't modify if we've already had an error
    
    // If URL already has language suffix, don't modify
    if (url.includes('_sp.') || url.includes('_fr.')) {
      return url;
    }
    
    // Add language suffix based on selected language
    if (language === 'es') {
      return url.replace('.jpg', '_sp.jpg').replace('.png', '_sp.png');
    } else if (language === 'fr') {
      return url.replace('.jpg', '_fr.jpg').replace('.png', '_fr.png');
    }
    
    return url;
  };
  
  const finalCardUrl = getLanguageSpecificUrl(cardUrl);
  
  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={`${isZoomed ? 'max-w-[60vw]' : 'max-w-[55vw]'} w-[55vw] h-[75vh] p-0 transition-all duration-300`}>
        <DialogTitle className="text-xl font-bold text-warcrow-gold mx-4 mt-2 mb-1">
          {unitName} {t('card') || 'Card'}
        </DialogTitle>
        
        <div className="relative w-full h-[calc(75vh-60px)] px-2 pb-2 flex items-center justify-center">
          <div className="relative w-full h-full">
            <AspectRatio ratio={7/10} className="bg-black/20 overflow-hidden rounded-md h-full">
              <img
                src={finalCardUrl}
                alt={`${unitName} card`}
                className={`h-full w-full object-contain ${isZoomed ? 'scale-110 transform transition-transform duration-300' : ''}`}
                onError={(e) => {
                  console.error('Image load error:', finalCardUrl);
                  setImageError(true);
                  const img = e.currentTarget;
                  img.onerror = null; // Prevent infinite error loop
                  
                  // Try fallback to original URL if language-specific fails
                  if (finalCardUrl !== cardUrl) {
                    img.src = cardUrl;
                  } else {
                    img.style.display = 'none';
                  }
                }}
              />
            </AspectRatio>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={toggleZoom}
              className="absolute top-2 right-2 bg-black/50 hover:bg-black/80 border-warcrow-gold/50 z-10"
            >
              {isZoomed ? <ZoomOut className="h-4 w-4 text-warcrow-gold" /> : <ZoomIn className="h-4 w-4 text-warcrow-gold" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UnitCardDialog;
