
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useIsMobile } from '@/hooks/use-mobile';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { DialogTitle } from '@/components/ui/dialog';

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
  const isMobile = useIsMobile();
  
  // Reset error state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setImageError(false);
    }
  }, [isOpen]);
  
  // Helper function to get dialog size classes based on device
  const getDialogSizeClasses = () => {
    // Card aspect ratio is approximately 7/10 (width/height)
    if (isMobile) {
      return 'w-[90vw] max-w-[90vw]';
    }
    return 'w-auto max-w-[80vh]';
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={`p-0 ${getDialogSizeClasses()} bg-black/95 border-warcrow-gold/30`}>
        {/* Adding a visually hidden title for accessibility */}
        <VisuallyHidden asChild>
          <DialogTitle>{unitName} Card</DialogTitle>
        </VisuallyHidden>
        
        <div className="flex items-center justify-center w-full h-full">
          <AspectRatio ratio={7/10} className="w-full h-full">
            <img
              src={cardUrl}
              alt={`${unitName} card`}
              className="object-contain w-full h-full"
              onError={(e) => {
                console.error('Image load error:', cardUrl);
                setImageError(true);
                const img = e.currentTarget;
                img.onerror = null; // Prevent infinite error loop
                img.style.display = 'none';
              }}
            />
            {imageError && (
              <div className="absolute inset-0 flex items-center justify-center text-warcrow-gold/70 text-sm">
                Card image not available
              </div>
            )}
          </AspectRatio>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UnitCardDialog;
