
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
  const { t } = useLanguage();
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  
  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={`${isZoomed ? 'max-w-7xl' : 'max-w-3xl'} w-[95vw] md:w-auto p-0 sm:p-2 transition-all duration-300`}>
        <DialogTitle className="text-xl font-bold text-warcrow-gold mx-4 mt-4 mb-2">
          {unitName} {t('card') || 'Card'}
        </DialogTitle>
        
        <div className="relative w-full px-2 pb-2 sm:px-4 sm:pb-4">
          <AspectRatio ratio={7/10} className="bg-black/20 overflow-hidden rounded-md">
            <img
              src={cardUrl}
              alt={`${unitName} card`}
              className={`h-full w-full object-contain ${isZoomed ? 'scale-150 transform transition-transform duration-300' : ''}`}
              onError={(e) => {
                console.error('Image load error:', cardUrl);
                const img = e.currentTarget;
                img.onerror = null; // Prevent infinite error loop
                img.style.display = 'none';
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
