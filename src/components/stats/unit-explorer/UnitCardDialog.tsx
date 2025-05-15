
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useIsMobile } from '@/hooks/use-mobile';

interface UnitCardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  unitName: string;
  cardUrl: string;
}

const UnitCardDialog: React.FC<UnitCardDialogProps> = ({
  isOpen,
  onClose,
  cardUrl,
}) => {
  const [imageError, setImageError] = useState<boolean>(false);
  const isMobile = useIsMobile();
  
  // Reset error state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setImageError(false);
    }
  }, [isOpen]);
  
  // Generate language-specific URL if needed
  const getLanguageSpecificUrl = (url: string): string => {
    if (imageError) return url; // Don't modify if we've already had an error
    
    // If URL already has language suffix, don't modify
    if (url.includes('_sp.') || url.includes('_fr.')) {
      return url;
    }
    
    return url;
  };
  
  const finalCardUrl = getLanguageSpecificUrl(cardUrl);
  
  const getDialogSizeClasses = () => {
    if (isMobile) {
      return 'w-[95vw] max-w-[95vw] h-[85vh] max-h-[85vh]';
    }
    
    return 'w-[45vw] max-w-[45vw] h-[85vh] max-h-[85vh]';
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={`p-0 ${getDialogSizeClasses()}`}>
        <div className="relative w-full h-full">
          <AspectRatio ratio={7/10} className="bg-black/20 overflow-hidden rounded-md h-full">
            <img
              src={finalCardUrl}
              alt="Unit card"
              className="h-full w-full object-contain"
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UnitCardDialog;
