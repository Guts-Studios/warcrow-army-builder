
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useIsMobile } from '@/hooks/use-mobile';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
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
  
  // Helper function to get dialog size classes based on device
  const getDialogSizeClasses = () => {
    if (isMobile) {
      // On mobile, use most of the screen width
      return 'w-[90vw] max-w-[90vw]';
    }
    // On desktop, use a responsive approach that works better
    return 'w-auto max-w-[600px]';
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className={`p-0 ${getDialogSizeClasses()} bg-black/95 border-warcrow-gold/30`} 
        aria-describedby="card-description"
      >
        <VisuallyHidden asChild>
          <DialogTitle>{unitName} Card</DialogTitle>
        </VisuallyHidden>
        
        <DialogDescription id="card-description" className="sr-only">
          {t('unitCardFor').replace('{unitName}', unitName)}
        </DialogDescription>
        
        <div className="relative flex items-center justify-center w-full h-full">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <Loader2 className="h-8 w-8 animate-spin text-warcrow-gold/70" />
            </div>
          )}
          
          <AspectRatio ratio={7/10} className="w-full">
            <img
              src={cardUrl}
              alt={`${unitName} card`}
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
