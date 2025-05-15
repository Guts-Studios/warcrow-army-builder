
import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { AspectRatio } from '@/components/ui/aspect-ratio';
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
  const { t } = useLanguage();
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl w-[95vw] p-1 sm:p-2 md:p-6">
        <DialogTitle className="text-xl font-bold text-warcrow-gold mb-2">
          {unitName} {t('card') || 'Card'}
        </DialogTitle>
        
        <div className="relative w-full">
          <AspectRatio ratio={7/10} className="bg-black/20 overflow-hidden rounded-md">
            <img
              src={cardUrl}
              alt={`${unitName} card`}
              className="h-full w-full object-contain"
              onError={(e) => {
                console.error('Image load error:', cardUrl);
                const img = e.currentTarget;
                img.onerror = null; // Prevent infinite error loop
                img.style.display = 'none';
              }}
            />
          </AspectRatio>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UnitCardDialog;
