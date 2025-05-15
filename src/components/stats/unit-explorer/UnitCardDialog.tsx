
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
    // Card aspect ratio is approximately 7/10 (width/height)
    // Adjust size based on device to maximize visibility while maintaining aspect ratio
    if (isMobile) {
      return 'w-[90vw] max-w-[90vw]';
    }
    
    return 'w-auto max-w-[80vh]';
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={`p-0 ${getDialogSizeClasses()} bg-black/95 border-warcrow-gold/30`}>
        <div className="flex items-center justify-center w-full h-full">
          <AspectRatio ratio={7/10} className="w-full h-full">
            <img
              src={finalCardUrl}
              alt="Unit card"
              className="object-contain w-full h-full"
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
