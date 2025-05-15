
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
      <DialogContent className={`${isZoomed ? 'max-w-[95vw] md:max-w-[90vw]' : 'max-w-[90vw] md:max-w-[80vw]'} w-[98vw] md:w-auto p-0 transition-all duration-300`}>
        <DialogTitle className="text-xl font-bold text-warcrow-gold mx-4 mt-4 mb-2">
          {unitName} {t('card') || 'Card'}
        </DialogTitle>
        
        <div className="relative w-full px-4 pb-6 sm:px-10 sm:pb-10">
          <AspectRatio ratio={7/10} className="bg-black/20 overflow-hidden rounded-md">
            <img
              src={finalCardUrl}
              alt={`${unitName} card`}
              className={`h-full w-full object-contain ${isZoomed ? 'scale-200 transform transition-transform duration-300' : ''}`}
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
      </DialogContent>
    </Dialog>
  );
};

export default UnitCardDialog;
