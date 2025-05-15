
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useIsMobile } from '@/hooks/use-mobile';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { DialogTitle, DialogDescription } from '@/components/ui/dialog';
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
  const { t } = useLanguage();
  
  // Reset state when dialog opens or URL changes
  useEffect(() => {
    if (isOpen) {
      setImageError(false);
      setIsLoading(true);
      console.log("Dialog opened with card URL:", cardUrl);
    }
  }, [isOpen, cardUrl]);
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className="p-0 border-warcrow-gold/30 bg-black/95 overflow-hidden"
        style={{
          width: isMobile ? '90vw' : 'auto',
          maxWidth: isMobile ? '90vw' : '600px',
          maxHeight: '90vh'
        }}
      >
        <DialogClose className="absolute right-2 top-2 z-50 rounded-full bg-black/70 p-1 text-warcrow-gold hover:bg-black/90">
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </DialogClose>
        
        <VisuallyHidden>
          <DialogTitle>{unitName} {t('unitCard')}</DialogTitle>
        </VisuallyHidden>
        
        <div className="relative flex items-center justify-center w-full">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <Loader2 className="h-8 w-8 animate-spin text-warcrow-gold/70" />
            </div>
          )}
          
          <AspectRatio ratio={7/10} className="w-full max-h-[80vh]">
            <img
              src={cardUrl}
              alt={`${unitName} ${t('unitCard')}`}
              className={`object-contain w-full h-full transition-opacity duration-200 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
              onLoad={() => {
                console.log("Image loaded successfully:", cardUrl);
                setIsLoading(false);
              }}
              onError={(e) => {
                console.error('Image load error:', cardUrl);
                setImageError(true);
                setIsLoading(false);
              }}
              style={{ display: imageError ? 'none' : 'block' }}
            />
            
            {imageError && !isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-warcrow-gold/70 text-center p-4">
                <div className="text-sm">{t('imageNotAvailable')}</div>
                <div className="text-xs opacity-70">{t('tryAgainLater')}</div>
              </div>
            )}
          </AspectRatio>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UnitCardDialog;
